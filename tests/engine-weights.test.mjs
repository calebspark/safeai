import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DRIVER_WEIGHTS, sanitizeProfile } from '../api/_engine.mjs';

test('the weights still total 100, so the tier bands stay valid', () => {
  const total = Object.values(DRIVER_WEIGHTS).reduce((a, b) => a + b, 0);
  assert.equal(total, 100);
});

test('data source is its own weighted driver', () => {
  assert.equal(DRIVER_WEIGHTS['Data source'], 6);
  assert.equal(Object.keys(DRIVER_WEIGHTS).length, 7);
});

test('the split profile fields all survive sanitisation', () => {
  const profile = {
    industry: 'L - Financial and Insurance Activities',
    role: 'Risk manager',
    usecase: 'Credit or risk scoring',
    autonomy: 'Level 3: High autonomy',
    dataSource: 'Structured databases',
    dataSensitivity: 'Restricted / regulated (PII, PHI, HIPAA, GDPR)',
    capability: 'Level 4: Multi-agent',
    hosting: 'Third-party SaaS',
    governance: 'Tier 3: High severity',
  };
  assert.deepEqual(sanitizeProfile(profile), profile);
});

test('the retired data and deploy keys are dropped, not passed through', () => {
  const out = sanitizeProfile({ data: 'PII (personal data)', deploy: 'On-Premises' });
  assert.equal(out.data, undefined);
  assert.equal(out.deploy, undefined);
});
