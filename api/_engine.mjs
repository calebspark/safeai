// SafeAI · AI risk assessment engine
// Calls Claude to perform the actual risk assessment and return structured JSON.
// Shared by the Vercel function (api/assess.js) and the local dev server (server.mjs).
// The API key is read from the environment and never sent to the browser.

const MODEL = process.env.SAFEAI_MODEL || 'claude-sonnet-5';

// ---- Prescribed scoring rubric ------------------------------------------
// The model only RATES each driver Low/Medium/High. The score is arithmetic:
//   riskIndex = Σ weight(driver) × points(level), points Low=0 Medium=0.5 High=1
// and the tier is read off fixed bands. The server recomputes both and
// overwrites whatever the model returned, so the rubric always holds.
// Re-weighted 2026-07-28 when data source became its own question. Total is
// still 100, so the bands and the gauge are unchanged.
export const DRIVER_WEIGHTS = {
  'Data sensitivity': 22,
  'Use-case impact': 23,
  'Autonomy': 20,
  'Regulated industry': 14,
  'Deployment exposure': 10,
  'Data source': 6,
  'Role': 5,
};
const DRIVER_LABELS = Object.keys(DRIVER_WEIGHTS);
const LEVEL_POINTS = { Low: 0, Medium: 0.5, High: 1 };
// Bands match the schema hint and the frontend gauge arcs.
const TIER_BANDS = [
  { max: 25, tier: 1, name: 'Low risk' },
  { max: 50, tier: 2, name: 'Moderate risk' },
  { max: 78, tier: 3, name: 'High risk' },
  { max: 100, tier: 4, name: 'Severe risk' },
];

