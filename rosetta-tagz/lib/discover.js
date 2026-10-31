// Discovery: propose NEW tags from phrases that recur in the corpus, so that items in a tag-system
// that shares no vocabulary with the others (a news wire with no categories) still get connected.
// `emerge` can only name concepts stone.json already holds; this finds topics it does not.
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
//                Its measured multiple, `sourceRatio` (coherence / that expected likeness), is on every
//                record, so a viewer can try another bar than `sourceCoherenceRatio` without a rebuild.
// Near-copies count once. Two items that stay alike even without the few words they share most (the
// same story in two articles, not two articles on one topic) are not two pieces of evidence: when a
// phrase's df, the item count and the coherence and source likeness are measured, each group of
// near-copies is one item. The hub is still attached to every copy, and `why` still counts the items
// it lands on. How pairs make groups is `nearCopyGrouping`: "all-pairs" (every two items of a group are
// near-copies) or "chain" (any near-copy pair joins two groups); see nearCopyGroups below.
// Below the bar, down to `sourceRatioFloor`, hubs are chosen in a second pass after the first, from
// the slots the first pass left, so they never take a slot from (or change) a hub at or above it.
// Selected hubs are attached to every item containing them, tagged items included, so the wire
// bridges into your own vocabulary. The per-item cap governs which hubs are chosen, never where a
// chosen hub lands: a hub justified by n items is asserted on those n items, and its `why` says n.
// No model: document frequency and TF-IDF only.
//
// Output tags have origin "discovered". rtz-stone treats them as ordinary evidence, so a discovered
// "climate change" can fold into "Climate Change" from an editorial system. Each record carries its
// provenance: wasDerivedFrom (the phrase in this item's text, how often, whether in the title) and
// wasGeneratedBy (this stage and the parameters that admitted the hub).
//
// Spellings (since 2026-10-31). A label is never invented: a hub's label, and the phrase in each
// record's wasDerivedFrom, is a spelling the text has, hyphen, capitals and accents as written
// ("energy-efficient", "Jupiter"). Counting and matching still use the normalized key, so nothing a
// spelling could change is measured on it; the spelling is chosen at the end, in two steps:
//   form      the hub's lower-case form ("energy efficient"), chosen exactly as the label was before:
//             each item's tf goes to the form it wrote first, the most tf wins, ties in code-point
//             order. So the hub stays the same term downstream.
//   spelling  the way the text writes that form most often, each place it is written counting once.
//             A capital that position can explain says nothing about the word: an occurrence in a
//             title, or at the start of a sentence, whose spelling has a capital is "styled", and
//             styled occurrences vote only when the text writes the form nowhere else. A spelling
//             without capitals is never styled. Ties go to a spelling in lower case, then to the one
//             met first (items in key order, then title before text, left to right).
// A record's phrase is chosen the same way among its own item's occurrences of the form it wrote
// first. A phrase none of whose occurrences reads, on its own, as what it was counted as (normalization
// that depends on the neighbours, a Greek final sigma before an apostrophe; English text has none) is
// not a candidate, so every label has a spelling.
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

// How alike two unit vectors stay once the k shared words that carry most of their likeness (the
// largest products a_t·b_t) are taken out of both: (d - Σ a_t b_t) / sqrt((1 - Σ a_t²)(1 - Σ b_t²)).
// Two items about one topic share its few words and fall to nothing; a copy of a story shares its
// names, places and details as well, and stays alike.
function likenessBeyond(A, B, d, k) {
  const shared = [];
  const [small, big] = A.size <= B.size ? [A, B] : [B, A];
  for (const [t, x] of small) {
    const y = big.get(t);
    if (y !== undefined) shared.push([t, x, y]);
  }
  shared.sort((p, q) => q[1] * q[2] - p[1] * p[2] || (p[0] < q[0] ? -1 : 1));
  let num = d;
  let ra = 1;
  let rb = 1;
  for (const [, x, y] of shared.slice(0, k)) {
    num -= x * y;
    ra -= x * x;
    rb -= y * y;
  }
  const den = Math.sqrt(Math.max(0, ra) * Math.max(0, rb));
  return den > 1e-9 ? num / den : 0;
}

