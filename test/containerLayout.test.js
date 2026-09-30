// Nested container layout: labels are reserved rectangles at every level, the
// first unit sits directly below the label, and units follow their own order.

const { test } = require('node:test');
const assert = require('node:assert');
const { containerLayout, rectsOverlap } = require('../src/components/GraphViewer/containerLayout');

const card = (id, order, extra = {}) => ({ id, w: 180, h: 140, order, ...extra });
const rectOf = (p) => ({ x0: p.x - 90, y0: p.y - 70, x1: p.x + 90, y1: p.y + 70 });

function book(closed) {
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
