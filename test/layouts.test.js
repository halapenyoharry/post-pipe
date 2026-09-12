// Layouts are pure functions of their nodes, which is the whole reason to keep
// them out of the renderer: the interesting properties are checkable without a
// browser.

const { test } = require('node:test');
const assert = require('node:assert');
const { radialLayout, timelineLayout, computeLayout, layoutNames, layoutIsDegenerate } = require('../src/components/GraphViewer/layouts');

const article = (id, extra = {}) => ({ id, type: 'article', ...extra });
const tag = (id) => ({ id, type: 'tag', _r: 60 });

const CARD = { cardW: 180, cardH: 140 };
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

test('every layout places every node exactly once', () => {
  const nodes = [article('a'), article('b'), tag('t1'), tag('t2')];
  for (const name of layoutNames().filter((n) => n !== 'force')) {
    const pos = computeLayout(name, nodes, CARD);
    assert.deepStrictEqual(Object.keys(pos).sort(), ['a', 'b', 't1', 't2']);
    for (const p of Object.values(pos)) {
      assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), `${name} produced a non-finite point`);
    }
  }
});

test('force has no layout function — the simulation owns it', () => {
  assert.strictEqual(computeLayout('force', [article('a')], CARD), null);
});

test('radial: articles ride the rim, tags stay inside it', () => {
  const nodes = [...Array(24)].map((_, i) => article('a' + i)).concat([tag('t1'), tag('t2')]);
  const pos = radialLayout(nodes, CARD);
  const radii = [...Array(24)].map((_, i) => Math.hypot(pos['a' + i].x, pos['a' + i].y));
  const minRim = Math.min(...radii);
  for (const t of ['t1', 't2']) {
    assert.ok(Math.hypot(pos[t].x, pos[t].y) < minRim, 'a tag escaped the ring');
  }
});

test('radial: neighbours are evenly spaced by arc, not by angle', () => {
  // Equal angles on an ellipse bunch cards where the curve is tightest. The
  // check that catches it is the spread of neighbour distances.
  const nodes = [...Array(30)].map((_, i) => article('a' + i));
  const pos = radialLayout(nodes, CARD);
  const gaps = [];
  for (let i = 0; i < 30; i++) gaps.push(dist(pos['a' + i], pos['a' + ((i + 1) % 30)]));
  const avg = gaps.reduce((x, y) => x + y, 0) / gaps.length;
  const worst = Math.max(...gaps.map((g) => Math.abs(g - avg) / avg));
  assert.ok(worst < 0.05, `neighbour spacing varies by ${(worst * 100).toFixed(1)}%`);
});

test('radial: the ring grows with the corpus so cards never overlap', () => {
  for (const n of [10, 60, 200]) {
    const nodes = [...Array(n)].map((_, i) => article('a' + i));
    const pos = radialLayout(nodes, CARD);
    let closest = Infinity;
    for (let i = 0; i < n; i++) closest = Math.min(closest, dist(pos['a' + i], pos['a' + ((i + 1) % n)]));
    assert.ok(closest >= CARD.cardW, `at n=${n} neighbours are ${closest.toFixed(0)} apart, card is ${CARD.cardW}`);
  }
});

test('timeline: x follows date order', () => {
  const nodes = [
    article('late', { date: '2026-09-01' }),
    article('early', { date: '2020-01-01' }),
    article('mid', { date: '2023-05-05' }),
  ];
  const pos = timelineLayout(nodes, CARD);
  assert.ok(pos.early.x < pos.mid.x && pos.mid.x < pos.late.x);
});

test('timeline: same-day items stack into lanes rather than overlapping', () => {
  const nodes = [...Array(8)].map((_, i) => article('a' + i, { date: '2026-09-01' }));
  const pos = timelineLayout(nodes, CARD);
  const ys = new Set(Object.values(pos).map((p) => Math.round(p.y)));
  assert.strictEqual(ys.size, 8, 'eight items on one day should occupy eight lanes');
  const xs = new Set(Object.values(pos).map((p) => Math.round(p.x)));
  assert.strictEqual(xs.size, 1, 'and share one x, because they share one date');
});

