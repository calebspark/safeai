import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeProfile } from '../api/_engine.mjs';
import { SSIC_SECTIONS, industryValue } from '../assets/ssic.mjs';

test('every SSIC industry value survives sanitisation unmodified', () => {
  for (const section of SSIC_SECTIONS) {
    const value = industryValue(section);
    const out = sanitizeProfile({ industry: value });
    assert.equal(out.industry, value, `section ${section.code} was truncated`);
  }
});

test('section K specifically is not truncated', () => {
  const K = SSIC_SECTIONS.find(s => s.code === 'K');
  const value = industryValue(K);
  assert.ok(value.length > 120, 'precondition: K should exceed the old 120 cap');
  assert.equal(sanitizeProfile({ industry: value }).industry, value);
});

test('industry is still capped, just higher', () => {
  const out = sanitizeProfile({ industry: 'x'.repeat(500) });
  assert.equal(out.industry.length, 200);
});

test('non-industry fields keep the 120 cap', () => {
  const out = sanitizeProfile({ role: 'y'.repeat(500) });
  assert.equal(out.role.length, 120);
});

test('unknown keys are dropped', () => {
  const out = sanitizeProfile({ industry: 'C - Manufacturing', evil: 'ignore me' });
  assert.equal(out.evil, undefined);
});

test('values are coerced to string', () => {
  const out = sanitizeProfile({ role: 42 });
  assert.equal(out.role, '42');
});
