// graph.zoomMode 'grow-in-place' (growZoom.js): each anchored container grows
// about its own centre, which stays put on the screen; the zoom in stops
// where grown containers would come within the gap.
const test = require('node:test');
const assert = require('node:assert');

const { zoomModeOf, growShift, growConstrain, growCap, growFitRatio } = require('../src/components/GraphViewer/growZoom');
const { zoomAbout } = require('../src/components/GraphViewer/zoomPivot');

const close = (a, b, eps = 1e-9) => Math.abs(a - b) <= eps;
const screen = (v, p) => ({ x: v.x + v.k * p.x, y: v.y + v.k * p.y });
const plus = (p, s) => ({ x: p.x + s.x, y: p.y + s.y });

// The home view, as the graph rests (homeView: translate 0, 0 at homeK),
// and the pivot's screen point and world point under it.
const homeK = 0.4;
const home = { x: 0, y: 0, k: homeK };
const pivot = { x: 190, y: 640 };
const P = { x: pivot.x / homeK, y: pivot.y / homeK };

test('zoomModeOf: grow-in-place when asked for, geometric otherwise', () => {
  assert.equal(zoomModeOf({ zoomMode: 'grow-in-place' }), 'grow-in-place');
  assert.equal(zoomModeOf({}), 'geometric');
  assert.equal(zoomModeOf({ zoomMode: 'something' }), 'geometric');
  assert.equal(zoomModeOf(null), 'geometric');
});

test('growShift: at every zoom a container\'s centre is drawn where the home view draws it (its anchor)', () => {
  const G = { x: 150, y: 1900 }; // an act's centre in the world
  const atHome = screen(home, G);
  for (const r of [0.5, 1, 1.25, 2, 4, 8]) {
    const v = zoomAbout(home, r, pivot.x, pivot.y);
    const drawn = screen(v, plus(G, growShift(G, P, r)));
    assert.ok(close(drawn.x, atHome.x, 1e-6) && close(drawn.y, atHome.y, 1e-6), `r ${r}: ${drawn.x},${drawn.y} against ${atHome.x},${atHome.y}`);
  }
  assert.deepStrictEqual(growShift(G, P, 1), { x: 0, y: 0 });
});

test('growShift: every other point of the container lies r times as far from its centre on the screen', () => {
  const G = { x: 900, y: 1700 };
  const pts = [{ x: 960, y: 1700 }, { x: 900, y: 1620 }, { x: 830, y: 1777 }];
  for (const r of [0.5, 2, 3.7]) {
    const v = zoomAbout(home, r, pivot.x, pivot.y);
    const s = growShift(G, P, r);
    const c = screen(v, plus(G, s));
    for (const p of pts) {
      const q = screen(v, plus(p, s));
      const h = screen(home, p), hc = screen(home, G);
      assert.ok(close(q.x - c.x, r * (h.x - hc.x), 1e-6) && close(q.y - c.y, r * (h.y - hc.y), 1e-6));
    }
  }
});

test('growShift: two containers stay where they are on the screen, not pushed apart', () => {
  const A = { x: 200, y: 1900 }, B = { x: 950, y: 1950 };
  const r = 4;
  const v = zoomAbout(home, r, pivot.x, pivot.y);
  const a = screen(v, plus(A, growShift(A, P, r))), b = screen(v, plus(B, growShift(B, P, r)));
  const a0 = screen(home, A), b0 = screen(home, B);
  assert.ok(close(Math.hypot(b.x - a.x, b.y - a.y), Math.hypot(b0.x - a0.x, b0.y - a0.y), 1e-6));
  // Zoomed geometrically they would be four times as far apart.
  const ga = screen(v, A), gb = screen(v, B);
  assert.ok(close(Math.hypot(gb.x - ga.x, gb.y - ga.y), 4 * Math.hypot(b0.x - a0.x, b0.y - a0.y), 1e-6));
});

test('growConstrain: a pan is kept as it is; a zoom is about the given point and keeps a pan made before it', () => {
  const panned = { x: 30, y: -20, k: homeK }; // home, moved 30, -20 px
  assert.deepStrictEqual(growConstrain(home, panned, pivot.x, pivot.y), panned);
  // The pivot's world point is where the pan put it; zooming about there:
  const at = screen(panned, P);
  const next = growConstrain(panned, { x: 999, y: 999, k: homeK * 2 }, at.x, at.y);
  assert.ok(close(next.k, homeK * 2));
  const still = screen(next, P);
  assert.ok(close(still.x, at.x, 1e-6) && close(still.y, at.y, 1e-6));
  // A container's centre then stays where the pan put it.
  const G = { x: 300, y: 1800 };
  const drawn = screen(next, plus(G, growShift(G, P, next.k / homeK)));
  const want = { x: screen(home, G).x + 30, y: screen(home, G).y - 20 };
  assert.ok(close(drawn.x, want.x, 1e-6) && close(drawn.y, want.y, 1e-6));
});

