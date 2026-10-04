// Text profiling: tokenize item text, build TF-IDF profiles for tags and concepts.
// Deterministic and offline. This is the "distributional" evidence the stone uses
// to say "these two tags are used about the same things" without any model.
import fs from 'node:fs';
import { foldDiacritics, stem } from './normalize.js';
import { normalize, topK } from './similarity.js';

export const STOPWORDS = new Set(`a about above after again against all also am an and any are as at be because been before being below
between both but by can could did do does doing down during each few for from further had has have having he her here hers herself him
himself his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other our ours ourselves
out over own same she should so some such than that the their theirs them themselves then there these they this those through to too
under until up very was we were what when where which while who whom why will with would you your yours yourself yourselves new one two
may might many much said says say use used using get got make made like also even still way well first last year years week day today
according including however while among within without across around often often per via new study studies people
researchers researcher scientists scientist found finds find reveal reveals revealed show shows showed shown help helps helped suggest suggests suggested
discover discovers discovered potentially surprising unexpected breakthrough known unknown early recent latest could would may more less`.split(/\s+/));

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '\u2019', lsquo: '\u2018', rdquo: '\u201d', ldquo: '\u201c', mdash: '\u2014', ndash: '\u2013', hellip: '\u2026' };

export function decodeEntities(s) {
  return String(s ?? '')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m);
}

// Generic words (shipped data, one place to edit): common verbs, adverbs, quantifiers, time words.
// They are stopwords for topic purposes: never a discovered tag, and they carry no profile weight.
for (const line of fs.readFileSync(new URL('../seed/generic-words.txt', import.meta.url), 'utf8').split('\n')) {
  if (line.startsWith('#')) continue;
  for (const w of line.split(/\s+/)) if (w) STOPWORDS.add(w);
}

export function stripHtml(html) {
  return decodeEntities(
    String(html ?? '')
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

export function words(text) {
  return foldDiacritics(String(text ?? '').normalize('NFKC'))
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .split(' ')
    .filter(Boolean);
}

// stems of content words; used for TF-IDF profiles
export function profileTokens(text) {
  const out = [];
  for (const w of words(text)) {
    if (w.length < 3 || /^\d+$/.test(w) || STOPWORDS.has(w)) continue;
    out.push(stem(w));
  }
  return out;
}

export function itemText(item) {
  return `${item.title ?? ''} ${item.title ?? ''} ${item.text ?? ''}`;
}

// Map<itemKey, Map<stem, tf>>
export function buildItemVectors(items) {
  const vecs = new Map();
  for (const item of items.values()) {
    const tf = new Map();
    for (const t of profileTokens(itemText(item))) tf.set(t, (tf.get(t) ?? 0) + 1);
    vecs.set(item.key, tf);
  }
  return vecs;
}

export function buildIdf(itemVectors) {
  const df = new Map();
  for (const tf of itemVectors.values()) for (const t of tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const N = itemVectors.size || 1;
  const idf = new Map();
  for (const [t, d] of df) idf.set(t, Math.log((N + 1) / (d + 1)) + 1);
  return idf;
}

// L2-normalised TF-IDF profile for a set of items
export function profileFor(itemKeys, itemVectors, idf) {
  const acc = new Map();
  for (const key of itemKeys) {
    const tf = itemVectors.get(key);
    if (!tf) continue;
    let len = 0;
    for (const c of tf.values()) len += c;
    for (const [t, c] of tf) acc.set(t, (acc.get(t) ?? 0) + (c / (len || 1)) * (idf.get(t) ?? 1));
  }
  return normalize(acc);
}

// candidate pairs among profiles that share at least one strong feature.
// profiles: Map<id, Map<feature, weight>>
export function candidatePairs(profiles, { topFeatures = 14, maxPosting = 400 } = {}) {
  const postings = new Map();
  for (const [id, vec] of profiles) {
    for (const [f] of topK(vec, topFeatures)) {
      if (!postings.has(f)) postings.set(f, []);
      postings.get(f).push(id);
    }
  }
  const seen = new Set();
  const pairs = [];
  for (const ids of postings.values()) {
    if (ids.length > maxPosting) continue;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const [a, b] = ids[i] < ids[j] ? [ids[i], ids[j]] : [ids[j], ids[i]];
        const key = `${a}\u0000${b}`;
        if (seen.has(key)) continue;
        seen.add(key);
        pairs.push([a, b]);
      }
    }
  }
  return pairs;
}
