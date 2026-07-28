import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SSIC_SECTIONS, SSIC_SYNONYMS, industryValue } from '../assets/ssic.mjs';

test('has all 22 SSIC 2025 sections', () => {
  assert.equal(SSIC_SECTIONS.length, 22);
});

test('section letters are contiguous A through V', () => {
  const letters = SSIC_SECTIONS.map(s => s.code).join('');
  assert.equal(letters, 'ABCDEFGHIJKLMNOPQRSTUV');
});

test('SSIC 2025 letter shift: Financial and Insurance is L, not K', () => {
  const L = SSIC_SECTIONS.find(s => s.code === 'L');
  assert.equal(L.title, 'Financial and Insurance Activities');
  const K = SSIC_SECTIONS.find(s => s.code === 'K');
  assert.match(K.title, /^Telecommunications/);
});

test('section J is the post-split publishing section', () => {
  const J = SSIC_SECTIONS.find(s => s.code === 'J');
  assert.match(J.title, /^Publishing, Broadcasting/);
});

test('every title is non-empty and free of double spaces', () => {
  for (const s of SSIC_SECTIONS) {
    assert.ok(s.title.length > 3, `${s.code} title too short`);
    assert.ok(!s.title.includes('  '), `${s.code} has a double space`);
  }
});

test('synonyms all point at a real section code', () => {
  const codes = new Set(SSIC_SECTIONS.map(s => s.code));
  for (const [term, code] of Object.entries(SSIC_SYNONYMS)) {
    assert.ok(codes.has(code), `synonym "${term}" points at unknown section ${code}`);
    assert.equal(term, term.toLowerCase(), `synonym "${term}" must be lowercase`);
  }
});

test('common synonyms resolve to the right sections', () => {
  assert.equal(SSIC_SYNONYMS['fintech'], 'L');
  assert.equal(SSIC_SYNONYMS['bank'], 'L');
  assert.equal(SSIC_SYNONYMS['shipping'], 'H');
  assert.equal(SSIC_SYNONYMS['saas'], 'K');
  assert.equal(SSIC_SYNONYMS['hospital'], 'R');
  assert.equal(SSIC_SYNONYMS['school'], 'Q');
});

test('industryValue formats as "CODE - Title"', () => {
  const L = SSIC_SECTIONS.find(s => s.code === 'L');
  assert.equal(industryValue(L), 'L - Financial and Insurance Activities');
});
