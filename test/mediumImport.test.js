// The parts of the Medium importer that run without a browser:
// where the saved session is read and written, the publish guard, and how a
// page is classified. The browser-driving code is not exercised here.
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const medium = require('../platforms/medium');

const SITE = '/x/site';
const ENGINE = '/x/engine';
const siteFile = path.join(SITE, 'auth', 'medium-session.json');
const engineFile = path.join(ENGINE, 'auth', 'medium-session.json');
const existsAmong = (...paths) => p => paths.includes(p);

test('medium session: the site\'s auth/ wins over the engine\'s', () => {
  const r = medium.resolveSessionPath({ site: SITE, engineRoot: ENGINE, exists: existsAmong(siteFile, engineFile) });
  assert.deepStrictEqual(r, { path: siteFile, source: 'site' });
});

test('medium session: falls back to the engine\'s auth/', () => {
  const r = medium.resolveSessionPath({ site: SITE, engineRoot: ENGINE, exists: existsAmong(engineFile) });
  assert.deepStrictEqual(r, { path: engineFile, source: 'engine' });
});

test('medium session: none found gives a null path', () => {
  const r = medium.resolveSessionPath({ site: SITE, engineRoot: ENGINE, exists: () => false });
  assert.deepStrictEqual(r, { path: null, source: null });
});

test('medium session: login writes over the file already in use', () => {
  assert.strictEqual(
    medium.sessionSavePath({ site: SITE, engineRoot: ENGINE, exists: existsAmong(engineFile, path.join(SITE, 'auth')) }),
    engineFile
  );
});

test('medium session: login writes into the site\'s auth/ when it exists, else the engine\'s', () => {
  assert.strictEqual(
    medium.sessionSavePath({ site: SITE, engineRoot: ENGINE, exists: existsAmong(path.join(SITE, 'auth')) }),
    siteFile
  );
  assert.strictEqual(
    medium.sessionSavePath({ site: SITE, engineRoot: ENGINE, exists: () => false }),
    engineFile
  );
});

test('medium session: the real defaults follow POSTPIPE_SITE', () => {
  const prev = process.env.POSTPIPE_SITE;
  process.env.POSTPIPE_SITE = SITE;
  try {
    const r = medium.resolveSessionPath({ exists: existsAmong(siteFile) });
    assert.strictEqual(r.path, siteFile);
  } finally {
    if (prev === undefined) delete process.env.POSTPIPE_SITE; else process.env.POSTPIPE_SITE = prev;
  }
});

test('medium publish guard: a draft run has no notice', () => {
  assert.deepStrictEqual(medium.publishGuard(false, 'https://medium.com/p/abc/edit'), { publish: false, notice: null });
});

test('medium publish guard: --publish never publishes and names the draft', () => {
  const g = medium.publishGuard(true, 'https://medium.com/p/abc/edit');
  assert.strictEqual(g.publish, false);
  assert.match(g.notice, /stops at the draft/);
  assert.match(g.notice, /https:\/\/medium\.com\/p\/abc\/edit/);
});

test('medium importer: no code path clicks Publish', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'platforms', 'medium.js'), 'utf8');
  assert.doesNotMatch(src, /has-text\(["']Publish/i);
  assert.doesNotMatch(src, /name:\s*\/\^?\\?s?\*?publish/i);
  assert.doesNotMatch(src, /data-testid=["']?publish/i);
});

test('medium page classification', () => {
  assert.strictEqual(medium.classifyPage({ title: 'Attention Required! | Cloudflare' }), 'blocked');
  assert.strictEqual(medium.classifyPage({ title: 'Medium', bodyText: 'Sorry, you have been blocked\nYou are unable to access medium.com' }), 'blocked');
  assert.strictEqual(medium.classifyPage({ title: 'Medium', url: 'https://medium.com/m/signin?operation=login' }), 'signin');
  assert.strictEqual(medium.classifyPage({ title: 'Medium', url: 'https://medium.com/me/stories', signInVisible: true }), 'signed-out');
  assert.strictEqual(medium.classifyPage({ title: 'Medium', url: 'https://medium.com/me/stories' }), 'ok');
});

test('medium editor URLs', () => {
  assert.ok(medium.isEditorUrl('https://medium.com/p/1a2b3c4d5e6f/edit'));
  assert.ok(medium.isEditorUrl('https://medium.com/@someone/a-title-1a2b3c4d5e6f/edit?source=x'));
  assert.ok(!medium.isEditorUrl('https://medium.com/me/stories'));
  assert.ok(!medium.isEditorUrl('https://medium.com/p/import'));
  assert.ok(!medium.isEditorUrl('https://example.com/p/abc/edit'));
});

test('medium importer: refuses a value that is not a public URL before opening a browser', async () => {
  await assert.rejects(() => medium.importUrl('art-is-pattern.html'), /Not a public URL/);
});
