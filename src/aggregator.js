// Aggregator — runs N adapters, resolves each feed's color, merges items.

const { detectExplicitFeedColor, hashFeedColor } = require('./adapters/detectFeedColor');
const { fetchText }       = require('./adapters/fetchText');
const { readLastGood, writeLastGood, readSavedCopy, writeSavedCopy, copiesNewestFirst, DEFAULT_DIR: LAST_GOOD_DIR } = require('./adapters/lastGoodCopy');
const { ColorCache }      = require('./lib/colorCache');
const { runRtagzPhase }   = require('./lib/rtagz');
const { parseCardScale, parseItemCap, parseDefaultHidden } = require('./lib/opml');

function resolveFeedDisplay(config = {}, feedMeta = {}, feedsMap = null) {
  const map = feedsMap && typeof feedsMap === 'object' ? feedsMap : (config.settings && config.settings.feeds) || {};
  const keys = [
    feedMeta.id,
    config.id,
    config.xmlUrl,
    feedMeta.title,
    config.title,
  ].filter((k) => typeof k === 'string' && k);
  let override = null;
  for (const k of keys) {
    if (map[k] && typeof map[k] === 'object') { override = map[k]; break; }
  }
  const rawScale = override && override.cardScale !== undefined ? override.cardScale : config.cardScale;
  const rawCap = override && (override.itemCap !== undefined || override.maxItems !== undefined)
    ? (override.itemCap !== undefined ? override.itemCap : override.maxItems)
    : (config.itemCap !== undefined ? config.itemCap : config.maxItems);
  const rawHidden = override && (override.defaultHidden !== undefined || override.hidden !== undefined)
    ? (override.defaultHidden !== undefined ? override.defaultHidden : override.hidden)
    : (config.defaultHidden !== undefined ? config.defaultHidden : config.hidden);

  return {
    cardScale: parseCardScale(rawScale),
    itemCap: parseItemCap(rawCap),
    defaultHidden: parseDefaultHidden(rawHidden),
  };
}

// What went wrong, in one line: the error's message and, for a failed
// network fetch, the network's own reason ("fetch failed (ECONNREFUSED)").
function describeError(err) {
  if (!err) return 'unknown error';
  const msg = String(err.message || err).trim() || 'unknown error';
  const cause = err.cause && (err.cause.code || err.cause.message);
  return cause && !msg.includes(String(cause)) ? `${msg} (${cause})` : msg;
}

// How each copy is named in the build's log.
const COPY_NAMES = { engine: "this machine's last good copy", site: "the site's saved copy" };

