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

test('order walkStart: newest by calendar with a tie broken by index, undated only when all undated, and newest by session', () => {
  const feed = syntheticFeed();
  // Give c2 (index 1) and c3 (index 2) the same latest date; make c6 (index 5) undated.
  feed.items[0].date_published = '2026-10-10T00:00:00.000Z';
  feed.items[1].date_published = '2026-11-01T00:00:00.000Z';
  feed.items[2].date_published = '2026-11-01T00:00:00.000Z';
  const scored = scoreSubfield(select(feed, { mode: 'all' }), normalisePreset(byNeighbourhoodPreset()));
  // Make c3 heavier than c2, and undated c6 the heaviest overall, to verify calendar date and index win.
  scored.cards.find((c) => c.id === C(3)).score = 50;
  scored.cards.find((c) => c.id === C(6)).score = 100;

  const cal = orderFlow(scored, { mode: 'walk', walkStart: 'newest' });
  assert.equal(cal.items[0].id, C(2));
  assert.deepEqual(cal.summary.start, { id: C(2), title: 'Card two', rule: 'newest', source: 'Journal' });

  // Under session clock, lowest index (c1 at index 0) wins regardless of calendar date or score.
  const sessScored = scoreSubfield(select(feed, { mode: 'all' }), normalisePreset(byNeighbourhoodPreset()), { switches: { recencyClock: 'session' } });
  const sess = orderFlow(sessScored, { mode: 'walk', walkStart: 'newest' });
  assert.equal(sess.items[0].id, C(1));
  assert.deepEqual(sess.summary.start, { id: C(1), title: 'Card one', rule: 'newest', source: 'Journal' });

  // When every candidate is undated under calendar clock, lowest index wins.
  const undatedScored = JSON.parse(JSON.stringify(scored));
  for (const c of undatedScored.cards) c.date = null;
  const allUndated = orderFlow(undatedScored, { mode: 'walk', walkStart: 'newest' });
  assert.equal(allUndated.items[0].id, C(1));
});

test('order walkStartSource: restricts newest and heaviest to a source and falls back to the whole subfield when absent', () => {
  // Boost Wire so c4 is the heaviest overall, while c1 (Journal) is the newest overall.
  const preset = normalisePreset({
    ...byNeighbourhoodPreset(),
    weights: { ...byNeighbourhoodPreset().weights, source: { Wire: 5 } },
  });
  const scored = scoreSubfield(all(), preset);
  const byHeaviest = orderFlow(scored, { mode: 'walk', walkStart: 'heaviest' });
  assert.equal(byHeaviest.items[0].id, C(4));
  assert.deepEqual(byHeaviest.summary.start, { id: C(4), title: 'Card four', rule: 'heaviest', source: 'Wire' });

  // Restrict heaviest to Journal: c1 is heaviest in Journal.
  const heaviestJournal = orderFlow(scored, { mode: 'walk', walkStart: 'heaviest', walkStartSource: 'Journal' });
  assert.equal(heaviestJournal.items[0].id, C(1));
  assert.deepEqual(heaviestJournal.summary.start, { id: C(1), title: 'Card one', rule: 'heaviest', source: 'Journal' });

  // Restrict newest to Wire: c4 is newest in Wire (2026-09-30 vs c5 2026-08-01 and undated c6).
  const newestWire = orderFlow(scored, { mode: 'walk', walkStart: 'newest', walkStartSource: 'Wire' });
  assert.equal(newestWire.items[0].id, C(4));
  assert.deepEqual(newestWire.summary.start, { id: C(4), title: 'Card four', rule: 'newest', source: 'Wire' });

  // Fallback when no card of the named source is in the subfield.
  const fallback = orderFlow(scored, { mode: 'walk', walkStart: 'newest', walkStartSource: 'Missing' });
  assert.equal(fallback.items[0].id, C(1));
  assert.deepEqual(fallback.summary.start, {
    id: C(1),
    title: 'Card one',
    rule: 'newest (no card of Missing; whole subfield)',
    source: 'Journal',
  });
});

test('order --start and score mode: explicit start wins over walkStart, unknown id throws, and score mode ignores walkStart', () => {
  const scored = scoreSubfield(all(), normalisePreset(byNeighbourhoodPreset()));
  const explicit = orderFlow(scored, { mode: 'walk', walkStart: 'newest', walkStartSource: 'Journal', start: C(5) });
  assert.equal(explicit.items[0].id, C(5));
  assert.deepEqual(explicit.summary.start, { id: C(5), title: 'Card five', rule: 'explicit', source: 'Wire' });
  assert.throws(() => orderFlow(scored, { mode: 'walk', start: 'https://example.test/nope' }), /does not have/);

  const scoreHeaviest = orderFlow(scored, { mode: 'score', walkStart: 'heaviest' });
  const scoreNewest = orderFlow(scored, { mode: 'score', walkStart: 'newest', walkStartSource: 'Wire' });
  assert.deepEqual(scoreNewest.items.map((it) => it.id), scoreHeaviest.items.map((it) => it.id));
  assert.equal(scoreNewest.summary.start, null);
});
