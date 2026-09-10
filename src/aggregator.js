// Aggregator — runs N adapters, resolves each feed's color, merges items.

const { detectExplicitFeedColor, hashFeedColor } = require('./adapters/detectFeedColor');
const { ColorCache }      = require('./lib/colorCache');

/**
 * @param {Array<{ adapter, config }>} entries
 * @param {Object} [options]
 * @param {string} [options.colorCachePath]  defaults to './.feed-cache/colors.json'
 * @returns {Promise<{ items: JsonFeedItem[], sources: Source[] }>}
 */
async function loadCorpus(entries, options = {}) {
  const cache = new ColorCache(options.colorCachePath || './.feed-cache/colors.json');

  // Phase 1: fetch items from every adapter concurrently. Adapter failures
  // are caught so one broken feed doesn't take the whole build down.
  const results = await Promise.all(
    entries.map(({ adapter, config }) =>
      adapter.load(config)
        .then(result => ({ adapter, config, ok: true, ...result }))
        .catch(err => {
          console.warn(`[aggregator] ${adapter.id}:${config.id} failed: ${err.message}`);
          return { adapter, config, ok: false, items: [], feedMeta: { id: config.id, title: config.title } };
        })
    )
  );

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

  // Phase 3: build the sources list (what FeedZ shows) and stamp every
  // item with its source provenance.
  const sources = results.map(({ adapter, config, feedMeta, color, items, ok }) => ({
    id: feedMeta.id || config.id,
    title: feedMeta.title || config.title,
    type: adapter.id,
    color,
    home_page_url: feedMeta.home_page_url || config.htmlUrl || null,
    folder: config.folder || '',
    itemCount: items.length,
    ok,
  }));

  const stamped = results.flatMap(({ adapter, config, items, feedMeta, color }) => {
    const source = {
      id: feedMeta.id || config.id,
      title: feedMeta.title || config.title,
      type: adapter.id,
      color,
    };
    return items.map(item => ({ ...item, _source: source }));
  });

  stamped.sort((a, b) => {
    const da = new Date(a.date_published || 0);
    const db = new Date(b.date_published || 0);
    return db - da;
  });

  return { items: stamped, sources };
}

module.exports = { loadCorpus };
