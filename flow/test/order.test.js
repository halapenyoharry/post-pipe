import test from 'node:test';
import assert from 'node:assert/strict';
import { select } from '../lib/subfield.js';
import { scoreSubfield } from '../lib/score.js';
import { orderFlow } from '../lib/order.js';
import { normalisePreset } from '../lib/preset.js';
import { syntheticFeed, byWeightPreset, byNeighbourhoodPreset } from './helpers.js';

const C = (n) => `https://example.test/c${n}`;
const all = () => select(syntheticFeed(), { mode: 'all' });

test('order score: by score descending, ties by id, deterministic', () => {
  const flat = normalisePreset({ name: 'flat', weights: {} });
  const flow = orderFlow(scoreSubfield(all(), flat));
  assert.ok(flow.items.every((it) => it.score === 1));
  assert.deepEqual(flow.items.map((it) => it.id), [C(1), C(2), C(3), C(4), C(5), C(6)]);
  const a = JSON.stringify(orderFlow(scoreSubfield(all(), normalisePreset(byWeightPreset()))));
  const b = JSON.stringify(orderFlow(scoreSubfield(all(), normalisePreset(byWeightPreset()))));
  assert.equal(a, b);
  const scores = JSON.parse(a).items.map((it) => it.score);
  for (let i = 1; i < scores.length; i++) assert.ok(scores[i - 1] >= scores[i]);
  assert.deepEqual(JSON.parse(a).items.map((it) => it.rank), [1, 2, 3, 4, 5, 6]);
});

test('order: each item carries its tagz and step; a seam is flagged when hops exceed the seam switch or the card is unreachable', () => {
  const flow = orderFlow(scoreSubfield(all(), normalisePreset(byWeightPreset())));
  const first = flow.items[0];
  assert.deepEqual(first.step, { from: null, hops: null, shared: [], seam: false });
  assert.deepEqual(flow.items.find((it) => it.id === C(1)).tagz.map((t) => [t.id, t.label, t.weight, t.origin]), [['c_alpha', 'alpha', 1, 'explicit'], ['c_beta', 'beta', 0.5, 'discovered']]);
  const six = flow.items.find((it) => it.id === C(6));
  assert.equal(six.step.hops, null);
  assert.equal(six.step.seam, true);
  assert.equal(six.untagged.type, 'untagged');
  assert.ok(flow.summary.seams >= 1);
  assert.equal(flow.summary.steps, 5);
  assert.equal(flow.summary.cards, 6);
  assert.equal(flow.summary.mode, 'score');
  assert.equal(flow.summary.switches.seam, 2);
  // Two cards sharing a tag are two hops apart: not a seam at the default.
  const shared = flow.items.find((it) => it.step.shared.length > 0);
  assert.ok(shared);
  assert.equal(shared.step.hops, 2);
  assert.equal(shared.step.seam, false);
  const strict = orderFlow(scoreSubfield(all(), normalisePreset(byWeightPreset())), { seam: 1 });
  assert.ok(strict.summary.seams > flow.summary.seams);
});

test('order walk: visits each card once, starts at the heaviest, prefers the near', () => {
  const scored = scoreSubfield(all(), normalisePreset(byNeighbourhoodPreset()));
  const flow = orderFlow(scored);
  assert.equal(flow.summary.mode, 'walk');
  assert.equal(flow.items.length, 6);
  assert.equal(new Set(flow.items.map((it) => it.id)).size, 6);
  const heaviest = [...scored.cards].sort((a, b) => b.score - a.score || (a.id < b.id ? -1 : 1))[0];
  assert.equal(flow.items[0].id, heaviest.id);
  const byScore = orderFlow(scored, { mode: 'score' });
  assert.ok(flow.summary.meanHops <= byScore.summary.meanHops);
});

test('order: stability holds a previous order unless scores differ by more than the threshold', () => {
  const scored = scoreSubfield(all(), normalisePreset(byWeightPreset()));
  const previous = orderFlow(scored);
  // Nudge the second card just above the first: under the threshold, the order holds.
  const range = Math.max(...scored.cards.map((c) => c.score)) - Math.min(...scored.cards.map((c) => c.score));
  const nudged = JSON.parse(JSON.stringify(scored));
  const [a, b] = previous.items;
  nudged.cards.find((c) => c.id === b.id).score = a.score + 0.01 * range;
  const held = orderFlow(nudged, { previous, stability: 0.05 });
  assert.deepEqual(held.items.slice(0, 2).map((it) => it.id), [a.id, b.id]);
  assert.equal(held.summary.switches.previous, true);
  // Over the threshold, it passes.
  nudged.cards.find((c) => c.id === b.id).score = a.score + 0.2 * range;
  const passed = orderFlow(nudged, { previous, stability: 0.05 });
  assert.deepEqual(passed.items.slice(0, 2).map((it) => it.id), [b.id, a.id]);
  // Without a previous flow the nudge sorts as scores say.
  const plain = orderFlow(nudged);
  assert.equal(plain.items[0].id, b.id);
});

test('order: refuses input that was not scored', () => {
  assert.throws(() => orderFlow(all()), /no preset/);
  assert.throws(() => orderFlow({}), /no cards/);
});
