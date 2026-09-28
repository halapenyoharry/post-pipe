const { test } = require('node:test');
const assert = require('node:assert');
const { resolveParagraph, normalize } = require('../src/lib/resolveParagraph');

test('normalize lowercases, collapses whitespace, and strips punctuation', () => {
  assert.strictEqual(
    normalize('  Hello,  World! "This is—a test."  '),
    'hello world this isa test'
  );
  assert.strictEqual(normalize(''), '');
  assert.strictEqual(normalize(null), '');
});

test('rule 1: returns para if paragraphTexts[para] starts with quote', () => {
  const texts = [
    'First paragraph text starts here.',
    'In an old house in Paris that was covered in vines.',
    'Third paragraph of the chapter follows.',
  ];

  // Matches exactly with punctuation and different case
  const idx = resolveParagraph(texts, {
    para: 1,
    quote: 'in an old house in paris that',
  });
  assert.strictEqual(idx, 1);
});

test('rule 2: returns first matching paragraph if text shifted away from para', () => {
  // Suppose an earlier paragraph was inserted, so the target shifted from index 1 to index 2
  const texts = [
    'Newly inserted preface paragraph.',
    'First paragraph text starts here.',
    'In an old house in Paris that was covered in vines.',
  ];

  const idx = resolveParagraph(texts, {
    para: 1, // original recorded index
    quote: 'In an old house in Paris that was',
  });
  assert.strictEqual(idx, 2, 'found the shifted paragraph by quote match');
});

test('rule 3: returns min(para, paragraphTexts.length - 1) if quote not found', () => {
  const texts = [
    'Paragraph zero text.',
    'Paragraph one text.',
    'Paragraph two text.',
  ];

  // Quote modified beyond recognition
  const idx = resolveParagraph(texts, {
    para: 1,
    quote: 'Completely different words that do not appear',
  });
  assert.strictEqual(idx, 1);

  // If para was 10 (beyond length)
  const idxClamped = resolveParagraph(texts, {
    para: 10,
    quote: 'Not found quote',
  });
  assert.strictEqual(idxClamped, 2, 'clamped to length - 1');
});

test('resolveParagraph handles edge cases gracefully', () => {
  assert.strictEqual(resolveParagraph([], { para: 5, quote: 'anything' }), 0);
  assert.strictEqual(resolveParagraph(['Only paragraph'], { para: 0, quote: '' }), 0);
  assert.strictEqual(resolveParagraph(['Only paragraph'], { para: 4 }), 0);
});
