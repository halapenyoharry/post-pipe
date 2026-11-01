import test from 'node:test';
import assert from 'node:assert/strict';
import { select } from '../lib/subfield.js';
import { scoreSubfield, featureNames } from '../lib/score.js';
import { normalisePreset } from '../lib/preset.js';
import { syntheticFeed, byWeightPreset, byNeighbourhoodPreset } from './helpers.js';

const C = (n) => `https://example.test/c${n}`;
const all = () => select(syntheticFeed(), { mode: 'all' });
const card = (scored, n) => scored.cards.find((c) => c.id === C(n));

test('score: every feature is bounded to 0..1 and named', () => {
  const scored = scoreSubfield(all(), normalisePreset(byWeightPreset()));
  const names = featureNames(all(), normalisePreset(byWeightPreset()));
  assert.deepEqual(names, ['tag.site', 'tag.Journal', 'tag.Wire', 'tag.discovered', 'tag.shared', 'rel.related', 'degree', 'recency', 'source', 'read', 'pin', 'distance']);
  for (const c of scored.cards) {
    assert.deepEqual(Object.keys(c.terms), names);
    for (const [name, t] of Object.entries(c.terms)) {
      assert.ok(t.x >= 0 && t.x <= 1, `${c.id} ${name} x=${t.x}`);
      assert.equal(t.term, t.w * t.x);
    }
  }
});

test('score: tag.<scheme> is the strongest reference with a prefLabel in that scheme', () => {
  const scored = scoreSubfield(all(), normalisePreset(byWeightPreset()));
  assert.equal(card(scored, 1).terms['tag.site'].x, 1);
  assert.equal(card(scored, 1).terms['tag.Journal'].x, 1);
  assert.equal(card(scored, 1).terms['tag.discovered'].x, 0.5);
  assert.equal(card(scored, 1).terms['tag.Wire'].x, 0);
  assert.equal(card(scored, 5).terms['tag.site'].x, 0.4);
  assert.equal(card(scored, 6).terms['tag.site'].x, 0);
});

test('score: degree counts tag incidences and links, penalised by sqrt, over the largest', () => {
  const scored = scoreSubfield(all(), normalisePreset(byWeightPreset()));
  // c4: gamma, delta and the link to c5 = 3; c1: two tagz = 2; c6: none.
  assert.equal(card(scored, 4).terms.degree.x, 1);
  assert.ok(Math.abs(card(scored, 1).terms.degree.x - Math.sqrt(2) / Math.sqrt(3)) < 1e-12);
  assert.equal(card(scored, 6).terms.degree.x, 0);
  const none = scoreSubfield(all(), normalisePreset(byWeightPreset()), { switches: { degreePenalty: 'none' } });
  assert.ok(Math.abs(card(none, 1).terms.degree.x - 2 / 3) < 1e-12);
  const log = scoreSubfield(all(), normalisePreset(byWeightPreset()), { switches: { degreePenalty: 'log' } });
  assert.ok(Math.abs(card(log, 1).terms.degree.x - Math.log1p(2) / Math.log1p(3)) < 1e-12);
});

test('score: recency by calendar decays from the newest dated card with the half-life; undated is 0; session is the feed order', () => {
  const scored = scoreSubfield(all(), normalisePreset(byWeightPreset()));
  assert.equal(card(scored, 1).terms.recency.x, 1);
  assert.ok(Math.abs(card(scored, 4).terms.recency.x - 0.5) < 1e-12);
  assert.equal(card(scored, 6).terms.recency.x, 0);
  const session = scoreSubfield(all(), normalisePreset(byWeightPreset()), { switches: { recencyClock: 'session' } });
  assert.equal(card(session, 1).terms.recency.x, 1);
  assert.equal(card(session, 6).terms.recency.x, 0);
  assert.ok(Math.abs(card(session, 3).terms.recency.x - 0.6) < 1e-12);
});

