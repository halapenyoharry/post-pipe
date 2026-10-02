// The hanging layout: a container hangs from its anchor, the top of its
// hull, its members in a chain at most `columns` cards wide that goes down
// the far side and comes back up the near side.

const { test } = require('node:test');
const assert = require('node:assert');
const {
  containerLayout, rectsOverlap, hangChain, hangRows, hangOptions,
  containerLayoutOf, hullDrawn, closedPillScaleOf,
} = require('../src/components/GraphViewer/containerLayout');

const W = 180, H = 140, PAD = 90, GAP = 12;
const card = (id, order) => ({ id, w: W, h: H, order });
const rectOf = (p) => ({ x0: p.x - W / 2, y0: p.y - H / 2, x1: p.x + W / 2, y1: p.y + H / 2 });

function hanging(n, { hang = {}, closed, label = { w: 150, h: 70 } } = {}) {
  const containers = [{ id: 'act', parent: null }];
  const members = new Map([['act', Array.from({ length: n }, (_, i) => card('c' + (i + 1), i + 1))]]);
  return containerLayout({
    containers, members, closed,
    labelSize: () => label,
    macroSize: () => ({ w: 162, h: 126 }),
    options: { gap: 28, padding: () => PAD, layoutOf: () => 'hang', hangOf: () => ({ gap: GAP, ...hang }) },
  });
}
const pts = (L, n) => Array.from({ length: n }, (_, i) => L.nodes.get('c' + (i + 1)));
// The top of the hull as drawn: each card padded by PAD, the label by PAD/2.
function hullTop(L) {
  const info = L.containers.get('act');
  const cards = [...L.nodes.values()].map((p) => p.y - H / 2 - PAD);
  return Math.min(info.label.y0 - PAD / 2, ...cards);
}
function allApart(points) {
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (rectsOverlap(rectOf(points[i]), rectOf(points[j]))) return [i + 1, j + 1];
    }
  }
  return null;
}

test('the chain keeps reading order, each member one card step from the last', () => {
  const L = hanging(11);
  const p = pts(L, 11);
  for (let i = 1; i < p.length; i++) {
    const dx = Math.abs(p[i].x - p[i - 1].x), dy = Math.abs(p[i].y - p[i - 1].y);
    // A step down or up a column, or across to the next column on the same row.
    const down = dx < 1e-6 && Math.abs(dy - (H + GAP)) < 1e-6;
    const across = dy < 1e-6 && Math.abs(dx - (W + GAP)) < 1e-6;
    assert.ok(down || across, `chapter ${i} to ${i + 1}: ${dx}, ${dy}`);
  }
});

test('firstAt bottom: the first member low on the far side, the last at the top under the anchor', () => {
  const L = hanging(11);
  const p = pts(L, 11);
  const topY = Math.min(...p.map((q) => q.y));
  const bottomY = Math.max(...p.map((q) => q.y));
  assert.strictEqual(p[10].y, topY, 'the last is at the top');
  assert.ok(Math.abs(p[10].x) < W, 'under the anchor');
  assert.ok(p[0].y >= (topY + bottomY) / 2, 'the first is at the middle or lower');
  assert.ok(p[0].x > 0, 'on the far side (right, for down)');
  // Down the far side, then up the near side.
  const far = p.filter((q) => q.x > 0), near = p.filter((q) => q.x < 0);
  for (let i = 1; i < far.length; i++) assert.ok(far[i].y > far[i - 1].y, 'down the far side');
  for (let i = 1; i < near.length; i++) assert.ok(near[i].y < near[i - 1].y, 'up the near side');
  assert.strictEqual(near.length, hangRows(11, 2));
});

test('firstAt top reverses it: the first member under the anchor', () => {
  const L = hanging(11, { hang: { firstAt: 'top' } });
  const p = pts(L, 11);
  assert.strictEqual(p[0].y, Math.min(...p.map((q) => q.y)));
  assert.ok(p[10].y > p[0].y);
});

test("the hull's top is at the anchor, and nothing rises above it", () => {
  for (const n of [1, 2, 3, 11, 40]) {
    for (const direction of ['down', 'down-left', 'down-right']) {
      const L = hanging(n, { hang: { direction } });
      const info = L.containers.get('act');
      assert.ok(Math.abs(hullTop(L)) < 1e-6, `${n} ${direction}: top at ${hullTop(L)}`);
      assert.strictEqual(info.box.y0, 0);
      assert.deepStrictEqual(info.center, { x: 0, y: 0 });
    }
  }
  // A label too wide to sit beside the chain goes above it, still under the anchor.
  const L = hanging(11, { label: { w: 400, h: 80 } });
  assert.ok(Math.abs(hullTop(L)) < 1e-6);
  const info = L.containers.get('act');
  for (const p of L.nodes.values()) assert.ok(p.y - H / 2 >= info.label.y1, 'cards below the label');
});

