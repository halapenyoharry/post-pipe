// Nested container layout: labels are reserved rectangles at every level, the
// first unit sits directly below the label, and units follow their own order.

const { test } = require('node:test');
const assert = require('node:assert');
const { containerLayout, rectsOverlap } = require('../src/components/GraphViewer/containerLayout');

const card = (id, order, extra = {}) => ({ id, w: 180, h: 140, order, ...extra });
const rectOf = (p) => ({ x0: p.x - 90, y0: p.y - 70, x1: p.x + 90, y1: p.y + 70 });

function book(closed, options) {
  const containers = [
    { id: 'book', parent: null },
    { id: 'a1', parent: 'book' },
    { id: 'a2', parent: 'book' },
    { id: 'a3', parent: 'book' },
  ];
  const members = new Map([
    ['book', []],
    ['a1', Array.from({ length: 11 }, (_, i) => card('a1-' + (i + 1), i + 1))],
    ['a2', Array.from({ length: 9 }, (_, i) => card('a2-' + (i + 1), i + 1))],
    ['a3', Array.from({ length: 8 }, (_, i) => card('a3-' + (i + 1), i + 1))],
  ]);
  return containerLayout({
    containers, members, closed,
    labelSize: (c, depth) => (depth === 0 ? { w: 600, h: 200 } : { w: 280, h: 100 }),
    macroSize: () => ({ w: 300, h: 120 }),
    options,
  });
}

test('no label overlaps another label, a child box, or any member card', () => {
  const L = book();
  const labels = [...L.containers.entries()];
  for (let i = 0; i < labels.length; i++) {
    for (let j = i + 1; j < labels.length; j++) {
      assert.ok(!rectsOverlap(labels[i][1].label, labels[j][1].label), labels[i][0] + ' label on ' + labels[j][0]);
    }
  }
  const bookLabel = L.containers.get('book').label;
  for (const id of ['a1', 'a2', 'a3']) {
    assert.ok(!rectsOverlap(bookLabel, L.containers.get(id).box), 'book label on ' + id);
  }
  for (const [id, info] of L.containers) {
    for (const [nid, p] of L.nodes) {
      assert.ok(!rectsOverlap(info.label, rectOf(p)), id + ' label on ' + nid);
    }
  }
});

test('member cards never overlap each other', () => {
  const L = book();
  const all = [...L.nodes.entries()];
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      assert.ok(!rectsOverlap(rectOf(all[i][1]), rectOf(all[j][1])), all[i][0] + ' on ' + all[j][0]);
    }
  }
});

test('first unit sits directly below its label, centred', () => {
  const L = book();
  const a1 = L.containers.get('a1');
  const first = L.nodes.get('a1-1');
  const labelCx = (a1.label.x0 + a1.label.x1) / 2;
  assert.ok(Math.abs(first.x - labelCx) < 1e-6);
  assert.ok(first.y > a1.label.y1);
  assert.ok(first.y - 70 - a1.label.y1 < 40);
  // The book's first unit is Act 1, placed as a box below the book's label,
  // not centred under it on its first chapter.
  const bookL = L.containers.get('book');
  assert.ok(a1.box.y0 >= bookL.label.y1);
  assert.ok(Math.abs((a1.box.x0 + a1.box.x1) / 2 - (bookL.label.x0 + bookL.label.x1) / 2) < 1e-6);
});

test('units follow their order, not their date', () => {
  const containers = [{ id: 'c', parent: null }];
  const members = new Map([['c', [card('late', 1, { date: '2030-01-01' }), card('early', 2, { date: '2020-01-01' })]]]);
  const L = containerLayout({ containers, members, labelSize: () => ({ w: 100, h: 40 }) });
  const first = L.nodes.get('late');
  assert.strictEqual(first.x, 0);
  // Without an order, date decides.
  const m2 = new Map([['c', [card('late', undefined, { date: '2030-01-01' }), card('early', undefined, { date: '2020-01-01' })]]]);
  const L2 = containerLayout({ containers, members: m2, labelSize: () => ({ w: 100, h: 40 }) });
  assert.strictEqual(L2.nodes.get('early').x, 0);
});

test('a closed child is one box; its members collapse to its centre', () => {
  const L = book(new Set(['a2']));
  const a2 = L.containers.get('a2');
  assert.ok(a2.closed);
  assert.strictEqual(a2.box.x1 - a2.box.x0, 300);
  const p = L.nodes.get('a2-3');
  assert.strictEqual(p.x, a2.center.x);
  assert.strictEqual(p.y, a2.center.y);
});

