// The roots reach for the containers (settings.opening.reach): which tips
// reach a container, where a rootlet stops short of its hull, the lag it
// follows its target with, the backdrop's strength as the graph is zoomed,
// an anchor's place on the art and in the graph's world.

const { test } = require('node:test');
const assert = require('node:assert');
const {
  reachConfig, backdropConfig, backdropOpacity, artPoint, anchorWorld, homeView,
  nearestTips, reachFor, insidePolygon, rayHit, reachEnd, createLag, reachShape, reachPath,
} = require('../src/lib/reach');
const { layoutKey } = require('../src/components/GraphViewer/layoutKey');

const square = (cx, cy, h) => [{ x: cx - h, y: cy - h }, { x: cx + h, y: cy - h }, { x: cx + h, y: cy + h }, { x: cx - h, y: cy + h }];

test('settings: off by default and without tips; tips as fractions, every default filled in', () => {
  assert.equal(reachConfig({}), null);
  assert.equal(reachConfig({ reach: { enabled: false, tips: [{ x: 0.5, y: 0.9 }] } }), null);
  assert.equal(reachConfig({ reach: { enabled: true, tips: [] } }), null, 'no tips, nothing to reach from');
  const c = reachConfig({ reach: { enabled: true, tips: [{ x: 0.2, y: 0.9 }, { x: 'a', y: 1 }, null, { x: 0.8, y: 0.95 }] } });
  assert.deepStrictEqual(c.tips, [{ x: 0.2, y: 0.9 }, { x: 0.8, y: 0.95 }], 'malformed tips dropped');
  assert.equal(c.perContainer, 3);
  assert.equal(c.stopShort, 18);
  assert.equal(c.lagMs, 600);
  assert.equal(c.drawMs, 1800);
  const odd = reachConfig({ reach: { enabled: true, tips: [{ x: 0, y: 0 }], perContainer: 0, stopShort: -4, lagMs: -1 } });
  assert.equal(odd.perContainer, 1);
  assert.equal(odd.stopShort, 0);
  assert.equal(odd.lagMs, 0);
});

test('tip to target: each container is reached from its nearest tips, nearest first', () => {
  const tips = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 200, y: 0 }, { x: 300, y: 0 }, { x: 400, y: 0 }];
  assert.deepStrictEqual(nearestTips(tips, { x: 290, y: 50 }, 3), [3, 2, 4]);
  assert.deepStrictEqual(nearestTips(tips, { x: 0, y: 100 }, 2), [0, 1]);
  assert.deepStrictEqual(nearestTips(tips, { x: 50, y: 0 }, 2), [0, 1], 'a tie goes to the earlier tip');
  assert.deepStrictEqual(nearestTips(tips, { x: 0, y: 0 }, 9), [0, 1, 2, 3, 4], 'never more than there are');
  // A tip under the container's outline is passed over for the next nearest.
  const c = { centre: { x: 300, y: 10 }, hull: square(300, 10, 40) };
  const r = reachFor(tips, c, 3, 18);
  assert.deepStrictEqual(r.map((x) => x.tip), [2, 4, 1], 'tip 3 is under it');
  assert.ok(r.every((x) => x.length > 0));
  assert.equal(reachFor(tips, c, 1, 18).length, 1);
});

