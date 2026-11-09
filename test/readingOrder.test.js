// The reading order (src/lib/readingOrder.js): which of the feed's flows is
// in force, what the device keeps for the reader's choice, when Next and
// Previous follow it, and the choice remembered and put back by Reset the
// view, with Next, Previous and the book's start changing with it. Apart from
// the order, what the reader shows of a card the graph is hiding because the
// visitor turned its source's pill off: the source's own pill, in its off
// look, and the card keeps its place in the order.

const test = require('node:test');
const assert = require('node:assert');
const { PREF, feedFlows, chosenFlow, prefFor, chosenOrder, nextFollowsFlow, flowNav, hiddenInGraph, cardKey, HIDDEN_IN_GRAPH, readerSourcePill } = require('../src/lib/readingOrder');
const { neighbours, step } = require('../src/lib/readerNav');
const { topBarConfig, resumeTarget } = require('../src/lib/topBar');
const { createViewState, memoryBackend } = require('../src/lib/viewState');
const { PREF: TAG_SHOW_PREF, LABELS_PREF: TAG_LABELS_PREF } = require('../src/lib/tagPills');

const feed = {
  items: [
    { id: 'a', url: '/a.html', title: 'A' },
    { id: 'b', url: '/b.html', title: 'B' },
    { id: 'c', url: '/c.html', title: 'C' },
    { id: 'about', url: '/about.html', title: 'About' },
  ],
  edges: [{ source: 'a', target: 'b', layer: 'sequence', role: 'next' }],
  flows: [
    { name: 'by-weight', description: 'Sorted by score.', mode: 'score', order: ['c', 'about', 'a', 'b'] },
    { name: 'by-neighbourhood', description: 'Walked from the newest.', mode: 'walk', order: ['b', 'a', 'c', 'about'] },
  ],
};
const ids = (list) => list.map((i) => i.id);

test('the orders: the feed\'s, the one chosen by name, else the site\'s first', () => {
  assert.strictEqual(PREF, 'readingOrder');
  assert.deepStrictEqual(feedFlows(feed).map((f) => f.name), ['by-weight', 'by-neighbourhood']);
  assert.deepStrictEqual(feedFlows({ flows: [null, { name: '' , order: [] }, { name: 'x' }, { name: 'ok', order: [] }] }).map((f) => f.name), ['ok']);
  assert.deepStrictEqual(feedFlows({ items: [] }), []);
  assert.strictEqual(chosenFlow(feed, null).name, 'by-weight');
  assert.strictEqual(chosenFlow(feed, 'by-neighbourhood').name, 'by-neighbourhood');
  assert.strictEqual(chosenFlow(feed, 'gone-since').name, 'by-weight', 'a name the feed no longer has is the first');
  assert.strictEqual(chosenFlow({ items: [] }, 'by-weight'), null);
  assert.deepStrictEqual(chosenOrder(feed, 'by-neighbourhood'), ['b', 'a', 'c', 'about']);
  assert.strictEqual(chosenOrder({ items: [] }, null), null);
});

test('what the device keeps: null for the site\'s first order, else its name', () => {
  assert.strictEqual(prefFor(feed, 'by-weight'), null);
  assert.strictEqual(prefFor(feed, 'by-neighbourhood'), 'by-neighbourhood');
  assert.strictEqual(prefFor({ items: [] }, 'by-weight'), null);
});

test('Next follows the order unless flow.next is false; a feed without flows never does', () => {
  assert.strictEqual(nextFollowsFlow({}, feed), true);
  assert.strictEqual(nextFollowsFlow({ flow: { presets: ['by-weight'], next: true } }, feed), true);
  assert.strictEqual(nextFollowsFlow({ flow: { next: false } }, feed), false);
  assert.strictEqual(nextFollowsFlow({}, { items: feed.items, edges: feed.edges }), false);
  assert.strictEqual(flowNav({ items: feed.items, edges: feed.edges }, {}, null), undefined);
  // flow.next false: Next and Previous on sequence edges, as without presets.
  const off = flowNav(feed, { flow: { next: false } }, null);
  assert.strictEqual(off, undefined);
  assert.deepStrictEqual(ids(neighbours(feed, 'a', off).next), ['b']);
  assert.deepStrictEqual(neighbours(feed, 'a', off).prev, []);
});

