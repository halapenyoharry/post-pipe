// A fetched feed that fails: the build makes one fetch, as ever; when it
// fails, the feed's cards come from its last good copy (the text of its last
// fetch that parsed, kept in the engine's .feed-cache/last-good/), and its
// source in feed.json says so (stale, copyDate, error). With no copy it has
// no items and carries the error. A feed that loads leaves its source entry
// exactly as it was. The fetch is stubbed: nothing here touches the network.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { loadCorpus, describeError } = require('../src/aggregator');
const { readLastGood, writeLastGood, copyFile, DEFAULT_DIR } = require('../src/adapters/lastGoodCopy');
const RssAdapter = require('../src/adapters/RssAdapter');
const JsonFeedAdapter = require('../src/adapters/JsonFeedAdapter');

const URL_A = 'https://feeds.example/a.xml';
const rss = (titles) => `<?xml version="1.0"?><rss version="2.0"><channel><title>Feed A</title>
${titles.map((t, i) => `<item><title>${t}</title><guid>a-${i}</guid><category>quiet</category><pubDate>Mon, 0${i + 1} Jun 2026 10:00:00 GMT</pubDate></item>`).join('\n')}
</channel></rss>`;

// A fetch that answers from a table, counting its calls; a value that is an
// Error is thrown, as a failed fetch throws.
function stubFetch(table) {
  const calls = [];
  const fn = async (url) => {
    calls.push(url);
    const v = typeof table === 'function' ? table(url, calls.length) : table[url];
    if (v instanceof Error) throw v;
    if (typeof v !== 'string') throw new Error(`no stub for ${url}`);
    return v;
  };
  fn.calls = calls;
  return fn;
}

const refused = () => {
  const err = new TypeError('fetch failed');
  err.cause = Object.assign(new Error('connect ECONNREFUSED 127.0.0.1:9'), { code: 'ECONNREFUSED' });
  return err;
};

function scratch() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-lastgood-'));
  return {
    root,
    opts: (extra) => ({
      lastGoodDir: path.join(root, 'last-good'),
      colorCachePath: path.join(root, 'colors.json'),
      ...extra,
    }),
    done: () => fs.rmSync(root, { recursive: true, force: true }),
  };
}

// customColor keeps the colour phase from looking up a home page.
const entryA = { adapter: RssAdapter, config: { id: URL_A, title: 'Feed A', xmlUrl: URL_A, customColor: '#336699' } };

test('the copies live in the engine\'s own .feed-cache, never beside a site', () => {
  const engine = path.resolve(__dirname, '..');
  assert.strictEqual(DEFAULT_DIR, path.join(engine, '.feed-cache', 'last-good'));
  assert.ok(copyFile(URL_A).startsWith(DEFAULT_DIR + path.sep));
  assert.notStrictEqual(copyFile(URL_A), copyFile('https://feeds.example/b.xml'), 'one file per address');
});

test('a fetch that parses keeps its text as the feed\'s last good copy; its source entry is as it always was', async () => {
  const s = scratch();
  try {
    const fetch = stubFetch({ [URL_A]: rss(['one', 'two']) });
    const out = await loadCorpus([entryA], s.opts({ fetchText: fetch, now: () => new Date('2026-10-29T08:00:00Z') }));
    assert.strictEqual(fetch.calls.length, 1, 'one fetch');
    assert.strictEqual(out.items.length, 2);
    assert.deepStrictEqual(Object.keys(out.sources[0]),
      ['id', 'title', 'type', 'color', 'home_page_url', 'folder', 'prominence', 'itemCount', 'ok'],
      'no new fields on a feed that loaded, so its feed.json stays byte for byte as it was');
    assert.strictEqual(out.sources[0].ok, true);
    const copy = readLastGood(URL_A, path.join(s.root, 'last-good'));
    assert.strictEqual(copy.fetchedAt, '2026-10-29T08:00:00.000Z');
    assert.strictEqual(copy.body, rss(['one', 'two']));
  } finally { s.done(); }
});

test('a failed fetch: one attempt, then the cards from the last good copy, marked stale with its date and the error', async () => {
  const s = scratch();
  try {
    await loadCorpus([entryA], s.opts({ fetchText: stubFetch({ [URL_A]: rss(['one', 'two']) }), now: () => new Date('2026-10-29T08:00:00Z') }));
    const fetch = stubFetch({ [URL_A]: refused() });
    const out = await loadCorpus([entryA], s.opts({ fetchText: fetch, now: () => new Date('2026-10-31T08:00:00Z') }));
    assert.strictEqual(fetch.calls.length, 1, 'exactly one fetch, no retry');
    assert.deepStrictEqual(out.items.map((it) => it.title), ['two', 'one'], 'the copy\'s cards, newest first');
    assert.strictEqual(out.items[0]._source.id, URL_A);
    const src = out.sources[0];
    assert.strictEqual(src.ok, true, 'its items are in the corpus');
    assert.strictEqual(src.stale, true);
    assert.strictEqual(src.copyDate, '2026-10-29T08:00:00.000Z', 'the date of the copy used');
    assert.strictEqual(src.error, 'fetch failed (ECONNREFUSED)');
    assert.strictEqual(src.itemCount, 2);
    // The failed build did not touch the copy.
    assert.strictEqual(readLastGood(URL_A, path.join(s.root, 'last-good')).fetchedAt, '2026-10-29T08:00:00.000Z');
  } finally { s.done(); }
});

