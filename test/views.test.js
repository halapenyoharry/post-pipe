// The site's views (settings.views): the registry's entries a site offers,
// the one in force, and how the address picks one. The registry itself
// (src/views/index.js) holds components, so these run on a stand-in with
// the same shape.

const { test } = require('node:test');
const assert = require('node:assert');
const { DEFAULT_VIEWS, viewById, viewLayout, siteViews, viewFromSearch, currentView } = require('../src/lib/views');
const { createViewState, memoryBackend } = require('../src/lib/viewState');

const Graph = () => null;
const Trees = () => null;
const REGISTRY = [
  { id: 'cluster', label: 'cluster', component: Graph, props: { layout: 'force' } },
  { id: 'ring', label: 'ring', component: Graph, props: { layout: 'radial' } },
  { id: 'json-trees', label: 'trees', component: Trees, props: {} },
];

test('registry lookup: an entry by its id, null for an unknown or empty one', () => {
  assert.strictEqual(viewById(REGISTRY, 'ring'), REGISTRY[1]);
  assert.strictEqual(viewById(REGISTRY, ' ring '), REGISTRY[1]);
  assert.strictEqual(viewById(REGISTRY, 'spiral'), null);
  assert.strictEqual(viewById(REGISTRY, ''), null);
  assert.strictEqual(viewById(REGISTRY, null), null);
  assert.strictEqual(viewById(null, 'ring'), null);
});

test('an entry names the layout it draws with, or none', () => {
  assert.strictEqual(viewLayout(REGISTRY[0]), 'force');
  assert.strictEqual(viewLayout(REGISTRY[1]), 'radial');
  assert.strictEqual(viewLayout(REGISTRY[2]), '');
  assert.strictEqual(viewLayout(null), '');
});

test('settings: the listed views in the site\'s order; absent or empty is the default, cluster alone', () => {
  assert.deepStrictEqual(DEFAULT_VIEWS, ['cluster']);
  assert.deepStrictEqual(siteViews({}, REGISTRY).map((v) => v.id), ['cluster']);
  assert.deepStrictEqual(siteViews(null, REGISTRY).map((v) => v.id), ['cluster']);
  assert.deepStrictEqual(siteViews({ views: [] }, REGISTRY).map((v) => v.id), ['cluster']);
  assert.deepStrictEqual(siteViews({ views: 'ring' }, REGISTRY).map((v) => v.id), ['cluster']);
  assert.deepStrictEqual(siteViews({ views: ['ring', 'cluster'] }, REGISTRY).map((v) => v.id), ['ring', 'cluster']);
  assert.deepStrictEqual(siteViews({ views: ['cluster', 'ring', 'json-trees'] }, REGISTRY).map((v) => v.id), ['cluster', 'ring', 'json-trees']);
});

test('settings: an unknown id is skipped with one logged line; each id once; nothing known falls back to the default', () => {
  const lines = [];
  const log = (l) => lines.push(l);
  assert.deepStrictEqual(siteViews({ views: ['cluster', 'spiral', 'ring', 'cluster', 'orbit', 7, null] }, REGISTRY, log).map((v) => v.id), ['cluster', 'ring']);
  assert.strictEqual(lines.length, 1);
  assert.match(lines[0], /unknown views skipped: spiral, orbit/);
  const more = [];
  assert.deepStrictEqual(siteViews({ views: ['spiral'] }, REGISTRY, (l) => more.push(l)).map((v) => v.id), ['cluster']);
  assert.deepStrictEqual(more, ['[post-pipe] settings.views: unknown view skipped: spiral']);
  const quiet = [];
  siteViews({ views: ['cluster', 'ring'] }, REGISTRY, (l) => quiet.push(l));
  assert.deepStrictEqual(quiet, []);
});

test('the ?view= parameter picks a listed view; an unlisted or absent one picks nothing', () => {
  const listed = siteViews({ views: ['cluster', 'ring'] }, REGISTRY);
  assert.strictEqual(viewFromSearch('?view=ring', listed), REGISTRY[1]);
  assert.strictEqual(viewFromSearch('?a=1&view=cluster&b=2', listed), REGISTRY[0]);
  assert.strictEqual(viewFromSearch('view=ring', listed), REGISTRY[1]);
  assert.strictEqual(viewFromSearch('?view=json-trees', listed), null, 'in the registry but not listed by the site');
  assert.strictEqual(viewFromSearch('?view=spiral', listed), null);
  assert.strictEqual(viewFromSearch('?view=', listed), null);
  assert.strictEqual(viewFromSearch('?review=ring', listed), null);
  assert.strictEqual(viewFromSearch('', listed), null);
  assert.strictEqual(viewFromSearch(undefined, listed), null);
  assert.strictEqual(viewFromSearch('?view=%ZZ', listed), null, 'a bad escape picks nothing');
});

