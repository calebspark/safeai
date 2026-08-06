// SafeAI - Gen AI governance readiness checklist.
//
// Source: IMDA and AI Verify Foundation, "AI Verify Testing Framework for
// Traditional and Generative AI". The framework assesses an AI system against
// 11 internationally recognised AI governance principles, each broken into
// outcomes, process checks and required evidence.
//
// The full framework runs to 118 pages and well over a hundred process checks,
// which nobody fills in on a website. This is a self-assessment: one question
// per principle, written to cover that principle's most consequential outcomes
// for generative AI, and answered on a four point compliance scale. The page
// links to the full document for anyone who needs the complete checklist.
//
// Scores entirely in the browser, so this section keeps working when the
// Anthropic key is absent or upstream is down.

export const SOURCE = {
  title: 'AI Verify Testing Framework for Traditional and Generative AI',
  owner: 'IMDA and AI Verify Foundation',
  url: 'https://aiverifyfoundation.sg/what-is-ai-verify/',
  note: 'All 11 principles, outcomes and process checks below are drawn from that framework. Question wording is condensed by SafeAI; the framework is the authority.',
};

// The four point scale. `points` is the share of the question earned;
// `na` is excluded from the denominator so an irrelevant principle neither
// helps nor hurts the score.
//
// The labels answer the question as asked. Every question is close ended, so
// the answer is Yes, Partially done, No, or Not applicable, rather than the
// implementation states the labels used to carry. The ids are unchanged, so
// saved answers and the scoring below still line up.
// Order follows the answer, strongest first, because the question is now a
// yes or no question and Yes is what it asks about.
export const SCALE = [
  { id: 'full',    label: 'Yes',             points: 1,    desc: 'In place, documented, and we could show the evidence to an auditor.' },
  { id: 'partial', label: 'Partially done',  points: 0.5,  desc: 'Some of it is in place, or it is done informally and not documented.' },
  { id: 'none',    label: 'No',              points: 0,    desc: 'Nothing is in place today.' },
  { id: 'na',      label: 'Not applicable',  points: null, desc: 'This principle does not apply to how we use generative AI.' },
];

export const SCALE_POINTS = Object.fromEntries(SCALE.map(s => [s.id, s.points]));

