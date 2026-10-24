// The chronology stack's switch (settings.timeOverlay.show): on unless a
// site sets it false.

const { test } = require('node:test');
const assert = require('node:assert');
const { timeOverlayConfig } = require('../src/lib/timeOverlay');

test('show: on by default, whatever shape the setting is missing in', () => {
  assert.deepStrictEqual(timeOverlayConfig(null), { show: true });
  assert.deepStrictEqual(timeOverlayConfig({}), { show: true });
  assert.deepStrictEqual(timeOverlayConfig({ timeOverlay: {} }), { show: true });
  assert.deepStrictEqual(timeOverlayConfig({ timeOverlay: false }), { show: true });
  assert.deepStrictEqual(timeOverlayConfig({ timeOverlay: { show: true } }), { show: true });
});

test('show: only false turns it off', () => {
  assert.deepStrictEqual(timeOverlayConfig({ timeOverlay: { show: false } }), { show: false });
  assert.deepStrictEqual(timeOverlayConfig({ timeOverlay: { show: 'no' } }), { show: true });
  assert.deepStrictEqual(timeOverlayConfig({ timeOverlay: { show: 0 } }), { show: true });
});
