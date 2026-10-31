# How post-pipe uses rosetta-tagz

#post-pipe #rosetta-tagz #rtagz #contract
Rewritten 2026-10-31 (first written 2026-10-22). This is the contract between post-pipe and rosetta-tagz (rtagz for short), the part that finds and categorizes tagz. It says what post-pipe hands rosetta-tagz, what it gets back, where the files live, what a site can set, which stages run, what the feed carries afterwards, and how a build is checked. rosetta-tagz's own file formats are in `rosetta-tagz/docs/FORMATS.md`; this document names the parts post-pipe uses and does not restate them.

Names marked *(provisional)* were chosen by the droids that built them and wait for Harold to confirm or rename them.

## The boundary

- rosetta-tagz is the folder `rosetta-tagz/` in this repository (since 2026-10-31, with its history). It is still its own part: its own programs in `bin/`, its own docs, its own tests (`cd rosetta-tagz && node --test test/*.test.js`; `npm test` does not run them).
- A commit touching `rosetta-tagz/` is a commit of its own, never mixed with post-pipe files.
- post-pipe never imports anything from `rosetta-tagz/lib/`. It writes files, runs `rosetta-tagz/bin/rtz-build` as a separate process, and reads the files that come back.
- post-pipe writes nothing under `rosetta-tagz/`. When rosetta-tagz has to change for post-pipe, the lead droid writes a request to `rosetta-tagz/inbox/from-post-pipe-<date>.md`, and the change lands in a rosetta-tagz commit.
- rosetta-tagz creates no items. Its output is tagz and relations on items that exist because a file or a feed item exists.
- No network. rosetta-tagz has none at run time; post-pipe's only network is the feeds the site's `feeds.opml` lists.
- rosetta-tagz never fails a post-pipe build. A missing engine, a non-zero exit, a timeout, unreadable output or a thrown error is one logged line, and the build goes on with the tagz as the sources wrote them.

## A site turns it on

rosetta-tagz runs for a site only when that site's own `settings.json` has an `rtagz` block with `enabled: true`. A site without the block, such as epicofelinorjones.com, is built exactly as before, byte for byte. The engine has no settings of its own that turn it on for anyone.

```json
"rtagz": {
  "enabled": true,
  "discover": true,
  "emerge": true,
  "overrides": "rtagz-overrides.json",
  "ledger": "rtagz-ids.json",
  "timeoutMs": 120000,
  "engine": "rosetta-tagz",
  "conceptSchemes": [],
  "skos": { "base": "urn:rosetta-tagz:", "lang": "en" }
}
```

What a site can set, all in that block:

| key | default | what it does |
|---|---|---|
| `enabled` | `false` | turns rosetta-tagz on for this site |
| `discover` | `false` | proposes tagz for items no source tagged, from phrases that recur across items (`rtz-discover`); a site of untagged wire items needs it |
| `emerge` | `true` | lets an item earn a tag from its text, against the concepts `rtz-stone` made (`rtz-emerge`) |
| `overrides` | `rtagz-overrides.json` | the site's own decisions, in rosetta-tagz's overrides format, relative to the site; absent is fine. Its `config` key reaches `rtz-stone` only (below) |
| `ledger` | `rtagz-ids.json` | the ids file, where `rtz-stone` keeps concept ids from one build to the next, relative to the site. Worth tracking in the site's git |
| `timeoutMs` | `120000` | `rtz-build` is stopped after this long; the build goes on with the tagz as written |
| `engine` | `rosetta-tagz` | the folder holding rosetta-tagz's `bin/`, relative to post-pipe's root, not the site; absent or missing, one logged line and raw tagz |
| `conceptSchemes` | none | published vocabularies the site vendors, each `{ id, path }`, the path relative to the site. Passed to `rtz-build`; rosetta-tagz has no stage that reads them yet (below) |
| `skos` *(provisional)* | rosetta-tagz's defaults | the SKOS files' switches: `base`, the IRI concepts and schemes are named under (default `urn:rosetta-tagz:`, which names nothing on the web), and `lang`, the language tag on labels (default `en`, `null` for none); `false` writes no SKOS files |

