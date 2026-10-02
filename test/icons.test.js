// The engine's icons, and a site's icon strings drawn the same way.

const { test } = require('node:test');
const assert = require('node:assert');
const { ICONS, iconBody, siteIcon } = require('../src/lib/icons');

test('the engine has the icons its controls draw, as SVG bodies with no emoji', () => {
  for (const n of ['undo-2', 'redo-2', 'rotate-ccw', 'hourglass', 'settings', 'check', 'sliders-horizontal', 'x', 'link', 'arrow-left', 'arrow-right', 'bookmark', 'maximize-2', 'minimize-2', 'minus', 'move-horizontal', 'list', 'info', 'download']) {
    assert.match(iconBody(n), /^<g [^>]*stroke="currentColor"[^>]*>.*<\/g>$/, n);
  }
  assert.strictEqual(iconBody('nope'), '');
  for (const body of Object.values(ICONS)) assert.ok(!/[☀-➿]|[\u{1F300}-\u{1FAFF}]/u.test(body));
});

test('a site icon: a body string, a whole <svg> unwrapped, nothing that runs', () => {
  assert.strictEqual(siteIcon('<path d="M1 1h2"/>'), '<path d="M1 1h2"/>');
  assert.strictEqual(siteIcon('<svg viewBox="0 0 24 24"><path d="M1 1"/></svg>'), '<path d="M1 1"/>');
  assert.strictEqual(siteIcon(''), '');
  assert.strictEqual(siteIcon('coffee'), '');
  assert.strictEqual(siteIcon(7), '');
  assert.strictEqual(siteIcon('<script>x()</script>'), '');
  assert.strictEqual(siteIcon('<path onclick="x()" d="M1 1"/>'), '');
  assert.strictEqual(siteIcon('<a href="javascript:x()"><path/></a>'), '');
});