test('flowNav: the order in force, with the top bar\'s own pages to pass over', () => {
  const settings = { topBar: { pages: [{ id: 'about', label: 'About', hideFromGraph: true }] } };
  const nav = flowNav(feed, settings, null);
  assert.deepStrictEqual(nav.order, ['c', 'about', 'a', 'b']);
  assert.deepStrictEqual([...nav.skip], ['about']);
  assert.deepStrictEqual(ids(neighbours(feed, 'c', nav).next), ['a'], 'the about page is passed over');
  assert.deepStrictEqual(ids(neighbours(feed, 'a', nav).prev), ['c']);
  assert.deepStrictEqual([...flowNav(feed, {}, null).skip], []);
});

test('the choice is remembered on this device, moves Next, Previous and the book at once, and Reset the view returns the site\'s first', async () => {
  const backend = memoryBackend();
  // The about page is a top bar page: no card of the reading, nor a start.
  const settings = { topBar: { resume: { label: 'read where you left off' }, pages: [{ id: 'about', label: 'About' }] } };
  const book = topBarConfig(settings);
  const vs = createViewState({ backend, corpusId: 'c', debounceMs: 0 });
  await vs.ready();

  // The site's first order: Next from a is b, nothing before it but c; the
  // book starts at c.
  let nav = flowNav(feed, settings, vs.preference(PREF));
  assert.deepStrictEqual(ids(neighbours(feed, 'a', nav).prev), ['c']);
  assert.strictEqual(step(feed, 'a', 'next', nav).id, 'b');
  assert.strictEqual(resumeTarget(feed.items, vs.state.reading, book, chosenOrder(feed, vs.preference(PREF))).id, 'c');

  // The panel's choice, by-neighbourhood: Next from a is c, before it b; the
  // book starts at b.
  vs.setPreference(PREF, prefFor(feed, 'by-neighbourhood'));
  nav = flowNav(feed, settings, vs.preference(PREF));
  assert.deepStrictEqual(ids(neighbours(feed, 'a', nav).prev), ['b']);
  assert.strictEqual(step(feed, 'a', 'next', nav).id, 'c');
  assert.strictEqual(resumeTarget(feed.items, vs.state.reading, book, chosenOrder(feed, vs.preference(PREF))).id, 'b');
  await vs.flush();

  // Remembered: the page loaded again on this device has it.
  const again = createViewState({ backend, corpusId: 'c', debounceMs: 0 });
  await again.ready();
  assert.strictEqual(chosenFlow(feed, again.preference(PREF)).name, 'by-neighbourhood');

  // Reset the view (the graph's reset-all, which hands this preference to
  // resetLayout with the tagz' own): the site's first order again.
  again.resetLayout({ prefs: [TAG_SHOW_PREF, TAG_LABELS_PREF, PREF] });
  assert.strictEqual(again.preference(PREF), null);
  assert.strictEqual(chosenFlow(feed, again.preference(PREF)).name, 'by-weight');
  // Choosing the first again keeps nothing.
  again.setPreference(PREF, prefFor(feed, 'by-weight'));
  assert.strictEqual(again.preference(PREF), null);
});

test('hiddenInGraph names the source a card is hidden with: ids in an array or in a Set', () => {
  const item = { id: 'a', title: 'A', _source: { id: 'feed-1', title: 'Feed One', type: 'feed', color: '#c0ffee' } };
  const hidden = { id: 'feed-1', title: 'Feed One' };
  // The view state keeps them as an array of source ids.
  assert.deepStrictEqual(hiddenInGraph(item, ['feed-1']), hidden);
  assert.deepStrictEqual(hiddenInGraph(item, ['feed-2', 'feed-1']), hidden);
  // The page hands the graph a Set of them.
  assert.deepStrictEqual(hiddenInGraph(item, new Set(['feed-1'])), hidden);
  assert.deepStrictEqual(hiddenInGraph(item, new Set(['feed-2', 'feed-1'])), hidden);
  // Nothing hidden: no list yet (the view state is not loaded), or none in it.
  assert.strictEqual(hiddenInGraph(item, null), null);
  assert.strictEqual(hiddenInGraph(item, undefined), null);
  assert.strictEqual(hiddenInGraph(item, []), null);
  assert.strictEqual(hiddenInGraph(item, new Set()), null);
});

