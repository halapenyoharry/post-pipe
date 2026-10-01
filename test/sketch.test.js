const test = require('node:test');
const assert = require('node:assert');
const { roughRect, ghostOf, jitterPoints } = require('../src/lib/sketch');

test('a card border is the same every time for the same card, and stays inside it', () => {
  const a = roughRect(180, 140, 10, 'berry');
  assert.deepStrictEqual(a, roughRect(180, 140, 10, 'berry'));
  assert.notStrictEqual(a.main, roughRect(180, 140, 10, 'night').main);
  const nums = a.main.match(/-?\d+(\.\d+)?/g).map(Number);
  for (let i = 0; i < nums.length; i += 2) {
    assert.ok(nums[i] >= 0 && nums[i] <= 180 && nums[i + 1] >= 0 && nums[i + 1] <= 140);
  }
});

test('an edge gets a second pass that keeps its ends near its own', () => {
  const g = ghostOf('M 10 10 Q 60 40 110 10', 'e1');
  assert.strictEqual(g, ghostOf('M 10 10 Q 60 40 110 10', 'e1'));
  const v = g.match(/-?\d+(\.\d+)?/g).map(Number);
  assert.ok(Math.abs(v[0] - 10) <= 1.5 && Math.abs(v[5] - 10) <= 1.5);
  assert.ok(ghostOf('M 0 0 L 50 0', 'e2').startsWith('M'));
  assert.strictEqual(ghostOf('', 'x'), '');
});

test('hull points are nudged the same way by index', () => {
  const p = [[0, 0], [10, 0], [10, 10]];
  assert.deepStrictEqual(jitterPoints(p, 'c'), jitterPoints(p, 'c'));
  for (const [i, q] of jitterPoints(p, 'c', 3).entries()) assert.ok(Math.abs(q[0] - p[i][0]) <= 3);
});
