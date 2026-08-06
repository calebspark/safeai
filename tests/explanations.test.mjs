// The result pages now say why a score landed where it did and what to do
// first. Those sentences are generated, so the arithmetic in them has to hold
// for any set of answers, not just the ones that were on screen when they were
// written.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  QUESTIONS, PRIORITY, urgencyOf, scoreReadiness, explainReadiness,
} from '../assets/genai.mjs';
import {
  IMPACT_FACTORS, LIKELIHOOD_FACTORS, FACTOR_ACTIONS, AUTONOMY_LABEL,
  scorePredeployment, explainPredeployment, governanceGap,
} from '../assets/agentic.mjs';

// --- Gen AI readiness ----------------------------------------------------

test('every principle carries a rank and a first step', () => {
  for (const q of QUESTIONS) {
    const p = PRIORITY[q.id];
    assert.ok(p, `${q.id} has no priority entry`);
    assert.ok(p.firstStep && p.firstStep.length > 20, `${q.id} first step is not actionable`);
    assert.ok(p.because && p.because.length > 20, `${q.id} does not say why it ranks there`);
  }
});

test('the ranks are a complete ordering, 1 to 11 with no ties', () => {
  const ranks = Object.values(PRIORITY).map(p => p.rank).sort((a, b) => a - b);
  assert.deepEqual(ranks, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
});

test('a partial sits behind the same principle left open, and behind stronger principles', () => {
  assert.ok(urgencyOf('dataGovernance', 'partial') > urgencyOf('dataGovernance', 'none'));
  assert.ok(urgencyOf('security', 'partial') < urgencyOf('wellbeing', 'none'));
  assert.ok(urgencyOf('dataGovernance', 'none') < urgencyOf('security', 'none'));
});

test('gaps come back most exposed first, not in framework order', () => {
  const answers = Object.fromEntries(QUESTIONS.map(q => [q.id, 'full']));
  answers.wellbeing = 'none';        // rank 11, framework question 11
  answers.dataGovernance = 'none';   // rank 1,  framework question 8
  const r = scoreReadiness(answers);
  assert.deepEqual(r.gaps.map(g => g.id), ['dataGovernance', 'wellbeing']);
  assert.equal(r.gaps[0].firstStep, PRIORITY.dataGovernance.firstStep);
});

test('the explanation adds up to the score it explains', () => {
  const answers = Object.fromEntries(QUESTIONS.map(q => [q.id, 'full']));
  answers.security = 'none';
  answers.fairness = 'partial';
  const r = scoreReadiness(answers);
  const e = explainReadiness(r);
  // 9 yes + 1 half of 11 applicable = 9.5/11 = 86
  assert.equal(r.applicable, 11);
  assert.equal(r.score, 86);
  assert.match(e.arithmetic, /9 of 11 applicable principles answered yes/);
  assert.match(e.arithmetic, /1 partially done/);
  assert.match(e.arithmetic, /1 with nothing in place/);
  assert.match(e.arithmetic, /86 of 100/);
  assert.match(e.arithmetic, /Mature band \(85 to 100\)/);
});

test('not applicable answers are called out, since they change the denominator', () => {
  const answers = Object.fromEntries(QUESTIONS.map(q => [q.id, 'full']));
  answers.fairness = 'na';
  answers.wellbeing = 'na';
  const e = explainReadiness(scoreReadiness(answers));
  assert.match(e.headline, /2 principles were marked not applicable/);
});

test('the distance to the next band is stated in principles, and none at the top', () => {
  const answers = Object.fromEntries(QUESTIONS.map(q => [q.id, 'none']));
  const low = explainReadiness(scoreReadiness(answers));
  assert.match(low.distance, /Developing starts at 40/);
  assert.match(low.distance, /principles moved from no to yes/);

  const top = explainReadiness(scoreReadiness(
    Object.fromEntries(QUESTIONS.map(q => [q.id, 'full']))));
  assert.match(top.distance, /top band/);
});

test('an all not-applicable set has nothing to explain rather than a false zero', () => {
  const answers = Object.fromEntries(QUESTIONS.map(q => [q.id, 'na']));
  assert.equal(scoreReadiness(answers).score, null);
  assert.equal(explainReadiness(scoreReadiness(answers)), null);
});

// --- Agentic pre-deployment ---------------------------------------------

const RATINGS = {
  domain: 5, sensitiveData: 5, externalSystems: 5, scope: 5, reversibility: 5,
  autonomy: 5, taskComplexity: 5, externalParty: 5, systemComplexity: 5,
};

test('every factor says what can be done about it and whether it can move', () => {
  for (const f of [...IMPACT_FACTORS, ...LIKELIHOOD_FACTORS]) {
    const a = FACTOR_ACTIONS[f.id];
    assert.ok(a, `${f.id} has no action`);
    assert.equal(typeof a.lever, 'boolean', `${f.id} does not say whether it can move`);
    assert.ok(a.action.length > 30, `${f.id} action is not concrete`);
  }
});

test('the explanation restates the arithmetic that produced the tier', () => {
  const s = scorePredeployment(RATINGS);
  const e = explainPredeployment(RATINGS, s);
  assert.equal(s.tier, 3);
  assert.match(e.arithmetic, /Impact 5 times likelihood 5 is 25 of 25/);
  assert.match(e.arithmetic, /Tier 3 \(15 to 25\)/);
});

test('the shared factor is listed once, not once per axis', () => {
  const e = explainPredeployment(RATINGS, scorePredeployment(RATINGS));
  const shared = e.all.filter(f => f.id === 'externalSystems');
  assert.equal(shared.length, 1);
  assert.equal(shared[0].axis, 'both');
});

test('drivers are the 4s and 5s, worst first, and the floor is what cannot move', () => {
  const ratings = { ...RATINGS, scope: 1, autonomy: 1, systemComplexity: 1, externalParty: 1, sensitiveData: 1, externalSystems: 1 };
  const e = explainPredeployment(ratings, scorePredeployment(ratings));
  assert.deepEqual(e.drivers.map(d => d.id).sort(), ['domain', 'reversibility', 'taskComplexity']);
  assert.ok(e.drivers.every(d => d.score >= 4));
  // domain and taskComplexity come with the job; reversibility is a design choice.
  assert.deepEqual(e.floor.map(d => d.id).sort(), ['domain', 'taskComplexity']);
});

test('the distance says so when the tier cannot be engineered down', () => {
  // Everything wired as safely as it can be, but the job itself is severe.
  const ratings = {
    domain: 5, taskComplexity: 5,
    sensitiveData: 1, externalSystems: 1, scope: 1, reversibility: 1,
    autonomy: 1, externalParty: 1, systemComplexity: 1,
  };
  const e = explainPredeployment(ratings, scorePredeployment(ratings));
  assert.match(e.distance, /narrower use case or stronger controls/);
});

test('the distance quotes the tier reachable by lowering what can be lowered', () => {
  const e = explainPredeployment(RATINGS, scorePredeployment(RATINGS));
  assert.match(e.distance, /would put this at Tier 2|would still leave this at Tier/);
});

test('the higher axis is named, and a tie is called a tie', () => {
  const even = explainPredeployment(RATINGS, scorePredeployment(RATINGS));
  assert.match(even.axis, /Both axes are rated the same/);

  const impactHeavy = { ...RATINGS, autonomy: 1, taskComplexity: 1, externalParty: 1, systemComplexity: 1, externalSystems: 1 };
  const e = explainPredeployment(impactHeavy, scorePredeployment(impactHeavy));
  assert.match(e.axis, /Impact is the higher axis/);
});

// --- Agentic deployed, Dayos action tiering ------------------------------

test('gaps are ordered by how far past the ceiling they run', () => {
  const res = governanceGap([
    { label: 'Password reset', severity: 3, reversibility: 2, oversight: 1, granted: 3 },   // tier 2, ceiling 2, over by 1
    { label: 'Firewall change', severity: 5, reversibility: 5, oversight: 1, granted: 3 },  // tier 3, ceiling 1, over by 2
    { label: 'Read a log', severity: 1, reversibility: 1, oversight: 1, granted: 3 },       // tier 1, no gap
  ]);
  assert.deepEqual(res.gaps.map(g => g.label), ['Firewall change', 'Password reset']);
  assert.deepEqual(res.gaps.map(g => g.overreach), [2, 1]);
});

test('each gap says what it is and what to change it to', () => {
  const res = governanceGap([
    { label: 'Firewall change', severity: 5, reversibility: 5, oversight: 1, granted: 3 },
  ]);
  const g = res.gaps[0];
  assert.match(g.why, /Severity 5 and irreversibility 5/);
  assert.match(g.why, /Tier 3 permits at most "Agent does not act"/);
  assert.equal(g.fix, `Move it from "${AUTONOMY_LABEL[3]}" to "${AUTONOMY_LABEL[1]}".`);
});

test('a hard-to-oversee action says that is what raised its tier', () => {
  const res = governanceGap([
    { label: 'Bulk mailout', severity: 3, reversibility: 1, oversight: 5, granted: 3 },
  ]);
  assert.match(res.gaps[0].why, /oversight rated hard, which raises the tier by one/);
});

test('an action at or below its ceiling carries no correction', () => {
  const res = governanceGap([
    { label: 'Read a log', severity: 1, reversibility: 1, oversight: 1, granted: 3 },
  ]);
  assert.deepEqual(res.gaps, []);
  assert.equal(res.rows[0].fix, '');
});
