# post-pipe Architecture & Design Decisions

**Last updated:** 2026-11-10

---

## What This Is

post-pipe is a **corpus viewer with optional publishing routes** — not a blog pipeline.

You point it at a site: a folder holding `settings.json` and `feeds.opml` (`POSTPIPE_SITE`; with none set, the example site in `examples/site/`, which reads two public feeds). Its sources are folders of writing (`local://<path>` in `feeds.opml`, such as `~/Posts/`), published feeds and single pages. It walks each folder, detects what kind of content each subfolder contains (essay, image, audio, video, multi-substrate work, archive, fragment, link), and produces a spatial graph view of your entire intellectual topology. When a piece is text and wants to travel, publishing routes exist for GitHub Pages and, through it, Medium (Substack and YouTube are stubs) — but publishing is a *capability*, not the purpose.

Metadata is a gradient, not a gate. Folders with rich `frontmatter.json` produce rich nodes (topology, energy, forms, explicit edges). Folders with legacy `.qmd` YAML read in a lossy mode. Folders with nothing but a PNG or an unplaced `.md` still appear — labeled `scattered` with a TODO for metadata.

```mermaid
flowchart LR
    subgraph ROOT["a local source (local://, such as ~/Posts/)"]
        G2["{slug}/frontmatter.json + index.md\n(Gen 2 — rich)"]
        G1["{slug}/index.qmd\n(legacy YAML)"]
        G0["{slug}/ (unstructured)\n(image / audio / fragment)"]
    end

    subgraph INGEST["ingest.js (through src/adapters/LocalFolderAdapter.js)"]
        G2 --> SCAN["substrate detect"]
        G1 --> SCAN
        G0 --> SCAN
        SCAN --> CONTENT["Content[]"]
    end

    FEEDS["feeds and pages\n(rss · atom · json · page · pages)"]

    subgraph BUILD["generate-index.js + src/aggregator.js"]
        CONTENT --> FEED["_site/feed.json"]
        FEEDS --> FEED
        FEED --> VIEWER["_site/index.html\n(D3 graph + substrate-dispatched reader)"]
    end

    subgraph ROUTES["Platform routes (optional)"]
        ESSAY["essay + rendered HTML"] --> GHPAGES["GitHub Pages"]
        GHPAGES --> MEDIUM["Medium (import)"]
        ESSAY --> SUBSTACK["Substack (stub)"]
        VIDEO["video"] --> YOUTUBE["YouTube (stub)"]
    end

    VIEWER -.->|open an essay| PAGE["_site/{id}.html\n(the piece's own page)"]
    CONTENT -.->|"manual publish step"| ROUTES

    style ROOT fill:#1a1a2e,color:#e0e0e0
    style INGEST fill:#16213e,color:#e0e0e0
    style BUILD fill:#16213e,color:#e0e0e0
    style ROUTES fill:#0d1117,color:#e0e0e0
```

---

## Rules the engine keeps

Every change is checked against these. Each is Harold's; the date is the day he set or restated it, where one was written down.

- **The engine is content-agnostic.** Nothing specific to one site or corpus (names, tags, colours, authors, chapter lists) is in the engine; it goes in that site's `settings.json`. post-pipe holds no one's site.
- **Emergence.** A card exists because a file or a feed item exists. The engine never makes up content.
- **Metadata is a gradient, not a gate.** No piece is refused for lacking metadata (above).
- **No network beyond what a site lists.** A build fetches only the feeds and pages its `feeds.opml` names, and a source's home page once for its colour. No CDNs. At run time the viewer loads its own files, a piece's page from the piece's own address when that page is not beside the viewer, and what the site's settings point it at (contributions, an opening text). One known gap: images inside a feed item's own HTML load from the publisher's server when the reader shows them (Known Issues, at the end).
- **Stillness** (2026-05-25). The layout settles once and stays; nothing moves on a click, a resize or the reader opening. Movement happens only when a reader can read meaning in it.
- **The card is the preview surface** (2026-05-25). A hovered or tapped card opens in place, in the space it already has; no tooltip elsewhere repeats it. Opening the reader moves no card.
- **Cards never disappear** (2026-10-31). At every zoom a card is drawn as a card with its title and scales with the graph; zoom changes no layout. Zoom-level rules found in older notes (the title alone when far out, a dot below 35%) were never Harold's.
- **Labels mean text** (2026-11-05). Hiding labels hides the text a node carries, never the node or its lines: cards are joined through their tagz, and removing either removes the structure.
- **No assumed ranking** (2026-10-27). "We don't make assumptions, we just have weights and information and we display what the information says as best we can." A tag's origin (written, discovered, emergent) is an attribute to read or filter by, never a trust order; bad output is fixed in the layer that makes it, not hidden in the viewer.
- **Highlighting is ambient confirmation, never wayfinding** (Highlighting principle, under Text-to-Speech).
- **The slug merges nothing** (2026-11-04). One article arriving from two sources is two cards, and both show.
- **Hidden in the graph is not out of the corpus** (2026-11-08). A source hidden with its pill hides its cards from the graph only; they stay in the reading order. The reader shows such a card's source with the top bar's own pill, in its off state (2026-11-09): "you show the source show that it is off in the graph with the same pill".
- **The pill names the source, the byline the author** (2026-11-10). The reader shows every card's source with the top bar's own pill, on or off as the top bar's is, and the byline names only the piece's author: "so the pill that is shown in the graph view should be the source in the reader view and it should show up just like it does in the graph view the by line should be reserved for the author of the piece if provided."
- **How much text before the next is the reader's choice** (2026-11-10). In the reader, a visitor chooses how much of the open card they see before read the rest, about 100 words unless they choose otherwise; since 2026-11-11 no card follows beneath it (The reader, one card at a time, under The Viewer): "also the user should have the option, in reader view, or flow, to choose how much text they want to see as they scroll. by default they should see about 100 words before they see the next thing."
- **One card fills the screen** (2026-11-11). The reader shows one card, the same way on phones and on desktop and on every site: a sideways swipe goes to the next or previous card, scrolling down reads the one that is open, and the next and previous arrows stay with the text (The reader, one card at a time, under The Viewer): "For reading: one card fills the screen. Swipe sideways for the next or previous card, scroll down to read the one you're in. The next and previous arrows travel with the text, so nobody has to go to the top or bottom to find them. This is the same on phones and on desktop, and it means one solution for every site."
- **Pictures fit the text's margins** (2026-11-11). Every picture in the reader's text shrinks to fit inside the text column, and none is taller than about 55% of what the reader shows (Pictures in the reader, under The Viewer): "Good catch on the big photos. They should shrink to fit inside the text's margins, so a reader never ends up lost in empty space."
- **Add before override** (2026-10-25). A change to something that works arrives first as an option beside it; the working thing is replaced only when Harold says so after seeing both.
- **Options, not questions** (2026-10-31). When a choice is open, it ships as a switch (a panel setting or a `settings.json` key) with a default, so both can be seen working.
- **Every site gets a favicon** (2026-10-31), asked for or not. A site with neither `site.icons` nor a `favicon.svg` of its own gets a placeholder, one circle in its accent colour (grey when it names none), and the build says so (`faviconPlan` in `src/lib/shareMeta.js`).
- **Names and design are Harold's.** A name marked *provisional* in these documents is a placeholder until he keeps or replaces it; where a change needed a visual choice he had not made, the plainest was built.

