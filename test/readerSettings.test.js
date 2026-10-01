// The small switches on settings.reader and their engine defaults.

const { test } = require('node:test');
const assert = require('node:assert');
const { progressBarMode, allowDownload, readerFonts } = require('../src/lib/readerSettings');

test('reader.progressBar defaults to top', () => {
  for (const s of [undefined, null, {}, { reader: {} }, { reader: { progressBar: 'sideways' } }]) {
    assert.strictEqual(progressBarMode(s), 'top');
  }
});

test('reader.progressBar takes top, side or none', () => {
  for (const v of ['top', 'side', 'none']) {
    assert.strictEqual(progressBarMode({ reader: { progressBar: v } }), v);
  }
});

test('reader.allowDownload defaults to true; false turns it off', () => {
  for (const s of [undefined, null, {}, { reader: {} }, { reader: { allowDownload: true } }]) {
    assert.strictEqual(allowDownload(s), true);
  }
  assert.strictEqual(allowDownload({ reader: { allowDownload: false } }), false);
});

test('reader.fonts offers the page face and OpenDyslexic by default, each shipped as a local file', () => {
  const ids = (s) => readerFonts(s).map((f) => f.id);
  assert.deepStrictEqual(ids(undefined), ['default', 'opendyslexic']);
  assert.deepStrictEqual(ids({ reader: { fonts: [] } }), ['default']);
  assert.deepStrictEqual(ids({ reader: { fonts: ['opendyslexic', 'nonesuch', 'opendyslexic'] } }), ['default', 'opendyslexic']);
  const od = readerFonts(undefined)[1];
  assert.strictEqual(od.file, 'OpenDyslexic-Regular.woff2');
  assert.strictEqual(od.license, 'OpenDyslexic-OFL.txt');
  assert.ok(!/https?:/.test(JSON.stringify(readerFonts(undefined))));
});