test('growConstrain: a zoom in stops at kMax; one already past it goes no further in, and can still zoom out', () => {
  const kMax = homeK * 1.5;
  const capped = growConstrain(home, { x: 0, y: 0, k: homeK * 3 }, pivot.x, pivot.y, kMax);
  assert.ok(close(capped.k, kMax));
  const at = screen(home, P);
  const after = screen(capped, P);
  assert.ok(close(after.x, at.x, 1e-6) && close(after.y, at.y, 1e-6));
  const past = { x: 5, y: 7, k: homeK * 2 };
  assert.deepStrictEqual(growConstrain(past, { x: 0, y: 0, k: homeK * 2.5 }, pivot.x, pivot.y, kMax), { x: 5, y: 7, k: homeK * 2 });
  assert.ok(close(growConstrain(past, { x: 0, y: 0, k: homeK }, pivot.x, pivot.y, kMax).k, homeK));
});

test('growCap: the zoom at which two grown boxes come exactly within the gap, side by side or one above the other', () => {
  // Side by side: centres 500 apart (world), each 100 wide about its centre.
  const acts = [
    { id: 'a', centre: { x: 0, y: 0 }, box: { x0: -50, y0: -40, x1: 50, y1: 40 } },
    { id: 'b', centre: { x: 500, y: 0 }, box: { x0: 450, y0: -40, x1: 550, y1: 40 } },
  ];
  const cap = growCap(acts, { gap: 16, homeK: 0.5 });
  // 16 screen px at homeK 0.5 is 32 world: (500 - 32) / 100.
  assert.ok(close(cap, 4.68, 1e-9), String(cap));
  // At that ratio the grown boxes are exactly 16 screen px apart.
  const gapPx = ((500 - 50 * cap) - (0 + 50 * cap)) * 0.5;
  assert.ok(close(gapPx, 16, 1e-9));
  // One above the other, uneven boxes about off-centre centres.
  const stacked = [
    { id: 'a', centre: { x: 0, y: 0 }, box: { x0: -50, y0: -10, x1: 50, y1: 90 } },
    { id: 'b', centre: { x: 0, y: 300 }, box: { x0: -50, y0: 280, x1: 50, y1: 320 } },
  ];
  // a reaches 90 below its centre, b 20 above its own: (300 - 16) / 110.
  assert.ok(close(growCap(stacked, { gap: 16, homeK: 1 }), 284 / 110, 1e-9));
  // Apart along either axis is enough: the larger of the two limits.
  const diagonal = [
    { id: 'a', centre: { x: 0, y: 0 }, box: { x0: -50, y0: -50, x1: 50, y1: 50 } },
    { id: 'b', centre: { x: 200, y: 600 }, box: { x0: 150, y0: 550, x1: 250, y1: 650 } },
  ];
  assert.ok(close(growCap(diagonal, { gap: 0, homeK: 1 }), 6, 1e-9));
});

test('growCap: never under the home view, unlimited with one container, the least over every pair', () => {
  const touching = [
    { id: 'a', centre: { x: 0, y: 0 }, box: { x0: -60, y0: -40, x1: 60, y1: 40 } },
    { id: 'b', centre: { x: 100, y: 0 }, box: { x0: 40, y0: -40, x1: 160, y1: 40 } },
  ];
  assert.equal(growCap(touching, { gap: 16 }), 1);
  assert.equal(growCap(touching.slice(0, 1)), Infinity);
  assert.equal(growCap([]), Infinity);
  const three = [
    { id: 'a', centre: { x: 0, y: 0 }, box: { x0: -50, y0: -50, x1: 50, y1: 50 } },
    { id: 'b', centre: { x: 1000, y: 0 }, box: { x0: 950, y0: -50, x1: 1050, y1: 50 } },
    { id: 'c', centre: { x: 400, y: 0 }, box: { x0: 350, y0: -50, x1: 450, y1: 50 } },
  ];
  // a and c are the nearest pair: (400 - 16) / 100.
  assert.ok(close(growCap(three, { gap: 16, homeK: 1 }), 3.84, 1e-9));
});

test('growFitRatio: each box grown about its own centre to fit the area; a centre outside it is left out', () => {
  const area = { x0: 0, y0: 0, x1: 400, y1: 800 };
  const items = [
    { box: { x0: 20, y0: 300, x1: 120, y1: 380 }, at: { x: 70, y: 340 } },   // 50 from its centre to the left edge, 70 room
    { box: { x0: 250, y0: 600, x1: 330, y1: 700 }, at: { x: 290, y: 650 } },
  ];
  assert.ok(close(growFitRatio(items, area), 70 / 50, 1e-9));
  assert.equal(growFitRatio([{ box: { x0: -50, y0: 0, x1: 10, y1: 10 }, at: { x: -20, y: 5 } }], area), null);
  assert.equal(growFitRatio([], area), null);
});