---

## Content Model

Every folder in a local source (`local://<path>`, such as `~/Posts/`) becomes one `Content` object, which `src/adapters/LocalFolderAdapter.js` turns into a JSON Feed item; items from feeds and pages come from their own adapters. The object shape is shared across all schemas; missing fields default gracefully.

```js
{
  id:            "art-is-pattern",                 // folder name
  kind:          "essay",                          // essay | image | podcast-episode |
                                                   // video | multi | archive | fragment | link
  title:         "Art Isn't Magic. It's Complexity.",
  short_title:   "Art Is Pattern",
  summary:       "...",                            // idea.tldr || idea.seed

  // Rich metadata (Gen 2 only — null/empty for legacy and unstructured)
  seed:          "...",                            // genesis sentence
  topology:      ["information-theory", ...],      // structural patterns (NOT keywords)
  energy:        "peak" | "sunset" | "any" | null, // Harold's dopamine-cycle signal
  substrate:     "essay",                          // current embodiment

  // Publication state
  status:        "scattered" | "drafted" | "bloomed" | "published",
  written:       "2025-12-01" | null,
  syndication:   { canonical, medium, substack, github_pages, ... },

  // Substrate potential (Gen 2)
  forms_current: "essay",
  forms_potential: ["podcast-episode", "workshop-for-makers", ...],
  forms_companions: ["cover-image"],               // only for kind: "multi"

  // Topology edges (Gen 2)
  connected_to:  ["append-only-mind", "egregores_magosphere"],

  // Resolved paths
  cover:         "images/cover.png" | null,        // relative to content folder
  body:          { file: "index.md", format: "md" } | null,
  media:         { audio: {file, srt, transcript, timings} } | null,

  // Operational
  todos:         ["_TODO-MIGRATE.md"],             // files triggering human review
  source:        "local",                          // items from feeds carry _source instead
  schema:        "gen2" | "legacy-qmd" | "unstructured"
}
```

Objects also carry `author`, `tags`, `series`, `series_part`, `license`, `updated`, `reading_time` and `posted`, and, from front matter, `references`, `timeline` and `scene`. A piece whose front matter names a `link` and that has no text is `kind: "link"`, with `link` and `subtitle` (`src/lib/linkNode.js`, 2026-10-01).

The ingester in [`ingest.js`](./ingest.js) produces these objects. It's metadata-graceful: missing frontmatter never excludes a folder. Substrate detection falls back to file-extension inspection when no explicit `idea.substrate` is declared.

---

## Content Schema Generations

Three schemas coexist in `~/Posts/`. The ingester reads all three.

### Gen 2 — `frontmatter.json` + `index.md` (canonical, preferred)

Rich, topologically-native. Encodes the structure Harold actually thinks in.

```json
{
  "id": "art-is-pattern",
  "title": "Art Isn't Magic. It's Complexity.",
  "short_title": "Art Is Pattern",

  "idea": {
    "seed": "The 'substance' of a thing is its pattern — its information...",
    "tldr": "Art and math are neighbors on one street called pattern...",
    "topology": ["information-theory", "philosophy-of-art", "pattern-substrate-invariance"],
    "energy": "peak",
    "substrate": "essay"
  },

  "meta": {
    "author": "Example Author",
    "written": "2025",
    "updated": null,
    "reading_time": "6 min",
    "status": "bloomed",
    "license": "CC-BY-SA 4.0"
  },

  "forms": {
    "current": "essay",
    "potential": ["illustrated-lecture", "podcast-episode", "workshop-for-makers"]
  },

  "tags": ["art", "AI", "pattern", "philosophy"],
  "syndication": { "canonical": null, "medium": null, "substack": null, ... },
  "connected_to": ["append-only-mind", "egregores_magosphere"],
  "note": "Optional internal note"
}
```

