import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  QUESTIONS, TOTAL_QUESTIONS, SCALE, SCALE_POINTS, BANDS,
  bandFor, scoreReadiness, SOURCE,
} from '../assets/genai.mjs';

const answerAll = (pick) => Object.fromEntries(QUESTIONS.map(q => [q.id, pick]));

test('one question per AI Verify principle, in framework order', () => {
  assert.equal(TOTAL_QUESTIONS, 11);
  assert.deepEqual(QUESTIONS.map(q => q.n), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
});

test('question ids are unique', () => {
  assert.equal(new Set(QUESTIONS.map(q => q.id)).size, TOTAL_QUESTIONS);
});

test('every question carries evidence and a traceable outcome reference', () => {
  for (const q of QUESTIONS) {
    assert.ok(q.question.length > 40, `${q.id} question too short`);
    assert.ok(q.evidence.length > 20, `${q.id} missing evidence`);
    // e.g. "1.1, 1.2" — the outcomes it condenses, so a reviewer can trace it.
    assert.match(q.outcomes, /^\d+\.\d+(, \d+\.\d+)*$/, `${q.id} bad outcome refs`);
    assert.ok(q.outcomes.split(', ').every(o => Number(o.split('.')[0]) === q.n),
      `${q.id} references outcomes from another principle`);
  }
});

test('attribution to IMDA and AI Verify is present with a link', () => {
  assert.match(SOURCE.owner, /IMDA/);
  assert.match(SOURCE.owner, /AI Verify/);
  assert.match(SOURCE.url, /^https:\/\//);
});

test('the scale is four points, with Not applicable excluded from scoring', () => {
  assert.equal(SCALE.length, 4);
  assert.deepEqual(SCALE.map(s => s.id), ['full', 'partial', 'none', 'na']);
  assert.deepEqual(SCALE.map(s => s.label), ['Yes', 'Partially done', 'No', 'Not applicable']);
  assert.equal(SCALE_POINTS.na, null);
  assert.equal(SCALE_POINTS.none, 0);
  assert.equal(SCALE_POINTS.partial, 0.5);
  assert.equal(SCALE_POINTS.full, 1);
});

test('all fully implemented scores 100 and lands in the top band', () => {
  const r = scoreReadiness(answerAll('full'));
  assert.equal(r.score, 100);
  assert.equal(r.band.id, 'mature');
  assert.equal(r.applicable, 11);
  assert.equal(r.gaps.length, 0);
  assert.equal(r.complete, true);
});

test('all not implemented scores 0 and every question becomes a gap', () => {
  const r = scoreReadiness(answerAll('none'));
  assert.equal(r.score, 0);
  assert.equal(r.band.id, 'foundational');
  assert.equal(r.gaps.length, 11);
});

test('all partial scores 50', () => {
  assert.equal(scoreReadiness(answerAll('partial')).score, 50);
});

test('Not applicable leaves the denominator, it does not count as a failure', () => {
  // 10 of 11 answered Not applicable, the one that applies is fully met.
  const answers = answerAll('na');
  answers[QUESTIONS[0].id] = 'full';
  const r = scoreReadiness(answers);
  assert.equal(r.applicable, 1);
  assert.equal(r.score, 100);
  assert.equal(r.counts.na, 10);
});

test('every question Not applicable gives no score rather than a false zero', () => {
  const r = scoreReadiness(answerAll('na'));
  assert.equal(r.score, null);
  assert.equal(r.band, null);
  assert.equal(r.applicable, 0);
});

test('unanswered questions are ignored and the result is marked incomplete', () => {
  const r = scoreReadiness({ [QUESTIONS[0].id]: 'full' });
  assert.equal(r.answered, 1);
  assert.equal(r.complete, false);
  assert.equal(r.score, 100);
});

test('junk answers are ignored', () => {
  const r = scoreReadiness({ [QUESTIONS[0].id]: 'mostly', nonsense: 'full' });
  assert.equal(r.answered, 0);
  assert.equal(r.score, null);
});

test('gaps list not implemented before partial', () => {
  const answers = answerAll('full');
  answers[QUESTIONS[1].id] = 'partial';
  answers[QUESTIONS[9].id] = 'none';
  const r = scoreReadiness(answers);
  assert.deepEqual(r.gaps.map(g => g.answer), ['none', 'partial']);
});

test('bands are contiguous and cover 0 to 100 exactly once', () => {
  assert.equal(BANDS[0].min, 0);
  assert.equal(BANDS[BANDS.length - 1].max, 100);
  for (let i = 1; i < BANDS.length; i += 1) {
    assert.equal(BANDS[i].min, BANDS[i - 1].max + 1, `gap before ${BANDS[i].id}`);
  }
  for (let s = 0; s <= 100; s += 1) {
    assert.equal(BANDS.filter(b => s >= b.min && s <= b.max).length, 1, `score ${s}`);
  }
});

test('band boundaries land where the copy says they do', () => {
  assert.equal(bandFor(39).id, 'foundational');
  assert.equal(bandFor(40).id, 'developing');
  assert.equal(bandFor(64).id, 'developing');
  assert.equal(bandFor(65).id, 'established');
  assert.equal(bandFor(84).id, 'established');
  assert.equal(bandFor(85).id, 'mature');
});