test('hiddenInGraph is null for a source that is showing, a card with no source, or no card', () => {
  const item = { id: 'a', _source: { id: 'feed-1', title: 'Feed One' } };
  assert.strictEqual(hiddenInGraph(item, ['feed-2']), null, 'another source is off, this one is showing');
  assert.strictEqual(hiddenInGraph(item, new Set(['feed-2'])), null);
  assert.strictEqual(hiddenInGraph({ id: 'a' }, ['feed-1']), null, 'no source stamp');
  assert.strictEqual(hiddenInGraph({ id: 'a', _source: null }, ['feed-1']), null);
  assert.strictEqual(hiddenInGraph({ id: 'a', _source: { title: 'No id' } }, [undefined]), null, 'a source with no id cannot be hidden');
  assert.strictEqual(hiddenInGraph(null, ['feed-1']), null);
  assert.strictEqual(hiddenInGraph(undefined, ['feed-1']), null);
});

test('hiddenInGraph finds the source through originalItem, as a graph node carries the feed item', () => {
  const original = { id: 'a', _source: { id: 'feed-1', title: 'Feed One' } };
  const node = { id: 'a', type: 'article', originalItem: original };
  assert.deepStrictEqual(hiddenInGraph(node, ['feed-1']), { id: 'feed-1', title: 'Feed One' });
  assert.strictEqual(hiddenInGraph(node, ['feed-2']), null);
  // A stamp on the node itself is read first, as the reader's byline reads it.
  const both = { id: 'a', _source: { id: 'feed-2', title: 'Feed Two' }, originalItem: original };
  assert.deepStrictEqual(hiddenInGraph(both, ['feed-2']), { id: 'feed-2', title: 'Feed Two' });
  assert.strictEqual(hiddenInGraph(both, ['feed-1']), null);
});

test('a hidden source with no title is still named, with an empty title', () => {
  assert.deepStrictEqual(hiddenInGraph({ _source: { id: 'feed-1' } }, ['feed-1']), { id: 'feed-1', title: '' });
  assert.deepStrictEqual(hiddenInGraph({ _source: { id: 'feed-1', title: null } }, ['feed-1']), { id: 'feed-1', title: '' });
  assert.deepStrictEqual(hiddenInGraph({ _source: { id: 'feed-1', title: '  ' } }, ['feed-1']), { id: 'feed-1', title: '' }, 'spaces are no title');
});

// The feed's sources as the top bar draws them (feed._sources), and three
// cards: a and c from feed-1, b from feed-2. A card carries a shorter stamp of
// its source (_source), with no count.
const pillSources = [
  { id: 'feed-1', title: 'Feed One', type: 'rss', color: '#c0ffee', itemCount: 2, ok: true },
  { id: 'feed-2', title: 'ProPublica', type: 'rss', color: '#ff8800', itemCount: 20, ok: true },
];
const stampOf = (s) => ({ id: s.id, title: s.title, type: s.type, color: s.color });
const pillItems = [
  { id: 'a', url: '/a.html', title: 'A', _source: stampOf(pillSources[0]) },
  { id: 'b', url: '/b.html', title: 'B', _source: stampOf(pillSources[1]) },
  { id: 'c', url: '/c.html', title: 'C', _source: stampOf(pillSources[0]) },
];

// What the reader does on every render (ReaderPanel): it draws the pill
// readerSourcePill gives, if any, and keeps the card it was drawn for.
function readerOf(vs, sources = pillSources) {
  let kept = null;
  return (item) => {
    const pill = readerSourcePill(item, vs.state.hiddenSources, kept, sources);
    kept = pill ? pill.card : null;
    return pill;
  };
}

