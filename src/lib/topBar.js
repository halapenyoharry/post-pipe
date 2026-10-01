// The page's top bar (settings.topBar), beside the source pills and the
// settings gear: buttons that open an item of the site in the reader
// (pages), each found by its id or its slug (the last part of its url,
// without .html), and optionally taken out of the graph (hideFromGraph: the
// button is then the way to it).
//
//   "topBar": { "pages": [ { "id": "<item id or slug>", "label": "About", "hideFromGraph": true } ] }

const str = (v) => (typeof v === 'string' ? v.trim() : '');

// settings.topBar with its defaults.
function topBarConfig(settings) {
  const t = (settings && settings.topBar && typeof settings.topBar === 'object') ? settings.topBar : {};
  const pages = (Array.isArray(t.pages) ? t.pages : [])
    .filter((p) => p && typeof p === 'object' && str(p.id))
    .map((p) => ({ id: str(p.id), label: str(p.label) || str(p.id), hideFromGraph: p.hideFromGraph === true }));
  return { pages };
}

// An item's slug: the last part of its url (or id), without .html.
const slugOf = (item) => String((item && (item.url || item.id)) || '').split('/').pop().replace(/\.html$/, '');

// The item a page names: by its id, or else by its slug.
function findItem(items, ref) {
  const list = items || [];
  return list.find((i) => i && i.id === ref) || list.find((i) => i && slugOf(i) === ref) || null;
}

// The pages with the items they open; a page whose item is not in the feed
// is left out.
function resolvePages(config, items) {
  return ((config && config.pages) || [])
    .map((p) => ({ ...p, item: findItem(items, p.id) }))
    .filter((p) => p.item);
}

// The feed the graph draws: without the items of pages kept out of it, nor
// any edge with an end on one of them. The same feed when none is.
function graphFeed(feed, config) {
  if (!feed) return feed;
  const hidden = new Set(resolvePages(config, feed.items).filter((p) => p.hideFromGraph).map((p) => p.item.id));
  if (!hidden.size) return feed;
  const urls = new Set((feed.items || []).filter((i) => hidden.has(i.id)).map((i) => i.url).filter(Boolean));
  const gone = (end) => hidden.has(end) || urls.has(end);
  return {
    ...feed,
    items: (feed.items || []).filter((i) => !hidden.has(i.id)),
    edges: (feed.edges || []).filter((e) => !gone(e.source) && !gone(e.target)),
  };
}

module.exports = { topBarConfig, findItem, resolvePages, graphFeed, slugOf };
