// A tag's network: its relatives through the stone's relation edges, the
// strongest first, kept aside from the graph's links.

const { test } = require('node:test');
const assert = require('node:assert');
const {
  RELATION_LAYERS, STRONGEST, isRelationEdge, relativesOf, relationLabel, wrapText,
} = require('../src/lib/tagNetwork');
const { relationEdges } = require('../src/corpus/relationEdges');

const rel = (source, target, layer, weight, why) => ({
  source: `tag:${source}`,
  target: `tag:${target}`,
  layer,
  role: layer,
  directed: layer === 'broader' || layer === 'broadMatch',
  attrs: { ...(weight === undefined ? {} : { weight }), ...(why ? { why } : {}) },
});

test('the relation layers are the SKOS names the stone writes, and five show at first', () => {
  assert.deepStrictEqual(RELATION_LAYERS.slice().sort(), ['broadMatch', 'broader', 'closeMatch', 'exactMatch', 'related', 'relatedMatch']);
  assert.strictEqual(STRONGEST, 5);
});

test('a relation edge joins two tags on a relation layer; nothing else is one', () => {
  assert.ok(isRelationEdge(rel('a', 'b', 'related', 0.4)));
  assert.ok(isRelationEdge(rel('a', 'b', 'broader', 1)));
  assert.ok(!isRelationEdge({ source: 'i1', target: 'tag:a', layer: 'tag' }));
  assert.ok(!isRelationEdge({ source: 'i1', target: 'tag:a', layer: 'related' }), 'a piece at one end');
  assert.ok(!isRelationEdge({ source: 'tag:a', target: 'tag:a', layer: 'related' }), 'a tag to itself');
  assert.ok(!isRelationEdge({ source: 'tag:a', target: 'tag:b', layer: 'sequence' }));
  assert.ok(!isRelationEdge({ source: 'tag:a', target: 'tag:b', layer: 'narrower' }));
  assert.ok(!isRelationEdge(null));
});

test('every edge relationEdges writes is a relation edge', () => {
  const items = [
    { id: 'i1', tags: ['Alpha', 'Beta'], _references: [{ type: 'tag', value: 'Alpha', concept: 'c_a' }, { type: 'tag', value: 'Beta', concept: 'c_b' }] },
  ];
  const stone = { relationList: [{ a: 'c_a', b: 'c_b', type: 'broader', weight: 1 }, { a: 'c_a', b: 'c_b', type: 'related', weight: 0.3 }] };
  const edges = relationEdges(stone, items);
  assert.strictEqual(edges.length, 2);
  for (const e of edges) assert.ok(isRelationEdge(e), e.layer);
});

test('the strongest relatives first, five of them, the rest counted', () => {
  const relations = [
    rel('x', 'a', 'related', 0.1),
    rel('b', 'x', 'related', 0.9),
    rel('x', 'c', 'relatedMatch', 0.5),
    rel('x', 'd', 'related', 0.3),
    rel('e', 'x', 'related', 0.7),
    rel('x', 'f', 'related', 0.2),
    rel('x', 'g', 'related', 0.6),
    rel('q', 'r', 'related', 1),
  ];
  const net = relativesOf(relations, 'tag:x');
  assert.deepStrictEqual(net.relatives.map((r) => r.id), ['tag:b', 'tag:e', 'tag:g', 'tag:c', 'tag:d']);
  assert.strictEqual(net.total, 7);
  assert.strictEqual(net.more, 2);
  const all = relativesOf(relations, 'tag:x', { limit: Infinity });
  assert.deepStrictEqual(all.relatives.map((r) => r.id), ['tag:b', 'tag:e', 'tag:g', 'tag:c', 'tag:d', 'tag:f', 'tag:a']);
  assert.strictEqual(all.more, 0);
});

test('a relative not drawn is left out before counting, so the five are five drawn ones', () => {
  const relations = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((t, i) => rel('x', t, 'related', 1 - i / 10));
  const hidden = new Set(['tag:a', 'tag:c']);
  const net = relativesOf(relations, 'tag:x', { visible: (id) => !hidden.has(id) });
  assert.deepStrictEqual(net.relatives.map((r) => r.id), ['tag:b', 'tag:d', 'tag:e', 'tag:f', 'tag:g']);
  assert.strictEqual(net.total, 5);
  assert.strictEqual(net.more, 0);
});

