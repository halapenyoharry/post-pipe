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
| `relations` | `[{"a","b","type","note"}]` | `broader`, `narrower`, `contains`, `related`, `adjacent`, `synergy`, `opposes`; stored `locked` |
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
  links[]:    {a, b, conf, cooc, signals{name:{score,why}}}              // evidence inside the concept
}
relations[]: {a, b, type, weight, evidence, locked}      // a,b are concept ids; for `broader`, a ⊃ b
```

`discovered: true` means no human ever wrote any spelling in the concept (only rtz-discover proposed it).
Concept ids are `c_` + the lexicographically smallest member norm: stable under weight changes,
changing only if membership changes. Reference concepts in overrides by label, never by id.

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

Relation types: `broader` (usage subsumption, Sanderson & Croft 1999, or seed/human), `related`
(normalised PMI, shrunk by support), `adjacent` (similar texts, never co-tagged), `near` (probably the
same, short of a merge: review), `synergy`, `opposes` (human only).

## `universe.json`

```
schema, generated, canon, sourceWeights, stats, sources[{name,color,weight,items,tagged}]
concepts[]   as in the stone, plus n (tagged items), nEmergent (earned/discovered), unmapped?
relations[]  as in the stone
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