// One feed through its adapter. A fetched feed (config.xmlUrl) gets one
// fetch, as ever, through a fetch that remembers the text: when the adapter
// parses it, that text becomes the feed's last good copy (lastGoodCopy.js),
// and, only when the build is asked to (options.saveCopies, from
// generate-index.js --save-copies), the site's saved copy too, where its
// outline names one (config.savedCopy). When the fetch fails, or its text
// does not parse, the feed's cards come from the newer of the two copies by
// fetchedAt (no second fetch; the other copy is tried when the newer cannot
// be read), marked stale with the copy's date, which copy it was and the
// error; with neither, the feed has no items and carries the error. A local
// folder that fails carries its error too.
//
// When its cards were taken in: a fetched feed carries fetchedAt (this
// build's fetch, or the copy's fetchedAt when its cards came from a copy);
// a source the build reads without fetching an address of its own (a local
// folder, a list of pages) carries readAt, the time this build read it.
async function loadEntry({ adapter, config }, options) {
  const fetchImpl = typeof options.fetchText === 'function' ? options.fetchText : fetchText;
  const lastGoodDir = options.lastGoodDir || LAST_GOOD_DIR;
  const now = typeof options.now === 'function' ? options.now : () => new Date();
  const url = typeof config.xmlUrl === 'string' && config.xmlUrl ? config.xmlUrl : null;
  const savedCopy = typeof config.savedCopy === 'string' && config.savedCopy ? config.savedCopy : null;
  const fetched = new Map(); // address -> text this build fetched
  const remembering = async (address, opts) => {
    const text = await fetchImpl(address, opts);
    fetched.set(address, text);
    return text;
  };
  try {
    const result = await adapter.load(config, { fetchText: remembering });
    const at = now().toISOString();
    if (!url) return { adapter, config, ok: true, ...result, readAt: at };
    const text = fetched.has(url) ? fetched.get(url) : null;
    if (text !== null) {
      writeLastGood(url, text, at, lastGoodDir);
      if (options.saveCopies && savedCopy && writeSavedCopy(savedCopy, url, text, at)) {
        console.log(`[aggregator] ${adapter.id}:${config.id}: saved copy written to ${savedCopy}`);
      }
    }
    return { adapter, config, ok: true, ...result, fetchedAt: text !== null ? at : null };
  } catch (err) {
    const error = describeError(err);
    if (options.saveCopies && savedCopy) {
      console.warn(`[aggregator] ${adapter.id}:${config.id}: saved copy ${savedCopy} left as it was (the fetch failed)`);
    }
    const siteCopy = url ? readSavedCopy(savedCopy) : null;
    if (url && savedCopy && !siteCopy) {
      console.warn(`[aggregator] ${adapter.id}:${config.id}: its saved copy ${savedCopy} is missing or is not a copy`);
    }
    const copies = url ? copiesNewestFirst(readLastGood(url, lastGoodDir), siteCopy) : [];
    for (const copy of copies) {
      try {
        const result = await adapter.load(config, { fetchText: async () => copy.body });
        const n = Array.isArray(result.items) ? result.items.length : 0;
        const where = copy.from === 'site' ? ` (${savedCopy})` : '';
        console.warn(`[aggregator] ${adapter.id}:${config.id} failed: ${error}; its ${n} item(s) come from ${COPY_NAMES[copy.from]}${where}, fetched ${copy.fetchedAt || 'at an unknown time'}`);
        if (copy.from === 'site' && copy.url && copy.url !== url) {
          console.warn(`[aggregator] ${adapter.id}:${config.id}: that saved copy was fetched from ${copy.url}, not this outline's address; used because the outline names it`);
        }
        // ok: its items are in the corpus (rosetta-tagz reads them as any
        // other feed's); stale says they are the copy's, not this build's.
        return {
          adapter, config, ok: true, ...result,
          stale: true, copyDate: copy.fetchedAt, copyFrom: copy.from, fetchedAt: copy.fetchedAt, error,
        };
      } catch (copyErr) {
        console.warn(`[aggregator] ${adapter.id}:${config.id}: ${COPY_NAMES[copy.from]} could not be read either (${describeError(copyErr)})`);
      }
    }
    const none = copies.length === 0
      ? 'no last good copy on this machine and no saved copy in the site'
      : (copies.length === 1 ? 'its one copy could not be read' : 'neither copy could be read');
    console.warn(`[aggregator] ${adapter.id}:${config.id} failed: ${error}${url ? `; ${none}, so it has no items this build` : ''}`);
    return {
      adapter, config, ok: false, error, items: [], feedMeta: { id: config.id, title: config.title },
      ...(url ? { fetchedAt: null } : { readAt: null }),
    };
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
 * @param {boolean} [options.saveCopies]     true writes each fetched feed's saved copy in the
 *                                           site (its outline's savedCopy) from this build's
 *                                           good fetch (generate-index.js --save-copies); an
 *                                           ordinary build never writes them
 * @param {Function} [options.fetchText]     the fetch the fetched adapters use (tests stub it)
 * @param {Function} [options.now]           the clock a copy is dated by
 * @returns {Promise<{ items: JsonFeedItem[], sources: Source[], rtagz?: Object }>}
 */
async function loadCorpus(entries, options = {}) {
  const cache = new ColorCache(options.colorCachePath || './.feed-cache/colors.json');

  // Phase 1: fetch items from every adapter concurrently. Adapter failures
  // are caught so one broken feed doesn't take the whole build down, and a
  // fetched feed that fails falls back to the newer of its last good copy
  // and the site's saved copy (loadEntry).
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

  // Apply per-feed display parameters (cardScale, itemCap, defaultHidden)
  // from the OPML outline or settings.feeds before rosetta-tagz and stamping.
  for (const r of results) {
    const display = resolveFeedDisplay(r.config, r.feedMeta, options.feeds);
    r.display = display;
    if (display.itemCap !== null && Array.isArray(r.items) && r.items.length > display.itemCap) {
      const sorted = r.items.slice().sort((a, b) => {
        const da = new Date((a && a.date_published) || 0);
        const db = new Date((b && b.date_published) || 0);
        return db - da;
      });
      r.items = sorted.slice(0, display.itemCap);
    }
  }

  // rosetta-tagz phase: translate tags across systems after colours are
  // resolved and before provenance is stamped.
  const rtagzResult = await runRtagzPhase(results, options);

  // Phase 3: build the sources list (what FeedZ shows) and stamp every
  // item with its source provenance. ok: the feed's items are in the corpus.
  // When its items were taken in: a fetched feed carries fetchedAt (this
  // build's fetch, or the copy's when its cards came from one; null when it
  // failed with no copy) and feedUpdated (the feed's own date for itself:
  // RSS lastBuildDate, else pubDate; Atom updated; null when it gives none,
  // as JSON Feed never does); a source read without a fetch of its own (a
  // local folder, a list of pages) carries readAt. A feed whose fetch failed
  // also says so: error (what went wrong) and, when its cards come from a
  // copy, stale, copyDate (when that copy was fetched) and copyFrom ('site'
  // for the site's saved copy, 'engine' for this machine's last good copy).
  const sources = results.map(({ adapter, config, feedMeta, color, items, ok, stale, copyDate, copyFrom, fetchedAt, readAt, error, display }) => {
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
    if (typeof config.xmlUrl === 'string' && config.xmlUrl) {
      source.fetchedAt = fetchedAt || null;
      source.feedUpdated = (feedMeta && feedMeta.feedUpdated) || null;
    } else {
      source.readAt = readAt || null;
    }
    if (display && display.cardScale !== null) source.cardScale = display.cardScale;
    if (display && display.itemCap !== null) source.itemCap = display.itemCap;
    if (display && display.defaultHidden) source.defaultHidden = true;
    if (stale) {
      source.stale = true;
      source.copyDate = copyDate || null;
      source.copyFrom = copyFrom || null;
    }
    if (error) source.error = error;
    return source;
  });

  const stamped = results.flatMap(({ adapter, config, items, feedMeta, color, display }) => {
    const source = {
      id: feedMeta.id || config.id,
      title: feedMeta.title || config.title,
      type: adapter.id,
      color,
      prominence: config.prominence || 'secondary',
    };
    if (display && display.cardScale !== null) source.cardScale = display.cardScale;
    if (display && display.defaultHidden) source.defaultHidden = true;
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

module.exports = { loadCorpus, describeError, resolveFeedDisplay };
