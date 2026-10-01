// The top bar's pages: found by id or slug, and kept out of the graph when
// the site says so, edges and all, while the reader still has them.

const { test } = require('node:test');
const assert = require('node:assert');
const { topBarConfig, findItem, resolvePages, graphFeed } = require('../src/lib/topBar');

const feed = {
  items: [
    { id: 'http://x/about.html', url: 'http://x/about.html', title: 'About' },
    { id: 'http://x/ch1.html', url: 'http://x/ch1.html', title: 'One' },
  ],
  edges: [
    { source: 'container:book', target: 'http://x/about.html', layer: 'containment' },
    { source: 'container:book', target: 'http://x/ch1.html', layer: 'containment' },
    { source: 'http://x/ch1.html', target: 'http://x/about.html', layer: 'sequence' },
  ],
};

test('settings: pages with an id, a label (the id when none), hideFromGraph only when true', () => {
  assert.deepStrictEqual(topBarConfig({}), { pages: [] });
  assert.deepStrictEqual(topBarConfig({ topBar: { pages: [{ id: 'about', label: 'About', hideFromGraph: true }, { id: ' ' }, null, { id: 'x' }] } }).pages,
    [{ id: 'about', label: 'About', hideFromGraph: true }, { id: 'x', label: 'x', hideFromGraph: false }]);
});

test('a page finds its item by id or by slug, and a page with no item is left out', () => {
  assert.equal(findItem(feed.items, 'http://x/ch1.html').title, 'One');
  assert.equal(findItem(feed.items, 'about').title, 'About');
  assert.equal(findItem(feed.items, 'nothing'), null);
  const pages = resolvePages(topBarConfig({ topBar: { pages: [{ id: 'about', label: 'About' }, { id: 'gone' }] } }), feed.items);
  assert.equal(pages.length, 1);
  assert.equal(pages[0].item.id, 'http://x/about.html');
});

test('hideFromGraph: the graph is drawn without the item and its edges; nothing else changes', () => {
  const kept = graphFeed(feed, topBarConfig({ topBar: { pages: [{ id: 'about', label: 'About' }] } }));
  assert.strictEqual(kept, feed, 'not hidden: the same feed');
  const g = graphFeed(feed, topBarConfig({ topBar: { pages: [{ id: 'about', label: 'About', hideFromGraph: true }] } }));
  assert.deepStrictEqual(g.items.map((i) => i.title), ['One']);
  assert.equal(g.edges.length, 1);
  assert.equal(g.edges[0].target, 'http://x/ch1.html');
  assert.equal(feed.items.length, 2, 'the feed itself is untouched (the reader still opens the item)');
});
