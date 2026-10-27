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
  when building a stone). Emergent/discovered tags carry `why`; emergent also carries `concept`.
- A tag record without `type` but with `item` and `label` is accepted.
- Items with no tags are meaningful: they are the orphans discovery and emergence exist for.

### Discovered tags (`rtz-discover`)

```json
{"type":"tag","source":"ProPublica","item":"…","label":"cancer","weight":0.4,"origin":"discovered",
 "why":"recurs in 7 of 102 items, which stay alike without it (0.05, 2.9× the 0.016 that items from the same sources share)",
 "wasDerivedFrom":[{"type":"text","phrase":"cancer","count":1,"inTitle":false}],
 "wasGeneratedBy":{"activity":"discover","parameters":{"minDf":2,"maxDfRatio":0.12,"perItem":3,"sourceCoherenceRatio":1.6,
   "df":7,"items":7,"coherence":0.046,"sourceBaseline":0.016}}}
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
| `config` | partial `lib/config.js` defaults | e.g. `{"mergeThreshold":0.75}` |

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
  id, canonical, pinned, locked, discovered, items, sources{src:nItems},
  inScheme[],                                                            // every scheme that wrote a spelling, plus `site`
  prefLabel{scheme: label}, altLabel{scheme: [label]},                   // SKOS, per scheme (below)
  variants[]: {norm, label, forms{raw:n}, formsBySource{scheme:{raw:n}}, count, explicit, bySource{scheme:n}, acronym, tokens},
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
| `discovered` | the stone's recurring-phrase scheme: spellings rtz-discover proposed | provisional name |
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
  `prefLabel.site` is `canonical`.
- `altLabel[scheme]`: every other spelling that scheme wrote, sorted. `altLabel.site` is every
  spelling anyone wrote except the canonical.

The rule that does not move: no label is invented. A prefLabel is always a spelling present in that
scheme's own evidence; the `site` canonical is one of them (or a `pin`, which is a human's decision).

**Ranking pool.** The canonical is scored over the human-written variants when there are any
(`rankingPool` in `lib/canon.js`: the variants with `explicit > 0`, or all of them when no human
wrote any), and `rank[]` lists only the pool. A spelling that only discovery wrote can join a concept
(as a variant, and as `prefLabel.discovered`) but never outranks a human's spelling. Only a concept
nobody wrote (`discovered: true`) ranks among its own spellings. The viewer's live re-ranking scores
the same pool, so it never stars a spelling the stone would not. Within the pool, a variant's `count`
and `bySource` still include its discovered occurrences (and `discovered` counts as one covering
scheme, trust weight 1 unless `sourceWeights.discovered` says otherwise), so discovery evidence can
still move the choice *between two human spellings*; whether it should is an open question for the
site owner, not something the engine has decided.

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
support. A reader that speaks SKOS reads the `skos: true` rows and ignores the rest; the stone's own
viewer draws all of them. The typing is additional naming of relations the evidence already made, never
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
should name a persistent path: post-pipe names `stone.ledger.json` in the site folder; the stone's
own `local/real.config.json` names `ledger.json` beside itself (`local/` is git-ignored).

```
{ schema: "rosetta-tagz/ledger@1", created, updated, builds,
  concepts: { <id>: {members[], label, pin?, since, lastSeen, parent?} },   // live ids, members are norms
  retired:  { <id>: {members[], label, since, lastSeen, into?} },           // ids no cluster continues; `into` when absorbed
  events:   [ {type:"split", at, parent, children[]} | {type:"merge", at, parents[], child} | {type:"retire", at, ids[]} ] }
```

`events` keeps the 200 most recent. `label` is the canonical the stone chose that build (a spelling
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
at <path>: <reason>`, after the stone itself is written; the stage still exits 0.

What the build reports: `stone.json.ledger {path, minted, reused, retired, splits, merges, events[]}`
(copied into `build.json.ledger`; `events` holds this build's split, merge and retire events, the same
objects the ledger file appends, so the parent and children of a split and the parents of a merge are
in `build.json` without reading the ledger), and on every stone concept `ledger {since, event, previousLabel?}`, where
`event` is `minted`, `reused`, `split` (either child of a split) or `merged` (a child that absorbed a
prior), and `previousLabel` is the ledger's stored label when it differs from this build's canonical
(the viewer uses it to carry a saved position over a rename). The universe copies the note through
unchanged; a `u_` concept never has one.

## `universe.json`

```
schema, generated, canon, sourceWeights, stats, sources[{name,color,weight,items,tagged}]
concepts[]   as in the stone (ledger{since,event,previousLabel?} included when the stone has it),
             plus n (tagged items), nEmergent (earned/discovered), unmapped?
relations[]  as in the stone (skos, why, PROV); a relation to an external "<scheme>:<id>" passes through
forbidden[]  as in the stone
items[]: {key, source, alsoIn[], title, excerpt, url, kind, date,
          tags[]: {c: conceptId, w, origin, raw[{l,n,s}], sys[], via, why,
                   wasDerivedFrom?[], wasGeneratedBy?{activity, parameters}}}      // PROV, when known
```

An item's `tags` combine every tag-system it appears in; `sys` says who contributed each tag and `raw`
what they actually wrote. Tags the stone has never seen become `unmapped` singleton concepts (`u_…`),
filed like the stone files its own: an explicit label under the scheme of its system, a discovered
label under `discovered` (never under the system of the item it was found on), an emergent label under
`site` alone (it is a canonical of the stone that earned it, not a word any system wrote). Their
`inScheme`, `prefLabel`, `altLabel` and the variant's `forms`, `formsBySource`, `bySource` and
`explicit` follow from the records that named them, so a `u_` concept has the same shape as a stone
concept: `inScheme: ["Posts", "site"]`, `prefLabel` with the label under both, `altLabel` with an
empty list per scheme.

Provenance on a tag (PROV terms): an `explicit` tag `wasDerivedFrom` one
`{type:"category", scheme, label}` per `raw` entry (the category the system wrote) and
`wasGeneratedBy {activity:"ingest", parameters:{}}` (the record stream does not say which adapter
ingested it, so nothing is claimed). An earned tag (`discovered`, `emergent`) carries the
`wasDerivedFrom`/`wasGeneratedBy` its stage wrote on the record, if any: `wasDerivedFrom[0].phrase`
is a span of the item's own words (lower-cased, as `words()` reads them), never the label whose stems
matched it. A PROV field is either present with a value or absent; it is never `null`.

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
