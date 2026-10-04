// A card's title on the screen, and the zoom that makes it readable
// (src/components/GraphViewer/readable.js; node.readable and
// node.zoomToReadable in src/lib/actions.js).
const test = require('node:test');
const assert = require('node:assert');
const { readablePxOf, titleScreenPx, readableZoom, keepUnderFinger } = require('../src/components/GraphViewer/readable');

test('graph.readablePx, 16 by default', () => {
  assert.equal(readablePxOf({}), 16);
  assert.equal(readablePxOf(null), 16);
  assert.equal(readablePxOf({ readablePx: 20 }), 20);
  assert.equal(readablePxOf({ readablePx: -3 }), 16);
  assert.equal(readablePxOf({ readablePx: 'big' }), 16);
});

test('a title on the screen is its font times the zoom and the card\'s own scale', () => {
  assert.equal(titleScreenPx(20, 0.5, 0.66), 6.6000000000000005);
  assert.equal(titleScreenPx(20, 2), 40);
  assert.equal(titleScreenPx(0, 2), 0, 'no title, nothing to read');
  assert.equal(titleScreenPx(20, 0), 0);
});

test('the zoom that brings a title to the readable size, and no further than the cap', () => {
  const k = readableZoom(0.5, 6.6, 16);
  assert.ok(Math.abs(k - 0.5 * 16 / 6.6) < 1e-5);
  assert.ok(titleScreenPx(20, k, 0.66) >= 16, 'at least 16 px after it');
  assert.equal(readableZoom(1, 20, 16), 1, 'already readable: it does not zoom out');
  assert.equal(readableZoom(0.5, 1, 16, 4), 4, 'capped');
  assert.equal(readableZoom(0.5, 0, 16), 0.5, 'nothing measured: left as it is');
});

test('the card stays put when it lies on the screen after the zoom', () => {
  const area = { x0: 0, y0: 40, x1: 390, y1: 844 };
  const pan = keepUnderFinger({ finger: { x: 200, y: 400 }, before: { x: 195, y: 398 }, after: { x: 210, y: 420 }, ratio: 2, half: { w: 70, h: 55 }, area });
  assert.deepStrictEqual(pan, { x: 0, y: 0 });
});

test('off the screen after the zoom: panned so the point under the finger is under it again', () => {
  const area = { x0: 0, y0: 40, x1: 390, y1: 844 };
  const finger = { x: 360, y: 700 }, before = { x: 350, y: 690 }, ratio = 3;
  const after = { x: 470, y: 760 };
  const pan = keepUnderFinger({ finger, before, after, ratio, half: { w: 90, h: 70 }, area });
  // That point of the card after the zoom, and the pan: back under the finger.
  const point = { x: after.x + (finger.x - before.x) * ratio + pan.x, y: after.y + (finger.y - before.y) * ratio + pan.y };
  assert.ok(Math.abs(point.x - finger.x) < 1e-9 && Math.abs(point.y - finger.y) < 1e-9);
  assert.ok(pan.x < 0 && pan.y < 0);
});