test('a fetch whose text does not parse is a failure too: the copy is used and the bad text is not kept', async () => {
  const s = scratch();
  try {
    await loadCorpus([entryA], s.opts({ fetchText: stubFetch({ [URL_A]: rss(['one']) }), now: () => new Date('2026-10-29T08:00:00Z') }));
    const out = await loadCorpus([entryA], s.opts({ fetchText: stubFetch({ [URL_A]: '<html><body>Gateway timeout</body></html>' }) }));
    assert.deepStrictEqual(out.items.map((it) => it.title), ['one']);
    assert.strictEqual(out.sources[0].stale, true);
    assert.match(out.sources[0].error, /no channel found/);
    assert.strictEqual(readLastGood(URL_A, path.join(s.root, 'last-good')).body, rss(['one']), 'the copy is still the good one');
  } finally { s.done(); }
});

test('a failed fetch with no earlier copy: no items, struck through as before, and the error carried', async () => {
  const s = scratch();
  try {
    const fetch = stubFetch({ [URL_A]: new Error('HTTP 503 Service Unavailable') });
    const out = await loadCorpus([entryA], s.opts({ fetchText: fetch }));
    assert.strictEqual(fetch.calls.length, 1);
    assert.strictEqual(out.items.length, 0);
    const src = out.sources[0];
    assert.strictEqual(src.ok, false);
    assert.strictEqual(src.itemCount, 0);
    assert.strictEqual(src.error, 'HTTP 503 Service Unavailable');
    assert.ok(!('stale' in src) && !('copyDate' in src));
    assert.strictEqual(readLastGood(URL_A, path.join(s.root, 'last-good')), null, 'nothing kept');
  } finally { s.done(); }
});

test('a copy that cannot be read is no copy: the feed has no items and carries the fetch\'s error', async () => {
  const s = scratch();
  try {
    const dir = path.join(s.root, 'last-good');
    writeLastGood(URL_A, 'not a feed at all', '2026-10-01T00:00:00.000Z', dir);
    const out = await loadCorpus([entryA], s.opts({ fetchText: stubFetch({ [URL_A]: refused() }) }));
    assert.strictEqual(out.items.length, 0);
    assert.strictEqual(out.sources[0].ok, false);
    assert.strictEqual(out.sources[0].error, 'fetch failed (ECONNREFUSED)');
  } finally { s.done(); }
});

test('the next good fetch replaces the copy and the feed is fresh again', async () => {
  const s = scratch();
  try {
    const dir = path.join(s.root, 'last-good');
    await loadCorpus([entryA], s.opts({ fetchText: stubFetch({ [URL_A]: rss(['one']) }), now: () => new Date('2026-10-29T08:00:00Z') }));
    await loadCorpus([entryA], s.opts({ fetchText: stubFetch({ [URL_A]: refused() }) }));
    const out = await loadCorpus([entryA], s.opts({ fetchText: stubFetch({ [URL_A]: rss(['one', 'two', 'three']) }), now: () => new Date('2026-10-31T09:00:00Z') }));
    assert.strictEqual(out.items.length, 3);
    assert.ok(!('stale' in out.sources[0]) && !('error' in out.sources[0]));
    assert.strictEqual(readLastGood(URL_A, dir).fetchedAt, '2026-10-31T09:00:00.000Z');
  } finally { s.done(); }
});

test('each feed falls back on its own; a JSON Feed keeps its copy the same way', async () => {
  const s = scratch();
  try {
    const URL_J = 'https://feeds.example/j.json';
    const entryJ = { adapter: JsonFeedAdapter, config: { id: URL_J, title: 'Feed J', xmlUrl: URL_J, customColor: '#993366' } };
    const json = JSON.stringify({ version: 'https://jsonfeed.org/version/1.1', title: 'J', items: [{ id: 'j1', title: 'jay', date_published: '2026-06-01T00:00:00Z' }] });
    await loadCorpus([entryA, entryJ], s.opts({ fetchText: stubFetch({ [URL_A]: rss(['one']), [URL_J]: json }), now: () => new Date('2026-10-29T08:00:00Z') }));
    const out = await loadCorpus([entryA, entryJ], s.opts({ fetchText: stubFetch({ [URL_A]: rss(['one', 'two']), [URL_J]: refused() }) }));
    const [a, j] = out.sources;
    assert.ok(!('stale' in a), 'the feed that loaded is fresh');
    assert.strictEqual(a.itemCount, 2);
    assert.strictEqual(j.stale, true);
    assert.strictEqual(j.itemCount, 1);
    assert.deepStrictEqual(out.items.map((it) => it.title).sort(), ['jay', 'one', 'two']);
  } finally { s.done(); }
});

test('a local folder that fails is not a fetch: no copy is looked for, and it carries its error', async () => {
  const s = scratch();
  try {
    const local = { id: 'local', load: async () => { throw new Error('no such folder: /nowhere'); } };
    const fetch = stubFetch({});
    const out = await loadCorpus([{ adapter: local, config: { id: 'local:///nowhere', title: 'Nowhere', customColor: '#777777' } }], s.opts({ fetchText: fetch }));
    assert.strictEqual(fetch.calls.length, 0);
    assert.deepStrictEqual(
      { ok: out.sources[0].ok, error: out.sources[0].error, stale: out.sources[0].stale },
      { ok: false, error: 'no such folder: /nowhere', stale: undefined },
    );
  } finally { s.done(); }
});

test('an error in one line: the message, and a network failure\'s own reason', () => {
  assert.strictEqual(describeError(refused()), 'fetch failed (ECONNREFUSED)');
  assert.strictEqual(describeError(new Error('HTTP 404 Not Found')), 'HTTP 404 Not Found');
  const dup = new Error('getaddrinfo ENOTFOUND feeds.example');
  dup.cause = { code: 'ENOTFOUND' };
  assert.strictEqual(describeError(dup), 'getaddrinfo ENOTFOUND feeds.example', 'a reason already said is not said twice');
  assert.strictEqual(describeError(null), 'unknown error');
});