test('the reader shows the source pill for a card whose source is hidden, and none for a card whose source is showing', () => {
  const [a, b, c] = pillItems;
  assert.deepStrictEqual(readerSourcePill(b, ['feed-2'], null, pillSources), { source: pillSources[1], hidden: true, card: 'b' });
  assert.deepStrictEqual(readerSourcePill(b, new Set(['feed-2']), null, pillSources), { source: pillSources[1], hidden: true, card: 'b' });
  assert.strictEqual(readerSourcePill(a, ['feed-2'], null, pillSources), null, 'feed-1 is showing');
  assert.strictEqual(readerSourcePill(c, ['feed-2'], null, pillSources), null);
  assert.strictEqual(readerSourcePill(b, [], null, pillSources), null, 'every pill on');
  assert.strictEqual(readerSourcePill(b, null, null, pillSources), null, 'no view state yet');
  assert.strictEqual(readerSourcePill({ id: 'x' }, ['feed-2'], null, pillSources), null, 'a card with no source');
  assert.strictEqual(readerSourcePill(null, ['feed-2'], null, pillSources), null, 'the reader is closed');
  // Only for the open card: a card kept for another card is no reason.
  assert.strictEqual(readerSourcePill(a, [], 'b', pillSources), null);
});

test('the pill is the top bar\'s own: the feed\'s entry for the source (title, count, colour), in the off look while hidden', () => {
  const b = pillItems[1];
  const pill = readerSourcePill(b, ['feed-2'], null, pillSources);
  // The very object the top bar hands its pill (FeedZ, from feed._sources).
  assert.strictEqual(pill.source, pillSources[1]);
  assert.strictEqual(pill.source.title, 'ProPublica');
  assert.strictEqual(pill.source.itemCount, 20);
  assert.strictEqual(pill.source.color, '#ff8800');
  // hidden is what FeedPill draws as its off look (dimmed, the title struck
  // through), as the top bar's pill for a hidden source.
  assert.strictEqual(pill.hidden, true);
  // A feed with no entry in _sources still gets its pill, from the card's stamp.
  const stampOnly = readerSourcePill(b, ['feed-2'], null, []);
  assert.deepStrictEqual(stampOnly.source, stampOf(pillSources[1]));
  assert.strictEqual(readerSourcePill(b, ['feed-2'], null, undefined).source, b._source);
  // A graph node carries the feed item as originalItem; its key is the item's id.
  const node = { id: 'node-b', type: 'article', originalItem: b };
  assert.deepStrictEqual(readerSourcePill(node, ['feed-2'], null, pillSources), { source: pillSources[1], hidden: true, card: 'b' });
  assert.strictEqual(cardKey(node), 'b');
  assert.strictEqual(cardKey({ url: '/u.html' }), '/u.html');
  assert.strictEqual(cardKey({}), null);
  assert.strictEqual(cardKey(null), null);
});

test('a tap on the reader\'s pill toggles the source, as the top bar\'s does, and both show it at once', () => {
  const vs = createViewState({ backend: memoryBackend(), corpusId: 'c', debounceMs: 0 });
  const read = readerOf(vs);
  const b = pillItems[1];
  vs.toggleSource('feed-2');                      // the top bar's pill turns ProPublica off
  const pill = read(b);
  assert.strictEqual(pill.hidden, true);
  // The reader's pill's tap: the top bar's onToggleSource is the same call.
  vs.toggleSource(pill.source.id);
  assert.strictEqual(vs.isHidden('feed-2'), false, 'the top bar\'s pill is on');
  assert.deepStrictEqual(vs.state.hiddenSources, []);
  assert.strictEqual(read(b).hidden, false, 'the reader\'s pill is on');
  // And off again, from either.
  vs.toggleSource(pill.source.id);
  assert.strictEqual(vs.isHidden('feed-2'), true);
  assert.strictEqual(read(b).hidden, true);
});

test('after the tap turns the source back on, the pill stays, in its on look, while the same card is open', () => {
  const vs = createViewState({ backend: memoryBackend(), corpusId: 'c', debounceMs: 0 });
  const read = readerOf(vs);
  const b = pillItems[1];
  vs.toggleSource('feed-2');
  assert.strictEqual(read(b).hidden, true);
  vs.toggleSource('feed-2');
  // Under the reader's finger: still there, on, render after render.
  for (let i = 0; i < 3; i++) assert.deepStrictEqual(read(b), { source: pillSources[1], hidden: false, card: 'b' });
  // The same card again as a graph node keeps it too.
  assert.strictEqual(read({ id: 'node-b', originalItem: b }).hidden, false);
  // The pure answer: kept for this card, the source showing.
  assert.deepStrictEqual(readerSourcePill(b, [], 'b', pillSources), { source: pillSources[1], hidden: false, card: 'b' });
});

