// Discovery: propose NEW tags from phrases that recur in the corpus, so that items in a tag-system
// that shares no vocabulary with the others (a news wire with no categories) still get connected.
// `emerge` can only name concepts the stone already knows; this finds topics it does not.
//
// A phrase becomes a hub only if it is
//   recurring    in at least two distinct items (otherwise it connects nothing)
//   distinctive  not on a large share of all items
//   coherent     the items sharing it are about the same thing EVEN WITH THE PHRASE REMOVED.
//                "help explain" appears in unrelated articles (incoherent, rejected);
//                "quantum" appears in articles that also share "computing", "qubits" (kept).
// Selected hubs are attached to every item containing them, tagged items included, so the wire
// bridges into your own vocabulary. No model: document frequency and TF-IDF only.
//
// Output tags have origin "discovered". rtz-stone treats them as ordinary evidence, so a discovered
// "climate change" can fold into "Climate Change" from an editorial system.
import { stem, STOP } from './normalize.js';
import { words, STOPWORDS, buildItemVectors, buildIdf } from './text.js';
import { normalize, dot } from './similarity.js';
import { loadCorpus, entitySet } from './corpus.js';
import { makeConfig } from './config.js';

const ok = (w) => w.length >= 4 && !STOPWORDS.has(w) && !STOP.has(w) && !/^\d+$/.test(w);

// contiguous unigram/bigram candidates, never spanning punctuation
function candidates(item) {
  const text = `${item.title}. ${item.title}. ${item.text}`;
  const found = new Map(); // stemKey -> {tf, surface}
  const bump = (key, surface) => {
    const f = found.get(key) ?? { tf: 0, surface };
    f.tf += 1;
    found.set(key, f);
  };
  for (const chunk of text.split(/[.,;:!?()[\]{}"“”—–]+/)) {
    const ws = words(chunk);
    for (let i = 0; i < ws.length; i++) {
      if (!ok(ws[i])) continue;
      bump(stem(ws[i]), ws[i]);
      if (i + 1 < ws.length && ok(ws[i + 1])) bump(`${stem(ws[i])} ${stem(ws[i + 1])}`, `${ws[i]} ${ws[i + 1]}`);
    }
  }
  return found;
}

function withoutPhrase(tf, idf, drop) {
  const v = new Map();
  for (const [t, c] of tf) if (!drop.has(t)) v.set(t, c * (idf.get(t) ?? 1));
  return normalize(v);
}

export function discover(records, cfg = makeConfig()) {
  const D = cfg.discover;
  const corpus = loadCorpus(records);
  const reps = [...corpus.items.values()].filter((it) => (corpus.canonItem.get(it.key) ?? it.key) === it.key).sort((a, b) => (a.key < b.key ? -1 : 1));
  const N = reps.length || 1;
  const perItem = new Map(reps.map((it) => [it.key, candidates(it)]));
  const vecs = buildItemVectors(corpus.items);
  const idf = buildIdf(vecs);

  const tagged = new Set();
  for (const t of corpus.terms.values()) for (const k of entitySet(corpus, t.items)) tagged.add(k);

  const df = new Map();
  const containing = new Map(); // stemKey -> item keys
  const surface = new Map();
  for (const it of reps) {
    for (const [key, f] of perItem.get(it.key)) {
      df.set(key, (df.get(key) ?? 0) + 1);
      if (!containing.has(key)) containing.set(key, []);
      containing.get(key).push(it.key);
      if (!surface.has(key)) surface.set(key, new Map());
      surface.get(key).set(f.surface, (surface.get(key).get(f.surface) ?? 0) + f.tf);
    }
  }
  const label = (key) => [...surface.get(key).entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0][0];

  // baseline: how alike two unrelated items are in this corpus (deterministic sample of pairs)
  let base = 0;
  let pairs = 0;
  for (let i = 0; i < Math.min(N, 400); i++) {
    const a = reps[i % N];
    const b = reps[(i * 7 + 3) % N];
    if (a.key === b.key) continue;
    base += dot(withoutPhrase(vecs.get(a.key), idf, new Set()), withoutPhrase(vecs.get(b.key), idf, new Set()));
    pairs += 1;
  }
  const threshold = Math.max(D.minCoherence, D.coherenceRatio * (pairs ? base / pairs : 0));

  const coherent = (key) => {
    const drop = new Set(key.split(' '));
    const keys = containing.get(key).slice(0, 25);
    const vs = keys.map((k) => withoutPhrase(vecs.get(k), idf, drop));
    let sum = 0;
    let n = 0;
    for (let i = 0; i < vs.length; i++) for (let j = i + 1; j < vs.length; j++) {
      sum += dot(vs[i], vs[j]);
      n += 1;
    }
    return n ? sum / n : 0;
  };

  const usable = new Map(); // stemKey -> coherence
  for (const [key, d] of df) {
    if (d < D.minDf || d / N > D.maxDfRatio) continue;
    const c = coherent(key);
    if (c >= threshold) usable.set(key, c);
  }

  const score = (key, f) => (1 + Math.log(f.tf)) * Math.log(N / df.get(key)) * (key.includes(' ') ? D.bigramBoost : 1) * (1 + usable.get(key));

  // hubs are chosen from the orphans' point of view...
  const hubs = new Set();
  const pick = (cands, limit) => {
    const chosen = [];
    for (const c of cands) {
      if (chosen.length >= limit) break;
      const parts = c.key.split(' ');
      if (parts.length === 1 && chosen.some((p) => p.key.split(' ').includes(c.key) && df.get(p.key) >= 0.6 * df.get(c.key))) continue;
      if (parts.length === 2) {
        const i = chosen.findIndex((p) => parts.includes(p.key) && df.get(c.key) >= 0.6 * df.get(p.key));
        if (i >= 0) chosen.splice(i, 1);
      }
      chosen.push(c);
    }
    return chosen;
  };
  const ranked = (it, only) =>
    [...perItem.get(it.key).entries()]
      .filter(([key]) => usable.has(key) && (!only || only.has(key)))
      .map(([key, f]) => ({ key, tf: f.tf, score: score(key, f) }))
      .sort((a, b) => b.score - a.score || (a.key < b.key ? -1 : 1));

  for (const it of reps) if (!tagged.has(it.key) || D.taggedToo) for (const c of pick(ranked(it), D.perItem)) hubs.add(c.key);

  // ...then attached to every item that contains them, tagged ones included (bridges)
  const out = [];
  for (const it of reps) {
    const isOrphan = !tagged.has(it.key);
    if (!isOrphan && !D.taggedToo && !D.bridgeTagged) continue;
    for (const c of pick(ranked(it, hubs), isOrphan ? D.perItem : D.perTaggedItem)) {
      out.push({
        type: 'tag',
        source: it.source,
        item: it.id,
        label: label(c.key),
        weight: Number(Math.min(0.6, D.weight + 0.05 * Math.min(4, c.tf)).toFixed(3)),
        origin: 'discovered',
        why: `recurs in ${df.get(c.key)} of ${N} items, which stay alike without it (${usable.get(c.key).toFixed(2)})${c.tf > 1 ? `; ${c.tf}× here` : ''}`,
      });
    }
  }
  return out;
}
