// A tag node's colour is the feed colours of its pieces, blended by how many
// each feed brings (src/lib/blendColors.js).
const { test } = require('node:test');
const assert = require('node:assert');

const { blendColors, parseColor, rgbToOklab, oklabToRgb, toHex } = require('../src/lib/blendColors');

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}`);
const rgb255 = (hex) => parseColor(hex).map((c) => Math.round(c * 255));

test('parseColor reads the formats the build emits, and declines the rest', () => {
  assert.deepStrictEqual(rgb255('#f39c12'), [243, 156, 18]);
  assert.deepStrictEqual(rgb255('#F00'), [255, 0, 0]);
  assert.deepStrictEqual(rgb255('#2ecc71ff'), [46, 204, 113]);
  assert.deepStrictEqual(rgb255('rgb(0, 0, 255)'), [0, 0, 255]);
  assert.deepStrictEqual(rgb255('rgba(10, 20, 30, 0.5)'), [10, 20, 30]);
  assert.deepStrictEqual(rgb255('hsl(0, 100%, 50%)'), [255, 0, 0]);
  assert.deepStrictEqual(rgb255('hsl(120, 100%, 50%)'), [0, 255, 0]);
  assert.deepStrictEqual(rgb255('hsl(210, 65%, 58%)'), [78, 148, 218]);
  assert.strictEqual(parseColor('rebeccapurple'), null, 'named colours are not parsed');
  assert.strictEqual(parseColor('var(--gv-tag-color)'), null, 'a variable is not a colour here');
  assert.strictEqual(parseColor(undefined), null);
  assert.strictEqual(parseColor(''), null);
});

test('OKLab round-trips within a step of 255', () => {
  for (const hex of ['#000000', '#ffffff', '#f39c12', '#2ecc71', '#4e94da', '#9b59b6', '#123456']) {
    assert.strictEqual(toHex(oklabToRgb(rgbToOklab(parseColor(hex)))), hex);
  }
});

test('one colour blends to itself; equal weights meet in the middle, perceptually', () => {
  assert.strictEqual(blendColors([{ color: '#f39c12', weight: 3 }], '#000'), '#f39c12');
  // Black and white meet at the grey the eye reads as mid (OKLab L 0.5),
  // not at the sRGB mean #808080 or the linear-light mean #bcbcbc.
  const mid = rgb255(blendColors([{ color: '#000000', weight: 1 }, { color: '#ffffff', weight: 1 }], null));
  assert.strictEqual(mid[0], mid[1]);
  assert.strictEqual(mid[1], mid[2]);
  near(rgbToOklab(parseColor(toHex(mid.map((c) => c / 255))))[0], 0.5, 0.01, 'mid lightness');
});

test('weights lean the blend: 3:1 sits between 1:0 and 1:1, on the heavy side', () => {
  const red = '#ff0000', blue = '#0000ff';
  const lab = (hex) => rgbToOklab(parseColor(hex));
  const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
  const even = blendColors([{ color: red, weight: 1 }, { color: blue, weight: 1 }], null);
  const heavy = blendColors([{ color: red, weight: 3 }, { color: blue, weight: 1 }], null);
  const dEven = dist(lab(even), lab(red));
  const dHeavy = dist(lab(heavy), lab(red));
  assert.ok(dHeavy < dEven, `3:1 is nearer red than 1:1 (${dHeavy} < ${dEven})`);
  assert.ok(dHeavy > 0.01, '3:1 is not red itself');
  // Many pieces of one feed and one of another, listed as one part each.
  const parts = [red, red, red, blue].map((color) => ({ color, weight: 1 }));
  assert.strictEqual(blendColors(parts, null), heavy);
});

test('a piece without a readable colour takes the fallback at its weight; nothing readable gives null', () => {
  const tag = '#f39c12';
  assert.strictEqual(blendColors([{ color: null, weight: 2 }], tag), tag);
  assert.strictEqual(blendColors([{ color: 'var(--x)', weight: 1 }, { color: null, weight: 1 }], tag), tag);
  const mixed = blendColors([{ color: '#0000ff', weight: 1 }, { color: null, weight: 1 }], tag);
  assert.strictEqual(mixed, blendColors([{ color: '#0000ff', weight: 1 }, { color: tag, weight: 1 }], null));
  assert.strictEqual(blendColors([{ color: null, weight: 1 }], null), null);
  assert.strictEqual(blendColors([], tag), null);
  assert.strictEqual(blendColors([{ color: '#fff', weight: 0 }], tag), null, 'zero weight counts for nothing');
});
