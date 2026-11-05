# post-pipe Architecture & Design Decisions

**Last updated:** 2026-11-04

---

## What This Is

post-pipe is a **corpus viewer with optional publishing routes** — not a blog pipeline.

You point it at a folder (`~/Posts/` by default). It walks the folder, detects what kind of content each subfolder contains (essay, image, audio, video, multi-substrate work, archive, fragment), and produces a spatial graph view of your entire intellectual topology. When a piece is text and wants to travel, publishing routes exist for GitHub Pages / Medium / Substack / YouTube / etc. — but publishing is a *capability*, not the purpose.

Metadata is a gradient, not a gate. Folders with rich `frontmatter.json` produce rich nodes (topology, energy, forms, explicit edges). Folders with legacy `.qmd` YAML read in a lossy mode. Folders with nothing but a PNG or an unplaced `.md` still appear — labeled `scattered` with a TODO for metadata.

```mermaid
flowchart LR
    subgraph ROOT["~/Posts/ (user's corpus)"]
        G2["{slug}/frontmatter.json + index.md\n(Gen 2 — rich)"]
        G1["{slug}/index.qmd\n(legacy YAML)"]
        G0["{slug}/ (unstructured)\n(image / audio / fragment)"]
    end

    subgraph INGEST["ingest.js"]
        G2 --> SCAN["substrate detect"]
        G1 --> SCAN
        G0 --> SCAN
        SCAN --> CONTENT["Content[]"]
    end

    subgraph BUILD["generate-index.js"]
        CONTENT --> FEED["_site/feed.json"]
        FEED --> VIEWER["_site/index.html\n(D3 graph + substrate-dispatched reader)"]
    end

    subgraph ROUTES["Platform routes (optional)"]
        ESSAY["essay + rendered HTML"] --> MEDIUM["Medium"]
        ESSAY --> SUBSTACK["Substack"]
        VIDEO["video"] --> YOUTUBE["YouTube"]
    end

    VIEWER -.->|click essay node| GHPAGES["GitHub Pages\n(rendered HTML)"]
    CONTENT -.->|"manual publish step"| ROUTES

    style ROOT fill:#1a1a2e,color:#e0e0e0
    style INGEST fill:#16213e,color:#e0e0e0
    style BUILD fill:#16213e,color:#e0e0e0
    style ROUTES fill:#0d1117,color:#e0e0e0
```

---

## Content Model

Every folder in `~/Posts/` becomes one `Content` object. The object shape is shared across all schemas; missing fields default gracefully.

```js
{
  id:            "art-is-pattern",                 // folder name
  kind:          "essay",                          // essay | image | podcast-episode |
                                                   // video | multi | archive | fragment
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
  source:        "local",                          // vs "feed:aeon" for RSS nodes
  schema:        "gen2" | "legacy-qmd" | "unstructured"
}
```

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
| any `.m4a` / `.mp3` | `podcast-episode` |
| any `.mp4` / `.mov` | `video` |
| any `.md` / `.qmd` / `index.html` | `essay` |
| only `.jpg` / `.png` / `.webp` | `image` |
| multiple substrates | `multi` |
| nothing recognizable | `fragment` |

Each Gen 0 folder gets a `_TODO-METADATA.md` with a research checklist. Full procedure in [`~/Posts/_METADATA-GUIDE.md`](../Posts/_METADATA-GUIDE.md).

---

## The Viewer

The generated `_site/index.html` is a self-contained page with:

1. **D3 force-directed graph** — nodes are content items; edges are tag co-occurrence (and in future: explicit `connected_to` edges, substrate clusters). Its tag nodes are drawn as pills only when `settings.graph.tag.show` is true or the reader turns on "Show tagz on the graph" in the panel (`src/lib/tagPills.js`, preference `showTags`, provisional, 2026-11-04); hidden, they stay in the simulation and keep pulling, so the cards sit where they would with them shown, and a tag picked in the tag list still shows its pill while picked
2. **Reader panel** — slides in on node click; dispatches rendering based on `content.kind`. Its tag row draws the item's tag references as chips (`src/lib/tagReferences.js`); a card with no tagz shows instead the one line the build wrote on it, `untaggedBecause` (`src/lib/untaggedBecause.js`, provisional, 2026-11-04), saying why, from what rosetta-tagz reported
3. **TTS toolbar** — engine-agnostic registry (browser / gemini)
4. **Syndication toolbar** — platform icons linking to cross-posted versions