test('two relations between one pair are one relative, at the stronger weight, strongest relation first', () => {
  const relations = [rel('x', 'a', 'related', 0.3, 'they co-occur'), rel('a', 'x', 'broader', 1, 'a is broader')];
  const net = relativesOf(relations, 'tag:x');
  assert.strictEqual(net.relatives.length, 1);
  assert.strictEqual(net.relatives[0].weight, 1);
  assert.deepStrictEqual(net.relatives[0].relations.map((r) => r.layer), ['broader', 'related']);
});

test('broader and broadMatch name the broader end: the edge\'s target', () => {
  const up = relativesOf([rel('x', 'a', 'broader', 1)], 'tag:x');
  assert.strictEqual(up.relatives[0].broader, 'tag:a', 'x is narrower than a: the arrow points at a');
  const down = relativesOf([rel('a', 'x', 'broadMatch', 1)], 'tag:x');
  assert.strictEqual(down.relatives[0].broader, 'tag:x', 'a is narrower than x: the arrow points at x');
  const flat = relativesOf([rel('x', 'a', 'related', 1)], 'tag:x');
  assert.strictEqual(flat.relatives[0].broader, null);
});

test('without a weight a relation comes after every weighted one; ties go by id, nothing else', () => {
  const relations = [rel('x', 'z', 'related'), rel('x', 'c', 'related', 0.5), rel('x', 'b', 'related', 0.5), rel('x', 'a', 'related')];
  const net = relativesOf(relations, 'tag:x', { limit: Infinity });
  assert.deepStrictEqual(net.relatives.map((r) => r.id), ['tag:b', 'tag:c', 'tag:a', 'tag:z']);
  assert.strictEqual(net.relatives[2].weight, null);
});

test('where a tag came from does not order its relatives', () => {
  const a = rel('x', 'a', 'related', 0.5);
  const b = rel('x', 'b', 'related', 0.5);
  a.attrs.origin = 'explicit';
  b.attrs.origin = 'discovered';
  const one = relativesOf([b, a], 'tag:x').relatives.map((r) => r.id);
  b.attrs.origin = 'explicit';
  a.attrs.origin = 'discovered';
  const two = relativesOf([b, a], 'tag:x').relatives.map((r) => r.id);
  assert.deepStrictEqual(one, ['tag:a', 'tag:b']);
  assert.deepStrictEqual(two, one);
});

test('ends already bound to nodes are read through their ids; no relations, no tag, no relatives', () => {
  const r = { source: { id: 'tag:x' }, target: { id: 'tag:a' }, layer: 'related', attrs: { weight: 0.2 } };
  assert.deepStrictEqual(relativesOf([r], 'tag:x').relatives.map((e) => e.id), ['tag:a']);
  assert.deepStrictEqual(relativesOf([], 'tag:x'), { relatives: [], total: 0, more: 0 });
  assert.deepStrictEqual(relativesOf(undefined, 'tag:x'), { relatives: [], total: 0, more: 0 });
  assert.deepStrictEqual(relativesOf([r], null), { relatives: [], total: 0, more: 0 });
  assert.deepStrictEqual(relativesOf([{ ...r, layer: 'tag' }], 'tag:x').relatives, [], 'an edge on another layer');
});

test('the hover label: type and weight, then the why, for each relation', () => {
  const why = '"active" and "carrying" share 2 of their 6 and 5 items, more than chance predicts (NPMI 0.48)';
  const label = relationLabel([rel('active', 'carrying', 'related', 0.3206, why), rel('active', 'carrying', 'broader')]);
  const lines = label.split('\n');
  assert.strictEqual(lines[0], 'related · weight 0.3206');
  assert.strictEqual(lines.slice(1, -1).join(' '), why);
  for (const l of lines) assert.ok(l.length <= 48, `line within 48: ${l}`);
  assert.strictEqual(lines[lines.length - 1], 'broader', 'no weight, no why: the type alone');
  assert.strictEqual(relationLabel([]), '');
});

test('text wraps at spaces; a long word keeps a line of its own', () => {
  assert.deepStrictEqual(wrapText('one two three four', 9), ['one two', 'three', 'four']);
  assert.deepStrictEqual(wrapText('a supercalifragilistic b', 6), ['a', 'supercalifragilistic', 'b']);
  assert.deepStrictEqual(wrapText('', 10), []);
  assert.deepStrictEqual(wrapText('  spaced   out  ', 40), ['spaced out']);
});
