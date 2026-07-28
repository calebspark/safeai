import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ROLE_GROUPS, USECASE_GROUPS, AUTONOMY, DATA, DEPLOY, flatten } from '../assets/options.mjs';

test('role has 3 groups and 30 items', () => {
  assert.equal(ROLE_GROUPS.length, 3);
  assert.equal(flatten(ROLE_GROUPS).length, 30);
});

test('use case has 5 groups and 32 items', () => {
  assert.equal(USECASE_GROUPS.length, 5);
  assert.equal(flatten(USECASE_GROUPS).length, 32);
});

test('the three unchanged pill lists keep their exact existing values', () => {
  assert.deepEqual(AUTONOMY, ['Human-in-the-Loop', 'Human-over-the-Loop', 'Fully Autonomous']);
  assert.deepEqual(DATA, ['Public/Open Source', 'Internal Confidential', 'PII (personal data)', 'PHI (health / medical)']);
  assert.deepEqual(DEPLOY, ['Cloud PaaS/IaaS (self-hosted)', 'On-Premises', '3rd-Party SaaS', 'Edge Device']);
});

test('no option carries the dead numeric prefix', () => {
  const all = [...flatten(ROLE_GROUPS), ...flatten(USECASE_GROUPS), ...AUTONOMY, ...DATA, ...DEPLOY];
  for (const v of all) assert.ok(!/^\d\|/.test(v), `"${v}" still has a numeric prefix`);
});

test('no duplicate items within a field', () => {
  for (const groups of [ROLE_GROUPS, USECASE_GROUPS]) {
    const items = flatten(groups);
    assert.equal(new Set(items).size, items.length);
  }
});

test('no em dashes in any option', () => {
  const all = [...flatten(ROLE_GROUPS), ...flatten(USECASE_GROUPS)];
  for (const v of all) assert.ok(!v.includes('—'), `"${v}" contains an em dash`);
});

test('agentic AI is a selectable use case, since it gates the agentic matrix', () => {
  assert.ok(flatten(USECASE_GROUPS).some(v => v.startsWith('Agentic AI')));
});
