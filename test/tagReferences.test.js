// tagReferences.js: an item's tag references in one shape, item.tags only
// when the item has none, and a viewer node read through its originalItem.
const test = require('node:test');
const assert = require('node:assert');
const { tagReferences } = require('../src/lib/tagReferences');

const ref = (value, extra = {}) => ({ type: 'tag', value, ...extra });

test('the references of type tag with a non-empty string value, in their order, as they are', () => {
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
      { type: 'tag', value: 2024 },
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

test('item.tags stands in only when the item has no tag references', () => {
  assert.deepStrictEqual(tagReferences({ tags: ['x', 'y'] }), [ref('x'), ref('y')]);
  assert.deepStrictEqual(
    tagReferences({ tags: ['x', 'y'], _references: [{ type: 'image', value: 'covers/a.png' }] }),
    [ref('x'), ref('y')],
    'non-tag references alone do not stop the fallback'
  );
  assert.deepStrictEqual(
    tagReferences({ tags: ['x', '', 7, null, 'y'] }),
    [ref('x'), ref('y')],
    'an entry of item.tags that is not a non-empty string makes no reference'
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
