// The page's colours: settings.theme's own, else the original dark look's
// (generate-index.js themeColour). A site that names no colours used to get
// "undefined" in its CSS, and the reader came out see-through (2026-11-07).

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('node:child_process');

const GENERATE = path.join(__dirname, '..', 'generate-index.js');

function buildWith(theme) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-theme-'));
  try {
    const put = (rel, text) => {
      fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
      fs.writeFileSync(path.join(root, rel), text);
    };
    put('settings.json', JSON.stringify({ site: { title: 'Theme', base_url: 'https://theme.test' }, theme }));
    put('feeds.opml', '<?xml version="1.0"?><opml version="2.0"><head><title>t</title></head><body>'
      + '<outline text="Items" title="Items" type="local" xmlUrl="local://items"/></body></opml>');
    put('items/one/frontmatter.json', JSON.stringify({ title: 'One', tags: ['a'] }));
    put('items/one/index.md', 'One.\n');
    const r = spawnSync(process.execPath, [GENERATE], { cwd: root, env: { ...process.env, POSTPIPE_SITE: root }, encoding: 'utf8' });
    assert.strictEqual(r.status, 0, r.stderr || r.stdout);
    return fs.readFileSync(path.join(root, '_site', 'index.html'), 'utf8');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test('a site that names no colours gets the original dark look, never undefined', () => {
  const html = buildWith({ name: 'default' });
  assert.match(html, /--rp-surface: #0a0e1a;/);
  assert.match(html, /--surface: #0a0e1a;/);
  assert.match(html, /--bg: #1a1a2e;/);
  assert.match(html, /--accent: #64ffda;/);
  assert.doesNotMatch(html, /--[a-z-]+: undefined;/);
});

test("a site's own colours win, one by one", () => {
  const html = buildWith({ name: 'default', surface: '#123456', bg: '' });
  assert.match(html, /--rp-surface: #123456;/);
  assert.match(html, /--bg: #1a1a2e;/, 'an empty colour falls back too');
  assert.doesNotMatch(html, /--[a-z-]+: undefined;/);
});