**`idea.topology` ≠ `tags`.** Tags are subject-matter keywords. Topology is substrate-independent structural pattern — the *shape* of the idea, not its topic. Typical topology labels: `labor-power`, `pattern-substrate-invariance`, `erasure-of-expertise`, `epistemic-colonialism`, `negative-evidence`, `wu-wei`.

**`meta.status` vocabulary:**
- `scattered` — raw thoughts, notes, fragments
- `drafted` — written out but rough
- `bloomed` — essentially finished, internal satisfaction (may not be publicly posted)
- `published` — publicly posted (with `syndication.*` filled in)

The graph today treats `bloomed` and `published` the same visually (finished work). `drafted` and `scattered` render as drafts.

**`forms`** encodes substrate-independence. `potential` lists realistic other-substrate forms this idea could take. For `kind: "multi"` (podcast + companion essay + cover art of the same idea), `companions` lists the co-present substrates.

### Gen 1 — `index.qmd` (legacy, read-only for ingester)

Single-file Quarto/Markdown with YAML frontmatter. Ingester reads these in a lossy mode — no `seed`, no `topology`, no `energy`, no `connected_to`. Each Gen 1 folder has a `_TODO-MIGRATE.md` file with migration instructions specific to that article (auto-extracted YAML + fields needing human judgment).

Field mapping from Gen 1 → Gen 2 is documented in [`~/Posts/_MIGRATION-GUIDE.md`](../Posts/_MIGRATION-GUIDE.md).

### Gen 0 — unstructured

Folders that contain content but no structured metadata. Ingester detects substrate by file mix:

| files present | detected kind |
|---|---|
| any `.m4a` / `.mp3` / `.wav` / `.ogg` / `.flac` / `.aac` | `podcast-episode` |
| any `.mp4` / `.mov` / `.webm` / `.mkv` / `.avi` | `video` |
| any `.md` / `.qmd` (not a `_TODO` file) / `index.html` | `essay` |
| only `.jpg` / `.jpeg` / `.png` / `.gif` / `.webp` / `.svg` | `image` |
| multiple substrates | `multi` |
| nothing recognizable | `fragment` |

Each Gen 0 folder gets a `_TODO-METADATA.md` with a research checklist. Full procedure in [`~/Posts/_METADATA-GUIDE.md`](../Posts/_METADATA-GUIDE.md).

---

## The Viewer

The generated `_site/index.html` is a self-contained page with:

1. **D3 force-directed graph** — nodes are content items and their tagz; edges are `feed.json`'s `edges` (`src/corpus/buildEdges.js`, since 2026-09-10): an item's tags (layer `tag`), a series' next (`sequence`), `connected_to` (`authored`), `topology`, references (layer `reference`), and containment, which the hulls show instead of a line; `graph.visibleLayers` picks which draw lines; substrate clusters are not built. The cluster layout weights each link (`settings.graph.edgeWeights`, `src/lib/edgeWeight.js`, 2026-11-04): weighted by default, each link's strength and length following its own weight, the degree of its two ends and its card's recency, by the same degree and recency formulas `flow/`'s flow-score uses; uniform gives every link one distance, as before. Its tag nodes are drawn by default as their pills, with every edge to them; `graph.tag.labels: false`, or the reader's "Show their labels" off in the panel, draws each as a small dot instead (`settings.graph.tag.markRadius`, 7 graph units), and `graph.tag.show: false`, or "Show tagz on the graph" off, draws none (`src/lib/tagPills.js`, preferences `showTags` and `showTagLabels`, provisional, 2026-11-05; the labels are the default by Harold's word of that day). In every state the tag nodes stay in the simulation with their pills' footprint and keep pulling, so the cards sit where they would; a tag hovered, or picked with its relatives, shows its pill
2. **Reader panel** — opens on a double tap on a card (`node.openReader`; a tap opens the card in place, `node.select`, and the button inside an open card opens the reader too; `docs/ACTIONS.md`); dispatches rendering based on `content.kind`. Its tag row draws the item's tag references as chips (`src/lib/tagReferences.js`); a card with no tagz shows instead the one line the build wrote on it, `untaggedBecause` (`src/lib/untaggedBecause.js`, provisional, 2026-11-04), saying why, from what rosetta-tagz reported. Under the title, the byline names only the piece's author (`src/lib/byline.js`): its own authors, else the site's author for a piece from the site's own folder, as the build gives it; a publisher's piece that names no author has none. Under the byline and the date the open card's source shows as the top bar's own pill (Reading in Flow's order, below; 2026-11-10). Its nav rows (Next and Previous: the titles either side, above the text and below it), the arrow keys and a swipe go along `sequence` edges (`src/lib/readerNav.js`), or, on a site with Flow presets, along the reading order in force (below). The reader shows one card at a time and nothing beneath it, about 100 words of it at first with read the rest unless the visitor chooses otherwise (The reader, one card at a time, below; 2026-11-10 and 2026-11-11). Every picture in its text fits inside the text column (Pictures in the reader, below; 2026-11-11).
3. **TTS toolbar** — engine-agnostic registry (browser / gemini)
4. **Syndication toolbar** — platform icons linking to cross-posted versions
5. **Top bar** (`FeedZ` in `src/components/FeedZ/FeedZ.jsx`) — a pill per source, which hides or shows it and says when its items were taken in; the book (`topBar.resume`, `resumeTarget` in `src/lib/topBar.js`), which opens the reader where this reader was; the site's pages and links; the view switch; the `+`; and, by default since 2026-11-05, the graph's controls (undo, redo, Reset, the dimensions menu, the list of the tagz, and the sliders that open the panel, where the view actions and the layout are; `settings.toolbar.position`, `src/lib/toolbar.js`). `toolbar.position: "bottom"` keeps the bar along the bottom (`src/components/Toolbar`), the default before 2026-11-05.