### Views: the registry (2026-11-04)

A view is one way of drawing the feed (`vision/VIEWS.md`). The registry is `src/views/index.js`: `VIEWS`, a list of entries `{ id, label, component, props }`. Two ship, both GraphViewer: `cluster` (`props.layout: 'force'`) and `ring` (`props.layout: 'radial'`). A later entry may be another component (JSON Trees); every view's component takes GraphViewer's props (`feedData`, `graphSettings`, `viewState`, `onNodeSelect`), plus `view`, the entry itself.

- `src/lib/views.js` holds the pure helpers, with no component, so the tests run in node: `siteViews(settings, registry)` reads `settings.views` (default `["cluster"]`, unknown ids skipped with one logged line), `viewById`, `viewLayout`, `viewFromSearch(location.search, listed)` for `?view=<id>`, and `currentView(listed, viewState.state)`, the view in force.
- The page (`generate-index.js`) and the embed (`src/embed.jsx`) mount the current entry's component with the entry's props under the page's own, and pass the site's views to the top bar (`FeedZ`: `views`, `currentView`, `onSelectView`), which shows the switch only when there is more than one.
- The reader's choice lives in `viewState.state.view`, set with `setView(id, layout, { silent })`: the view and the layout it draws with in one step. `resetLayout` clears it. The bottom bar's layout picker still sets `state.layout` alone; `currentView` resolves a layout that contradicts the chosen view to the listed view drawn with that layout, and the page syncs the state silently, so the two controls always agree.

### Substrate dispatch in the reader

`renderSubstrate(article, body, headerHTML)` routes to:

- `essay` / `multi` — `fetch({pages_url})` and inject HTML (existing path)
- `image` — `<img>` inline with the cover URL
- `podcast-episode` / `video` / `archive` / `fragment` — placeholder box + metadata summary (until per-substrate renderers are built)

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

- **Browser (Web Speech API)** — instant, OS-native voices. Only a curated few English voices are offered: `settings.tts.engines.browser.preferredVoices` (ordered names, matched exactly or by prefix) and `maxVoices` (default 5); one English fallback if none of the names exist on the device.
- **Google Gemini** — 30 multilingual voices via API; billed, so off in the picker unless `exposed: true`.

### Highlighting principle

Sentence highlighting in the viewer is **ambient confirmation, not wayfinding** — the text itself pulses at the reading rate without demanding attention. No sidebar progress, no karaoke, no forceful scroll. Current implementation dwells-then-fades from API latency accident; the sidecar-timings path (see [`research/TTS Highlighting_ Chunking vs. Sentence Mode.md`](research/)) will lift that aesthetic into a deterministic spec (400ms fade, 150ms look-ahead gap, 200ms paragraph-first dwell).

This principle is load-bearing and must survive all future TTS work.

### Listening in the card (2026-11-04)

An open card on the canvas (`node.select`) holds the same voice the reader has: `CardListen` in `src/components/TTS/TTS.jsx` is a third view of `window.TTS` beside the reader's transport and the panel's Listening group, sharing the one `useTTS` hook. `tts.js` keeps one reading and says where it is (`target()`, `state()`) and when a choice changes (`paramChanged`), so a reading started in a card goes on when the reader opens and the reader's pause and stop act on it; its highlight and soft scroll happen in whatever container `play()` was given, the card's text included. `src/lib/listenInCard.js` holds the setting (`settings.cards.listen`, default true) and the play button's decision, used by the strip and by the bindable actions `node.listen` and `node.stopListening`.

---

## GitHub Pages

- Repo: `halapenyoharry/haroldyoung-human-posts`
- Pages URL: `https://halapenyoharry.github.io/haroldyoung-human-posts/`
- Auth token in `auth/.env` (gitignored)

For essays, the push flow is:
1. `quarto render index.qmd --to html -M embed-resources:true` (for legacy folders)
   — or —
   future `render.js` step for Gen 2 `.md` → self-contained HTML
