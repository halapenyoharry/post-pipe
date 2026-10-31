# How post-pipe uses rosetta-tagz

#post-pipe #rosetta-tagz #rtagz #contract
Written 2026-10-22. The contract between post-pipe and rosetta-tagz (rtagz for short), the project that finds and categorizes tags. Since 2026-10-31 rosetta-tagz is a folder in this repository, `rosetta-tagz/`, with its history, and it is still its own part: its own programs in `bin/`, its own docs, and its own tests, which `npm test` does not run (`cd rosetta-tagz && node --test test/*.test.js`). A commit touching `rosetta-tagz/` is still a commit of its own, never mixed with post-pipe's. post-pipe never imports rosetta-tagz's `lib/`. It writes files rosetta-tagz reads, runs rosetta-tagz's programs, and reads the files they write. Everything below is that exchange. rosetta-tagz's own formats are documented in `rosetta-tagz/docs/FORMATS.md`; this file does not restate them, it says which of them post-pipe uses and how.

## Why

Each source post-pipe loads brings its own tag vocabulary. Today every `<category>` a publisher writes becomes a tag node as written, so the graph shows each publisher's opinion beside the others, and a source with no categories lands as isolated items. rosetta-tagz merges equivalent spellings across sources into concepts, picks one canonical label per concept by explainable weights, keeps every system's own spelling visible, and lets an item with no tags earn tags from its text. After the seam, the tags in the graph are one translated vocabulary, and each tag can still say what each source called it.

## Where

`src/aggregator.js`, `loadCorpus`, has three phases: fetch from every adapter, resolve each feed's colour, then build the sources list and stamp provenance on every item. The rosetta-tagz phase runs after the colours and before the stamping, so records can carry the source colour and so nothing downstream ever sees an untranslated tag. Downstream means `generate-index.js` (which builds `feed.json` and the edges), `src/corpus/buildEdges.js`, the GraphViewer, its layouts, `src/lib/graphColors.js`, `src/lib/readerNav.js` and the ReaderPanel. The inventory of 2026-10-22 found that every one of them reads `item.tags` and nothing reads `item._references` yet.

## A site subscribes, or not

rosetta-tagz is something a site turns on. It is off unless the site's `settings.json` asks for it, in an `rtagz` block. The Elinor Jones site has no such setting and is untouched. post-pipe's own root `settings.json` turns it on for Harold's corpus.

```json
"rtagz": {
  "enabled": true,
  "engine": "rosetta-tagz",
  "overrides": "rtagz-overrides.json",
  "emerge": true,
  "discover": true,
  "timeoutMs": 120000
}
```

- `enabled` — default `false`.
- `engine` — folder holding rosetta-tagz's `bin/`. Relative paths resolve against post-pipe's root, not the site. Default `rosetta-tagz`. If the folder or its `bin/rtz-build` does not exist, the phase logs one line, `rtagz: engine not found at <path>, tags left as written`, and the build continues with raw tags.
- `overrides` — the site's human decisions in rosetta-tagz's `overrides.json` format, relative to the site folder. Optional. Default `rtagz-overrides.json`; silently absent is fine. A site holding only `stone.overrides.json`, the default's name before 2026-10-31, has that file read, with one logged line, until it is renamed.
- `emerge` — let items earn tags from their text against the concepts `rtz-stone` made. Default `true`.
- `discover` — propose tags for tag-systems that share no vocabulary with anything, from phrases recurring across their items. Default `false`, rosetta-tagz's own default. Harold's root settings turn it on, because ScienceDaily has no categories.
- `timeoutMs` — `rtz-build` is killed after this long, logged in one line, and the build continues with raw tags. Default 120000.
- `conceptSchemes` — published vocabularies the site vendors, each `{ id, path }`, the path relative to the site (see `docs/SITES.md`). Optional.
- `ledger` — the ids file, where `rtz-stone` keeps its concept ids from one build to the next, relative to the site. Default `rtagz-ids.json`. A site holding only `stone.ledger.json`, the default's name before 2026-10-31, has that file read, with one logged line, until it is renamed. The key keeps rosetta-tagz's own word for the file: `rtz-build`'s config calls it `ledger` too.