function scoreFromDrivers(drivers) {
  const contributions = [];
  let index = 0;
  for (const label of DRIVER_LABELS) {
    const d = (drivers || []).find((x) => x && x.label === label);
    const level = d && LEVEL_POINTS[d.level] != null ? d.level : null;
    if (!level) return null; // malformed drivers: caller keeps model values
    const pts = DRIVER_WEIGHTS[label] * LEVEL_POINTS[level];
    contributions.push({ label, level, weight: DRIVER_WEIGHTS[label], points: pts });
    index += pts;
  }
  index = Math.round(index);
  const band = TIER_BANDS.find((b) => index <= b.max) || TIER_BANDS[3];
  return { index, tier: band.tier, tierName: band.name, contributions };
}

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
        type: 'array', minItems: 7, maxItems: 7,
        description: 'Exactly one entry per driver, using the seven canonical labels. These ratings ARE the score: the server computes the risk index and tier from them.',
        items: {
          type: 'object', additionalProperties: false, required: ['label', 'level', 'note'],
          properties: {
            label: { type: 'string', enum: ['Data sensitivity', 'Use-case impact', 'Autonomy', 'Regulated industry', 'Deployment exposure', 'Data source', 'Role'] },
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

Scoring mechanism (prescribed, follow it exactly):
1. Rate each of the seven drivers Low, Medium, or High, using exactly these labels: Data sensitivity, Use-case impact, Autonomy, Regulated industry, Deployment exposure, Data source, Role.
   - Data sensitivity: read it off the stated tier. Low = Public / low sensitivity; Medium = Internal / medium sensitivity; High = Confidential / high sensitivity, or Restricted / regulated (PII, PHI, HIPAA, GDPR).
   - Use-case impact: Low = drafting or summarising with human output review; Medium = customer-facing answers or operational decisions with oversight; High = consequential decisions about people, money, safety, or eligibility. Judge the severity and reversibility of the actions yourself, from the use case, the autonomy level and the capability level. Do not expect the profile to state a severity tier: producing that tier is the point of this assessment.
   - Autonomy: read it off the stated autonomy level and capability level together. Low = autonomy Level 0 or 1, or capability Level 1. Medium = autonomy Level 2, or capability Level 2 or 3. High = autonomy Level 3, 4 or 5, or capability Level 4 or 5, because the agent then acts or coordinates other agents without per-case review.
   - Regulated industry: rate from the SSIC 2025 section given in the profile. High = L (Financial and Insurance), R (Health and Social Services), P (Public Administration and Defence). Medium = D (Electricity and Gas), E (Water and Waste), H (Transportation and Storage), Q (Education), and K (Telecommunications and Computing) where telecoms licensing applies. Low = otherwise. If the industry is free text rather than a section, judge it against the same idea.
   - Deployment exposure: rate from the hosting model. Low = self-hosted on private infrastructure, internal users only; Medium = hybrid, or a managed platform with vendor access; High = third-party SaaS, serverless platforms holding regulated data, public endpoints, or edge devices.
   - Data source: Low = a single curated store the organisation controls, such as internal documents or its own database; Medium = several sources, or SaaS and line-of-business systems reached through APIs; High = agent state and memory that persists across sessions, or any source the organisation does not control, because both widen what an attacker can reach or poison.
   - Role: rate how much the stated role amplifies blast radius (a decision-maker deploying org-wide is High; an individual contributor experimenting is Low).
2. The risk index is arithmetic, not judgement: riskIndex = sum over drivers of weight x points, where points are Low 0, Medium 0.5, High 1, and weights are Data sensitivity 22, Use-case impact 23, Autonomy 20, Regulated industry 14, Deployment exposure 10, Data source 6, Role 5.
3. The tier is read off the index: 0-25 Tier 1 Low, 26-50 Tier 2 Moderate, 51-78 Tier 3 High, 79-100 Tier 4 Severe. Do not pick a tier first and back-fill; the drivers determine everything. The server recomputes the index and tier from your driver ratings and overrides any mismatch, so your ratings are the assessment.

Write the rationale as a reverse explanation of that chain: name the driver ratings that dominate the score and what in the profile made them so (e.g. which drivers are High and why). Do NOT state a numeric index or tier in the rationale; the server computes those from your ratings and displays them alongside. Choose scenarios that genuinely fit this use case (e.g. GenAI and conversational agents face prompt injection; predictive and vision models face data poisoning and bias; autonomous or agentic systems face unsafe-action risk; any sensitive data faces exfiltration; public endpoints face denial of service). For controls, mark an item Required when it is expected at this computed tier and Recommended when it is good practice but not mandatory at this tier, so a Low-risk case has few Required items and a Severe case has many.

Be succinct and direct throughout. Every note, mitigation, and the rationale should be a short phrase or one tight sentence. No filler, no hedging, no marketing language, no restating the inputs. Practitioners read this, so lead with the substance.

Use case profile:
- Industry: ${p('industry')}
- Role / responsibility: ${p('role')}
- AI system / use case type: ${p('usecase')}
- Autonomy level: ${p('autonomy')}
- Data source: ${p('dataSource')}
- Data sensitivity: ${p('dataSensitivity')}
- Agent capability level: ${p('capability')}
- Infrastructure hosting model: ${p('hosting')}

Write in plain, factual language. No em dashes anywhere. Return only via the tool.`;
}

// Whitelist the eight known fields and cap each to a sane length, so a caller
// cannot inflate the prompt (and the Anthropic bill) with oversized input or
// smuggle in extra keys. Unknown keys are dropped; values are coerced to string.
//
// Industry gets a higher cap because SSIC 2025 section K's official title is
// 121 characters. At the old flat 120 it was silently truncated mid-word, which
// produces a subtly wrong assessment rather than a visible error. Industry
// values come from a fixed list, so a higher cap is not an abuse vector.
// `data`, `deploy` and `governance` are retired: data split into source and
// sensitivity, deployment split into capability and hosting, and the severity
// tier is now an output of the assessment rather than something the visitor
// declares. Old keys are dropped rather than mapped, because a stale client
// sending them would otherwise get a half-populated profile.
const PROFILE_FIELDS = [
  'industry', 'role', 'usecase', 'autonomy',
  'dataSource', 'dataSensitivity', 'capability', 'hosting',
];
const DEFAULT_CAP = 120;
export const FIELD_CAPS = { industry: 200 };

export function sanitizeProfile(profile) {
  const out = {};
  if (profile && typeof profile === 'object') {
    for (const k of PROFILE_FIELDS) {
      if (profile[k] != null) {
        out[k] = String(profile[k]).slice(0, FIELD_CAPS[k] || DEFAULT_CAP);
      }
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
  // Enforce the prescribed rubric: recompute index and tier from the driver
  // ratings and overwrite the model's values. The breakdown ships to the
  // client so the page can show users exactly how the score was derived.
  const scored = scoreFromDrivers(d.drivers);
  if (scored) {
    d.riskIndex = scored.index;
    d.tier = scored.tier;
    d.tierName = scored.tierName;
    d.scoring = {
      contributions: scored.contributions,
      formula: 'riskIndex = sum(weight x points), points: Low 0, Medium 0.5, High 1',
      bands: [
        { max: 25, tier: 1, name: 'Low risk' },
        { max: 50, tier: 2, name: 'Moderate risk' },
        { max: 78, tier: 3, name: 'High risk' },
        { max: 100, tier: 4, name: 'Severe risk' },
      ],
    };
  }
  return { ok: true, data: d };
}
