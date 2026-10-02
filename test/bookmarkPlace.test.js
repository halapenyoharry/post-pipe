const test = require('node:test');
const assert = require('node:assert');
const { bookmarkLabel, placedParagraph } = require('../src/lib/bookmarkPlace');

test('a bookmark is named by its chapter and first words', () => {
  assert.strictEqual(bookmarkLabel({ item: 'x/berry-thief.html', quote: 'No one called' }, 'Berry Thief'), 'Berry Thief · “No one called…”');
  assert.strictEqual(bookmarkLabel({ item: 'x/night-shift.html', para: 2 }), 'night shift · paragraph 3');
});

test('a bookmark follows its version map', () => {
  const item = { version: 'v2', version_maps: { v1: { 4: 6, 5: -1 } } };
  assert.strictEqual(placedParagraph({ para: 4, version: 'v1' }, item), 6);
  assert.strictEqual(placedParagraph({ para: 5, version: 'v1' }, item), 5);
  assert.strictEqual(placedParagraph({ para: 3, version: 'v2' }, item), 3);
  assert.strictEqual(placedParagraph({}, item), null);
});

test('Bookmark: one per chapter, set at the top paragraph (replacing), taken away where it already is', () => {
  const { bookmarkTap } = require('../src/lib/bookmarkPlace');
  assert.strictEqual(bookmarkTap([], 3), 'set');
  assert.strictEqual(bookmarkTap([{ para: 3 }], 3), 'remove');
  assert.strictEqual(bookmarkTap([{ para: 3 }], 7), 'set');
  assert.strictEqual(bookmarkTap([{ paragraph: 2 }], 2), 'remove');
  assert.strictEqual(bookmarkTap([{ para: 2 }, { para: 5 }], 2), 'set');
  assert.strictEqual(bookmarkTap([{ para: 2 }], null), 'set');
});
