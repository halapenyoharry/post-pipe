// The top bar's tag list (src/lib/tagList.js): one row per tag the graph
// draws, counted and coloured as the graph colours the tag node, hidden feeds'
// pieces counting for nothing.
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

test('rows: one per tag, alphabetical case aside, with the pieces counted and the feeds that bring them', () => {
  const rows = tagListModel(feed, { fallbackColor: '#f39c12' });
  assert.deepStrictEqual(rows.map((r) => r.id), ['tag:alone', 'tag:craft', 'tag:Outdoors', 'tag:quiet']);
  assert.deepStrictEqual(rows.map((r) => r.label), ['alone', 'craft', 'Outdoors', 'quiet']);
  assert.deepStrictEqual(rows.map((r) => r.count), [1, 2, 1, 3], 'a piece the graph lacks is not counted');
  const quiet = rows.find((r) => r.id === 'tag:quiet');
  assert.deepStrictEqual(quiet.contributors, [
    { sourceId: 'src:a', title: 'Feed A', count: 2 },
    { sourceId: 'src:b', title: 'Feed B', count: 1 },
  ]);
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
  assert.deepStrictEqual(rows.map((r) => [r.id, r.count]), [['tag:alone', 1], ['tag:craft', 1], ['tag:quiet', 2]]);
  assert.strictEqual(rows.find((r) => r.id === 'tag:quiet').color, '#ff0000', 'only Feed A left in the blend');
  assert.deepStrictEqual(rows.find((r) => r.id === 'tag:quiet').contributors, [{ sourceId: 'src:a', title: 'Feed A', count: 2 }]);
  const arr = tagListModel(feed, { hiddenSources: ['src:a', 'src:b'] });
  assert.deepStrictEqual(arr.map((r) => r.id), ['tag:alone'], 'an array of ids works too');
});

test('rows: a tag listed twice on one piece counts it once; an edge the other way round is read too', () => {
  const f = {
    items: [item('one', A, ['x'])],
    edges: [tagEdge('one', 'x'), tagEdge('one', 'x'), { source: 'tag:y', target: 'one', layer: 'tag' }],
    _sources: [A],
  };
  assert.deepStrictEqual(tagListModel(f).map((r) => [r.id, r.count]), [['tag:x', 1], ['tag:y', 1]]);
  assert.deepStrictEqual(tagListModel({}), []);
  assert.deepStrictEqual(tagListModel(null), []);
});

test('filter: the rows whose label has the text, case aside; everything for nothing typed', () => {
  const rows = tagListModel(feed);
  assert.deepStrictEqual(filterTagRows(rows, 'OUT').map((r) => r.label), ['Outdoors']);
  assert.deepStrictEqual(filterTagRows(rows, 'a').map((r) => r.label), ['alone', 'craft']);
  assert.strictEqual(filterTagRows(rows, '  ').length, rows.length);
  assert.strictEqual(filterTagRows(rows, undefined), rows);
  assert.strictEqual(SEARCH_FROM, 20);
});

test('title: the colour, then the feeds and their counts', () => {
  const rows = tagListModel(feed, { fallbackColor: '#f39c12' });
  const quiet = rows.find((r) => r.id === 'tag:quiet');
  assert.strictEqual(tagRowTitle(quiet), `${quiet.color} · Feed A 2, Feed B 1`);
  assert.strictEqual(tagRowTitle(rows.find((r) => r.id === 'tag:alone')), '#f39c12', 'a piece without a feed names none');
  assert.strictEqual(tagRowTitle({ color: null, contributors: [] }), '');
});
