// The persistence seam. If this is wrong, the reader's arrangement is a
// sandcastle and undo/redo is theatre.

const { test } = require('node:test');
const assert = require('node:assert');
const {
  createViewState, memoryBackend, localStorageBackend, hostParamsBackend,
} = require('../src/lib/viewState');

const mk = (o = {}) => createViewState({ debounceMs: 0, ...o });

test('an arrangement survives a reload', async () => {
  const backend = memoryBackend();
  const a = mk({ backend, corpusId: 'c' });
  await a.ready();
  a.setNodePosition('https://x/1.html', 10, 20);
  await a.flush();

  const b = mk({ backend, corpusId: 'c' });
  await b.ready();
  assert.deepStrictEqual(
    { x: b.nodeState('https://x/1.html').x, y: b.nodeState('https://x/1.html').y },
    { x: 10, y: 20 },
  );
});

test('state is keyed by item id, so a rebuild that reorders changes nothing', async () => {
  // The actual regression this exists to prevent: a feed adds sixty items
  // overnight and every index shifts.
  const backend = memoryBackend();
  const a = mk({ backend, corpusId: 'c' });
  await a.ready();
  a.setNodePosition('https://x/mine.html', 5, 5);
  await a.flush();

  const b = mk({ backend, corpusId: 'c' });
  await b.ready();
  b.prune(['https://x/new-1.html', 'https://x/mine.html', 'https://x/new-2.html']);
  assert.strictEqual(b.nodeState('https://x/mine.html').x, 5);
});

test("another corpus's arrangement is not applied to this one", async () => {
  const backend = memoryBackend();
  const a = mk({ backend, corpusId: 'corpus-a' });
  await a.ready();
  a.setNodePosition('n', 9, 9);
  await a.flush();

  const b = mk({ backend, corpusId: 'corpus-b' });
  await b.ready();
  assert.strictEqual(b.nodeState('n'), null);
});

test('undo and redo walk the arrangement', async () => {
  const s = mk(); await s.ready();
  assert.strictEqual(s.canUndo, false);
  s.setLayout('radial');
  s.setLayout('timeline');
  assert.strictEqual(s.state.layout, 'timeline');
  s.undo();
  assert.strictEqual(s.state.layout, 'radial');
  s.undo();
  assert.strictEqual(s.state.layout, 'force');
  assert.strictEqual(s.canUndo, false);
  s.redo();
  assert.strictEqual(s.state.layout, 'radial');
});

test('a drag is one undo, not one per frame', async () => {
  const s = mk(); await s.ready();
  s.setLayout('radial');           // something to come back to
  for (let x = 0; x < 30; x++) s.setNodePosition('n', x, 0, { transient: true });
  s.commit();
  assert.strictEqual(s.nodeState('n').x, 29);
  s.undo();
  assert.strictEqual(s.nodeState('n'), null, 'the whole drag came back, not one pixel');
  assert.strictEqual(s.state.layout, 'radial', 'and nothing before it was disturbed');
});

test('a new action clears the redo branch', async () => {
  const s = mk(); await s.ready();
  s.setLayout('radial');
  s.undo();
  assert.strictEqual(s.canRedo, true);
  s.setLayout('timeline');
  assert.strictEqual(s.canRedo, false);
});

test('history is bounded', async () => {
  const s = mk({ maxHistory: 5 }); await s.ready();
  for (let i = 0; i < 50; i++) s.setNodePosition('n', i, 0);
  let depth = 0;
  while (s.undo()) depth++;
  assert.strictEqual(depth, 5);
});

test('scrolling is not an undoable act', async () => {
  const s = mk(); await s.ready();
  s.setLayout('radial');
  s.setReadingPosition('n', 120);
  s.setReadingPosition('n', 340);
  assert.strictEqual(s.readingPosition('n'), 340);
  s.undo();
  assert.strictEqual(s.state.layout, 'force', 'undo skipped the scrolls and took back the layout');
});

