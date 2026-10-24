// One wheel click is one zoom step, however many pixels the mouse reports
// (src/lib/wheelZoom.js).
const { test } = require('node:test');
const assert = require('node:assert');

const { wheelDelta, WHEEL_STEP_MAX } = require('../src/lib/wheelZoom');

const ev = (deltaY, extra = {}) => ({ deltaY, deltaMode: 0, ctrlKey: false, ...extra });
// Floating point: 3 * 0.05 is not quite 0.15.
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-12, `${a} is not ${b}`);

test('a mouse click of hundreds of pixels is capped to one step, in and out', () => {
  assert.strictEqual(wheelDelta(ev(-300)), WHEEL_STEP_MAX);
  assert.strictEqual(wheelDelta(ev(300)), -WHEEL_STEP_MAX);
  assert.strictEqual(wheelDelta(ev(-10000)), WHEEL_STEP_MAX);
  const factor = Math.pow(2, WHEEL_STEP_MAX);
  assert.ok(factor > 1.2 && factor < 1.3, `one click zooms about 1.25x (${factor})`);
});

test('a trackpad\'s small deltas pass through as d3 would have them', () => {
  near(wheelDelta(ev(-5)), 0.01);
  near(wheelDelta(ev(5)), -0.01);
  near(wheelDelta(ev(-50)), 0.1);
  near(wheelDelta(ev(0)), 0);
});

test('lines and pages keep d3\'s units, under the same cap', () => {
  near(wheelDelta(ev(-3, { deltaMode: 1 })), 0.15);
  assert.strictEqual(wheelDelta(ev(-10, { deltaMode: 1 })), WHEEL_STEP_MAX);
  assert.strictEqual(wheelDelta(ev(-1, { deltaMode: 2 })), WHEEL_STEP_MAX);
});

test('a pinch (ctrlKey) keeps its 10x, under the same cap', () => {
  near(wheelDelta(ev(-10, { ctrlKey: true })), 0.2);
  assert.strictEqual(wheelDelta(ev(-100, { ctrlKey: true })), WHEEL_STEP_MAX);
});

test('the cap can be given, and nonsense is no step at all', () => {
  assert.strictEqual(wheelDelta(ev(-300), 0.1), 0.1);
  assert.strictEqual(wheelDelta(ev(NaN)), 0);
  assert.strictEqual(wheelDelta(ev(undefined)), 0);
});
