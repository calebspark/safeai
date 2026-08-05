import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as OPTIONS from '../assets/options.mjs';
import {
  ROLE_GROUPS, USECASE_GROUPS, OTHERS, flatten,
  AUTONOMY, DATA_SOURCE, DATA_SENSITIVITY, CAPABILITY, HOSTING,
} from '../assets/options.mjs';

const SCALES = { AUTONOMY, DATA_SOURCE, DATA_SENSITIVITY, CAPABILITY, HOSTING };

test('role has 3 groups and 30 items', () => {
  assert.equal(ROLE_GROUPS.length, 3);
  assert.equal(flatten(ROLE_GROUPS).length, 30);
});

// Was 32 until RPA was dropped on 2026-08-05: it is automation, not AI.
test('use case has 5 groups and 31 items', () => {
  assert.equal(USECASE_GROUPS.length, 5);
  assert.equal(flatten(USECASE_GROUPS).length, 31);
});

test('RPA is gone from the use case list', () => {
  assert.ok(!flatten(USECASE_GROUPS).some(i => /rpa|robotic process/i.test(i)));
});

test('"Others" is its own answer, not a group item', () => {
  assert.equal(OTHERS, 'Others');
  assert.ok(!flatten(ROLE_GROUPS).includes(OTHERS));
  assert.ok(!flatten(USECASE_GROUPS).includes(OTHERS));
});

test('every scale option has a label and a real explanation', () => {
  for (const [name, list] of Object.entries(SCALES)) {
    assert.ok(list.length >= 3, `${name} is too short`);
    for (const o of list) {
      assert.equal(typeof o.label, 'string');
      assert.ok(o.label.trim(), `${name} has a blank label`);
      assert.ok(o.desc && o.desc.length > 20, `${name} option "${o.label}" has no real description`);
    }
  }
});

test('autonomy runs Level 0 to Level 5, capability Level 1 to Level 5', () => {
  assert.deepEqual(AUTONOMY.map(o => o.label.split(':')[0]),
    ['Level 0', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5']);
  assert.deepEqual(CAPABILITY.map(o => o.label.split(':')[0]),
    ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5']);
});

// The tool assigns the severity tier now. Asking the visitor for it was asking
// them for the answer, so the scale is gone rather than merely unused.
test('there is no governance tier scale to ask about', () => {
  assert.equal(OPTIONS.GOVERNANCE, undefined);
});

test('sensitivity keeps the regulated tier, which drives the strictest controls', () => {
  assert.ok(DATA_SENSITIVITY.some(o => /Restricted \/ regulated/i.test(o.label)));
});

test('every scale label fits the 120 character profile cap', () => {
  for (const [name, list] of Object.entries(SCALES)) {
    for (const o of list) assert.ok(o.label.length <= 120, `${name}: "${o.label}" is too long to send`);
  }
});

test('no duplicates within a scale or within a field', () => {
  for (const [name, list] of Object.entries(SCALES)) {
    const labels = list.map(o => o.label);
    assert.equal(new Set(labels).size, labels.length, `${name} has a duplicate`);
  }
  for (const groups of [ROLE_GROUPS, USECASE_GROUPS]) {
    const items = flatten(groups);
    assert.equal(new Set(items).size, items.length);
  }
});

test('no em dashes in any option or explanation', () => {
  const all = [
    ...flatten(ROLE_GROUPS),
    ...flatten(USECASE_GROUPS),
    ...Object.values(SCALES).flatMap(list => list.flatMap(o => [o.label, o.desc])),
  ];
  for (const v of all) assert.ok(!v.includes('—'), `"${v}" contains an em dash`);
});

test('no option carries the dead numeric prefix', () => {
  const all = [...flatten(ROLE_GROUPS), ...flatten(USECASE_GROUPS),
    ...Object.values(SCALES).flatMap(list => list.map(o => o.label))];
  for (const v of all) assert.ok(!/^\d\|/.test(v), `"${v}" still has a numeric prefix`);
});

test('agentic AI is a selectable use case, since it gates the agentic matrix', () => {
  assert.ok(flatten(USECASE_GROUPS).some(v => v.startsWith('Agentic AI')));
});