rosetta-tagz never fails a post-pipe build. Any non-zero exit, timeout, unreadable output or thrown error is one logged line and raw tags.

Harold named the block `rtagz` on 2026-10-31. Before that it was `stone`; a site whose settings still say `stone` (and no `rtagz`) is read the same, with one logged line, `rtagz: the settings key "stone" is now "rtagz"; ...`, so it builds until the key is renamed (`rtagzSettings` in `src/lib/rtagz.js`).

## What post-pipe hands over

One folder per site under post-pipe's cache: `.feed-cache/rtagz/<site>/`. `.feed-cache` resolves the same way the colour cache does, relative to the working directory, which is post-pipe's root when `generate-index.js` runs. `<site>` is the basename of the site root followed by a dash and the first eight hex digits of the sha1 of its absolute path, so two sites with the same folder name never share a cache (`post-pipe-3fa2c19b` for the root site). `.feed-cache/` is already git-ignored. Nothing is written under `rosetta-tagz/`.

Into that folder post-pipe writes three files before running `rtz-build`.

**`records.jsonl`** — one line per record, rosetta-tagz's record format. For every item from every source that fetched successfully:

```json
{"type":"item","source":"ScienceDaily","id":"<item.id>","title":"<item.title>","text":"<text>","url":"<item.url>","date":"<item.date_published>","kind":"<item.kind or ''>","color":"<feed colour>"}
```

and, for every entry of that item's `tags` array, in order, as written:

```json
{"type":"tag","source":"ScienceDaily","item":"<item.id>","label":"<raw tag>","weight":1,"origin":"explicit"}
```

- `source` is the tag-system name. One OPML entry is one tag-system. Its name is the feed's title as the aggregator resolves it (`feedMeta.title || config.title`), because the name is shown to readers ("ScienceDaily writes AI"). If two entries resolve to the same title, the second and later get ` (<feed id>)` appended so systems stay distinct. `feed._rtagz.systems` (below) maps every system name to its source id, so nothing joins systems to sources by title.
- `id` is post-pipe's own item id, unchanged, so the result can be written back onto the same item. If two items in one source share an id, the first is written and the rest are skipped and counted in the summary; rosetta-tagz keeps one record per key.
- `text` is the best plain text post-pipe has: `content_text`, else `content_html` reduced to text, else `summary`, else the title. Reducing html to text means: drop `script` and `style` elements with their contents, drop every other tag, decode entities (named and numeric, at least `&amp; &lt; &gt; &quot; &#39;` and `&#NNN;`), collapse whitespace. Emergence and discovery read this; the more text, the better the earned tags.
- `url` matters: rosetta-tagz unifies the same article seen in two systems by url, or by a long identical title, and that is its strongest alignment evidence. See the join rule below for how that folding is undone on the way back.
- Tags named in the merged overrides' `ignore` list are not written at all. post-pipe compares trimmed and case-folded; finer folding is rosetta-tagz's business. This is done on the way in because `rtz-stone` honours `ignore` but `rtz-universe` reads the raw records again and would hand an ignored tag back as an unmapped concept.
- Items with no tags are written with no tag records. They are the orphans emergence and discovery exist for.
- A source that failed to fetch contributes nothing and is not a system.

**`overrides.json`** — the merge of two things, written by post-pipe, in rosetta-tagz's overrides format:

