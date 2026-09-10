// The corpus → graph seam. buildEdges is the whole contract between what
// post-pipe knows about a body of work and what any renderer can draw, so it
// is the one function worth pinning down hardest.

const { test } = require('node:test');
const assert = require('node:assert');
const { buildEdges } = require('../src/corpus/buildEdges');

const item = (slug, extra = {}) => ({
  id: `https://example.test/${slug}.html`,
  url: `https://example.test/${slug}.html`,
  title: slug,
  ...extra,
});

test('emits nothing for a corpus with no relations', () => {
  assert.deepStrictEqual(buildEdges([item('alone')]), []);
});

test('authored connected_to resolves a slug to the target item id', () => {
  const items = [item('a', { connected_to: ['b'] }), item('b')];
  const [edge] = buildEdges(items);
  assert.strictEqual(edge.source, 'https://example.test/a.html');
  assert.strictEqual(edge.target, 'https://example.test/b.html');
  assert.strictEqual(edge.role, 'connected_to');
  assert.strictEqual(edge.layer, 'authored');
  assert.strictEqual(edge.directed, true, 'A claims B; B need not reciprocate');
  assert.strictEqual(edge.attrs.resolved, true);
});

test('an authored edge to an unwritten piece survives as a slug', () => {
  // The case that broke the old bipartite renderer: three pieces point at
  // topology-method, which has no bundle. The edge must not be dropped —
  // a piece that is planned but unwritten still shapes the topology.
  const [edge] = buildEdges([item('a', { connected_to: ['not-yet-written'] })]);
  assert.strictEqual(edge.target, 'not-yet-written');
  assert.strictEqual(edge.attrs.resolved, false);
});

test('tags and topology are separate layers with separate roles', () => {
  const edges = buildEdges([item('a', { tags: ['x'], topology: ['y'] })]);
  const tag = edges.find((e) => e.layer === 'tag');
  const topo = edges.find((e) => e.layer === 'topology');
  assert.strictEqual(tag.target, 'tag:x');
  assert.strictEqual(tag.role, 'tagged');
  assert.strictEqual(tag.directed, false, 'membership has no direction');
  assert.strictEqual(topo.target, 'topology:y');
  assert.strictEqual(topo.role, 'exhibits');
  assert.notStrictEqual(tag.layer, topo.layer, 'they cluster differently, so they stay separable');
});

test('a series becomes an ordered path, not a cluster', () => {
  // The relation a serialized novel needs. Chapters arrive out of order.
  const items = [
    item('ch3', { series: 'elinor', series_part: 3 }),
    item('ch1', { series: 'elinor', series_part: 1 }),
    item('ch2', { series: 'elinor', series_part: 2 }),
  ];
  const seq = buildEdges(items).filter((e) => e.layer === 'sequence');
  assert.strictEqual(seq.length, 2, 'n chapters produce n-1 links, not n^2');
  assert.ok(seq.every((e) => e.directed && e.role === 'next'));
  assert.deepStrictEqual(
    seq.map((e) => [e.attrs.from_part, e.attrs.to_part]),
    [[1, 2], [2, 3]],
    'ordered by series_part regardless of corpus order',
  );
});

test('two series do not link into each other', () => {
  const items = [
    item('a1', { series: 'one', series_part: 1 }),
    item('b1', { series: 'two', series_part: 1 }),
  ];
  assert.strictEqual(buildEdges(items).filter((e) => e.layer === 'sequence').length, 0);
});

test('every edge carries the fields a renderer dispatches on', () => {
  const edges = buildEdges([item('a', { tags: ['x'], connected_to: ['b'] }), item('b')]);
  for (const e of edges) {
    assert.ok(typeof e.source === 'string' && e.source);
    assert.ok(typeof e.target === 'string' && e.target);
    assert.strictEqual(typeof e.directed, 'boolean');
    assert.ok(typeof e.role === 'string' && e.role);
    assert.ok(typeof e.layer === 'string' && e.layer);
  }
});
