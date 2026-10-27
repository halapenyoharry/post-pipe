// Pieces per tag: the panel's slider hides the tag nodes that join fewer
// pieces than its value; at 1, the default, nothing is hidden.

const { test } = require('node:test');
const assert = require('node:assert');
const {
  PREF, clampMinPieces, pieceCounts, tagsBelow, minPiecesSummary, pieceCountsFromFeed,
} = require('../src/lib/minPieces');

test('the preference has a plain key', () => {
  assert.strictEqual(PREF, 'minTagPieces');
});

test('the value in force: a whole number from 1 to the largest count, 1 for nothing chosen', () => {
  assert.strictEqual(clampMinPieces(null, 12), 1);
  assert.strictEqual(clampMinPieces(undefined, 12), 1);
  assert.strictEqual(clampMinPieces('', 12), 1);
  assert.strictEqual(clampMinPieces('abc', 12), 1);
  assert.strictEqual(clampMinPieces(0, 12), 1);
  assert.strictEqual(clampMinPieces(-3, 12), 1);
  assert.strictEqual(clampMinPieces(4, 12), 4);
  assert.strictEqual(clampMinPieces('4', 12), 4);
  assert.strictEqual(clampMinPieces(3.6, 12), 4);
  assert.strictEqual(clampMinPieces(40, 12), 12, 'a stored value above the largest count is the largest');
  assert.strictEqual(clampMinPieces(5, 0), 1, 'with no tags the value is 1');
  assert.strictEqual(clampMinPieces(5, undefined), 1);
});

test('a tag counts its distinct pieces, as ids or nodes; a tag with none counts 0', () => {
  const pieces = new Map([
    ['tag:a', ['p1', 'p2', 'p2']],
    ['tag:b', [{ id: 'p1' }, { id: 'p3' }, { id: 'p3' }]],
  ]);
  const counts = pieceCounts(pieces, ['tag:a', 'tag:b', 'tag:c']);
  assert.deepStrictEqual([...counts], [['tag:a', 2], ['tag:b', 2], ['tag:c', 0]]);
  assert.deepStrictEqual([...pieceCounts(pieces)], [['tag:a', 2], ['tag:b', 2]], 'without a list of tags, the tags in pieces');
  assert.deepStrictEqual([...pieceCounts([['tag:x', ['p']]])], [['tag:x', 1]], 'an iterable of pairs is read as a map');
});

test('at 1 nothing is hidden, a tag with no counted piece included', () => {
  const counts = new Map([['tag:a', 1], ['tag:b', 0], ['tag:c', 7]]);
  assert.strictEqual(tagsBelow(counts, 1).size, 0);
  assert.strictEqual(tagsBelow(counts, null).size, 0);
  assert.strictEqual(tagsBelow(counts, 0).size, 0);
});

test('above 1 a tag with fewer pieces than the value is hidden; one with exactly as many stays', () => {
  const counts = new Map([['tag:a', 1], ['tag:b', 2], ['tag:c', 3], ['tag:d', 5]]);
  assert.deepStrictEqual([...tagsBelow(counts, 3)].sort(), ['tag:a', 'tag:b']);
  assert.deepStrictEqual([...tagsBelow(counts, 5)].sort(), ['tag:a', 'tag:b', 'tag:c']);
});

test('the summary beside the slider: how many of all the tags are drawn, and the range', () => {
  const counts = new Map([['tag:a', 1], ['tag:b', 2], ['tag:c', 3], ['tag:d', 12]]);
  assert.deepStrictEqual(minPiecesSummary(counts, null), { min: 1, max: 12, shown: 4, total: 4 });
  assert.deepStrictEqual(minPiecesSummary(counts, 3), { min: 3, max: 12, shown: 2, total: 4 });
  assert.deepStrictEqual(minPiecesSummary(counts, 99), { min: 12, max: 12, shown: 1, total: 4 });
  assert.deepStrictEqual(minPiecesSummary([1, 1, 4], 2), { min: 2, max: 4, shown: 1, total: 3 }, 'a plain list of counts');
  assert.deepStrictEqual(minPiecesSummary(new Map(), 3), { min: 1, max: 0, shown: 0, total: 0 });
});

test('at 1 the summary counts every tag, one with no piece too', () => {
  assert.deepStrictEqual(minPiecesSummary(new Map([['tag:a', 0], ['tag:b', 2]]), 1), { min: 1, max: 2, shown: 2, total: 2 });
});

test('the counts read from a feed: tag edges to the feed\'s items, each piece once', () => {
  const feed = {
    items: [{ id: 'i1' }, { id: 'i2' }, { id: 'i3' }],
    edges: [
      { source: 'i1', target: 'tag:a', layer: 'tag' },
      { source: 'i2', target: 'tag:a', layer: 'tag' },
      { source: 'i2', target: 'tag:a', layer: 'tag' },
      { source: 'i3', target: 'tag:b', layer: 'tag' },
      { source: 'gone', target: 'tag:b', layer: 'tag' },
      { source: 'tag:a', target: 'tag:b', layer: 'related' },
      { source: 'i1', target: 'i2', layer: 'sequence' },
    ],
  };
  assert.deepStrictEqual([...pieceCountsFromFeed(feed)], [['tag:a', 2], ['tag:b', 1]]);
  assert.strictEqual(pieceCountsFromFeed(null).size, 0);
  assert.strictEqual(pieceCountsFromFeed({ items: [] }).size, 0);
});
