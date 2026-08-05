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
export const SCALE = [
  { id: 'na',      label: 'Not applicable',        points: null, desc: 'This principle does not apply to how we use generative AI.' },
  { id: 'none',    label: 'Not implemented',       points: 0,    desc: 'Nothing is in place today.' },
  { id: 'partial', label: 'Partially implemented', points: 0.5,  desc: 'Some of it is in place, or it is done informally and not documented.' },
  { id: 'full',    label: 'Fully implemented',     points: 1,    desc: 'In place, documented, and we could show the evidence to an auditor.' },
];

export const SCALE_POINTS = Object.fromEntries(SCALE.map(s => [s.id, s.points]));

// One question per principle, in framework order. `outcomes` names the
// framework outcomes each question condenses, so a reviewer can trace any
// question back to the source document.
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
    question: 'Can you explain what drove a given output, and did explainability count when you chose the model, for example preferring open weights or an interpretable approach where the use case allowed it?',
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
    question: 'Have you defined what fairness means for this use case, picked the metrics and sensitive attributes to match, tested output for bias against those groups, and given people a way to flag a discriminatory result?',
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
    question: 'Have you considered the wider effects of the system on the people it touches, on your workforce and on the environment, including compute and energy use, and recorded the benefits it is meant to deliver?',
    evidence: 'A documented statement of intended benefit, an impact consideration for affected groups and staff, and any measure taken on energy or compute footprint.',
    outcomes: '11.1, 11.2',
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

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
    if (pick !== 'full') gaps.push({ ...q, answer: pick });
  }

  // Not implemented first: those are the open holes, partials are half closed.
  gaps.sort((x, y) => (x.answer === y.answer ? x.n - y.n : x.answer === 'none' ? -1 : 1));

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
