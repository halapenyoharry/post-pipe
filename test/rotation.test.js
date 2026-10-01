// Two-finger rotate: the point under the fingers stays put while the view
// turns, and a reset can bring the view back upright.

const { test } = require('node:test');
const assert = require('node:assert');
const { normalizeAngle, angleDelta, rotatedView, viewToScreen, screenToView } = require('../src/components/GraphViewer/rotation');

const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

test('angles wrap to (-180, 180] and the shortest turn is taken', () => {
  assert.strictEqual(normalizeAngle(370), 10);
  assert.strictEqual(normalizeAngle(-190), 170);
  assert.strictEqual(normalizeAngle(180), 180);
  assert.strictEqual(normalizeAngle(-180), 180);
  assert.strictEqual(angleDelta(179, -179), -2);
  assert.strictEqual(angleDelta(-179, 179), 2);
});

test('screen and graph coordinates round-trip at any angle', () => {
  const view = { x: 120, y: -40, k: 0.57 };
  for (const rot of [0, 33, -90, 180]) {
    const [sx, sy] = viewToScreen(view, rot, 410, -230);
    const [x, y] = screenToView(view, rot, sx, sy);
    near(x, 410); near(y, -230);
  }
});

test('while two fingers turn, the point under them stays under them', () => {
  for (const [theta0, turn] of [[0, 30], [45, -60], [-120, 170]]) {
    const t = { x: 200, y: 310, k: 0.4 };
    const m = [180, 420];
    // the graph point under the fingers when the turn began
    const p = screenToView(t, theta0, m[0], m[1]);
    const v = rotatedView(t, { theta0, mx: m[0], my: m[1] }, theta0 + turn);
    const s = viewToScreen(v, theta0 + turn, p[0], p[1]);
    near(s[0], m[0]); near(s[1], m[1]);
    assert.strictEqual(v.k, t.k);
  }
});

test('with no turn the view is d3\'s own', () => {
  const t = { x: 1, y: 2, k: 3 };
  assert.deepStrictEqual(rotatedView(t, null, 40), t);
  assert.deepStrictEqual(rotatedView(t, { theta0: 40, mx: 0, my: 0 }, 40), t);
});
