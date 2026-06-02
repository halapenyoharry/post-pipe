// Adapter interface — JSDoc only, no runtime code.
//
// An Adapter loads items from one source (local folder, RSS feed, Atom feed,
// JSON Feed URL, …) and returns them as normalized JSON Feed 1.1 items, plus
// metadata about the source itself.
//
// Adapters are pure functions of their configuration. They don't know about
// the graph, the lenses, or the host application — they just produce items.
// The aggregator combines outputs from multiple adapters into one corpus.
//
// Implementations live alongside this file:
//   - LocalFolderAdapter.js   (the user's content folder, e.g. ~/Posts/)
//   - RssAdapter.js           (future)
//   - AtomAdapter.js          (future)
//   - JsonFeedAdapter.js      (future)

/**
 * @typedef {Object} AdapterConfig
 * Adapter-specific configuration. Shape varies by adapter type.
 *   LocalFolderAdapter: { id, title, path, pagesBase, coversDir }
 *   RssAdapter:         { id, title, xmlUrl }
 *   etc.
 */

/**
 * @typedef {Object} JsonFeedItem
 * A normalized item. Follows JSON Feed 1.1 spec
 * (https://jsonfeed.org/version/1.1) with project-specific extensions
 * prefixed `_`. Currently emitted fields include both standard JSON Feed
 * fields (id, url, title, summary, date_published, tags, …) and the
 * project's existing custom fields (kind, substrate, seed, topology, …).
 * Underscore-prefixing of project fields will land in a later refactor.
 */

/**
 * @typedef {Object} FeedMeta
 * Metadata about the source itself (not its items).
 *   id           — stable identifier (e.g. 'local://~/Posts' or 'https://x.com/feed.xml')
 *   title        — display name
 *   home_page_url — optional; for color detection in a later step
 *   favicon      — optional
 *   icon         — optional
 */

/**
 * @typedef {Object} AdapterResult
 *   items    — JsonFeedItem[]
 *   feedMeta — FeedMeta describing the source
 */

/**
 * @typedef {Object} Adapter
 *   id    — short type identifier ('local', 'rss', 'atom', 'json-feed')
 *   load  — async (config) => AdapterResult
 *
 * Color detection lives in a separate helper (detectFeedColor.js) and runs
 * downstream in the aggregator — not inside the adapter. That keeps adapters
 * focused on item production and lets color caching span all adapter types.
 */

module.exports = {};
