// What the reader shows above the text: an optional small line (the kicker),
// the title as the heading, and an optional byline beside the title.
//
// settings.reader.header:
//   kicker  — a list of parts joined with `separator` (default " — "), e.g.
//             ["Chapter {N_words}", "{book}", "by {author}"]. A part whose
//             token has no value for this piece is left out, so a piece with
//             no chapter number loses only "Chapter …". A plain string is one
//             part. Default: none.
//   byline  — "by <author>" under the title. Default true.
//
// Tokens: {n} the piece's number (series_part), {n_words} that number in
// words ("twenty-one"), {N_words} the same capitalized ("Twenty-one"),
// {book} settings.site.title, {author} the author's display name, {title}.

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function numberToLowercaseWords(num) {
  const n = parseInt(num, 10);
  if (isNaN(n) || n < 0 || n > 99) return String(num);
  if (n < 20) return ONES[n];
  const rem = n % 10;
  return TENS[Math.floor(n / 10)] + (rem ? `-${ONES[rem]}` : '');
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function headerTokens(settings, article) {
  const n = article && article.series_part != null && article.series_part !== '' ? article.series_part : null;
  const author = (settings && settings.author && (settings.author.display || settings.author.name)) || '';
  return {
    n: n == null ? '' : String(n),
    n_words: n == null ? '' : numberToLowercaseWords(n),
    N_words: n == null ? '' : capitalize(numberToLowercaseWords(n)),
    book: (settings && settings.site && settings.site.title) || '',
    author,
    title: (article && (article.title || article.label)) || '',
  };
}

function fillPart(part, tokens) {
  let missing = false;
  const out = String(part).replace(/\{(\w+)\}/g, (_, key) => {
    const v = tokens[key];
    if (v == null || v === '') { missing = true; return ''; }
    return v;
  });
  return missing ? null : out.trim();
}

function readerHeader(settings, article) {
  const cfg = (settings && settings.reader && settings.reader.header) || {};
  const tokens = headerTokens(settings, article);
  let kicker = null;
  if (cfg.kicker) {
    const parts = (Array.isArray(cfg.kicker) ? cfg.kicker : [cfg.kicker])
      .map((p) => fillPart(p, tokens))
      .filter(Boolean);
    if (parts.length) kicker = parts.join(cfg.separator != null ? cfg.separator : ' — ');
  }
  return { kicker, byline: cfg.byline !== false };
}

module.exports = { readerHeader, numberToLowercaseWords };
