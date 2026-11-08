// The reading order (src/lib/readingOrder.js): which of the feed's flows is
// in force, what the device keeps for the reader's choice, when Next and
// Previous follow it, and the choice remembered and put back by Reset the
// view, with Next, Previous and the book's start changing with it. Apart from
// the order, what the reader says of a card the graph is hiding because the
// visitor turned its source's pill off: the card keeps its place in the order.

const test = require('node:test');
const assert = require('node:assert');
const { PREF, feedFlows, chosenFlow, prefFor, chosenOrder, nextFollowsFlow, flowNav, hiddenInGraph, hiddenInGraphLine } = require('../src/lib/readingOrder');
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

test('the line the reader draws: the source\'s pill is off, or only that the card is hidden in the graph', () => {
  // The wording is provisional (the owner names things); it lives in one place.
  assert.strictEqual(hiddenInGraphLine({ id: 'feed-1', title: 'Feed One' }), 'hidden in the graph: Feed One\'s pill is off');
  assert.strictEqual(hiddenInGraphLine({ id: 'feed-1', title: '' }), 'hidden in the graph');
  assert.strictEqual(hiddenInGraphLine(null), '', 'a card that is not hidden has no line');
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

  // The reader says b is hidden in the graph; a and c, whose pills are on, say nothing.
  assert.deepStrictEqual(hiddenInGraph(b, hiddenSources), { id: 'feed-2', title: 'Feed Two' });
  assert.strictEqual(hiddenInGraph(a, hiddenSources), null);
  assert.strictEqual(hiddenInGraph(c, hiddenSources), null);
  // Turning the pill back on takes the line away; the order never moved.
  assert.strictEqual(hiddenInGraph(b, []), null);
  assert.strictEqual(step(sourced, 'a', 'next', nav).id, 'b');
});
