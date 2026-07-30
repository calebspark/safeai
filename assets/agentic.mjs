// SafeAI - Agentic AI Risk Assessment Matrix.
// Source: IMDA, "Model AI Governance Framework for Agentic AI" v1.0.
//   pp. 15-17  the two factor tables (impact, likelihood)
//   p. 18      the Dayos IT-management case study, action tiering
//
// The two branches answer different questions. Pre-deployment asks whether an
// agentic use case is suitable at all. Deployed asks how much autonomy each
// action should be granted.
//
// Scores entirely in the browser. No API call, so this section keeps working
// when the Anthropic key is absent or upstream is down.

export const SHARED_FACTOR_ID = 'externalSystems';

// --- Table 1: factors affecting impact (severity if the risk manifests) ---
export const IMPACT_FACTORS = [
  {
    id: 'domain',
    label: 'Domain and use case',
    description: 'Tolerance of error in the domain, and the number and criticality of business processes the agent supports.',
    anchors: {
      1: 'Summarising internal meetings. Errors are noticed and cost little.',
      3: 'Supports a routine business process where an error causes rework.',
      5: 'Executes financial transactions requiring a high degree of accuracy.',
    },
  },
  {
    id: 'sensitiveData',
    label: "Agent's access to sensitive data",
    description: 'Whether the agent can reach personal or confidential data. Risk increases where it has persistent memory across sessions.',
    anchors: {
      1: 'Only publicly available information.',
      3: 'Internal business data, no personal information.',
      5: 'Personal customer data, and it persists across sessions.',
    },
  },
  {
    id: SHARED_FACTOR_ID,
    label: "Agent's access to external systems",
    description: 'Whether the agent can reach systems outside your control. Appears in both IMDA tables, so this answer feeds both axes.',
    anchors: {
      1: 'Sandboxed or internal tools only.',
      3: 'A small number of vetted third-party integrations.',
      5: 'Sends data to third-party APIs, or browses the open web.',
    },
  },
  {
    id: 'scope',
    label: "Scope of the agent's actions",
    description: 'Read only versus write, and a few pre-defined tools versus a broad action space.',
    anchors: {
      1: 'Read only, from a single system.',
      3: 'Can write, but only through a few pre-defined tools.',
      5: 'Broad computer use, able to drive any user interface.',
    },
  },
  {
    id: 'reversibility',
    label: "Reversibility of the agent's actions",
    description: 'Whether changes can be undone, including downstream obligations such as entering a contract.',
    anchors: {
      1: 'Fully reversible, for example rescheduling a meeting.',
      3: 'Reversible with manual effort.',
      5: 'Irreversible, for example sending external communications or entering a sale.',
    },
  },
];

// --- Table 2: factors affecting likelihood (probability of manifesting) ---
export const LIKELIHOOD_FACTORS = [
  {
    id: 'autonomy',
    label: "Agent's level of autonomy",
    description: 'Whether the agent follows a defined procedure or defines the workflow itself.',
    anchors: {
      1: 'Given an SOP and instructed to follow it.',
      3: 'Follows a procedure but chooses between defined branches.',
      5: 'Uses its own judgement to select and execute every step.',
    },
  },
  {
    id: 'taskComplexity',
    label: 'Task complexity',
    description: 'Number of steps required and depth of analysis at each step.',
    anchors: {
      1: 'Extract key action points from a meeting transcript.',
      3: 'A multi-step task with clear success criteria.',
      5: 'Apply a nuanced policy to judgement calls, for example handling external requests for information.',
    },
  },
  {
    id: SHARED_FACTOR_ID,
    label: "Agent's access to external systems",
    description: 'Exposure to untrusted data raises the chance of prompt injection and cyberattack. Shared with the impact table.',
    anchors: {
      1: 'Internal knowledge base maintained by trusted teams.',
      3: 'A small number of vetted third-party integrations.',
      5: 'Open web access, containing untrusted data.',
    },
  },
  {
    id: 'externalParty',
    label: 'Agent provided or operated by an external party',
    description: 'How much visibility and control you have over the agent itself.',
    anchors: {
      1: 'Developed and maintained internally with full visibility.',
      3: 'Third-party model, but orchestration and tools are ours.',
      5: 'Third-party vendor agent with limited transparency into its operations and data processing.',
    },
  },
  {
    id: 'systemComplexity',
    label: 'System complexity',
    description: 'Multiple agents, feedback loops and autonomous handoff produce emergent behaviour as components interact.',
    anchors: {
      1: 'A single agent running a sequential workflow.',
      3: 'A single agent with feedback loops and retries.',
      5: 'Multiple agents deciding collectively and handing off autonomously.',
    },
  },
];

const IMPACT_IDS = IMPACT_FACTORS.map(f => f.id);
const LIKELIHOOD_IDS = LIKELIHOOD_FACTORS.map(f => f.id);

function meanOf(ids, ratings) {
  const vals = ids.map(id => Number(ratings[id]) || 0);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function scorePredeployment(ratings) {
  const impact = Math.round(meanOf(IMPACT_IDS, ratings));
  const likelihood = Math.round(meanOf(LIKELIHOOD_IDS, ratings));
  const raw = impact * likelihood;
  const tier = raw <= 6 ? 1 : raw <= 14 ? 2 : 3;
  // The gauge is three equal bands, but the tier thresholds are not equal
  // thirds of raw (1-6, 7-14, 15-25). Map raw within its tier's band so the
  // needle always sits in the band the tier text names.
  const needle = Math.round(
    tier === 1 ? ((raw - 1) / 5) * 32
    : tier === 2 ? 34 + ((raw - 7) / 7) * 32
    : 68 + ((raw - 15) / 10) * 32
  );
  return { impact, likelihood, raw, needle, tier };
}

// --- Dayos action tiering (p.18) ---
// Dayos scored each IT ticket type against severity, reversibility and
// feasibility of human oversight, and the tier dictated how much autonomy the
// agent got. "Autonomy currently granted" is our addition: it is what turns
// the exercise from a rating into a finding.

export function tierOfAction({ severity, reversibility, oversight }) {
  const base = Math.max(Number(severity) || 0, Number(reversibility) || 0);
  let tier = base <= 2 ? 1 : base === 3 ? 2 : 3;
  if ((Number(oversight) || 0) >= 4) tier = Math.min(3, tier + 1);
  return tier;
}

// Autonomy levels: 3 acts autonomously, 2 human signs off, 1 agent does not act.
export const CEILING = { 1: 3, 2: 2, 3: 1 };

export const AUTONOMY_CEILING_COPY = {
  1: 'Agent acts autonomously on a propose-confirm loop, with no engineer in the loop. Every action emits a reasoning chain and a confidence score, and a reviewer audits a cross-section biweekly.',
  2: 'Agent diagnoses and proposes, writing a diagnostic summary and a proposed fix. A qualified human signs off before anything executes.',
  3: 'Agent does not act. Reassess when safeguards such as multi-agent verification and real-time anomaly detection are validated in real environments.',
};

export function governanceGap(rows) {
  const scored = (rows || []).map(r => {
    const tier = tierOfAction(r);
    const ceiling = CEILING[tier];
    return { ...r, tier, ceiling, gap: (Number(r.granted) || 0) > ceiling };
  });
  const gaps = scored.filter(r => r.gap);
  const needle = scored.length ? Math.round((gaps.length / scored.length) * 100) : 0;
  const distribution = { 1: 0, 2: 0, 3: 0 };
  for (const r of scored) distribution[r.tier] += 1;
  return { rows: scored, gaps, needle, distribution };
}
