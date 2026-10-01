// settings.reader.header: the small line above the title and whether the
// byline sits under it. The engine default keeps the old header.

const { test } = require('node:test');
const assert = require('node:assert');
const { readerHeader, numberToLowercaseWords } = require('../src/lib/readerHeader');

const site = { site: { title: 'A Book' }, author: { display: 'some author' } };

test('the default header has no kicker and keeps the byline', () => {
  for (const s of [undefined, {}, site, { ...site, reader: {} }]) {
    assert.deepStrictEqual(readerHeader(s, { title: 'T', series_part: 1 }), { kicker: null, byline: true });
  }
});

test('the kicker fills its tokens, number in words, and can drop the byline', () => {
  const s = { ...site, reader: { header: { kicker: ['Chapter {N_words}', '{book}', 'by {author}'], byline: false } } };
  assert.deepStrictEqual(readerHeader(s, { title: 'T', series_part: 1 }),
    { kicker: 'Chapter One — A Book — by some author', byline: false });
  assert.strictEqual(readerHeader(s, { series_part: 21 }).kicker, 'Chapter Twenty-one — A Book — by some author');
  const digits = { ...site, reader: { header: { kicker: 'Chapter {n} of {book}' } } };
  assert.strictEqual(readerHeader(digits, { series_part: 7 }).kicker, 'Chapter 7 of A Book');
});

test('a part whose token has no value is left out', () => {
  const s = { ...site, reader: { header: { kicker: ['Chapter {N_words}', '{book}'], separator: ' / ' } } };
  assert.strictEqual(readerHeader(s, { title: 'No number' }).kicker, 'A Book');
  const only = { reader: { header: { kicker: ['Chapter {n}'] } } };
  assert.strictEqual(readerHeader(only, { title: 'x' }).kicker, null);
});

test('number words', () => {
  assert.strictEqual(numberToLowercaseWords(0), 'zero');
  assert.strictEqual(numberToLowercaseWords(11), 'eleven');
  assert.strictEqual(numberToLowercaseWords(40), 'forty');
  assert.strictEqual(numberToLowercaseWords(99), 'ninety-nine');
  assert.strictEqual(numberToLowercaseWords(120), '120');
});
