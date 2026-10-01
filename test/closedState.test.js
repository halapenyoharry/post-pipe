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
