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
//                ...and more alike than their sources alone make them. Items of one source can be
//                alike anyway (long investigative articles share a newsroom's vocabulary), so a word
//                spread over them ("instead", "role") inherits the source's likeness. The expected
//                likeness is measured for the same mix of sources: for each pair of the phrase's
//                items, the mean cosine between items of those two sources that do not both hold
//                the phrase, averaged over the same item pairs the coherence is taken over.
// Selected hubs are attached to every item containing them, tagged items included, so the wire
// bridges into your own vocabulary. The per-item cap governs which hubs are chosen, never where a
// chosen hub lands: a hub justified by n items is asserted on those n items, and its `why` says n.
// No model: document frequency and TF-IDF only.
//
// Output tags have origin "discovered". rtz-stone treats them as ordinary evidence, so a discovered
// "climate change" can fold into "Climate Change" from an editorial system. Each record carries its
// provenance: wasDerivedFrom (the phrase in this item's text, how often, whether in the title) and
// wasGeneratedBy (this stage and the parameters that admitted the hub).
import { stem, STOP } from './normalize.js';
import { words, STOPWORDS, buildItemVectors, buildIdf } from './text.js';
import { normalize, dot } from './similarity.js';
import { loadCorpus, entitySet } from './corpus.js';
import { makeConfig } from './config.js';

const ok = (w) => w.length >= 4 && !STOPWORDS.has(w) && !STOP.has(w) && !/^\d+$/.test(w);
const BASELINE_PAIRS = 400; // item pairs sampled per baseline: the corpus-wide one, and each pair of sources

// the pairs [a, b] with a in as, b in bs, a !== b: all of them, or `cap` spread evenly over them in a
// fixed order, so the sample is deterministic
function samplePairs(as, bs, cap) {
  const total = as.length * bs.length;
  const take = Math.min(total, cap);
  const out = [];
  for (let m = 0; m < take; m++) {
    const idx = Math.floor((m * total) / take);
    const a = as[Math.floor(idx / bs.length)];
    const b = bs[idx % bs.length];
    if (a !== b) out.push([a, b]);
  }
  return out;
}

