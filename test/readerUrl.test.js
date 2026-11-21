const { test } = require('node:test');
const assert = require('node:assert');
const {
  readerUrlStyle,
  itemSlug,
  configuredBasePath,
  siteBasePath,
  pathSlugFromLocation,
  parseReaderLocation,
  articlePath,
  articleAbsoluteUrl,
  closedPath,
  hasReaderRoute,
  resolveReaderHref,
} = require('../src/lib/readerUrl');
const { startState } = require('../src/lib/opening');

const PAPERZ_SETTINGS = {
  site: { base_url: 'https://haroldyoung.net/paperz' },
  reader: { urlStyle: 'path' },
};

const ITEMS = [
  {
    id: 'https://haroldyoung.net/paperz/riemann-hypothesis.html',
    url: 'https://haroldyoung.net/paperz/riemann-hypothesis.html',
    slug: 'riemann-hypothesis',
    title: 'The zero spiral',
  },
  {
    id: 'https://haroldyoung.net/paperz/squash-the-triangle.html',
    url: 'https://haroldyoung.net/paperz/squash-the-triangle.html',
    slug: 'squash-the-triangle',
    title: 'Squash the triangle',
  },
  {
    id: 'https://example.com/posts/plain-post.html',
    url: 'https://example.com/posts/plain-post.html',
    title: 'Plain post',
  },
];

test('readerUrlStyle defaults to hash and recognizes path', () => {
  assert.strictEqual(readerUrlStyle(undefined), 'hash');
  assert.strictEqual(readerUrlStyle({}), 'hash');
  assert.strictEqual(readerUrlStyle({ reader: { urlStyle: 'hash' } }), 'hash');
  assert.strictEqual(readerUrlStyle({ reader: { urlStyle: 'anything' } }), 'hash');
  assert.strictEqual(readerUrlStyle(PAPERZ_SETTINGS), 'path');
});

test('itemSlug uses item.slug or falls back to url last segment without .html', () => {
  assert.strictEqual(itemSlug(ITEMS[0]), 'riemann-hypothesis');
  assert.strictEqual(itemSlug(ITEMS[2]), 'plain-post');
  assert.strictEqual(itemSlug(null), '');
});

test('siteBasePath computes subpath bases cleanly', () => {
  assert.strictEqual(configuredBasePath(PAPERZ_SETTINGS), '/paperz/');
  assert.strictEqual(siteBasePath('/paperz/', PAPERZ_SETTINGS), '/paperz/');
  assert.strictEqual(siteBasePath('/paperz', PAPERZ_SETTINGS), '/paperz/');
  assert.strictEqual(siteBasePath('/paperz/riemann-hypothesis', PAPERZ_SETTINGS), '/paperz/');
  assert.strictEqual(siteBasePath('/paperz/index.html', PAPERZ_SETTINGS), '/paperz/');
  assert.strictEqual(siteBasePath('/riemann-hypothesis', { reader: { urlStyle: 'path' } }), '/');
  assert.strictEqual(siteBasePath('/index.html', {}), '/');
});

test('pathSlugFromLocation ignores root, index.html, and nested subpaths', () => {
  assert.strictEqual(pathSlugFromLocation('/paperz/', PAPERZ_SETTINGS), '');
  assert.strictEqual(pathSlugFromLocation('/paperz', PAPERZ_SETTINGS), '');
  assert.strictEqual(pathSlugFromLocation('/paperz/index.html', PAPERZ_SETTINGS), '');
  assert.strictEqual(pathSlugFromLocation('/paperz/riemann-hypothesis', PAPERZ_SETTINGS), 'riemann-hypothesis');
  assert.strictEqual(pathSlugFromLocation('/paperz/riemann-hypothesis/', PAPERZ_SETTINGS), 'riemann-hypothesis');
  assert.strictEqual(pathSlugFromLocation('/paperz/a/b', PAPERZ_SETTINGS), '');
  assert.strictEqual(pathSlugFromLocation('/paperz/riemann-hypothesis', {}), '');
});

