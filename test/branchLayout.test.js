// The branch layout: a container's items on the ends of the branches of a
// traced skeleton, easiest first; branches grown when there are more items
// than tips; cards that never meet; each act's label on its main root.

const { test } = require('node:test');
const assert = require('node:assert');
const { parseRoots, rootsModel, bentRoots } = require('../src/lib/rootsVector');
const BL = require('../src/components/GraphViewer/branchLayout');
const { containerLayout, containerLayoutOf } = require('../src/components/GraphViewer/containerLayout');

// An SVG in the trace's format: edges from node to node, each drawn in
// parts two points long, tapering, and a circle for each tip.
function svgOf(w, h, edges, crown) {
  let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" data-roots-crown="${crown.join(',')}">\n<g fill="none">\n`;
  const tips = [];
  edges.forEach((e, i) => {
    const pts = e.pts;
    for (let k = 1; k < pts.length; k++) {
      const width = Math.max(1.5, (e.width || 6) * (1 - (0.5 * k) / pts.length));
      const grey = Math.round(139 + 5.6 * width).toString(16).padStart(2, '0');
      out += `<path data-e="${i}" data-a="${e.a}" data-b="${e.b}"${e.tip ? ` data-tip="${e.tip}"` : ''} data-part="${k - 1}" stroke="#${grey}${grey}${grey}" stroke-width="${width.toFixed(1)}" d="M${pts[k - 1].join(',')}L${pts[k].join(',')}"/>\n`;
    }
    if (e.tip) tips.push(`<circle data-tip="${e.tip}" data-node="${e.b}" cx="${pts[pts.length - 1][0]}" cy="${pts[pts.length - 1][1]}" r="0"/>`);
  });
  return `${out}</g>\n<g data-tips="">${tips.join('')}</g>\n</svg>`;
}
// A line from a to b in n steps.
const line = (a, b, n = 4) => Array.from({ length: n + 1 }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n]);

// Small: the crown at (200, 0); a trunk down the middle (the tap root, to
// t1, the farthest tip); two tips the same way along, either side of it (t2,
// t3); and two straight from the crown, the same length, at different angles
// from the tap root (tA nearer it, tB further).
const SMALL = svgOf(400, 400, [
  { a: 0, b: 1, pts: line([200, 0], [200, 100]), width: 12 },
  { a: 1, b: 2, pts: line([200, 100], [200, 220]), width: 9 },
  { a: 2, b: 3, tip: 't1', pts: line([200, 220], [200, 320]), width: 5 },
  { a: 2, b: 4, tip: 't2', pts: line([200, 220], [150, 280]), width: 4 },
  { a: 2, b: 5, tip: 't3', pts: line([200, 220], [250, 280]), width: 4 },
  { a: 0, b: 6, tip: 'tA', pts: line([200, 0], [260, 80]), width: 4 },
  { a: 0, b: 7, tip: 'tB', pts: line([200, 0], [120, 60]), width: 4 },
], [200, 0]);

// A fixture skeleton to fill: a crown at (500, 100) in a picture 1000 by
// 800; three branches leave it (left, down, right), each forking twice,
// eleven tips in all.
function bigEdges() {
  const E = [];
  const add = (a, b, from, to, width, tip) => { E.push({ a, b, tip, pts: line(from, to, 5), width }); return to; };
  const c = [500, 100];
  // Left.
  const l1 = add(0, 1, c, [330, 220], 14);
  add(1, 2, l1, [180, 260], 6, 'L1');
  const l2 = add(1, 3, l1, [300, 380], 9);
  add(3, 4, l2, [190, 470], 5, 'L2');
  add(3, 5, l2, [330, 520], 5, 'L3');
  // Down.
  const d1 = add(0, 6, c, [500, 300], 16);
  const d2 = add(6, 7, d1, [460, 460], 10);
  add(7, 8, d2, [410, 600], 5, 'D1');
  add(7, 9, d2, [520, 620], 5, 'D2');
  add(6, 10, d1, [600, 430], 6, 'D3');
  // Right.
  const r1 = add(0, 11, c, [680, 230], 14);
  add(11, 12, r1, [830, 250], 6, 'R1');
  const r2 = add(11, 13, r1, [720, 380], 9);
  add(13, 14, r2, [820, 470], 5, 'R2');
  add(13, 15, r2, [700, 520], 5, 'R3');
  add(13, 16, r2, [760, 560], 4, 'R4');
  return E;
}
const BIG = svgOf(1000, 800, bigEdges(), [500, 100]);
const ALL = ['L1', 'L2', 'L3', 'D1', 'D2', 'D3', 'R1', 'R2', 'R3', 'R4'];