// contiguous unigram/bigram candidates, never spanning punctuation
function scan(text, onKey) {
  for (const chunk of text.split(/[.,;:!?()[\]{}"“”—–]+/)) {
    const ws = words(chunk);
    for (let i = 0; i < ws.length; i++) {
      if (!ok(ws[i])) continue;
      onKey(stem(ws[i]), ws[i]);
      if (i + 1 < ws.length && ok(ws[i + 1])) onKey(`${stem(ws[i])} ${stem(ws[i + 1])}`, `${ws[i]} ${ws[i + 1]}`);
    }
  }
}

// the title counts twice in tf; a separate pass over the title alone records which keys it holds
function candidates(item) {
  const found = new Map(); // stemKey -> {tf, surface, inTitle}
  scan(`${item.title}. ${item.title}. ${item.text}`, (key, surface) => {
    const f = found.get(key) ?? { tf: 0, surface, inTitle: false };
    f.tf += 1;
    found.set(key, f);
  });
  scan(item.title, (key) => {
    const f = found.get(key);
    if (f) f.inTitle = true;
  });
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

  const full = new Map(reps.map((it) => [it.key, withoutPhrase(vecs.get(it.key), idf, new Set())]));
  const sim = (a, b) => dot(full.get(a), full.get(b));

  // baseline: how alike two unrelated items are in this corpus (deterministic sample of pairs)
  let base = 0;
  let pairs = 0;
  for (let i = 0; i < Math.min(N, BASELINE_PAIRS); i++) {
    const a = reps[i % N];
    const b = reps[(i * 7 + 3) % N];
    if (a.key === b.key) continue;
    base += sim(a.key, b.key);
    pairs += 1;
  }
  const corpusBase = pairs ? base / pairs : 0;
  const threshold = Math.max(D.minCoherence, D.coherenceRatio * corpusBase);

  // the same, per pair of sources: a fixed sample of item pairs, one from each source, with their likeness
  const sourceOf = new Map(reps.map((it) => [it.key, it.source]));
  const bySource = new Map();
  for (const it of reps) {
    if (!bySource.has(it.source)) bySource.set(it.source, []);
    bySource.get(it.source).push(it.key);
  }
  const blockKey = (s, t) => (s < t ? `${s}\u0000${t}` : `${t}\u0000${s}`);
  const blocks = new Map(); // blockKey -> [[a, b, likeness]]
  const block = (s, t) => {
    const k = blockKey(s, t);
    if (!blocks.has(k)) {
      const [lo, hi] = s < t ? [s, t] : [t, s];
      blocks.set(k, samplePairs(bySource.get(lo), bySource.get(hi), BASELINE_PAIRS).map(([a, b]) => [a, b, sim(a, b)]));
    }
    return blocks.get(k);
  };

  // the items coherence is measured over (the first 25 containing the phrase, in item order)
  const sample = (key) => containing.get(key).slice(0, 25);

  // what coherence the phrase's items would have from their sources alone: the mean, over the same
  // item pairs, of how alike items of those two sources are when they do NOT share the phrase (its
  // own pairs are what is being tested, so they are left out of the comparison). A pair of sources
  // with no such pair to compare with falls back to the corpus-wide baseline.
  const expected = (key) => {
    const carriers = new Set(containing.get(key));
    const memo = new Map();
    const pairBase = (s, t) => {
      const k = blockKey(s, t);
      if (!memo.has(k)) {
        let sum = 0;
        let n = 0;
        for (const [a, b, v] of block(s, t)) if (!(carriers.has(a) && carriers.has(b))) {
          sum += v;
          n += 1;
        }
        memo.set(k, n ? sum / n : corpusBase);
      }
      return memo.get(k);
    };
    const keys = sample(key);
    let sum = 0;
    let n = 0;
    for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
      sum += pairBase(sourceOf.get(keys[i]), sourceOf.get(keys[j]));
      n += 1;
    }
    return n ? sum / n : 0;
  };

  const coherent = (key) => {
    const drop = new Set(key.split(' '));
    const keys = sample(key);
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
  const sourceBaseline = new Map(); // stemKey -> the coherence its items' sources alone would give
  for (const [key, d] of df) {
    if (d < D.minDf || d / N > D.maxDfRatio) continue;
    const c = coherent(key);
    if (c < threshold) continue;
    const e = expected(key);
    if (c < D.sourceCoherenceRatio * e) continue;
    usable.set(key, c);
    sourceBaseline.set(key, e);
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

  // ...then every hub is attached to every item that contains it: untagged items always, tagged ones
  // when the site bridges. No cap here; the cap governed selection. A hub that lands on fewer than
  // minDf items would connect nothing and is dropped.
  const attached = new Map(); // hub key -> [{it, f}] in item order
  for (const it of reps) {
    if (tagged.has(it.key) && !D.taggedToo && !D.bridgeTagged) continue;
    const cands = perItem.get(it.key);
    for (const key of hubs) {
      const f = cands.get(key);
      if (!f) continue;
      if (!attached.has(key)) attached.set(key, []);
      attached.get(key).push({ it, f });
    }
  }

  // output is grouped by hub in label order (the label is what a reader sees; two stem keys may
  // sort differently from their labels), then by item
  const byLabel = (a, b) => {
    const la = label(a);
    const lb = label(b);
    return la < lb ? -1 : la > lb ? 1 : a < b ? -1 : 1;
  };
  const out = [];
  for (const key of [...attached.keys()].sort(byLabel)) {
    const carriers = attached.get(key);
    const n = carriers.length;
    if (n < D.minDf) continue;
    const coherence = usable.get(key);
    const baseline = sourceBaseline.get(key);
    const lift = baseline > 0 ? `, ${(coherence / baseline).toFixed(1)}× the ${baseline.toFixed(3)} that items from the same sources share` : '';
    for (const { it, f } of carriers) {
      out.push({
        type: 'tag',
        source: it.source,
        item: it.id,
        label: label(key),
        weight: Number(Math.min(0.6, D.weight + 0.05 * Math.min(4, f.tf)).toFixed(3)),
        origin: 'discovered',
        why: `recurs in ${n} of ${N} items, which stay alike without it (${coherence.toFixed(2)}${lift})${f.tf > 1 ? `; ${f.tf}× here` : ''}`,
        wasDerivedFrom: [{ type: 'text', phrase: f.surface, count: f.tf, inTitle: f.inTitle }],
        wasGeneratedBy: {
          activity: 'discover',
          parameters: {
            minDf: D.minDf,
            maxDfRatio: D.maxDfRatio,
            perItem: D.perItem,
            sourceCoherenceRatio: D.sourceCoherenceRatio,
            df: df.get(key),
            items: n,
            coherence: Number(coherence.toFixed(3)),
            sourceBaseline: Number(baseline.toFixed(3)),
          },
        },
      });
    }
  }
  return out;
}
