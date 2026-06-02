// Aggregator — runs N adapters and merges their items into one corpus.
//
// Adapters run concurrently. Each item is stamped with a `_source` extension
// recording which feed it came from (id, title, type). A `color` slot is
// reserved on `_source` so a later PR can attach per-feed colors without
// changing the adapter interface or the item shape further.
//
// Currently called with a single LocalFolderAdapter entry. As soon as OPML
// reading lands (plan step 4), this is what consumes the parsed entries.

/**
 * @param {Array<{ adapter, config }>} entries
 * @returns {Promise<JsonFeedItem[]>}  merged, sorted-by-date items
 */
async function loadCorpus(entries) {
  const results = await Promise.all(
    entries.map(({ adapter, config }) =>
      adapter.load(config).then(result => ({ adapter, config, ...result }))
    )
  );

  const stamped = results.flatMap(({ adapter, config, items, feedMeta }) => {
    const source = {
      id: feedMeta.id || config.id,
      title: feedMeta.title || config.title,
      type: adapter.id,
      color: null,           // populated in a later PR
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
