# Design

## The problem

post-pipe draws tags from several places. Each place has its own tag-system (`ai` in your writing,
`Artificial Intelligence` in an editorial feed, nothing at all in a news wire). Without a translation
layer the same idea shows up as unrelated nodes, and a source with no shared vocabulary produces no
edges: in the real corpus 60 of 102 items were isolated dust.

The Rosetta stone is the graph **between** tag-systems: it takes every source's tags, decides which are
the same concept, chooses one display name by weight, and keeps the relations between concepts so any
tag can be pulled up as a small neighbourhood.

This is the structure described in post-pipe's `vision/DECOMPOSITION.md` ("Rosetta stone of tags"):
tag-systems are graphs, the stone is the graph between them, edges carry identity / adjacency /
containment / opposition / synergy / near-equivalence. Mapping:

| vision | here |
|---|---|
| identity | tags with the same `norm` are one *term*; spellings are `forms` |
| near-equivalence | terms merged into one *concept* (stem, tokenset, seed, anchor + corroboration) and `near` relations |
| containment | `broader` / `narrower` |
| adjacency | `adjacent`, `related` |
| synergy, opposition | human-authored in `overrides.json` only |
| "user picks which system to display labels through" | `sourceWeights` / per-system **trust** and `canon.prefer` |
| SKOS as prior art | the model is SKOS-shaped: concept ≈ `skos:Concept`, canonical ≈ `prefLabel`, variants ≈ `altLabel`, `broader`/`related` carry over. A SKOS export is a small addition, not a redesign |

## Principles

1. **Unix.** Small programs, JSONL in and out, files you can read. `rtz build` is only the pipeline
   written down; it spawns the real programs. Anything can be swapped: an adapter, a signal, the whole
   scorer.
2. **No inference unless it earns its place.** Everything is lexical structure, curated data, shared
   items, and TF-IDF. A model can be added at exactly one seam (pair evidence) and is never required.
3. **Explainable.** Every merge keeps the signals and reasons that caused it; every canonical choice keeps
   its score parts; every earned tag carries a `why`.
4. **Humans win, and are never overwritten.** `overrides.json` is read, never written by the engine.
   Rebuilding is cheap, so decisions are applied by re-running, not by mutating state.
5. **Don't flatten.** Two vocabularies over the same essay are both kept (`sys`, `raw`, `formsBySource`);
   a tag's spelling per system is part of the answer, not noise to normalise away.

## Why merging is conservative

False merges are worse than missed ones: they silently lose a distinction and are hard to notice. So:

- **Identity needs identity evidence.** `stem`/`tokenset`/`seed` can merge alone. `edit`, `acronym` cannot
  (`AI` is also *art installation*). `text` can only corroborate: two tags used on similar texts are
  *adjacent*, not the same. This was learned the hard way: before this rule, `labor ~ labor-power` entered
  the review queue.
- **Anti-synonymy.** If two tags co-occur on the same item in the same system, the author chose both, so
  they are probably different (`AI`/`AGI`). Fuzzy evidence is multiplied by `1 − 0.85 × (co-occurrence ratio)`.
- **Average linkage + size cap.** A merge must hold up against every member already in the cluster.
- **Combination.** `1 − Π(1 − s)` over signals, with structural/curated signals exempt from the penalty.
- **Anchor math.** A shared item with *k* tags per side supports each pairing by `1/k`, summed over shared
  items, `score = cap · S/(S+0.5)`. One noisy item cannot merge anything; two clean 1-to-1 items can.
- **One article = one thing.** The same URL (or long title) in two systems is a single entity for
  co-occurrence, text profiles and relations. Without this, an essay present under `tags` and under
  `topology` produced identical text profiles and a flood of fake adjacency.

## Why relations are separate from merges

