// The follow-along highlighter: which sentence and which word sit under a
// place in the text.

const { test } = require('node:test');
const assert = require('node:assert');
const { sentenceSpans, wordAt, spanAt } = require('../src/lib/followAlong');

const cut = (t, sp) => (sp ? t.slice(sp[0], sp[1]) : null);

test('sentences end at their stop and keep closing quotes', () => {
  const t = 'No one called her Elinor. "THERE YOU ARE!" she said. And then';
  assert.deepStrictEqual(sentenceSpans(t).map((sp) => cut(t, sp)),
    ['No one called her Elinor.', '"THERE YOU ARE!"', 'she said.', 'And then']);
});

test('the sentence and word under an offset', () => {
  const t = "Eli didn't plan on stealing an AI. Life is mostly made up of things.";
  const at = (i) => { const r = spanAt(t, i); return [cut(t, r.sentence), cut(t, r.word)]; };
  assert.deepStrictEqual(at(t.indexOf('didn')), ['Eli didn\'t plan on stealing an AI.', "didn't"]);
  assert.deepStrictEqual(at(t.indexOf('stealing') + 3), ['Eli didn\'t plan on stealing an AI.', 'stealing']);
  assert.deepStrictEqual(at(t.indexOf('mostly')), ['Life is mostly made up of things.', 'mostly']);
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
