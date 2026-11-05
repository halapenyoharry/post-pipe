// The subscription seam. OPML is the format every feed reader exports, so this
// parser is how somebody else's reading list becomes a corpus here. Being
// forgiving about what arrives is the requirement.

const { test } = require('node:test');
const assert = require('node:assert');
const { parseOpml } = require('../src/lib/opml');

const wrap = (body) =>
  `<?xml version="1.0" encoding="UTF-8"?><opml version="2.0"><head><title>t</title></head><body>${body}</body></opml>`;

test('reads a NetNewsWire export unchanged', () => {
  // Verbatim shape of inbox/Subscriptions-OnMyMac.opml.
  const feeds = parseOpml(wrap(
    `<outline text="ProPublica" title="ProPublica" description="" type="rss" version="RSS"
              htmlUrl="https://www.propublica.org/" xmlUrl="https://www.propublica.org/feeds/propublica/main"/>`,
  ));
  assert.strictEqual(feeds.length, 1);
  assert.strictEqual(feeds[0].type, 'rss');
  assert.strictEqual(feeds[0].xmlUrl, 'https://www.propublica.org/feeds/propublica/main');
  assert.strictEqual(feeds[0].title, 'ProPublica');
});

test('the local:// scheme marks a folder rather than a network feed', () => {
  const [feed] = parseOpml(wrap(
    `<outline type="local" text="My Writing" xmlUrl="local://~/Posts" customColor="#2ecc71"/>`,
  ));
  assert.strictEqual(feed.type, 'local');
  assert.strictEqual(feed.customColor, '#2ecc71');
});

test('folders are preserved, not flattened away', () => {
  // Readers organize subscriptions into hierarchies. That structure is the
  // user's own topology and is worth keeping.
  const feeds = parseOpml(wrap(
    `<outline text="News"><outline text="Politics">
       <outline type="rss" text="A" xmlUrl="https://a.test/rss"/>
     </outline></outline>`,
  ));
  assert.strictEqual(feeds.length, 1);
  assert.strictEqual(feeds[0].folder, 'News/Politics');
});

test('a container without an xmlUrl is not mistaken for a feed', () => {
  const feeds = parseOpml(wrap(`<outline text="Empty Folder"></outline>`));
  assert.deepStrictEqual(feeds, []);
});

test('type is inferred when the export omits it', () => {
  const feeds = parseOpml(wrap(
    `<outline text="J" xmlUrl="https://x.test/feed.json"/>` +
    `<outline text="A" xmlUrl="https://x.test/atom.xml"/>`,
  ));
  assert.strictEqual(feeds[0].type, 'json', 'a .json feed is JSON Feed, not RSS');
  assert.ok(feeds[1].type, 'something is always inferred rather than left undefined');
});

test('an empty subscription list is not an error', () => {
  assert.deepStrictEqual(parseOpml(wrap('')), []);
});

test('a local folder is primary and a subscribed feed is secondary by default', () => {
  // Your own corpus and a subscribed firehose are not peers. This used to fall
  // out of the status field by accident, which meant your own drafts rendered
  // identically to somebody else's news.
  const feeds = parseOpml(wrap(
    `<outline type="local" text="Mine" xmlUrl="local://~/Posts"/>` +
    `<outline type="rss" text="Theirs" xmlUrl="https://x.test/rss"/>`,
  ));
  assert.strictEqual(feeds[0].prominence, 'primary');
  assert.strictEqual(feeds[1].prominence, 'secondary');
});

test('prominence can be set explicitly, including against the default', () => {
  const feeds = parseOpml(wrap(
    `<outline type="rss" text="Close reading" xmlUrl="https://x.test/rss" prominence="primary"/>` +
    `<outline type="local" text="Archive" xmlUrl="local://~/Old" prominence="secondary"/>`,
  ));
  assert.strictEqual(feeds[0].prominence, 'primary');
  assert.strictEqual(feeds[1].prominence, 'secondary');
});

test('an unrecognised prominence falls back to the default rather than through', () => {
  const [feed] = parseOpml(wrap(
    `<outline type="local" text="Mine" xmlUrl="local://~/Posts" prominence="loudest"/>`,
  ));
  assert.strictEqual(feed.prominence, 'primary');
});