const model = (svg) => rootsModel(parseRoots(svg));

test('order: nearest the crown along the skeleton first', () => {
  const m = model(SMALL);
  const info = BL.skeletonInfo(m);
  assert.equal(info.tap, 't1');
  assert.ok(Math.abs(info.tapAngle - Math.PI / 2) < 1e-9);
  assert.deepStrictEqual(BL.orderTips(m, ['t1', 't2', 'tA']), ['tA', 't2', 't1']);
});

test('order: the same distance along, the smaller angle from the tap root first, then as given', () => {
  const m = model(SMALL);
  // tA and tB are both 100 along; tA is 37 degrees off the tap root, tB 53.
  assert.deepStrictEqual(BL.orderTips(m, ['tB', 'tA']), ['tA', 'tB']);
  // t2 and t3 are the same distance along and the same angle off it.
  assert.deepStrictEqual(BL.orderTips(m, ['t3', 't2']), ['t3', 't2']);
  assert.deepStrictEqual(BL.orderTips(m, ['t2', 't3']), ['t2', 't3']);
  // Names the skeleton does not have are left out.
  assert.deepStrictEqual(BL.orderTips(m, ['nope', 't1']), ['t1']);
});

test('assignment: fewer items than tips take the nearest, equal take them all, more grow the rest', () => {
  const m = model(BIG);
  const ordered = BL.orderTips(m, ALL);
  const fewer = BL.growBranches(m, [{ id: 'a', tips: ALL, count: 3 }]);
  assert.deepStrictEqual(fewer.order.get('a'), ordered.slice(0, 3));
  assert.equal(fewer.grown.length, 0);
  const equal = BL.growBranches(m, [{ id: 'a', tips: ALL, count: ALL.length }]);
  assert.deepStrictEqual(equal.order.get('a'), ordered);
  assert.equal(equal.grown.length, 0);
  const more = BL.growBranches(m, [{ id: 'a', tips: ALL, count: 14 }]);
  const names = more.order.get('a');
  assert.equal(names.length, 14);
  assert.deepStrictEqual(names.slice(0, ALL.length), ordered);
  assert.equal(more.grown.length, 4);
  // The grown ones after the traced ones, nearest first among themselves.
  const L = (n) => more.extra.get(n).L;
  const grownNames = names.slice(ALL.length);
  assert.ok(grownNames.every((n) => more.model.tips.get(n).grown));
  for (let i = 1; i < grownNames.length; i++) assert.ok(L(grownNames[i - 1]) <= L(grownNames[i]) + 1e-9);
});

