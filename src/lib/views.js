// The site's views (settings.views): which entries of the engine's registry
// of views (src/views/index.js) a site offers, which one is current, and
// how the address picks one. A view is one way of drawing the feed
// (vision/VIEWS.md); an entry is { id, label, component, props }. The first
// entries are GraphViewer drawn with the cluster layout and GraphViewer
// drawn with the ring layout, so a view may name a layout in its props and
// the reader's existing layout picker keeps working beside the switch.
//
//   "views": ["cluster", "ring"]
//
// The first listed is the site's default. Unknown ids are skipped, said in
// one logged line. Absent or empty: ["cluster"], so a site that lists
// nothing is as it was, with no switch in its top bar.
//
// This module holds no component (it runs in node, for the tests); the
// registry with the components is src/views/index.js, which passes itself
// in as `registry`.

const DEFAULT_VIEWS = ['cluster'];

const str = (v) => (typeof v === 'string' ? v.trim() : '');

// The entry with this id, or null.
function viewById(registry, id) {
  const list = Array.isArray(registry) ? registry : [];
  const want = str(id);
  if (!want) return null;
  return list.find((v) => v && v.id === want) || null;
}

// The layout an entry draws with, '' when it names none.
function viewLayout(entry) {
  return entry && entry.props && typeof entry.props.layout === 'string' ? entry.props.layout : '';
}

// settings.views as entries of the registry, in the site's order, each id
// once. Unknown ids are left out and named in one line to `log` (default
// console.warn). With nothing left, the default list.
function siteViews(settings, registry, log) {
  const say = typeof log === 'function' ? log : (typeof console !== 'undefined' && console.warn ? console.warn.bind(console) : () => {});
  const raw = settings && Array.isArray(settings.views) ? settings.views : [];
  const ids = [];
  const unknown = [];
  for (const v of raw) {
    const id = str(v);
    if (!id || ids.includes(id) || unknown.includes(id)) continue;
    if (viewById(registry, id)) ids.push(id);
    else unknown.push(id);
  }
  if (unknown.length) say(`[post-pipe] settings.views: unknown view${unknown.length > 1 ? 's' : ''} skipped: ${unknown.join(', ')}`);
  const chosen = ids.length ? ids : DEFAULT_VIEWS;
  return chosen.map((id) => viewById(registry, id)).filter(Boolean);
}

// The view named in the address (?view=<id>) when the site lists it; else
// null. `search` is window.location.search or any string with the query.
function viewFromSearch(search, listed) {
  const s = typeof search === 'string' ? search : '';
  const q = s.startsWith('?') ? s.slice(1) : s;
  let id = '';
  for (const part of q.split('&')) {
    const eq = part.indexOf('=');
    const k = eq < 0 ? part : part.slice(0, eq);
    if (k !== 'view') continue;
    try { id = decodeURIComponent(eq < 0 ? '' : part.slice(eq + 1).replace(/\+/g, ' ')); } catch (_) { id = ''; }
    break;
  }
  return viewById(listed, id);
}

// The view in force, from the reader's state (viewState.state: view, the
// id they chose; layout, the layout the graph draws with). The one they
// chose, unless the layout no longer matches it (the layout picker moved it)
// and another listed view draws with that layout: then that one. With no
// choice yet (or one the site no longer lists), the first listed, whatever
// the layout; the page then puts that view's layout in force. null when the
// site lists none.
function currentView(listed, state) {
  const list = Array.isArray(listed) ? listed.filter(Boolean) : [];
  if (!list.length) return null;
  const s = state && typeof state === 'object' ? state : {};
  const layout = typeof s.layout === 'string' ? s.layout : '';
  const chosen = viewById(list, s.view);
  if (!chosen) return list[0];
  if (!viewLayout(chosen) || !layout || viewLayout(chosen) === layout) return chosen;
  return list.find((v) => viewLayout(v) === layout) || chosen;
}

module.exports = { DEFAULT_VIEWS, viewById, viewLayout, siteViews, viewFromSearch, currentView };