test('per-feed display attributes (cardScale, itemCap, defaultHidden) are parsed from OPML and applied by the aggregator', async () => {
  const { loadCorpus } = require('../src/aggregator');
  const { createViewState } = require('../src/lib/viewState');
  const feeds = parseOpml(wrap(
    `<outline type="rss" text="Busy" xmlUrl="https://busy.test/rss" cardScale="0.8" itemCap="2" defaultHidden="true"/>` +
    `<outline type="rss" text="Plain" xmlUrl="https://plain.test/rss"/>`,
  ));
  assert.strictEqual(feeds[0].cardScale, 0.8);
  assert.strictEqual(feeds[0].itemCap, 2);
  assert.strictEqual(feeds[0].defaultHidden, true);
  assert.strictEqual(feeds[1].cardScale, null);
  assert.strictEqual(feeds[1].itemCap, null);
  assert.strictEqual(feeds[1].defaultHidden, false);

  const fakeAdapter = {
    id: 'rss',
    async load(cfg) {
      return {
        feedMeta: { id: cfg.id, title: cfg.title },
        items: [
          { id: `${cfg.id}#1`, url: `${cfg.id}/1.html`, title: 'One', date_published: '2026-01-01T00:00:00Z' },
          { id: `${cfg.id}#2`, url: `${cfg.id}/2.html`, title: 'Two', date_published: '2026-01-03T00:00:00Z' },
          { id: `${cfg.id}#3`, url: `${cfg.id}/3.html`, title: 'Three', date_published: '2026-01-02T00:00:00Z' },
        ],
      };
    },
  };

  const corpus = await loadCorpus(
    feeds.map((f) => ({ adapter: fakeAdapter, config: { ...f, id: f.xmlUrl } })),
    {
      feeds: {
        'https://plain.test/rss': { cardScale: 1.25, itemCap: 1, defaultHidden: true },
      },
    },
  );

  const busySource = corpus.sources.find((s) => s.id === 'https://busy.test/rss');
  const plainSource = corpus.sources.find((s) => s.id === 'https://plain.test/rss');
  assert.strictEqual(busySource.cardScale, 0.8);
  assert.strictEqual(busySource.itemCap, 2);
  assert.strictEqual(busySource.defaultHidden, true);
  assert.strictEqual(busySource.itemCount, 2, 'busy feed capped at 2 newest items');

  assert.strictEqual(plainSource.cardScale, 1.25, 'settings.feeds overrides per-feed display parameters');
  assert.strictEqual(plainSource.itemCap, 1);
  assert.strictEqual(plainSource.defaultHidden, true);
  assert.strictEqual(plainSource.itemCount, 1);

  // ViewState seeds defaultHidden sources once and lets the reader unhide them.
  const vs = createViewState({ debounceMs: 0 });
  await vs.ready();
  vs.seedHiddenSources(corpus.sources.filter((s) => s.defaultHidden).map((s) => s.id));
  assert.strictEqual(vs.isHidden('https://busy.test/rss'), true);
  vs.toggleSource('https://busy.test/rss');
  assert.strictEqual(vs.isHidden('https://busy.test/rss'), false);
  vs.seedHiddenSources(corpus.sources.filter((s) => s.defaultHidden).map((s) => s.id));
  assert.strictEqual(vs.isHidden('https://busy.test/rss'), false, 're-seeding does not override reader choice');
});


test('a page entry names one article\'s address; a pages entry names a local list of them', () => {
  // Neither is inferred: an address with no type is a feed, as ever.
  const feeds = parseOpml(wrap(
    `<outline type="page" text="Kettle piece" xmlUrl="https://quietkitchen.example/essays/kettle-switch/"/>` +
    `<outline type="pages" text="Kept pages" xmlUrl="kept-pages.txt"/>` +
    `<outline text="Plain" xmlUrl="https://quietkitchen.example/essays/kettle-switch/"/>`,
  ));
  assert.strictEqual(feeds[0].type, 'page');
  assert.strictEqual(feeds[0].title, 'Kettle piece');
  assert.strictEqual(feeds[0].prominence, 'secondary', 'a page is a subscribed source, not the site\'s own corpus');
  assert.strictEqual(feeds[1].type, 'pages');
  assert.strictEqual(feeds[1].xmlUrl, 'kept-pages.txt');
  assert.strictEqual(feeds[2].type, 'rss');
});
