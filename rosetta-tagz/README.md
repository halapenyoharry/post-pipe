# rosetta-tagz

rosetta-tagz (rtagz for short) sits **between** tag-systems. It notices that `AI`, `ai`, `A.I.` and
`Artificial Intelligence` are one idea, picks the best name by **explainable weights**, and lets you
pull any tag up as a small graph to see what it relates to.

> **Where it lives.** rosetta-tagz is a folder of post-pipe's git repository (it moved in on
> 2026-10-31, its history with it). It is still its own part: its own programs (`bin/`), tests (run
> them from this folder) and docs (`docs/`), no dependencies, and no imports from post-pipe or into it.
> post-pipe reaches it only by running its programs; post-pipe's side of that contract is
> `docs/POST-PIPE-USES-RTAGZ.md` in post-pipe. It writes only where a config's `out` and `ledger` point.

No AI inference by default. No dependencies. No network at runtime (the viewer is one offline HTML file).

```
~/Posts/…  feed.json  archive.tsv  vault/
      │         │           │          │
      ▼         ▼           ▼          ▼
   rtz-ingest ────────────────────────────►  records.jsonl     items + tags, one JSON per line
      │
      ├─ rtz-discover   (optional)           new tags for untagged items, from recurring phrases
      ▼
   rtz-stone  ◄── overrides.json  ◄── you    concepts, canonical labels, relations   → stone.json
      │
      ├─ rtz-emerge                          tags an item's TEXT earns from known concepts
      ▼
   rtz-universe                              stone.json + items joined               → universe.json
      │
      ├─ rtz-graph   raw | hyper | dyadic | concepts   → {nodes, links} for any renderer
      └─ rtz-view                                      → one standalone 3D HTML file
```

Every box is a separate program. They pass JSON Lines over stdin/stdout, so you can `jq`, `sort`,
`tee`, or replace any stage with your own.

## Quick start

```bash
cd ~/Projects/post-pipe/rosetta-tagz
npm test                                            # 158 tests, ~2 s
bin/rtz build --config examples/synthetic/rtz.config.json
open out/synthetic/view.html                        # or serve out/ on a local port
```

For your own data, copy `examples/synthetic/rtz.config.json`, list your sources (below), and run
`bin/rtz build --config your.config.json`. Output goes to the `out` folder the config names.

## What you get

For each concept (a cluster of equivalent tags across tag-systems):

| | |
|---|---|
| **canonical label** | the winning spelling, chosen by four weighted parts (below) |
| **why** | every candidate's score broken into `freq`, `cover`, `trust`, `quality` |
| **what each system calls it** | `Journal writes ai · Wire writes AI · Archive writes A.I.` |
| **relations** | `broader`/`narrower`, `related`, `adjacent`, `near`, plus your own `synergy`/`opposes` |
| **items** | including tags an item *earned from its text* (dashed) |

### How the canonical label is chosen

Each candidate spelling is scored 0..1 on four independent parts, then combined by weights you control:

| part | meaning | default weight |
|---|---|---|
| `freq` | how often it is used (log-scaled) | 0.35 |
| `cover` | what share of the concept's tag-systems use it | 0.25 |
| `trust` | how much the *trusted* systems favour it (per-system share × system trust) | 0.25 |
| `quality` | clean display form; `prefer: expanded \| short \| neutral` | 0.15 |

`rtz-lookup stone.json ai` prints the whole table. In the viewer the same sliders re-run the scoring
live, and an `overrides.json` fragment appears so a choice you like can be kept.

### What counts as "the same" (and what deliberately does not)

Merging needs **identity evidence**; similar *usage* only ever produces relations.

| signal | says | strength alone |
|---|---|---|
| `stem` | same words after plural/gerund folding (`system thinking` = `systems thinking`) | merges |
| `tokenset` | same words, different order | merges |
| `seed` | a curated alias group (`seed/common.json`, or your own) | merges |
| `anchor` | the *same item* appears in two systems with different tags | grows with evidence |
| `edit` | spelling variant (`labor`/`labour`) | review queue only |
| `acronym` | initials (`ml` ↔ `machine learning`) | review queue only |
| `text` | tags used on similar texts (needs ≥ 2 items each) | corroborates only |

Signals combine by noisy-OR. Tags that **co-occur on one item in one system** are probably not
synonyms (the author used both), so fuzzy evidence is discounted for them: `AI` and `AGI` stay apart.
Merging is average-linkage with a size cap, so chains like `AI → ML → learning → school` cannot form.

Pairs with real but insufficient evidence become `near` relations: a **review queue**.

```bash
bin/rtz lookup out/stone.json --review        # what to decide, with the evidence and the exact command
bin/rtz override same Labor labour            # record the decision (writes overrides.json only)
bin/rtz build --config …                      # rebuild
```

## Sources (adapters)

| adapter | reads |
|---|---|
| `jsonfeed` | JSON Feed 1.1 and post-pipe's `feed.json` (one feed splits into its real sources via `_source.title`) |
| `frontmatter` | `<piece>/frontmatter.json` (post-pipe Gen-2) or the YAML header of `index.qmd`/`index.md` (Gen-1). `--field idea.topology` reads a different vocabulary of the same pieces as its own tag-system |
| `markdown` | `.md` with YAML `tags:`; `--inline` adds `#hashtags` (Obsidian) |
| `pairs` | `item<TAB>tag[<TAB>title<TAB>url]`, the lowest common denominator |
| `jsonl` | already in record format |

