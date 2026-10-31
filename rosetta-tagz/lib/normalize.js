// Label normalization. Pure functions, no I/O, no dependencies.
// A tag's identity at the lowest level is its `norm` key: case-folded,
// accent-folded, punctuation-collapsed. Everything above (stems, token sets,
// acronyms) is derived from it.

export const STOP = new Set([
  'a', 'an', 'the', 'of', 'and', 'or', 'in', 'on', 'for', 'to', 'with', 'as', 'at', 'by', 'vs', 'is',
]);

const IRREGULAR = new Map([
  ['people', 'person'], ['children', 'child'], ['men', 'man'], ['women', 'woman'],
  ['analyses', 'analysis'], ['theses', 'thesis'], ['phenomena', 'phenomenon'],
  ['criteria', 'criterion'], ['lives', 'life'], ['knives', 'knife'],
]);

const KEEP_FINAL_S = new Set(['news', 'series', 'species', 'lens', 'chaos', 'bias', 'canvas', 'atlas']);

const SYMBOL_WORDS = [
  [/c\+\+/gi, ' cpp '],
  [/c#/gi, ' csharp '],
  [/f#/gi, ' fsharp '],
  [/&/g, ' and '],
];

function undouble(w) {
  const n = w.length;
  if (n > 2 && w[n - 1] === w[n - 2] && !'aeiouylsz'.includes(w[n - 1])) return w.slice(0, -1);
  return w;
}

// Conservative English stemmer. Not Porter: it only needs to make
// system/systems, thinking/think, categories/category, make/making agree.
export function stem(tok) {
  if (tok.length <= 3 || /^\d+$/.test(tok)) return tok;
  let w = tok;
  const irregular = IRREGULAR.get(w);
  if (irregular) {
    w = irregular;
  } else if (!KEEP_FINAL_S.has(w) && !/(ss|us|is|ics|ous)$/.test(w)) {
    if (/ies$/.test(w) && w.length > 4) w = w.slice(0, -3) + 'y';
    else if (/(sses|xes|ches|shes|zes)$/.test(w)) w = w.slice(0, -2);
    else if (/s$/.test(w)) w = w.slice(0, -1);
  }
  if (w.length > 5 && w.endsWith('ing')) w = undouble(w.slice(0, -3));
  else if (w.length > 4 && w.endsWith('ed')) w = undouble(w.slice(0, -2));
  if (w.length > 3 && w.endsWith('e')) w = w.slice(0, -1);
  if (w.length > 2 && w.endsWith('y')) w = w.slice(0, -1) + 'i';
  return w;
}

export function foldDiacritics(s) {
  return s.normalize('NFD').replace(/\p{M}+/gu, '');
}

// "A.I." -> "AI", "U.S." -> "US"
function collapseDottedInitialisms(s) {
  return s.replace(/\b(?:\p{L}\.){2,}/gu, (m) => m.replace(/\./g, ''));
}

export function normalizeLabel(raw) {
  let s = String(raw ?? '').normalize('NFKC').trim().replace(/^#+/, '');
  s = collapseDottedInitialisms(s);
  for (const [re, rep] of SYMBOL_WORDS) s = s.replace(re, rep);
  s = foldDiacritics(s);
  s = s.replace(/([a-z])([A-Z])/g, '$1 $2'); // camelCase -> camel Case
  s = s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
  const tokens = s ? s.split(' ') : [];
  const content = tokens.filter((t) => !STOP.has(t));
  const base = content.length ? content : tokens;
  const stems = base.map(stem);
  return {
    raw: String(raw ?? ''),
    norm: tokens.join(' '),
    tokens,
    content: base,
    stems,
    skey: stems.join(' '),
    tkey: [...new Set(stems)].sort().join(' '),
  };
}

// Looks like an initialism as written: "AI", "NDT", "A.I.", "LLM"
export function looksLikeAcronym(raw) {
  const t = String(raw ?? '').replace(/[.\s]/g, '');
  return /^[A-Z][A-Z0-9]{1,5}$/.test(t);
}

// Initials of the content tokens of a multi-word label: "artificial intelligence" -> "ai"
export function initials(content) {
  return content.length >= 2 ? content.map((t) => t[0]).join('') : '';
}

export function slugify(norm) {
  const s = norm.replace(/\s+/g, '_').replace(/[^\p{L}\p{N}_]/gu, '');
  return s || 'x' + [...norm].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7).toString(36);
}
