// Open cards that overlap on load are nudged apart; nothing else moves.

const { test } = require('node:test');
const assert = require('node:assert');
const { separateOpen, overlappingPairs } = require('../src/components/GraphViewer/openOverlap');

const open = (id, x, y) => ({ id, x, y, w: 230, h: 190 });

test('five open cards stacked on a spiral come apart', () => {
  const rects = [open('a', 0, 0), open('b', 120, 90), open('c', 160, 200), open('d', 60, 280), open('e', -80, 250)];
  assert.ok(overlappingPairs(rects) > 0);
  const moved = separateOpen(rects, { gap: 12 });
  const after = rects.map((r) => ({ ...r, ...(moved.get(r.id) || {}) }));
  assert.strictEqual(overlappingPairs(after, 11.9), 0);
});

test('cards that already clear each other do not move', () => {
  const rects = [open('a', 0, 0), open('b', 400, 0), open('c', 0, 400)];
  assert.strictEqual(separateOpen(rects).size, 0);
});

test('a nudge is small: two cards barely overlapping move only as far as they must', () => {
  const rects = [open('a', 0, 0), open('b', 230, 20)];
  const moved = separateOpen(rects, { gap: 12 });
  const a = moved.get('a'), b = moved.get('b');
  assert.ok(Math.abs(b.x - a.x - 242) < 1e-9);
  assert.strictEqual(a.y, 0);
  assert.strictEqual(b.y, 20);
});

test('two cards on exactly the same spot still separate, the same way every time', () => {
  const rects = [open('a', 50, 50), open('b', 50, 50)];
  const one = separateOpen(rects);
  const two = separateOpen(rects);
  assert.deepStrictEqual([...one], [...two]);
  const after = rects.map((r) => ({ ...r, ...one.get(r.id) }));
  assert.strictEqual(overlappingPairs(after), 0);
});