test('chapters sit one after another along a golden spiral', () => {
  const L = book();
  const a1 = L.containers.get('a1');
  const { cx, cy } = a1.spiral;
  const pts = Array.from({ length: 11 }, (_, i) => L.nodes.get('a1-' + (i + 1)));
  // Neighbours: each next edge is short, about one card plus spacing.
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    assert.ok(d < Math.hypot(180, 140) + 40, 'chapter ' + i + ' to ' + (i + 1) + ' is ' + Math.round(d));
  }
  // Along the curve: the angle round the centre keeps turning one way and the
  // radius keeps growing.
  let turned = 0;
  let prevA = Math.atan2(pts[0].y - cy, pts[0].x - cx);
  let prevR = Math.hypot(pts[0].x - cx, pts[0].y - cy);
  for (const p of pts.slice(1)) {
    const ang = Math.atan2(p.y - cy, p.x - cx);
    let d = ang - prevA;
    while (d < 0) d += 2 * Math.PI;
    assert.ok(d > 0 && d < Math.PI, 'clockwise, a little at a time');
    turned += d;
    const r = Math.hypot(p.x - cx, p.y - cy);
    assert.ok(r > prevR, 'outward');
    prevA = ang;
    prevR = r;
  }
  assert.ok(turned > Math.PI, 'a spiral, not a cluster');
});

test('the radius grows by the golden ratio every quarter turn', () => {
  const L = book();
  const { a, b } = L.containers.get('a1').spiral;
  assert.ok(a > 0);
  assert.ok(Math.abs(Math.exp(b * Math.PI / 2) - (1 + Math.sqrt(5)) / 2) < 1e-9);
});

test('the book places its acts below and beside its label, label a third of the way down', () => {
  const L = book();
  const bk = L.containers.get('book');
  const frac = ((bk.label.y0 + bk.label.y1) / 2 - bk.box.y0) / (bk.box.y1 - bk.box.y0);
  assert.ok(frac > 0.25 && frac < 0.42, 'label at ' + frac.toFixed(2));
  for (const id of ['a1', 'a2', 'a3']) {
    const box = L.containers.get(id).box;
    const sideBySide = box.x1 <= bk.label.x0 || box.x0 >= bk.label.x1;
    assert.ok(sideBySide || box.y0 >= bk.label.y1, id + ' is above the book label');
  }
  // Acts never overlap one another.
  const boxes = ['a1', 'a2', 'a3'].map((id) => L.containers.get(id).box);
  for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) assert.ok(!rectsOverlap(boxes[i], boxes[j]));
});

test('scatter mode is the golden-angle arrangement, and still keeps every rule', () => {
  const L = book(undefined, { mode: 'scatter' });
  assert.strictEqual(L.containers.get('a1').spiral, null);
  const all = [...L.nodes.values()];
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) assert.ok(!rectsOverlap(rectOf(all[i]), rectOf(all[j])));
  }
  for (const [, info] of L.containers) for (const p of all) assert.ok(!rectsOverlap(info.label, rectOf(p)));
});

test('ring mode: one ring per container round its label, clear of everything', () => {
  const L = book(undefined, { mode: 'ring' });
  for (const id of ['a1', 'a2', 'a3']) {
    const info = L.containers.get(id);
    const cx = (info.label.x0 + info.label.x1) / 2;
    const cy = (info.label.y0 + info.label.y1) / 2;
    const n = id === 'a1' ? 11 : id === 'a2' ? 9 : 8;
    const radii = Array.from({ length: n }, (_, i) => {
      const p = L.nodes.get(id + '-' + (i + 1));
      return Math.hypot(p.x - cx, p.y - cy);
    });
    assert.ok(Math.max(...radii) - Math.min(...radii) < 1e-6, id + ' members on one circle');
    const first = L.nodes.get(id + '-1');
    assert.ok(Math.abs(first.x - cx) < 1e-6 && first.y < cy, 'first at the top');
  }
  const boxes = ['a1', 'a2', 'a3'].map((id) => L.containers.get(id).box);
  for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) assert.ok(!rectsOverlap(boxes[i], boxes[j]));
  const all = [...L.nodes.values()];
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) assert.ok(!rectsOverlap(rectOf(all[i]), rectOf(all[j])));
  }
  for (const [, info] of L.containers) for (const p of all) assert.ok(!rectsOverlap(info.label, rectOf(p)));
});

test('an inward spiral keeps the reading order and puts the first chapter on top', () => {
  const out = book(undefined, { direction: 'outward' });
  const inn = book(undefined, { direction: 'inward' });
  const a1 = (L) => Array.from({ length: 11 }, (_, i) => L.nodes.get('a1-' + (i + 1)));
  const o = a1(out);
  const n = a1(inn);
  // Outward: the last chapter is the highest. Inward: the first one is.
  const topOf = (ps) => ps.reduce((best, p, i) => (p.y < ps[best].y ? i : best), 0);
  assert.strictEqual(topOf(o), 10);
  assert.strictEqual(topOf(n), 0);
  // Consecutive chapters stay neighbours along the curve: each step is as
  // short as it was outward, only walked the other way.
  const steps = (ps) => ps.slice(1).map((p, i) => Math.round(Math.hypot(p.x - ps[i].x, p.y - ps[i].y)));
  assert.deepStrictEqual(steps(n), steps(o).slice().reverse());
  // Nothing overlaps: no card on another, none on the act's label.
  const label = inn.containers.get('a1').label;
  for (let i = 0; i < n.length; i++) {
    assert.ok(!rectsOverlap(label, rectOf(n[i])), 'label on a1-' + (i + 1));
    for (let j = i + 1; j < n.length; j++) assert.ok(!rectsOverlap(rectOf(n[i]), rectOf(n[j])), `a1-${i + 1} on a1-${j + 1}`);
  }
});
