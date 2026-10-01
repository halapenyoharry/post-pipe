// "Forget my usage on this site": every kind of state the engine keeps is
// written, then forgotten, and nothing under the engine's prefix is left in
// any storage. Keys that are not the engine's stay.

const { test } = require('node:test');
const assert = require('node:assert');
const {
  createViewState, localStorageBackend, forgetStorage, STORAGE_PREFIX,
} = require('../src/lib/viewState');

function fakeStorage() {
  const m = new Map();
  return {
    get length() { return m.size; },
    key(i) { return [...m.keys()][i] ?? null; },
    getItem(k) { return m.has(k) ? m.get(k) : null; },
    setItem(k, v) { m.set(k, String(v)); },
    removeItem(k) { m.delete(k); },
    keys() { return [...m.keys()]; },
  };
}

function fakeIndexedDB(names) {
  const dbs = new Set(names);
  return {
    async databases() { return [...dbs].map((name) => ({ name, version: 1 })); },
    deleteDatabase(name) { dbs.delete(name); return {}; },
    names() { return [...dbs]; },
  };
}

function engineKeysIn(store) {
  return store.keys().filter((k) => k.startsWith(STORAGE_PREFIX));
}

async function fullyUsedStore(local) {
  const vs = createViewState({
    backend: localStorageBackend('post-pipe:viewstate', local),
    corpusId: 'corpus', debounceMs: 0,
  });
  await vs.ready();
  vs.setNodePosition('force::a', 10, 20);
  vs.setNodeSize('a', 300, 200);
  vs.setNodePinned('a', true);
  vs.setNodePinned('b', true);
  vs.setLayout('ring');
  vs.setTimeAxis({ on: true, dimension: 'written' });
  vs.toggleSource('feed-x');
  vs.setSourceColor('feed-y', '#123456');
  vs.setGraphColor('draft', '#654321');
  vs.setParagraphIndent(true);
  vs.setReaderAid('font', 'opendyslexic');
  vs.setReaderAid('size', 'xl');
  vs.setReaderAid('followAlong', true);
  vs.setPreference('theme', 'sketchbook');
  vs.setPreference('mode', 'dark');
  vs.setPreference('timeOfDay', false);
  vs.setPreference('readers', true);
  vs.setReadingPosition('a', 400);
  vs.setReadingProgress('a', 0.6);
  vs.markSeen('b');
  const bm = vs.addBookmark({ item: 'a', para: 3, quote: 'q' });
  vs.setBookmarkNote(bm, 'a note');
  await vs.flush();
  return vs;
}

test('every engine key starts with the prefix', async () => {
  const local = fakeStorage();
  await fullyUsedStore(local);
  assert.ok(local.keys().length > 0);
  assert.deepStrictEqual(engineKeysIn(local), local.keys());
});

test('forget clears every kind of state from local, session and IndexedDB, and only the engine\'s', async () => {
  const local = fakeStorage();
  const session = fakeStorage();
  const vs = await fullyUsedStore(local);
  // Embedded copies of the page keep their own namespaced key, and anything
  // the engine might put in session storage or IndexedDB is under the prefix.
  local.setItem('post-pipe:viewstate:https://example.org/feed.json', '{"version":1}');
  session.setItem('post-pipe:last-place', 'x');
  local.setItem('someone-else', 'keep me');
  session.setItem('someone-else', 'keep me');
  const idb = fakeIndexedDB(['post-pipe:cache', 'other-db']);

  const saved = JSON.parse(local.getItem('post-pipe:viewstate'));
  assert.ok(saved.bookmarks.length && Object.keys(saved.nodes).length && saved.prefs.theme);

  const removed = await vs.forget({ localStorage: local, sessionStorage: session, indexedDB: idb });

  assert.deepStrictEqual(engineKeysIn(local), []);
  assert.deepStrictEqual(engineKeysIn(session), []);
  assert.deepStrictEqual(idb.names(), ['other-db']);
  assert.strictEqual(local.getItem('someone-else'), 'keep me');
  assert.strictEqual(session.getItem('someone-else'), 'keep me');
  assert.ok(removed.includes('post-pipe:last-place'));
  assert.ok(removed.includes('indexedDB:post-pipe:cache'));

  // In memory too: what the page still holds is a first visit.
  assert.deepStrictEqual(vs.bookmarks(), []);
  assert.deepStrictEqual(vs.state.nodes, {});
  assert.deepStrictEqual(vs.state.reading, {});
  assert.deepStrictEqual(vs.state.prefs, {});
  assert.strictEqual(vs.state.layout, 'force');
  assert.strictEqual(vs.canUndo, false);
});

test('nothing is written again after forget, even by a change already on its way', async () => {
  const local = fakeStorage();
  const vs = createViewState({ backend: localStorageBackend('post-pipe:viewstate', local), debounceMs: 20 });
  await vs.ready();
  vs.setNodePinned('a', true); // a save is pending
  await vs.forget({ localStorage: local, sessionStorage: fakeStorage(), indexedDB: null });
  vs.setNodePinned('b', true); // the graph reacting late
  await new Promise((r) => setTimeout(r, 40));
  await vs.flush();
  assert.deepStrictEqual(engineKeysIn(local), []);
});

test('reset keeps notes and progress; forget does not', async () => {
  const local = fakeStorage();
  const vs = await fullyUsedStore(local);
  vs.resetLayout();
  await vs.flush();
  const kept = JSON.parse(local.getItem('post-pipe:viewstate'));
  assert.strictEqual(kept.bookmarks.length, 1);
  assert.ok(kept.reading.a.max > 0);
  assert.deepStrictEqual(kept.nodes, {});
  await vs.forget({ localStorage: local, sessionStorage: fakeStorage() });
  assert.strictEqual(local.getItem('post-pipe:viewstate'), null);
});

test('forgetStorage copes with storage that throws', async () => {
  const broken = { get length() { throw new Error('denied'); } };
  const removed = await forgetStorage({ localStorage: broken, sessionStorage: null, indexedDB: null });
  assert.deepStrictEqual(removed, []);
});