test('growth: the same every time, its tips free and inside the act\'s space, never upward of the crown', () => {
  const m = model(BIG);
  const acts = [
    { id: 'left', tips: ['L1', 'L2', 'L3'], count: 8 },
    { id: 'down', tips: ['D1', 'D2', 'D3'], count: 3 },
    { id: 'right', tips: ['R1', 'R2', 'R3', 'R4'], count: 9 },
  ];
  const a = BL.growBranches(m, acts);
  const b = BL.growBranches(model(BIG), acts.map((x) => ({ ...x })));
  assert.equal(a.grown.length, 5 + 5);
  assert.deepStrictEqual(JSON.stringify(a.grown.map((e) => [e.tip, e.host, e.parts])), JSON.stringify(b.grown.map((e) => [e.tip, e.host, e.parts])));
  // Another count grows them differently (the seed is the act and its count).
  const c = BL.growBranches(m, [{ ...acts[0], count: 7 }]);
  assert.notDeepStrictEqual(c.grown[0].parts, a.grown[0].parts);
  const spaces = BL.actSpaces(m, acts);
  const style = BL.traceStyle(m);
  const tips = [...a.model.tips.entries()];
  for (const e of a.grown) {
    const end = a.model.tips.get(e.tip);
    // Inside its own act's space, every point of it.
    for (const part of e.parts) for (const [x, y] of part.pts.slice(1)) assert.equal(spaces.actAt(x, y), e.act, `${e.tip} at ${x},${y}`);
    // Free: not on any other tip.
    for (const [name, t] of tips) if (name !== e.tip) assert.ok(Math.hypot(t.x - end.x, t.y - end.y) >= style.spacing * 0.2, `${e.tip} near ${name}`);
    // Below the crown, tapering, in the skeleton's greys.
    assert.ok(e.parts.every((p) => p.pts.every(([, y]) => y > 100)));
    assert.ok(e.parts[0].width >= e.parts[e.parts.length - 1].width);
    assert.ok(e.parts.every((p) => /^#([0-9a-f]{2})\1\1$/.test(p.stroke)));
  }
  // None crossing a branch: the strictest relaxation for all of them.
  assert.ok([...a.levels.values()].flat().every((l) => l <= 2));
});

test('growth: what the trace\'s own branches measure', () => {
  const st = BL.traceStyle(model(BIG));
  assert.ok(st.forkAngle[0] > 0 && st.forkAngle[1] >= st.forkAngle[0]);
  assert.ok(st.length[0] > 0 && st.length[1] >= st.length[0]);
  assert.ok(st.outward > 0 && st.outward < Math.PI / 2);
  assert.ok(st.grey && st.grey.b > 0);
});

// The cards on the big fixture, the world the art's own px.
function placeOn(m, count) {
  const g = BL.growBranches(m, [{ id: 'a', tips: ALL, count }]);
  const slots = g.order.get('a').map((tip, rank) => {
    const path = BL.pathToTip(g.model, tip);
    return { id: `c${rank + 1}`, act: 'a', rank, tip, path, L: BL.polyLength(path), w: 60, h: 46, minScale: 0.5 };
  }).sort((p, q) => p.L - q.L || p.rank - q.rank);
  const bounds = { x0: 0, y0: 100, x1: 1000, y1: 800 };
  return { g, slots, ...BL.placeCards(slots, { gap: 3, bounds }) };
}

for (const count of [1, 11, 16, 40]) {
  test(`cards: ${count} on the fixture, none meeting another, each on its tip or slid along its branch`, () => {
    const { g, slots, cards } = placeOn(model(BIG), count);
    assert.equal(cards.size, count);
    const list = [...cards.values()];
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      assert.ok(!BL.rectsMeet(list[i].rect, list[j].rect, 0), `${i} and ${j} meet`);
    }
    for (const sl of slots) {
      const c = cards.get(sl.id);
      // The near edge on the anchor: the anchor on the card's edge.
      const r = c.rect;
      const dx = Math.max(r.x0 - c.anchor.x, 0, c.anchor.x - r.x1), dy = Math.max(r.y0 - c.anchor.y, 0, c.anchor.y - r.y1);
      const inside = c.anchor.x > r.x0 + 1e-6 && c.anchor.x < r.x1 - 1e-6 && c.anchor.y > r.y0 + 1e-6 && c.anchor.y < r.y1 - 1e-6;
      assert.ok(Math.hypot(dx, dy) < 1e-6 && !inside, `${sl.id}'s edge is not on its anchor`);
      if (!c.slid) assert.ok(Math.hypot(c.anchor.x - c.tip.x, c.anchor.y - c.tip.y) < 1e-9);
      // The anchor on the branch from the crown to the tip.
      const near = sl.path.slice(1).reduce((d, q, k) => {
        const a = sl.path[k], vx = q.x - a.x, vy = q.y - a.y, L2 = vx * vx + vy * vy;
        const t = L2 ? Math.max(0, Math.min(1, ((c.anchor.x - a.x) * vx + (c.anchor.y - a.y) * vy) / L2)) : 0;
        return Math.min(d, Math.hypot(c.anchor.x - (a.x + t * vx), c.anchor.y - (a.y + t * vy)));
      }, Infinity);
      assert.ok(near < 1e-6);
      assert.ok(c.scale >= 0.5 - 1e-9 && c.scale <= 1 + 1e-9);
      assert.ok(r.y0 >= 100 - 1e-9 && r.x0 >= -1e-9 && r.x1 <= 1000 + 1e-9);
    }
    assert.equal(g.order.get('a').length, count);
  });
}

test('cards: tips too close shrink first, then slide toward the crown', () => {
  // Two tips 20 apart at the ends of two branches; cards 60 wide.
  const m = model(svgOf(400, 400, [
    { a: 0, b: 1, pts: line([200, 0], [200, 200]), width: 8 },
    { a: 1, b: 2, tip: 'p', pts: line([200, 200], [190, 300]), width: 3 },
    { a: 1, b: 3, tip: 'q', pts: line([200, 200], [210, 300]), width: 3 },
  ], [200, 0]));
  const slot = (id, tip) => ({ id, act: 'a', path: BL.pathToTip(m, tip), w: 60, h: 46, minScale: 0.5 });
  const { cards, stats } = BL.placeCards([slot('one', 'p'), slot('two', 'q')], { gap: 2 });
  const one = cards.get('one'), two = cards.get('two');
  assert.ok(!BL.rectsMeet(one.rect, two.rect, 0));
  const st = stats.get('a');
  assert.ok(st.shrunk >= 1);
  assert.equal(st.slid, 1);
  // The first stays on its tip; the second slid toward the crown.
  assert.equal(one.slid, 0);
  assert.ok(two.slid > 0 && two.anchor.y < 300);
});

test('cardAt: the near edge on the point, the card outward along the direction', () => {
  const down = BL.cardAt({ x: 0, y: 0 }, { x: 0, y: 1 }, 60, 40);
  assert.deepStrictEqual([down.cx, down.cy, down.y0], [0, 20, 0]);
  const right = BL.cardAt({ x: 10, y: 10 }, { x: 1, y: 0 }, 60, 40);
  assert.deepStrictEqual([right.x0, right.cy], [10, 10]);
  const s = Math.SQRT1_2;
  const diag = BL.cardAt({ x: 0, y: 0 }, { x: s, y: s }, 60, 40);
  // Corner-wise the shorter side decides: the top edge is on the point.
  assert.ok(Math.abs(diag.y0) < 1e-9 && diag.x0 < 0);
});

test('labels: on the main root, as large as fits, clear of the cards\' room', () => {
  const m = model(BIG);
  const acts = [{ id: 'left', tips: ['L1', 'L2', 'L3'] }, { id: 'down', tips: ['D1', 'D2', 'D3'] }, { id: 'right', tips: ['R1', 'R2', 'R3', 'R4'] }];
  const spaces = BL.actSpaces(m, acts);
  const roots = BL.mainRoots(m, spaces.owner, 'down');
  // The way down: the crown, the trunk, the widest way at each fork, a tip.
  assert.equal(roots.length, 1);
  assert.deepStrictEqual(roots[0][0], { x: 500, y: 100 });
  assert.deepStrictEqual(roots[0][roots[0].length - 1], { x: 410, y: 600 });
  const size = (f) => ({ w: f * 4, h: f * 1.2 });
  const obstacle = { x0: 480, y0: 320, x1: 560, y1: 380 };
  const labels = BL.placeLabels(acts.map((a) => ({ id: a.id, roots: BL.mainRoots(m, spaces.owner, a.id), size })), {
    bounds: { x0: 0, y0: 100, x1: 1000, y1: 800 }, actAt: (x, y) => spaces.actAt(x, y), obstacles: [obstacle], gap: 2, max: 100,
  });
  const rects = [...labels.values()].map((l) => l.rect);
  for (const [id, l] of labels) {
    assert.equal(l.relaxed, 0, id);
    assert.ok(l.size > 8, id);
    assert.ok(!BL.rectsMeet(l.rect, obstacle, 0), id);
    assert.ok(l.rect.y0 >= 100);
    // Centred on its main root.
    const root = BL.mainRoots(m, spaces.owner, id)[0];
    const on = root.some((q, k) => k && Math.abs((q.x - root[k - 1].x) * (l.cy - root[k - 1].y) - (q.y - root[k - 1].y) * (l.cx - root[k - 1].x)) < 1e-6 * Math.hypot(q.x - root[k - 1].x, q.y - root[k - 1].y) + 1e-6
      && Math.min(q.x, root[k - 1].x) - 1e-6 <= l.cx && l.cx <= Math.max(q.x, root[k - 1].x) + 1e-6);
    assert.ok(on, `${id}'s label is not on its main root`);
  }
  for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) assert.ok(!BL.rectsMeet(rects[i], rects[j], 0));
});

