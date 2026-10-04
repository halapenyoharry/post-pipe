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
  variants[]: {norm, label, forms{raw:n}, formsBySource{src:{raw:n}}, count, explicit, bySource{src:n}, acronym, tokens},
  rank[]:     {norm, label, score, parts{freq,cover,trust,quality}},     // why the winner won
  links[]:    {a, b, conf, cooc, signals{name:{score,why}}}              // evidence inside the concept
}
relations[]: {a, b, type, weight, evidence, locked}      // a,b are concept ids; for `broader`, a ⊃ b
```

`discovered: true` means no human ever wrote any spelling in the concept (only rtz-discover proposed it).
Concept ids are `c_` + the lexicographically smallest member norm: stable under weight changes,
changing only if membership changes. Reference concepts in overrides by label, never by id.

Relation types: `broader` (usage subsumption, Sanderson & Croft 1999, or seed/human), `related`
(normalised PMI, shrunk by support), `adjacent` (similar texts, never co-tagged), `near` (probably the
same, short of a merge: review), `synergy`, `opposes` (human only).

## `universe.json`

```
schema, generated, canon, sourceWeights, stats, sources[{name,color,weight,items,tagged}]
concepts[]   as in the stone, plus n (tagged items), nEmergent (earned/discovered), unmapped?
relations[]  as in the stone
items[]: {key, source, alsoIn[], title, excerpt, url, kind, date,
          tags[]: {c: conceptId, w, origin, raw[{l,n,s}], sys[], via, why}}
```

An item's `tags` combine every tag-system it appears in; `sys` says who contributed each tag and `raw`
what they actually wrote. Tags the stone has never seen become `unmapped` singleton concepts (`u_…`).

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