test('parseReaderLocation resolves path slugs, #p= paragraphs, and legacy #read= links', () => {
  const r1 = parseReaderLocation({ pathname: '/paperz/riemann-hypothesis', hash: '' }, ITEMS, PAPERZ_SETTINGS);
  assert.strictEqual(r1.item, ITEMS[0]);
  assert.strictEqual(r1.paragraph, null);
  assert.strictEqual(r1.legacyHash, false);

  const r2 = parseReaderLocation({ pathname: '/paperz/riemann-hypothesis', hash: '#p=14' }, ITEMS, PAPERZ_SETTINGS);
  assert.strictEqual(r2.item, ITEMS[0]);
  assert.strictEqual(r2.paragraph, 14);
  assert.strictEqual(r2.legacyHash, false);

  const legacy = parseReaderLocation(
    {
      pathname: '/paperz/',
      hash: '#read=' + encodeURIComponent(ITEMS[0].id) + '&p=7',
    },
    ITEMS,
    PAPERZ_SETTINGS,
  );
  assert.strictEqual(legacy.item, ITEMS[0]);
  assert.strictEqual(legacy.paragraph, 7);
  assert.strictEqual(legacy.legacyHash, true);

  const bySlugHash = parseReaderLocation(
    { pathname: '/paperz/', hash: '#read=squash-the-triangle' },
    ITEMS,
    PAPERZ_SETTINGS,
  );
  assert.strictEqual(bySlugHash.item, ITEMS[1]);
  assert.strictEqual(bySlugHash.legacyHash, true);

  const missing = parseReaderLocation({ pathname: '/paperz/no-such-paper', hash: '' }, ITEMS, PAPERZ_SETTINGS);
  assert.strictEqual(missing.item, null);
});

test('articlePath, articleAbsoluteUrl, and closedPath work in hash and path modes', () => {
  assert.strictEqual(
    articlePath(ITEMS[0], { pathname: '/paperz/', search: '', settings: {} }),
    '/paperz/#read=' + encodeURIComponent(ITEMS[0].id),
  );
  assert.strictEqual(
    articlePath(ITEMS[0], { pathname: '/paperz/', search: '?view=ring', settings: PAPERZ_SETTINGS, paragraph: 5 }),
    '/paperz/riemann-hypothesis?view=ring#p=5',
  );
  assert.strictEqual(
    articleAbsoluteUrl(ITEMS[0], {
      origin: 'https://haroldyoung.net',
      pathname: '/paperz/riemann-hypothesis',
      search: '',
      settings: PAPERZ_SETTINGS,
      paragraph: 9,
    }),
    'https://haroldyoung.net/paperz/riemann-hypothesis#p=9',
  );
  assert.strictEqual(
    closedPath({ pathname: '/paperz/riemann-hypothesis', search: '?view=cluster', settings: PAPERZ_SETTINGS }),
    '/paperz/?view=cluster',
  );
  assert.strictEqual(closedPath({ pathname: '/paperz/', search: '', settings: {} }), '/paperz/');
});

test('hasReaderRoute and Opening.startState open graph directly on clean article URLs', () => {
  assert.strictEqual(hasReaderRoute({ pathname: '/paperz/', hash: '' }, PAPERZ_SETTINGS), false);
  assert.strictEqual(hasReaderRoute({ pathname: '/paperz/riemann-hypothesis', hash: '' }, PAPERZ_SETTINGS), true);
  assert.strictEqual(hasReaderRoute({ pathname: '/', hash: '#read=x' }, {}), true);

  const openingCfg = { enabled: true, startOn: 'art' };
  assert.strictEqual(
    startState(openingCfg, {
      stored: 'art',
      pathname: '/paperz/riemann-hypothesis',
      hash: '',
      settings: PAPERZ_SETTINGS,
    }),
    'graph',
  );
  assert.strictEqual(
    startState(openingCfg, { stored: 'art', pathname: '/paperz/', hash: '', settings: PAPERZ_SETTINGS }),
    'art',
  );
});

test('resolveReaderHref matches in-site article links without hijacking same-page section anchors or external links', () => {
  const base = 'https://haroldyoung.net/paperz/riemann-hypothesis';
  const wikilink = resolveReaderHref('./squash-the-triangle', base, ITEMS, PAPERZ_SETTINGS);
  assert.ok(wikilink);
  assert.strictEqual(wikilink.item, ITEMS[1]);
  assert.strictEqual(wikilink.paragraph, null);

  const hashLink = resolveReaderHref('#read=squash-the-triangle&p=3', base, ITEMS, PAPERZ_SETTINGS);
  assert.ok(hashLink);
  assert.strictEqual(hashLink.item, ITEMS[1]);
  assert.strictEqual(hashLink.paragraph, 3);

  assert.strictEqual(resolveReaderHref('#1-the-spiral-that-keeps-hitting-zero', base, ITEMS, PAPERZ_SETTINGS), null);
  assert.strictEqual(resolveReaderHref('https://arxiv.org/abs/1505.01548', base, ITEMS, PAPERZ_SETTINGS), null);
});