test('timeline: undated items are set apart, not guessed at', () => {
  const nodes = [
    article('dated', { date: '2026-01-01' }),
    article('dated2', { date: '2026-06-01' }),
    article('nodate'),
  ];
  const pos = timelineLayout(nodes, CARD);
  assert.ok(pos.nodate.x < pos.dated.x, 'undated sits left of the axis');
  assert.ok(pos.dated.x - pos.nodate.x > CARD.cardW, 'and visibly apart from it');
});

test('timeline: tags sit in a band above the axis', () => {
  const nodes = [article('a', { date: '2026-01-01' }), tag('t1')];
  const pos = timelineLayout(nodes, CARD);
  assert.ok(pos.t1.y < pos.a.y - CARD.cardH, 'tags are above, having no date to sit at');
});

test('layouts are deterministic', () => {
  const nodes = [...Array(12)].map((_, i) => article('a' + i, { date: '202' + (i % 5) + '-01-01' })).concat([tag('t')]);
  for (const name of ['radial', 'timeline']) {
    assert.deepStrictEqual(computeLayout(name, nodes, CARD), computeLayout(name, nodes, CARD));
  }
});

test('layouts survive an empty corpus', () => {
  for (const name of ['radial', 'timeline']) {
    assert.deepStrictEqual(computeLayout(name, [], CARD), {});
  }
});

test('timeline spreads a corpus that is lumpy in time', () => {
  // The real shape: years of writing alongside a feed that posted eighty items
  // in two days. On a linear axis the feed becomes one column and everything
  // older smears into the left edge.
  const old = [...Array(20)].map((_, i) => article('old' + i, { date: (2019 + (i % 6)) + '-03-0' + ((i % 8) + 1) }));
  const burst = [...Array(80)].map((_, i) =>
    article('new' + i, { date: '2026-09-1' + (i % 2) + 'T' + String(i % 24).padStart(2, '0') + ':00:00Z' }));
  const pos = timelineLayout([...old, ...burst], CARD);

  const xs = Object.values(pos).map((p) => p.x).sort((a, b) => a - b);
  const lo = xs[0];
  const hi = xs[xs.length - 1];
  const bins = Array(10).fill(0);
  xs.forEach((x) => bins[Math.min(9, Math.floor(((x - lo) / (hi - lo)) * 10))]++);

  const empty = bins.filter((b) => b === 0).length;
  assert.ok(empty <= 2, `the axis is mostly unused: ${bins.join(' ')}`);
  const busiest = Math.max(...bins);
  assert.ok(busiest < xs.length * 0.5, `half the corpus landed in one tenth of the axis: ${bins.join(' ')}`);
});

test('timeline keeps exact order despite compressing the gaps', () => {
  const nodes = [
    article('a', { date: '2019-01-01' }),
    article('b', { date: '2026-09-10T10:00:00Z' }),
    article('c', { date: '2026-09-10T11:00:00Z' }),
  ];
  const pos = timelineLayout(nodes, CARD);
  assert.ok(pos.a.x < pos.b.x, 'years before hours');
  assert.ok(pos.b.x < pos.c.x, 'and an hour still advances');
});

test('an unsettled heap is recognised as not an arrangement', () => {
  // d3 seeds nodes on a spiral about 10*sqrt(i) across. For 178 nodes that is
  // roughly 260px wide — which is what a page that never got an animation
  // frame leaves behind, and what must never be persisted or restored.
  const heap = [...Array(178)].map((_, i) => {
    const r = 10 * Math.sqrt(i);
    const a = i * 2.4;
    return { x: r * Math.cos(a), y: r * Math.sin(a) };
  });
  assert.strictEqual(layoutIsDegenerate(heap, { width: 180, height: 140 }), true);
});

test('a real arrangement is not mistaken for a heap', () => {
  const real = radialLayout([...Array(178)].map((_, i) => article('a' + i)), CARD);
  assert.strictEqual(
    layoutIsDegenerate(Object.values(real), { width: 180, height: 140 }), false,
  );
  const line = timelineLayout(
    [...Array(60)].map((_, i) => article('a' + i, { date: '2026-0' + ((i % 9) + 1) + '-01' })), CARD,
  );
  assert.strictEqual(
    layoutIsDegenerate(Object.values(line), { width: 180, height: 140 }), false,
  );
});

test('too few nodes to judge is left alone', () => {
  const few = [...Array(5)].map((_, i) => ({ x: i, y: i }));
  assert.strictEqual(layoutIsDegenerate(few, { width: 180, height: 140 }), false);
});
