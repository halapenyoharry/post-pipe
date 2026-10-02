// The golden spiral on its tip (graph.spiral / containers.<id>.spiral):
// anchorEnd 'outer' puts the last member at the anchor (the frame's origin)
// with the first lying from it toward openTowards; keepBelowY keeps every
// card and the hull's top at or below a line; cardScale draws and spaces
// the cards at a scale.

const { test } = require('node:test');
const assert = require('node:assert');
const { containerLayout, rectsOverlap, spiralOptions } = require('../src/components/GraphViewer/containerLayout');

const PAD = 32;
function act(n, spiral, { w = 180, h = 140 } = {}) {
  const members = new Map([['a', Array.from({ length: n }, (_, i) => ({ id: 'c' + (i + 1), w, h, order: i + 1 }))]]);
  const L = containerLayout({
    containers: [{ id: 'a', parent: null }],
    members,
    labelSize: () => ({ w: 200, h: 70 }),
    options: { spacing: 32, gap: 28, padding: () => PAD, spiralOf: () => spiral },
  });
  const pos = Array.from({ length: n }, (_, i) => L.nodes.get('c' + (i + 1)));
  return { L, pos, info: L.containers.get('a') };
}
const deg = (r) => (r * 180) / Math.PI;
const dirOf = (from, to) => deg(Math.atan2(to.y - from.y, to.x - from.x));

test('spiral settings: defaults, and only known values', () => {
  assert.deepStrictEqual(spiralOptions(), { anchorEnd: 'center', openTowards: 'down', keepBelowY: null, cardScale: 1, spacing: null });
  const o = spiralOptions({ anchorEnd: 'outer', openTowards: 'down-left', keepBelowY: -300, cardScale: 0.5, spacing: 12 });
  assert.deepStrictEqual(o, { anchorEnd: 'outer', openTowards: 'down-left', keepBelowY: -300, cardScale: 0.5, spacing: 12 });
  assert.strictEqual(spiralOptions({ openTowards: 'up', cardScale: -1, anchorEnd: 'x' }).openTowards, 'down');
  assert.strictEqual(spiralOptions({ cardScale: -1 }).cardScale, 1);
  assert.strictEqual(spiralOptions({ anchorEnd: 'x' }).anchorEnd, 'center');
});

test('anchorEnd center keeps the label at the origin, as before', () => {
  const { info, pos } = act(11, {});
  assert.deepStrictEqual(info.center, { x: 0, y: 0 });
  assert.ok(Math.abs((info.label.x0 + info.label.x1) / 2) < 1e-9 && Math.abs((info.label.y0 + info.label.y1) / 2) < 1e-9);
  assert.ok(pos[0].y > 0, 'chapter one below the label');
});

test('anchorEnd outer puts the last member at the anchor, within 1 px', () => {
  for (const n of [2, 5, 11, 20]) {
    const { pos, info } = act(n, { anchorEnd: 'outer' });
    const last = pos[n - 1];
    assert.ok(Math.hypot(last.x, last.y) < 1, `${n}: last at ${last.x}, ${last.y}`);
    assert.deepStrictEqual(info.center, { x: 0, y: 0 });
  }
});

test('openTowards turns the spiral: the first member lies from the last that way', () => {
  for (const [towards, want] of [['down', 90], ['down-right', 45], ['down-left', 135]]) {
    for (const n of [5, 11, 12]) {
      const { pos } = act(n, { anchorEnd: 'outer', openTowards: towards });
      const got = dirOf(pos[n - 1], pos[0]);
      assert.ok(Math.abs(got - want) < 1, `${towards} ${n}: ${got.toFixed(2)} against ${want}`);
    }
  }
});

test('a turned spiral still keeps its order, its cards apart and off the label', () => {
  for (const towards of ['down', 'down-right', 'down-left']) {
    const { pos, info } = act(11, { anchorEnd: 'outer', openTowards: towards });
    const rects = pos.map((p) => ({ x0: p.x - 90, y0: p.y - 70, x1: p.x + 90, y1: p.y + 70 }));
    for (let i = 0; i < rects.length; i++) {
      assert.ok(!rectsOverlap(rects[i], info.label), `${towards}: card ${i + 1} on the label`);
      for (let j = i + 1; j < rects.length; j++) assert.ok(!rectsOverlap(rects[i], rects[j]), `${towards}: ${i + 1} on ${j + 1}`);
    }
    // Each one further along the curve than the one before: further from its centre.
    const { cx, cy } = info.spiral;
    const r = pos.map((p) => Math.hypot(p.x - cx, p.y - cy));
    for (let i = 2; i < r.length; i++) assert.ok(r[i] > r[i - 2], `${towards}: ${i + 1} not further out`);
  }
});

test('keepBelow holds for 1, 11 and 40 members', () => {
  for (const n of [1, 11, 40]) {
    for (const towards of ['down', 'down-right', 'down-left']) {
      for (const line of [-500, -150, -60, 40]) {
        const { pos, info } = act(n, { anchorEnd: 'outer', openTowards: towards, keepBelowY: line });
        const top = Math.min(info.label.y0, ...pos.map((p) => p.y - 70)) - PAD * 1.25;
        assert.ok(top >= line - 1e-6, `${n} ${towards} ${line}: top ${top.toFixed(1)}`);
        assert.ok(info.box.y0 >= line - 1e-6, `${n} ${towards} ${line}: box top ${info.box.y0.toFixed(1)}`);
      }
    }
  }
});

test('keepBelow is not touched when the spiral already clears it', () => {
  const free = act(11, { anchorEnd: 'outer' });
  const kept = act(11, { anchorEnd: 'outer', keepBelowY: -2000 });
  assert.deepStrictEqual(kept.pos, free.pos);
});

test('when no turn clears the line, the spiral moves down off the anchor, uncut', () => {
  const { pos, info } = act(11, { anchorEnd: 'outer', keepBelowY: 100 });
  assert.strictEqual(pos.length, 11);
  assert.ok(pos[10].y > 0, 'moved down');
  assert.ok(info.spiral.drop > 0);
});

test('cardScale scales the cards, the extent with them', () => {
  const full = act(11, { anchorEnd: 'outer', spacing: 32 });
  const half = act(11, { anchorEnd: 'outer', spacing: 16, cardScale: 0.5 });
  for (const p of half.pos) assert.strictEqual(p.scale, 0.5);
  for (const p of full.pos) assert.strictEqual(p.scale, 1);
  const span = (r) => {
    const xs = r.pos.map((p) => p.x), ys = r.pos.map((p) => p.y);
    return [Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
  };
  const [fw, fh] = span(full), [hw, hh] = span(half);
  // The label stays its size, so the half-size spiral is about, not exactly, half.
  assert.ok(hw < fw * 0.75 && hw > fw * 0.35, `width ${hw} against ${fw}`);
  assert.ok(hh < fh * 0.75 && hh > fh * 0.35, `height ${hh} against ${fh}`);
});
