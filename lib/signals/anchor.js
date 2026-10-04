// Instance-based alignment: when the SAME item shows up in two tag-systems
// (same URL, or same long title), the tags each system gave it are candidate translations
// of each other. This is the closest thing to a literal Rosetta stone: one text, two scripts.
//
// One shared item with 3 tags on one side and 2 on the other supports each of the 6 pairings
// only weakly (1/3 each). Evidence accumulates across shared items: S = sum of 1/max(kA,kB).
// score = cap * S / (S + 0.5), so two clean 1-to-1 items are enough to merge, one noisy item is not.
import { normalizeLabel } from '../normalize.js';
import { orderPair } from '../similarity.js';

export function canonicalUrl(url) {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, '')}${u.pathname.replace(/\/+$/, '')}`.toLowerCase();
  } catch {
    return '';
  }
}

export function itemIdentity(item) {
  const u = canonicalUrl(item.url);
  if (u) return `url:${u}`;
  const t = normalizeLabel(item.title).norm;
  return t.length >= 24 ? `title:${t}` : '';
}

export function anchorSignals(corpus, caps) {
  const groups = new Map();
  for (const item of corpus.items.values()) {
    const id = itemIdentity(item);
    if (!id) continue;
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(item);
  }

  const termsOf = new Map(); // itemKey -> Set<norm>
  for (const t of corpus.terms.values()) {
    for (const key of t.items) {
      if (!termsOf.has(key)) termsOf.set(key, new Set());
      termsOf.get(key).add(t.norm);
    }
  }

  const mass = new Map(); // "a\0b" -> S
  const shared = new Map(); // "a\0b" -> number of shared items
  for (const members of groups.values()) {
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        if (members[i].source === members[j].source) continue;
        const A = termsOf.get(members[i].key) ?? new Set();
        const B = termsOf.get(members[j].key) ?? new Set();
        if (!A.size || !B.size) continue;
        const m = 1 / Math.max(A.size, B.size);
        for (const x of A) {
          for (const y of B) {
            if (x === y) continue;
            const [a, b] = orderPair(x, y);
            const k = `${a}\u0000${b}`;
            mass.set(k, (mass.get(k) ?? 0) + m);
            shared.set(k, (shared.get(k) ?? 0) + 1);
          }
        }
      }
    }
  }

  const out = [];
  for (const [k, S] of mass) {
    const [a, b] = k.split('\u0000');
    out.push({ a, b, signal: 'anchor', score: caps.anchor * (S / (S + 0.5)), why: `tagged the same ${shared.get(k)} item(s) in different systems (evidence ${S.toFixed(2)})` });
  }
  return out;
}