test('the stop-short point: aimed at the centre, stopShort px before the hull', () => {
  const hull = square(200, 200, 50); // edges at 150 and 250
  const r = reachEnd({ x: 200, y: 0 }, { x: 200, y: 200 }, hull, 18);
  assert.deepStrictEqual(r.hit, { x: 200, y: 150, t: 0.75 });
  assert.ok(Math.abs(r.end.x - 200) < 1e-9 && Math.abs(r.end.y - 132) < 1e-9);
  assert.ok(Math.abs(r.length - 132) < 1e-9);
  const slant = reachEnd({ x: 0, y: 0 }, { x: 200, y: 200 }, hull, 18);
  assert.ok(Math.abs(Math.hypot(slant.hit.x - slant.end.x, slant.hit.y - slant.end.y) - 18) < 1e-9, 'stopShort measured along the way');
  assert.equal(reachEnd({ x: 210, y: 190 }, { x: 200, y: 200 }, hull, 18), null, 'a tip inside the hull grows nothing');
  assert.equal(reachEnd({ x: 200, y: 140 }, { x: 200, y: 200 }, hull, 18), null, 'too close to grow');
  assert.equal(reachEnd({ x: 200, y: 129 }, { x: 200, y: 200 }, hull, 18), null, 'a rootlet of 3 px would draw nothing: passed over');
  const short = reachEnd({ x: 200, y: 127 }, { x: 200, y: 200 }, hull, 18);
  assert.ok(short && Math.abs(short.length - 5) < 1e-9, 'one of 5 px grows');
  assert.ok(reachPath({ x: 200, y: 127 }, short.end, reachShape('s')).main, 'and is drawn');
  assert.ok(insidePolygon({ x: 200, y: 200 }, hull));
  assert.ok(!insidePolygon({ x: 0, y: 0 }, hull));
  assert.equal(rayHit({ x: 0, y: 0 }, { x: 10, y: 0 }, hull), null, 'a ray that misses');
});

test('the lag: a new target is eased to over lagMs from wherever the end is, and arrives', () => {
  const lag = createLag(600);
  lag.to({ x: 0, y: 0 }, 0);
  assert.deepStrictEqual(lag.at(0), { x: 0, y: 0 }, 'the first target is taken at once');
  assert.ok(lag.settled(0));
  lag.to({ x: 100, y: 0 }, 1000);
  assert.ok(!lag.settled(1000));
  const early = lag.at(1100).x, mid = lag.at(1300).x, late = lag.at(1500).x;
  assert.ok(early > 0 && early < mid && mid < late && late < 100, 'on its way, still moving');
  assert.ok(mid > 50, 'eased out: most of the way by half time');
  assert.deepStrictEqual(lag.at(1600), { x: 100, y: 0 }, 'arrived at lagMs');
  assert.ok(lag.settled(1600));
  // A target moved again mid-way is eased to from where the end has got to.
  lag.to({ x: 200, y: 0 }, 2000);
  const half = lag.at(2300).x;
  lag.to({ x: 0, y: 0 }, 2300);
  assert.ok(Math.abs(lag.at(2300).x - half) < 1e-9, 'no jump when re-aimed');
  assert.deepStrictEqual(lag.at(2900), { x: 0, y: 0 });
  const now = createLag(0);
  now.to({ x: 0, y: 0 }, 0);
  now.to({ x: 50, y: 5 }, 10);
  assert.deepStrictEqual(now.at(10), { x: 50, y: 5 }, 'lagMs 0 (reduced motion) follows at once');
});