Two tag-systems over the **same item** (same URL or same long title) are recognised as one item that
carries both vocabularies. That is also the strongest alignment evidence there is.

## Tags nobody wrote

- **`rtz-emerge`**: an item whose *text* mentions a known concept earns that tag (weight < 1, with a reason).
  Single generic words (`process`, `water`) are only accepted if the item also *reads like* the items that
  carry the tag. Acronyms only match in capitals.
- **`rtz-discover`** (opt-in): for tag-systems that share no vocabulary with anything (a news wire with no
  categories), finds phrases that **recur** in ≥ 2 items and are not everywhere, and proposes them as
  tags (`origin: "discovered"`). They enter rtz-stone as ordinary evidence, so they can fold into other
  systems' vocabularies, and are attached to your tagged items that contain them, bridging the wire to
  your writing. On the real post-pipe feed this took 60 isolated ScienceDaily items to 43 connected ones.
  Two copies of one story count as one item, and every discovered tag carries its measured
  `sourceRatio`, so a viewer can try a stricter or looser bar without a rebuild (`docs/FORMATS.md`).
  A discovered label is always a spelling the text has (`energy-efficient`, `Jupiter`), never invented.
  Quality is decent, not perfect: leftovers like `think` appear dashed, low-weight, with a visible reason.
  Edit `seed/generic-words.txt` (plain data) to teach it more words that are never topics.

## The viewer

`rtz-view` writes **one HTML file** containing the 3D library, the scoring code and your data. No server.

- **Raw**: every tag as each tag-system wrote it (the duplication rtz-stone removes)
- **Hyper**: items + one node per concept; tags are vertices. Gold = merged several spellings, purple = discovered
- **Dyadic**: tags are not nodes; each is the **label on an edge** between two items (hover an edge)
- **Concepts**: vocabulary only, joined by relations
- Click a node: why it has its name, what each system calls it, relations, items. **Explore** cuts its k-hop neighbourhood
- Sliders: the four weights, `prefer`, and per-system **trust**. Names change live; an `overrides.json` fragment is generated
- Search accepts any spelling (`a.i.` finds AI)

Browsers block `file://` in some embedded panes; any static server on loopback works, e.g.
`python3 -m http.server 1799 --bind 127.0.0.1 --directory out`.

## Using it from somewhere else (post-pipe, exoskeleton)

post-pipe runs the programs and reads their files; it imports nothing from `lib/`.

- **Data**: `universe.json` (documented in `docs/FORMATS.md`) is the whole model in one file; `rtz-graph` emits
  `{nodes, links}` for any force-graph renderer (the viewer uses `3d-force-graph`; exoskeleton already has it).
- **Code**: everything in `lib/` is plain ES modules. `lib/canon.js` and `lib/graph.js` import nothing and run
  in the browser unchanged. `buildStone(records, opts)` and `resolveLabel(indexStone(stone), "any spelling")`
  are the two calls most hosts need.
- **Translation at runtime**: `rtz-translate stone.json < tags.jsonl` rewrites tag records and flags the
  unmapped, so new data degrades gracefully against an older `stone.json`.

## Plugging in a model (optional)

The engine never needs one. If you want embeddings or an LLM to judge pairs, write any program that emits
pair evidence and hand it over:

```bash
my-scorer < records.jsonl > extra.jsonl     # {"a":"courts","b":"criminal justice","signal":"embedding","score":0.92,"why":"…"}
bin/rtz stone records.jsonl --pairs extra.jsonl -o stone.json
```

Unknown signal names count as fuzzy evidence (discounted by co-occurrence, scaled by
`signalWeights` in config). Use `--no-builtin` to rely only on supplied pairs.

## Files

```
bin/            the programs (rtz is a git-style dispatcher: `rtz stone` = `rtz-stone`)
lib/            engine; lib/signals/ one file per evidence signal; lib/adapters/ one per source format
seed/           common.json (alias groups, seed hierarchy), generic-words.txt (data, edit freely)
viewer/         viewer.html template; vendor/ holds the MIT-licensed 3d-force-graph bundle (offline)
examples/       synthetic corpus (4 tag-systems, safe to share) and a full overrides example
test/           node:test; `npm test`
docs/           DESIGN.md (why it is built this way), FORMATS.md (every file format)
out/, local/    build output and private configs. git-ignored: they contain your corpus text
```

## Known limits (honest list)

- English only (stemmer, stopwords, generic words).
- Meaning is never inferred. Two tags that are *synonyms but share no spelling, no item, and no
  initials* will not merge by themselves: they appear as `adjacent` at best. Say so once in
  `overrides.json`, or plug a scorer in.
- Anchoring needs a shared URL or a long identical title. Without one, tag-systems are aligned only by
  spelling, curated seeds, and your decisions.
- `discover` is deliberately modest and English-specific; treat its tags as suggestions.
- Scale: tuned for thousands of items and tags (pair generation is blocked and capped), not millions.
