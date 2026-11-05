// The site's saved copy of a fetched feed (2026-11-05): a file in the site's
// own folder, named on the feed's outline (savedCopy, provisional), holding
// what an engine's last good copy holds ({ url, fetchedAt, body }). A build
// uses it only when its fetch fails, taking the newer of it and the engine's
// last good copy by fetchedAt, and the source says which (copyFrom). An
// ordinary build never writes it; one asked to (saveCopies, from
// generate-index.js --save-copies) writes it from its own good fetch. The
// fetch is stubbed and every copy lives in a temporary folder: nothing here
// touches the network or the engine's own .feed-cache.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { loadCorpus } = require('../src/aggregator');
const { copiesNewestFirst, readSavedCopy, writeLastGood, readLastGood } = require('../src/adapters/lastGoodCopy');
const { parseOpml } = require('../src/lib/opml');
const RssAdapter = require('../src/adapters/RssAdapter');

const URL_A = 'https://feeds.example/a.xml';
const rss = (titles, built) => `<?xml version="1.0"?><rss version="2.0"><channel><title>Feed A</title>
${built ? `<lastBuildDate>${built}</lastBuildDate>` : ''}
${titles.map((t, i) => `<item><title>${t}</title><guid>a-${i}</guid><pubDate>Mon, 0${i + 1} Jun 2026 10:00:00 GMT</pubDate></item>`).join('\n')}
</channel></rss>`;

const failing = () => {
  const calls = [];
  const fn = async (url) => {
    calls.push(url);
    const err = new TypeError('fetch failed');
    err.cause = Object.assign(new Error('connect ECONNREFUSED 127.0.0.1:9'), { code: 'ECONNREFUSED' });
    throw err;
  };
  fn.calls = calls;
  return fn;
};
const answering = (text) => async () => text;

function scratch() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-savedcopy-'));
  const lastGood = path.join(root, 'last-good'); // empty: this machine has no copy yet
  const site = path.join(root, 'site');
  return {
    root,
    lastGood,
    saved: (name) => path.join(site, 'saved', name),
    opts: (extra) => ({ lastGoodDir: lastGood, colorCachePath: path.join(root, 'colors.json'), ...extra }),
    done: () => fs.rmSync(root, { recursive: true, force: true }),
  };
}

function writeSiteCopy(file, copy) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(copy));
}

// customColor keeps the colour phase from looking up a home page.
const entryWith = (savedCopy, xmlUrl = URL_A) => ({ adapter: RssAdapter, config: { id: xmlUrl, title: 'Feed A', xmlUrl, customColor: '#336699', savedCopy } });

const engineAt = (at) => ({ url: URL_A, fetchedAt: at, body: 'engine' });
const siteAt = (at) => ({ url: URL_A, fetchedAt: at, body: 'site' });

test('the newer copy: the engine\'s when it is newer', () => {
  const copies = copiesNewestFirst(engineAt('2026-11-04T10:00:00Z'), siteAt('2026-11-01T10:00:00Z'));
  assert.deepStrictEqual(copies.map((c) => [c.from, c.body]), [['engine', 'engine'], ['site', 'site']]);
});

test('the newer copy: the site\'s when it is newer', () => {
  const copies = copiesNewestFirst(engineAt('2026-11-01T10:00:00Z'), siteAt('2026-11-04T10:00:00Z'));
  assert.deepStrictEqual(copies.map((c) => c.from), ['site', 'engine']);
});

test('the newer copy: only one of them is the one', () => {
  assert.deepStrictEqual(copiesNewestFirst(engineAt('2026-11-01T10:00:00Z'), null).map((c) => c.from), ['engine']);
  assert.deepStrictEqual(copiesNewestFirst(null, siteAt('2026-11-01T10:00:00Z')).map((c) => c.from), ['site']);
});

test('the newer copy: neither, none', () => {
  assert.deepStrictEqual(copiesNewestFirst(null, null), []);
});

