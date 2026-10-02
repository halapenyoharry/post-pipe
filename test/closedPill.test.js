// The closed pill's look (graph.closedPill): the shape, the status line and
// the label's size.

const { test } = require('node:test');
const assert = require('node:assert');
const { closedPillOf } = require('../src/components/GraphViewer/containerLayout');

test('closedPill: a blob or the soft card, the status line on unless turned off, the label size when set', () => {
  assert.deepStrictEqual(closedPillOf({}), { shape: 'soft', status: true, labelSize: null });
  assert.deepStrictEqual(closedPillOf({ closedPill: { shape: 'blob', status: false, labelSize: 50 } }), { shape: 'blob', status: false, labelSize: 50 });
  assert.equal(closedPillOf({ closedPill: { shape: 'capsule' } }).shape, 'soft');
  assert.equal(closedPillOf({ closedPill: { labelSize: -3 } }).labelSize, null);
  assert.equal(closedPillOf({ closedPill: { labelSize: '' } }).labelSize, null);
  assert.equal(closedPillOf(null).status, true);
});
