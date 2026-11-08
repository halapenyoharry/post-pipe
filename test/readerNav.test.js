const test = require('node:test');
const assert = require('node:assert');
const { neighbours, navStatus, step } = require('../src/lib/readerNav');

const feed = {
  items: [
    { id: 'a', tags: ['book', 'one'] },
    { id: 'b', tags: ['book', 'one'] },
    { id: 'c', tags: ['book', 'two'], _posted: 'title' },
    { id: 'd', tags: ['book', 'two'], _posted: 'title' },
  ],
  containers: [
    { id: 'container:book', tag: 'book', parent: null, status: 'the book' },
    { id: 'container:one', tag: 'one', parent: 'container:book' },
    { id: 'container:two', tag: 'two', parent: 'container:book', status: 'soon' },
  ],
  edges: [
    { source: 'a', target: 'b', layer: 'sequence', role: 'next' },
    { source: 'b', target: 'c', layer: 'sequence', role: 'next' },
    { source: 'c', target: 'd', layer: 'sequence', role: 'next' },
    { source: 'a', target: 'one', layer: 'containment' },
  ],
};

test('neighbours follow sequence edges both ways', () => {
  const n = neighbours(feed, 'b');
  assert.deepStrictEqual(n.prev.map((i) => i.id), ['a']);
  assert.deepStrictEqual(n.next.map((i) => i.id), ['c']);
  assert.deepStrictEqual(neighbours(feed, 'a').prev, []);
});

test('a title-only piece shows its deepest container status', () => {
  assert.strictEqual(navStatus(feed, feed.items[2]), 'soon');
  assert.strictEqual(navStatus(feed, feed.items[0]), null);
  assert.strictEqual(navStatus({ items: [], containers: [] }, { id: 'x', _posted: 'title' }, 'later'), 'later');
});

test('a swipe or arrow only goes to a readable neighbour', () => {
  assert.strictEqual(step(feed, 'a', 'next').id, 'b');
  assert.strictEqual(step(feed, 'b', 'next'), null);
  assert.strictEqual(step(feed, 'b', 'prev').id, 'a');
});

// With a flow (a site's Flow presets; src/lib/readingOrder.js flowNav): the
// order the reader chose, its nearest openable card either side.
const flowFeed = {
  items: [
    { id: 'a' }, { id: 'b' },
    { id: 'c', _posted: 'title' },
    { id: 'd' },
    { id: 'l', kind: 'link', link: 'https://example.org' },
    { id: 'e' },
    { id: 'p' },
  ],
  edges: [
    { source: 'a', target: 'b', layer: 'sequence', role: 'next' },
    { source: 'b', target: 'c', layer: 'sequence', role: 'next' },
  ],
};
const order = ['d', 'a', 'c', 'b', 'l', 'e', 'p'];
const ids = (list) => list.map((i) => i.id);

test('with a flow, Next and Previous follow the order, past a card that cannot be read and a link card', () => {
  assert.deepStrictEqual(ids(neighbours(flowFeed, 'a', { order }).prev), ['d']);
  assert.deepStrictEqual(ids(neighbours(flowFeed, 'a', { order }).next), ['b'], 'c, title only, is passed over');
  assert.deepStrictEqual(ids(neighbours(flowFeed, 'b', { order }).prev), ['a']);
  assert.deepStrictEqual(ids(neighbours(flowFeed, 'b', { order }).next), ['e'], 'l, a link card, is passed over');
  assert.deepStrictEqual(neighbours(flowFeed, 'd', { order }).prev, [], 'the first card has no previous');
  assert.deepStrictEqual(ids(neighbours(flowFeed, 'p', { order }).prev), ['e']);
  assert.deepStrictEqual(neighbours(flowFeed, 'p', { order }).next, [], 'the last card has no next');
  // A card that cannot be read still has its place in the order.
  assert.deepStrictEqual(ids(neighbours(flowFeed, 'c', { order }).prev), ['a']);
  assert.deepStrictEqual(ids(neighbours(flowFeed, 'c', { order }).next), ['b']);
  // A card the order does not hold has none.
  assert.deepStrictEqual(neighbours(flowFeed, 'zz', { order }), { prev: [], next: [] });
});

test('with a flow, the arrow keys and swipes go where Next and Previous go', () => {
  assert.strictEqual(step(flowFeed, 'a', 'next', { order }).id, 'b');
  assert.strictEqual(step(flowFeed, 'b', 'next', { order }).id, 'e');
  assert.strictEqual(step(flowFeed, 'b', 'prev', { order }).id, 'a');
  assert.strictEqual(step(flowFeed, 'd', 'prev', { order }), null);
  assert.strictEqual(step(flowFeed, 'p', 'next', { order }), null);
});

test('with a flow, the top bar\'s own pages are no card of it', () => {
  const skip = new Set(['p']);
  assert.deepStrictEqual(neighbours(flowFeed, 'e', { order, skip }).next, [], 'p, a top bar page, is passed over');
  assert.deepStrictEqual(neighbours(flowFeed, 'p', { order, skip }), { prev: [], next: [] }, 'a page opened from its button has none');
  assert.deepStrictEqual(ids(neighbours(flowFeed, 'e', { order, skip: ['p'] }).prev), ['b'], 'skip may be a list');
});

test('without a flow, Next and Previous stay on sequence edges', () => {
  assert.deepStrictEqual(ids(neighbours(flowFeed, 'a').next), ['b']);
  assert.deepStrictEqual(ids(neighbours(flowFeed, 'a', undefined).next), ['b']);
  assert.deepStrictEqual(ids(neighbours(flowFeed, 'b', {}).next), ['c'], 'options without an order are the sequence edges');
  assert.strictEqual(step(flowFeed, 'b', 'next'), null, 'c is title only, as before');
  assert.deepStrictEqual(neighbours(flowFeed, 'd'), { prev: [], next: [] });
});