test('the newer copy: a dated copy before an undated one; the same date keeps the site\'s first', () => {
  assert.deepStrictEqual(copiesNewestFirst(engineAt(null), siteAt('2026-11-01T10:00:00Z')).map((c) => c.from), ['site', 'engine']);
  assert.deepStrictEqual(copiesNewestFirst(engineAt('2026-11-01T10:00:00Z'), siteAt('not a date')).map((c) => c.from), ['engine', 'site']);
  assert.deepStrictEqual(copiesNewestFirst(engineAt('2026-11-01T10:00:00Z'), siteAt('2026-11-01T10:00:00Z')).map((c) => c.from), ['site', 'engine']);
  assert.deepStrictEqual(copiesNewestFirst(engineAt(null), siteAt(null)).map((c) => c.from), ['site', 'engine']);
});

test('a failed fetch with no copy on this machine: the cards come from the site\'s saved copy, marked stale and saying which copy', async () => {
  const s = scratch();
  try {
    const file = s.saved('a.json');
    writeSiteCopy(file, { url: URL_A, fetchedAt: '2026-11-03T09:00:00.000Z', body: rss(['one', 'two'], 'Tue, 03 Nov 2026 08:00:00 GMT') });
    const fetch = failing();
    const out = await loadCorpus([entryWith(file)], s.opts({ fetchText: fetch }));
    assert.strictEqual(fetch.calls.length, 1, 'one fetch, no retry');
    assert.deepStrictEqual(out.items.map((it) => it.title), ['two', 'one'], 'the saved copy\'s cards');
    const src = out.sources[0];
    assert.strictEqual(src.ok, true, 'its items are in the corpus');
    assert.strictEqual(src.stale, true, 'stale exactly as from the engine\'s copy');
    assert.strictEqual(src.copyDate, '2026-11-03T09:00:00.000Z');
    assert.strictEqual(src.copyFrom, 'site');
    assert.strictEqual(src.fetchedAt, '2026-11-03T09:00:00.000Z', 'when the copy was fetched');
    assert.strictEqual(src.feedUpdated, '2026-11-03T08:00:00.000Z', 'the copy\'s own lastBuildDate');
    assert.strictEqual(src.error, 'fetch failed (ECONNREFUSED)');
    assert.strictEqual(readLastGood(URL_A, s.lastGood), null, 'the failed build wrote no copy on this machine');
  } finally { s.done(); }
});

test('both copies: the newer by fetchedAt is used, whichever it is', async () => {
  const s = scratch();
  try {
    const file = s.saved('a.json');
    writeSiteCopy(file, { url: URL_A, fetchedAt: '2026-11-03T09:00:00.000Z', body: rss(['site one']) });
    writeLastGood(URL_A, rss(['engine one']), '2026-11-04T09:00:00.000Z', s.lastGood);
    let out = await loadCorpus([entryWith(file)], s.opts({ fetchText: failing() }));
    assert.deepStrictEqual([out.sources[0].copyFrom, out.items[0].title, out.sources[0].copyDate], ['engine', 'engine one', '2026-11-04T09:00:00.000Z']);

    writeSiteCopy(file, { url: URL_A, fetchedAt: '2026-11-05T09:00:00.000Z', body: rss(['site two']) });
    out = await loadCorpus([entryWith(file)], s.opts({ fetchText: failing() }));
    assert.deepStrictEqual([out.sources[0].copyFrom, out.items[0].title, out.sources[0].copyDate], ['site', 'site two', '2026-11-05T09:00:00.000Z']);
  } finally { s.done(); }
});

test('the newer copy that cannot be read gives way to the other', async () => {
  const s = scratch();
  try {
    const file = s.saved('a.json');
    writeSiteCopy(file, { url: URL_A, fetchedAt: '2026-11-05T09:00:00.000Z', body: 'not a feed' });
    writeLastGood(URL_A, rss(['engine one']), '2026-11-01T09:00:00.000Z', s.lastGood);
    const out = await loadCorpus([entryWith(file)], s.opts({ fetchText: failing() }));
    assert.strictEqual(out.sources[0].copyFrom, 'engine');
    assert.deepStrictEqual(out.items.map((it) => it.title), ['engine one']);
  } finally { s.done(); }
});

