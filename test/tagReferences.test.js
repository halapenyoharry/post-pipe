// tagReferences.js: an item's tag references in one shape, item.tags only
// when the item has none, and a viewer node read through its originalItem.
const test = require('node:test');
const assert = require('node:assert');
const { tagReferences } = require('../src/lib/tagReferences');

const ref = (value, extra = {}) => ({ type: 'tag', value, ...extra });

test('the references of type tag that name a tag, in their order, as they are', () => {
  const alpha = ref('Alpha', { concept: 'c_alpha', origin: 'explicit', weight: 1, why: null });
  const beta = ref('Beta', { concept: 'c_beta', origin: 'discovered', weight: 0.4, why: 'recurs in 7 of 102 items', sourceRatio: 2.9 });
  const item = {
    tags: ['Alpha', 'Beta'],
    _references: [
      { type: 'image', value: 'covers/a.png' },
      alpha,
      { type: 'untagged', why: ['under the bar'], reason: 'underBar' },
      beta,
      { type: 'tag', value: '' },
      { type: 'tag', value: true },
      { type: 'tag', value: { label: 'x' } },
      { type: 'tag', value: null },
      { type: 'tag' },
      null,
      'tag',
    ],
  };
  const out = tagReferences(item);
  assert.deepStrictEqual(out, [alpha, beta]);
  assert.strictEqual(out[0], alpha, 'the reference itself, not a copy');
  assert.strictEqual(out[1], beta);
});

test('a tag written as a number counts as its string, as it did before the helper', () => {
  // gray-matter reads `tags: [2024, ai]` as a number and a string.
  assert.deepStrictEqual(tagReferences({ tags: [2024, 'ai'] }), [ref('2024'), ref('ai')]);
  assert.deepStrictEqual(tagReferences({ tags: [0, -1.5] }), [ref('0'), ref('-1.5')]);
  const numeric = { type: 'tag', value: 2024, concept: 'c_2024' };
  const out = tagReferences({ _references: [numeric, ref('ai')] });
  assert.deepStrictEqual(out, [{ type: 'tag', value: '2024', concept: 'c_2024' }, ref('ai')]);
  assert.notStrictEqual(out[0], numeric, 'a copy carrying the string');
  assert.strictEqual(numeric.value, 2024, 'the reference itself is not changed');
  // Not a finite number, a boolean, null, an object or an empty string: none.
  assert.deepStrictEqual(tagReferences({ tags: [NaN, Infinity, -Infinity, true, false, null, undefined, {}, [], ''] }), []);
  assert.deepStrictEqual(tagReferences({ _references: [
    { type: 'tag', value: NaN }, { type: 'tag', value: Infinity }, { type: 'tag', value: false },
  ] }), []);
});

test('item.tags stands in only when the item has no tag references', () => {
  assert.deepStrictEqual(tagReferences({ tags: ['x', 'y'] }), [ref('x'), ref('y')]);
  assert.deepStrictEqual(
    tagReferences({ tags: ['x', 'y'], _references: [{ type: 'image', value: 'covers/a.png' }] }),
    [ref('x'), ref('y')],
    'non-tag references alone do not stop the fallback'
  );
  assert.deepStrictEqual(
    tagReferences({ tags: ['x', '', 7, null, true, 'y'] }),
    [ref('x'), ref('7'), ref('y')],
    'an empty string, null or a boolean in item.tags makes no reference; a number is its string'
  );
  // One tag reference is enough: item.tags is not read, even where it says more.
  assert.deepStrictEqual(tagReferences({ tags: ['x', 'y'], _references: [ref('x')] }), [ref('x')]);
  assert.deepStrictEqual(tagReferences({ tags: [], _references: [ref('x', { concept: 'c_x' })] }), [ref('x', { concept: 'c_x' })]);
  assert.deepStrictEqual(tagReferences({ _references: [ref('x')] }), [ref('x')], 'no tags list at all');
});

test('a viewer node is read through its originalItem when it carries no list of its own', () => {
  const original = { tags: ['x'], _references: [ref('x', { concept: 'c_x' })] };
  assert.deepStrictEqual(tagReferences({ id: 'n', originalItem: original }), [ref('x', { concept: 'c_x' })]);
  assert.deepStrictEqual(tagReferences({ id: 'n', originalItem: { tags: ['x'] } }), [ref('x')]);
  // The node's own list wins over the original's.
  assert.deepStrictEqual(
    tagReferences({ id: 'n', _references: [ref('y')], originalItem: original }),
    [ref('y')]
  );
  assert.deepStrictEqual(tagReferences({ id: 'n', tags: ['z'], originalItem: { tags: ['x'] } }), [ref('z')]);
});

test('nothing, or a malformed item, gives an empty list', () => {
  assert.deepStrictEqual(tagReferences(undefined), []);
  assert.deepStrictEqual(tagReferences(null), []);
  assert.deepStrictEqual(tagReferences('x'), []);
  assert.deepStrictEqual(tagReferences({}), []);
  assert.deepStrictEqual(tagReferences({ tags: 'x', _references: 'y' }), []);
  assert.deepStrictEqual(tagReferences({ tags: [], _references: [] }), []);
  assert.deepStrictEqual(tagReferences({ _references: [{ type: 'untagged', reason: 'none' }] }), []);
});
