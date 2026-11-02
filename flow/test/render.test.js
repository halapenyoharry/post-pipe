import test from 'node:test';
import assert from 'node:assert/strict';
import { select } from '../lib/subfield.js';
import { scoreSubfield } from '../lib/score.js';
import { orderFlow } from '../lib/order.js';
import { normalisePreset } from '../lib/preset.js';
import { renderText } from '../lib/renderText.js';
import { renderPathSvg, pathStats } from '../lib/renderPath.js';
import { syntheticFeed, syntheticPositions, byWeightPreset, byNeighbourhoodPreset } from './helpers.js';

const flowOf = (preset) => orderFlow(scoreSubfield(select(syntheticFeed(), { mode: 'all' }), normalisePreset(preset)));

test('text: names every card, writes the top terms, the tagz with concept, weight, origin, why and the other carriers, and the seams', () => {
  const flow = flowOf(byWeightPreset());
  const text = renderText(flow, { full: 20 });
  for (const it of flow.items) assert.ok(text.includes(it.title), it.title);
  assert.match(text, /^flow test-by-weight: 6 cards, mode score, \d+ seams/);
  assert.match(text, /weights: tag\.site 1 · degree 1 · recency 1 · source 1 \(every source\)/);
  assert.match(text, /tag alpha \(c_alpha\) weight 1 explicit · also #\d+ Card (one|two)/);
  assert.match(text, /tag beta \(c_beta\) weight 0\.5 discovered · why: recurs in 2 of 6 items; 3× here · also #\d+ Card three/);
  assert.match(text, /-- seam: not reachable from #\d+ in the subfield --\n#\d+ {2}\d\.\d{3} {2}Card six/);
  assert.match(text, /untagged: only tagz under the 1\.6× source coherence bar: omega 1\.2/);
  // Each full card's second line is its top three terms in words.
  const lines = text.split('\n');
  const head = lines.findIndex((l) => l.startsWith('#1  '));
  assert.match(lines[head + 1], /^ {4}[a-zA-Z.]+ -?\d\.\d\d · [a-zA-Z.]+ -?\d\.\d\d · [a-zA-Z.]+ -?\d\.\d\d$/);
});

test('text: beyond --full a card is one line with rank, score, title and tag labels', () => {
  const flow = flowOf(byWeightPreset());
  const text = renderText(flow, { full: 2 });
  const light = text.split('\n').filter((l) => /^#[3-6] {2}/.test(l));
  assert.equal(light.length, 4);
  for (const l of light) assert.match(l, /^#\d {2}\d\.\d{3} {2}Card \w+ {2}\[.*\]$/);
  assert.equal(renderText(flow, { full: 0 }).split('\n').filter((l) => l.startsWith('    tag ')).length, 0);
});

test('text: header line names the start card when walk rule is not heaviest', () => {
  const scored = scoreSubfield(select(syntheticFeed(), { mode: 'all' }), normalisePreset(byNeighbourhoodPreset()));
  const heaviest = orderFlow(scored, { mode: 'walk', walkStart: 'heaviest' });
  assert.match(renderText(heaviest, { full: 1 }), /^flow test-by-neighbourhood: 6 cards, mode walk, \d+ seams/);

  const newest = orderFlow(scored, { mode: 'walk', walkStart: 'newest' });
  assert.match(renderText(newest, { full: 1 }), /^flow test-by-neighbourhood: 6 cards, mode walk, start Card one \(newest\), \d+ seams/);

  const explicit = orderFlow(scored, { mode: 'walk', start: 'https://example.test/c5' });
  assert.match(renderText(explicit, { full: 1 }), /^flow test-by-neighbourhood: 6 cards, mode walk, start Card five \(explicit\), \d+ seams/);
});

test('path: an SVG the size of the viewport with one segment per step, seams dashed, a mark per card, a legend naming the preset', () => {
  const flow = flowOf(byWeightPreset());
  const positions = syntheticPositions();
  const { svg, stats } = renderPathSvg(flow, positions);
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="800" height="600"/);
  const segments = svg.match(/<line class="step[^"]*" data-step="\d+"/g) || [];
  assert.equal(segments.length, flow.items.length - 1);
  const seams = svg.match(/<line class="step seam"/g) || [];
  assert.equal(seams.length, flow.summary.seams);
  assert.ok(seams.length >= 1);
  assert.equal((svg.match(/<circle class="mark/g) || []).length, 6);
  assert.equal((svg.match(/<rect class="card"/g) || []).length, 6);
  assert.equal((svg.match(/<circle class="tag"/g) || []).length, 4);
  assert.match(svg, /preset test-by-weight · mode score · 6 cards/);
  assert.equal(stats.segments, 5);
  assert.equal(stats.placed, 6);
  assert.deepEqual(stats.notDrawn, []);
  assert.ok(stats.totalLength > 0);
  assert.equal(stats.halfDiagonal, Math.hypot(800, 600) / 2);
});

test('path: the measures follow the geometry; a card the capture lacks is listed, not drawn', () => {
  const flow = flowOf(byNeighbourhoodPreset());
  const positions = syntheticPositions();
  const stats = pathStats(flow, positions);
  const order = flow.items.map((it) => positions.cards.find((c) => c.url === it.url).centre);
  let total = 0;
  const lengths = [];
  for (let i = 1; i < order.length; i++) {
    const l = Math.hypot(order[i].x - order[i - 1].x, order[i].y - order[i - 1].y);
    lengths.push(l);
    total += l;
  }
  assert.ok(Math.abs(stats.totalLength - total) < 1e-9);
  assert.ok(Math.abs(stats.meanLength - total / 5) < 1e-9);
  assert.equal(stats.longerThanHalfDiagonal, lengths.filter((l) => l > 500).length);
  const fewer = { ...positions, cards: positions.cards.slice(0, 5) };
  const { svg, stats: s2 } = renderPathSvg(flow, fewer);
  assert.deepEqual(s2.notDrawn, ['https://example.test/c6']);
  assert.ok((svg.match(/<line class="step/g) || []).length < 5);
  assert.match(svg, /not drawn: 1/);
  assert.throws(() => renderPathSvg(flow, {}), /positions\.json/);
});
