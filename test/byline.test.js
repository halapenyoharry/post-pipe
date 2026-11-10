// The reader's byline, kept for the piece's author: a piece's own authors,
// else the site's author for a piece from the site's own folder, else none.
// The source a piece came from is named by the reader's source pill, never by
// the byline.

const { test } = require('node:test');
const assert = require('node:assert');
const { byline } = require('../src/lib/byline');

const settings = { author: { name: 'Some Author', url: 'https://example.test/about' } };
const local = { id: 'local://~/Posts', title: 'Posts', type: 'local' };
const feed = { id: 'https://publisher.test/rss.xml', title: 'A Publisher', type: 'rss' };

test('a piece that names its authors shows them', () => {
  const a = { authors: [{ name: 'Ann Writer', url: 'https://ann.test' }, { name: 'Bo' }], canonical_url: 'https://x.test/p', _source: feed };
  assert.deepStrictEqual(byline(settings, a), { name: 'ann writer, bo', url: 'https://ann.test' });
  const noUrl = { authors: [{ name: 'Ann' }], url: 'https://x.test/p', _source: feed };
  assert.deepStrictEqual(byline(settings, noUrl), { name: 'ann', url: 'https://x.test/p' });
  const legacy = { author: 'Ann', canonical_url: 'https://x.test/c', url: 'https://x.test/p' };
  assert.deepStrictEqual(byline(settings, legacy), { name: 'ann', url: 'https://x.test/c' });
});

test('a local piece with no author takes the site author, as the build does', () => {
  assert.deepStrictEqual(byline(settings, { authors: [], _source: local }), { name: 'some author', url: 'https://example.test/about' });
  assert.deepStrictEqual(byline(settings, { title: 'no source stamp at all' }), { name: 'some author', url: 'https://example.test/about' });
  assert.deepStrictEqual(byline({ author: { display: 'Shown Name' } }, { _source: local }), { name: 'shown name', url: null });
  assert.strictEqual(byline({}, { _source: local }), null);
});

test('a publisher\'s piece that names its author shows that author, not the source', () => {
  const a = { authors: [{ name: 'Ann Writer' }], url: 'https://publisher.test/story', _source: feed };
  assert.deepStrictEqual(byline(settings, a), { name: 'ann writer', url: 'https://publisher.test/story' });
  const legacy = { author: 'Bo Reporter', url: 'https://publisher.test/story', _source: feed };
  assert.deepStrictEqual(byline(settings, legacy), { name: 'bo reporter', url: 'https://publisher.test/story' });
  const wrapped = { authors: [{ name: 'Ann Writer' }], url: 'https://publisher.test/story', originalItem: { _source: feed } };
  assert.deepStrictEqual(byline(settings, wrapped), { name: 'ann writer', url: 'https://publisher.test/story' });
});

test('a publisher\'s piece with no author has no byline: the source pill names the source', () => {
  const a = { authors: [], url: 'https://publisher.test/story', canonical_url: 'https://publisher.test/story', _source: feed };
  assert.strictEqual(byline(settings, a), null);
  const wrapped = { originalItem: { _source: feed }, url: 'https://publisher.test/story' };
  assert.strictEqual(byline(settings, wrapped), null, 'a graph node carrying the feed item');
  assert.strictEqual(byline(settings, { author: '  ', _source: feed }), null, 'spaces are no author');
  assert.strictEqual(byline(settings, { _source: { type: 'rss' } }), null);
  // The site's author is not taken for a publisher's piece.
  assert.strictEqual(byline({ author: { name: 'Some Author' } }, { _source: feed }), null);
});

test('no piece, no byline', () => {
  assert.strictEqual(byline(settings, null), null);
});
