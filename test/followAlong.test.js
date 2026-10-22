// The follow-along highlighter: which sentence and which word sit under a
// place in the text.

const { test } = require('node:test');
const assert = require('node:assert');
const { sentenceSpans, wordAt, spanAt } = require('../src/lib/followAlong');

const cut = (t, sp) => (sp ? t.slice(sp[0], sp[1]) : null);

test('sentences end at their stop and keep closing quotes', () => {
  const t = 'The rain fell across London. "WATCH THE STEP!" the sign said. Along the way';
  assert.deepStrictEqual(sentenceSpans(t).map((sp) => cut(t, sp)),
    ['The rain fell across London.', '"WATCH THE STEP!"', 'the sign said.', 'Along the way']);
});

test('the sentence and word under an offset', () => {
  const t = "The kettle didn't whistle on the stove. Morning is mostly made up of light.";
  const at = (i) => { const r = spanAt(t, i); return [cut(t, r.sentence), cut(t, r.word)]; };
  assert.deepStrictEqual(at(t.indexOf('didn')), ["The kettle didn't whistle on the stove.", "didn't"]);
  assert.deepStrictEqual(at(t.indexOf('whistle') + 3), ["The kettle didn't whistle on the stove.", 'whistle']);
  assert.deepStrictEqual(at(t.indexOf('mostly')), ['Morning is mostly made up of light.', 'mostly']);
});

test('a space or a stop has no word but still has its sentence', () => {
  const t = 'One. Two three.';
  assert.strictEqual(cut(t, spanAt(t, 4).sentence), 'One.');
  assert.strictEqual(spanAt(t, 4).word, null);
  // just after a word's last letter still counts as that word
  assert.strictEqual(cut(t, wordAt(t, 3)), 'One');
});

test('empty text has nothing to highlight', () => {
  assert.strictEqual(spanAt('', 0), null);
  assert.strictEqual(spanAt('   ', 1), null);
});
