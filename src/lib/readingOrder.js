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
//
// Apart from the order, hiddenInGraph names the source a card is hidden with
// in the graph, with flows or without, and readerSourcePill gives the pill the
// reader shows for the open card's source, on every site.

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

// The source stamp a card carries: its own _source, else its feed item's (a
// graph node carries the item as originalItem).
function sourceOf(item) {
  return (item && (item._source || (item.originalItem && item.originalItem._source))) || null;
}

// Whether the graph is hiding a card: the visitor has turned its source's pill
// off in the top bar (hiddenSources, as viewState keeps them: an array of
// source ids, or a Set). Gives { id, title } of that source ('' when it has no
// title), else null: no item, no source (its _source, or its originalItem's,
// as a graph node carries it) or a source that is showing. The reading order
// does not change for such a card: the book, Next, Previous, the arrow keys
// and the swipes visit it as any other, and the reader shows the source's own
// pill in its off look. The owner's decisions: "if they are part of the graph
// they should show up in the flow, or this early version. with indication
// they are hidden in graph." (2026-11-08); "you show the source show that it
// is off in the graph with the same pill" (2026-11-09).
function hiddenInGraph(item, hiddenSources) {
  const source = sourceOf(item);
  if (!source || source.id === undefined || source.id === null) return null;
  const hidden = hiddenSources instanceof Set
    ? hiddenSources.has(source.id)
    : Array.isArray(hiddenSources) && hiddenSources.includes(source.id);
  if (!hidden) return null;
  return { id: source.id, title: typeof source.title === 'string' ? source.title.trim() : '' };
}

// What a screen reader hears before the pill while the card is hidden in the
// graph. No visible words. The owner, 2026-11-10: '"hidden in graph" is fine.'
const HIDDEN_IN_GRAPH = 'hidden in the graph';

// The source pill the reader draws under the byline and date: the top bar's
// own pill for the open card's source (FeedPill), in the look the source has
// there: on while it shows in the graph, off while the visitor has hidden it.
// It shows for every card that carries a source stamp, whichever look the
// source has, and stays through a tap on it, which only changes its look. The
// pill names where the piece came from; the byline is left to the piece's
// author (src/lib/byline.js). The owner, 2026-11-10: "so the pill that is
// shown in the graph view should be the source in the reader view and it
// should show up just like it does in the graph view the by line should be
// reserved for the author of the piece if provided."
//
// Just like the graph view: a site whose top bar shows no source pills
// (topBar.showSourcePills false, as epicofelinorjones.com sets) shows none in
// the reader either; settings is the site's, and without it the top bar's
// default (pills shown) holds.
//
// Gives { source, hidden }: source the feed's own entry for it (from sources,
// the feed's _sources, which the top bar draws), else the card's stamp;
// hidden whether the graph hides it. Null for no card, a card with no source
// stamp or a stamp with no id, or a site whose top bar shows no source pills.
function readerSourcePill(item, hiddenSources, sources, settings) {
  if (!topBarConfig(settings).showSourcePills) return null;
  const stamp = sourceOf(item);
  if (!stamp || stamp.id === undefined || stamp.id === null) return null;
  const hidden = hiddenInGraph(item, hiddenSources) !== null;
  const entry = Array.isArray(sources) ? sources.find((s) => s && s.id === stamp.id) : null;
  return { source: entry || stamp, hidden };
}

module.exports = { PREF, feedFlows, chosenFlow, prefFor, chosenOrder, nextFollowsFlow, flowNav, hiddenInGraph, HIDDEN_IN_GRAPH, readerSourcePill };
