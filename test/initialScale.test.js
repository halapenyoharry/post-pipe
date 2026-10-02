// The first frame's scale: cards at least graph.initialScale.minCardWidthPx
// wide on the first screen, and, with anchors, at the home view.

const { test } = require('node:test');
const assert = require('node:assert');
const { minCardScale, homeScale } = require('../src/components/GraphViewer/initialScale');

test('the scale that draws a card at the minimum width', () => {
  assert.strictEqual(minCardScale({ minCardWidthPx: 96 }, 180), 96 / 180);
  assert.strictEqual(96 / 180 * 180, 96);
});

test('no minimum, or a nonsense one, asks for nothing', () => {
  assert.strictEqual(minCardScale(undefined, 180), 0);
  assert.strictEqual(minCardScale({}, 180), 0);
  assert.strictEqual(minCardScale({ minCardWidthPx: 0 }, 180), 0);
  assert.strictEqual(minCardScale({ minCardWidthPx: -5 }, 180), 0);
  assert.strictEqual(minCardScale({ minCardWidthPx: 'x' }, 180), 0);
  assert.strictEqual(minCardScale({ minCardWidthPx: 96 }, 0), 0);
});

test('the home view rests at the larger of initialFocusMinScale and the card minimum', () => {
  assert.strictEqual(homeScale(0.3, { minCardWidthPx: 96 }, 180), 96 / 180);
  assert.strictEqual(homeScale(0.8, { minCardWidthPx: 96 }, 180), 0.8);
  assert.strictEqual(homeScale(0.3, undefined, 180), 0.3);
  // A wider card needs less zoom for the same width on screen.
  assert.ok(homeScale(0.1, { minCardWidthPx: 96 }, 240) < homeScale(0.1, { minCardWidthPx: 96 }, 180));
});
