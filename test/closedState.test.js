// A closed container hides its members at every depth and every edge that
// touches one of them.

const { test } = require('node:test');
const assert = require('node:assert');
const { closedMemberSet, edgeHidden } = require('../src/components/GraphViewer/closedState');

const members = { book: ['a1', 'a2', 'b1'], act1: ['a1', 'a2'], act2: ['b1'] };
const membersOf = (id) => members[id];

test('closing a container hides its members at every depth', () => {
  assert.deepStrictEqual([...closedMemberSet([], membersOf)], []);
  assert.deepStrictEqual([...closedMemberSet(['act1'], membersOf)].sort(), ['a1', 'a2']);
  assert.deepStrictEqual([...closedMemberSet(['book'], membersOf)].sort(), ['a1', 'a2', 'b1']);
});

test('an edge with either end hidden is hidden, whether its ends are ids or nodes', () => {
  const hidden = closedMemberSet(['act1'], membersOf);
  assert.strictEqual(edgeHidden({ source: 'a1', target: 'a2' }, hidden), true);
  assert.strictEqual(edgeHidden({ source: { id: 'a2' }, target: { id: 'b1' } }, hidden), true);
  assert.strictEqual(edgeHidden({ source: 'b1', target: 'x' }, hidden), false);
});

test('containers start closed or open as the site says, initialCollapsed otherwise', () => {
  const { initiallyClosed } = require('../src/components/GraphViewer/closedState');
  const book = [
    { id: 'container:book', parent: null },
    { id: 'container:act-1', parent: 'container:book' },
    { id: 'container:act-2', parent: 'container:book' },
  ];
  assert.deepStrictEqual(initiallyClosed(book, { containersStart: 'closed' }), ['container:act-1', 'container:act-2'], 'the acts, not the book');
  assert.deepStrictEqual(initiallyClosed(book, { containersStart: 'open' }), []);
  assert.deepStrictEqual(initiallyClosed(book, { containersStart: 'open', initialCollapsed: 'all' }), [], 'containersStart wins');
  const flat = [{ id: 'a' }, { id: 'b' }];
  assert.deepStrictEqual(initiallyClosed(flat, { containersStart: 'closed' }), ['a', 'b'], 'none inside another: all of them');
  assert.deepStrictEqual(initiallyClosed(book, {}), [], 'nothing set: none closed');
  assert.deepStrictEqual(initiallyClosed(book, { initialCollapsed: 'all' }).length, 3);
  assert.deepStrictEqual(initiallyClosed(book, { initialCollapsed: ['container:act-2'] }), ['container:act-2']);
  assert.deepStrictEqual(initiallyClosed(undefined, { containersStart: 'closed' }), []);
});

test('close all closes the containers inside another and opens the ones they sit in', () => {
  const { closeAllPlan } = require('../src/components/GraphViewer/closedState');
  const book = [{ id: 'book' }, { id: 'a1', parent: 'book' }, { id: 'a2', parent: 'book' }];
  assert.deepStrictEqual(closeAllPlan(book), { close: ['a1', 'a2'], open: ['book'] });
  const flat = [{ id: 'x' }, { id: 'y' }];
  assert.deepStrictEqual(closeAllPlan(flat), { close: ['x', 'y'], open: [] });
  assert.deepStrictEqual(closeAllPlan([]), { close: [], open: [] });
});
