const { test } = require('node:test');
const assert = require('node:assert');
const {
  autodiscoverEnabled,
  parseAlternateFeedLink,
  discoverFeedUrl,
} = require('../src/lib/feedAutodiscovery');

test('autodiscoverEnabled defaults to true and turns off when topBar.autodiscover is false', () => {
  assert.strictEqual(autodiscoverEnabled({}), true);
  assert.strictEqual(autodiscoverEnabled({ topBar: {} }), true);
  assert.strictEqual(autodiscoverEnabled({ topBar: { autodiscover: true } }), true);
  assert.strictEqual(autodiscoverEnabled({ topBar: { autodiscover: false } }), false);
  assert.strictEqual(autodiscoverEnabled({ autodiscover: false }), false);
});

test('parseAlternateFeedLink extracts rss, atom, and json feed links and resolves relative hrefs', () => {
  const rssHtml = `<!doctype html><html><head>
    <link rel="stylesheet" href="/style.css">
    <link rel="alternate" type="application/rss+xml" title="RSS" href="/feed.xml">
  </head><body></body></html>`;
  assert.strictEqual(
    parseAlternateFeedLink(rssHtml, 'https://example.org/blog/post-1'),
    'https://example.org/feed.xml',
  );

  const atomHtml = `<html><head>
    <link href="atom.xml" type='application/atom+xml; charset=utf-8' rel="alternate">
  </head></html>`;
  assert.strictEqual(
    parseAlternateFeedLink(atomHtml, 'https://example.org/notes/index.html'),
    'https://example.org/notes/atom.xml',
  );

  const jsonFeedHtml = `<html><head>
    <link rel="alternate" type="application/feed+json" href="https://feeds.example.org/feed.json">
  </head></html>`;
  assert.strictEqual(
    parseAlternateFeedLink(jsonFeedHtml, 'https://example.org/'),
    'https://feeds.example.org/feed.json',
  );
});

test('parseAlternateFeedLink returns null for non-HTML or pages without a feed alternate link', () => {
  const xmlFeed = `<?xml version="1.0"?><rss version="2.0"><channel><link>https://example.org</link></channel></rss>`;
  assert.strictEqual(parseAlternateFeedLink(xmlFeed, 'https://example.org/rss.xml'), null);

  const plainHtml = `<!doctype html><html><head><link rel="alternate" hreflang="fr" href="/fr/"></head></html>`;
  assert.strictEqual(parseAlternateFeedLink(plainHtml, 'https://example.org/'), null);
});

test('discoverFeedUrl resolves the feed href when enabled and skips fetching when disabled', async () => {
  let fetched = 0;
  const fakeFetch = async () => {
    fetched += 1;
    return {
      ok: true,
      url: 'https://example.org/blog/',
      text: async () => `<!doctype html><html><head><link rel="alternate" type="application/atom+xml" href="feed.atom"></head></html>`,
    };
  };

  const off = await discoverFeedUrl('https://example.org/blog/', {
    autodiscover: false,
    fetchImpl: fakeFetch,
  });
  assert.strictEqual(off, 'https://example.org/blog/');
  assert.strictEqual(fetched, 0, 'does not fetch when switch is off');

  const on = await discoverFeedUrl('https://example.org/blog/', {
    autodiscover: true,
    fetchImpl: fakeFetch,
  });
  assert.strictEqual(on, 'https://example.org/blog/feed.atom');
  assert.strictEqual(fetched, 1);

  const failing = await discoverFeedUrl('https://example.org/blog/', {
    autodiscover: true,
    fetchImpl: async () => { throw new Error('CORS blocked'); },
  });
  assert.strictEqual(failing, 'https://example.org/blog/', 'falls back to original URL on fetch failure');
});
