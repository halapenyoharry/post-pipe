// When each source's items were taken in (2026-11-05), recorded on its entry
// in feed.json's _sources: fetchedAt for a fetched feed or page (this
// build's fetch), feedUpdated for a feed that gives a date for itself (RSS
// lastBuildDate, else the channel's pubDate; Atom's feed-level updated; JSON
// Feed has none), and readAt for a source the build reads without a fetch of
// its own (a local folder, a list of pages). The fetch is stubbed: nothing
// here touches the network.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { loadCorpus } = require('../src/aggregator');
const RssAdapter = require('../src/adapters/RssAdapter');
const AtomAdapter = require('../src/adapters/AtomAdapter');
const JsonFeedAdapter = require('../src/adapters/JsonFeedAdapter');
const PageAdapter = require('../src/adapters/PageAdapter');
const PageListAdapter = require('../src/adapters/PageListAdapter');

const answer = (text) => ({ fetchText: async () => text });
const channel = (inner) => `<?xml version="1.0"?><rss version="2.0"><channel><title>C</title>${inner}<item><title>i</title><guid>g</guid></item></channel></rss>`;

test('RSS: the channel\'s lastBuildDate, before its pubDate', async () => {
  const { feedMeta } = await RssAdapter.load({ xmlUrl: 'https://feeds.example/r.xml' }, answer(channel(
    '<pubDate>Tue, 03 Nov 2026 07:00:00 GMT</pubDate><lastBuildDate>Thu, 05 Nov 2026 09:30:00 -0500</lastBuildDate>')));
  assert.strictEqual(feedMeta.feedUpdated, '2026-11-05T14:30:00.000Z');
});

test('RSS: the channel\'s pubDate when there is no lastBuildDate (or none that reads)', async () => {
  let { feedMeta } = await RssAdapter.load({ xmlUrl: 'https://feeds.example/r.xml' }, answer(channel('<pubDate>Tue, 03 Nov 2026 07:00:00 GMT</pubDate>')));
  assert.strictEqual(feedMeta.feedUpdated, '2026-11-03T07:00:00.000Z');
  ({ feedMeta } = await RssAdapter.load({ xmlUrl: 'https://feeds.example/r.xml' }, answer(channel('<lastBuildDate>soon</lastBuildDate><pubDate>Tue, 03 Nov 2026 07:00:00 GMT</pubDate>'))));
  assert.strictEqual(feedMeta.feedUpdated, '2026-11-03T07:00:00.000Z');
});

test('RSS: null when the channel gives no date of its own; an item\'s date is not the feed\'s', async () => {
  const { feedMeta } = await RssAdapter.load({ xmlUrl: 'https://feeds.example/r.xml' }, answer(
    '<rss version="2.0"><channel><title>C</title><item><title>i</title><pubDate>Tue, 03 Nov 2026 07:00:00 GMT</pubDate></item></channel></rss>'));
  assert.strictEqual(feedMeta.feedUpdated, null);
});

test('RSS 1.0: the channel\'s dc:date', async () => {
  const rdf = `<?xml version="1.0"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://purl.org/rss/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel><title>R</title><dc:date>2026-11-04T06:00:00Z</dc:date></channel><item><title>i</title><link>https://feeds.example/i</link></item></rdf:RDF>`;
  const { feedMeta } = await RssAdapter.load({ xmlUrl: 'https://feeds.example/r.rdf' }, answer(rdf));
  assert.strictEqual(feedMeta.feedUpdated, '2026-11-04T06:00:00.000Z');
});

