// The page's top bar (settings.topBar), beside the source pills and the
// settings gear: buttons that open an item of the site in the reader
// (pages), each found by its id or its slug (the last part of its url,
// without .html), and optionally taken out of the graph (hideFromGraph: the
// button is then the way to it).
//
// addFeed (default true) shows the "+" after them, for adding a feed; a site
// whose readers have no use for it sets it false.
//
// A page can carry an icon (an SVG body on a 24-unit box) and showLabel
// (default true: the label is shown as text beside it). links: buttons after
// the pages that go to an address (same tab, or a new one with newTab), each
// an icon with its label as its name, the label also shown when showLabel is
// true (default false).
//
//   "topBar": { "pages": [ { "id": "<item id or slug>", "label": "About", "hideFromGraph": true, "icon": "<path .../>" } ],
//               "links": [ { "id": "support", "label": "Support", "href": "https://...", "icon": "<path .../>", "newTab": true } ],
//               "addFeed": false }

const { siteIcon } = require('./icons');

const str = (v) => (typeof v === 'string' ? v.trim() : '');

// An address a link can go to: http(s), mailto, or a path on the site. Not
// javascript: or data:.
function safeHref(v) {
  const h = str(v);
  if (!h) return '';
  if (/^(https?:|mailto:)/i.test(h)) return h;
  if (/^[a-z][a-z0-9+.-]*:/i.test(h)) return '';
  return h;
}

// settings.topBar with its defaults.
function topBarConfig(settings) {
  const t = (settings && settings.topBar && typeof settings.topBar === 'object') ? settings.topBar : {};
  const pages = (Array.isArray(t.pages) ? t.pages : [])
    .filter((p) => p && typeof p === 'object' && str(p.id))
    .map((p) => {
      const icon = siteIcon(p.icon);
      return { id: str(p.id), label: str(p.label) || str(p.id), hideFromGraph: p.hideFromGraph === true, icon, showLabel: !icon || p.showLabel !== false };
    });
  const links = (Array.isArray(t.links) ? t.links : [])
    .filter((l) => l && typeof l === 'object' && safeHref(l.href) && (str(l.label) || str(l.id)))
    .map((l, i) => {
      const icon = siteIcon(l.icon);
      const label = str(l.label) || str(l.id);
      return { id: str(l.id) || `link-${i + 1}`, label, href: safeHref(l.href), icon, newTab: l.newTab === true, showLabel: !icon || l.showLabel === true };
    });
  return { pages, links, addFeed: t.addFeed !== false };
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

module.exports = { topBarConfig, findItem, resolvePages, graphFeed, slugOf, safeHref };
