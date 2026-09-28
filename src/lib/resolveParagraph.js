// resolveParagraph — anchor resolution for reader bookmarks and deep links.
// Given an array of paragraph texts and a target { para, quote }:
// 1. If paragraphTexts[para] starts with quote (normalized: lowercase,
//    collapse whitespace, strip punctuation), return para.
// 2. Else return the index of the first paragraph that starts with quote, if any.
// 3. Else return min(para, paragraphTexts.length - 1).

function normalize(str) {
  if (typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .replace(/[\p{P}\p{S}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveParagraph(paragraphTexts, { para, quote } = {}) {
  if (!Array.isArray(paragraphTexts) || paragraphTexts.length === 0) {
    return 0;
  }
  const p = typeof para === 'number' ? para : (parseInt(para, 10) || 0);
  const normQuote = normalize(quote);

  if (normQuote.length > 0) {
    // 1. If paragraphTexts[para] starts with quote, return para.
    if (p >= 0 && p < paragraphTexts.length) {
      if (normalize(paragraphTexts[p]).startsWith(normQuote)) {
        return p;
      }
    }

    // 2. Else return the index of the first paragraph that starts with quote, if any.
    for (let i = 0; i < paragraphTexts.length; i++) {
      if (normalize(paragraphTexts[i]).startsWith(normQuote)) {
        return i;
      }
    }
  }

  // 3. Else return min(para, paragraphTexts.length - 1).
  return Math.max(0, Math.min(p, paragraphTexts.length - 1));
}

module.exports = { resolveParagraph, normalize };

if (typeof window !== 'undefined') {
  window.resolveParagraph = resolveParagraph;
}
