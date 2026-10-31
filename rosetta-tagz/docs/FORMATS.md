# Formats

Everything is JSON. Streams are JSON Lines (one object per line). Unknown fields are ignored and
preserved where it matters, so other programs can add their own.

## Records (`records.jsonl`)

```json
{"type":"item","source":"Journal","id":"j2","title":"Who Tends the Algorithm","text":"…","url":"https://…","date":"…","kind":"essay","color":"#2ecc71"}
{"type":"tag","source":"Journal","item":"j2","label":"machine-learning","weight":1,"origin":"explicit"}
```

- `source` names a **tag-system**. An item belongs to exactly one source; the same article in two
  systems is two records with the same `url` (or the same long title), which the engine unifies.
- `origin`: `explicit` (a human wrote it), `discovered` (rtz-discover), `emergent` (rtz-emerge; ignored
  by rtz-stone). Emergent/discovered tags carry `why`; emergent also carries `concept`; either carries
  `sourceRatio` when a viewer can hide it (see "Trying another bar" below).
- A tag record without `type` but with `item` and `label` is accepted.
- Items with no tags are meaningful: they are the orphans discovery and emergence exist for.

### Discovered tags (`rtz-discover`)

```json
{"type":"tag","source":"ProPublica","item":"…","label":"cancer","weight":0.4,"origin":"discovered","sourceRatio":2.964,
 "why":"recurs in 7 of 102 items, which stay alike without it (0.05, 3.0× the 0.016 that items from the same sources share)",
 "wasDerivedFrom":[{"type":"text","phrase":"cancer","count":1,"inTitle":false}],
 "wasGeneratedBy":{"activity":"discover","parameters":{"minDf":2,"maxDfRatio":0.12,"perItem":3,"nearCopy":0.35,"nearCopyWords":3,
   "nearCopyGrouping":"chain","sourceCoherenceRatio":1.6,"df":7,"items":7,"coherence":0.046,"sourceBaseline":0.016,"sourceRatio":2.964}}}
```

A phrase becomes a hub when it is on at least `discover.minDf` items, on no more than `maxDfRatio` of
them, and its items are coherent: `coherence`, the mean TF-IDF cosine between the items holding it
(at most the first 25) with the phrase removed, must reach every bar below.

| bar | parameter (default) | what it compares with |
|---|---|---|
| floor | `minCoherence` (0.04) | a fixed minimum |
| corpus | `coherenceRatio` (1.6) | that multiple of how alike two items of the whole corpus are (a fixed sample of pairs) |
| sources | `sourceCoherenceRatio` (1.6; 0 turns it off) | that multiple of `sourceBaseline`: how alike items from the same sources are anyway |

`sourceBaseline` is measured per phrase: for each pair of its items, the mean cosine between items of
those two sources (a fixed sample of up to 400 pairs per pair of sources) leaving out the pairs that
both hold the phrase, since those are what is being tested; averaged over the same item pairs the
coherence is taken over. A pair of sources with no other pair to compare with uses the corpus figure.
It exists because one source can make its items alike by itself: on post-pipe's site corpus of
2026-10-26, two ProPublica articles average 0.084 against 0.017 for two ScienceDaily summaries, so
any word spread over ProPublica items ("instead", "role", "force") passed the 0.04 floor without
saying anything about a topic; measured against the likeness of items from their own sources they
come out at 0.9× to 1.3×, while "cancer", "immune system" and "blood pressure" come out at 2.9× to
5.5×. `why` states the coherence and that multiple; `items` is the number of items the hub is
attached to, which is the count `why` gives.

`sourceRatio` is that multiple, coherence / `sourceBaseline` to three decimals, on the record and in
its parameters, and the bar is applied to that same number (`sourceRatio ≥ sourceCoherenceRatio`), so
anyone comparing it with another value makes exactly the build's comparison. With nothing to compare
with (an expected likeness of exactly 0) nothing is measured: the record has no `sourceRatio`, and no
bar rejects it.

**Spelling** (since 2026-10-31). No label is invented: `label`, and `phrase` in `wasDerivedFrom`, are
spellings the text has, with hyphens, capitals and accents as written (`energy-efficient`, `Jupiter`, and
`Diego` from "UC San Diego", where "San" is too short to be a candidate). Counting and matching still use
the normalized key, so df, coherence, near-copies, selection and the output order are what they were.
Only the spelling carried out changed: read back through `words` (lower case, joiners as spaces), every
record is the one written before. The spelling is chosen in two steps:

| step | chooses | how |
|---|---|---|
| form | the hub's lower-case form (`energy efficient`) | as the label was chosen before: each item's tf goes to the form it wrote first, the most tf wins, ties in code-point order |
| spelling | how the text writes that form | the most occurrences, each place it is written counting once (a title once, though it counts twice toward tf); styled occurrences (below) vote only when the form is written nowhere else; ties go to a spelling in lower case, then to the one met first (items in key order, title before text, left to right) |