2. `pushArticle()` in `platforms/github-pages.js` uploads `{slug}.html`
3. `node generate-index.js` rebuilds `feed.json` + `index.html` from `~/Posts/`
4. `pushFile()` uploads those to Pages root

Non-essay substrates (image/audio/video) will get their own push paths as renderers are added.

---

## Card identity: the slug (2026-11-04)

Every item in `feed.json` carries `slug` and `slugSource`, given by `src/lib/cardSlug.js` in `generate-index.js` after the corpus is loaded. The slug is discovered, never invented: a canonical the feed gives (`canonical_url` when it is not the item's own url, or a `<link rel="canonical">` in its HTML), else a DOI (a `doi` field, which `RssAdapter` and `AtomAdapter` fill from `prism:doi` or `dc:identifier`, or a DOI inside the canonical or url), else the slug part of the url's path (a numeric part is fine: the path is the identity), else, with none of these, a slug from the title. `slugSource` is one of `canonical`, `doi`, `url`, `title`.

The slug is frozen in the site's cards ledger (`settings.cards.ledger`, `cards.json` in the site by default, provisional): slug → `{ urls, titles, firstSeen, source }` (plus `ids` when a feed's own id is not the url, and `disambiguatedFrom` when a suffix was needed). A build reads it, adds the cards it does not hold, appends urls and titles newly seen for a known card (so a changed title keeps its card), and never rewrites a slug. A new card whose slug is already another card's gets a plain suffix (`-2`, `-3`) on first sight, frozen too. A card that leaves the corpus stays in the ledger. The ledger is written only when it changed; an unreadable one is left as it is with one logged line. The slug merges nothing: one article arriving from two sources is two cards with one slug (Harold, 2026-11-04). Item ids are untouched; `topBar.js` and `contributions.js` keep their own `slugOf` (the last part of the url).

## RSS / JSON Feed

`_site/feed.json` is JSON Feed 1.1 compatible, extended with the rich content model (`kind`, `substrate`, `seed`, `topology`, `energy`, `forms`, `connected_to`, `todos`). Standard feed readers ignore unknown fields; the viewer consumes all of them.

The D3 graph fetches `feed.json` at load and derives its shape client-side. `feed.json` is the single source of truth; the graph is a view.

External feeds and the site's own local folder are declared in `feeds.opml` (or the path in `settings.json` `feeds_opml_path`), parsed by `src/lib/opml.js`. Each outline entry is routed by `generate-index.js` and `src/aggregator.js` to its source adapter (`src/adapters/LocalFolderAdapter.js`, `src/adapters/RssAdapter.js`, `src/adapters/AtomAdapter.js`, `src/adapters/JsonFeedAdapter.js`, or, for one article's page and a local list of pages, `src/adapters/PageAdapter.js` and `src/adapters/PageListAdapter.js`, which read a page through `src/lib/pageExtract.js`), with feed colors cached in `.feed-cache/colors.json` and the last good copy of each fetched feed or page kept in `.feed-cache/last-good/` so external items appear as peer nodes in the graph alongside the local corpus.

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
| Medium | ⚠️ Partial | Push works; Playwright import step manual |
| Substack | ⏳ Stub | Not implemented |
| YouTube | ⏳ Stub | Not implemented |

Platform modules are substrate-aware in principle but not yet in code: essay → Medium/Substack/LinkedIn; video → YouTube; image → social posts. Routing will be explicit once a non-essay push path is built.

---

## Known Issues / Work in Progress

- **`post-pipe/articles/`** — the old content root, retained in `archive/` for reference. All active content lives in `~/Posts/`.
- **Quarto rendering** still the path for Gen 1 legacy articles. A native `.md` → self-contained HTML renderer is planned to remove the Quarto dependency for Gen 2.
- **Substrate renderers** beyond `essay` and `image` are placeholders. Audio/video renderers need media-file copy paths into `_site/` or CDN routing.
- **Prepared-audio + sidecar timings pipeline** (see plan in conversation history) — phase 1 is `prepare-audio.js` that synthesizes sentence-by-sentence at publish time and emits `audio.mp3` + `timings.json`. Bypasses forced alignment entirely.
- **Medium import** — `medium.com/p/import` URL is dead. Correct path: `medium.com/me/stories` → "Import a story" button. Playwright step needs updating.
