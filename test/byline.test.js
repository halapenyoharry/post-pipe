// The reader's byline: a piece's own authors, else the site's author for a
// piece from the site's own folder, else the title of the source it came from.

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

test('a piece from another source with no author shows that source, linking to the piece', () => {
  const a = { authors: [], url: 'https://publisher.test/story', canonical_url: 'https://publisher.test/story', _source: feed };
  assert.deepStrictEqual(byline(settings, a), { name: 'A Publisher', url: 'https://publisher.test/story' });
  const wrapped = { originalItem: { _source: feed }, url: 'https://publisher.test/story' };
  assert.deepStrictEqual(byline(settings, wrapped), { name: 'A Publisher', url: 'https://publisher.test/story' });
  assert.strictEqual(byline(settings, { _source: { type: 'rss' } }), null);
});

test('no piece, no byline', () => {
  assert.strictEqual(byline(settings, null), null);
});