A capital that position can explain says nothing about the word. Two positions can capitalize: a title
(title case capitalizes every word, as ProPublica's do) and the start of a sentence (the first word of a
text, or the first after `.` `!` `?` `:`, an opening quotation mark or a bracket). An occurrence there whose
spelling has a capital is *styled*; a spelling without capitals is never styled. Styled occurrences vote only
when the text writes the form nowhere else, and then as written, since lower case would be a spelling the
text never writes: a word found only where sentences begin keeps its capital. `phrase` is chosen the same
way among its own item's occurrences of the form that item wrote first, so it can differ from the label:
an item that writes only "Drilled cores …" has the phrase `Drilled` under the label `drilled`. A word is
read back where the text writes it, so `Acme™` stays `Acme™` (before, the label was `acmetm`). A phrase
none of whose occurrences reads, on its own, as what it was counted as (normalization that depends on the
neighbours, such as a Greek final sigma before an apostrophe; English text has none) is not a candidate,
so every hub has a spelling.

On haroldyounghumxn.site's corpus of 2026-10-31, 9 of the 113 hubs changed spelling: `Antarctica`, `Assistance`,
`Bang`, `Diego`, `Drilled`, `Earth`, `energy-efficient`, `Jupiter`, `Valley`. No tag was gained or lost,
every concept kept its id under the ledger (which noted each old spelling once as `previousLabel`), and
post-pipe's labels check (`tools/rtagz-labels-check.js`) went from one label with no origin
(`energy efficient`) and six found only with case ignored to none of either.

Downstream, rtz-stone files a spelled label under the same norm as before (`normalizeLabel` reads
`energy-efficient` as `energy efficient`), so clustering, ids, relations and emergence's phrase matching do
not move. Two rules keep a spelling discovery carries out from deciding anything a lower-case one did not
decide: within one term a human's spelling wins (`displayForm`: a spelling only discovery wrote, `Labor`, never
outranks a human's `labor`, though discovery's occurrences of a spelling a human also wrote count toward it),
and a spelling discovery wrote in capitals (`NASA`) does not make a term acronym-like (only a human's
does), so emergence still matches it by its stem. One exception: `normalizeLabel` splits camel case and reads
`&` as "and", as it does for a human's tag, so a hub spelled `mRNA` is the term `m rna` (id `c_m_rna`), not
the `mrna` a lower-case label made, and emergence does not find it in text, where `words` reads "mRNA" as
one word. The corpus of 2026-10-31 has no such hub.

**Near-copies count once.** Two items are near-copies when their TF-IDF cosine reaches `nearCopy`
(0.35) and still reaches it once their `nearCopyWords` (3) strongest shared words (the largest products
of the two weights) are taken out of both: one story told twice shares its names, places and details,
two items about one topic share only the topic's few words. How pairs make groups is `nearCopyGrouping`
(below). When a phrase's df, the item count, its coherence and its `sourceBaseline` are measured, each
group is one item (the first item of the group that holds the phrase stands for it), because two copies
of a story are not two pieces of evidence. Attachment does not change: the hub lands on every copy,
`items` and `why` count the items it lands on, and when copies made a difference `why` says so, `recurs
in 6 of 102 items (5 of 101 counting near-copies once)`. `df` is the count with copies once, so `items`
can exceed it. `nearCopy: 0` turns this off.

Why those numbers, from post-pipe's site corpus of 2026-10-31 (102 items, 5151 pairs) and the test
corpora. Raw cosine cannot tell a copy from two short items on one topic, and removing one word is not
enough either:

| pair | cosine | without the strongest shared word | without the 3 strongest |
|---|---|---|---|
| two ProPublica articles on one Ruidoso flood (the copies) | 0.680 | 0.582 | 0.489 |
| "Which Universe" (a title-only post) and an article that says "universe" | 0.545 | 0.000 | 0.000 |
| two ProPublica stories about Ken Paxton | 0.381 | 0.153 | 0.104 |
| the next pair by the last column (two election stories) | 0.291 | 0.249 | 0.179 |
| test corpus: two short volcano items, different stories | 0.743 | 0.654 | 0.195 |
| synthetic corpus: `j2` and `w1`, one topic in two systems | 0.558 | 0.462 | 0.260 |

The flood pair stays at 0.38 or more with up to ten of its strongest shared words removed; every other
pair in the three corpora falls to 0.26 or less by three. 0.35 sits between 0.489 and 0.260 (about 1.4× from each). Before
this, those two articles alone lifted 18 incidental words into hubs (`memory`, `danger`, `onto`,
`staying`, …) and their relations (`memory` broadMatch `Climate and Environment`).

**How near-copies group** (`nearCopyGrouping`). Below, a pair's likeness is the lower of its two figures
(its cosine, and its cosine without its `nearCopyWords` strongest shared words), the one that has to
reach `nearCopy`.

| value | a group holds |
|---|---|
| `"all-pairs"` | items that are each other's near-copies, every pair. Pairs are taken from the most alike down, ties in item order (by key), and a pair joins its two groups only when every item of one is a near-copy of every item of the other. So an item two groups could take joins the group of the item it is most alike to, as long as it is a near-copy of every item already there |
| `"chain"` (default) | the connected pairs: any near-copy pair joins its two groups (how groups were made before the switch) |

