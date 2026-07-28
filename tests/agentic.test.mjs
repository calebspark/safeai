import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  IMPACT_FACTORS, LIKELIHOOD_FACTORS, SHARED_FACTOR_ID,
  scorePredeployment, tierOfAction, CEILING, governanceGap,
  AUTONOMY_CEILING_COPY,
} from '../assets/agentic.mjs';

const flat = (r) => Object.fromEntries(
  [...IMPACT_FACTORS, ...LIKELIHOOD_FACTORS].map(f => [f.id, r])
);

test('the two IMDA tables have 5 factors each', () => {
  assert.equal(IMPACT_FACTORS.length, 5);
  assert.equal(LIKELIHOOD_FACTORS.length, 5);
});

test('access to external systems appears in both tables, by design', () => {
  assert.ok(IMPACT_FACTORS.some(f => f.id === SHARED_FACTOR_ID));
  assert.ok(LIKELIHOOD_FACTORS.some(f => f.id === SHARED_FACTOR_ID));
});

test('every factor has anchors at 1, 3 and 5', () => {
  for (const f of [...IMPACT_FACTORS, ...LIKELIHOOD_FACTORS]) {
    for (const k of [1, 3, 5]) {
      assert.ok(f.anchors[k] && f.anchors[k].length > 3, `${f.id} missing anchor ${k}`);
    }
  }
});

test('no em dashes in factor copy', () => {
  for (const f of [...IMPACT_FACTORS, ...LIKELIHOOD_FACTORS]) {
    const blob = [f.label, f.description, ...Object.values(f.anchors)].join(' ');
    assert.ok(!blob.includes('—'), `${f.id} contains an em dash`);
  }
});

test('all ones is the floor: raw 1, needle 0, tier 1', () => {
  const s = scorePredeployment(flat(1));
  assert.equal(s.impact, 1);
  assert.equal(s.likelihood, 1);
  assert.equal(s.raw, 1);
  assert.equal(s.needle, 0);
  assert.equal(s.tier, 1);
});

test('all fives is the ceiling: raw 25, needle 100, tier 3', () => {
  const s = scorePredeployment(flat(5));
  assert.equal(s.raw, 25);
  assert.equal(s.needle, 100);
  assert.equal(s.tier, 3);
});

test('all twos gives raw 4, tier 1', () => {
  const s = scorePredeployment(flat(2));
  assert.equal(s.raw, 4);
  assert.equal(s.tier, 1);
});

test('needle normalises raw 1..25 onto 0..100', () => {
  assert.equal(scorePredeployment(flat(3)).needle, Math.round((9 - 1) / 24 * 100));
});

test('tier bands follow raw <=6, 7-14, >=15', () => {
  const band = raw => (raw <= 6 ? 1 : raw <= 14 ? 2 : 3);
  assert.equal(band(1), 1);
  assert.equal(band(6), 1);
  assert.equal(band(7), 2);
  assert.equal(band(14), 2);
  assert.equal(band(15), 3);
  assert.equal(band(25), 3);
});

test('impact and likelihood are averaged independently', () => {
  // Impact factors all 5, likelihood-only factors all 1, shared factor 5.
  const ratings = {};
  for (const f of IMPACT_FACTORS) ratings[f.id] = 5;
  for (const f of LIKELIHOOD_FACTORS) if (f.id !== SHARED_FACTOR_ID) ratings[f.id] = 1;
  const s = scorePredeployment(ratings);
  assert.equal(s.impact, 5);
  // likelihood = mean(1,1,5,1,1) = 1.8 -> rounds to 2
  assert.equal(s.likelihood, 2);
  assert.equal(s.raw, 10);
  assert.equal(s.tier, 2);
});

// --- Dayos action tiering ---

test('low severity fully reversible is tier 1', () => {
  assert.equal(tierOfAction({ severity: 1, reversibility: 1, oversight: 1 }), 1);
});

test('tier is driven by the worse of severity and reversibility', () => {
  assert.equal(tierOfAction({ severity: 1, reversibility: 4, oversight: 1 }), 3);
  assert.equal(tierOfAction({ severity: 3, reversibility: 1, oversight: 1 }), 2);
});

test('infeasible human oversight bumps the tier by one', () => {
  assert.equal(tierOfAction({ severity: 1, reversibility: 1, oversight: 4 }), 2);
  assert.equal(tierOfAction({ severity: 3, reversibility: 1, oversight: 5 }), 3);
});

test('the oversight bump cannot exceed tier 3', () => {
  assert.equal(tierOfAction({ severity: 5, reversibility: 5, oversight: 5 }), 3);
});

test('ceilings match the Dayos prescription', () => {
  assert.deepEqual(CEILING, { 1: 3, 2: 2, 3: 1 });
});

test('a row granted more autonomy than its ceiling is a gap', () => {
  const rows = [
    { label: 'Password reset', severity: 1, reversibility: 1, oversight: 1, granted: 3 },
    { label: 'Production deploy', severity: 5, reversibility: 5, oversight: 3, granted: 3 },
  ];
  const r = governanceGap(rows);
  assert.equal(r.rows[0].gap, false);
  assert.equal(r.rows[1].gap, true);
  assert.equal(r.gaps.length, 1);
  assert.equal(r.needle, 50);
});

test('fully governed portfolio reads zero', () => {
  const rows = [
    { label: 'Password reset', severity: 1, reversibility: 1, oversight: 1, granted: 3 },
    { label: 'Production deploy', severity: 5, reversibility: 5, oversight: 3, granted: 1 },
  ];
  assert.equal(governanceGap(rows).needle, 0);
});

test('empty portfolio does not divide by zero', () => {
  const r = governanceGap([]);
  assert.equal(r.needle, 0);
  assert.deepEqual(r.gaps, []);
});

test('distribution counts rows per tier', () => {
  const rows = [
    { label: 'a', severity: 1, reversibility: 1, oversight: 1, granted: 1 },
    { label: 'b', severity: 3, reversibility: 1, oversight: 1, granted: 1 },
    { label: 'c', severity: 5, reversibility: 5, oversight: 1, granted: 1 },
  ];
  assert.deepEqual(governanceGap(rows).distribution, { 1: 1, 2: 1, 3: 1 });
});

test('governanceGap annotates each row with its tier and ceiling', () => {
  const r = governanceGap([{ label: 'x', severity: 3, reversibility: 1, oversight: 1, granted: 2 }]);
  assert.equal(r.rows[0].tier, 2);
  assert.equal(r.rows[0].ceiling, 2);
  assert.equal(r.rows[0].gap, false);
});

test('every tier has autonomy ceiling copy', () => {
  for (const t of [1, 2, 3]) {
    assert.ok(AUTONOMY_CEILING_COPY[t].length > 20);
    assert.ok(!AUTONOMY_CEILING_COPY[t].includes('—'), 'no em dashes');
  }
});
