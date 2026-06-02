// Aggregator — runs N adapters, resolves each feed's color, merges items.

const { detectFeedColor } = require('./adapters/detectFeedColor');
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

  // Phase 2: resolve colors (cache hits skip the network).
  await Promise.all(results.map(async (r) => {
    const feedId = r.feedMeta.id || r.config.id;
    let color = cache.get(feedId);
    if (!color) {
      color = await detectFeedColor(r.feedMeta, r.config.customColor);
      cache.set(feedId, color);
    }
    r.color = color;
  }));

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
