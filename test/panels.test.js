// The one settings surface split in two: each group says where it belongs,
// and a panel shows only its own.

const { test } = require('node:test');
const assert = require('node:assert');
const { GROUPS, panelGroups, panelTitle, modeInReader } = require('../src/lib/panels');

const ids = (gs) => gs.map((g) => g.id);
const cover = { opening: { enabled: true, art: { artState: 'a.png', graphState: 'g.png' } } };

test('every group belongs to the main view or the reader, never both', () => {
  for (const g of GROUPS) assert.ok(g.where === 'graph' || g.where === 'reader', g.id);
  const graph = ids(panelGroups('graph', { voice: true, modes: 2 }));
  const reader = ids(panelGroups('reader', { voice: true, modes: 2 }));
  assert.deepStrictEqual(graph, ['look', 'view', 'memory']);
  assert.deepStrictEqual(reader, ['reading', 'listening']);
  assert.ok(graph.every((g) => !reader.includes(g)));
});

test('light or dark paper is the reader\'s when a dark cover holds the page dark', () => {
  assert.strictEqual(modeInReader(null), false);
  assert.strictEqual(modeInReader(cover), true);
  assert.deepStrictEqual(ids(panelGroups('reader', { settings: cover, voice: true, modes: 2 })), ['reading', 'paper', 'listening']);
  assert.deepStrictEqual(ids(panelGroups('reader', { settings: cover, voice: true, modes: 1 })), ['reading', 'listening']);
});

test('nothing to read: no reading groups; no voice: no listening', () => {
  assert.deepStrictEqual(ids(panelGroups('reader', { readable: false, voice: true, modes: 2, settings: cover })), []);
  assert.deepStrictEqual(ids(panelGroups('reader', { voice: false })), ['reading']);
});

test('titles: the site\'s, or the engine\'s own', () => {
  assert.strictEqual(panelTitle(null, 'graph'), 'Things to change');
  assert.strictEqual(panelTitle(null, 'reader'), 'Reading');
  assert.strictEqual(panelTitle({ panels: { graph: { title: 'Fun things to change' } } }, 'graph'), 'Fun things to change');
  assert.strictEqual(panelTitle({ panels: { graph: { title: '  ' } } }, 'nonsense'), 'Things to change');
});