// One question per principle, in framework order. `outcomes` names the
// framework outcomes each question condenses, so a reviewer can trace any
// question back to the source document.
// Ranking and remediation live in PRIORITY below, deliberately kept out of
// these objects: everything here is the framework's, everything there is
// SafeAI's.
export const QUESTIONS = [
  {
    id: 'transparency',
    n: 1,
    principle: 'Transparency',
    question: 'Do you tell end users and affected parties that generative AI is being used, including its purpose, its limitations and the risks of its output, in language they can act on?',
    evidence: 'An in-house communication policy, the user-facing notice itself, and a route for people to report an adverse outcome.',
    outcomes: '1.1, 1.2, 1.5, 1.7',
  },
  {
    id: 'explainability',
    n: 2,
    principle: 'Explainability',
    question: 'Do you have a documented way to explain what drove a given output, and did you weigh explainability when choosing the model, for example preferring open weights or an interpretable approach where the use case allowed it?',
    evidence: 'Documented explainability method and its results, plus the rationale recorded at model selection.',
    outcomes: '2.1, 2.2',
  },
  {
    id: 'reproducibility',
    n: 3,
    principle: 'Repeatability and reproducibility',
    question: 'Do you record model provenance, meaning versions, prompts, configurations and data transformations, and log inputs and outputs, so that a specific result can be traced and reproduced later?',
    evidence: 'Version control and model cards, prompt and retrieval logs, and a documented check that the same input gives a consistent output.',
    outcomes: '3.1, 3.4, 3.6, 3.11',
  },
  {
    id: 'safety',
    n: 4,
    principle: 'Safety',
    question: 'Do you test regularly for unsafe output such as hallucination, toxicity and content that breaks the law or your own policies, and do you have a policy on content provenance for what the system generates?',
    evidence: 'Red team and evaluation results held over time, a documented risk tolerance, and a labelling or watermarking policy for AI-generated content.',
    outcomes: '4.1, 4.3, 4.8, 4.9',
  },
  {
    id: 'security',
    n: 5,
    principle: 'Security',
    question: 'Do you run security risk assessments across the AI supply chain, models, weights, plugins and third-party APIs, secure the development and deployment environment, and cover AI-specific failures such as prompt injection and data leakage in incident procedures?',
    evidence: 'Security risk assessment, an asset inventory covering models and data, incident runbooks naming AI failure modes, and a vulnerability disclosure route.',
    outcomes: '5.2, 5.3, 5.6, 5.8, 5.13',
  },
  {
    id: 'robustness',
    n: 6,
    principle: 'Robustness',
    question: 'Do you measure performance against a defined baseline, including behaviour under unexpected or adversarial input, and re-test when the model, the prompts or the retrieval sources change?',
    evidence: 'Performance test results over time, data quality measures, and a documented trigger for re-review after a change.',
    outcomes: '6.1, 6.2, 6.5, 6.7',
  },
  {
    id: 'fairness',
    n: 7,
    principle: 'Fairness',
    question: 'Do you have a definition of fairness for this use case, with metrics and sensitive attributes picked to match, bias testing of the output against those groups, and a way for people to flag a discriminatory result?',
    evidence: 'A documented fairness definition and metric selection, the list of sensitive attributes, bias test results, and a working flagging mechanism.',
    outcomes: '7.1, 7.5, 7.6, 7.9',
  },
  {
    id: 'dataGovernance',
    n: 8,
    principle: 'Data governance',
    question: 'Do you know and document the lineage, quality and licensing of the data used for training, fine-tuning, retrieval and prompts, and does that use comply with data protection law and third-party rights?',
    evidence: 'Data lineage records, data quality measures, a legal basis for each data source, and third-party terms covering model and content use.',
    outcomes: '8.1, 8.2, 8.3, 8.5',
  },
  {
    id: 'accountability',
    n: 9,
    principle: 'Accountability',
    question: 'Is there an internal AI policy with named roles and responsibilities across the lifecycle, and do you assess the suitability and limits of third-party black box models before adopting them?',
    evidence: 'The AI policy itself, a responsibility matrix or committee terms of reference, a vendor assessment, and an inventory of AI systems in use.',
    outcomes: '9.1, 9.5, 9.9, 9.12',
  },
  {
    id: 'oversight',
    n: 10,
    principle: 'Human agency and oversight',
    question: 'Is there a human review before a generative AI system goes into production, and at set intervals after, held by someone with the authority and the means to override, roll back or shut it down?',
    evidence: 'A pre-production review record, a defined re-evaluation frequency, and evidence that reviewers are trained and given the information to intervene.',
    outcomes: '10.1, 10.2, 10.4, 10.5',
  },
  {
    id: 'wellbeing',
    n: 11,
    principle: 'Inclusive growth, societal and environmental well-being',
    question: 'Do you have a record of the wider effects of the system on the people it touches, on your workforce and on the environment, including compute and energy use, alongside the benefits it is meant to deliver?',
    evidence: 'A documented statement of intended benefit, an impact consideration for affected groups and staff, and any measure taken on energy or compute footprint.',
    outcomes: '11.1, 11.2',
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

// --- SafeAI's ordering of the work, not the framework's ------------------
//
// The framework does not rank its principles, and deliberately so: all eleven
// are expected of a governed system. But a team looking at eleven gaps has to
// start somewhere, and "start at the top" would order the work by the
// framework's numbering, which is thematic rather than urgent.
//
// `rank` is by exposure: how quickly a gap there becomes unlawful processing,
// a breach, a harmed person, or an incident nobody can reconstruct. Rank 1 is
// the most exposed. `firstStep` is the smallest concrete thing that moves an
// answer off No, which is not the same as `evidence`, the thing an auditor
// eventually asks for. `because` says why the rank is where it is, so a
// reviewer can argue with it rather than just inherit it.
export const PRIORITY = {
  dataGovernance: {
    rank: 1,
    because: 'A gap here is usually already unlawful. Data used without a legal basis or outside its licence is a breach on the day it happens, not when something goes wrong.',
    firstStep: 'List every data source the system touches for training, fine-tuning, retrieval and prompts, and record the legal basis and the licence for each one.',
  },
  security: {
    rank: 2,
    because: 'The only principle with an adversary behind it. Prompt injection and leakage are exploited deliberately, so the gap is used rather than merely waited on.',
    firstStep: 'Add prompt injection and data leakage to the incident runbook you already have, and inventory every model, plugin and third-party API the system can reach.',
  },
  safety: {
    rank: 3,
    because: 'Unsafe output reaches people directly. Untested generation is the failure most likely to be seen outside the organisation first.',
    firstStep: 'Run one structured red team pass against the live prompts for hallucination, toxicity and policy-breaking output, and keep the results with a date on them.',
  },
  oversight: {
    rank: 4,
    because: 'Human review is the control that compensates for every other gap on this list. Without it, nothing else here has a backstop.',
    firstStep: 'Name who can pause or roll back this system, confirm they hold the access to actually do it, and put the next review in a calendar.',
  },
  transparency: {
    rank: 5,
    because: 'People cannot question, correct or escalate an output they were never told was generated. It also carries direct regulatory expectation.',
    firstStep: 'Publish the user-facing notice: what the system does, what it cannot do, and who to contact about a bad output. One shipped paragraph beats a policy in draft.',
  },
  fairness: {
    rank: 6,
    because: 'Where output affects people, a bias gap is both a harm and a legal exposure, and it is invisible until somebody measures it.',
    firstStep: 'Write down what fairness means for this use case and which attributes it turns on, then test the output against those groups.',
  },
  accountability: {
    rank: 7,
    because: 'Not a harm on its own, but nothing above it gets fixed without a named owner. It is the gap that keeps the other gaps open.',
    firstStep: 'Name the person accountable for this system and the person who reviews it, in writing, and add the system to an inventory.',
  },
  reproducibility: {
    rank: 8,
    because: 'Nothing fails today because of it. When something does fail, an unlogged system cannot be investigated at all.',
    firstStep: 'Log prompt, model version, retrieved sources and output for every call, starting now. The value is entirely in already having the logs on the day you need them.',
  },
  robustness: {
    rank: 9,
    because: 'Degradation is silent. A model, prompt or retrieval change moves behaviour with nothing to notice it against.',
    firstStep: 'Fix a small set of representative inputs as a baseline and re-run it whenever the model, the prompts or the retrieval sources change.',
  },
  explainability: {
    rank: 10,
    because: 'Matters most for contesting a decision, so it usually follows fairness and transparency rather than leading them.',
    firstStep: 'Record why this model was chosen over the alternatives and what was given up on explainability, while the reasoning is still recoverable.',
  },
  wellbeing: {
    rank: 11,
    because: 'Real, and the slowest to bite. It is also the one most often written after the fact, which is why a baseline now is worth having.',
    firstStep: 'Write a short statement of the benefit this system is meant to deliver and who it affects, so later impact claims have something to sit against.',
  },
};

// A principle that is partly in place is counted as half a gap, so it sorts
// roughly where the same principle would sit if it were two ranks weaker. That
// keeps a No on data governance above a partial on data governance, and a
// partial on security above a No on well-being, which is the order a
// practitioner would actually work in.
export function urgencyOf(id, answer) {
  const rank = (PRIORITY[id] || {}).rank || 99;
  return answer === 'partial' ? rank * 2 : rank;
}

// Higher is better here, unlike the risk gauge. Bands are named for a state of
// practice rather than a grade, because this is a self-assessment.
export const BANDS = [
  { id: 'foundational', name: 'Foundational', min: 0,  max: 39,  colour: 'var(--t4)',
    text: 'Most principles have little in place. Start with the ones that carry legal exposure: data governance, security and transparency.' },
  { id: 'developing',   name: 'Developing',   min: 40, max: 64,  colour: 'var(--t3)',
    text: 'Practice exists but is uneven and largely undocumented. The gap now is evidence, not intent, so write down what you already do.' },
  { id: 'established',  name: 'Established',  min: 65, max: 84,  colour: 'var(--t2)',
    text: 'Governance is real and mostly documented. Close the remaining partials and set a review interval so it does not drift.' },
  { id: 'mature',       name: 'Mature',       min: 85, max: 100, colour: 'var(--t1)',
    text: 'You could evidence most of the framework to an auditor. Keep it current as models, prompts and retrieval sources change.' },
];

export function bandFor(score) {
  return BANDS.find(b => score >= b.min && score <= b.max) || BANDS[0];
}

/**
 * Score a set of answers.
 * @param {Object} answers map of question id to scale id
 * @returns {{score:number|null, band:Object|null, answered:number, applicable:number,
 *            counts:Object, gaps:Array, complete:boolean}}
 *
 * `score` is the percentage of applicable questions met, where partial counts
 * half. It is null when every question is Not applicable, because a percentage
 * of nothing is not a readiness rating and should not be shown as one.
 */
/**
 * Why a result landed in the band it did, in the reader's own numbers.
 * @param {Object} res the return value of scoreReadiness
 * @returns {{arithmetic:string, distance:string, drivers:Array, headline:string}|null}
 *
 * The band text on its own is the same paragraph for everyone in the band. This
 * says what THIS set of answers did: the arithmetic that produced the score,
 * how far the next band is, and which specific principles cost the most.
 */
export function explainReadiness(res) {
  if (!res || res.score === null || !res.band) return null;
  const c = res.counts;
  const full = c.full;
  const half = c.partial;
  const open = c.none;

  const parts = [`${full} of ${res.applicable} applicable principle${res.applicable === 1 ? '' : 's'} answered yes`];
  if (half) parts.push(`${half} partially done, counting half`);
  if (open) parts.push(`${open} with nothing in place, counting nothing`);
  const arithmetic = `${parts.join(', ')}. That is ${res.score} of 100, inside the ${res.band.name} band (${res.band.min} to ${res.band.max}).`;

  // Where the next band starts, converted into principles, because a principle
  // is the unit the reader can act on and a point is not.
  const next = BANDS.find(b => b.min > res.band.max);
  const per = 100 / res.applicable;
  let distance;
  if (!next) {
    distance = 'This is the top band. The work now is keeping it true as models, prompts and retrieval sources change.';
  } else {
    const need = next.min - res.score;
    const nFull = Math.ceil(need / per);
    const nHalf = Math.ceil(need / (per / 2));
    distance = `${next.name} starts at ${next.min}, which is ${need} point${need === 1 ? '' : 's'} away: ${nFull} more principle${nFull === 1 ? '' : 's'} moved from no to yes, or ${nHalf} partial${nHalf === 1 ? '' : 's'} closed.`;
  }

  // The gaps are already in urgency order, so the drivers are the top of that
  // list. Three, because a list of priorities longer than that is not one.
  const drivers = res.gaps.slice(0, 3);
  const headline = c.na
    ? c.na === 1
      ? '1 principle was marked not applicable and left out of the denominator, so it neither helps nor hurts this score.'
      : `${c.na} principles were marked not applicable and left out of the denominator, so they neither help nor hurt this score.`
    : '';

  return { arithmetic, distance, drivers, headline };
}

export function scoreReadiness(answers) {
  const a = answers || {};
  const counts = { na: 0, none: 0, partial: 0, full: 0 };
  let earned = 0;
  let applicable = 0;
  let answered = 0;
  const gaps = [];

  for (const q of QUESTIONS) {
    const pick = a[q.id];
    if (!(pick in SCALE_POINTS)) continue;
    answered += 1;
    counts[pick] += 1;
    if (pick === 'na') continue;
    applicable += 1;
    earned += SCALE_POINTS[pick];
    if (pick !== 'full') {
      gaps.push({ ...q, ...(PRIORITY[q.id] || {}), answer: pick, urgency: urgencyOf(q.id, pick) });
    }
  }

  // Most exposed first. Within the same urgency, an open hole outranks a
  // partial, and the framework's own numbering breaks any remaining tie.
  gaps.sort((x, y) =>
    x.urgency - y.urgency ||
    (x.answer === y.answer ? x.n - y.n : x.answer === 'none' ? -1 : 1));

  const score = applicable ? Math.round((earned / applicable) * 100) : null;
  return {
    score,
    band: score === null ? null : bandFor(score),
    answered,
    applicable,
    counts,
    gaps,
    complete: answered === TOTAL_QUESTIONS,
  };
}
