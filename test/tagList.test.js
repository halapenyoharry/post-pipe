// The top bar's tag list (src/lib/tagList.js): one row per tag the graph
// draws, counted and coloured as the graph colours the tag node, hidden feeds'
// pieces counting for nothing, the tags the pieces per tag slider hides left
// out, the tag on the most pieces first.
const { test } = require('node:test');
const assert = require('node:assert');

const { SEARCH_FROM, hasTagNodes, tagListModel, filterTagRows, tagRowTitle } = require('../src/lib/tagList');
const { blendColors } = require('../src/lib/blendColors');

const A = { id: 'src:a', title: 'Feed A', color: '#ff0000' };
const B = { id: 'src:b', title: 'Feed B', color: '#0000ff' };
const item = (id, source, tags) => ({ id, url: `http://x/${id}.html`, title: id, tags, _source: source });
const tagEdge = (pieceId, tag) => ({ source: pieceId, target: `tag:${tag}`, directed: false, role: 'tagged', layer: 'tag' });

const feed = {
  items: [
    item('one', A, ['quiet', 'craft']),
    item('two', A, ['quiet']),
    item('three', B, ['quiet', 'Outdoors']),
    item('four', B, ['craft']),
    item('five', null, ['alone']),
  ],
  edges: [
    tagEdge('one', 'quiet'), tagEdge('one', 'craft'),
    tagEdge('two', 'quiet'),
    tagEdge('three', 'quiet'), tagEdge('three', 'Outdoors'),
    tagEdge('four', 'craft'),
    tagEdge('five', 'alone'),
    // a piece the graph does not have, and a line of another layer
    tagEdge('gone', 'quiet'),
    { source: 'one', target: 'two', layer: 'sequence' },
  ],
  _sources: [A, B],
};

test('hasTagNodes: only with the tag layer on and an edge of it', () => {
  assert.strictEqual(hasTagNodes(feed, { visibleLayers: ['sequence', 'tag'] }), true);
  assert.strictEqual(hasTagNodes(feed, { visibleLayers: ['sequence'] }), false, 'layer off');
  assert.strictEqual(hasTagNodes(feed, {}), false, 'the default layers are sequence only');
  assert.strictEqual(hasTagNodes({ items: feed.items, edges: [] }, { visibleLayers: ['tag'] }), false, 'no tag edges');
  assert.strictEqual(hasTagNodes(null, { visibleLayers: ['tag'] }), false);
});

test('rows: one per tag, the most pieces first, ties by name case aside, with the feeds that bring them', () => {
  const rows = tagListModel(feed, { fallbackColor: '#f39c12' });
  assert.deepStrictEqual(rows.map((r) => r.id), ['tag:quiet', 'tag:craft', 'tag:alone', 'tag:Outdoors']);
  assert.deepStrictEqual(rows.map((r) => r.label), ['quiet', 'craft', 'alone', 'Outdoors']);
  assert.deepStrictEqual(rows.map((r) => r.pieces), [3, 2, 1, 1], 'a piece the graph lacks is not counted');
  assert.deepStrictEqual(rows.map((r) => r.count), [3, 2, 1, 1], 'nothing hidden: every piece shows');
  const quiet = rows.find((r) => r.id === 'tag:quiet');
  assert.deepStrictEqual(quiet.contributors, [
    { sourceId: 'src:a', title: 'Feed A', count: 2 },
    { sourceId: 'src:b', title: 'Feed B', count: 1 },
  ]);
});

test('rows: ties by name case aside, then by case', () => {
  const f = {
    items: [item('one', A, []), item('two', A, [])],
    edges: [tagEdge('one', 'b'), tagEdge('one', 'B'), tagEdge('one', 'a'), tagEdge('two', 'c'), tagEdge('one', 'c')],
    _sources: [A],
  };
  // c is on two pieces; a, b and B on one: a first, then the two b's in the
  // locale's order of case (lower first in Node's default).
  const byCase = ['b', 'B'].sort((x, y) => x.localeCompare(y));
  assert.deepStrictEqual(tagListModel(f).map((r) => r.label), ['c', 'a', ...byCase]);
});

