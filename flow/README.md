# flow

Flow is a projector from a **field** (post-pipe's graph of cards and tagz, present at once) to a **flow** (one card after another, the only relation being next), under a **weight vector** the reader owns. The design note is `_local/thegathering/flow.md` in the main checkout (local, not tracked). This folder is the first working pipeline: command-line programs over JSON on stdin and stdout, run against a built site's `feed.json`, with two renderers so an ordering can be read as text and seen as a line over the existing graph. Flow draws nothing in the viewer and the viewer runs none of it; no scroll view; no panel. Since 2026-11-04 the viewer's cluster layout reuses two of flow-score's features for its links, degree under `degreePenalty` and recency under `recencyClock` and the half-life, reimplemented in `src/lib/edgeWeight.js` under a site's `graph.edgeWeights`; post-pipe's `test/edgeWeight.test.js` runs flow-select and flow-score to hold the two equal.

> **Where it lives.** `flow/` is a folder of post-pipe's repository and its own part, like `rosetta-tagz/`: its own programs (`bin/`), tests (`node --test flow/test/*.test.js`; post-pipe's own `npm test` does not run them), presets and this document. It imports nothing from `src/` and `src/` imports nothing from it; post-pipe reaches it only by running its programs. Node built-ins only, plus Playwright (already a dependency) for the capture and the composited picture. `flow/package.json` marks the folder as ES modules, names the five programs, asks for Node 22 or later, and runs the tests with `npm test` inside `flow/`; it adds no package.

## The pipeline

```
feed.json ──flow-select──▶ subfield.json ──flow-score──▶ scored.json ──flow-order──▶ flow.json ──flow-render──▶ text | svg (+ over.png)
                                                 ▲ preset.json                                        ▲ positions.json, graph.png (flow-capture)
```

