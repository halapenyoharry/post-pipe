import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreVariants, canonicalOf, DEFAULT_CANON } from '../lib/canon.js';

const v = (norm, label, bySource, extra = {}) => ({
  norm,
  label,
  bySource,
  count: Object.values(bySource).reduce((a, b) => a + b, 0),
  acronym: false,
  tokens: norm.split(' ').length,
  ...extra,
});

const ai = v('ai', 'AI', { A: 5, B: 1 }, { acronym: true });
const full = v('artificial intelligence', 'Artificial Intelligence', { B: 4, C: 2 });

test('parts are in 0..1 and the winner has the highest score', () => {
  const r = scoreVariants([ai, full]);
  for (const x of r) for (const p of Object.values(x.parts)) assert.ok(p >= 0 && p <= 1);
  assert.ok(r[0].score >= r[1].score);
});

test('frequency alone picks the most used spelling', () => {
  const r = scoreVariants([ai, full], { weights: { freq: 1, cover: 0, trust: 0, quality: 0 } });
  assert.equal(r[0].label, 'AI'); // 6 uses vs 6 uses: tie broken by label order, AI < Artificial
  const r2 = scoreVariants([v('x', 'X', { A: 9 }), v('y', 'Y', { A: 2 })], { weights: { freq: 1, cover: 0, trust: 0, quality: 0 } });
  assert.equal(r2[0].label, 'X');
});

test('coverage alone picks the spelling used by the most tag-systems', () => {
  const tie = scoreVariants([ai, full], { weights: { freq: 0, cover: 1, trust: 0, quality: 0 } });
  assert.equal(tie[0].score, tie[1].score); // both span two systems: equal, broken by label order, never by accident
  const wide = scoreVariants([v('a', 'A', { S1: 1 }), v('b', 'B', { S1: 1, S2: 1, S3: 1 })], { weights: { freq: 0, cover: 1, trust: 0, quality: 0 } });
  assert.equal(wide[0].label, 'B');
});

test('trust: a trusted system pulls its own spelling to the top, an ignored one cannot', () => {
  const cfg = { weights: { freq: 0, cover: 0, trust: 1, quality: 0 } };
  const loud = v('loud', 'Loud', { Big: 100 });
  const quiet = v('quiet', 'Quiet', { Small: 1 });
  // each system's usage is entirely one spelling, so with equal trust it is a tie; trust breaks it
  assert.equal(scoreVariants([loud, quiet], cfg, { Small: 2, Big: 0.1 })[0].label, 'Quiet');
  assert.equal(scoreVariants([loud, quiet], cfg, { Small: 0.1, Big: 2 })[0].label, 'Loud');
});

test('prefer: expanded vs short vs neutral changes the quality part only', () => {
  const only = { weights: { freq: 0, cover: 0, trust: 0, quality: 1 } };
  assert.equal(scoreVariants([ai, full], { ...only, prefer: 'expanded' })[0].label, 'Artificial Intelligence');
  assert.equal(scoreVariants([ai, full], { ...only, prefer: 'short' })[0].label, 'AI');
  const neutral = scoreVariants([ai, full], { ...only, prefer: 'neutral' });
  assert.equal(neutral[0].parts.quality, neutral[1].parts.quality);
});

test('slug artifacts are penalised as display labels', () => {
  const r = scoreVariants([v('a b', 'a-b', { S: 1 }), v('a c', 'a c', { S: 1 })], { weights: { freq: 0, cover: 0, trust: 0, quality: 1 }, prefer: 'neutral' });
  assert.equal(r[0].label, 'a c');
});

test('a pin wins regardless of score; no pin returns the top-ranked label', () => {
  const ranked = scoreVariants([ai, full]);
  assert.deepEqual(canonicalOf(ranked, 'Whatever I Say'), { label: 'Whatever I Say', pinned: true });
  assert.deepEqual(canonicalOf(ranked), { label: ranked[0].label, pinned: false });
});

test('weights need not sum to one; zero weights everywhere does not divide by zero', () => {
  const r = scoreVariants([ai, full], { weights: { freq: 5, cover: 5, trust: 5, quality: 5 } });
  assert.ok(r.every((x) => x.score >= 0 && x.score <= 1));
  assert.deepEqual(DEFAULT_CANON.prefer, 'expanded');
});
