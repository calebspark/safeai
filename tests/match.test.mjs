import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalise, fuzzyMatch, CONFIDENT } from '../assets/match.mjs';

const ENTRIES = [
  { value: 'L', label: 'Financial and Insurance Activities' },
  { value: 'H', label: 'Transportation and Storage' },
  { value: 'R', label: 'Health and Social Services' },
  { value: 'C', label: 'Manufacturing' },
];
const SYN = { fintech: 'L', shipping: 'H', hospital: 'R' };

test('normalise lowercases, strips punctuation, collapses whitespace', () => {
  assert.equal(normalise('  F&B,  Retail!! '), 'f b retail');
});

test('exact label match is full confidence', () => {
  const m = fuzzyMatch('Financial and Insurance Activities', ENTRIES, SYN);
  assert.equal(m.value, 'L');
  assert.equal(m.confidence, 1);
});

test('label match is case and punctuation insensitive', () => {
  const m = fuzzyMatch('manufacturing.', ENTRIES, SYN);
  assert.equal(m.value, 'C');
  assert.equal(m.confidence, 1);
});

test('synonym hit is full confidence', () => {
  assert.equal(fuzzyMatch('fintech', ENTRIES, SYN).value, 'L');
  assert.equal(fuzzyMatch('Shipping', ENTRIES, SYN).value, 'H');
});

test('partial token overlap matches above threshold', () => {
  const m = fuzzyMatch('financial services', ENTRIES, SYN);
  assert.equal(m.value, 'L');
  assert.ok(m.confidence >= CONFIDENT);
});

test('gibberish returns null', () => {
  assert.equal(fuzzyMatch('asdfghjkl', ENTRIES, SYN), null);
});

test('empty input returns null', () => {
  assert.equal(fuzzyMatch('', ENTRIES, SYN), null);
  assert.equal(fuzzyMatch('   ', ENTRIES, SYN), null);
});

test('an unlisted but real industry falls through to null so the model can map it', () => {
  assert.equal(fuzzyMatch('maritime bunkering', ENTRIES, SYN), null);
});

test('does not match on a single common word alone', () => {
  const m = fuzzyMatch('and', ENTRIES, SYN);
  assert.equal(m, null);
});
