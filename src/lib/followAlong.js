// Follow-along: the sentence, and the word, at a place in a block of text.
// Pure string work, so the reader's highlighter and the tests agree on where
// a sentence starts and ends. The highlighter itself (ranges, ::highlight)
// lives in the reader; nothing here touches the text.

// A sentence runs to its . ! ? (or …) and takes any closing quotes or
// brackets after it; whatever is left at the end of a block without a stop
// is a sentence too.
const SENTENCE = /[^.!?…]*(?:[.!?…]+["'”’»)\]]*|$)/g;
const WORD_CHAR = /[\p{L}\p{M}\p{N}'’-]/u;

function sentenceSpans(text) {
  const spans = [];
  SENTENCE.lastIndex = 0;
  let m;
  while ((m = SENTENCE.exec(text)) !== null) {
    if (m[0].length === 0) { SENTENCE.lastIndex++; if (SENTENCE.lastIndex > text.length) break; continue; }
    let s = m.index;
    let e = m.index + m[0].length;
    while (s < e && /\s/.test(text[s])) s++;
    while (e > s && /\s/.test(text[e - 1])) e--;
    if (e > s) spans.push([s, e]);
  }
  return spans;
}

// The word at offset (a letter run with inner apostrophes and hyphens), or
// null when the offset is on a space or punctuation.
function wordAt(text, offset) {
  let i = Math.max(0, Math.min(offset, text.length - 1));
  if (!WORD_CHAR.test(text[i] || '')) {
    if (i > 0 && WORD_CHAR.test(text[i - 1])) i -= 1;
    else return null;
  }
  let s = i;
  let e = i + 1;
  while (s > 0 && WORD_CHAR.test(text[s - 1])) s--;
  while (e < text.length && WORD_CHAR.test(text[e])) e++;
  // Trailing apostrophes and hyphens belong to the punctuation, not the word.
  while (e > s && /['’-]/.test(text[e - 1])) e--;
  while (s < e && /['’-]/.test(text[s])) s++;
  return e > s ? [s, e] : null;
}

// { sentence: [start, end], word: [start, end] | null } for the place at
// offset, or null if the text is empty there.
function spanAt(text, offset) {
  if (!text) return null;
  const spans = sentenceSpans(text);
  if (!spans.length) return null;
  let sentence = spans.find(([s, e]) => offset >= s && offset < e);
  if (!sentence) {
    // Between sentences: the one just before, or the first.
    sentence = spans.filter(([s]) => s <= offset).pop() || spans[0];
  }
  return { sentence, word: wordAt(text, offset) };
}

module.exports = { sentenceSpans, wordAt, spanAt };