The page's colours come from the site's `settings.theme` (`bg`, `surface`, `accent`, `text`, `text_bright`, `border`, `node_published`, `node_draft`, `tag_color`), which `generate-index.js` writes into the page's CSS variables. A colour the site leaves unset takes the original dark look's (`DEFAULT_THEME_COLOURS`, 2026-11-07), so a site that names none still gets an opaque reader; before, an unset colour was written as `undefined`. `theme.name` picks the look (the default, or sketchbook), and the notes in `examples/site/settings.json` give each key.

### Views: the registry (2026-11-04)

A view is one way of drawing the feed (`vision/VIEWS.md`). The registry is `src/views/index.js`: `VIEWS`, a list of entries `{ id, label, component, props }`. Two ship, both GraphViewer: `cluster` (`props.layout: 'force'`) and `ring` (`props.layout: 'radial'`). A later entry may be another component (JSON Trees); every view's component takes GraphViewer's props (`feedData`, `graphSettings`, `viewState`, `onNodeSelect`), plus `view`, the entry itself.

- `src/lib/views.js` holds the pure helpers, with no component, so the tests run in node: `siteViews(settings, registry)` reads `settings.views` (default `["cluster"]`, unknown ids skipped with one logged line), `viewById`, `viewLayout`, `viewFromSearch(location.search, listed)` for `?view=<id>`, and `currentView(listed, viewState.state)`, the view in force.
- The page (`generate-index.js`) and the embed (`src/embed.jsx`) mount the current entry's component with the entry's props under the page's own, and pass the site's views to the top bar (`FeedZ`: `views`, `currentView`, `onSelectView`), which shows the switch only when there is more than one.
- The reader's choice lives in `viewState.state.view`, set with `setView(id, layout, { silent })`: the view and the layout it draws with in one step. `resetLayout` clears it. The layout picker (the Layout row in the main view's panel, and in the bottom bar with `toolbar.position: "bottom"`) still sets `state.layout` alone; `currentView` resolves a layout that contradicts the chosen view to the listed view drawn with that layout, and the page syncs the state silently, so the two controls always agree.

### Reading in Flow's order (2026-11-07)

A site can let its readers read its cards one after another in an order Flow (`flow/`) gives, with the controls a reader already has: the book and the reader's Next and Previous. `settings.flow.presets` (provisional) lists the presets: names of presets in `flow/presets/`, or paths to the site's own, relative to the site.

