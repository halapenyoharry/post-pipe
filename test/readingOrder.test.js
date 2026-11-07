// The reading order (src/lib/readingOrder.js): which of the feed's flows is
// in force, what the device keeps for the reader's choice, when Next and
// Previous follow it, and the choice remembered and put back by Reset the
// view, with Next, Previous and the book's start changing with it.

const test = require('node:test');
const assert = require('node:assert');
const { PREF, feedFlows, chosenFlow, prefFor, chosenOrder, nextFollowsFlow, flowNav } = require('../src/lib/readingOrder');
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