1. The site's own overrides file, if present, verbatim.
2. One `pin` per container tag the site declares in `settings.containment` (each entry's `tag`), pinning that spelling as the canonical label of whatever concept it lands in: `"pin": {"act-1": "act-1"}`. The site's pins come second and win over the file's on the same key.

The pins are what keep containers working. Containers match items by exact string equality on `item.tags` in four places (`buildEdges.js`, `GraphViewer.jsx`, `graphColors.js`, `readerNav.js`). If `rtz-stone` chose another spelling for a concept that a container names, the container would go empty. Pinning makes the container's spelling the canonical one, which is also rosetta-tagz's own philosophy: humans win and are never overwritten.

Two limits of pinning, and the guard. A pin whose spelling no item carries is inert: no concept contains it, nothing is pinned, and nothing is lost, because no item had the tag. And a pin is matched by norm against a concept's members, first match wins, so if two container tags fold into one concept only one of them can be canonical. The guard: after reading the universe back, post-pipe checks that every container tag that appears on at least one item's raw tags equals some concept's `canonical`. If any does not, the rosetta-tagz phase logs one line naming the tag and leaves that whole site's tags as written. A container going quietly empty is worse than an untranslated graph.

**`rtz.config.json`** — the config for `rtz-build`, generated:

```json
{
  "out": ".",
  "sources": [{ "adapter": "jsonl", "path": "records.jsonl" }],
  "overrides": "overrides.json",
  "emerge": true,
  "discover": true
}
```

`emerge` and `discover` copy the site's settings. Paths are relative to the config file, so `out: "."` is the same cache folder.

## How a build runs it

```
node <engine>/bin/rtz-build --config .feed-cache/rtagz/<site>/rtz.config.json --no-view
```

Run with `child_process`, `cwd` the cache folder, `stdio` captured, `detached: true` so the whole process group can be killed on timeout (`rtz-build` runs each stage synchronously as a child of its own, and killing only the parent would orphan the running stage). rosetta-tagz requires Node 22 or later; post-pipe runs it on the same `process.execPath`. `--no-view` skips `rtz-view`, rosetta-tagz's HTML viewer; post-pipe has its own. `rtz-build` writes `records.jsonl` back over the one post-pipe wrote (the same records re-serialised, so compare parsed objects, never bytes), then `stone.json`, `records.all.jsonl`, `universe.json` and `build.json` beside it, plus `records.discovered.jsonl` when `discover` is on and `engine.json` when the config sets `engine`. post-pipe reads two of these.

## What post-pipe reads back

**`universe.json`** is the joined model. post-pipe uses:

- `items[]` — each with `key` (`<source>::<id>`), `source`, `alsoIn[]`, `url`, and `tags[]`. Each tag has `c` (concept id), `w` (weight, 1 for explicit), `origin` (`explicit`, `emergent`, `discovered`), `raw[]` (what was written: `l` label, `n` norm, `s` system), `sys[]` (which systems contributed it), `via`, and `why` for earned tags.
- `concepts[]` — each with `id`, `canonical`, `pinned`, `n`, `variants[]` (each with `label`, `count`, `formsBySource`), `rank[]` (each candidate's `score` and `parts` `freq`, `cover`, `trust`, `quality`), and `sources`. `discovered` is present on the concepts `rtz-stone` made. Tags `rtz-stone` never clustered come back as unmapped singleton concepts with ids starting `u_`: those carry `unmapped: true` and lack `discovered`, `variants` and `rank`; read a missing `discovered` as false.
- `relations[]` — `a`, `b` (concept ids), `type`, `weight`, `skos` (true for a relation SKOS has a name for), and `why`, `wasDerivedFrom`, `wasGeneratedBy` where `rtz-stone` wrote them. post-pipe reads only the `skos: true` ones. Direction, pinned here because rosetta-tagz's own text (`rosetta-tagz/lib/stone.js`, the code behind `rtz-stone`, and `rosetta-tagz/docs/FORMATS.md`) states it and post-pipe draws arrows from it: in `broader {a, b}` a is the broader concept (a ⊃ b), and a `broadMatch` between two of rosetta-tagz's own concepts is a cross-scheme `broader` renamed with the pair kept, so a is the broader concept there too. The symmetric types (`related`, `closeMatch`, `relatedMatch`, `exactMatch`) may be written either way round; post-pipe reads each unordered pair once, the first entry kept. A relation whose `b` is an external vocabulary id (`<schemeId>:<id>`) is a mapping on concept `a`, not a pair between tags; post-pipe reads a `broadMatch` mapping as the vocabulary concept being the broader one (the plan's propagation rule: `broader(A, B)` with `A exactMatch X` gives `broadMatch(B, X)`), the reverse of the own-concept convention. rosetta-tagz has no map stage (`rtz-map`) yet, so that reading is post-pipe's and must be confirmed against rosetta-tagz when the stage lands (2026-10-25).

**`build.json`** — `rtz-build`'s manifest: `built`, `config`, and `stages[]` with each stage's `name`, `program` and `ms`. Copied into the feed summary.

Join rule. For each post-pipe item, look up `universe.items` by `<source>::<id>`. If present, that is the item. If absent, rosetta-tagz folded this item into another system's copy of the same article, and the surviving universe item is the representative: the member with the longest excerpt (280 characters), ties to the smaller key. Its `url` and `title` are the representative's, so raw equality will not find it. Folding happens on the canonical url, which rosetta-tagz computes as: hostname lower-cased with a leading `www.` removed, path with a trailing slash removed, lower-cased, no query, no fragment. When a record has no url, folding happens on the title folded the way rosetta-tagz folds labels, and only when that folded title is 24 characters or longer. post-pipe rebuilds the same canonical url for its own items (four lines, a format, not an import), indexes the universe items by the canonical url of their `url`, and finds the representative there. Items with no url and a short title are never folded, so the key lookup always finds them. If still absent, the item keeps its raw tags and is counted as unjoined in the summary. A folded item receives the union of both systems' tags, which is the point of folding.

## What post-pipe writes onto items

For each joined item:

- `tags` becomes the concept canonical labels of its universe tags, deduplicated, explicit before earned. The universe lists an item's tags sorted by concept id, which is not the author's order, so post-pipe orders them itself: explicit tags by the first position in the item's original `tags` of any of their `raw[].l` spellings, then earned tags by `w` descending, ties alphabetical. A canonical label is a spelling some system actually wrote, an acronym with its dots and spaces removed (`A.I.` becomes `AI`), or a pin. Two raw tags that merged into one concept become one entry.
- `_references` keeps every non-`tag` entry as it was. Its `tag` entries are replaced by one per entry of the new `tags`, in the same order:

```json
{"type":"tag","value":"Artificial Intelligence","concept":"c_ai","origin":"explicit","weight":1,"systems":["ScienceDaily","My Posts"],"forms":{"ScienceDaily":["AI"],"My Posts":["artificial intelligence"]},"via":"known","why":null}
```

`forms` lists what each system wrote for this concept on this item. `why` is rosetta-tagz's reason string for earned tags; rosetta-tagz leaves it absent for explicit tags and post-pipe writes `null`. `concept` is informational: see Keying below.

- Items not joined, or when rosetta-tagz is off or skipped, are untouched.
- Tag edges gain attributes. `buildEdges.js` emits tag edges with no `attrs` today; after the seam, when an item's reference for that tag exists, the edge carries `attrs: { concept, weight, origin }` from it, plus `why`, `wasDerivedFrom` and `wasGeneratedBy` when the reference has them (an explicit tag's `why` is null and stays out). This is additive; every edge consumer ignores attributes it does not know, and the existing tests do not assert their absence. The attrs come from the item's `_references`, whatever wrote them: a site with rosetta-tagz off whose JSON Feed items already carry references in this shape gets the same attrs. The byte-identity promise is for a site with no rosetta-tagz and no upstream `_references`.
- Relation edges (2026-10-25). `src/corpus/relationEdges.js` turns `feed._rtagz.relationList` into edges between tag nodes: `source` and `target` are `tag:<site prefLabel>`, `layer` and `role` are the SKOS name (`broader`, `related`, `closeMatch`, `broadMatch`, `relatedMatch`, `exactMatch`; `narrower` and `narrowMatch` are never written), `directed` for `broader` and `broadMatch` with the arrow landing on the broader concept (source the narrower tag), one edge per unordered pair for the rest, `attrs { concept: a, target: b, weight, why, wasDerivedFrom, wasGeneratedBy }` where present. An edge exists only where both concepts are tags on a joined item and neither is a container tag (`settings.containment[].tag`); a mapping to an external id makes no edge. `generate-index.js` appends them to `feed.edges` when rosetta-tagz ran. Since 2026-10-27 the viewer keeps them aside from its links whatever `graph.visibleLayers` says (`src/lib/tagNetwork.js`): they never reach the link force, so they move nothing, and they are drawn only while a tag is selected, from it to its relatives, the strongest five by weight with a control under the tag for the rest, each line's type, weight and why in the edge label. A relation edge whose tag nodes are not drawn, or are hidden (by their feeds, the panel's pieces per tag, or the depth), is left out at the viewer, not an error.

Onto the feed, `generate-index.js` adds `feed._rtagz`:

```json
{
  "built": "<from build.json>",
  "systems": {"ScienceDaily": {"sourceId": "<feed id>", "items": 60, "tagged": 0}, "...": {}},
  "concepts": [{"canonical": "Artificial Intelligence", "pinned": false, "discovered": false, "items": 14, "forms": {"ScienceDaily": {"AI": 9}, "My Posts": {"artificial intelligence": 5}}, "rank": [{"label": "Artificial Intelligence", "score": 0.81, "parts": {"freq": 0.7, "cover": 1, "trust": 0.9, "quality": 0.8}}]}],
  "unjoined": 0,
  "skippedDuplicateIds": 0,
  "schemes": [{"id": "site", "label": "<settings.site.title>", "kind": "site"}, {"id": "ScienceDaily", "label": "ScienceDaily", "kind": "system", "sourceId": "<feed id>"}, {"id": "discovered", "label": "discovered", "kind": "discovered"}, {"id": "iptc-mediatopics", "label": "IPTC Media Topics", "kind": "external", "license": "CC BY 4.0"}],
  "relations": {"related": 12, "broader": 3},
  "relationList": [{"a": "c_ai", "b": "u_neural_hardware", "type": "broader", "weight": 1, "why": "...", "wasDerivedFrom": [], "wasGeneratedBy": {}}],
  "mappings": {"exactMatch": 4, "broadMatch": 2},
  "untagged": {"count": 4, "items": [{"id": "<item id>", "source": "<feed id>", "why": ["..."]}]},
  "external": {"iptc-mediatopics:20000763": {"prefLabel": "artificial intelligence", "broader": ["iptc-mediatopics:20000756"]}},
  "ledger": {"minted": 0, "reused": 223, "retired": 0}
}
```

`concepts` is keyed by `canonical` and carries the per-system forms and the ranking, so the GraphViewer can show, on a tag node, what each system calls it and why this name won. Only concepts that appear on at least one item are included. Since 2026-10-25 each concept also carries `id`, `inScheme`, `prefLabel` and `altLabel` per scheme, `broader` (the concept's own list when the universe wrote one, else read from the `broader` relations), `mappings[{type, target, weight, why}]` and `ledger {since, event, previousLabel}`; `schemes`, `relations`, `relationList`, `mappings`, `untagged`, `external` and `ledger` are written only when there is something to write. `relationList` is the pairs the relation edges are drawn from: the `skos: true` relations between two of rosetta-tagz's own concepts, each pair once, as written. It is built from `relations[]` alone; a `broader` a concept states on itself without a matching relation is descriptive (it reaches the label walk in `src/lib/schemeLabels.js`) and draws no edge.

## Keying

Tag node ids stay `tag:<label>` where `<label>` is the canonical label. Since 2026-10-25 a tag node whose first tag edge names a concept keys its saved position on `concept:<id>` (GraphViewer `persistKey`), and `viewState.migrateNodeKeys` copies an arrangement filed under `tag:<label>` (and under the ledger's `previousLabel`) to that key once per feed, never overwriting; a tag with no concept (no rosetta-tagz) keys on `tag:<label>` as before. A tag collapsed with others at a depth above 0 keys on the reached concept (`concept:<groupId>`). The paragraph that follows records the state before the ledger made ids stable. Concept ids today are `c_` plus the lexicographically smallest member norm, and move when a cluster's smallest member changes (rosetta-tagz's `docs/DESIGN.md` lists persisting them as future work). Until that is settled, post-pipe persists nothing keyed on concept id. The `concept` field written onto references is for reading and debugging, not for keys. When a canonical label changes between builds, the tag node's saved position is orphaned; that is accepted for now and should be stated in the viewer's known issues.

## What never crosses the seam

- post-pipe does not import anything from `rosetta-tagz/lib/`.
- post-pipe does not write into `rosetta-tagz/` at all, not `out/`, not `local/`, not `seed/`.
- post-pipe's code does not change rosetta-tagz and does not write into its folder. When rosetta-tagz needs to change to satisfy this contract, the lead droid, not the build, writes a request to `rosetta-tagz/inbox/from-post-pipe-<date>.md` and tells Harold; another lead may own that work, and its change lands in a commit of its own.
- rosetta-tagz does not create items. Its output is tags and relations. Emergent and discovered tags are tags on items that exist because a file or a feed item exists.
- No network. rosetta-tagz has none at runtime; post-pipe's only network is the feeds the site lists.

## Tests

In `test/rtagz.test.js`, with a fixture corpus of three tag-systems under `test/fixtures/rtagz/` (small, synthetic, safe to commit):

- Record writing: the aggregator's phase produces the expected records (compared as parsed objects) from fixture items, including an item with no tags, the same article in two systems sharing a url, two feeds with the same title, an ignored tag left out, and a duplicate id skipped.
- Overrides merging: a site overrides file plus two containers yields the expected `overrides.json` with pins, site pins winning.
- Write-back: from a canned `universe.json` fixture, items get the expected `tags` and `_references`, deduplicated, in the specified order; a folded item is found through the canonical url; an unjoined item is untouched; tag edges carry `attrs`; `feed._rtagz` has the expected shape.
- Skip paths: engine path absent, `enabled: false`, timeout, non-zero exit, and a container tag that is not canonical after the build, each leaves tags as written and logs one line.
- The names from before 2026-10-31: a `stone` settings block, and a site holding only `stone.ledger.json` or `stone.overrides.json`, are each read with one logged line.
- The real engine, when present: one test runs `rtz-build` on the fixture and checks that `universe.json` appears and that at least one concept has two forms. It runs `rosetta-tagz/` in this repository, or the engine folder `POSTPIPE_RTAGZ_ENGINE` names, and is skipped, not failed, when that folder has no `bin/rtz-build`.

Existing tests that pin tag behaviour stay as they are: `buildEdges.test.js` (tag edges, containment interception), `graphColors.test.js`, `readerNav.test.js`, `layouts.test.js`, `viewState.test.js`. They run on `item.tags` and do not know rosetta-tagz exists.

## A deliberate narrowing

`vision/DECOMPOSITION.md` has the viewer translating labels through rosetta-tagz at draw time, with the reader choosing which system's vocabulary to read in. This seam translates once, at corpus time, into one vocabulary, and keeps each system's spellings in the references and in `feed._rtagz.concepts`. That is still Layer 2 work, and it is the smaller step. The per-system spellings survive, so a later lens can offer the choice without redoing the corpus.

## Not in this seam

- Stable concept ids across rebuilds (rosetta-tagz's work).
- Feeding a reader's decisions in the viewer back into the site's overrides file.
- SKOS export.
- Translating the containers' own tags through rosetta-tagz instead of pinning them.