test('on the next card whose source is showing the pill is gone, and closing the reader forgets it', () => {
  const vs = createViewState({ backend: memoryBackend(), corpusId: 'c', debounceMs: 0 });
  const read = readerOf(vs);
  const [a, b, c] = pillItems;
  vs.toggleSource('feed-2');
  read(b);
  vs.toggleSource('feed-2');
  assert.strictEqual(read(b).hidden, false, 'kept on b after the tap');
  // Next: c, whose source is showing. No pill, and none back on b.
  assert.strictEqual(read(c), null);
  assert.strictEqual(read(b), null, 'b again, its source showing: no pill');
  // Kept, then the reader closes: opening the same card again shows nothing.
  vs.toggleSource('feed-2');
  read(b);
  vs.toggleSource('feed-2');
  assert.strictEqual(read(b).hidden, false);
  assert.strictEqual(read(null), null, 'the reader closes');
  assert.strictEqual(read(b), null, 'b opened again, its source showing');
  // A hidden source still shows its pill on any card from it.
  vs.toggleSource('feed-1');
  assert.strictEqual(read(a).hidden, true);
  assert.strictEqual(read(c).hidden, true);
  assert.strictEqual(read(b), null);
});

test('what a screen reader hears before the pill while the source is hidden', () => {
  // No visible words; provisional, in one place.
  assert.strictEqual(HIDDEN_IN_GRAPH, 'hidden in the graph');
});

test('a card from a hidden source stays in the reading order: Next, Previous and the book visit it, and the reader marks it', () => {
  const one = { id: 'feed-1', title: 'Feed One' };
  const two = { id: 'feed-2', title: 'Feed Two' };
  const from = (id, source) => ({ id, url: `/${id}.html`, title: id.toUpperCase(), _source: source });
  const sourced = {
    items: [from('a', one), from('b', two), from('c', one)],
    edges: [],
    flows: [
      { name: 'in-order', mode: 'score', order: ['a', 'b', 'c'] },
      { name: 'b-first', mode: 'walk', order: ['b', 'a', 'c'] },
    ],
  };
  const [a, b, c] = sourced.items;
  // The pill of feed-2 is off, so the graph does not draw b.
  const hiddenSources = ['feed-2'];

  // Next and Previous (and with them the arrow keys and the swipes) pass
  // through b as they would with every pill on.
  const nav = flowNav(sourced, {}, null);
  assert.strictEqual(step(sourced, 'a', 'next', nav).id, 'b');
  assert.strictEqual(step(sourced, 'c', 'prev', nav).id, 'b');
  assert.deepStrictEqual(ids(neighbours(sourced, 'b', nav).prev), ['a']);
  assert.deepStrictEqual(ids(neighbours(sourced, 'b', nav).next), ['c']);
  // The book opens a reader with no place yet at the order's first card, b.
  assert.strictEqual(resumeTarget(sourced.items, null, topBarConfig({}), chosenOrder(sourced, 'b-first')).id, 'b');

  // The reader shows b's source pill, off; a and c, whose pills are on, show none.
  assert.deepStrictEqual(hiddenInGraph(b, hiddenSources), { id: 'feed-2', title: 'Feed Two' });
  assert.deepStrictEqual(readerSourcePill(b, hiddenSources, null, []), { source: two, hidden: true, card: 'b' });
  assert.strictEqual(hiddenInGraph(a, hiddenSources), null);
  assert.strictEqual(readerSourcePill(a, hiddenSources, null, []), null);
  assert.strictEqual(hiddenInGraph(c, hiddenSources), null);
  assert.strictEqual(readerSourcePill(c, hiddenSources, null, []), null);
  // Turning the pill back on: b is no longer hidden; the order never moved.
  assert.strictEqual(hiddenInGraph(b, []), null);
  assert.strictEqual(step(sourced, 'a', 'next', nav).id, 'b');
});