// The near-copy pairs among the representative items (sorted by key), as [i, j, likeness] with i < j
// indexes into reps. A pair whose cosine reaches `threshold` and still reaches it without its `words`
// strongest shared words is one story told twice; `likeness` is the lower of those two figures, the one
// that had to reach `threshold`. A falsy threshold finds none.
function nearCopyPairs(reps, vec, threshold, words) {
  const pairs = [];
  if (!threshold) return pairs;
  for (let i = 0; i < reps.length; i++) {
    const A = vec.get(reps[i].key);
    for (let j = i + 1; j < reps.length; j++) {
      const B = vec.get(reps[j].key);
      const d = dot(A, B);
      if (d < threshold) continue;
      const beyond = likenessBeyond(A, B, d, words);
      if (beyond < threshold) continue;
      pairs.push([i, j, Math.min(d, beyond)]);
    }
  }
  return pairs;
}

const NEAR_COPY_GROUPINGS = ['all-pairs', 'chain'];

// Near-copy groups: item key -> the group's first key (reps are sorted by key, so that is its smallest).
//   chain      any near-copy pair joins its two groups: the groups are the connected pairs, so a roundup
//              that retells two different stories makes the two stories one item
//   all-pairs  a group holds only items that are each other's near-copies, every pair. Pairs are taken
//              from the most alike down (ties in item order), and a pair joins its two groups only when
//              every item of one is a near-copy of every item of the other. So an item two groups could
//              take joins the group of the item it is most alike to, as long as it is a near-copy of
//              every item already there; the roundup joins one story and the other stays its own item.
function nearCopyGroups(reps, pairs, grouping) {
  const n = reps.length;
  const of = reps.map((_, i) => i); // item index -> group, named by its smallest item index
  const members = reps.map((_, i) => [i]);
  const near = new Set(pairs.map(([i, j]) => i * n + j));
  const isNear = (x, y) => near.has(x < y ? x * n + y : y * n + x);
  const order = grouping === 'chain' ? pairs : [...pairs].sort((p, q) => q[2] - p[2] || p[0] - q[0] || p[1] - q[1]);
  for (const [i, j] of order) {
    const [gi, gj] = of[i] < of[j] ? [of[i], of[j]] : [of[j], of[i]];
    if (gi === gj) continue;
    if (grouping === 'all-pairs' && !members[gi].every((x) => members[gj].every((y) => isNear(x, y)))) continue;
    for (const x of members[gj]) {
      members[gi].push(x);
      of[x] = gi;
    }
    members[gj] = [];
  }
  return new Map(reps.map((it, i) => [it.key, reps[of[i]].key]));
}

// A character of a word as written: a letter, digit or mark, or one that normalization turns into
// letters or digits ("™" reads as "tm"), so that a word read by `words` can be found again in the text.
const LETTER_DIGIT_MARK = /[\p{L}\p{N}\p{M}]/u;
const LETTER_DIGIT = /[\p{L}\p{N}]/u;
const readsAsLetters = new Map();
function inWord(c) {
  if (LETTER_DIGIT_MARK.test(c)) return true;
  if (!readsAsLetters.has(c)) readsAsLetters.set(c, LETTER_DIGIT.test(c.normalize('NFKC')));
  return readsAsLetters.get(c);
}

// Where each word `words(chunk)` reads (`ws`) is written in the chunk: { start, end, n } when one run of
// word characters reads as exactly that word (n counts the words read before it, so two words are
// neighbours in the text when their n are), null when it does not (a run that reads as several words,
// "½" as "1" and "2"). Reading the runs one by one gives `ws` back, except where normalization depends
// on the neighbours (a Greek final sigma before an apostrophe); there only the words both readings
// agree on, in order, keep their places.
function places(chunk, ws) {
  const runs = [];
  let start = -1;
  const close = (end) => {
    const read = words(chunk.slice(start, end));
    for (const w of read) runs.push({ w, at: read.length === 1 ? { start, end, n: runs.length } : null });
    start = -1;
  };
  let i = 0;
  for (const c of chunk) {
    if (inWord(c)) {
      if (start < 0) start = i;
    } else if (start >= 0) close(i);
    i += c.length;
  }
  if (start >= 0) close(i);
  if (runs.length === ws.length && runs.every((x, k) => x.w === ws[k])) return runs.map((x) => x.at);
  // the longest common subsequence of the two readings
  const at = ws.map(() => null);
  if (ws.length * runs.length > 1e6) return at;
  const L = Array.from({ length: ws.length + 1 }, () => new Int32Array(runs.length + 1));
  for (let a = ws.length - 1; a >= 0; a--) {
    for (let b = runs.length - 1; b >= 0; b--) L[a][b] = ws[a] === runs[b].w ? L[a + 1][b + 1] + 1 : Math.max(L[a + 1][b], L[a][b + 1]);
  }
  for (let a = 0, b = 0; a < ws.length && b < runs.length; ) {
    if (ws[a] === runs[b].w) at[a++] = runs[b++].at;
    else if (L[a + 1][b] >= L[a][b + 1]) a++;
    else b++;
  }
  return at;
}

