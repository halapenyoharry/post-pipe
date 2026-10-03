// A chapter card's title and the line under it, each as large as fits the
// card (graph.card.fit): the title over at most three lines, the line on
// one, never larger than the title.

const { test } = require('node:test');
const assert = require('node:assert');
const { fitCard, wrapWords } = require('../src/lib/cardFit');

// Every character half an em wide (a space too).
const half = (text, size) => text.length * size * 0.5;

test('wrap: as many words on a line as go, never a word broken', () => {
  assert.deepStrictEqual(wrapWords(['Berry', 'Thief'], 10, 60, half), ['Berry Thief']);
  assert.deepStrictEqual(wrapWords(['Berry', 'Thief'], 10, 50, half), ['Berry', 'Thief']);
  assert.equal(wrapWords(['Promethean'], 10, 40, half), null);
});

test('fit: both as large as the box takes, the stack within it', () => {
  const r = fitCard({ title: 'Berry Thief', subtitle: 'chapter one', width: 168, height: 128, measure: half });
  // "chapter one" (11 characters) on one line of 168: at most 30.5.
  assert.ok(Math.abs(r.subtitleSize - 168 / 5.5) < 0.2);
  assert.deepStrictEqual(r.lines, ['Berry', 'Thief']);
  // Two lines of the title and the line under it fill the height.
  const h = 2 * 1.05 * r.titleSize + 3 + 1.05 * r.subtitleSize;
  assert.ok(h <= 128 + 1e-9 && h > 127);
  // Larger than the old fixed sizes (26 and 0.62 of it at most).
  assert.ok(r.titleSize > 26 && r.subtitleSize > 26 * 0.62);
});

test('fit: at most three lines; the line under the title never larger than it', () => {
  const r = fitCard({ title: 'Eli Jones Parents And Flight', subtitle: 'chapter one', width: 168, height: 128, measure: half });
  assert.ok(r.lines.length <= 3);
  assert.ok(r.subtitleSize <= r.titleSize + 1e-9);
  for (const l of r.lines) assert.ok(half(l, r.titleSize) <= 168 + 1e-9);
  // A long line under a short title is limited by its width.
  const s = fitCard({ title: 'Emma', subtitle: 'chapter twenty-three', width: 168, height: 128, measure: half });
  assert.ok(half('chapter twenty-three', s.subtitleSize) <= 168 + 1e-6);
});

test('fit: no line under the title, the title alone fills it', () => {
  const r = fitCard({ title: 'Missions', width: 168, height: 128, measure: half });
  assert.equal(r.subtitleSize, 0);
  assert.ok(Math.abs(half('Missions', r.titleSize) - 168) < 0.5 || 1.05 * r.titleSize > 127);
});