test('seen is recorded once and not overwritten', async () => {
  let t = 1000;
  const s = mk({ now: () => t }); await s.ready();
  s.markSeen('n');
  const first = s.state.reading.n.seenAt;
  t = 9999;
  s.markSeen('n');
  assert.strictEqual(s.state.reading.n.seenAt, first);
  assert.strictEqual(s.isSeen('n'), true);
  assert.strictEqual(s.isSeen('other'), false);
});

test('hidden feeds round-trip and toggle', async () => {
  const s = mk(); await s.ready();
  s.toggleSource('sciencedaily');
  assert.strictEqual(s.isHidden('sciencedaily'), true);
  s.toggleSource('sciencedaily');
  assert.strictEqual(s.isHidden('sciencedaily'), false);
});

test('prune keeps everything present and caps what is gone', async () => {
  let t = 0;
  const s = mk({ now: () => ++t }); await s.ready();
  for (let i = 0; i < 20; i++) s.setNodePosition(`gone-${i}`, i, i);
  s.setNodePosition('here', 1, 1);

  s.prune(['here'], { keep: 5 });
  assert.ok(s.nodeState('here'), 'a present item is never pruned');
  const remaining = Object.keys(s.state.nodes).filter((k) => k.startsWith('gone-'));
  assert.strictEqual(remaining.length, 5, 'absent items capped');
  assert.ok(remaining.includes('gone-19'), 'most recently touched survives');
  assert.ok(!remaining.includes('gone-0'), 'oldest goes first');
});

test('a browser that refuses to store anything still yields a working store', async () => {
  const hostile = {
    getItem() { throw new Error('SecurityError'); },
    setItem() { throw new Error('QuotaExceeded'); },
  };
  const s = mk({ backend: localStorageBackend('k', hostile) });
  await s.ready();
  s.setNodePosition('n', 1, 2);
  await s.flush();
  assert.strictEqual(s.nodeState('n').x, 1, 'in-memory arrangement still works');
});

test('localStorage backend round-trips through a real-shaped store', async () => {
  const mem = new Map();
  const fake = {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => mem.set(k, v),
  };
  const a = mk({ backend: localStorageBackend('pp', fake), corpusId: 'c' });
  await a.ready();
  a.setLayout('timeline');
  await a.flush();

  const b = mk({ backend: localStorageBackend('pp', fake), corpusId: 'c' });
  await b.ready();
  assert.strictEqual(b.state.layout, 'timeline');
});

test('host backend writes through the panel api without clobbering its params', async () => {
  let params = { fontSize: 13 };
  const api = {
    getParameters: () => params,
    updateParameters: (p) => { params = { ...params, ...p }; },
  };
  const s = mk({ backend: hostParamsBackend(api), corpusId: 'c' });
  await s.ready();
  s.setLayout('radial');
  await s.flush();
  assert.strictEqual(params.fontSize, 13, "the host's own params survive");
  assert.strictEqual(params.viewState.layout, 'radial');
});

test('subscribers are notified and can unsubscribe', async () => {
  const s = mk(); await s.ready();
  let calls = 0;
  const off = s.subscribe(() => calls++);
  s.setLayout('radial');
  assert.strictEqual(calls, 1);
  off();
  s.setLayout('force');
  assert.strictEqual(calls, 1);
});

test('writes during a gesture are coalesced rather than one per frame', async () => {
  let saves = 0;
  const backend = { id: 'counting', async load() { return null; }, async save() { saves++; } };
  const s = createViewState({ backend, debounceMs: 20 });
  await s.ready();
  for (let x = 0; x < 40; x++) s.setNodePosition('n', x, 0, { transient: true });
  s.commit();
  await s.flush();
  assert.ok(saves <= 2, `expected the drag to coalesce, got ${saves} writes`);
});

