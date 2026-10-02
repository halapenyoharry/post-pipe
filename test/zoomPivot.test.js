// Zooming about a fixed point on the screen: the keys and Zoom to fit zoom
// about the viewport's middle and never re-centre on the graph.

const { test } = require('node:test');
const assert = require('node:assert');
const { zoomAbout, fitRatioAbout } = require('../src/components/GraphViewer/zoomPivot');

const world = (v, sx, sy) => [(sx - v.x) / v.k, (sy - v.y) / v.k];

test('zooming about a point keeps the world point under it', () => {
  const v = { x: 30, y: -40, k: 0.5 };
  for (const r of [2, 0.5, 1.25]) {
    const after = zoomAbout(v, r, 640, 400);
    assert.ok(Math.abs(after.k - v.k * r) < 1e-12);
    const [a, b] = world(v, 640, 400), [c, d] = world(after, 640, 400);
    assert.ok(Math.abs(a - c) < 1e-9 && Math.abs(b - d) < 1e-9);
  }
});

test('the fit ratio is the tightest side, zoomed about the pivot', () => {
  const area = { x0: 0, y0: 0, x1: 1000, y1: 800 };
  // A box around the centre, 200 wide and 100 tall: the width allows 5x, the height 8x.
  assert.strictEqual(fitRatioAbout({ x0: 400, y0: 350, x1: 600, y1: 450 }, 500, 400, area), 5);
  // Off to one side: the right edge, 300 from the pivot with 500 of room, limits it.
  assert.ok(Math.abs(fitRatioAbout({ x0: 520, y0: 390, x1: 800, y1: 410 }, 500, 400, area) - 500 / 300) < 1e-12);
  // Too big already: a ratio under 1 (zoom out).
  assert.ok(fitRatioAbout({ x0: -1000, y0: 0, x1: 2000, y1: 800 }, 500, 400, area) < 1);
});

test('no fit for an empty box or a pivot outside the area', () => {
  const area = { x0: 0, y0: 0, x1: 100, y1: 100 };
  assert.strictEqual(fitRatioAbout(null, 50, 50, area), null);
  assert.strictEqual(fitRatioAbout({ x0: 10, y0: 10, x1: 10, y1: 20 }, 50, 50, area), null);
  assert.strictEqual(fitRatioAbout({ x0: 10, y0: 10, x1: 20, y1: 20 }, 150, 50, area), null);
});

const { repivot, zoomPivotMode } = require('../src/components/GraphViewer/zoomPivot');

test('a zoom asked about the pointer becomes the same zoom about the pivot', () => {
  const prev = { x: 120, y: -60, k: 0.4 };
  // A wheel step in at the screen's corner: d3 keeps the corner's world point.
  const atCorner = zoomAbout(prev, 1.149, 1270, 790);
  const v = repivot(prev, atCorner, 623, 285);
  assert.ok(Math.abs(v.k - atCorner.k) < 1e-12);
  const [a, b] = world(prev, 623, 285), [c, d] = world(v, 623, 285);
  assert.ok(Math.abs(a - c) < 1e-9 && Math.abs(b - d) < 1e-9);
  // Ten steps keep the pivot's world point exactly where it was.
  let w = prev;
  for (let i = 0; i < 10; i++) w = repivot(w, zoomAbout(w, 1.149, 10, 10), 623, 285);
  const [e, f] = world(w, 623, 285);
  assert.ok(Math.abs(a - e) < 1e-9 && Math.abs(b - f) < 1e-9);
  assert.ok(Math.abs(w.k - prev.k * Math.pow(1.149, 10)) < 1e-9);
});

test('a pan passes through; out as well as in is pivoted', () => {
  const prev = { x: 10, y: 20, k: 1 };
  assert.deepStrictEqual(repivot(prev, { x: 40, y: -5, k: 1 }, 300, 300), { x: 40, y: -5, k: 1 });
  const out = repivot(prev, { x: 0, y: 0, k: 0.5 }, 300, 300);
  assert.deepStrictEqual(out, zoomAbout(prev, 0.5, 300, 300));
});

test('graph.zoomPivot: art, or the pointer by default', () => {
  assert.strictEqual(zoomPivotMode({ zoomPivot: 'art' }), 'art');
  assert.strictEqual(zoomPivotMode({ zoomPivot: 'pointer' }), 'pointer');
  assert.strictEqual(zoomPivotMode({}), 'pointer');
  assert.strictEqual(zoomPivotMode(null), 'pointer');
});
