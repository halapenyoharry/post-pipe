// Bold word beginnings: about half of each word, at least one letter, and
// the text comes back out unchanged.

const { test } = require('node:test');
const assert = require('node:assert');
const { boldLength, boldStartSegments } = require('../src/lib/boldStart');

const bolded = (t) => boldStartSegments(t).filter((s) => s.bold).map((s) => s.text);

test('about the first half of each word is bold, at least one letter', () => {
  assert.deepStrictEqual([1, 2, 3, 4, 5, 8, 9].map(boldLength), [1, 1, 2, 2, 3, 4, 5]);
  assert.deepStrictEqual(bolded('No one called her Elinor.'), ['N', 'on', 'cal', 'he', 'Eli']);
  assert.deepStrictEqual(bolded("Eli didn't plan"), ['El', 'did', 'pl']);
  assert.deepStrictEqual(bolded('a I'), ['a', 'I']);
});

test('numbers and punctuation are left alone', () => {
  assert.deepStrictEqual(bolded('"THERE YOU ARE!" — 1984, 42.'), ['THE', 'YO', 'AR']);
});

test('the pieces join back to exactly the text', () => {
  const texts = [
    'No one called her Elinor. Eli didn\'t plan on stealing an AI.',
    '  spaced\tout\n\nlines ',
    '«Agarita», café — naïve; ’tis',
    '',
  ];
  for (const t of texts) {
    assert.strictEqual(boldStartSegments(t).map((s) => s.text).join(''), t);
  }
});
