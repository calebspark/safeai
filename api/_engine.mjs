// SafeAI · AI risk assessment engine
// Calls Claude to perform the actual risk assessment and return structured JSON.
// Shared by the Vercel function (api/assess.js) and the local dev server (server.mjs).
// The API key is read from the environment and never sent to the browser.

const MODEL = process.env.SAFEAI_MODEL || 'claude-sonnet-5';

const TOOL = {
  name: 'return_assessment',
  description: 'Return the completed AI risk assessment for the given use-case profile.',
  input_schema: {
    type: 'object',
    additionalProperties: false,
    required: ['tier', 'tierName', 'riskIndex', 'rationale', 'drivers', 'scenarios', 'controls'],
    properties: {
      tier: { type: 'integer', minimum: 1, maximum: 4, description: '1 Low, 2 Moderate, 3 High, 4 Severe/Unacceptable' },
      tierName: { type: 'string', enum: ['Low risk', 'Moderate risk', 'High risk', 'Severe risk'] },
      riskIndex: { type: 'integer', minimum: 0, maximum: 100, description: 'Overall risk index, consistent with the tier (Low ~0-25, Moderate ~26-50, High ~51-78, Severe ~79-100).' },
      rationale: { type: 'string', description: 'At most 2 tight sentences on why this use case lands at this tier. State the driving factors directly. No preamble, no restating the profile, no filler, no headings, no bullets, no em dashes.' },
      drivers: {
        type: 'array', minItems: 5, maxItems: 6,
        description: 'One entry per input field, rating how much it pushes risk up.',
        items: {
          type: 'object', additionalProperties: false, required: ['label', 'level', 'note'],
          properties: {
            label: { type: 'string', description: 'e.g. Data sensitivity, Use-case impact, Autonomy, Regulated industry, Deployment exposure, Role' },
            level: { type: 'string', enum: ['Low', 'Medium', 'High'] },
            note: { type: 'string', description: 'A few words on why.' },
          },
        },
      },
      scenarios: {
        type: 'array', minItems: 2, maxItems: 4,
        description: 'The most relevant risk scenarios for this profile, CSA companion-guide style. Keep notes to one short sentence each.',
        items: {
          type: 'object', additionalProperties: false,
          required: ['scenario', 'impactType', 'impactNote', 'likelihood', 'likelihoodNote', 'mitigation', 'initialLevel', 'residualLevel'],
          properties: {
            scenario: { type: 'string' },
            impactType: { type: 'string', description: 'e.g. Confidentiality, Integrity, Availability, Safety, Fairness' },
            impactNote: { type: 'string' },
            likelihood: { type: 'string', enum: ['Low', 'Medium', 'High'] },
            likelihoodNote: { type: 'string' },
            mitigation: { type: 'string' },
            initialLevel: { type: 'string', enum: ['Low', 'Medium', 'High', 'Severe'] },
            residualLevel: { type: 'string', enum: ['Low', 'Medium', 'High', 'Severe'] },
          },
        },
      },
      controls: {
        type: 'array', minItems: 5, maxItems: 5,
        description: 'The five governance areas, each with a checklist scaled to this tier.',
        items: {
          type: 'object', additionalProperties: false, required: ['category', 'items'],
          properties: {
            category: {
              type: 'string',
              enum: ['Cybersecurity', 'Data protection & privacy', 'IT architecture & infrastructure', 'User access control', 'AI governance'],
            },
            items: {
              type: 'array', minItems: 3, maxItems: 5,
              items: {
                type: 'object', additionalProperties: false, required: ['text', 'priority'],
                properties: {
                  text: { type: 'string' },
                  priority: { type: 'string', enum: ['Required', 'Recommended'], description: 'Required if this control is expected AT THIS TIER; Recommended if it is good practice but not mandatory here.' },
                },
              },
            },
          },
        },
      },
    },
  },
};