Old names are still read, each with one logged line, until the site renames them: a settings block called `stone` (the block's name before 2026-10-31), and the files `stone.ledger.json` and `stone.overrides.json`.

### Not yet settable from a site

These exist in rosetta-tagz, but nothing a site writes reaches them today. Nothing here should be read as a setting a site can use.

- **Discovery's parameters**: `discover.sourceCoherenceRatio` (the bar, 1.6), `discover.sourceRatioFloor` (1.0), `discover.nearCopyGrouping` (`chain`), `nearCopy`, `minDf`, `maxDfRatio`, `perItem` and the rest of `discover.*` in `rosetta-tagz/lib/config.js`.
- **Emergence's parameters**: `emerge.maxDfRatio`, `emerge.minWeight`, `emerge.minContext`.
- **Why**: `rtz-discover` and `rtz-emerge` read their parameters from `rtz-build`'s `engine` block, and post-pipe writes no `engine` block (in a site's settings, `rtagz.engine` already means the engine folder). The overrides file's `config` key reaches `rtz-stone` alone, so `mergeThreshold`, `relate.*` and the other clustering and relation parameters *can* be set there, and the discovery and emergence ones cannot. Making them settable needs either rosetta-tagz passing the overrides `config` on to discovery and emergence, or a pass-through block in the site's settings whose name Harold chooses.
- **Seeds**: `rtz-build`'s `seeds` and `noSeed`.
- **Vocabularies**: `conceptSchemes` is passed through, but rosetta-tagz has no vocabulary format, no `rtz-vocab` and no `rtz-map` yet, so a listed vocabulary changes nothing (on hold by Harold's decision of 2026-10-31).

## Where the files live

| file | where | written by |
|---|---|---|
| the cache folder | `.feed-cache/rtagz/<site>-<hash>/` under post-pipe's working folder: `<site>` is the site folder's name, `<hash>` the first eight hex digits of the sha1 of its absolute path, so two sites of one name never share a cache. `.feed-cache/` is git-ignored | post-pipe (`cacheDirForSite` in `src/lib/rtagz.js`) |
| `records.jsonl`, `overrides.json`, `rtz.config.json` | the cache folder | post-pipe, before the run |
| `stone.json`, `records.discovered.jsonl`, `discover.report.json` *(provisional)*, `records.all.jsonl`, `universe.json`, `skos.jsonld`, `skos.ttl`, `build.json` | the cache folder | rosetta-tagz's stages |
| `rtagz-ids.json` | the site folder (setting `ledger`) | `rtz-stone`, every build |
| `rtagz-overrides.json` | the site folder (setting `overrides`) | the site's owner; the engine only reads it |
| `skos.jsonld`, `skos.ttl` | the site's `_site/`, beside `feed.json` | `generate-index.js` copies them from the cache when this build wrote them, and removes ones an earlier build left |

Before each run post-pipe removes the cache folder's SKOS files, since `rtz-build` never clears its output folder: a SKOS file found there afterwards is this build's.

## What post-pipe hands over

Three files in the cache folder.

**`records.jsonl`**, rosetta-tagz's record format, one JSON object per line. For every item of every source that fetched:

```json
{"type":"item","source":"ScienceDaily","id":"<item.id>","title":"<item.title>","text":"<text>","url":"<item.url>","date":"<item.date_published>","kind":"<item.kind or ''>","color":"<feed colour>"}
```

then one tag record per entry of the item's `tags`, in order, as written:

```json
{"type":"tag","source":"ScienceDaily","item":"<item.id>","label":"<tag as written>","weight":1,"origin":"explicit"}
```

- `source` is the tag-system: one `feeds.opml` entry is one tag-system, named by the feed's title as the aggregator resolves it. A second entry with the same title gets ` (<feed id>)` appended. `feed._rtagz.systems` maps each name to its source id.
- `id` is post-pipe's own item id, so the answer can be written back onto the same item. A repeated id in one source is written once and counted as `skippedDuplicateIds`.
- `text` is the best plain text post-pipe has: `content_text`, else `content_html` reduced to text (scripts and styles dropped, tags dropped, entities decoded, whitespace collapsed), else `summary`, else the title.
- `url` matters: rosetta-tagz treats the same article in two systems (same url, or the same long title) as one item.
- A tag the overrides' `ignore` list names (compared trimmed and case-folded) is not written.
- An item with no tagz is written with no tag records.
- A source that failed to fetch contributes nothing and is no tag-system.

**`overrides.json`**: the site's overrides file as it is, plus one `pin` per container tag the site declares in `settings.containment`, pinning that spelling as the canonical of whatever concept it lands in (`"pin": {"act-1": "act-1"}`). The container pins win over the file's on the same key.

**`rtz.config.json`**, `rtz-build`'s config:

```json
{
  "out": ".",
  "sources": [{ "adapter": "jsonl", "path": "records.jsonl" }],
  "overrides": "overrides.json",
  "emerge": true,
  "discover": true,
  "ledger": "/abs/path/to/site/rtagz-ids.json",
  "conceptSchemes": [{ "id": "…", "path": "/abs/path" }],
  "skos": { "base": "…", "lang": "en" }
}
```

`emerge` and `discover` copy the site's settings; `ledger` is the site's ids file made absolute; `conceptSchemes` and `skos` are written only when the site sets them.

Never run a cache folder's `rtz.config.json` by hand: it writes the ids file into the site.

## How a build runs it

```
node <engine>/bin/rtz-build --config .feed-cache/rtagz/<site>-<hash>/rtz.config.json --no-view
```

Run from `src/lib/rtagz.js` with `child_process.spawn` on post-pipe's own `process.execPath` (rosetta-tagz needs Node 22 or later), the cache folder as working folder, `detached: true` so the whole process group can be killed at the timeout. `rtz-build` runs each stage as a program of its own, in this order:

| stage | program | reads | writes |
|---|---|---|---|
| ingest | `rtz-ingest jsonl` | `records.jsonl` | `records.jsonl` again (the same records re-serialized: compare parsed objects, never bytes) |
| discover (when `discover`) | `rtz-discover --report` | `records.jsonl` | `records.discovered.jsonl`, and `discover.report.json` *(provisional)*: what became of each candidate phrase of every untagged item |
| stone | `rtz-stone --ledger` | the records, the overrides | `stone.json`, and the site's ids file |
| emerge (when `emerge`) | `rtz-emerge` | `stone.json`, the records | `records.all.jsonl` |
| universe | `rtz-universe` | `stone.json`, the records | `universe.json` |
| skos (unless `skos: false`) | `rtz-skos` | `universe.json` | `skos.jsonld`, `skos.ttl`; a failure is one line, `rtz-build: skos files not written (…)`, and the build goes on |
| view | `rtz-view` | | skipped (`--no-view`); post-pipe has its own viewer |

Last, `rtz-build` writes `build.json`: `built`, `config`, `stages[]` (name, program, ms), `ledger` (path, minted, reused, retired, splits, merges, this build's events) and `untagged` (below).

## What post-pipe reads back

Two files, `universe.json` and `build.json`, from `runRtagzPhase` in `src/lib/rtagz.js`, between the aggregator's colour phase and its provenance stamping (`src/aggregator.js`), so nothing downstream sees an untranslated tag.

**`universe.json`**: `items[]` (each with `key` `<source>::<id>`, `url`, `title`, and `tags[]` of `{c, w, origin, raw[], sys[], via, why, wasDerivedFrom, wasGeneratedBy, sourceRatio}`), `concepts[]` (id, canonical, pinned, discovered, variants, rank, `inScheme`, `prefLabel` and `altLabel` per scheme, ledger note, `sourceRatio`), `relations[]` (`a`, `b`, `type`, `weight`, `skos`, `why`, `wasDerivedFrom`, `wasGeneratedBy`) and `forbidden[]`. rosetta-tagz's FORMATS.md has every field.

**`build.json`**: `built`, the ledger summary, and `untagged` *(the report's shape is provisional)*:

```
untagged: { bar, count, none, items[]: { key, source, id, title, reason, reasons[], why[], under[], candidates } }
```

every item that ends with no tag shown at the build's bar (`discover.sourceCoherenceRatio`), with its tagz under the bar (`under`, each `{concept, label, origin, sourceRatio}`), the reasons as codes (`underBar`, `underFloor`, `nearCopy`, `tooCommon`, `incoherent`, `dropped`, `notChosen`, `noRecurring`, `noCandidate`, `noDiscovery`; provisional) and as sentences (`why`), and every candidate phrase grouped by what became of it.

**The join.** Each post-pipe item is looked up in `universe.items` by `<source>::<id>`. If absent, rosetta-tagz folded it into another system's copy of the same article, and post-pipe finds the copy by the canonical url (hostname lower-cased without `www.`, path without a trailing slash, no query, no fragment, lower-cased) or, with no url, by the folded title when it is 24 characters or longer. A folded item gets the union of both systems' tagz. An item still not found keeps its tagz and is counted as `unjoined`.

**The container guard.** After the build, every container tag that some item carries must be some concept's canonical. If one is not, the phase logs one line naming it and leaves the whole site's tagz as written: a container quietly losing its pieces is worse than an untranslated graph.

## What the feed carries

Nothing below is written when rosetta-tagz is off, skipped or failed.

**On each joined item**

- `tags`: the concepts' canonical labels (the `site` scheme's prefLabel), de-duplicated, explicit tagz first in the order the item first wrote any of their spellings, then earned tagz by weight, ties alphabetical.
- `_references`: every non-tag entry kept, then one tag reference per entry of `tags`:

  ```json
  {"type":"tag","value":"Artificial Intelligence","concept":"c_ai","origin":"explicit","weight":1,
   "systems":["ScienceDaily","My Posts"],"forms":{"ScienceDaily":["AI"],"My Posts":["artificial intelligence"]},
   "via":"known","why":null,"prefLabel":{"site":"Artificial Intelligence","ScienceDaily":"AI"},
   "wasDerivedFrom":[…],"wasGeneratedBy":{…},"sourceRatio":2.964}
  ```

  `prefLabel`, `wasDerivedFrom`, `wasGeneratedBy` and `sourceRatio` only where rosetta-tagz gave them; an explicit tag's `why` is `null`.
- An item `build.json` lists as untagged also gets one reference `{"type":"untagged","why":[…],"reason":"…","reasons":[…],"under":[…]}` *(the type name is provisional)*, so its own reference list says why it shows no tag. An older note of that type is replaced on every build. Nothing is forced onto the item: it keeps exactly the tagz rosetta-tagz gave, under the bar or none.

**Edges**

- A card-to-tag edge (`layer: "tag"`, `role: "tagged"`, target `tag:<label>`) carries `attrs: {concept, weight, origin}` from the item's reference, plus `why`, `wasDerivedFrom`, `wasGeneratedBy` and `sourceRatio` where present (`src/corpus/buildEdges.js`).
- Relation edges (`src/corpus/relationEdges.js`), from `feed._rtagz.relationList`: one edge between two tag nodes per SKOS relation, `layer` and `role` the SKOS name (`broader`, `related`, `closeMatch`, `broadMatch`, `relatedMatch`, `exactMatch`), `directed` for `broader` and `broadMatch` with the arrow on the broader tag (in rosetta-tagz's `{a, b}` for those two types, `a` is the broader), `attrs {concept: a, target: b, weight, why, wasDerivedFrom, wasGeneratedBy}`. Only between two tagz drawn on joined items, never to a container tag or a container's concept, never to an external vocabulary's concept.

**On the containers**

Each container whose tag rosetta-tagz resolved carries `concept` *(provisional)*, its tag's concept id, in `feed.containers` and in the containment the edges are built from. A piece belongs to a container when one of its tag references names that concept, whatever label the concept shows, else when its `tags` hold the container's tag string (`src/lib/containers.js`; used by `buildEdges.js`, `GraphViewer.jsx`, `graphColors.js` and `readerNav.js`). Without rosetta-tagz there is no `concept`, and membership is the tag string, as it always was.

**`feed._rtagz`**

```json
{
  "built": "…",
  "systems": {"ScienceDaily": {"sourceId": "…", "items": 60, "tagged": 0}},
  "concepts": [{"canonical": "…", "id": "c_ai", "pinned": false, "discovered": false, "items": 14,
                "forms": {}, "rank": [], "inScheme": [], "prefLabel": {}, "altLabel": {},
                "broader": [], "mappings": [{"type": "closeMatch", "target": "c_x", "weight": 0.6, "why": "…"}],
                "ledger": {"since": "…", "event": "reused", "previousLabel": "…"}, "sourceRatio": 1.7}],
  "unjoined": 0,
  "skippedDuplicateIds": 0,
  "schemes": [{"id": "site", "label": "<settings.site.title>", "kind": "site"},
              {"id": "ScienceDaily", "label": "ScienceDaily", "kind": "system", "sourceId": "…"},
              {"id": "discovered", "label": "discovered", "kind": "discovered"}],
  "relations": {"related": 92, "broader": 9},
  "relationList": [{"a": "…", "b": "…", "type": "broader", "weight": 1, "why": "…", "wasDerivedFrom": [], "wasGeneratedBy": {}}],
  "mappings": {"relatedMatch": 8},
  "untagged": {"bar": 1.6, "count": 12, "items": [{"id": "<post-pipe item id>", "source": "<tag-system>", "why": ["…"],
               "reason": "underBar", "reasons": [], "under": [{"concept": "…", "label": "…", "origin": "discovered", "sourceRatio": 1.514}],
               "candidates": {}}], "none": 5},
  "containers": {"act-1": "c_act_1"},
  "external": {},
  "ledger": {"minted": 0, "reused": 191, "retired": 0}
}
```

- `concepts` holds only concepts on at least one item, keyed by `canonical` and carrying `id`. Each field is written only where rosetta-tagz wrote it.
- `schemes`: the site's own scheme is labelled with the site's title; `site` and `discovered` are rosetta-tagz's scheme ids *(provisional)*.
- `relationList`: the `skos: true` relations between two of rosetta-tagz's own concepts, each pair once.
- `untagged`: `count` is the post-pipe items listed (a folded article names every item folded into it), `none` those with no tag at any ratio, `bar` the build's bar. A viewer set at a ratio v shows a listed card's tag again once one of its `under` ratios is at or above v, without a rebuild.
- `containers` *(provisional)*: each container tag resolved to its concept id.
- `relations`, `relationList`, `mappings`, `untagged`, `containers`, `external` and `ledger` are written only when there is something in them.

## What the viewer does with it

- **Scheme and depth** (panel; preferences `conceptScheme`, and `broaderDepth` *(provisional)*, 0 to 2): relabel the tag bubbles by the chosen scheme's prefLabel, read that many steps up `broader`, without a rebuild (`src/lib/schemeLabels.js`). Tagz that reach one concept at that depth share one bubble. A tag with no label in the chosen scheme falls back to the site's, then the majority system's, then discovered, and is drawn with a dashed outline.
- **Positions** key on `concept:<id>` for a tag whose edge names a concept (`tag:<label>` without one), migrated once from the label, and from the ledger's `previousLabel`.
- **Source coherence ratio** (panel slider; preference `minSourceRatio`, null for the build's bar): a card-to-tag edge shows when it has no `sourceRatio` or one at or above the value; a tag shows while any of its edges does (`src/lib/sourceRatio.js`). At the build's bar it shows what the build at that bar has; at other values it approximates a fresh build (rosetta-tagz FORMATS.md, "Trying another bar").
- **Hide tagz on fewer than N cards** (preference `minTagPieces`).
- **Relations**: choosing a tag draws thin lines to its five strongest relatives, with a control for the rest; lines to tagz folded into another bubble go to that bubble unless "Lines to folded tagz" says to leave them out (preference `foldedRelatives`).
- **Hover**: a card-to-tag edge shows its role, its why and the PROV pair ("derived from …", "generated by …"); a relation line shows its type, weight, why and the PROV pair (`src/lib/provenance.js`).
- **A tag's detail**, shown beside the bubble while it is hovered or chosen (`tagFormsLines` in `src/lib/tagForms.js`): what each system writes, which part of the ranking named it, its label in each scheme (the site's own scheme named by the site's title), each mapping with its type and weight, and, for a bubble standing for several tagz at the chosen depth, the tagz it stands for.

## Checking a build

- `node tools/rtagz-report.js <feed.json> [--ratio 1.6] [--depth N] [--scheme ID]`: cards, tag edges by origin, tag nodes, single-card tagz, cards with no tag, card pairs sharing a tag within and across sources, and the why check (each discovered tag's "recurs in N of M items" against the cards carrying it), counted as the viewer shows them at the given ratio.
- `node tools/rtagz-labels-check.js <site folder> [--feed path] [--cache dir]`: traces every label the feed carries to a record's label, an item's text, the site's overrides or an enabled vocabulary, and exits 1 on any label with no origin.
- `python3 rosetta-tagz/tools/skos-check.py <folder with skos.ttl and skos.jsonld>`: rdflib parses both files, checks they are the same graph, and runs the SKOS integrity checks (one prefLabel per language per concept and per scheme, prefLabel and altLabel disjoint, no broader cycle, related or closeMatch not mixed with broader, exactMatch not mixed with broadMatch or relatedMatch); exits 1 on any failure. Needs rdflib; installs nothing.
- **Measure before and after on frozen feeds.** Real feeds turn over hourly. Serve saved feed text locally, point a scratch copy of the site's `feeds.opml` at it, and build into a scratch copy of the site (copy `settings.json`, `feeds.opml`, `rtagz-ids.json`, `favicon.svg`), never into a site's own `_site`.
- **epicofelinorjones.com stays byte-identical**: build it with the old and the new engine (`POSTPIPE_ENGINE=<checkout> node scripts/build.js` in a scratch copy) and compare `_site/feed.json` and `_site/haroldyoung/feed.json`.

## Tests

- `test/rtagz.test.js`: record writing, overrides merging with container pins, the write-back (tagz, references, edges' attrs, `feed._rtagz`), the untagged report and the untagged note on a card, the skip paths (disabled, missing engine, non-zero exit, timeout, container guard), the old names, the SKOS settings pass-through, and the real engine when `rosetta-tagz/bin/rtz-build` (or `POSTPIPE_RTAGZ_ENGINE`) exists, skipped otherwise.
- `test/containers.test.js`: containment by concept through the four places that decide it. `test/buildEdges.test.js`, `test/graphColors.test.js` and `test/readerNav.test.js` pin the tag-string path and do not know rosetta-tagz exists.
- `test/relationEdges.test.js`, `test/schemeLabels.test.js`, `test/sourceRatio.test.js`, `test/tagForms.test.js`, `test/tagNetwork.test.js`, `test/provenance.test.js`, `test/rtagzReport.test.js`, `test/rtagzLabelsCheck.test.js`: the pieces above.
- rosetta-tagz's own suite covers its stages, `rtz-skos` and the untagged report (`rosetta-tagz/test/`).

## Not in this seam yet

- Published vocabularies: the format, `rtz-vocab`, `rtz-map` (on hold).
- Discovery and emergence settings a site can set (above).
- Feeding a reader's decisions in the viewer back into the site's overrides file.
- Relaxing the container guard now that containment can follow concept ids.
