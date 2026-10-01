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