`broader` uses subsumption (Sanderson & Croft 1999): A is broader than B when
`P(A|B) ≥ 0.8` and `P(B|A) < 0.6` with enough support. `related` is normalised PMI, shrunk by `n/(n+1)`
so two co-occurrences don't read as certainty. `adjacent` is TF-IDF cosine between concepts' item
profiles, only for pairs that never share an item. Each concept keeps its strongest K relations.

## Emergence and discovery

`emerge` can only name what the stone already knows. Rules, each added after seeing a real failure:

- a phrase on > 20% of items is too common to mean anything;
- a lone generic word is accepted only if the item reads like the items carrying the tag (TF-IDF cosine
  ≥ 0.12): a mulberry article does not earn `process`;
- acronyms match only in capitals ("maid" does not contain `AI`);
- concepts that exist only because discovery proposed them are matched like any other (since 2026-10-25;
  before, they were skipped): discovery attached them where its candidate scan found the phrase, and
  emergence catches what that scan missed, under the same guards;
- whatever an item already carries, from any tag-system or stage, is never doubled: a record naming a
  concept the stone knows counts as is, any other record is resolved by its label.

`discover` exists for tag-systems with no shared vocabulary. Candidates are unigrams and bigrams that
never span punctuation; a hub must recur in ≥ 2 items, stay under 12% of items, avoid
`seed/generic-words.txt`, and not be incoherent (a weak guard: on short summaries the coherence
statistic does not separate topics from filler, so the word list does the real work). Since
2026-10-27 coherence is also measured against how alike items from the same sources already are
(`sourceCoherenceRatio`, `sourceBaseline`; see FORMATS.md): a word spread over one source of long,
alike articles had inherited that source's likeness and passed. Hubs are chosen
from the untagged items' point of view, `perItem` at a time, and then attached to *every* item
containing them, with no cap: attachment follows justification, and a hub's `why` counts exactly the
items that carry it (a hub left on fewer than `minDf` items is dropped). Before 2026-10-25 the cap was
applied again at attachment, so a `why` could claim six items while two carried the tag.

Every record either stage emits carries its provenance in PROV terms: `wasDerivedFrom`
(`[{type: 'text', phrase, count, inTitle}]`, where `phrase` is the span of the item's own words that
matched, so an item that says "court" is never said to contain "courts") and `wasGeneratedBy`
(`{activity: 'discover' | 'emerge', parameters}`, the stage and the numbers that admitted the tag;
emergence's `context` is present only for a lone word, where it was computed).

Two consequences of filing discovered spellings under their own scheme, noted for the relation work:
the anti-synonym penalty (`sameSourceCooccurrence` in `lib/cluster.js`) compares item sets per
scheme, so a human's tag and a discovered phrase on the same item no longer count as a human saying
the two are different things (only a human's co-tagging does); and since emergence now extends
discovered-only concepts, a discovered concept's `why` count equals the number of its *discovered*
assertions, not every edge it ends up with.

## What was verified, and how

- 114 `node:test` tests: normalisation, each signal, clustering, overrides, canonical scoring,
  emergence/discovery, all four graph projections, and the real programs run as separate processes
  (including the fully piped form and an external scorer).
- Real corpus runs (your Posts + post-pipe's feed) found five defects the synthetic data hid; each now
  has a regression test: junk emergent tags on generic words, `AI` ≈ `AI infrastructure`, weak
  text+anchor pairs in the review queue, identical-text artifacts from one essay in two systems, and
  mangled `&#039;` entities.
- The viewer was driven in a real browser: all four modes, search, slider re-ranking, explore, no
  console errors, **zero network requests**.

## Not done (candidates, in rough order of value)

1. Feed `overrides.json` edits back from the viewer (it shows the fragment; applying it is manual).
2. SKOS / JSON-LD export for interchange.
3. Persist concept ids across membership changes (today ids move if the smallest member changes).
4. Use embeddings as an *optional* `rtz-pairs` scorer for synonyms with no lexical or item overlap.
5. Non-English stemmers and generic-word lists.
