// "ai" <-> "artificial intelligence", "ml" <-> "machine learning".
// Acronyms are ambiguous (AI could also be "art installation"), so this signal is
// deliberately weak alone and needs corroboration from text or curated evidence.
import { initials } from '../normalize.js';
import { orderPair } from '../similarity.js';

export function acronymSignals(corpus, caps) {
  const byInitials = new Map();
  for (const t of corpus.terms.values()) {
    if (t.content.length < 2 || t.content.length > 6) continue;
    const key = initials(t.content);
    if (!byInitials.has(key)) byInitials.set(key, []);
    byInitials.get(key).push(t);
  }
  const out = [];
  for (const t of corpus.terms.values()) {
    if (t.tokens.length !== 1 || t.norm.length < 2 || t.norm.length > 6 || !/^[a-z]+$/.test(t.norm)) continue;
    for (const full of byInitials.get(t.norm) ?? []) {
      if (full.norm === t.norm) continue;
      if (full.tokens.includes(t.norm)) continue; // "ai infrastructure" contains "ai"; it is not what "ai" abbreviates
      const [a, b] = orderPair(t.norm, full.norm);
      out.push({ a, b, signal: 'acronym', score: caps.acronym, why: `"${t.norm}" are the initials of "${full.norm}"` });
    }
  }
  return out;
}
