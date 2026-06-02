// Aggregator — runs N adapters, resolves each feed's color, merges items.

const { detectFeedColor } = require('./adapters/detectFeedColor');
const { ColorCache }      = require('./lib/colorCache');

/**
 * @param {Array<{ adapter, config }>} entries
 * @param {Object} [options]
 * @param {string} [options.colorCachePath]  defaults to './.feed-cache/colors.json'
 * @returns {Promise<JsonFeedItem[]>}  merged, sorted-by-date items
 */
async function loadCorpus(entries, options = {}) {
  const cache = new ColorCache(options.colorCachePath || './.feed-cache/colors.json');

  // Phase 1: fetch items from every adapter concurrently.
  const results = await Promise.all(
    entries.map(({ adapter, config }) =>
      adapter.load(config).then(result => ({ adapter, config, ...result }))
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

  // Phase 3: stamp every item with its source provenance.
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

  return stamped;
}

module.exports = { loadCorpus };
