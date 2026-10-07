// The top bar's pages: found by id or slug, and kept out of the graph when
// the site says so, edges and all, while the reader still has them.

const { test } = require('node:test');
const assert = require('node:assert');
const { topBarConfig, findItem, resolvePages, graphFeed, subscribeConfig, subscribeResult, subscribe } = require('../src/lib/topBar');

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
  assert.deepStrictEqual(topBarConfig({}), { pages: [], links: [], subscribe: null, addFeed: true, showSourcePills: true, resume: null, order: [] });
  assert.deepStrictEqual(topBarConfig({ topBar: { pages: [{ id: 'about', label: 'About', hideFromGraph: true }, { id: ' ' }, null, { id: 'x' }] } }).pages,
    [{ id: 'about', label: 'About', hideFromGraph: true, icon: '', showLabel: true }, { id: 'x', label: 'x', hideFromGraph: false, icon: '', showLabel: true }]);
});

const BOOK = '<path d="M12 7v14"/>';

test('settings: a page\'s icon, its label shown unless showLabel is false (and never hidden without an icon)', () => {
  const [a, b, c] = topBarConfig({ topBar: { pages: [
    { id: 'a', label: 'about', icon: BOOK },
    { id: 'b', label: 'about', icon: BOOK, showLabel: false },
    { id: 'c', label: 'about', showLabel: false },
  ] } }).pages;
  assert.deepStrictEqual([a.icon, a.showLabel], [BOOK, true]);
  assert.deepStrictEqual([b.icon, b.showLabel], [BOOK, false]);
  assert.deepStrictEqual([c.icon, c.showLabel], ['', true]);
});

test('settings: links with a label, an address and an icon; a new tab only when asked; the label shown only when asked', () => {
  const { links } = topBarConfig({ topBar: { links: [
    { id: 'cup', label: 'buy me a coffee', href: 'https://example.org/give', icon: BOOK, newTab: true },
    { label: 'site', href: '/about/', showLabel: true, icon: BOOK },
    { id: 'bare', label: 'bare', href: 'https://example.org' },
    { id: 'bad', label: 'bad', href: 'javascript:alert(1)' },
    { id: 'none', label: 'none' },
    { href: 'https://example.org' },
  ] } });
  assert.deepStrictEqual(links, [
    { id: 'cup', label: 'buy me a coffee', href: 'https://example.org/give', icon: BOOK, newTab: true, showLabel: false },
    { id: 'link-2', label: 'site', href: '/about/', icon: BOOK, newTab: false, showLabel: true },
    { id: 'bare', label: 'bare', href: 'https://example.org', icon: '', newTab: false, showLabel: true },
  ]);
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

test('addFeed: the "+" is shown unless a site turns it off', () => {
  assert.equal(topBarConfig({}).addFeed, true);
  assert.equal(topBarConfig({ topBar: {} }).addFeed, true);
  assert.equal(topBarConfig({ topBar: { addFeed: false } }).addFeed, false);
  assert.equal(topBarConfig({ topBar: { addFeed: 'no' } }).addFeed, true, 'only false turns it off');
});

test('subscribe: off without an action; defaults for the rest; an icon body kept', () => {
  assert.strictEqual(subscribeConfig(undefined), null);
  assert.strictEqual(subscribeConfig({ label: 'x' }), null);
  assert.strictEqual(subscribeConfig({ action: 'javascript:x()' }), null);
  assert.strictEqual(subscribeConfig({ action: 'mailto:a@b.c' }), null);
  assert.deepStrictEqual(subscribeConfig({ action: '/api/subscribe' }), {
    action: '/api/subscribe', method: 'POST', field: 'email', label: 'Subscribe', icon: '', placeholder: 'Email address',
    thanks: 'Thank you.', error: 'Something went wrong. Please try again.', newTab: false,
  });
  const c = topBarConfig({ topBar: { subscribe: { action: 'https://x.org/s', method: 'put', field: 'address', label: 'notify me', icon: BOOK, placeholder: 'p', thanks: 't', error: 'e', newTab: true } } }).subscribe;
  assert.deepStrictEqual(c, { action: 'https://x.org/s', method: 'PUT', field: 'address', label: 'notify me', icon: BOOK, placeholder: 'p', thanks: 't', error: 'e', newTab: true });
  assert.strictEqual(subscribeConfig({ action: '/s', method: 'GET' }).method, 'POST');
});

const SUB = subscribeConfig({ action: '/api/subscribe', thanks: 'thanks!', error: 'oops' });

test('subscribe result: 2xx is thanks; otherwise the reply\'s error, else the site\'s', () => {
  assert.deepStrictEqual(subscribeResult(SUB, 200, { success: true }), { ok: true, message: 'thanks!' });
  assert.deepStrictEqual(subscribeResult(SUB, 204, null), { ok: true, message: 'thanks!' });
  assert.deepStrictEqual(subscribeResult(SUB, 400, { error: 'Already on the list.' }), { ok: false, message: 'Already on the list.' });
  assert.deepStrictEqual(subscribeResult(SUB, 400, { error: '  ' }), { ok: false, message: 'oops' });
  assert.deepStrictEqual(subscribeResult(SUB, 500, null), { ok: false, message: 'oops' });
  assert.deepStrictEqual(subscribeResult(SUB, 302, { error: 7 }), { ok: false, message: 'oops' });
});

test('subscribe: posts JSON { field: value } to the action, and maps the reply (fake fetch)', async () => {
  const calls = [];
  const fake = (status, body, { throws = false, badJson = false } = {}) => async (url, opts) => {
    calls.push({ url, opts });
    if (throws) throw new TypeError('Failed to fetch');
    return { status, ok: status >= 200 && status < 300, json: async () => { if (badJson) throw new SyntaxError('x'); return body; } };
  };
  assert.deepStrictEqual(await subscribe(SUB, ' a@b.co ', fake(200, { success: true })), { ok: true, message: 'thanks!' });
  assert.strictEqual(calls[0].url, '/api/subscribe');
  assert.strictEqual(calls[0].opts.method, 'POST');
  assert.strictEqual(calls[0].opts.headers['Content-Type'], 'application/json');
  assert.deepStrictEqual(JSON.parse(calls[0].opts.body), { email: 'a@b.co' });
  assert.deepStrictEqual(await subscribe(SUB, 'a@b.co', fake(400, { error: 'Please enter a valid email address.' })), { ok: false, message: 'Please enter a valid email address.' });
  assert.deepStrictEqual(await subscribe(SUB, 'a@b.co', fake(502, null, { badJson: true })), { ok: false, message: 'oops' });
  assert.deepStrictEqual(await subscribe(SUB, 'a@b.co', fake(0, null, { throws: true })), { ok: false, message: 'oops' });
  const named = subscribeConfig({ action: '/s', field: 'address' });
  await subscribe(named, 'x@y.z', fake(200, {}));
  assert.deepStrictEqual(JSON.parse(calls[calls.length - 1].opts.body), { address: 'x@y.z' });
});

test('showSourcePills: a pill per source unless a site turns them off', () => {
  assert.equal(topBarConfig({}).showSourcePills, true);
  assert.equal(topBarConfig({ topBar: { showSourcePills: false } }).showSourcePills, false);
  assert.equal(topBarConfig({ topBar: { showSourcePills: 'no' } }).showSourcePills, true);
});
