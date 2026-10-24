// Tightness: one slider from loose to tight scales the link distance, the
// charge and the collide padding together; the middle is the site's own.

const { test } = require('node:test');
const assert = require('node:assert');
const { tightened, clampTightness } = require('../src/lib/tightness');

const SIM = { linkDistance: 160, chargeStrength: -500, collidePadding: 10, velocityDecay: 0.7, alphaDecay: 0.028 };
const CARD = { width: 180, height: 140 };

const close = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-9, `${msg || ''} ${a} vs ${b}`);

test('the middle is the site\'s values exactly, and only the three force settings come back', () => {
  const r = tightened(SIM, 0.5, CARD);
  assert.deepStrictEqual(r, { linkDistance: 160, chargeStrength: -500, collidePadding: 10 });
});

test('loose: longer links, stronger charge, twice the padding', () => {
  const r = tightened(SIM, 0, CARD);
  close(r.linkDistance, 160 * 1.6, 'link');
  close(r.chargeStrength, -500 * 1.6, 'charge');
  close(r.collidePadding, 20, 'padding');
});

test('tight: short links, weak charge, and a negative padding of a quarter of the card\'s shorter side', () => {
  const r = tightened(SIM, 1, CARD);
  close(r.linkDistance, 160 * 0.45, 'link');
  close(r.chargeStrength, -500 * 0.35, 'charge');
  close(r.collidePadding, -140 / 4, 'padding');
  assert.ok(r.collidePadding < 0);
});

test('in between: continuous and monotone from loose to tight', () => {
  let prev = tightened(SIM, 0, CARD);
  for (let i = 1; i <= 20; i++) {
    const r = tightened(SIM, i / 20, CARD);
    assert.ok(r.linkDistance < prev.linkDistance, `link shrinks at ${i / 20}`);
    assert.ok(r.chargeStrength > prev.chargeStrength, `charge weakens at ${i / 20}`);
    assert.ok(r.collidePadding < prev.collidePadding, `padding shrinks at ${i / 20}`);
    prev = r;
  }
  // Halfway between loose and the site, and between the site and tight.
  close(tightened(SIM, 0.25, CARD).linkDistance, (256 + 160) / 2);
  close(tightened(SIM, 0.75, CARD).collidePadding, (10 - 35) / 2);
});

test('a site\'s own numbers are what gets scaled', () => {
  const r = tightened({ linkDistance: 200, chargeStrength: -800, collidePadding: 4 }, 1, { width: 300, height: 100 });
  close(r.linkDistance, 90);
  close(r.chargeStrength, -280);
  close(r.collidePadding, -25);
  assert.deepStrictEqual(tightened({ linkDistance: 200, chargeStrength: -800, collidePadding: 4 }, 0.5, CARD),
    { linkDistance: 200, chargeStrength: -800, collidePadding: 4 });
});

test('out of range or not a number: clamped, or the middle', () => {
  assert.strictEqual(clampTightness(-1), 0);
  assert.strictEqual(clampTightness(2), 1);
  assert.strictEqual(clampTightness('0.75'), 0.75);
  assert.strictEqual(clampTightness(null), 0.5);
  assert.strictEqual(clampTightness(undefined), 0.5);
  assert.strictEqual(clampTightness('loose'), 0.5);
  assert.deepStrictEqual(tightened(SIM, null, CARD), tightened(SIM, 0.5, CARD));
  assert.deepStrictEqual(tightened(SIM, 7, CARD), tightened(SIM, 1, CARD));
});

test('missing settings fall back to the engine\'s defaults', () => {
  assert.deepStrictEqual(tightened(null, 0.5, null), { linkDistance: 160, chargeStrength: -500, collidePadding: 10 });
  close(tightened({}, 1).collidePadding, -35);
});