function buildPrompt(profile) {
  const p = (k) => (profile && profile[k] ? String(profile[k]) : 'not specified');
  return `You are an AI governance analyst for SafeAI (CPI), Singapore. Perform an AI risk assessment for the use case below and return it via the return_assessment tool.

Anchor your judgement in these frameworks:
- MindForge AI Risk Management: risk appetite, risk identification, risk assessment (you are doing these three steps).
- CSA / IMDA Guidelines and Companion Guide on Securing AI Systems: attack scenarios and tabulated controls across the AI lifecycle.
- A four-tier model: Tier 1 Low (e.g. internal summarising of public docs, no PII), Tier 2 Moderate (e.g. general FAQ chatbot, internal code generation), Tier 3 High (e.g. automated CV screening, lending decisions, confidential IP access), Tier 4 Severe/Unacceptable (e.g. autonomous medical diagnosis, critical infrastructure control).

Scoring logic: weigh data sensitivity, use-case impact, and system autonomy as the primary drivers, then adjust for regulated industry (Healthcare, Finance, Public Sector are stricter) and deployment exposure (third-party SaaS and edge devices increase exposure). Higher autonomy raises the risk multiplier sharply. PHI or PII under high autonomy or automated decisions should land in the top tiers.

Assess each of these drivers and reflect them in the "drivers" array. Choose scenarios that genuinely fit this use case (e.g. GenAI and conversational agents face prompt injection; predictive and vision models face data poisoning and bias; autonomous or agentic systems face unsafe-action risk; any sensitive data faces exfiltration; public endpoints face denial of service). For controls, mark an item Required when it is expected at this computed tier and Recommended when it is good practice but not mandatory at this tier, so a Low-risk case has few Required items and a Severe case has many.

Be succinct and direct throughout. Every note, mitigation, and the rationale should be a short phrase or one tight sentence. No filler, no hedging, no marketing language, no restating the inputs. Practitioners read this, so lead with the substance.

Use case profile:
- Industry: ${p('industry')}
- Role / responsibility: ${p('role')}
- AI system / use case type: ${p('usecase')}
- Autonomy level: ${p('autonomy')}
- Data source & sensitivity: ${p('data')}
- Deployment model: ${p('deploy')}

Write in plain, factual language. No em dashes anywhere. Return only via the tool.`;
}

// Whitelist the six known fields and cap each to a sane length, so a caller
// cannot inflate the prompt (and the Anthropic bill) with oversized input or
// smuggle in extra keys. Unknown keys are dropped; values are coerced to string.
const PROFILE_FIELDS = ['industry', 'role', 'usecase', 'autonomy', 'data', 'deploy'];
function sanitizeProfile(profile) {
  const out = {};
  if (profile && typeof profile === 'object') {
    for (const k of PROFILE_FIELDS) {
      if (profile[k] != null) out[k] = String(profile[k]).slice(0, 120);
    }
  }
  return out;
}

// Runs the assessment. Returns { ok:true, data } or { ok:false, status, reason, detail }.
export async function assess(profile) {
  profile = sanitizeProfile(profile);
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { ok: false, status: 500, reason: 'no_key', detail: 'ANTHROPIC_API_KEY is not configured on the server.' };

  let r;
  try {
    r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 5000,
        tools: [TOOL],
        tool_choice: { type: 'tool', name: 'return_assessment' },
        messages: [{ role: 'user', content: buildPrompt(profile) }],
      }),
    });
  } catch (err) {
    return { ok: false, status: 502, reason: 'network', detail: String(err).slice(0, 300) };
  }

  if (!r.ok) {
    const detail = await r.text().catch(() => '');
    return { ok: false, status: r.status, reason: 'upstream', detail: detail.slice(0, 500) };
  }

  const body = await r.json();
  const block = (body.content || []).find((b) => b.type === 'tool_use' && b.name === 'return_assessment');
  if (!block || !block.input) {
    return { ok: false, status: 502, reason: 'no_tool_use', detail: 'Model did not return a structured assessment.' };
  }
  const d = block.input;
  if (body.stop_reason === 'max_tokens' || !Array.isArray(d.scenarios) || !d.scenarios.length || !Array.isArray(d.controls) || !d.controls.length) {
    return { ok: false, status: 502, reason: 'incomplete', detail: 'The assessment came back incomplete (response was cut off). Please reassess.' };
  }
  return { ok: true, data: d };
}
