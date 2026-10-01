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