test('the outline names the copy: one fetched from another address is still used for it', async () => {
  const s = scratch();
  try {
    const file = s.saved('a.json');
    writeSiteCopy(file, { url: URL_A, fetchedAt: '2026-11-03T09:00:00.000Z', body: rss(['one']) });
    const elsewhere = 'http://127.0.0.1:9/a.xml';
    const out = await loadCorpus([entryWith(file, elsewhere)], s.opts({ fetchText: failing() }));
    assert.strictEqual(out.sources[0].id, elsewhere);
    assert.strictEqual(out.sources[0].copyFrom, 'site');
    assert.strictEqual(out.items.length, 1);
  } finally { s.done(); }
});

test('a saved copy that is missing or not a copy is no copy: no items, the error carried', async () => {
  const s = scratch();
  try {
    const out = await loadCorpus([entryWith(s.saved('missing.json'))], s.opts({ fetchText: failing() }));
    assert.strictEqual(out.sources[0].ok, false);
    assert.strictEqual(out.items.length, 0);
    assert.strictEqual(out.sources[0].fetchedAt, null);
    const file = s.saved('broken.json');
    writeSiteCopy(file, { url: URL_A, fetchedAt: '2026-11-03T09:00:00.000Z' });
    assert.strictEqual(readSavedCopy(file), null, 'no body, no copy');
    fs.writeFileSync(s.saved('garbled.json'), '{ not json');
    assert.strictEqual(readSavedCopy(s.saved('garbled.json')), null);
    assert.strictEqual(readSavedCopy(null), null);
  } finally { s.done(); }
});

test('an ordinary build never writes the site\'s copy; a build asked to (saveCopies) writes it from its good fetch', async () => {
  const s = scratch();
  try {
    const file = s.saved('a.json');
    await loadCorpus([entryWith(file)], s.opts({ fetchText: answering(rss(['one'])), now: () => new Date('2026-11-05T10:00:00Z') }));
    assert.strictEqual(fs.existsSync(file), false, 'an ordinary build leaves the site\'s folder alone');

    await loadCorpus([entryWith(file)], s.opts({ fetchText: answering(rss(['one', 'two'])), saveCopies: true, now: () => new Date('2026-11-05T11:00:00Z') }));
    assert.deepStrictEqual(JSON.parse(fs.readFileSync(file, 'utf8')), { url: URL_A, fetchedAt: '2026-11-05T11:00:00.000Z', body: rss(['one', 'two']) },
      'the same JSON as a last good copy');
    assert.strictEqual(readLastGood(URL_A, s.lastGood).fetchedAt, '2026-11-05T11:00:00.000Z', 'and the engine keeps its own as ever');

    const before = fs.readFileSync(file, 'utf8');
    const out = await loadCorpus([entryWith(file)], s.opts({ fetchText: failing(), saveCopies: true }));
    assert.strictEqual(fs.readFileSync(file, 'utf8'), before, 'a failed fetch leaves the saved copy as it was');
    assert.strictEqual(out.sources[0].stale, true);
  } finally { s.done(); }
});

test('feeds.opml: savedCopy on an outline names the file, relative to the site', () => {
  const opml = (body) => `<?xml version="1.0"?><opml version="2.0"><head><title>t</title></head><body>${body}</body></opml>`;
  const [a, b] = parseOpml(opml(`
    <outline text="A" type="rss" xmlUrl="https://feeds.example/a.xml" savedCopy=" saved/a.json "/>
    <outline text="B" type="rss" xmlUrl="https://feeds.example/b.xml"/>`));
  assert.strictEqual(a.savedCopy, 'saved/a.json');
  assert.strictEqual(b.savedCopy, null);
});
