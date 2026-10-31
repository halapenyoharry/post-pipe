// Default configuration. Every number that shapes a decision lives here so it can be
// overridden from a config file or from overrides.json without touching code.

export const DEFAULTS = {
  // Maximum confidence each lexical/curated signal can contribute on its own.
  // Merge threshold is 0.70, so: stem/tokenset/seed can merge alone; acronym, edit and text
  // need corroboration (that is deliberate: "AI" must not merge with "art installation").
  signals: {
    stem: 0.92,
    tokenset: 0.78,
    edit: 0.65,
    acronym: 0.55,
    seed: 0.95,
    text: 0.6,
    anchor: 0.9,
  },
  signalWeights: {}, // multiplier per signal name; external scorers are signals too
  antiSynonymPenalty: 0.85, // tags that co-occur on the same item in one source are probably not synonyms
  mergeThreshold: 0.7,
  link: 'average', // average | single
  maxClusterSize: 12,
  nearThreshold: 0.4, // evidence in [near, merge) becomes a "near" relation: probably the same, a human should decide

  // Which variant of a concept becomes its canonical label.
  canon: {
    weights: { freq: 0.35, cover: 0.25, trust: 0.25, quality: 0.15 },
    prefer: 'expanded', // expanded | short | neutral
  },
  sourceWeights: {}, // per tag-system trust, default 1

  relate: {
    minSupport: 3, // items a concept needs before subsumption is trusted
    broaderP: 0.8, // P(broader | narrower) threshold (Sanderson & Croft)
    narrowerMaxP: 0.6, // and P(narrower | broader) must stay below this
    minNpmi: 0.25,
    minCooc: 2,
    minAdjacent: 0.3, // text cosine between concept profiles; also the text support a cross-scheme `related` needs to be a relatedMatch
    perConcept: 12,
    lexicalBroader: { minP: 0.5, minN: 2 }, // (provisional) "brain" ⊃ "brain scans" when P(brain | brain scans) >= minP on >= minN shared items
  },

  discover: {
    minDf: 2, // a phrase must recur in at least two items to connect anything
    maxDfRatio: 0.12, // and not be everywhere
    perItem: 3, // hubs chosen per untagged item; governs selection only, never where a chosen hub lands
    bigramBoost: 1.3, // "brain scans" is more specific than "brain"
    minCoherence: 0.04, // guard only: mean TF-IDF cosine between the items sharing a phrase, with the phrase removed
    coherenceRatio: 1.6, // ...and at least this multiple of the corpus-wide baseline similarity
    sourceCoherenceRatio: 1.6, // ...and at least this multiple of what items from the same sources share anyway (mean cosine per pair of sources, over the same item pairs); 0 turns it off
    sourceRatioFloor: 1.0, // hubs under sourceCoherenceRatio but at or above this are chosen in a second pass (never taking a first-pass slot), so a viewer can try a lower bar; at or above sourceCoherenceRatio it adds nothing
    nearCopy: 0.35, // two items whose TF-IDF cosine reaches this, and still reaches it once their nearCopyWords strongest shared words are removed, are near-copies (one story told twice) and count as one item when a phrase is measured; 0 turns it off
    nearCopyWords: 3, // how many of a pair's strongest shared words (its topic) are removed before asking whether it is still alike
    weight: 0.35,
    taggedToo: false, // also pick hubs FROM tagged items (default: hubs come from the untagged)
    bridgeTagged: true, // but attach selected hubs to tagged items that contain them, so the wire bridges into your vocabulary
  },

  emerge: {
    maxDfRatio: 0.2, // a phrase present in >20% of items is too common to be a signal
    minWeight: 0.25,
    minContext: 0.12, // single-word labels: TF-IDF cosine the item must have with the tag's existing items
  },
};

export function mergeDeep(base, extra) {
  if (!extra || typeof extra !== 'object') return structuredClone(base);
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const [k, v] of Object.entries(extra)) {
    if (v === undefined) continue;
    if (v && typeof v === 'object' && !Array.isArray(v) && base && typeof base[k] === 'object' && !Array.isArray(base[k])) {
      out[k] = mergeDeep(base[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

export function makeConfig(...layers) {
  return layers.reduce((acc, layer) => mergeDeep(acc, layer), structuredClone(DEFAULTS));
}