const CHUNKS = /([.,;:!?()[\]{}"“”—–]+)/; // the punctuation a candidate never spans, kept by split
const OPENS = /[.!?:"“([{]/; // after one of these the next word may be capitalized by its position
const CAPITAL = /[\p{Lu}\p{Lt}]/u;

// contiguous unigram/bigram candidates, never spanning punctuation. onKey(key, form, written): the
// stem key, the lower-case form, and how the text writes it, { spelling, styled } (null when it has no
// place). `title`: every spelling with a capital is styled; otherwise only one that begins a sentence.
function scan(text, onKey, title) {
  const parts = text.split(CHUNKS);
  let start = true; // the next word begins a sentence
  for (let p = 0; p < parts.length; p += 2) {
    if (p > 0 && OPENS.test(parts[p - 1])) start = true;
    const chunk = parts[p];
    const ws = words(chunk);
    if (!ws.length) continue;
    const at = places(chunk, ws);
    const written = (a, b) => {
      if (!at[a] || !at[b] || at[b].n - at[a].n !== b - a) return null;
      const spelling = chunk.slice(at[a].start, at[b].end).replace(/\s+/g, ' ');
      return { spelling, styled: (title || (a === 0 && start)) && CAPITAL.test(spelling) };
    };
    for (let i = 0; i < ws.length; i++) {
      if (!ok(ws[i])) continue;
      onKey(stem(ws[i]), ws[i], written(i, i));
      if (i + 1 < ws.length && ok(ws[i + 1])) onKey(`${stem(ws[i])} ${stem(ws[i + 1])}`, `${ws[i]} ${ws[i + 1]}`, written(i, i + 1));
    }
    start = false;
  }
}

// The title counts twice in tf, as if read twice before the text (how it was counted before the
// spellings); `surface` is the form the item writes first, `inTitle` whether the title holds the key,
// and `written` how the item writes it: spelling -> { form, free, styled }, free and styled counting
// the occurrences, the title's once, in the order first met.
function candidates(item) {
  const found = new Map(); // stemKey -> {tf, surface, inTitle, written}
  const visit = (inTitle) => (key, form, w) => {
    const f = found.get(key) ?? { tf: 0, surface: form, inTitle: false, written: new Map() };
    f.tf += inTitle ? 2 : 1;
    if (inTitle) f.inTitle = true;
    if (w) {
      const s = f.written.get(w.spelling) ?? { form, free: 0, styled: 0 };
      s[w.styled ? 'styled' : 'free'] += 1;
      f.written.set(w.spelling, s);
    }
    found.set(key, f);
  };
  scan(`${item.title}`, visit(true), true);
  scan(`${item.text}`, visit(false), false);
  return found;
}

// The spelling carried out among `written` (spelling -> { form, free, styled }, in the order first
// met), for `form` (any form when null): the free occurrences vote when there are any, else the styled
// ones; the most votes wins; ties go to a spelling in lower case, then to the one met first. null when
// the form is not written legibly anywhere in `written`.
function spell(written, form = null) {
  const cands = [...written].map(([spelling, s], first) => ({ spelling, ...s, first })).filter((c) => form === null || c.form === form);
  if (!cands.length) return null;
  const free = cands.some((c) => c.free > 0);
  const votes = (c) => (free ? c.free : c.styled);
  const lower = (c) => Number(c.spelling === c.spelling.toLowerCase());
  return cands.sort((a, b) => votes(b) - votes(a) || lower(b) - lower(a) || a.first - b.first)[0].spelling;
}

function withoutPhrase(tf, idf, drop) {
  const v = new Map();
  for (const [t, c] of tf) if (!drop.has(t)) v.set(t, c * (idf.get(t) ?? 1));
  return normalize(v);
}

// `info`, when given, is filled with what the run measured beside the records: { nearCopies: [[item
// keys] per group of two or more], nearCopiesApart: [[key, key, likeness] per near-copy pair whose items
// ended in different groups, which only "all-pairs" leaves] }.
export function discover(records, cfg = makeConfig(), info = null) {
  const D = cfg.discover;
  if (!NEAR_COPY_GROUPINGS.includes(D.nearCopyGrouping)) {
    throw new Error(`unknown discover.nearCopyGrouping ${JSON.stringify(D.nearCopyGrouping)} (${NEAR_COPY_GROUPINGS.join(', ')})`);
  }
  const corpus = loadCorpus(records);
  const reps = [...corpus.items.values()].filter((it) => (corpus.canonItem.get(it.key) ?? it.key) === it.key).sort((a, b) => (a.key < b.key ? -1 : 1));
  const perItem = new Map(reps.map((it) => [it.key, candidates(it)]));
  const vecs = buildItemVectors(corpus.items);
  const idf = buildIdf(vecs);

  const tagged = new Set();
  for (const t of corpus.terms.values()) for (const k of entitySet(corpus, t.items)) tagged.add(k);

  const full = new Map(reps.map((it) => [it.key, withoutPhrase(vecs.get(it.key), idf, new Set())]));
  const sim = (a, b) => dot(full.get(a), full.get(b));

  // near-copies count as one item: `units` holds each group's first item, and N counts groups
  const copyPairs = nearCopyPairs(reps, full, D.nearCopy, D.nearCopyWords);
  const groupOf = nearCopyGroups(reps, copyPairs, D.nearCopyGrouping);
  const units = reps.filter((it) => groupOf.get(it.key) === it.key);
  const N = units.length || 1;
  if (info) {
    const groups = new Map();
    for (const it of reps) {
      const g = groupOf.get(it.key);
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(it.key);
    }
    info.nearCopies = [...groups.values()].filter((g) => g.length > 1);
    info.nearCopiesApart = copyPairs
      .filter(([i, j]) => groupOf.get(reps[i].key) !== groupOf.get(reps[j].key))
      .map(([i, j, likeness]) => [reps[i].key, reps[j].key, Number(likeness.toFixed(3))]);
  }
  const distinctItems = (keys) => new Set(keys.map((k) => groupOf.get(k))).size;

  const containing = new Map(); // stemKey -> item keys, in item order
  const surface = new Map(); // stemKey -> form -> the tf of the items that write that form first
  const written = new Map(); // stemKey -> spelling -> { form, free, styled } over every item, in the order first met
  for (const it of reps) {
    for (const [key, f] of perItem.get(it.key)) {
      if (!containing.has(key)) containing.set(key, []);
      containing.get(key).push(it.key);
      if (!surface.has(key)) surface.set(key, new Map());
      surface.get(key).set(f.surface, (surface.get(key).get(f.surface) ?? 0) + f.tf);
      if (!written.has(key)) written.set(key, new Map());
      const all = written.get(key);
      for (const [spelling, s] of f.written) {
        const t = all.get(spelling) ?? { form: s.form, free: 0, styled: 0 };
        t.free += s.free;
        t.styled += s.styled;
        all.set(spelling, t);
      }
    }
  }
  // the items a phrase is measured on: the first of each near-copy group that holds it, in item order
  const distinct = new Map();
  for (const [key, keys] of containing) {
    const seen = new Set();
    distinct.set(key, keys.filter((k) => !seen.has(groupOf.get(k)) && seen.add(groupOf.get(k))));
  }
  const df = new Map([...distinct].map(([key, keys]) => [key, keys.length]));
  // a hub's form: among the forms the text writes legibly (in ordinary text, all of them), the one with
  // the most tf, ties in code-point order (failing that, the form of the best spelling of any form); its
  // label is the way the text writes that form most often. Only asked of a key the text spells somewhere.
  const forms = new Map();
  const formOf = (key) => {
    if (!forms.has(key)) {
      const spelled = new Set([...written.get(key).values()].map((s) => s.form));
      const ranked = [...surface.get(key).entries()].filter(([form]) => spelled.has(form)).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
      forms.set(key, ranked.length ? ranked[0][0] : written.get(key).get(spell(written.get(key))).form);
    }
    return forms.get(key);
  };
  const label = (key) => spell(written.get(key), formOf(key));
  // this item's phrase: how it writes the form it wrote first, else any form of the key it writes legibly
  // (an item that wrote the key only illegibly, which ordinary text never does, keeps the form)
  const phrase = (f) => spell(f.written, f.surface) ?? spell(f.written) ?? f.surface;

  // baseline: how alike two unrelated items are in this corpus (deterministic sample of pairs)
  let base = 0;
  let pairs = 0;
  for (let i = 0; i < Math.min(N, BASELINE_PAIRS); i++) {
    const a = units[i % N];
    const b = units[(i * 7 + 3) % N];
    if (a.key === b.key) continue;
    base += sim(a.key, b.key);
    pairs += 1;
  }
  const corpusBase = pairs ? base / pairs : 0;
  const threshold = Math.max(D.minCoherence, D.coherenceRatio * corpusBase);

  // the same, per pair of sources: a fixed sample of item pairs, one from each source, with their likeness
  const sourceOf = new Map(reps.map((it) => [it.key, it.source]));
  const bySource = new Map();
  for (const it of units) {
    if (!bySource.has(it.source)) bySource.set(it.source, []);
    bySource.get(it.source).push(it.key);
  }
  const blockKey = (s, t) => (s < t ? `${s}\u0000${t}` : `${t}\u0000${s}`);
  const blocks = new Map(); // blockKey -> [[a, b, likeness]]
  const block = (s, t) => {
    const k = blockKey(s, t);
    if (!blocks.has(k)) {
      const [lo, hi] = s < t ? [s, t] : [t, s];
      blocks.set(k, samplePairs(bySource.get(lo) ?? [], bySource.get(hi) ?? [], BASELINE_PAIRS).map(([a, b]) => [a, b, sim(a, b)]));
    }
    return blocks.get(k);
  };

  // the items coherence is measured over (the first 25 containing the phrase, in item order, one per
  // near-copy group)
  const sample = (key) => distinct.get(key).slice(0, 25);

  // what coherence the phrase's items would have from their sources alone: the mean, over the same
  // item pairs, of how alike items of those two sources are when they do NOT share the phrase (its
  // own pairs are what is being tested, so they are left out of the comparison). A pair of sources
  // with no such pair to compare with falls back to the corpus-wide baseline.
  const expected = (key) => {
    const carriers = new Set(containing.get(key).map((k) => groupOf.get(k)));
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

  // `sourceRatio` is the measured multiple, to three decimals, and the bar is applied to that same
  // number, so a viewer comparing it with another value makes exactly the build's comparison. With no
  // source likeness to compare with (0), nothing is measured and the bar cannot reject the phrase.
  const floor = typeof D.sourceRatioFloor === 'number' && D.sourceRatioFloor < D.sourceCoherenceRatio ? D.sourceRatioFloor : null;
  const usable = new Map(); // stemKey -> coherence, at or above sourceCoherenceRatio
  const under = new Map(); // stemKey -> coherence, below it but at or above the floor
  const measure = new Map(); // stemKey -> { baseline, ratio }
  for (const [key, d] of df) {
    if (d < D.minDf || d / N > D.maxDfRatio) continue;
    if (!written.get(key).size) continue; // nothing in the text spells it as written, so it could only be named by an invented label
    const c = coherent(key);
    if (c < threshold) continue;
    const e = expected(key);
    const ratio = e > 0 ? Number((c / e).toFixed(3)) : null;
    if (ratio === null || ratio >= D.sourceCoherenceRatio) usable.set(key, c);
    else if (floor !== null && ratio >= floor) under.set(key, c);
    else continue;
    measure.set(key, { baseline: e, ratio });
  }
  const coherenceOf = (key) => usable.get(key) ?? under.get(key);

  const score = (key, f) => (1 + Math.log(f.tf)) * Math.log(N / df.get(key)) * (key.includes(' ') ? D.bigramBoost : 1) * (1 + coherenceOf(key));

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
  const ranked = (it, pool) =>
    [...perItem.get(it.key).entries()]
      .filter(([key]) => pool.has(key))
      .map(([key, f]) => ({ key, tf: f.tf, score: score(key, f) }))
      .sort((a, b) => b.score - a.score || (a.key < b.key ? -1 : 1));
  const chooses = (it) => !tagged.has(it.key) || D.taggedToo;

  const first = new Map(); // item key -> the hubs it chose at or above the bar
  for (const it of reps) {
    if (!chooses(it)) continue;
    const chosen = pick(ranked(it, usable), D.perItem);
    first.set(it.key, chosen);
    for (const c of chosen) hubs.add(c.key);
  }

  // ...then, below the bar, a second pass fills only the slots each item left open. The first pass's
  // picks stay as they are: a lower unigram inside a chosen bigram is skipped as usual, and a lower
  // bigram whose word the first pass already chose is not added beside it (the first pass would have
  // let the bigram replace the word; here the word keeps its place).
  const lower = new Set();
  if (under.size) {
    for (const it of reps) {
      if (!chooses(it)) continue;
      const kept = first.get(it.key);
      const chosen = [];
      for (const c of ranked(it, under)) {
        if (kept.length + chosen.length >= D.perItem) break;
        const parts = c.key.split(' ');
        const all = [...kept, ...chosen];
        if (parts.length === 1 && all.some((p) => p.key.split(' ').includes(c.key) && df.get(p.key) >= 0.6 * df.get(c.key))) continue;
        if (parts.length === 2) {
          if (kept.some((p) => parts.includes(p.key) && df.get(c.key) >= 0.6 * df.get(p.key))) continue;
          const i = chosen.findIndex((p) => parts.includes(p.key) && df.get(c.key) >= 0.6 * df.get(p.key));
          if (i >= 0) chosen.splice(i, 1);
        }
        chosen.push(c);
      }
      for (const c of chosen) lower.add(c.key);
    }
    for (const key of lower) hubs.add(key);
  }

  // ...then every hub is attached to every item that contains it: untagged items always, tagged ones
  // when the site bridges. No cap here; the cap governed selection. A hub that lands on fewer than
  // minDf items (near-copies counted once) would connect nothing and is dropped.
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

  // output is grouped by hub in the order of its form (what a reader sees, read without capitals or
  // joiners, the order a reader looks for it in; two stem keys may sort differently from their forms),
  // then by item. The order the labels had before they were spelled as written, so it never moves.
  const byForm = (a, b) => {
    const fa = formOf(a);
    const fb = formOf(b);
    return fa < fb ? -1 : fa > fb ? 1 : a < b ? -1 : 1;
  };
  const out = [];
  for (const key of [...attached.keys()].sort(byForm)) {
    const carriers = attached.get(key);
    const n = carriers.length;
    const k = distinctItems(carriers.map(({ it }) => it.key));
    if (k < D.minDf) continue;
    const coherence = coherenceOf(key);
    const { baseline, ratio } = measure.get(key);
    const below = under.has(key);
    const lift = baseline > 0 ? `, ${(coherence / baseline).toFixed(1)}× the ${baseline.toFixed(3)} that items from the same sources share` : '';
    const bar = below ? `; under the ${D.sourceCoherenceRatio}× bar, admitted by the ${floor}× floor` : '';
    const copies = k < n ? ` (${k} of ${N} counting near-copies once)` : '';
    const name = label(key);
    for (const { it, f } of carriers) {
      out.push({
        type: 'tag',
        source: it.source,
        item: it.id,
        label: name,
        weight: Number(Math.min(0.6, D.weight + 0.05 * Math.min(4, f.tf)).toFixed(3)),
        origin: 'discovered',
        ...(ratio === null ? {} : { sourceRatio: ratio }),
        why: `recurs in ${n} of ${reps.length} items${copies}, which stay alike without it (${coherence.toFixed(2)}${lift}${bar})${f.tf > 1 ? `; ${f.tf}× here` : ''}`,
        wasDerivedFrom: [{ type: 'text', phrase: phrase(f), count: f.tf, inTitle: f.inTitle }],
        wasGeneratedBy: {
          activity: 'discover',
          parameters: {
            minDf: D.minDf,
            maxDfRatio: D.maxDfRatio,
            perItem: D.perItem,
            nearCopy: D.nearCopy,
            nearCopyWords: D.nearCopyWords,
            nearCopyGrouping: D.nearCopyGrouping,
            sourceCoherenceRatio: D.sourceCoherenceRatio,
            ...(below ? { sourceRatioFloor: floor } : {}),
            df: df.get(key),
            items: n,
            coherence: Number(coherence.toFixed(3)),
            sourceBaseline: Number(baseline.toFixed(3)),
            ...(ratio === null ? {} : { sourceRatio: ratio }),
          },
        },
      });
    }
  }
  return out;
}