- **The build** (`src/lib/flowBuild.js`, called by `generate-index.js` once the feed is complete, after its items, edges, `_sources`, `containers` and `_rtagz`): Flow's programs run as child processes on `process.execPath`, fed JSON on stdin, each stopped after 120 s, as rosetta-tagz's are: `flow-select --all` once over the feed, then for each preset `flow-score --preset <file>` and `flow-order`. The orders go into `feed.json` as `flows` (provisional): `[{ name, description, mode, order }]`, where `name` and `description` are the preset's own, `mode` is flow-order's (`score` or `walk`; a walk's start is `order[0]`), and `order` is the cards' item ids (flow-select gives a card its item's id), in the order the site lists the presets. The same feed gives the same orders, byte for byte, and they are what the three programs give run by hand on the written `feed.json`. A preset that cannot be found, a program that fails or runs too long, or a second preset with a name already used, is one logged line and no order. With no preset listed, no Flow runs and `feed.json` gains nothing.
- **The reading order in force** (`src/lib/readingOrder.js`): the one the reader chose, else the site's first. With two or more orders, the main view's panel offers them as one row at the end of its View group, Reading order (provisional), each choice a preset's name with its description as its title, and the chosen one's description in a line under the row; the choice is the preference `readingOrder` (provisional, null for the site's first), remembered on the device, and Reset the view (the graph's reset-all) puts it back to the first. Changing it moves nothing in the graph.
- **Next and Previous** (`neighbours` and `step` in `src/lib/readerNav.js`, given `flowNav`'s `{ order, skip }`): the nav row, the arrow keys and the swipes go to the nearest card either side in the order in force that the reader can open, passing over a title-only card, a link card (followed, never read) and the top bar's own pages (`skip`); the row shows that one card each side. A top bar page has no neighbours in the order. `flow.next: false` (provisional) keeps them on `sequence` edges.
- **The book** (`resumeTarget(items, reading, config, order)` in `src/lib/topBar.js`, `order` from `chosenOrder`): where this reader was, as before; else the site's `topBar.resume.start` when it names one; else the first card of the order in force that can be read and is neither a top bar page nor a link; else the first item.
- **A card hidden in the graph** (2026-11-08; its pill 2026-11-09; the pill on every card 2026-11-10): a card whose source the reader has hidden with its pill (`viewState.state.hiddenSources`) stays in the order, so the book, Next and Previous, the arrow keys and the swipes reach it as any other. The reader shows every card's source, hidden or not, with the source's own pill under the title, after the byline and the date, left-aligned: the top bar's pill (`FeedPill` in `src/components/FeedZ/FeedZ.jsx`), with its dot, title, count and colour, in the state the top bar's has: on while the source shows in the graph, off while it is hidden, dimmed with the title struck through. A tap on it, or Enter or Space, shows or hides the source as the top bar's pill does, and both change at once; its dot and its popover are the top bar's too. The pill shows for every card that carries its source (`_source`), whichever state the source has, so a tap changes only its state (`hiddenInGraph` and `readerSourcePill` in `src/lib/readingOrder.js`); a site whose top bar shows no source pills (`topBar.showSourcePills: false`, as epicofelinorjones.com sets) shows none in the reader either, just like the graph view. The byline is left to the piece's author (`src/lib/byline.js`). While the source is hidden, a screen reader hears "hidden in the graph" before the pill (`HIDDEN_IN_GRAPH`; Harold, 2026-11-10: "\"hidden in graph\" is fine."); there are no visible words, and the voice reads past the pill. Its wrapper carries `data-reader-source-pill`, and `data-reader-hidden-in-graph` while the source is hidden. It shows on any site, with an order or without. Harold: "if they are part of the graph they should show up in the flow, or this early version. with indication they are hidden in graph." (2026-11-08); "you show the source show that it is off in the graph with the same pill" (2026-11-09); "so the pill that is shown in the graph view should be the source in the reader view and it should show up just like it does in the graph view the by line should be reserved for the author of the piece if provided." (2026-11-10). A card hidden inside a closed container shows its source's pill on, with no mark yet that the graph hides it.
- **Not built**: readers turning the weights themselves (#17), the flow drawn as a line on the graph, the scroll view (#16).

### The reader, one card at a time (2026-11-11)

Harold, 2026-11-11: "For reading: one card fills the screen. Swipe sideways for the next or previous card, scroll down to read the one you're in. The next and previous arrows travel with the text, so nobody has to go to the top or bottom to find them. This is the same on phones and on desktop, and it means one solution for every site." The reader shows the open card and nothing beneath it, on every site. On 2026-11-10 it had become a scroll, the open card cut at about the chosen number of words and then the cards Next would visit, one under another, each cut the same way, with One at a time as a choice; the next day that scroll went, and one card at a time became the only way. What stayed of it is the choice of how much of the open card shows at first. Harold, 2026-11-10: "also the user should have the option, in reader view, or flow, to choose how much text they want to see as they scroll. by default they should see about 100 words before they see the next thing." `src/lib/readerWords.js` holds the choice and the cut, pure where it can be, with its tests in `test/readerWords.test.js`; the reader is `src/components/ReaderPanel/ReaderPanel.jsx`.

- **The choice**: 50, 100, 250 or 500 (about that many words of the open card, then read the rest) or `whole` (the whole card). `wordsChoice(settings, aid)`: the visitor's own choice, the reading aid `words` (`viewState.readerAid('words')`, null until chosen; `setReaderAid('words', null)`, or any value not a choice, clears it), else the site's `reader.words`, else 100. The engine's 100 is Harold's (2026-11-10). The panel offers it in its Reading group under Size, as the row Words before the next, with the choices 50, 100, 250, 500 and Whole. Forget clears it with the other reading aids; Reset the view keeps it, as it keeps them.
- **`one`, retired** (2026-11-11): One at a time, the reader before 2026-11-10, was a choice for a day. It is no longer offered, but a device that stored it or a site that sets it still works: it reads as `whole`, which is what it showed (`RETIRED_WORDS` and `wordsValue` in `src/lib/readerWords.js`; `src/lib/viewState.js` writes the same list and the same map out, as the page has no `require`, and a test holds them equal). `setReaderAid('words', 'one')` keeps `whole`.
- **The cut** ("about N words"; `planCut` and `sentenceEnd` on strings, `excerptHtml` on HTML): words are counted through the card's text in document order, a word being a run of non-space characters that holds a letter or a digit, two blocks or a line break parting two words. The excerpt ends at the end of the sentence that holds the Nth word (a `.`, `!`, `?` or `…`, then any closing quotes or brackets, then a space or the end of the block), and never past the end of the block (a paragraph, list item, heading, quote...) that holds it. A period after Mr, Mrs, Ms, Dr, St, Jr, Sr, vs, etc, e.g or i.e, or after a single capital letter, ends no sentence. When under 15 words, or under 15% of N, would be left, nothing is cut. The excerpt is a DOM Range from the start of the text to the cut, cloned, so an element the cut passes through (a link, an emphasis) stays well formed and everything wholly before it (images, figures, headings) stays; it is read in a document of the browser's DOMParser, which loads nothing. A publisher's piece's link out (`data-reader-link-out`) counts no words and follows the excerpt. The cut comes before Bold word beginnings, so words are counted on the text, not on its marks.
- **The open card** shows its excerpt, with read the rest under it, a button that shows the whole card in place, the scroll staying where it was. It shows whole for now, until another card opens, when the visitor pressed read the rest; when it opened at a paragraph (a bookmark, a link to a place); when its saved progress is partway (more than 0.02 and less than 0.98), as it is then put back at that place (the book opens a card so); and when the voice starts on it. Opened from the graph, with Next or Previous, the arrow keys or a swipe, it shows its excerpt. The references and Contributions show only while it shows whole (or nothing was cut). Under the text (and read the rest) come the references, the nav row of the cards either side, the rights line and Contributions; the same nav row sits above the header.
- **What counts the open card**: bookmarks, the paragraph at the top (for a bookmark and for Copy a link to here), the jump to a paragraph and the bookmark's mark count only its own text (`[data-reader-text]`), as Contributions does; no paragraph sits above that text, so a paragraph's number is what it always was. Download takes the open card, shown whole first, without the nav rows or read the rest. The progress bar and the card's saved progress measure the card from the top of its header to the end of its text (`cardProgress`, `cardScrollFor`), so the nav row, the rights line and Contributions under it count for nothing and the end of the text is the end of the card; no progress is kept while it shows an excerpt.
- **The voice**: the reader's play button (`TTS` in `src/components/TTS/TTS.jsx`) says `postpipe:voice-before-play`, with the element it will read, just before `tts.js` takes the text; the reader, when that element is its own, shows the open card whole at once (React's `flushSync`), so the voice reads all of it. Resuming a paused reading says nothing.
- **Not built yet** (Harold's paragraph above): the next and previous arrows that travel with the text, and a sideways two-finger swipe on a trackpad. Next and Previous are the nav rows' titles, the arrow keys and a touch swipe.
- **Provisional names** (Harold's to keep or replace): the site setting `reader.words`; the reading aid `words`; the panel row Words before the next and its choices 50, 100, 250, 500 and Whole, with their titles ("About 50 words of the card, then read the rest", "The whole card"); the button read the rest; the event `postpipe:voice-before-play`; the attribute `data-reader-rest`. The row's name, Words before the next, was given when the next card followed beneath; it is kept until Harold names the row again.

### Pictures in the reader (2026-11-11)

Harold: "Good catch on the big photos. They should shrink to fit inside the text's margins, so a reader never ends up lost in empty space." Before this the reader had no rules for pictures, and a publisher's lead photo (ProPublica's run 1149 px wide, a video 1920 px) ran past the right margin and filled the screen. The rules are CSS only, in `src/components/ReaderPanel/ReaderPanel.module.css`, on the open card's text (`[data-reader-text]`).

- **Every picture** (`img`, `picture`, `video`, `iframe`, `svg`, and so an image card's image) is a block, centred, never wider than the text (`max-width: 100%`, `height: auto`), and never taller than about 55% of what the reader shows: `max-height: 55cqh`, the reader's scroll body (`.body`) being a size container (`container-type: size`), so the cap follows the reader as it is beside the graph, wider, or filling the window, and on a phone. `object-fit: contain` shrinks a picture whole, never cropped; one held to a width of its own (a `width` attribute) and then capped in height keeps that width and shows the whole picture inside it, centred. A publisher's floats, side margins and offsets give way, inline ones too (`!important`). An `iframe` keeps its own height, as it has no shape for `height: auto` to keep, capped the same. An `svg` inside another, and the bookmark's mark drawn into a paragraph, are left alone.
- **A figure** has no margin outside the column (1em above and below, as browsers give one), no float or offset, and is never wider than the text; its caption wraps within the column.
- **In print** the body is no size container, so the text sets its own height; the cap then follows the page.
- **Not done**: CSS cannot tell a picture that stands alone from one inside a sentence, so a small image amid a line of text (an emoji drawn as an image, say) also takes a line of its own, centred. None turned up in the feeds and pages of the test page, haroldyounghumxn.site, paperz or epicofelinorjones.com (2026-11-11).

### Substrate dispatch in the reader

`itemHtml(item, feedData)` in `src/components/ReaderPanel/ReaderPanel.jsx` routes to:

- a piece from a source other than the site's own folder (a feed's item, a page) — the text the feed carried, often a summary, and a link out to the piece (`renderFeedItem`)
- a title-only piece (`_posted: "title"`) — its title and status, nothing fetched
- a `placeholder` piece — a box naming its chapter as in progress
- `essay` / `multi` — fetch the piece's own page (`item.url`; first the sibling `{id}.html` beside the viewer when the page is served from elsewhere), drop its `h1`, and inject the HTML (existing path)
- `image` — `<img>` inline with the item's image
- `podcast-episode` / `video` / `archive` / `fragment` — placeholder box + metadata summary (until per-substrate renderers are built)

A link piece never opens the reader: a tap on its card follows its link.

Metadata rows (`seed`, `tldr`, `topology`, `energy`, `note`) render below the body for non-essay kinds so the reader never sees a blank panel.

---

## Text-to-Speech System

The viewer integrates a TTS module (`tts.js`) for multilingual accessibility. Engine-agnostic: engines self-register at load, advertise capabilities, and are lazy-loaded on first play.

### Registry Pattern

```javascript
window.TTS.register(engineName, {
  init(),          // Called once when selected + played
  speak(text),     // Async; returns Promise
  pause(), resume(), stop(),
  capabilities()   // { voice, speed, pitch, quality, language, ... }
});
```

### Engines

- **Browser (Web Speech API)** — instant, OS-native voices. Every voice the device has is offered (since 2026-10-24): Google's first, then `settings.tts.engines.browser.preferredVoices` in order (matched exactly or by prefix), then the rest, the page's language first within each, grouped by language in the picker; no cap unless `maxVoices` is set to a number, except in an embed, which caps the list at 5 unless it is set (`src/lib/voices.js`).
- **Google Gemini** — 30 multilingual voices via API; billed, so off in the picker unless `exposed: true`.

### Highlighting principle

Sentence highlighting in the viewer is **ambient confirmation, not wayfinding** — the text itself pulses at the reading rate without demanding attention. No sidebar progress, no karaoke, no forceful scroll. Current implementation dwells-then-fades from API latency accident; the sidecar-timings path (see `research/TTS Highlighting_ Chunking vs. Sentence Mode.md`, in the local `research/` folder, which git ignores) will lift that aesthetic into a deterministic spec (400ms fade, 150ms look-ahead gap, 200ms paragraph-first dwell).

This principle is load-bearing and must survive all future TTS work.

### Listening in the card (2026-11-04)

An open card on the canvas (`node.select`) holds the same voice the reader has: `CardListen` in `src/components/TTS/TTS.jsx` is a third view of `window.TTS` beside the reader's transport and the panel's Listening group, sharing the one `useTTS` hook. `tts.js` keeps one reading and says where it is (`target()`, `state()`) and when a choice changes (`paramChanged`), so a reading started in a card goes on when the reader opens and the reader's pause and stop act on it; its highlight and soft scroll happen in whatever container `play()` was given, the card's text included. `src/lib/listenInCard.js` holds the setting (`settings.cards.listen`, default true) and the play button's decision, used by the strip and by the bindable actions `node.listen` and `node.stopListening`.

---

## GitHub Pages

- Repo: named by `GITHUB_OWNER` and `GITHUB_REPO` in the site's `auth/.env` (the engine's `auth/.env` is the fallback); publishing stops with a message naming a missing one (until 2026-10-22 the engine named `halapenyoharry/haroldyoung-human-posts` itself)
- Pages URL: `https://<owner>.github.io/<repo>/`
- Auth token: `GITHUB_TOKEN`, in the same `auth/.env` (gitignored)

For essays, the push flow is:
1. `quarto render index.qmd --to html -M embed-resources:true` (for legacy folders)
   — or —
   future `render.js` step for Gen 2 `.md` → self-contained HTML
2. `pushArticle()` in `platforms/github-pages.js` uploads `{slug}.html`
3. `node generate-index.js` rebuilds `feed.json` + `index.html` from the site's sources
4. `update-index.js` uploads those, and `covers/`, to the Pages root with `pushFile()`

Non-essay substrates (image/audio/video) will get their own push paths as renderers are added.

---

## Card identity: the slug (2026-11-04)

Every item in `feed.json` carries `slug` and `slugSource`, given by `src/lib/cardSlug.js` in `generate-index.js` after the corpus is loaded. The slug is discovered, never invented: a canonical the feed gives (`canonical_url` when it is not the item's own url, or a `<link rel="canonical">` in its HTML), counted only when it is a web address (http or https; since 2026-11-05, so a note in a piece's front matter is never read as one), else a DOI (a `doi` field, which `RssAdapter` and `AtomAdapter` fill from `prism:doi` or `dc:identifier`, or a DOI inside the canonical or url), else the slug part of the url's path (a numeric part is fine: the path is the identity), else, with none of these, a slug from the title. `slugSource` is one of `canonical`, `doi`, `url`, `title`.

The slug is frozen in the site's cards ledger (`settings.cards.ledger`, `cards.json` in the site by default, provisional): slug → `{ urls, titles, firstSeen, source }` (plus `ids` when a feed's own id is not the url, and `disambiguatedFrom` when a suffix was needed). A build reads it, adds the cards it does not hold, appends urls and titles newly seen for a known card (so a changed title keeps its card), and never rewrites a slug. A new card whose slug is already another card's gets a plain suffix (`-2`, `-3`) on first sight, frozen too. A card that leaves the corpus stays in the ledger. The ledger is written only when it changed; an unreadable one is left as it is with one logged line. The slug merges nothing: one article arriving from two sources is two cards with one slug (Harold, 2026-11-04). Item ids are untouched; `topBar.js` and `contributions.js` keep their own `slugOf` (the last part of the url).

Beside the slug, and never in its place, every item carries `topicSlug` (provisional, issue #39, 2026-11-05): the literal best two words for what the card is about, from `src/lib/topicSlug.js`, where what the card says it is about (subtitle, tags, topology, summary; else its title) meets what its text develops, weighed over all of the build's items as the corpus; a tag of several words the text uses whole is one word of the pair. It is computed after the slugs, kept in no ledger and may change from one build to the next as the corpus does; `settings.cards.topicSlug: false` leaves it off, and `tools/topic-slugs.js` prints each card's with its candidates. A tag counts as the card's own only when the piece or its feed wrote it (an explicit tag reference, or no reference at all); one rosetta-tagz found itself (every reference discovered or emergent) is read as text, its words counting only where the card's text holds them (2026-11-06). `settings.cards.topicSlugFoundTags: "tags"` (provisional; `"text"` by default) counts every tag as the card's own, as before, and the tool's `--found-tags tags` reckons the same.

## RSS / JSON Feed

`_site/feed.json` is JSON Feed 1.1 compatible, extended with the rich content model (`kind`, `substrate`, `seed`, `topology`, `energy`, `forms`, `connected_to`, `todos`), and beside `items` it carries `edges` (since 2026-09-10), `_sources`, `containers` when the site declares containment, `_rtagz` when rosetta-tagz ran, and `flows` when the site lists Flow presets (since 2026-11-07; see Reading in Flow's order). Standard feed readers ignore unknown fields; the viewer consumes all of them.

The D3 graph fetches `feed.json` at load and derives its shape client-side. `feed.json` is the single source of truth; the graph is a view.

External feeds and the site's own local folder are declared in `feeds.opml` (or the path in `settings.json` `feeds_opml_path`), parsed by `src/lib/opml.js`. Each outline entry is routed by `generate-index.js` and `src/aggregator.js` to its source adapter (`src/adapters/LocalFolderAdapter.js`, `src/adapters/RssAdapter.js`, `src/adapters/AtomAdapter.js`, `src/adapters/JsonFeedAdapter.js`, or, for one article's page and a local list of pages, `src/adapters/PageAdapter.js` and `src/adapters/PageListAdapter.js`, which read a page through `src/lib/pageExtract.js`), with feed colors (an outline's `customColor`, else the `theme-color` of the source's home page, fetched once, else a hue made from its id, `src/adapters/detectFeedColor.js`; for a local folder the home page is the site's `base_url`) cached in the engine's own `.feed-cache/colors.json` (like its last good copies and rosetta-tagz's working folders, under post-pipe's folder wherever the build is run from, since 2026-11-05), so external items appear as peer nodes in the graph alongside the local corpus.

A fetched feed or page whose fetch fails shows its cards from a copy (`src/adapters/lastGoodCopy.js`, 2026-11-05): the engine's last good copy, which every good fetch leaves in the engine's `.feed-cache/last-good/` on the machine that builds, or the site's saved copy, a file in the site's folder that the outline names with `savedCopy` (provisional) and the site ships, as `examples/site/saved/` does. Both are `{ url, fetchedAt, body }`; the build takes the newer by `fetchedAt` (`copiesNewestFirst`), and the source is marked `stale` with `copyDate`, `copyFrom` (`site` or `engine`) and `error`. An ordinary build never writes the site's copy; `node generate-index.js --save-copies` writes it from that build's good fetch. Every source in `_sources` also says when its items were taken in: a fetched one `fetchedAt` (this build's fetch, or the copy's) and `feedUpdated` (the feed's own date: RSS `lastBuildDate`, else the channel's `pubDate`, else its `dc:date`; Atom's `updated`; null for JSON Feed and for a page), a local folder or a list of pages `readAt`. The top bar's source pill shows these in a popover on a mouse's hover, the keyboard's focus or a finger's dwell (`FeedPill` in `src/components/FeedZ/FeedZ.jsx`, its lines from `sourceLines` in `src/lib/sourceStatus.js`).

The top bar's `+` (`AddPill` in `src/components/FeedZ/FeedZ.jsx`) asks `src/lib/feedAutodiscovery.js` what a pasted address is (`discoverSource`: a feed, a page naming no feed, or nothing readable) and shows the line to add from `src/lib/addFeedLine.js`: the feed line as ever, or a `type="page"` line.

---

## Adaptive Execution Flow (AI Operation Model)

post-pipe is designed for AI operation using the **Adaptive Execution Flow** pattern:

> **Act or Ask.** The AI handles all mechanical labor autonomously. When it hits a structural barrier (paywall, CAPTCHA, changed layout, missing credentials), it stops and escalates with the exact reason and a single specific request for what it needs to proceed.

Core rules:
1. Attempt autonomous execution first
2. Identify structural barriers exactly — do not guess or hallucinate workarounds
3. Escalate with precision: state the exact mechanical reason for failure
4. Demand specific input: one thing, one ask
5. Resume immediately from the point of failure once unblocked

The article [`the-collaborator-that-acts-or-asks`](../Posts/the-collaborator-that-acts-or-asks/) *is* this protocol.

---

## Current Platform Status

| Platform | Status | Notes |
|----------|--------|-------|
| GitHub Pages | ✅ Working | Push via GitHub API |
| Medium | ⚠️ Partial | Push works; the Playwright import step has no Medium session (see below) |
| Substack | ⏳ Stub | Not implemented |
| YouTube | ⏳ Stub | Not implemented |

Platform modules are substrate-aware in principle but not yet in code: essay → Medium/Substack/LinkedIn; video → YouTube; image → social posts. Routing will be explicit once a non-essay push path is built.

---

## Known Issues / Work in Progress

- **`post-pipe/articles/`** — the old content root, kept for reference in the local `archive/` folder, which git ignores. The engine holds no content now: each site names its sources in its own `feeds.opml` (`docs/SITES.md`), and `~/Posts/` is the owner's corpus, read when a site lists it.
- **Quarto rendering** still the path for Gen 1 legacy articles. A native `.md` → self-contained HTML renderer is planned to remove the Quarto dependency for Gen 2.
- **Substrate renderers** beyond `essay` and `image` are placeholders. Audio/video renderers need media-file copy paths into `_site/` or CDN routing.
- **Prepared-audio + sidecar timings pipeline** (the plan was talked through in an earlier session and never written into the repository; the local `research/TTS Highlighting_ Chunking vs. Sentence Mode.md` holds the highlighting side of it) — phase 1 is `prepare-audio.js` that synthesizes sentence-by-sentence at publish time and emits `audio.mp3` + `timings.json`. Bypasses forced alignment entirely.
- **Medium import** — `medium.com/p/import` URL is dead; the Playwright step now goes to `medium.com/me/stories` → "Import a story" button. It opens a fresh browser with no Medium session, so it cannot get past Medium's sign-in on its own, and `--publish` changes only what it prints.
- **Images inside a feed item's own HTML** load from the publisher's server when the reader shows the item: the test page's 20 ProPublica items hold 77 such images, on www.propublica.org (counted 2026-11-08). The rule above names nothing fetched beyond `feeds.opml`; whether a feed's own images count as the feed is open, and Harold's call.
- **Flow's programs get 120 s** at build, a fixed limit, as rosetta-tagz's do (`src/lib/flowBuild.js`); a slower preset gives no order and one logged line.
- **A card hidden inside a closed container** shows its source's pill in the reader in its on state, with no mark that the graph hides it; only a source hidden with its pill shows its pill off (2026-11-08; the pill on every card 2026-11-10).
- **The reader's nav row is named "Chapters either side"** for screen readers on every site, chapters or not.