test('the container layout takes what the branch layout placed: a label alone closed, cards where given open', () => {
  const GS = { containerLayout: 'branches' };
  assert.equal(containerLayoutOf({ id: 'x', branches: ['t1'] }, GS), 'branches');
  assert.equal(containerLayoutOf({ id: 'x' }, GS), null);
  const containers = [{ id: 'book' }, { id: 'act', parent: 'book', branches: ['t1'] }];
  const members = new Map([['book', []], ['act', [{ id: 'n1', w: 100, h: 80, order: 1 }, { id: 'n2', w: 100, h: 80, order: 2 }]]]);
  const placed = { label: { x0: -40, y0: -10, x1: 40, y1: 10 }, members: new Map([['n1', { x: 0, y: 100, scale: 0.5, tipOffset: { x: 0, y: 20 } }], ['n2', { x: 200, y: 50, scale: 0.4, tipOffset: { x: 20, y: 0 } }]]) };
  const run = (closed) => containerLayout({
    containers, members, closed, labelSize: () => ({ w: 50, h: 20 }),
    options: { placedOf: (c) => (c.id === 'act' ? placed : null) },
  });
  const open = run(new Set());
  const act = open.containers.get('act');
  assert.equal(act.branches, true);
  assert.equal(act.closed, false);
  const rel = (r) => ({ x0: r.x0 - act.center.x, y0: r.y0 - act.center.y, x1: r.x1 - act.center.x, y1: r.y1 - act.center.y });
  assert.deepStrictEqual(rel(act.box), { x0: -40, y0: -10, x1: 220, y1: 120 });
  const n1 = open.nodes.get('n1');
  const offset = { x: n1.x - (act.center.x), y: n1.y - act.center.y };
  assert.deepStrictEqual(offset, { x: 0, y: 100 });
  assert.equal(n1.scale, 0.5);
  assert.deepStrictEqual(n1.tipOffset, { x: 0, y: 20 });
  const shut = run(new Set(['act'])).containers.get('act');
  assert.equal(shut.closed, true);
  assert.deepStrictEqual({ w: shut.box.x1 - shut.box.x0, h: shut.box.y1 - shut.box.y0 }, { w: 80, h: 20 });
});

test('a grown branch bends with the point it grows from', () => {
  const m = model(BIG);
  const g = BL.growBranches(m, [{ id: 'a', tips: ALL, count: 12 }]);
  const e = g.grown[0];
  // Bend the root to the tip the grown branch's host leads to.
  const hostEdge = g.model.edges.find((x) => x.e === e.host.e);
  let tip = hostEdge.tip;
  if (!tip) tip = [...g.model.chains.entries()].find(([, ch]) => ch.some((x) => x.e === hostEdge.e))[0];
  const bent = bentRoots(g.model, new Map([['a', [tip]]]), new Map([['a', { dx: 30, dy: 0 }]]));
  const hostPts = bent.get(hostEdge.e)[e.host.part];
  const was = hostEdge.parts[e.host.part].pts[e.host.k];
  const moved = hostPts[e.host.k][0] - was[0];
  const mine = bent.get(e.e);
  assert.ok(Math.abs(mine[0][0][0] - e.parts[0].pts[0][0] - moved) < 1e-9);
  assert.ok(Math.abs(mine[mine.length - 1].slice(-1)[0][0] - e.parts[e.parts.length - 1].pts.slice(-1)[0][0] - moved) < 1e-9);
});
