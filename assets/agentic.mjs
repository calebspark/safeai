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

// --- What a high rating means you can do about it ------------------------
//
// SafeAI's, not IMDA's. The framework rates the factors; it does not say which
// of them a team can move. That distinction is the useful part of a result:
// some factors are properties of the job itself and set a floor under the tier,
// and others are design decisions that can be taken back this week.
//
// `lever: true` means the rating is a choice about how the agent was built or
// wired, so lowering it is engineering work. `lever: false` means it comes with
// the use case, so the only honest responses are stronger controls around it or
// a narrower use case.
export const FACTOR_ACTIONS = {
  domain: { lever: false,
    action: 'This is what the agent is for, so it does not come down without narrowing the use case. Split the workflow and let the agent hold only the steps where an error is caught cheaply.' },
  sensitiveData: { lever: true,
    action: 'Cut what the agent can reach: field-level filtering or masking before retrieval, and clear the memory between sessions unless persistence is genuinely required.' },
  externalSystems: { lever: true,
    action: 'Put an allowlist in front of the tools, treat anything fetched from outside as untrusted input rather than instruction, and drop open web access where a vetted source will do.' },
  scope: { lever: true,
    action: 'Replace broad computer use with a small set of named tools. A defined action space is the single biggest reduction available on the impact axis.' },
  reversibility: { lever: true,
    action: 'Make the irreversible step the one a human takes. Have the agent stage the change, send, transaction or commit, and leave the final action behind a confirmation.' },
  autonomy: { lever: true,
    action: 'Give the agent a written procedure instead of an objective. Judgement at every step is what turns one bad inference into a completed action.' },
  taskComplexity: { lever: false,
    action: 'Complexity belongs to the task. Break it into shorter runs with a checkpoint between them, so a wrong turn is caught at the next boundary rather than at the end.' },
  externalParty: { lever: true,
    action: 'Get the vendor assessment done: what the agent does with your data, what it logs, and what you can turn off. If none of that is answerable, keep the agent out of the sensitive path.' },
  systemComplexity: { lever: true,
    action: 'Reduce the number of agents that can act, or make handoffs explicit and logged. Emergent behaviour is a property of the wiring, not of any one agent.' },
};

export const FACTOR_LABELS = Object.fromEntries(
  [...IMPACT_FACTORS, ...LIKELIHOOD_FACTORS].map(f => [f.id, f.label]));

export const TIER_BANDS_PRE = [
  { tier: 1, min: 1,  max: 6,  name: 'Tier 1' },
  { tier: 2, min: 7,  max: 14, name: 'Tier 2' },
  { tier: 3, min: 15, max: 25, name: 'Tier 3' },
];

/**
 * Why a pre-deployment result landed on the tier it did, and what to do first.
 * @param {Object} ratings the 1 to 5 answers, keyed by factor id
 * @param {Object} s the return value of scorePredeployment
 * @returns {{arithmetic:string, axis:string, drivers:Array, floor:Array, distance:string}}
 *
 * `drivers` are the factors rated 4 or 5, worst first, each carrying whether it
 * can be lowered and what lowering it looks like. `floor` is the subset that
 * cannot be lowered, which is what stops a team chasing a tier it cannot reach.
 */
export function explainPredeployment(ratings, s) {
  const r = ratings || {};
  const band = TIER_BANDS_PRE.find(b => b.tier === s.tier);
  const all = [...IMPACT_FACTORS, ...LIKELIHOOD_FACTORS]
    .map(f => ({
      id: f.id,
      label: f.label,
      axis: IMPACT_IDS.includes(f.id) && LIKELIHOOD_IDS.includes(f.id) ? 'both'
        : IMPACT_IDS.includes(f.id) ? 'impact' : 'likelihood',
      score: Number(r[f.id]) || 0,
      ...(FACTOR_ACTIONS[f.id] || {}),
    }))
    // A factor rated on both axes is one answer, so it appears once.
    .filter((f, i, xs) => xs.findIndex(x => x.id === f.id) === i)
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));

  const arithmetic = `Impact ${s.impact} times likelihood ${s.likelihood} is ${s.raw} of 25, which falls in ${band.name} (${band.min} to ${band.max}).`;

  const axis = s.impact === s.likelihood
    ? 'Both axes are rated the same, so neither one is carrying the tier on its own.'
    : s.impact > s.likelihood
      ? 'Impact is the higher axis: a failure here would be costly even though it is not especially likely.'
      : 'Likelihood is the higher axis: the conditions for a failure are present even though a single failure would be survivable.';

  const drivers = all.filter(f => f.score >= 4);
  const floor = drivers.filter(f => f.lever === false);

  // What the tier would be if every changeable factor were brought down to 3.
  const capped = {};
  for (const f of all) capped[f.id] = f.lever === false ? f.score : Math.min(f.score, 3);
  const best = scorePredeployment(capped);
  const distance = best.tier < s.tier
    ? `Bringing every changeable factor down to a 3 would put this at Tier ${best.tier} (${best.raw} of 25). The factors that cannot be changed are what hold the rest.`
    : `Bringing every changeable factor down to a 3 would still leave this at Tier ${best.tier}. The tier is set by what the agent is being asked to do, not by how it was wired, so the honest options are a narrower use case or stronger controls around it.`;

  return { arithmetic, axis, drivers, floor, distance, all };
}

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

// Kept here rather than in the page, so the corrective sentence below and the
// dropdown in the form cannot drift apart.
export const AUTONOMY_LABEL = {
  3: 'Acts autonomously',
  2: 'Human signs off',
  1: 'Agent does not act',
};

export const AUTONOMY_CEILING_COPY = {
  1: 'Agent acts autonomously on a propose-confirm loop, with no engineer in the loop. Every action emits a reasoning chain and a confidence score, and a reviewer audits a cross-section biweekly.',
  2: 'Agent diagnoses and proposes, writing a diagnostic summary and a proposed fix. A qualified human signs off before anything executes.',
  3: 'Agent does not act. Reassess when safeguards such as multi-agent verification and real-time anomaly detection are validated in real environments.',
};

export function governanceGap(rows) {
  const scored = (rows || []).map(r => {
    const tier = tierOfAction(r);
    const ceiling = CEILING[tier];
    const granted = Number(r.granted) || 0;
    return {
      ...r, tier, ceiling, granted,
      gap: granted > ceiling,
      // How many autonomy steps too far. Two steps means an action that should
      // not run at all is running unattended, which is a different finding from
      // one that merely skips a sign-off.
      overreach: Math.max(0, granted - ceiling),
      why: `Severity ${r.severity || 0} and irreversibility ${r.reversibility || 0}` +
        ((Number(r.oversight) || 0) >= 4 ? ', with oversight rated hard, which raises the tier by one' : '') +
        ` put this at Tier ${tier}, and Tier ${tier} permits at most "${AUTONOMY_LABEL[ceiling]}".`,
      fix: granted > ceiling
        ? `Move it from "${AUTONOMY_LABEL[granted]}" to "${AUTONOMY_LABEL[ceiling]}".`
        : '',
    };
  });
  // Worst overreach first, then the highest tier: the action running two steps
  // beyond its ceiling is the one to correct today.
  const gaps = scored.filter(r => r.gap)
    .sort((a, b) => b.overreach - a.overreach || b.tier - a.tier);
  const needle = scored.length ? Math.round((gaps.length / scored.length) * 100) : 0;
  const distribution = { 1: 0, 2: 0, 3: 0 };
  for (const r of scored) distribution[r.tier] += 1;
  return { rows: scored, gaps, needle, distribution };
}
