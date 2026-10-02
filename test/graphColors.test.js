// The panel's graph colors are offered only for what the graph draws.

const { test } = require('node:test');
const assert = require('node:assert');
const { colorKeysInUse } = require('../src/lib/graphColors');
const { graphFeed, topBarConfig } = require('../src/lib/topBar');

const feed = {
  containers: [{ id: 'container:book' }, { id: 'container:act-1', parent: 'container:book', tag: 'act-1' }],
  items: [
    { id: 'ch1', tags: ['act-1'], _status: 'published' },
    { id: 'ch2', tags: ['act-1'], _status: 'draft' },
    { id: 'about', tags: [], _status: 'draft' },
  ],
  edges: [{ source: 'ch1', target: 'ch2', layer: 'sequence' }],
};

test('cards inside a container take its color: only cards outside one count', () => {
  assert.deepStrictEqual([...colorKeysInUse(feed)], ['draft']);
});

test('an item kept out of the graph by the top bar is not counted, so nothing is offered', () => {
  const settings = { topBar: { pages: [{ id: 'about', label: 'about', hideFromGraph: true }] } };
  assert.deepStrictEqual([...colorKeysInUse(graphFeed(feed, topBarConfig(settings)))], []);
});

test('edge layers count when there are such edges', () => {
  const f = { ...feed, edges: [{ source: 'ch1', target: 'ch2', layer: 'tag' }, { source: 'ch1', target: 'gone', layer: 'authored' }] };
  assert.deepStrictEqual([...colorKeysInUse(f)].sort(), ['draft', 'placeholder', 'tag']);
  assert.strictEqual(colorKeysInUse(null), null);
});
