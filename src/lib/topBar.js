// The page's top bar (settings.topBar), beside the source pills and the
// settings gear: buttons that open an item of the site in the reader
// (pages), each found by its id or its slug (the last part of its url,
// without .html), and optionally taken out of the graph (hideFromGraph: the
// button is then the way to it).
//
// addFeed (default true) shows the "+" after them, for adding a feed; a site
// whose readers have no use for it sets it false. showSourcePills (default
// true) shows a pill per source; a site with one source, whose pill says
// nothing a reader needs, sets it false.
//
// A page can carry an icon (an SVG body on a 24-unit box) and showLabel
// (default true: the label is shown as text beside it). links: buttons after
// the pages that go to an address (same tab, or a new one with newTab), each
// an icon with its label as its name, the label also shown when showLabel is
// true (default false).
//
//   "topBar": { "pages": [ { "id": "<item id or slug>", "label": "About", "hideFromGraph": true, "icon": "<path .../>" } ],
//               "links": [ { "id": "support", "label": "Support", "href": "https://...", "icon": "<path .../>", "newTab": true } ],
//               "subscribe": { "action": "/api/subscribe", "label": "Notify me", "icon": "<path .../>" },
//               "addFeed": false, "showSourcePills": false }

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
  return { pages, links, subscribe: subscribeConfig(t.subscribe), addFeed: t.addFeed !== false, showSourcePills: t.showSourcePills !== false };
}

// topBar.subscribe: an email sign-up, off unless action is set. An icon
// button after the links opens a small sheet with one email field; submit
// posts JSON { [field]: value } to action (method POST by default), and the
// sheet shows thanks, or the reply's error, or error. newTab: the form is
// sent the plain way instead (form-encoded, into a new tab), for a service
// with its own page.
const SUBSCRIBE_DEFAULTS = {
  method: 'POST',
  field: 'email',
  label: 'Subscribe',
  placeholder: 'Email address',
  thanks: 'Thank you.',
  error: 'Something went wrong. Please try again.',
};

function subscribeConfig(v) {
  if (!v || typeof v !== 'object') return null;
  const action = safeHref(v.action);
  if (!action || /^mailto:/i.test(action)) return null;
  const method = str(v.method).toUpperCase();
  return {
    action,
    method: /^(POST|PUT|PATCH)$/.test(method) ? method : SUBSCRIBE_DEFAULTS.method,
    field: str(v.field) || SUBSCRIBE_DEFAULTS.field,
    label: str(v.label) || SUBSCRIBE_DEFAULTS.label,
    icon: siteIcon(v.icon),
    placeholder: str(v.placeholder) || SUBSCRIBE_DEFAULTS.placeholder,
    thanks: str(v.thanks) || SUBSCRIBE_DEFAULTS.thanks,
    error: str(v.error) || SUBSCRIBE_DEFAULTS.error,
    newTab: v.newTab === true,
  };
}

// What the sheet says after a reply: thanks on 2xx; else the reply's own
// error (a JSON { error } with text in it), else the site's error.
function subscribeResult(config, status, body) {
  if (status >= 200 && status < 300) return { ok: true, message: config.thanks };
  const own = body && typeof body === 'object' && typeof body.error === 'string' ? body.error.trim() : '';
  return { ok: false, message: own || config.error };
}

// Sends one address. Only ever called on a reader's submit, and only to the
// address the site set. fetchImpl is the page's fetch (a fake in tests).
async function subscribe(config, value, fetchImpl) {
  const f = fetchImpl || (typeof fetch !== 'undefined' ? fetch : null);
  if (!config || !f) return { ok: false, message: (config && config.error) || SUBSCRIBE_DEFAULTS.error };
  let res;
  try {
    res = await f(config.action, {
      method: config.method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ [config.field]: String(value || '').trim() }),
    });
  } catch (e) {
    return { ok: false, message: config.error };
  }
  let body = null;
  try { body = await res.json(); } catch (e) { body = null; }
  return subscribeResult(config, res.status, body);
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

module.exports = { topBarConfig, findItem, resolvePages, graphFeed, slugOf, safeHref, subscribeConfig, subscribeResult, subscribe };
