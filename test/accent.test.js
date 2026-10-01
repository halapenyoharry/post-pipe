// A site's accent (settings.accent): kept where it is legible, moved toward
// black or white only as far as WCAG AA for text needs, a 12% tint, and the
// page's CSS for both themes and both modes.

const { test } = require('node:test');
const assert = require('node:assert');
const { accentPalette, accentCss, legibleAccent, parseHex, SKETCHBOOK, AA } = require('../src/lib/accent');
const { contrast } = require('../src/lib/timeOfDay');

const THEME = { bg: '#1a1a2e', surface: '#0a0e1a' };

test('accent: none set, nothing changes', () => {
  assert.equal(accentPalette({}), null);
  assert.equal(accentPalette({ accent: '' }), null);
  assert.equal(accentPalette({ accent: 'teal-ish' }), null);
  assert.equal(accentCss({ theme: THEME }), '');
});

test('accent: parsed, kept where it already reaches AA, and tinted at 12%', () => {
  assert.equal(parseHex('#0AF'), '#00aaff');
  assert.equal(parseHex('00a7a4'), '#00a7a4');
  const a = accentPalette({ accent: '#00A7A4', theme: THEME });
  assert.equal(a.color, '#00a7a4');
  assert.equal(a.bg, 'rgba(0, 167, 164, 0.12)');
  assert.equal(a.plain, '#00a7a4', 'on the default theme\'s dark ground it is legible as it is');
  assert.ok(a.ratios.plain['#1a1a2e'] >= AA);
  // A colour that is already dark enough for paper stays itself there.
  assert.equal(legibleAccent('#1d3f8a', SKETCHBOOK.light), '#1d3f8a');
});

test('accent: where it fails, moved just far enough to reach AA on every background of the mode', () => {
  const a = accentPalette({ accent: '#00a7a4', theme: THEME });
  for (const [mode, c] of [['light', a.light], ['dark', a.dark]]) {
    for (const bg of SKETCHBOOK[mode]) assert.ok(contrast(c, bg) >= AA, `${mode}: ${c} on ${bg} ${contrast(c, bg).toFixed(2)}`);
  }
  assert.ok(contrast('#00a7a4', '#f3ecdc') < AA, 'as given it fails on paper');
  assert.notEqual(a.light, '#00a7a4');
  // darker on paper, lighter on graphite
  const sum = (h) => parseInt(h.slice(1, 3), 16) + parseInt(h.slice(3, 5), 16) + parseInt(h.slice(5, 7), 16);
  assert.ok(sum(a.light) < sum('#00a7a4'));
  assert.ok(sum(a.dark) >= sum('#00a7a4'));
  // the least step: one step less does not reach AA
  const { mix } = require('../src/lib/timeOfDay');
  for (let i = 0; i <= 100; i += 1) {
    const c = mix('#00a7a4', '#000000', i / 100);
    if (c === a.light) {
      if (i > 0) assert.ok(Math.min(...SKETCHBOOK.light.map((b) => contrast(mix('#00a7a4', '#000000', (i - 1) / 100), b))) < AA);
      break;
    }
  }
});

test('accent: the page CSS sets both themes, both modes, and a light reader over a dark page', () => {
  const css = accentCss({ accent: '#00a7a4', theme: THEME });
  const a = accentPalette({ accent: '#00a7a4', theme: THEME });
  assert.match(css, /:root \{[^}]*--pp-accent: #00a7a4;[^}]*--rp-accent: #00a7a4;[^}]*--pp-panel-accent-bg: rgba\(0, 167, 164, 0\.12\);/);
  assert.ok(css.includes(`html[data-pp-theme="sketchbook"],\n  html[data-pp-theme="sketchbook"][data-pp-mode="dark"][data-pp-reader-mode="light"] :is([data-reader-panel], [data-settings-panel]) {\n    --sk-accent: ${a.light};`));
  assert.ok(css.includes(`html[data-pp-theme="sketchbook"][data-pp-mode="dark"] {\n    --sk-accent: ${a.dark};`));
  assert.equal((css.match(/--sk-accent-bg: rgba\(0, 167, 164, 0\.12\)/g) || []).length, 2);
});