test('a silent write persists without entering history or disturbing a gesture', async () => {
  const s = mk(); await s.ready();
  s.setLayout('radial');                                  // the reader's act
  s.setNodePosition('a', 1, 1, { transient: true });      // mid-gesture
  s.setNodePosition('settled', 9, 9, { silent: true });   // the simulation's act
  s.commit();

  assert.strictEqual(s.nodeState('settled').x, 9, 'silently written state is present');
  s.undo();
  assert.strictEqual(s.nodeState('a'), null, 'the gesture came back');
  assert.strictEqual(s.nodeState('settled').x, 9, 'the silent write was not swept up in it');
  s.undo();
  assert.strictEqual(s.state.layout, 'force');
});

test('a new layout version discards generated positions and keeps placed ones', async () => {
  const backend = memoryBackend();
  const a = mk({ backend, corpusId: 'c', layoutVersion: 'v1' });
  await a.ready();
  a.setNodePosition('generated', 1, 1, { silent: true });   // the layout chose this
  a.setNodePosition('placed', 2, 2);                        // the reader chose this
  await a.flush();

  const b = mk({ backend, corpusId: 'c', layoutVersion: 'v2' });
  await b.ready();
  assert.strictEqual(b.nodeState('generated'), null, 'stale generated position dropped');
  assert.deepStrictEqual(
    { x: b.nodeState('placed').x, y: b.nodeState('placed').y },
    { x: 2, y: 2 },
    'the reader keeps what they placed',
  );
});

test('the same layout version keeps everything', async () => {
  const backend = memoryBackend();
  const a = mk({ backend, corpusId: 'c', layoutVersion: 'v1' });
  await a.ready();
  a.setNodePosition('generated', 1, 1, { silent: true });
  await a.flush();

  const b = mk({ backend, corpusId: 'c', layoutVersion: 'v1' });
  await b.ready();
  assert.ok(b.nodeState('generated'), 'nothing is discarded without a reason');
});

test('dragging a generated position makes it the reader\'s', async () => {
  const backend = memoryBackend();
  const a = mk({ backend, corpusId: 'c', layoutVersion: 'v1' });
  await a.ready();
  a.setNodePosition('n', 1, 1, { silent: true });
  a.setNodePosition('n', 9, 9);                    // reader moves it
  await a.flush();

  const b = mk({ backend, corpusId: 'c', layoutVersion: 'v2' });
  await b.ready();
  assert.strictEqual(b.nodeState('n').x, 9, 'a node you touched is no longer the layout\'s to reset');
});

test('resizing a generated node makes it the reader\'s, like moving it does', async () => {
  const backend = memoryBackend();
  const a = mk({ backend, corpusId: 'c', layoutVersion: 'v1' });
  await a.ready();
  a.setNodePosition('n', 1, 1, { silent: true });   // the layout placed it
  a.setNodeSize('n', 400, 300);                     // the reader sized it
  await a.flush();

  const b = mk({ backend, corpusId: 'c', layoutVersion: 'v2' });
  await b.ready();
  assert.ok(b.nodeState('n'), 'a card you resized is not the layout\'s to discard');
  assert.strictEqual(b.nodeState('n').w, 400);
});

test('prune matches the item, not the layout-prefixed position key', async () => {
  // Positions are filed per layout as "<layout>::<id>". A prune that compared
  // whole keys would treat every one of them as orphaned.
  const s = mk(); await s.ready();
  s.setNodePosition('force::https://x/a.html', 1, 1);
  s.setNodePosition('radial::https://x/a.html', 2, 2);
  s.setNodeSize('https://x/a.html', 300, 200);
  s.setNodePosition('force::https://x/gone.html', 9, 9);

  s.prune(['https://x/a.html'], { keep: 0 });

  assert.ok(s.nodeState('force::https://x/a.html'), 'kept: the item is present');
  assert.ok(s.nodeState('radial::https://x/a.html'), 'kept in every layout');
  assert.ok(s.nodeState('https://x/a.html'), 'the unprefixed size entry survives too');
  assert.strictEqual(s.nodeState('force::https://x/gone.html'), null, 'a departed item still goes');
});
