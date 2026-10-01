// Bold word beginnings: the first part of each word is bold. Roughly the
// first half of its letters, at least one. Applied to what is drawn, at
// render time; the text itself is never changed, so taking every piece's
// text back out joins to exactly the original.

const WORD = /[\p{L}\p{M}]+(?:['’][\p{L}\p{M}]+)*/gu;

// How many characters of a word of this length are bold.
function boldLength(len) {
  return len <= 0 ? 0 : Math.max(1, Math.round(len / 2));
}

// [{ text, bold }] covering text exactly, in order.
function boldStartSegments(text) {
  const out = [];
  let at = 0;
  const push = (t, bold) => {
    if (!t) return;
    const last = out[out.length - 1];
    if (last && last.bold === bold) last.text += t;
    else out.push({ text: t, bold });
  };
  WORD.lastIndex = 0;
  let m;
  while ((m = WORD.exec(text)) !== null) {
    push(text.slice(at, m.index), false);
    const k = boldLength(m[0].length);
    push(m[0].slice(0, k), true);
    push(m[0].slice(k), false);
    at = m.index + m[0].length;
  }
  push(text.slice(at), false);
  return out;
}

module.exports = { boldLength, boldStartSegments };
