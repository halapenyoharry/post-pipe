// Lexical evidence that two terms are the same concept. No semantics, just spelling structure.
import { jaroWinkler, orderPair } from '../similarity.js';

const SUFFIXES = /^(er|ers|or|ors|ly|ion|ions|ment|ments|ness|ity|al|ial|ic|ist|ists|ism|ize|ise|ful|less|able|ible|ous|ive|ee|ed|en)$/;

// true when one label is the other plus an ordinary derivational suffix (trade -> trader)
function derivation(a, b) {
  const [s, l] = a.length <= b.length ? [a, b] : [b, a];
  const bases = s.endsWith('e') ? [s, s.slice(0, -1)] : [s]; // trade -> trader (trad + er)
  return bases.some((base) => l.startsWith(base) && SUFFIXES.test(l.slice(base.length)));
}

function groupBy(terms, keyFn) {
  const g = new Map();
  for (const t of terms) {
    const k = keyFn(t);
    if (!k) continue;
    if (!g.has(k)) g.set(k, []);
    g.get(k).push(t);
  }
  return g;
}

export function lexicalSignals(corpus, caps) {
  const out = [];
  const terms = [...corpus.terms.values()].sort((a, b) => (a.norm < b.norm ? -1 : 1));

  for (const [key, group] of groupBy(terms, (t) => t.skey)) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const [a, b] = orderPair(group[i].norm, group[j].norm);
        out.push({ a, b, signal: 'stem', score: caps.stem, why: `same stem sequence "${key}"` });
      }
    }
  }

  for (const [key, group] of groupBy(terms, (t) => t.tkey)) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        if (group[i].skey === group[j].skey) continue; // already a stem match
        const [a, b] = orderPair(group[i].norm, group[j].norm);
        out.push({ a, b, signal: 'tokenset', score: caps.tokenset, why: `same words in different order "${key}"` });
      }
    }
  }

  // typo-grade similarity, blocked by first letter so this stays near-linear
  // Short words need a tighter bar ("labor"/"labour" is a spelling variant), and a plain derivational
  // suffix ("trade"/"trader", "print"/"printer") is a different word, not a misspelling.
  const long = terms.filter((t) => t.norm.length >= 5 && !/\d/.test(t.norm));
  for (const group of groupBy(long, (t) => t.norm[0]).values()) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const x = group[i];
        const y = group[j];
        if (x.skey === y.skey || x.tkey === y.tkey) continue;
        const lenDiff = Math.abs(x.norm.length - y.norm.length);
        const short = Math.min(x.norm.length, y.norm.length) < 7;
        if (lenDiff > (short ? 1 : 3)) continue;
        if (x.tokens.length !== y.tokens.length) continue;
        if (derivation(x.norm, y.norm)) continue;
        const jw = jaroWinkler(x.norm, y.norm);
        if (jw < (short ? 0.945 : 0.92)) continue;
        const [a, b] = orderPair(x.norm, y.norm);
        out.push({ a, b, signal: 'edit', score: caps.edit * (0.5 + (0.5 * (jw - 0.92)) / 0.08), why: `spelling similarity ${jw.toFixed(3)}` });
      }
    }
  }
  return out;
}