The two differ only where an item is a near-copy of two items that are not near-copies of each other:
a roundup that retells two different stories. On haroldyounghumxn.site's corpus of 2026-10-31 a
ProPublica roundup ("Trump Has Tried to Exert More Control Over Elections. Here Are the Key Findings
From Our Reporting.") is a near-copy of the Cleta Mitchell story (0.485) and of the mail-ballot story
(0.396), which are 0.098 apart. `chain` makes the three one item, so the two stories are one piece of
evidence. `all-pairs` groups the roundup with the Cleta Mitchell story and leaves the mail-ballot story
its own item, so the roundup and the mail-ballot story count twice, though one retells the other. A
grouping cannot say that one item overlaps two others, so neither value is right everywhere. On that
corpus, at the 1.6× bar, `all-pairs` adds `class`, `extraordinary` and `regional` (on the roundup and
the mail-ballot story), `procedures` and `switch` (on the two stories), and `available` and `delivered`
(on all three; `delivered` was 1.439×, now 1.79×), and loses `injection` and `digital`: the one
ScienceDaily item that chose each now chooses `procedures` or `switch` instead. A different grouping also
changes N and the items the baselines are sampled from, so other hubs' `sourceRatio` moves slightly
too: 71 of the 103 hubs both values admit, by 1% at the median (`atmosphere` 4.448× to 4.402×).
`chain` is the default: on that corpus `all-pairs` brings in more generic words than it fixes, and
loses a real cross-source topic (`injection`).

The value is in every discovered record's parameters, and an unknown value is an error naming the two.
Set it like the other discovery parameters, `{"discover": {"nearCopyGrouping": "all-pairs"}}`, in the file
`rtz-discover --config` reads, or under `engine` in rtz-build's config. rtz-discover logs each group of
two or more items on stderr, and each near-copy pair `all-pairs` left in different groups, with its
likeness.

**Below the bar.** Hubs whose `sourceRatio` is under `sourceCoherenceRatio` but at least
`sourceRatioFloor` (1.0) are chosen in a second pass, after the first, from the slots the first pass
left: an item that chose `perItem` hubs at or above the bar chooses none below it; a lower unigram
inside a chosen bigram is skipped as usual; a lower bigram whose word the first pass chose is not added
beside it (the first pass would have let the bigram replace the word; here the word keeps its place).
So a hub below the bar never takes a slot from, or changes, one at or above it. Its records carry
`sourceRatioFloor` in their parameters (only theirs: that floor admitted nothing else), and their `why`
says `under the 1.6× bar, admitted by the 1× floor`. A floor at or above `sourceCoherenceRatio`,
or `null`, adds nothing and leaves the output byte for byte as it is without one. See "Trying another
bar" below for what this is for.

## Pair evidence (`pairs.jsonl`, from `rtz-pairs` or any external scorer)

```json
{"a":"ai","b":"artificial intelligence","signal":"seed","score":0.95,"why":"curated: ai = artificial intelligence = a.i."}
```

`a` and `b` are **norms** (case/accent/punctuation folded: `normalizeLabel(label).norm`), `a < b`.
`score` is the strongest confidence that signal alone would give. Known signals: `stem`, `tokenset`,
`edit`, `acronym`, `seed`, `anchor`, `text`. Any other name is treated as fuzzy evidence.

## `overrides.json` (human decisions; the engine never writes it)

| key | value | effect |
|---|---|---|
| `same` | `[["labor","labour"], …]` | must merge; the concept is marked `locked` |
| `notSame` | `[["ai","agi"], …]` | must never merge (beats seeds and evidence) |
| `pin` | `{"ml":"Machine Learning"}` | canonical label for the concept containing `ml` |
| `relations` | `[{"a","b","type","note"}]` | `broader`, `narrower`, `contains`, `related`, `adjacent`, `synergy`, `opposes`, or a SKOS mapping name `closeMatch`, `broadMatch`, `narrowMatch`, `relatedMatch`, `exactMatch`; any other `type` is dropped with one line on stderr. Stored `locked`, the narrow side flipped (below); it replaces a computed relation saying the same of the pair under either name (`near`/`closeMatch`, `related`/`relatedMatch`, `broader`/`broadMatch`). `b` may be `"<schemeId>:<externalId>"`, a concept of a published vocabulary, kept verbatim |
| `notRelated` | `[{"a","b","type"?}]` | (provisional) forbid a relation: without `type` every relation between the pair, in both directions; with one, that type (old names flipped as in `relations`; a name and the mapping typing turns it into name the same row: `near` removes a `closeMatch`, `related` a `relatedMatch`, `broader` a `broadMatch`, and the other way round). Applied last, after seeds, computed relations and `relations`; what went is listed in `stone.json.forbidden` |
| `ignore` | `["untagged"]` | drop these tags entirely |
| `sourceWeights` | `{"ScienceDaily":0.4}` | trust per tag-system when picking canonical labels |
| `canon` | `{"weights":{…},"prefer":"short"}` | override the scoring weights / length preference |
| `config` | partial `lib/config.js` defaults | e.g. `{"mergeThreshold":0.75}`; read by rtz-stone only: rtz-discover and rtz-emerge take theirs from `--config` (rtz-build's `engine`) |

Labels are matched by `norm`, so `AI`, `ai`, `A.I.` are the same argument.

## Seeds (`seed/common.json`)

`{"same":[[…]], "broader":[["wider","narrower"]], "related":[[a,b]]}`. Evidence, not commands: they
feed the same scoring and only fire for labels present in the data. A seed relation may name any
member of a seed alias group (`artificial general intelligence` finds the corpus's `agi`).

## `stone.json`

```
schema, generated, config{mergeThreshold, link, canon, sourceWeights, signals}, stats{…}
systems{ <source>: {items, tagged, untagged, occurrences, distinctTags, weight, color} }
concepts[]: {
  id, canonical, pinned, locked, discovered, sourceRatio?, items, sources{src:nItems},
  inScheme[],                                                            // every scheme that wrote a spelling, plus `site`
  prefLabel{scheme: label}, altLabel{scheme: [label]},                   // SKOS, per scheme (below)
  variants[]: {norm, label, forms{raw:n}, formsBySource{scheme:{raw:n}}, count, explicit, bySource{scheme:n}, acronym, tokens, sourceRatio?},  // acronym: a human wrote it like an initialism
  rank[]:     {norm, label, score, parts{freq,cover,trust,quality}},     // why the winner won, over the ranking pool
  links[]:    {a, b, conf, cooc, signals{name:{score,why}}},             // evidence inside the concept
  ledger?:    {since, event, previousLabel?}                             // only when built with a ledger (below)
}
relations[]: {a, b, type, weight, evidence, locked, skos,           // a,b are concept ids; for `broader`, a ⊃ b
              why, wasDerivedFrom[], wasGeneratedBy{activity, parameters}, external?}   // every relation says why (below)
forbidden[]: {a, b, type, why: "override"}               // relations an overrides.notRelated entry removed, this build
ledger?: {path, minted, reused, retired, splits, merges, events[]} // only when built with a ledger (below)
```

`discovered: true` means no human ever wrote any spelling in the concept (only rtz-discover proposed it).
`sourceRatio` is on a variant every record of which is a discovered one carrying its ratio (the highest
of them), and on a concept every variant of which has one (the highest): "Trying another bar" below.
A concept id is `c_` + the lexicographically smallest member norm when it is first minted, and from
then on it belongs to the concept, not to the spelling: the ledger (below) hands the same id to the
cluster that continues it, however its membership shifts. Without a ledger every build mints afresh,
which gives the same ids as a first ledgered build. Reference concepts in overrides by label, never
by id.

### Schemes

A concept is one `skos:Concept`; each vocabulary that names it is a `skos:ConceptScheme`:

| scheme id | what it is | status |
|---|---|---|
| a source name (`Journal`, `ProPublica`, …) | that tag-system, exactly as `source` names it | the system's own name |
| `discovered` | rosetta-tagz's recurring-phrase scheme: spellings rtz-discover proposed | provisional name |
| `site` | the cross-scheme canonical; its prefLabel is `canonical` | provisional name |

If a real tag-system is literally named `site` or `discovered`, its scheme id is `site (system)` /
`discovered (system)`, so the two never collide (`schemeOfSource` in `lib/corpus.js`). `source`,
`systems{}`, `sources{}` and item keys keep the real source name; only scheme ids are renamed.

Filing: a variant's `formsBySource`, `bySource` and `itemsBySource` are keyed by scheme, so a spelling
only discovery wrote sits under `discovered`, never under the system of the item it was found on.
`count` still includes discovered occurrences; `explicit` counts only human-written ones.

- `inScheme`: every scheme with at least one form for at least one variant, sorted, then `site` last.
- `prefLabel[scheme]`: the spelling that scheme used most, **as written** (`A.I.` stays `A.I.`); ties
  broken as `displayForm` breaks them (no `-`/`_` joiner first, then a capital, then alphabetical).
  `prefLabel.site` is `canonical`. `prefLabel.discovered` is the spelling rtz-discover carried out, as the
  text writes it (since 2026-10-31; "Spelling" under Discovered tags).
- `altLabel[scheme]`: every other spelling that scheme wrote, sorted. `altLabel.site` is every
  spelling anyone wrote except the canonical.

The rule that does not move: no label is invented. A prefLabel is always a spelling present in that
scheme's own evidence; the `site` canonical is one of them (or a `pin`, which is a human's decision).

**Ranking pool.** The canonical is scored over the human-written variants when there are any
(`rankingPool` in `lib/canon.js`: the variants with `explicit > 0`, or all of them when no human
wrote any), and `rank[]` lists only the pool. A spelling that only discovery wrote can join a concept
(as a variant, and as `prefLabel.discovered`) but never outranks a human's spelling. The same holds one
level down, inside a term: a variant's `label` (`displayForm`) is chosen among the spellings a human wrote
whenever a human wrote the term, so the text's `Labor` that discovery carried out never renames a human's
`labor` (before 2026-10-31 a discovered lower-case `climate change` could outrank a human's `Climate
Change` this way). Only a concept nobody wrote (`discovered: true`) ranks among its own spellings. The viewer's live re-ranking scores
the same pool, so it never stars a spelling rtz-stone would not. Within the pool, a variant's `count`
and `bySource` still include its discovered occurrences (and `discovered` counts as one covering
scheme, trust weight 1 unless `sourceWeights.discovered` says otherwise), so discovery evidence can
still move the choice *between two human spellings*; whether it should is an open question for the
site owner, not something the engine has decided. Below-bar spellings (rtz-discover's floor) are
never in the pool of a concept that has spellings at the bar, and never count in it ("Trying another
bar", below).

`systems[].distinctTags` counts the terms carried by a system's items from any origin, a discovered
spelling on a wire item included; it is a per-system coverage number, not a per-scheme one.

### Relations

Clustering means spelling identity: one concept is one `skos:Concept`. Everything coarser than that
is a relation on `relations[]`; nothing is rewritten or deleted to make it. The relation types, and
where each comes from:

| type | derivation | SKOS |
|---|---|---|
| `broader` | usage subsumption (Sanderson & Croft 1999: P(A\|B) ≥ `relate.broaderP` 0.8, P(B\|A) ≤ `narrowerMaxP` 0.6, B on ≥ `minSupport` 3 items); lexical containment (the stems of A are a proper subset of the stems of B, `"brain"` ⊂ `"brain scans"`, corroborated by usage: P(A\|B) ≥ `relate.lexicalBroader.minP` 0.5 on ≥ `minN` 2 shared items, provisional); a seed; a human | `skos:broader` within a scheme |
| `related` | co-occurrence beyond chance (normalised PMI ≥ `minNpmi` 0.25 on ≥ `minCooc` 2 items), shrunk by support; a seed; a human | `skos:related` within a scheme |
| `adjacent` | similar texts (profile cosine ≥ `minAdjacent` 0.3), never co-tagged | none |
| `near` | probably the same spelling, short of a merge (`nearThreshold` ≤ conf < `mergeThreshold`): the review queue | none within a scheme |
| `synergy`, `opposes` | human only | none |
| `closeMatch` | a `near` whose two concepts no scheme wrote both of | `skos:closeMatch` |
| `broadMatch` | a `broader` (usage, lexical or seed) across schemes | `skos:broadMatch` |
| `relatedMatch` | a `related` across schemes whose items also read alike (`evidence.cosine` ≥ `minAdjacent`) | `skos:relatedMatch` |
| `exactMatch` | human only (or, later, a vocabulary mapping) | `skos:exactMatch` |

**Direction.** `broader {a, b}` means b `skos:broader` a (a is the wider one), and so `broadMatch {a, b}`
means b `skos:broadMatch` a. `narrower` and `narrowMatch` are never emitted: the inverse is implied. An
override written with `narrower`, `contains` or `narrowMatch` is stored flipped onto `broader` /
`broadMatch`.

**SKOS typing.** After the concepts know their schemes, two concepts *share a scheme* when
`inScheme(a) ∩ inScheme(b)` minus `site` is non-empty (every concept is in `site`, so it says nothing).
Within a scheme `broader` and `related` keep their names with `skos: true`; across schemes a `near`
becomes `closeMatch`, a `broader` becomes `broadMatch`, and a `related` becomes `relatedMatch` when its
`evidence.cosine` reaches `minAdjacent` (co-occurrence and text both agree). Everything SKOS has no
word for keeps its name with `skos: false`: `adjacent`, `synergy`, `opposes`, a `near` within one
scheme, a `near` a `notSame` kept apart at merge confidence, and a cross-scheme `related` without text
support. A reader that speaks SKOS reads the `skos: true` rows and ignores the rest; rosetta-tagz's own
viewer (rtz-view) draws all of them. The typing is additional naming of relations the evidence already made, never
a new pair; only lexical `broader` adds pairs. A human's relation (`locked`) keeps the name the human
wrote; `skos` is true when that name is a SKOS one (so a human's `adjacent` or `synergy` is `skos: false`
even toward a published vocabulary). It replaces the computed relation on the same pair that says the
same thing under either name (`closeMatch` replaces a computed `near`, `related` a `relatedMatch`, and
so on), so a pair never carries two rows of one saying.

**External targets.** When an override's `b` is `"<schemeId>:<externalId>"` and resolves to no concept,
the relation is kept with `b` verbatim, `external: true` and `skos` true when the name is a SKOS one
(a mapping into a published vocabulary is cross-scheme by definition; a computed `broader`/`related`/
`near` toward one would be stored as `broadMatch`/`relatedMatch`/`closeMatch`, though today only a
human reaches an external id). The prefix is not checked against a configured scheme yet: that check
comes with `conceptSchemes` (vocabularies). An external id is never `a`, so `narrower`/`narrowMatch`
toward one cannot be flipped and is not stated. The universe keeps such a relation when its `a` is a
concept it knows (its unknown-id filter lets through a `b` that contains `:` and is not a concept id).

**Every relation says why.** `why` is one plain sentence with the numbers that made it, e.g.
`"brain scans" contains the words of "brain"; 5 of 6 brain scans items also carry brain (P=0.83)`,
or `"General Strike" and "Labor" share 2 of their 2 and 5 items, more than chance predicts (NPMI 0.65)`.
`wasDerivedFrom` lists the evidence: `{type:"cooccurrence", items}`, `{type:"stem", key}` (lexical),
`{type:"text", cosine}` (adjacent, relatedMatch), `{type:"signal", name, score}` per signal (near,
closeMatch), `{type:"seed"}`, `{type:"override", note?}`. `wasGeneratedBy` is
`{activity:"relate", parameters:{…}}` with exactly the thresholds that applied (`source: "seed"` or
`"overrides"` for a curated one). A usage and a lexical `broader` on one pair are one relation whose
`evidence.derivation` is `["usage","lexical"]`, with both derivations in `why` and `wasDerivedFrom`;
when lexical `broader` fires on a pair that usage had called `related`, the hierarchy replaces the
symmetric reading (SKOS keeps the two apart) and says so with `evidence.replaced: "related"`. When
usage already made the hierarchy the other way round (B wherever A, P ≥ `broaderP`), the words alone
(P ≥ `minP`, a lower bar) do not overturn it and no lexical `broader` is added: a hierarchy never runs
both ways on one pair. Co-tagged pairs record `evidence.cosine` (the text
cosine of the two concepts' item profiles) whenever both have text.

**Forbidding.** `overrides.notRelated` is resolved by label through the same lookup as `relations`
(norm, then seed alias groups) and applied after everything else, so it beats seeds, computed
relations and `relations` alike. It removes exactly the named relation(s): with no `type`, every
relation between the pair in both directions; with a `type`, that type (direction as written, old
names flipped like `relations`; `near`/`closeMatch`, `related`/`relatedMatch` and `broader`/`broadMatch`
each name the same row, so a rule written in one name removes the row whatever name typing gave it). The removed rows are listed in `stone.json.forbidden` as
`{a, b, type, why: "override"}` (empty when nothing was forbidden) and copied into `universe.json`.
The engine never writes `overrides.json`.

## Ledger (`rosetta-tagz/ledger@1`)

A SKOS concept is a URI, so an id must not move because a spelling arrived or left. `rtz-stone
--ledger FILE` (`rtz-build`: `"ledger"` in the config, default `OUTDIR/ledger.json`, `false` for none)
reads the ledger before the build and rewrites it after, through `FILE.tmp` and a rename. The engine
owns this file; a human never edits it. The default lands in disposable build output, so a config
should name a persistent path: post-pipe names `rtagz-ids.json` in the site folder (`stone.ledger.json`
before 2026-10-31); rosetta-tagz's own `local/real.config.json` names `ledger.json` beside itself
(`local/` is git-ignored).

```
{ schema: "rosetta-tagz/ledger@1", created, updated, builds,
  concepts: { <id>: {members[], label, pin?, since, lastSeen, parent?} },   // live ids, members are norms
  retired:  { <id>: {members[], label, since, lastSeen, into?} },           // ids no cluster continues; `into` when absorbed
  events:   [ {type:"split", at, parent, children[]} | {type:"merge", at, parents[], child} | {type:"retire", at, ids[]} ] }
```

`events` keeps the 200 most recent. `label` is the canonical rtz-stone chose that build (a spelling
somebody wrote, or a human's pin), `pin` the first member norm (in member order) a human pinned a
canonical on; when several members are pinned the others stay members, which already carries their
continuity. The ledger never holds a label that is not a member norm, the canonical, or a pin.
`retired` is kept indefinitely, so a term that comes back after any gap gets its id back and no
later mint can take a retired id; nothing prunes it yet (a retention rule would be a shape revision).

How each cluster finds its id, in cluster order (`lib/ledger.js`, `assignIds`):

1. **Pin continuity.** A pinned norm in the cluster that exactly one prior (live or retired) carries,
   by `pin` or by membership, names that prior. A pin is strong continuity evidence: a cluster whose
   only overlap with its prior is the pinned norm keeps the id.
2. **Majority.** Else a prior the cluster continues: one whose members overlap the cluster in more
   than half of the cluster's members, or in more than half of the prior's own members (so a concept
   of one spelling keeps its id when a second spelling joins it; an exact half does not count either
   way). Live priors are tried first, then retired ones. Several candidates (two priors merging into
   one cluster): the largest overlap keeps the id, ties to the prior whose label the cluster still
   holds, then the most recently seen, then the smaller id; the others are absorbed (rule 4). A
   retired id that wins comes back to life with its `since`.
3. **Split.** A prior named by several clusters keeps its id on one child: the child with the
   largest overlap, ties to the child that named it by pin, then the child holding the prior's label
   norm, then the smaller smallest member. The other children mint with `parent` set, and one `split`
   event lists the parent and every child, the keeper first. (The larger child keeps the id, so a
   viewer keying positions on ids keeps the parent's position on the larger child.)
4. **Mint.** With no candidate the id is `c_` + `slugify(smallest member)`, then `_2`, `_3`… while
   that id is live, retired or taken this build (before the ledger a collision appended `_`; norms
   from `normalizeLabel` never collide with each other, only with ids the ledger already holds). A
   live prior that overlaps the cluster but continues nowhere is absorbed: retired with `into` the
   cluster's id, and one `merge` event per child lists the parents (the id the child kept first,
   when it kept one).
5. **Retire.** A live prior no cluster touched is retired without `into`; one `retire` event lists
   them.

An absent ledger is created by the build; an unreadable one (not JSON, or not this schema) earns one
stderr line, `rtz-stone: ledger unreadable at <path>, ids minted afresh; the file was left as is`,
the build proceeds as if there were none, and the file is not rewritten. A ledger that cannot be
written (its directory is a file, a permission) earns one stderr line, `rtz-stone: ledger not written
at <path>: <reason>`, after `stone.json` itself is written; the stage still exits 0.

What the build reports: `stone.json.ledger {path, minted, reused, retired, splits, merges, events[]}`
(copied into `build.json.ledger`; `events` holds this build's split, merge and retire events, the same
objects the ledger file appends, so the parent and children of a split and the parents of a merge are
in `build.json` without reading the ledger), and on every concept in `stone.json` `ledger {since, event, previousLabel?}`, where
`event` is `minted`, `reused`, `split` (either child of a split) or `merged` (a child that absorbed a
prior), and `previousLabel` is the ledger's stored label when it differs from this build's canonical
(the viewer uses it to carry a saved position over a rename). The universe copies the note through
unchanged; a `u_` concept never has one.

## `universe.json`

```
schema, generated, canon, sourceWeights, stats, sources[{name,color,weight,items,tagged}]
concepts[]   as in stone.json (ledger{since,event,previousLabel?} included when stone.json has it, sourceRatio?),
             plus n (tagged items), nEmergent (earned/discovered), unmapped?
relations[]  as in stone.json (skos, why, PROV); a relation to an external "<scheme>:<id>" passes through
forbidden[]  as in stone.json
items[]: {key, source, alsoIn[], title, excerpt, url, kind, date,
          tags[]: {c: conceptId, w, origin, raw[{l,n,s}], sys[], via, why,
                   wasDerivedFrom?[], wasGeneratedBy?{activity, parameters}, sourceRatio?}}   // PROV, when known
```

An item's `tags` combine every tag-system it appears in; `sys` says who contributed each tag and `raw`
what they actually wrote. Tags `stone.json` does not hold become `unmapped` singleton concepts (`u_…`),
filed as rtz-stone files its own: an explicit label under the scheme of its system, a discovered
label under `discovered` (never under the system of the item it was found on), an emergent label under
`site` alone (it is a canonical from the `stone.json` that earned it, not a word any system wrote). Their
`inScheme`, `prefLabel`, `altLabel` and the variant's `forms`, `formsBySource`, `bySource` and
`explicit` follow from the records that named them, so a `u_` concept has the same shape as a concept
in `stone.json`: `inScheme: ["Posts", "site"]`, `prefLabel` with the label under both, `altLabel` with an
empty list per scheme.

Provenance on a tag (PROV terms): an `explicit` tag `wasDerivedFrom` one
`{type:"category", scheme, label}` per `raw` entry (the category the system wrote) and
`wasGeneratedBy {activity:"ingest", parameters:{}}` (the record stream does not say which adapter
ingested it, so nothing is claimed). An earned tag (`discovered`, `emergent`) carries the
`wasDerivedFrom`/`wasGeneratedBy` its stage wrote on the record, if any: `wasDerivedFrom[0].phrase`
is a span of the item's own words (lower-cased, as `words()` reads them), never the label whose stems
matched it. A PROV field is either present with a value or absent; it is never `null`.

## Trying another bar (`sourceRatio`)

A viewer cannot rerun discovery, so rosetta-tagz hands over what it needs to filter at view time:
build with `discover.sourceRatioFloor` under `sourceCoherenceRatio` (1.0 under 1.6 by default), and
everything a viewer can hide carries the ratio it must be set at or below to show it:

| where | `sourceRatio` |
|---|---|
| discovered record | its measured ratio (absent only when there was nothing to compare with) |
| emergent record | when every spelling it matched has one: the highest of them; for a tag only below-bar records made possible, the highest below-bar ratio at which it appears, whatever the concept's other spellings (its parameters then carry `sourceCoherenceRatio`) |
| `stone.json` variant | when every record of the spelling is a discovered one carrying a ratio: the highest |
| `stone.json` / `universe.json` concept | when every variant has one: the highest (so a concept only discovery made shows when any of its hubs would) |
| `universe.json` item tag | when every record behind it carries one: the highest; a tag a human wrote never has one |

The rule for a viewer set at v: show what has no `sourceRatio` or one ≥ v, and a relation when both
its concepts show. The build's own bar is `sourceCoherenceRatio` in any discovered record's parameters;
a viewer set there shows exactly what the build at that bar has, apart from the counts noted at the end. On post-pipe's site corpus of 2026-10-31 a
build with the floor at 1.0, filtered at 1.6, gave the build at 1.6 line for line: its 212 discovered
tags, its 141 concepts (once the below-bar spellings and their links are set aside), its 86
relations, its 18 emergent records and every universe tag; the ledger kept all 141 ids, and a first
build without a prior ledger minted the same ones. The floor added 45 hubs (259 records on 58 items)
with ratios from 1.008 to 1.523, each its own concept there.

That holds because rtz-stone layers below-bar evidence instead of mixing it in. A discovered record is
below its bar when its `sourceRatio` is under the `sourceCoherenceRatio` it was generated with
(`belowBar` in `lib/corpus.js`). Everything a build at the bar holds is computed from the other records
alone, exactly as that build computes it: the clustering of their spellings, every canonical, rank and
scheme label, `items` and `sources`, `systems`, and the relations between those concepts. Then the
below-bar spellings are attached (`attachLate` in `lib/cluster.js`) by the same rules, except that two
clusters holding at-bar spellings never merge:

- a below-bar spelling that joins a concept at the bar is listed among its variants, with its
  `sourceRatio`, and its links follow the concept's own; it never ranks (the ranking pool is taken over
  the concept's at-bar spellings: the human-written ones when there are any, else its at-bar discovered
  ones), never becomes a scheme label, adds nothing to `items`, and the id is minted from the at-bar
  spellings (`mint` in `lib/ledger.js`), so neither the canonical nor the id moves, with or without a
  ledger (with one, the majority rule keeps the id anyway: the concept still holds every prior member);
- a below-bar spelling with links to two concepts at the bar joins the first it reaches in confidence
  order and never bridges them;
- below-bar spellings with no concept at the bar form concepts of their own, whose relations are
  computed with everything;
- a below-bar tag on a spelling a human also wrote adds nothing to that spelling's counts;
- a seed, override relation or pin naming a spelling that exists only below the bar inside a concept
  at the bar is not applied (it was not there at the bar);
- rtz-emerge decides on the at-bar records exactly as a build at the bar does: their spellings, what
  their items read like, what each item carries. Then, for each concept with below-bar records, from
  its highest below-bar ratio down, it decides again with the records at or above that ratio added
  (a decision about one concept depends only on its own spellings, items and records); a tag that
  first appears at ratio r carries r, and its `why` ends `only with discovered tags under the 1.6× bar
  (r)`. Before this rule (2026-10-31), a below-bar hub on a word a human also wrote leaked: on
  post-pipe's panel site, Harold's "power" on one post and a below-bar hub "power" (1.141) on ten
  items made those ten items read like the concept, and emergence put "power" on all ten with no
  ratio, so a viewer at 1.6 showed it on eleven cards where the build at 1.6 has one.
- rtz-universe reads below-bar records (discovered or emergent) last, and they never change a tag the
  other records made.

Where a viewer at v differs from a fresh build at v:

- **v above the build's bar.** A hub's ratio does not depend on the bar, but slots do: an item whose
  hub is hidden at v would, in a fresh build at v, choose its next candidates, which may be hubs this
  build never chose (on the corpus above, when counting near-copies once removed 21 hubs, `cannot`
  (1.71) and `energy drink` (1.94) filled the slots they freed). Clustering, canonicals, relations,
  and emergence's context and `df` were computed with the hidden hubs present; a fresh build at v
  computes them without, so a concept can stay merged through a spelling hidden at v, or show under a
  canonical spelling hidden at v.
- **v below the build's bar.** A fresh build at v would let a hub between v and the bar compete for
  every slot, so it might drop a hub this build keeps and choose ones the second pass had no slot for,
  and would let a lower bigram replace its word. In rtz-stone it would mix the lower spellings in: they
  could rank (a concept only discovery made could be renamed and re-minted), bridge or block merges
  between concepts, appear as scheme labels, count in `items`, and shift every relation (on the corpus
  above, mixing the 1.0 hubs in changed the NPMI and weight of 66 of the 86 relations between the 1.6
  concepts, added one and dropped two). Emergence would match the lower spellings of concepts at the
  bar, and seeds, override relations and pins naming them would apply.
- Counts: `universe.json`'s `n` and `nEmergent` count every tag, hidden or not, and `stats` in both
  files counts everything; a viewer filtering by ratio should count what it shows.

## Graph (`rtz-graph`)

```
{ nodes:[{id, type:item|concept|term, label, source, concept, val, …}],
  links:[{source, target, type, weight, …}], meta:{mode, focus, nodes, links} }
```

| mode | nodes | links |
|---|---|---|
| `raw` | items, `term` per (tag-system, spelling) | `tag` |
| `hyper` | items, concepts | `tag` (+ `origin`, `why`), relation types |
| `dyadic` | items | `shared`, with `tags[]` (concept ids) and `label` |
| `concepts` | concepts | relation types |
