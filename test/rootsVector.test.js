// The cover's roots as vector paths: read from their SVG, each act's roots
// found, and bent toward an act that has moved: the last third of each of
// its roots, eased in, its tip by the whole move, what grows off it moving
// with it, the rest still.

const { test } = require('node:test');
const assert = require('node:assert');
const { parseRoots, rootsModel, actRoots, bentRoots, easeRoot, pathD } = require('../src/lib/rootsVector');

// The crown at (50, 0). A trunk to node 1; from it two roots: one to t1 by
// way of node 5 (where a side root, t3, grows off), one to t2.
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="100" height="200">
<g fill="none">
<path data-e="0" data-a="0" data-b="1" data-part="0" stroke="#eee" stroke-width="6" d="M50,0L50,30"/>
<path data-e="0" data-a="0" data-b="1" data-part="1" stroke="#eee" stroke-width="5" d="M50,30L50,60"/>
<path data-e="1" data-a="1" data-b="5" data-part="0" stroke="#ccc" stroke-width="3" d="M50,60L35,75"/>
<path data-e="2" data-a="5" data-b="2" data-tip="t1" data-part="0" stroke="#aaa" stroke-width="2" d="M35,75L20,90"/>
<path data-e="3" data-a="1" data-b="3" data-tip="t2" data-part="0" stroke="#aaa" stroke-width="2" d="M50,60L80,90"/>
<path data-e="4" data-a="5" data-b="6" data-tip="t3" data-part="0" stroke="#999" stroke-width="1" d="M35,75L35,95"/>
<path data-e="5" data-a="7" data-b="8" data-free="" data-part="0" stroke="#999" stroke-width="1" d="M90,150L95,160"/>
</g>
<g data-tips="">
<circle data-tip="t1" data-node="2" cx="20" cy="90" r="0"/>
<circle data-tip="t2" data-node="3" cx="80" cy="90" r="0"/>
<circle data-tip="t3" data-node="6" cx="35" cy="95" r="0"/>
</g>
</svg>`;

test('read: the edges with their parts in order, the tips, the size', () => {
  const r = parseRoots(SVG);
  assert.equal(r.w, 100);
  assert.equal(r.h, 200);
  assert.equal(r.edges.length, 6);
  assert.deepStrictEqual(r.edges[0].parts.map((p) => p.pts), [[[50, 0], [50, 30]], [[50, 30], [50, 60]]]);
  assert.equal(r.edges[0].parts[0].width, 6);
  assert.equal(r.edges[2].tip, 't1');
  assert.equal(r.edges[5].free, true);
  assert.deepStrictEqual(r.tips.get('t2'), { x: 80, y: 90, node: 3 });
  assert.equal(parseRoots('<html></html>'), null);
  assert.equal(pathD([[1, 2], [3.14159, 4]]), 'M1,2L3.1,4');
});

test('the tree: a chain of edges from the crown to each tip', () => {
  const m = rootsModel(parseRoots(SVG));
  assert.deepStrictEqual(m.chains.get('t1').map((e) => e.e), [0, 1, 2]);
  assert.deepStrictEqual(m.chains.get('t3').map((e) => e.e), [0, 1, 4]);
  assert.deepStrictEqual(m.chains.get('t2').map((e) => e.e), [0, 3]);
  assert.ok(!m.order.some((e) => e.free), 'a free edge is not in the tree');
});

test("an act's roots: the ones it names, or the tip nearest its anchor", () => {
  const m = rootsModel(parseRoots(SVG));
  const roots = actRoots(m, [
    { id: 'a', anchor: { x: 0.21, y: 0.46 }, rootTips: null },
    { id: 'b', anchor: { x: 0.21, y: 0.46 }, rootTips: ['t2', 'nope'] },
    { id: 'c', anchor: null },
  ]);
  assert.deepStrictEqual(roots.get('a'), ['t1']);
  assert.deepStrictEqual(roots.get('b'), ['t2'], 'named tips the file has');
  assert.equal(roots.has('c'), false);
});

test("moved: an act's root bends over its last third, its tip by the whole move; what grows off moves with it; the rest stays", () => {
  const m = rootsModel(parseRoots(SVG));
  const roots = new Map([['a', ['t1']]]);
  const bent = bentRoots(m, roots, new Map([['a', { dx: 10, dy: -4 }]]));
  // t1's root: 60 + 21.21 + 21.21 long; its last third starts at 68.3.
  const tip = bent.get(2)[0][1];
  assert.ok(Math.abs(tip[0] - 30) < 1e-9 && Math.abs(tip[1] - 86) < 1e-9, `the tip by the whole move (${tip})`);
  assert.deepStrictEqual(bent.get(0), m.edges[0].parts.map((p) => p.pts), 'the trunk stays');
  assert.deepStrictEqual(bent.get(1)[0][0], [50, 60], 'the fork at two thirds and above stays');
  const L = 60 + 2 * Math.hypot(15, 15);
  const w5 = easeRoot((60 + Math.hypot(15, 15)) / L);
  assert.ok(w5 > 0 && w5 < 1);
  const n5 = bent.get(1)[0][1];
  assert.ok(Math.abs(n5[0] - (35 + 10 * w5)) < 1e-9, 'node 5 by its share');
  const side = bent.get(4)[0];
  assert.ok(Math.abs(side[0][0] - (35 + 10 * w5)) < 1e-9 && Math.abs(side[1][0] - (35 + 10 * w5)) < 1e-9, 'the side root moves with node 5, whole');
  assert.deepStrictEqual(bent.get(3), m.edges[3].parts.map((p) => p.pts), 'the other root stays');
  assert.deepStrictEqual(bent.get(5), m.edges[5].parts.map((p) => p.pts), 'a free piece stays');
  // Back where it was: nothing moves.
  const back = bentRoots(m, roots, new Map([['a', { dx: 0, dy: 0 }]]));
  for (const e of m.edges) assert.deepStrictEqual(back.get(e.e), e.parts.map((p) => p.pts));
});

test('the ease: nothing up to two thirds, all at the tip, smooth between', () => {
  assert.equal(easeRoot(0), 0);
  assert.equal(easeRoot(2 / 3), 0);
  assert.equal(easeRoot(1), 1);
  assert.ok(Math.abs(easeRoot(5 / 6) - 0.5) < 1e-9);
});

test('settings: rootsVector with a graph state image, and the acts with their anchors and rootTips', () => {
  const { openingConfig } = require('../src/lib/opening');
  const c = openingConfig({
    opening: { enabled: true, art: { artState: 'a.png', graphState: 'g.png', rootsVector: 'cover/roots.svg' } },
    containers: {
      _note: 'x',
      'container:act-1': { anchor: { x: 0.46, y: 0.99 }, rootTips: ['t25', 3] },
      'act-2': { anchor: { x: 0.2, y: 0.76 } },
      'container:book': { labelPosition: 'hidden' },
    },
  });
  assert.equal(c.art.rootsVector, 'cover/roots.svg');
  assert.deepStrictEqual(c.acts, [
    { id: 'container:act-1', anchor: { x: 0.46, y: 0.99 }, rootTips: ['t25'] },
    { id: 'container:act-2', anchor: { x: 0.2, y: 0.76 }, rootTips: null },
  ]);
  const one = openingConfig({ opening: { enabled: true, art: { full: 'a.png', rootsVector: 'r.svg' } } });
  assert.equal(one.art.rootsVector, '', 'only over a graph state image');
});