test('a rootlet keeps its seeded shape, starts and ends on its two points, and no fork goes past its end', () => {
  const shape = reachShape('book|act-1|2');
  const a = reachPath({ x: 10, y: 20 }, { x: 310, y: 220 }, shape);
  const b = reachPath({ x: 10, y: 20 }, { x: 310, y: 220 }, reachShape('book|act-1|2'));
  assert.equal(a.main, b.main);
  assert.equal(a.fine, b.fine);
  assert.notEqual(a.main, reachPath({ x: 10, y: 20 }, { x: 310, y: 220 }, reachShape('book|act-2|2')).main);
  assert.ok(a.main.startsWith('M10 20') && a.main.endsWith('L310 220'));
  assert.ok(a.fine.length > 0, 'forks');
  const moved = reachPath({ x: 10, y: 20 }, { x: 330, y: 200 }, shape);
  assert.ok(moved.main.endsWith('L330 200'), 'the end follows');
  // Every fork point, projected on the way from p0 to p1, falls short of p1.
  const len = Math.hypot(300, 200), ux = 300 / len, uy = 200 / len;
  const pts = [...a.fine.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
  for (const [x, y] of pts) assert.ok((x - 10) * ux + (y - 20) * uy < len, 'short of the end');
  assert.deepStrictEqual(reachPath({ x: 0, y: 0 }, { x: 1, y: 1 }, shape), { main: '', fine: '' });
});

test('zoom to opacity: resting at the graph state zoom and out, down to the floor at zoomForFloor, held there', () => {
  const cfg = backdropConfig({ backdrop: { opacity: 1, opacityZoomedIn: 0.3, zoomForFloor: 2.5 } });
  assert.equal(backdropOpacity(cfg, 0.4, 0.4), 1);
  assert.equal(backdropOpacity(cfg, 0.2, 0.4), 1, 'zoomed out: resting');
  assert.ok(Math.abs(backdropOpacity(cfg, 1.0, 0.4) - 0.3) < 1e-9, 'the floor at 2.5x');
  assert.ok(Math.abs(backdropOpacity(cfg, 3.0, 0.4) - 0.3) < 1e-9, 'held further in');
  let prev = 1;
  for (let r = 1; r <= 2.5; r += 0.1) {
    const o = backdropOpacity(cfg, 0.4 * r, 0.4);
    assert.ok(o <= prev + 1e-12, 'falls as the reader zooms in');
    prev = o;
  }
  const mid = backdropOpacity(cfg, 0.4 * 1.75, 0.4);
  assert.ok(Math.abs(mid - 0.65) < 1e-9, 'half way down at half way');
  assert.equal(backdropOpacity(cfg, 0, 0.4), 1, 'no zoom yet: resting');
  assert.equal(backdropConfig({ graph: { artOpacity: 0.6 } }).opacity, 0.6, 'the earlier artOpacity');
  assert.equal(backdropConfig({ backdrop: { opacity: 0.8 }, graph: { artOpacity: 0.6 } }).opacity, 0.8, 'backdrop wins');
});

test('anchors: a fraction of the art to the screen, and into the world through the resting view', () => {
  const box = { left: 29, top: -221, width: 331, height: 670 };
  assert.deepStrictEqual(artPoint({ x: 0.5, y: 0.8 }, box), { x: 29 + 165.5, y: -221 + 536 });
  const view = homeView(0.4);
  const w = anchorWorld({ x: 0.5, y: 0.8 }, box, view);
  assert.ok(Math.abs(w.x * 0.4 - 194.5) < 1e-9 && Math.abs(w.y * 0.4 - 315) < 1e-9, 'back to the same screen point');
  const shifted = anchorWorld({ x: 0.5, y: 0.8 }, box, { x: 100, y: -50, k: 2 }, { x: 10, y: 20 });
  assert.ok(Math.abs(shifted.x - (194.5 - 10 - 100) / 2) < 1e-9 && Math.abs(shifted.y - (315 - 20 + 50) / 2) < 1e-9, 'any view, any origin');
  // The same anchor at another size of the art lands at the same place on it.
  const big = { left: 0, top: 0, width: 662, height: 1340 };
  const p = artPoint({ x: 0.25, y: 0.75 }, big);
  assert.deepStrictEqual([(p.x - big.left) / big.width, (p.y - big.top) / big.height], [0.25, 0.75]);
});

test('signature: anchors are part of the layout key; none keeps the old key', () => {
  const g = { spiral: { direction: 'outward' } };
  const anchors = { 'container:act-1': { x: 0.5, y: 0.8 }, 'container:act-2': { x: 0.8, y: 0.6 } };
  assert.equal(layoutKey('force', g), layoutKey('force', g, {}), 'no anchors, the key as before');
  assert.equal(layoutKey('force', g), layoutKey('force', g, { anchors: {} }));
  assert.notEqual(layoutKey('force', g), layoutKey('force', g, { anchors }), 'anchors change it');
  assert.equal(layoutKey('force', g, { anchors }), layoutKey('force', g, { anchors: { 'container:act-2': { x: 0.8, y: 0.6 }, 'container:act-1': { x: 0.5, y: 0.8 } } }), 'the order they are named in does not');
  assert.notEqual(layoutKey('force', g, { anchors }), layoutKey('force', g, { anchors: { ...anchors, 'container:act-1': { x: 0.5, y: 0.82 } } }), 'moving one does');
  assert.ok(!layoutKey('force', g, { anchors }).includes('::'));
});