test('colour: the pieces\' feed colours blended, each piece one weight, as the graph paints the node', () => {
  const rows = tagListModel(feed, { fallbackColor: '#f39c12' });
  const quiet = rows.find((r) => r.id === 'tag:quiet');
  assert.strictEqual(quiet.color, blendColors([{ color: '#ff0000', weight: 2 }, { color: '#0000ff', weight: 1 }], null));
  const craft = rows.find((r) => r.id === 'tag:craft');
  assert.strictEqual(craft.color, blendColors([{ color: '#ff0000', weight: 1 }, { color: '#0000ff', weight: 1 }], null));
  // A piece without a feed weighs in as the fallback; without one, no colour.
  assert.strictEqual(rows.find((r) => r.id === 'tag:alone').color, '#f39c12');
  assert.strictEqual(tagListModel(feed, {}).find((r) => r.id === 'tag:alone').color, null);
});

test('colour: the reader\'s own colour for a feed wins over the build\'s', () => {
  const rows = tagListModel(feed, { sourceColorOf: (id) => (id === 'src:a' ? '#00ff00' : null) });
  const craft = rows.find((r) => r.id === 'tag:craft');
  assert.strictEqual(craft.color, blendColors([{ color: '#00ff00', weight: 1 }, { color: '#0000ff', weight: 1 }], null));
});

test('hidden feeds: their pieces do not count, and a tag left with none leaves the list', () => {
  const rows = tagListModel(feed, { hiddenSources: new Set(['src:b']), fallbackColor: '#f39c12' });
  assert.deepStrictEqual(rows.map((r) => [r.id, r.count]), [['tag:quiet', 2], ['tag:craft', 1], ['tag:alone', 1]]);
  assert.strictEqual(rows.find((r) => r.id === 'tag:quiet').color, '#ff0000', 'only Feed A left in the blend');
  assert.deepStrictEqual(rows.find((r) => r.id === 'tag:quiet').contributors, [{ sourceId: 'src:a', title: 'Feed A', count: 2 }]);
  const arr = tagListModel(feed, { hiddenSources: ['src:a', 'src:b'] });
  assert.deepStrictEqual(arr.map((r) => r.id), ['tag:alone'], 'an array of ids works too');
});

test('hidden feeds: a row keeps its place and its number, counted as the slider counts, every feed included', () => {
  const rows = tagListModel(feed, { hiddenSources: new Set(['src:a']) });
  // quiet: 3 pieces, 1 showing; craft: 2, 1 showing. The order and the
  // number shown stay as with nothing hidden.
  assert.deepStrictEqual(rows.map((r) => [r.id, r.pieces, r.count]), [
    ['tag:quiet', 3, 1], ['tag:craft', 2, 1], ['tag:alone', 1, 1], ['tag:Outdoors', 1, 1],
  ]);
});

test('pieces per tag: a tag on fewer pieces than the slider\'s value leaves the list; 1 or nothing keeps them all', () => {
  const ids = (opts) => tagListModel(feed, opts).map((r) => r.id);
  assert.deepStrictEqual(ids({ minPieces: null }), ['tag:quiet', 'tag:craft', 'tag:alone', 'tag:Outdoors']);
  assert.deepStrictEqual(ids({ minPieces: 1 }), ['tag:quiet', 'tag:craft', 'tag:alone', 'tag:Outdoors']);
  assert.deepStrictEqual(ids({ minPieces: 2 }), ['tag:quiet', 'tag:craft']);
  assert.deepStrictEqual(ids({ minPieces: '2' }), ['tag:quiet', 'tag:craft'], 'a stored string is read as its number');
  assert.deepStrictEqual(ids({ minPieces: 3 }), ['tag:quiet']);
  assert.deepStrictEqual(ids({ minPieces: 40 }), ['tag:quiet'], 'clamped to the largest count, as the graph clamps it');
  assert.deepStrictEqual(ids({ minPieces: 'abc' }), ['tag:quiet', 'tag:craft', 'tag:alone', 'tag:Outdoors']);
});

test('pieces per tag: a hidden feed does not change which tags the slider keeps', () => {
  // craft has 2 pieces, one from each feed: with Feed B hidden one shows,
  // and it still passes a value of 2, as the graph keeps its node.
  const rows = tagListModel(feed, { minPieces: 2, hiddenSources: ['src:b'] });
  assert.deepStrictEqual(rows.map((r) => [r.id, r.pieces, r.count]), [['tag:quiet', 3, 2], ['tag:craft', 2, 1]]);
  // A tag the slider keeps but with every piece hidden still leaves.
  assert.deepStrictEqual(tagListModel(feed, { minPieces: 2, hiddenSources: ['src:a', 'src:b'] }).map((r) => r.id), []);
});