test('score: source is the preset weight by title, 1 unnamed; read and pin come from the state, else 0', () => {
  const preset = normalisePreset({ ...byWeightPreset(), weights: { ...byWeightPreset().weights, source: { Wire: 2 } } });
  const scored = scoreSubfield(all(), preset);
  assert.deepEqual(card(scored, 1).terms.source, { x: 1, w: 1, term: 1 });
  assert.deepEqual(card(scored, 4).terms.source, { x: 1, w: 2, term: 2 });
  assert.equal(card(scored, 1).terms.read.x, 0);
  assert.equal(card(scored, 1).terms.pin.x, 0);
  const state = { version: 1, reading: { [C(1)]: { seenAt: 1, done: true }, [C(2)]: { seenAt: 1 } }, nodes: { c3: { pinned: true } } };
  const withState = scoreSubfield(all(), preset, { state });
  assert.equal(card(withState, 1).terms.read.x, 1);
  assert.equal(card(withState, 2).terms.read.x, 0.5);
  assert.equal(card(withState, 3).terms.pin.x, 1);
});

test('score: tag.shared, rel.<type> and distance are 0 without a position, and read from the position with one', () => {
  const scored = scoreSubfield(all(), normalisePreset(byNeighbourhoodPreset()));
  for (const c of scored.cards) {
    assert.equal(c.terms['tag.shared'].x, 0);
    assert.equal(c.terms['rel.related'].x, 0);
    assert.equal(c.terms.distance.x, 0);
  }
  const around = scoreSubfield(select(syntheticFeed(), { mode: 'around', id: C(1), hops: 1 }), normalisePreset(byNeighbourhoodPreset()));
  // c2 shares alpha (1 of c1's 1.5 tag weight); c3 shares beta at the smaller weight 0.5.
  assert.ok(Math.abs(card(around, 2).terms['tag.shared'].x - 1 / 1.5) < 1e-12);
  assert.ok(Math.abs(card(around, 3).terms['tag.shared'].x - 0.5 / 1.5) < 1e-12);
  // c1 carries alpha and beta, which are related: a card carrying only one of them is related across.
  assert.equal(card(around, 3).terms['rel.related'].x, 0.6);
  assert.equal(card(around, 2).terms['rel.related'].x, 0.6);
  assert.equal(card(around, 1).terms.distance.x, 0);
  assert.equal(card(around, 2).terms.distance.x, 1);
  assert.equal(card(around, 2).terms.distance.w, -1);
});

test('score: the terms sum to the score and top is ordered by absolute term', () => {
  const scored = scoreSubfield(all(), normalisePreset(byNeighbourhoodPreset()));
  for (const c of scored.cards) {
    const sum = Object.values(c.terms).reduce((a, t) => a + t.term, 0);
    assert.ok(Math.abs(sum - c.score) < 1e-9, `${c.id}: ${sum} vs ${c.score}`);
    const abs = c.top.map((n) => Math.abs(c.terms[n].term));
    for (let i = 1; i < abs.length; i++) assert.ok(abs[i - 1] >= abs[i]);
  }
  assert.equal(scored.preset.name, 'test-by-neighbourhood');
  assert.equal(scored.preset.switches.orderMode, 'walk');
});

test('preset: shape is checked', () => {
  assert.throws(() => normalisePreset({}), /no name/);
  assert.throws(() => normalisePreset({ name: 'x' }), /no weights/);
  assert.throws(() => normalisePreset({ name: 'x', weights: { degree: 'heavy' } }), /not a number/);
  assert.throws(() => normalisePreset({ name: 'x', weights: {}, switches: { degreePenalty: 'cube' } }), /degreePenalty/);
  assert.throws(() => normalisePreset({ name: 'x', weights: {}, switches: { other: 1 } }), /unknown switch/);
  const p = normalisePreset({ name: 'x', weights: { degree: 1 } });
  assert.deepEqual(p.weights, { degree: 1, source: {} });
  assert.equal(p.switches.seam, 2);
});
