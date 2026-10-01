// The small switches on settings.reader and their engine defaults.

const { test } = require('node:test');
const assert = require('node:assert');
const { progressBarMode, allowDownload } = require('../src/lib/readerSettings');

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