test('pieces per tag: clamped to the slider\'s top the graph published, not only the feed\'s', () => {
  // The graph's largest bubble (a group at a depth above 0) holds 6: a value
  // of 5 is in force, and every row here is under it.
  assert.deepStrictEqual(tagListModel(feed, { minPieces: 5, maxPieces: 6 }).map((r) => r.id), []);
  // Without the graph's top, 5 is clamped to the feed's largest, 3.
  assert.deepStrictEqual(tagListModel(feed, { minPieces: 5 }).map((r) => r.id), ['tag:quiet']);
  // A top that is not a number is not used.
  assert.deepStrictEqual(tagListModel(feed, { minPieces: 5, maxPieces: 'x' }).map((r) => r.id), ['tag:quiet']);
});

test('the graph\'s own count for a tag, when given, orders the rows and is what the slider reads', () => {
  // At a depth above 0 a tag collapsed into a group carries the group's count.
  const byTag = { 'tag:alone': 9, 'tag:Outdoors': 9, 'tag:quiet': 3 };
  const rows = tagListModel(feed, { tagCounts: byTag });
  assert.deepStrictEqual(rows.map((r) => [r.id, r.pieces]), [
    ['tag:alone', 9], ['tag:Outdoors', 9], ['tag:quiet', 3], ['tag:craft', 2],
  ], 'a tag the graph did not count keeps the feed\'s count');
  assert.deepStrictEqual(tagListModel(feed, { tagCounts: new Map(Object.entries(byTag)), minPieces: 4 }).map((r) => r.id),
    ['tag:alone', 'tag:Outdoors'], 'a Map works too, and the top is the largest of the graph\'s counts');
});

test('rows: a tag listed twice on one piece counts it once; an edge the other way round is read too', () => {
  const f = {
    items: [item('one', A, ['x'])],
    edges: [tagEdge('one', 'x'), tagEdge('one', 'x'), { source: 'tag:y', target: 'one', layer: 'tag' }],
    _sources: [A],
  };
  assert.deepStrictEqual(tagListModel(f).map((r) => [r.id, r.count, r.pieces]), [['tag:x', 1, 1], ['tag:y', 1, 1]]);
  assert.deepStrictEqual(tagListModel({}), []);
  assert.deepStrictEqual(tagListModel(null), []);
});

test('filter: the rows whose label has the text, case aside; everything for nothing typed', () => {
  const rows = tagListModel(feed);
  assert.deepStrictEqual(filterTagRows(rows, 'OUT').map((r) => r.label), ['Outdoors']);
  assert.deepStrictEqual(filterTagRows(rows, 'a').map((r) => r.label), ['craft', 'alone'], 'in the list\'s order');
  assert.strictEqual(filterTagRows(rows, '  ').length, rows.length);
  assert.strictEqual(filterTagRows(rows, undefined), rows);
  assert.strictEqual(SEARCH_FROM, 20);
});

test('title: the cards the tag is on, the colour, then the feeds and their counts', () => {
  const rows = tagListModel(feed, { fallbackColor: '#f39c12' });
  const quiet = rows.find((r) => r.id === 'tag:quiet');
  assert.strictEqual(tagRowTitle(quiet), `3 cards · ${quiet.color} · Feed A 2, Feed B 1`);
  assert.strictEqual(tagRowTitle(rows.find((r) => r.id === 'tag:alone')), '1 card · #f39c12', 'a piece without a feed names none');
  assert.strictEqual(tagRowTitle({ color: null, contributors: [] }), '');
  assert.strictEqual(tagRowTitle({ count: 2, color: null, contributors: [] }), '2 cards', 'a row without pieces says its count');
  // A hidden feed: the number is every card's, the feeds are the showing ones.
  const hiddenB = tagListModel(feed, { hiddenSources: ['src:b'] }).find((r) => r.id === 'tag:quiet');
  assert.strictEqual(tagRowTitle(hiddenB), `3 cards · ${hiddenB.color} · Feed A 2`);
});
