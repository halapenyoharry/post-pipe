// Open acts never overlap: an opening act is pushed the way its spiral opens
// until it clears every other act, with a gap between.

const { test } = require('node:test');
const assert = require('node:assert');
const { actsApart, boxesMeet } = require('../src/components/GraphViewer/actsApart');

const box = (cx, cy, w, h) => ({ x0: cx - w / 2, y0: cy - h / 2, x1: cx + w / 2, y1: cy + h / 2 });
const apply = (acts, moved) => acts.map((a) => {
  const m = moved.get(a.id);
  return m ? { ...a, box: { x0: a.box.x0 + m.dx, y0: a.box.y0 + m.dy, x1: a.box.x1 + m.dx, y1: a.box.y1 + m.dy } } : a;
});
const anyMeet = (acts, gap) => acts.some((a, i) => acts.some((b, j) => j > i && boxesMeet(a.box, b.box, gap)));

test('three acts open at once, each over its neighbours, come apart with 16 between, each along its own way', () => {
  // Act Two at the left opening down-left, Act Three at the right opening
  // down-right, Act One at the bottom centre opening down: open, each box
  // reaches into the next.
  const acts = [
    { id: 'one', box: box(500, 900, 700, 600), open: true, towards: 'down' },
    { id: 'two', box: box(150, 700, 600, 500), open: true, towards: 'down-left' },
    { id: 'three', box: box(850, 720, 600, 500), open: true, towards: 'down-right' },
  ];
  assert.ok(anyMeet(acts, 16), 'they meet before');
  const moved = actsApart(acts, { gap: 16 });
  const after = apply(acts, moved);
  assert.ok(!anyMeet(after, 15.999), 'no two meet after, 16 apart');
  for (const a of acts) {
    const m = moved.get(a.id);
    if (!m) continue;
    const want = { one: [0, 1], two: [-1, 1], three: [1, 1] }[a.id];
    assert.ok(Math.abs(Math.atan2(m.dy, m.dx) - Math.atan2(want[1], want[0])) < 1e-9, `${a.id} moved along its way`);
  }
});

test('the push is the least that clears', () => {
  const acts = [
    { id: 'pill', box: box(0, 0, 100, 60), open: false },
    { id: 'open', box: box(0, 50, 200, 100), open: true, towards: 'down' },
  ];
  const m = actsApart(acts, { gap: 16 }).get('open');
  // The open box's top is at 0, the pill's foot at 30: down by 46.
  assert.ok(Math.abs(m.dy - 46) < 0.01, `pushed ${m.dy}`);
  assert.equal(m.dx, 0);
});

test('acts already clear, closed acts and dragged acts do not move', () => {
  const clear = [
    { id: 'a', box: box(0, 0, 100, 100), open: true, towards: 'down' },
    { id: 'b', box: box(300, 0, 100, 100), open: true, towards: 'down' },
  ];
  assert.equal(actsApart(clear).size, 0);
  const closed = [
    { id: 'a', box: box(0, 0, 100, 100), open: false },
    { id: 'b', box: box(10, 10, 100, 100), open: false },
  ];
  assert.equal(actsApart(closed).size, 0, 'closed pills are not pushed');
  const fixed = [
    { id: 'a', box: box(0, 0, 100, 100), open: false },
    { id: 'b', box: box(10, 10, 100, 100), open: true, towards: 'down', fixed: true },
  ];
  assert.equal(actsApart(fixed).size, 0, 'an act the reader put there stays');
});

test('the same input gives the same pushes', () => {
  const acts = [
    { id: 'a', box: box(0, 0, 300, 300), open: true, towards: 'down-left' },
    { id: 'b', box: box(50, 50, 300, 300), open: true, towards: 'down-right' },
    { id: 'c', box: box(100, 0, 300, 300), open: true, towards: 'down' },
  ];
  assert.deepStrictEqual([...actsApart(acts)], [...actsApart(acts)]);
  assert.ok(!anyMeet(apply(acts, actsApart(acts)), 15.999));
});
