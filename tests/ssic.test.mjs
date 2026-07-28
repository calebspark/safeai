import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SSIC_SECTIONS, SSIC_SYNONYMS, SSIC_COMMON, orderedSections, industryValue } from '../assets/ssic.mjs';

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

test('display order is a permutation of all 22 sections, none lost or duplicated', () => {
  const ordered = orderedSections();
  assert.equal(ordered.length, 22);
  assert.deepEqual(
    ordered.map(s => s.code).sort().join(''),
    SSIC_SECTIONS.map(s => s.code).sort().join(''),
  );
});

test('every common code is a real section', () => {
  const codes = new Set(SSIC_SECTIONS.map(s => s.code));
  for (const c of SSIC_COMMON) assert.ok(codes.has(c), `${c} is not a section`);
  assert.equal(new Set(SSIC_COMMON).size, SSIC_COMMON.length, 'no duplicates in the common list');
});

test('common sections lead, in the order given', () => {
  const ordered = orderedSections();
  assert.deepEqual(ordered.slice(0, SSIC_COMMON.length).map(s => s.code), SSIC_COMMON);
  assert.equal(ordered[0].code, 'L');
});

test('display order flags common vs the rest', () => {
  const ordered = orderedSections();
  assert.equal(ordered.filter(s => s.common).length, SSIC_COMMON.length);
  assert.ok(ordered.slice(SSIC_COMMON.length).every(s => !s.common));
});

test('the tail stays in SSIC letter order', () => {
  const tail = orderedSections().slice(SSIC_COMMON.length).map(s => s.code);
  assert.deepEqual(tail, [...tail].sort());
});

test('display order carries titles through intact', () => {
  const L = orderedSections().find(s => s.code === 'L');
  assert.equal(L.title, 'Financial and Insurance Activities');
});

test('industryValue formats as "CODE - Title"', () => {
  const L = SSIC_SECTIONS.find(s => s.code === 'L');
  assert.equal(industryValue(L), 'L - Financial and Insurance Activities');
});