flow-select, flow-score and flow-order read JSON on stdin and write JSON on stdout; flow-render reads a flow and writes text (`--target text`) or SVG (`--target path`); flow-capture reads a page and writes `positions.json` and `graph.png` to `--out`. Flags are long options. Bad arguments and bad JSON give one plain line on stderr and exit 1 (a page flow-capture cannot load ends with Playwright's own error). For the same input and flags, flow-select, flow-score, flow-order and flow-render's text and SVG are byte-identical; a capture and a composited picture come from a live browser.

A run on a built site, served locally:

```
flow/bin/flow-select --all < _site/feed.json > subfield.json
flow/bin/flow-score --preset flow/presets/by-weight.json < subfield.json > scored.json
flow/bin/flow-order < scored.json > flow.json
flow/bin/flow-render --target text --full 20 < flow.json > flow.txt
flow/bin/flow-capture --url http://127.0.0.1:18231/ --out capture/
flow/bin/flow-render --target path --positions capture/positions.json --screenshot capture/graph.png --over path.over.png < flow.json > path.svg
```

## The programs

### flow-select

Reads a post-pipe `feed.json` (`items`, `edges`, `_rtagz`). Writes the **subfield**.

- `--all` (default): the whole field.
- `--around <id> --hops <n>` (default 1): a neighbourhood. `n` counts card steps: a shared tag is one step and a direct link between two cards half of one (a card is in when its hops, card to tag to card counting 2 and a direct link 1, are at most 2n). The subfield holds the card, every card within `n` steps, the tagz on those cards (members trimmed to the cards present), the relations between those tagz and the links on those cards (a link between two cards only when both are in). The `position` is the id.
- `--set <id,id,...>`: an explicit selection; its tagz trimmed to it; no position.
- The `path` selector in the design is not built.

The subfield:

- `selector`, `position` (the `--around` id, else null), `schemes` (from `feed._rtagz.schemes`: id, label, kind).
- `cards[]`: `id`, `title`, `url`, `source` (the item's `_source.title`), `date` (`date_published`), `kind`, `index` (the item's place in the feed's order), `distance` (hops from the position; card to tag to card counts 2; null without a position), `references[]`: every tag reference as the feed carries it, trimmed to `type`, `concept`, `value`, `weight`, `origin`, `why`, `prefLabel`, `sourceRatio`, `systems`, followed by the `untagged` reference whole when the item has one.
- `tagz[]`: one hyperedge per concept (`id` the concept id; without rosetta-tagz, `tag:<string>` per tag string), `concept`, `label` (the reference's `value`, the site scheme's label), `prefLabel` and `inScheme` from `_rtagz.concepts`, `members[]` of `{card, weight, origin}`.
- `relations[]`: the tag-to-tag edges of `feed.edges` whose layer is a SKOS name (`broader`, `related`, `closeMatch`, `broadMatch`, `relatedMatch`, `exactMatch`, `narrower`, `narrowMatch`), as `{type, a, b, directed, weight, why}`; `a` and `b` are the edge's `attrs.concept` and `attrs.target` (rosetta-tagz's pair, `a` the broader for the directed types), else the two tag strings.
- `links[]`: every other edge with a card at an end (`authored`, `sequence`, `topology`, reference layers), as `{source, target, layer, role, directed}`; containment and the `tag` layer (the tagz, read from the references) are left out.

Without references (a feed built without rosetta-tagz) a tag string is read as an explicit tag of weight 1, the weight rosetta-tagz gives an explicit tag. This fallback is the worker's.

### flow-score

Reads a subfield. `--preset <file>` is required; `--state <viewState.json>` is optional (the viewer's saved state, the object under its `post-pipe:` key, read for `reading` and `nodes`). `--degree-penalty`, `--recency-clock`, `--half-life`, `--tag-measure` override the preset's switches.

Writes the subfield through, with `preset` (name, description, weights, the switches as used) and, on each card, `score`, `terms` (feature → `{x, w, term}`) and `top` (the feature names by absolute term, largest first, ties by name). `score` is the sum of the terms.

The features, each bounded to 0..1 before weighting, and what each reads:

- `tag.<scheme>`, one per scheme in `subfield.schemes` plus any the preset names: with `tagMeasure` `presence` (default), 1 when the card has at least one tag reference that has a `prefLabel` in that scheme, else 0; with `tagMeasure` `weight`, the weight of the card's strongest such reference. Reads `_references[].prefLabel` (and `_references[].weight` under `weight`).
- `tag.shared`: with a position, for every tag the card and the position both carry, the smaller of the two reference weights, summed, over the position's total reference weight; 0 without a position, and 0 for the position itself. Reads `_references[].concept` and `weight`. The bounding is the worker's.
- `rel.<type>`, one per SKOS type present in `subfield.relations` plus any the preset names: the weights of relations of that type between one of the position's tagz and one of the card's tagz, summed and capped at 1; 0 without a position, and 0 for the position itself. Reads the relation edges' `attrs.weight`. A tag both carry is `tag.shared`, not a relation.
- `degree`: the card's tag incidences plus the links it is an end of, in the subfield; penalised by `degreePenalty` (`none`: n, `sqrt`: √n, `log`: ln(1+n)); over the subfield's largest. Reads the tag references and `feed.edges`.
- `recency`: `calendar`: 0.5 ^ (days since the card's date / `recencyHalfLifeDays`), days counted back from the newest dated card in the subfield; undated is 0. `session`: 1 − rank/(n−1) by the card's place in the feed's item order, newest first (the first item is 1, the last 0). Reads `date_published` or the item order.
- `source`: x is 1; the weight is the preset's `weights.source[<source title>]`, 1 for a source the preset does not name. Reads `_source.title`. With no source named the term is 1 on every card: it moves nothing in the order, but it stands in every card's `top`.
- `read`: from `--state`: 1 when `reading[id].done`, 0.5 when `reading[id].seenAt`, else 0 (keyed by item id or by the viewer's slug). `pin`: 1 when `nodes[id].pinned`. Both 0 without `--state`.
- `distance`: the card's hops from the position over the subfield's largest finite hops; 0 without a position. A preset that wants nearness weights it negatively.

### flow-order

Reads scored cards. `--mode score|walk`, `--walk-start heaviest|newest`, `--start-source <title>`, `--start <id>`, `--seam <hops>`, `--stability <t>`, `--previous <flow.json>`; each defaults to the preset's switch (`--start` names an explicit start card and wins over `--walk-start`).

- `score`: by score descending, ties by id ascending. The design's rule. In `score` mode `walkStart` and `walkStartSource` are ignored (a sort has no start); `--start` still checks that the card is in the subfield.
- `walk`: start at the card chosen by `--start <id>` (an id not in the subfield is an error), else by `walkStart` (`heaviest`: highest score, ties by id; `newest`: by the preset's `recencyClock` — `calendar` takes the latest `date`, ties by the feed's item `index` then id, with undated cards never newest unless every candidate is undated; `session` takes the lowest `index`). `walkStartSource` restricts the start candidates for `newest` and `heaviest` to that source's cards, falling back to the whole subfield when no card of that source is present. At each step take, among the unvisited, the card with the highest `score + w(tag.shared) · shared(current, candidate) + w(distance) · distance(current, candidate)`, the two position features recomputed with the current card as the position (distance over the largest finite hops from the current card to a card not yet visited; unreachable counts as 1); ties by id. Every card is visited once. Offered beside `score`, not instead of it.
- Stability: with `--previous`, the previous flow's order is the start (cards no longer present dropped, new cards placed by score), then a card passes its neighbour only when their scores differ by more than `t` of the score range. Repeated adjacent passes; deterministic. Without `--previous` it does nothing. Applies to `score` mode.

Writes `{summary, items}`. `summary`: preset, mode, start (`{id, title, rule, source}` in `walk` mode, where `rule` is `heaviest`, `newest`, `explicit`, or `<walkStart> (no card of <source>; whole subfield)`; `null` in `score` mode), cards, steps, seams, meanHops (over reachable steps), unreachableSteps, position, selector, the switches used, the weights. Each item: `rank`, `id`, `title`, `url`, `source`, `date`, `score`, `terms`, `top`, `tagz[]` (`id`, `label`, `weight`, `origin`, `why`), `untagged` (the reference, when the card has one), and `step`: `from` (the card before), `hops` (in the subfield; null when unreachable), `shared` (tag ids shared with the card before), `seam` (true when hops exceed the seam switch or the card is unreachable).

### flow-render

Reads a flow.

- `--target text` (default), `--full <n>` (default 20): adjacency text for a model's window. A header line with the preset, cards, mode (and the start card when the walk rule is not `heaviest`), seams and mean hops, and one with the weights. Then, in flow order, for each of the first `n` cards: a line with rank, score, title, id, source and date; its top three terms in words (`degree 1.00 · source 1.00 · tag.site 1.00`; with no source named, `source` is 1 on every card and takes one of the three); its tagz one line each (label, concept id, weight, origin, the why where there is one, and the other cards in the flow carrying it, by rank and title); an `untagged:` line with the feed's reasons when the card has that reference. The rest are one line each: rank, score, title, tag labels. A seam is one line before the card, saying the hops from the card before and how many tagz the two share, or that it is not reachable. Every line is from the feed or from the flow's own numbers.
- `--target path --positions <positions.json> [--screenshot <graph.png> --over <out.png>] [--stats <out.json>]`: an SVG the size of the captured viewport: every card as a faint box with its short label at its captured place, every drawn tag bubble as a faint circle, the flow as one line segment per step through the card centres, a step number at each card, seams dashed, and a legend naming the preset, the mode, the counts and the path's measures. Cards are matched to positions by url, then by the viewer's slug. With `--screenshot`, the same overlay is composited over the PNG in headless Chrome (`channel: 'chrome'`, `headless: true`) at 1:1 and written to `--over`; the PNG must be the size the positions say. `--stats` writes the measures (total length, mean and median step, steps longer than half the diagonal, cards not drawn).
- The `scroll` and `here` targets are not built.

### flow-capture

`--url <local url> [--out <dir>] [--width 1600] [--height 1000] [--min-wait 10000] [--settle 2000] [--timeout 120000]`. Loads the built site in headless Chrome on the chrome channel, a fresh context (no saved view state), the viewport in CSS px at device scale factor 1. Waits for `window.PostPipeGraphTags`, for the first card, then `--min-wait` (the viewer's force layout cools and then fits the graph to the viewport on its own end; two samples two seconds apart can agree inside that tail), then samples the DOM twice `--settle` apart until the two agree within half a pixel, takes the screenshot, and checks a third sample still agrees. Writes `positions.json` (url, viewport, zoom from the graph's transform, counts, and for every card and tag node its id, label, centre and box in CSS px, with `hidden` for a node the viewer is not showing) and `graph.png` of that frame. Only a local url is accepted. One capture serves every preset, so every picture is over the same field.

Card node ids are the viewer's slugs (the url's last segment without `.html`); `url` is recorded beside them. Tag node ids are `tag:<label>`, with the concept beside.

## Presets

`flow/presets/*.json`:

```json
{
  "name": "by-weight",
  "description": "…",
  "weights": { "tag.site": 1, "degree": 1, "recency": 1, "source": {} },
  "switches": { "degreePenalty": "sqrt", "recencyClock": "calendar", "recencyHalfLifeDays": 365, "tagMeasure": "presence", "orderMode": "score", "seam": 2, "stability": 0.05 }
}
```

`weights` maps a feature name to a number; `source` is a map of source title to number, or one number for every source (a title not named is 1; an empty map is every source at 1). A program reads a preset's switches as defaults and a flag overrides them. The engine ships no site-specific preset: neither shipped preset names a source.

- `by-weight`: `tag.site` 1 (`tagMeasure` `presence`), `degree` 1, `recency` 1 (half-life 365 days), mode `score`. The first weight vector.
- `by-neighbourhood`: the same plus `tag.shared` 1 and `distance` -1, mode `walk`, `walkStart` `newest` (`walkStartSource` unset). Beside the first, not instead of it.

## Switches

| switch | where | values | default | the axis it exposes |
|---|---|---|---|---|
| `degreePenalty` | preset, `flow-score --degree-penalty` | none, sqrt, log | sqrt | how much a many-edged card outweighs a few-edged one |
| `recencyClock` | preset, `flow-score --recency-clock` | calendar, session | calendar | whether new means recent by date or first in the feed's order (the feed lists the newest first) |
| `recencyHalfLifeDays` | preset, `flow-score --half-life` | days > 0 | 365 | how fast calendar recency fades |
| `tagMeasure` | preset, `flow-score --tag-measure` | presence, weight | presence | whether `tag.<scheme>` reads presence (0 or 1) or the strongest reference's weight |
| `orderMode` | preset, `flow-order --mode` | score, walk | score | sort by weight, or walk the neighbourhood |
| `walkStart` | preset, `flow-order --walk-start` (or `--start <id>`) | heaviest, newest | heaviest | where a walk begins (`--start <id>` names an explicit card and wins) |
| `walkStartSource` | preset, `flow-order --start-source` | source title or null | null | restricts the walk's start candidates to one source (falls back to the whole subfield if absent) |
| `seam` | preset, `flow-order --seam` | hops ≥ 0 | 2 | how far a step may reach before it is a jump |
| `stability` | preset, `flow-order --stability` with `--previous` | fraction ≥ 0 | 0.05 | how much a score must move before the order does |
| `--full` | `flow-render --target text` | cards ≥ 0 | 20 | how many cards the window gets in full |
| `--hops` | `flow-select --around` | card steps ≥ 0 | 1 | how wide a neighbourhood is |
| `--min-wait`, `--settle`, `--timeout`, `--width`, `--height` | `flow-capture` | ms, px | 10000, 2000, 120000, 1600, 1000 | when the frame is taken and how large |
| per-feature weights | preset `weights` | numbers | 0 unnamed (`source` 1) | what counts as heavy |

## Not built

- The `path` selector (what lies along a path, trimmed to a budget).
- The `scroll` target (JSON for a neat view) and the `here` target (a here-and-horizon block for a map tool), and `flow.previewHops`.
- A TopoThink hypergraph as input; only a post-pipe `feed.json` is read.
- Stability across sessions: a position kept between runs, a flow held to a previous one automatically. `--previous` is the hook; nothing writes or finds a previous flow on its own.
- Read state from a live viewer: `--state` reads a saved file only.
- A flow in the viewer: no line is drawn in the site, no cursor, no scroll. What the viewer has from flow is only the cluster layout's link weights, from flow-score's degree and recency (`src/lib/edgeWeight.js`, 2026-11-04), not an order.

## Tests

`node --test flow/test/*.test.js`: 31 tests on a synthetic feed (six cards, four tagz, one relation, one untagged card, one authored link): the subfield carries every card and tag; distances from a position; each feature's range and what it reads (`tagMeasure` `presence` vs `weight`, 365-day default half-life); terms sum to the score; `score` order is deterministic with ties by id and unaffected by `walkStart`; `walk` visits each card once and starts by `heaviest`, `newest` (calendar with index tie-break, or session), `walkStartSource` with fallback, or explicit `--start`; a seam is flagged; stability holds and yields; the text render names every card and names a non-heaviest walk start in its header; the path SVG has one segment per step and marks seams; the programs chain on stdin and stdout and refuse bad input with one line.

## Provisional names

Named by the worker, for Harold to keep or replace: the subfield's fields (`cards`, `tagz`, `relations`, `links`, `members`, `references`, `index`, `distance`, `position`, `selector`, `schemes`), the scored fields (`terms`, `top`, `x`, `w`, `term`), the flow's fields (`summary`, `start`, `rule`, `items`, `rank`, `step`, `from`, `hops`, `shared`, `seam`, `meanHops`, `unreachableSteps`), the switch names `recencyHalfLifeDays`, `tagMeasure`, `orderMode`, `walkStart`, `walkStartSource` and `seam` (the design note's `seamDistance`), the program name `flow-capture`, the flags (`--min-wait`, `--settle`, `--over`, `--stats`, `--full`, `--hops`, `--half-life`, `--degree-penalty`, `--recency-clock`, `--tag-measure`, `--walk-start`, `--start-source`, `--start`), the preset names `by-weight` and `by-neighbourhood`, and the capture's file names `positions.json` and `graph.png`. From the design note, provisional there too: the folder name, the program names `flow-select`, `flow-score`, `flow-order` and `flow-render`, the feature names (`tag.<scheme>`, `tag.shared`, `rel.<type>` (the note's `rel.<skos>`), `degree`, `recency`, `source`, `read`, `pin`, `distance`), and the switches `degreePenalty`, `recencyClock` and `stability` (the note's names without their `flow.` prefix). Since 2026-11-04 `degreePenalty`, `recencyClock` and `recencyHalfLifeDays` also name settings of post-pipe's `graph.edgeWeights`, and `degreePenalty` a panel preference.