test('the view in force: the chosen one, else the first listed; the layout picker moves it to the view drawn with that layout', () => {
  const listed = siteViews({ views: ['ring', 'cluster'] }, REGISTRY);
  assert.strictEqual(currentView(listed, { view: null, layout: 'force' }), REGISTRY[1], 'no choice yet: the first listed, whatever the layout');
  assert.strictEqual(currentView(listed, {}), REGISTRY[1]);
  assert.strictEqual(currentView(listed, { view: 'cluster', layout: 'force' }), REGISTRY[0]);
  assert.strictEqual(currentView(listed, { view: 'cluster', layout: 'radial' }), REGISTRY[1], 'the picker set ring\'s layout');
  assert.strictEqual(currentView(listed, { view: 'ring', layout: 'force' }), REGISTRY[0]);
  assert.strictEqual(currentView(listed, { view: 'json-trees', layout: 'radial' }), REGISTRY[1], 'a choice the site no longer lists');
  const one = siteViews({ views: ['cluster'] }, REGISTRY);
  assert.strictEqual(currentView(one, { view: 'cluster', layout: 'radial' }), REGISTRY[0], 'one view: it stays, the layout is the reader\'s');
  const trees = siteViews({ views: ['cluster', 'json-trees'] }, REGISTRY);
  assert.strictEqual(currentView(trees, { view: 'json-trees', layout: 'radial' }), REGISTRY[2], 'a view with no layout is not moved by the picker');
  assert.strictEqual(currentView([], { view: 'cluster' }), null);
});

test('viewState remembers the view: setView keeps the id and its layout in one step, survives a reload, is one undo; silent is not undoable; Reset clears it', async () => {
  const backend = memoryBackend();
  const a = createViewState({ backend, debounceMs: 0, corpusId: 'c' });
  await a.ready();
  assert.strictEqual(a.state.view, null);
  a.setView('ring', 'radial');
  assert.deepStrictEqual([a.state.view, a.state.layout], ['ring', 'radial']);
  await a.flush();
  const b = createViewState({ backend, debounceMs: 0, corpusId: 'c' });
  await b.ready();
  assert.deepStrictEqual([b.state.view, b.state.layout], ['ring', 'radial'], 'remembered on the device');
  assert.strictEqual(b.canUndo, false);
  b.setView('cluster', 'force');
  assert.deepStrictEqual([b.state.view, b.state.layout], ['cluster', 'force']);
  assert.strictEqual(b.undo(), true);
  assert.deepStrictEqual([b.state.view, b.state.layout], ['ring', 'radial'], 'one undo takes back both');
  b.setView('json-trees');
  assert.deepStrictEqual([b.state.view, b.state.layout], ['json-trees', 'radial'], 'a view with no layout leaves the layout');
  b.setView('cluster', 'force', { silent: true });
  assert.deepStrictEqual([b.state.view, b.state.layout], ['cluster', 'force']);
  assert.strictEqual(b.undo(), true);
  assert.deepStrictEqual([b.state.view, b.state.layout], ['ring', 'radial'], 'the silent step was not in history; the undo took back the step before it');
  b.resetLayout();
  assert.deepStrictEqual([b.state.view, b.state.layout], [null, 'force'], 'Reset: the site\'s first view again');
  b.setView('', 'radial');
  assert.strictEqual(b.state.view, null, 'an empty id is no choice');
});

test('a reader\'s older saved state, without a view, loads with none chosen', async () => {
  const backend = memoryBackend();
  const a = createViewState({ backend, debounceMs: 0, corpusId: 'c' });
  await a.ready();
  a.setLayout('radial');
  await a.flush();
  const saved = await backend.load();
  delete saved.view;
  await backend.save(saved);
  const b = createViewState({ backend, debounceMs: 0, corpusId: 'c' });
  await b.ready();
  assert.strictEqual(b.state.view, null);
  assert.strictEqual(b.state.layout, 'radial');
  const listed = siteViews({ views: ['cluster', 'ring'] }, REGISTRY);
  assert.strictEqual(currentView(listed, b.state), REGISTRY[0], 'no choice: the first listed; the page then puts its layout in force');
});
