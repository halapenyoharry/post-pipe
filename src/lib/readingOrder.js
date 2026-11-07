// readingOrder.js — the order a reader reads a site's cards in when the site
// lists Flow presets (settings.flow.presets, provisional). The build wrote
// one order per preset into feed.json (flows, provisional: [{ name,
// description, mode, order: [item ids] }]; src/lib/flowBuild.js). With more
// than one, the reader chooses among them in the main view's panel (the
// preference readingOrder, provisional; null means the site's first), the
// device remembers the choice, and Reset the view returns to the site's
// first. The order in force then decides two things:
//
//   - the reader's Next and Previous, the arrow keys and the swipes go to the
//     neighbouring card in it (readerNav.js, with flowNav's options), unless
//     the site sets flow.next false (provisional), which keeps them on
//     sequence edges;
//   - the top bar's book (topBar.resume) opens the reader at its first card
//     for a reader with no place yet, when topBar.resume names no start
//     (topBar.js resumeTarget, given chosenOrder).
//
// A site that lists no preset has no flows, and none of this applies. Nothing
// here moves anything in the graph.

const { topBarConfig, resolvePages } = require('./topBar');

const PREF = 'readingOrder';

// The feed's orders: those with a name and a list of ids.
function feedFlows(feed) {
  const list = feed && Array.isArray(feed.flows) ? feed.flows : [];
  return list.filter((f) => f && typeof f.name === 'string' && f.name && Array.isArray(f.order));
}

// The order in force: the one the reader chose (pref, its name), else the
// site's first; null when the feed has none. A name the feed no longer has
// is the site's first.
function chosenFlow(feed, pref) {
  const list = feedFlows(feed);
  if (!list.length) return null;
  return (typeof pref === 'string' && pref && list.find((f) => f.name === pref)) || list[0];
}

// What the device keeps for a choice: null for the site's first order, else
// its name.
function prefFor(feed, name) {
  const first = feedFlows(feed)[0];
  return !first || first.name === name ? null : name;
}

// The ids of the order in force, for the book's start; null without orders.
function chosenOrder(feed, pref) {
  const flow = chosenFlow(feed, pref);
  return flow ? flow.order : null;
}

// Whether Next and Previous follow the order in force: the feed has orders
// and the site has not set flow.next false.
function nextFollowsFlow(settings, feed) {
  const f = settings && settings.flow && typeof settings.flow === 'object' ? settings.flow : null;
  if (f && f.next === false) return false;
  return feedFlows(feed).length > 0;
}

// The options readerNav's neighbours and step take for the order in force:
// { order, skip }, where skip holds the top bar's own pages (an about page is
// no card of the reading, as it is never where a reader was for the book);
// undefined when Next and Previous stay on sequence edges.
function flowNav(feed, settings, pref) {
  if (!nextFollowsFlow(settings, feed)) return undefined;
  const flow = chosenFlow(feed, pref);
  if (!flow) return undefined;
  const pages = resolvePages(topBarConfig(settings), (feed && feed.items) || []);
  return { order: flow.order, skip: new Set(pages.map((p) => p.item.id)) };
}

module.exports = { PREF, feedFlows, chosenFlow, prefFor, chosenOrder, nextFollowsFlow, flowNav };