test('Atom: the feed-level updated, not an entry\'s', async () => {
  const atom = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><title>A</title><id>urn:a</id>
<updated>2026-11-05T08:15:00Z</updated>
<entry><title>e</title><id>urn:e</id><updated>2026-11-01T00:00:00Z</updated></entry></feed>`;
  const { feedMeta } = await AtomAdapter.load({ xmlUrl: 'https://feeds.example/a.atom' }, answer(atom));
  assert.strictEqual(feedMeta.feedUpdated, '2026-11-05T08:15:00.000Z');
  const none = await AtomAdapter.load({ xmlUrl: 'https://feeds.example/a.atom' }, answer('<feed xmlns="http://www.w3.org/2005/Atom"><title>A</title></feed>'));
  assert.strictEqual(none.feedMeta.feedUpdated, null);
});

test('JSON Feed: no date for the feed itself, so null', async () => {
  const json = JSON.stringify({ version: 'https://jsonfeed.org/version/1.1', title: 'J', items: [{ id: 'j1', title: 'jay', date_published: '2026-11-01T00:00:00Z' }] });
  const { feedMeta } = await JsonFeedAdapter.load({ xmlUrl: 'https://feeds.example/j.json' }, answer(json));
  assert.strictEqual(feedMeta.feedUpdated, null);
});

function scratch() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-feedtimes-'));
  return {
    root,
    opts: (extra) => ({ lastGoodDir: path.join(root, 'last-good'), colorCachePath: path.join(root, 'colors.json'), ...extra }),
    done: () => fs.rmSync(root, { recursive: true, force: true }),
  };
}

test('on the source in feed.json: a fetched feed\'s fetchedAt and feedUpdated; a local folder\'s readAt', async () => {
  const s = scratch();
  try {
    const URL_R = 'https://feeds.example/r.xml';
    const local = { id: 'local', load: async (config) => ({ items: [{ id: 'p1', title: 'piece', url: 'https://site.example/p1.html' }], feedMeta: { id: config.id, title: config.title } }) };
    const entries = [
      { adapter: RssAdapter, config: { id: URL_R, title: 'R', xmlUrl: URL_R, customColor: '#336699' } },
      { adapter: local, config: { id: 'local://pieces', title: 'Pieces', customColor: '#777777' } },
    ];
    const out = await loadCorpus(entries, s.opts({
      fetchText: async () => channel('<lastBuildDate>Thu, 05 Nov 2026 09:30:00 GMT</lastBuildDate>'),
      now: () => new Date('2026-11-05T10:00:00Z'),
    }));
    const [feed, folder] = out.sources;
    assert.deepStrictEqual({ fetchedAt: feed.fetchedAt, feedUpdated: feed.feedUpdated, readAt: feed.readAt },
      { fetchedAt: '2026-11-05T10:00:00.000Z', feedUpdated: '2026-11-05T09:30:00.000Z', readAt: undefined });
    assert.deepStrictEqual({ readAt: folder.readAt, fetchedAt: folder.fetchedAt, feedUpdated: folder.feedUpdated },
      { readAt: '2026-11-05T10:00:00.000Z', fetchedAt: undefined, feedUpdated: undefined }, 'a folder is read, not fetched');
  } finally { s.done(); }
});

test('a page is fetched (fetchedAt, no date of a feed); a list of pages is read (readAt)', async () => {
  const s = scratch();
  try {
    const html = fs.readFileSync(path.join(__dirname, 'fixtures', 'page', 'article.html'), 'utf8');
    const list = path.join(s.root, 'pages.txt');
    fs.writeFileSync(list, 'https://pages.example/one\n');
    const PAGE = 'https://pages.example/two';
    const out = await loadCorpus([
      { adapter: PageAdapter, config: { id: PAGE, title: 'One page', xmlUrl: PAGE, customColor: '#123456' } },
      { adapter: PageListAdapter, config: { id: list, title: 'Some pages', path: list, customColor: '#654321' } },
    ], s.opts({ fetchText: async () => html, now: () => new Date('2026-11-05T10:00:00Z') }));
    const [page, pages] = out.sources;
    assert.strictEqual(page.type, 'page');
    assert.strictEqual(page.fetchedAt, '2026-11-05T10:00:00.000Z');
    assert.strictEqual(page.feedUpdated, null);
    assert.strictEqual(pages.type, 'pages');
    assert.strictEqual(pages.readAt, '2026-11-05T10:00:00.000Z');
    assert.ok(!('fetchedAt' in pages));
  } finally { s.done(); }
});

test('a local folder that fails has no time to show', async () => {
  const s = scratch();
  try {
    const broken = { id: 'local', load: async () => { throw new Error('no such folder: /nowhere'); } };
    const out = await loadCorpus([{ adapter: broken, config: { id: 'local:///nowhere', title: 'Nowhere', customColor: '#777777' } }], s.opts());
    assert.strictEqual(out.sources[0].ok, false);
    assert.strictEqual(out.sources[0].readAt, null);
  } finally { s.done(); }
});