test('the chain is at most `columns` cards wide', () => {
  for (const columns of [1, 2, 3]) {
    const L = hanging(11, { hang: { columns } });
    const xs = new Set([...L.nodes.values()].map((p) => Math.round(p.x)));
    assert.ok(xs.size <= columns, `${columns}: ${xs.size} columns`);
  }
  assert.strictEqual(hangOptions({}).columns, 2);
});

test('directions: down is centred on the anchor; the sides hang outward from it', () => {
  const xs = (L) => [...L.nodes.values()].map((p) => p.x);
  const down = xs(hanging(11, { hang: { direction: 'down' } }));
  assert.ok(Math.abs((Math.min(...down) + Math.max(...down)) / 2) < 1e-6, 'centred');
  // The hull (each card padded by PAD) stays wholly on its side of the anchor.
  const right = hanging(11, { hang: { direction: 'down-right' } });
  for (const x of xs(right)) assert.ok(x - W / 2 - PAD >= -1e-6, 'right of the anchor');
  assert.ok(right.containers.get('act').label.x0 - PAD / 2 >= -1e-6);
  const left = hanging(11, { hang: { direction: 'down-left' } });
  for (const x of xs(left)) assert.ok(x + W / 2 + PAD <= 1e-6, 'left of the anchor');
  assert.ok(left.containers.get('act').label.x1 + PAD / 2 <= 1e-6);
  // The last member hangs right under the anchor: the hull's inner edge on it.
  assert.ok(Math.abs(right.nodes.get('c11').x - W / 2 - PAD) < 1e-6);
  assert.ok(Math.abs(left.nodes.get('c11').x + W / 2 + PAD) < 1e-6);
});

test('no two cards overlap, nor the label a card, for 1, 2, 11 and 40', () => {
  for (const n of [1, 2, 11, 40]) {
    for (const direction of ['down', 'down-left', 'down-right']) {
      for (const firstAt of ['bottom', 'top']) {
        const L = hanging(n, { hang: { direction, firstAt } });
        const p = pts(L, n);
        assert.strictEqual(allApart(p), null, `${n} ${direction} ${firstAt}`);
        const label = L.containers.get('act').label;
        for (const q of p) assert.ok(!rectsOverlap(label, rectOf(q)), `${n} ${direction} label on a card`);
      }
    }
  }
});

test('the label sits beside the top of the chain when it fits', () => {
  const L = hanging(11);
  const info = L.containers.get('act');
  assert.ok(info.hang.labelBeside);
  // In the far column, above the first member.
  const first = L.nodes.get('c1');
  assert.ok(info.label.y1 <= first.y - H / 2);
  assert.ok((info.label.x0 + info.label.x1) / 2 > 0);
});

test('closed, the container is its pill at the anchor, at the scale given', () => {
  const L = hanging(11, { closed: new Set(['act']) });
  const info = L.containers.get('act');
  assert.ok(info.closed);
  assert.deepStrictEqual(info.center, { x: 0, y: 0 });
  assert.strictEqual(info.box.x1 - info.box.x0, 162);
  assert.strictEqual(closedPillScaleOf({}), 1);
  assert.strictEqual(closedPillScaleOf({ closedPillScale: 0.6 }), 0.6);
  assert.strictEqual(closedPillScaleOf({ closedPillScale: 0 }), 1);
  assert.strictEqual(closedPillScaleOf({ closedPillScale: 'x' }), 1);
});

test('the layout is chosen per container, else for all; a hull can be left undrawn', () => {
  assert.strictEqual(containerLayoutOf({ layout: 'hang' }, {}), 'hang');
  assert.strictEqual(containerLayoutOf({}, { containerLayout: 'hang' }), 'hang');
  assert.strictEqual(containerLayoutOf({}, {}), null);
  assert.strictEqual(hullDrawn({ hull: false }), false);
  assert.strictEqual(hullDrawn({ hull: { padding: 10 } }), true);
  assert.strictEqual(hullDrawn({}), true);
});

test('a container holding containers is not hung; its children are', () => {
  const containers = [{ id: 'book', parent: null }, { id: 'a1', parent: 'book' }, { id: 'a2', parent: 'book' }];
  const members = new Map([
    ['book', []],
    ['a1', Array.from({ length: 5 }, (_, i) => card('a1-' + (i + 1), i + 1))],
    ['a2', Array.from({ length: 4 }, (_, i) => card('a2-' + (i + 1), i + 1))],
  ]);
  const L = containerLayout({
    containers, members, labelSize: () => ({ w: 150, h: 70 }),
    options: { padding: () => PAD, layoutOf: () => 'hang', hangOf: () => ({}) },
  });
  assert.ok(!L.containers.get('book').hang);
  assert.ok(L.containers.get('a1').hang);
  assert.ok(L.containers.get('a2').hang);
});
