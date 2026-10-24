// Decode the HTML character references a feed leaves in its text fields.
//
// A feed's <title> and <description> often arrive escaped twice: once for
// XML, once for HTML, so after the XML parser is done "isn&#039;t" is still
// in the string. These fields are shown as text (a card label, the reader's
// heading, a summary), so the entities are decoded once, at ingest, in the
// adapter. content_html is not decoded: it is HTML and its entities belong
// to it.
//
// One pass over the string, so an entity that was itself escaped
// ("&amp;lt;") decodes to the entity text ("&lt;"), not to "<".

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ndash: '–', mdash: '—', hellip: '…',
  lsquo: '‘', rsquo: '’', sbquo: '‚',
  ldquo: '“', rdquo: '”', bdquo: '„',
  laquo: '«', raquo: '»', bull: '•', middot: '·',
  copy: '©', reg: '®', trade: '™', deg: '°',
  euro: '€', pound: '£', cent: '¢', yen: '¥',
  times: '×', divide: '÷', minus: '−', plusmn: '±',
  frac12: '½', frac14: '¼', frac34: '¾',
  sect: '§', para: '¶', dagger: '†', Dagger: '‡',
  prime: '′', Prime: '″', permil: '‰',
  larr: '←', rarr: '→', uarr: '↑', darr: '↓',
  shy: '­', ensp: ' ', emsp: ' ', thinsp: ' ', zwj: '‍', zwnj: '‌',
  iexcl: '¡', iquest: '¿', szlig: 'ß',
  agrave: 'à', aacute: 'á', acirc: 'â', atilde: 'ã', auml: 'ä', aring: 'å', aelig: 'æ',
  ccedil: 'ç', egrave: 'è', eacute: 'é', ecirc: 'ê', euml: 'ë',
  igrave: 'ì', iacute: 'í', icirc: 'î', iuml: 'ï',
  ntilde: 'ñ', ograve: 'ò', oacute: 'ó', ocirc: 'ô', otilde: 'õ', ouml: 'ö', oslash: 'ø',
  ugrave: 'ù', uacute: 'ú', ucirc: 'û', uuml: 'ü', yacute: 'ý', yuml: 'ÿ',
  Agrave: 'À', Aacute: 'Á', Acirc: 'Â', Atilde: 'Ã', Auml: 'Ä', Aring: 'Å', AElig: 'Æ',
  Ccedil: 'Ç', Egrave: 'È', Eacute: 'É', Ecirc: 'Ê', Euml: 'Ë',
  Igrave: 'Ì', Iacute: 'Í', Icirc: 'Î', Iuml: 'Ï',
  Ntilde: 'Ñ', Ograve: 'Ò', Oacute: 'Ó', Ocirc: 'Ô', Otilde: 'Õ', Ouml: 'Ö', Oslash: 'Ø',
  Ugrave: 'Ù', Uacute: 'Ú', Ucirc: 'Û', Uuml: 'Ü', Yacute: 'Ý',
};

const ENTITY = /&(#x[0-9a-f]+|#[0-9]+|[a-z][a-z0-9]*);/gi;

function fromCodePoint(n) {
  // Out of range or a lone surrogate: leave the reference as it was.
  if (!(n > 0 && n <= 0x10ffff) || (n >= 0xd800 && n <= 0xdfff)) return null;
  return String.fromCodePoint(n);
}

function decodeHtmlEntities(text) {
  if (typeof text !== 'string' || text.indexOf('&') === -1) return text;
  return text.replace(ENTITY, (whole, body) => {
    if (body[0] === '#') {
      const hex = body[1] === 'x' || body[1] === 'X';
      const n = parseInt(body.slice(hex ? 2 : 1), hex ? 16 : 10);
      const ch = fromCodePoint(n);
      return ch === null ? whole : ch;
    }
    if (Object.prototype.hasOwnProperty.call(NAMED, body)) return NAMED[body];
    return whole;
  });
}

module.exports = { decodeHtmlEntities };
