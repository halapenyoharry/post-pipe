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
// in the graph, with flows or without: the reader says so.

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

// Whether the graph is hiding a card: the visitor has turned its source's pill
// off in the top bar (hiddenSources, as viewState keeps them: an array of
// source ids, or a Set). Gives { id, title } of that source ('' when it has no
// title), else null: no item, no source (its _source, or its originalItem's,
// as a graph node carries it) or a source that is showing. The reading order
// does not change for such a card: the book, Next, Previous, the arrow keys
// and the swipes visit it as any other, and the reader says it is hidden in
// the graph. The owner's decision (2026-11-08): "if they are part of the graph
// they should show up in the flow, or this early version. with indication
// they are hidden in graph."
function hiddenInGraph(item, hiddenSources) {
  const source = item && (item._source || (item.originalItem && item.originalItem._source));
  if (!source || source.id === undefined || source.id === null) return null;
  const hidden = hiddenSources instanceof Set
    ? hiddenSources.has(source.id)
    : Array.isArray(hiddenSources) && hiddenSources.includes(source.id);
  if (!hidden) return null;
  return { id: source.id, title: typeof source.title === 'string' ? source.title.trim() : '' };
}

// The line the reader draws for a card hidden in the graph, after its date and
// reading time; nothing for a card that is not. The wording is provisional:
// the owner names things, and this is the one place it changes.
function hiddenInGraphLine(hidden) {
  if (!hidden) return '';
  return hidden.title ? `hidden in the graph: ${hidden.title}'s pill is off` : 'hidden in the graph';
}

module.exports = { PREF, feedFlows, chosenFlow, prefFor, chosenOrder, nextFollowsFlow, flowNav, hiddenInGraph, hiddenInGraphLine };
