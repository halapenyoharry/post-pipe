// Aggregator — runs N adapters, resolves each feed's color, merges items.

const { detectExplicitFeedColor, hashFeedColor } = require('./adapters/detectFeedColor');
const { fetchText }       = require('./adapters/fetchText');
const { readLastGood, writeLastGood, DEFAULT_DIR: LAST_GOOD_DIR } = require('./adapters/lastGoodCopy');
const { ColorCache }      = require('./lib/colorCache');
const { runRtagzPhase }   = require('./lib/rtagz');

// What went wrong, in one line: the error's message and, for a failed
// network fetch, the network's own reason ("fetch failed (ECONNREFUSED)").
function describeError(err) {
  if (!err) return 'unknown error';
  const msg = String(err.message || err).trim() || 'unknown error';
  const cause = err.cause && (err.cause.code || err.cause.message);
  return cause && !msg.includes(String(cause)) ? `${msg} (${cause})` : msg;
}

// One feed through its adapter. A fetched feed (config.xmlUrl) gets one
// fetch, as ever, through a fetch that remembers the text: when the adapter
// parses it, that text becomes the feed's last good copy (lastGoodCopy.js).
// When the fetch fails, or its text does not parse, the feed's cards come
// from that copy instead (no second fetch), marked stale with the copy's
// date and the error; with no copy, the feed has no items and carries the
// error. A local folder that fails carries its error too.
async function loadEntry({ adapter, config }, options) {
  const fetchImpl = typeof options.fetchText === 'function' ? options.fetchText : fetchText;
  const lastGoodDir = options.lastGoodDir || LAST_GOOD_DIR;
  const now = typeof options.now === 'function' ? options.now : () => new Date();
  const url = typeof config.xmlUrl === 'string' && config.xmlUrl ? config.xmlUrl : null;
  const fetched = new Map(); // address -> text this build fetched
  const remembering = async (address, opts) => {
    const text = await fetchImpl(address, opts);
    fetched.set(address, text);
    return text;
  };
  try {
    const result = await adapter.load(config, { fetchText: remembering });
    if (url && fetched.has(url)) writeLastGood(url, fetched.get(url), now().toISOString(), lastGoodDir);
    return { adapter, config, ok: true, ...result };
  } catch (err) {
    const error = describeError(err);
    const copy = url ? readLastGood(url, lastGoodDir) : null;
    if (copy) {
      try {
        const result = await adapter.load(config, { fetchText: async () => copy.body });
        const n = Array.isArray(result.items) ? result.items.length : 0;
        console.warn(`[aggregator] ${adapter.id}:${config.id} failed: ${error}; its ${n} item(s) come from the last good copy, fetched ${copy.fetchedAt || 'at an unknown time'}`);
        // ok: its items are in the corpus (rosetta-tagz reads them as any
        // other feed's); stale says they are the copy's, not this build's.
        return { adapter, config, ok: true, ...result, stale: true, copyDate: copy.fetchedAt, error };
      } catch (copyErr) {
        console.warn(`[aggregator] ${adapter.id}:${config.id}: its last good copy could not be read either (${describeError(copyErr)})`);
      }
    }
    console.warn(`[aggregator] ${adapter.id}:${config.id} failed: ${error}${url ? '; no earlier copy, so it has no items this build' : ''}`);
    return { adapter, config, ok: false, error, items: [], feedMeta: { id: config.id, title: config.title } };
  }
}

/**
 * @param {Array<{ adapter, config }>} entries
 * @param {Object} [options]
 * @param {string} [options.colorCachePath]  defaults to './.feed-cache/colors.json'
 * @param {Object} [options.rtagz]           site rosetta-tagz settings (settings.rtagz)
 * @param {string} [options.siteRoot]        site root path
 * @param {Array}  [options.containment]     site containment entries (settings.containment)
 * @param {string} [options.lastGoodDir]     where fetched feeds' last good copies are kept;
 *                                           defaults to the engine's .feed-cache/last-good
 * @param {Function} [options.fetchText]     the fetch the fetched adapters use (tests stub it)
 * @param {Function} [options.now]           the clock a copy is dated by
 * @returns {Promise<{ items: JsonFeedItem[], sources: Source[], rtagz?: Object }>}
 */
async function loadCorpus(entries, options = {}) {
  const cache = new ColorCache(options.colorCachePath || './.feed-cache/colors.json');

  // Phase 1: fetch items from every adapter concurrently. Adapter failures
  // are caught so one broken feed doesn't take the whole build down, and a
  // fetched feed that fails falls back to its last good copy (loadEntry).
  const results = await Promise.all(entries.map((entry) => loadEntry(entry, options)));

  // Phase 2: resolve colors.
  //
  // Two passes, because the two halves of the cascade have different needs. A
  // feed's own color (OPML override, or the site's theme-color) is independent
  // of every other feed, so those resolve in parallel and cache hits skip the
  // network entirely. A generated color is only meaningful relative to the
  // others — hashing feeds in isolation once produced three greens 7 degrees
  // apart — so those are handed out one at a time, each avoiding the hues
  // already spoken for.
  await Promise.all(results.map(async (r) => {
    const feedId = r.feedMeta.id || r.config.id;
    const cached = cache.get(feedId);
    if (cached) { r.color = cached; return; }
    r.color = await detectExplicitFeedColor(r.feedMeta, r.config.customColor);
  }));

  const taken = results.map((r) => r.color).filter(Boolean);
  for (const r of results) {
    if (r.color) continue;
    r.color = hashFeedColor(r.feedMeta, taken);
    taken.push(r.color);
  }
  for (const r of results) {
    cache.set(r.feedMeta.id || r.config.id, r.color);
  }

  // rosetta-tagz phase: translate tags across systems after colours are
  // resolved and before provenance is stamped.
  const rtagzResult = await runRtagzPhase(results, options);

  // Phase 3: build the sources list (what FeedZ shows) and stamp every
  // item with its source provenance. ok: the feed's items are in the corpus.
  // A feed whose fetch failed also says so: error (what went wrong) and, when
  // its cards come from its last good copy, stale and copyDate (when that
  // copy was fetched). A feed that loaded as it should carries neither, so
  // its entry is exactly what it always was.
  const sources = results.map(({ adapter, config, feedMeta, color, items, ok, stale, copyDate, error }) => {
    const source = {
      id: feedMeta.id || config.id,
      title: feedMeta.title || config.title,
      type: adapter.id,
      color,
      home_page_url: feedMeta.home_page_url || config.htmlUrl || null,
      folder: config.folder || '',
      prominence: config.prominence || 'secondary',
      itemCount: items.length,
      ok,
    };
    if (stale) {
      source.stale = true;
      source.copyDate = copyDate || null;
    }
    if (error) source.error = error;
    return source;
  });

  const stamped = results.flatMap(({ adapter, config, items, feedMeta, color }) => {
    const source = {
      id: feedMeta.id || config.id,
      title: feedMeta.title || config.title,
      type: adapter.id,
      color,
      prominence: config.prominence || 'secondary',
    };
    return items.map(item => ({ ...item, _source: source }));
  });

  stamped.sort((a, b) => {
    const da = new Date(a.date_published || 0);
    const db = new Date(b.date_published || 0);
    return db - da;
  });

  const out = { items: stamped, sources };
  if (rtagzResult && rtagzResult.ran && rtagzResult.rtagz) {
    out.rtagz = rtagzResult.rtagz;
  }
  return out;
}

module.exports = { loadCorpus, describeError };
