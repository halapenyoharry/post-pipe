const test = require('node:test');
const assert = require('node:assert');
const { themeName, themeMode } = require('../src/lib/theme');

test('the site picks the theme, the viewer can pick another', () => {
  assert.strictEqual(themeName({}), 'default');
  assert.strictEqual(themeName({ theme: { name: 'sketchbook' } }), 'sketchbook');
  assert.strictEqual(themeName({ theme: { name: 'sketchbook' } }, 'default'), 'default');
  assert.strictEqual(themeName({ theme: { name: 'nope' } }, 'also-nope'), 'default');
});

test('a two-mode theme follows the device unless the viewer picks', () => {
  assert.strictEqual(themeMode('sketchbook', null, true), 'dark');
  assert.strictEqual(themeMode('sketchbook', null, false), 'light');
  assert.strictEqual(themeMode('sketchbook', 'light', true), 'light');
  assert.strictEqual(themeMode('default', 'light', false), 'dark');
});
