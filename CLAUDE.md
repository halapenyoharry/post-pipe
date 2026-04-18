# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

post-pipe is a **corpus viewer with optional publishing routes** — not a blog pipeline.

It points at a user-chosen content root (default `~/Posts/`), walks the folder tree, detects what kind of content each subfolder contains (essay, image, audio, video, multi-substrate work, archive, fragment), and produces a spatial D3 graph view of the entire intellectual topology. Text pieces can optionally route to Medium/Substack/GitHub Pages; other substrates have their own routes as they're built.

Metadata is a gradient, not a gate. Folders with rich `frontmatter.json` produce rich nodes; legacy `.qmd` folders read in lossy mode; unstructured folders still appear, flagged `scattered` with a TODO.

## Commands

```bash
npm install

# Build the graph viewer from ~/Posts/
node generate-index.js
# → _site/feed.json + _site/index.html

# Publish an essay to a platform (draft by default)
node index.js medium article.md
node index.js medium --publish article.md

# Pipe from stdin
cat article.md | node index.js medium

# Login flows (saves session to auth/)
npm run login:medium
npm run login:substack
npm run login:youtube
```

Local preview:
```bash
cd _site && python3 -m http.server 8891
# → http://localhost:8891/
```

No test suite or linter yet.

## Architecture

**Content root:** `~/Posts/` (configured in [`settings.json`](./settings.json) `content_dir`). This is where Harold's writing, images, podcast episodes, and other creative output live — one folder per piece. Old `post-pipe/articles/` directory is retained under `archive/` for reference only.

**Ingester:** [`ingest.js`](./ingest.js) walks the content root and produces `Content[]` objects. Substrate detection is metadata-aware (reads `frontmatter.json` → `idea.substrate`) with filesystem fallback (file extensions). See `ARCHITECTURE.md` for the full `Content` shape.

**Graph generator:** [`generate-index.js`](./generate-index.js) consumes the ingester output, copies cover images to `_site/covers/`, emits JSON Feed 1.1 (extended with rich fields) to `_site/feed.json`, and builds a self-contained `_site/index.html` with embedded D3 graph + reader panel + TTS toolbar.

**Reader panel substrate dispatch:** `renderSubstrate(article, body, headerHTML)` in the inline script routes by `content.kind`:
- `essay` / `multi` → `fetch()` rendered HTML from GitHub Pages
- `image` → `<img>` inline
- everything else → placeholder + metadata summary

**Platform modules** ([`platforms/{name}.js`](./platforms/)) each export `{ login, post }`:
- `medium.js` — Working for essays. Pushes to GitHub Pages, then imports via Playwright.
- `substack.js`, `youtube.js` — Stubs.
- `github-pages.js` — `pushArticle()` / `pushFile()` via GitHub Contents API.
- `feed-ingester.js` — Pulls external RSS feeds (listed in `settings.json.feeds`) as peer graph nodes. All currently `enabled: false`.

## Content Schemas (three generations coexist)

**Gen 2 (canonical):** `frontmatter.json` + `index.md` per folder. Rich — encodes `idea.seed`, `idea.topology`, `idea.energy`, `forms.potential`, `connected_to`. Status vocabulary: `scattered | drafted | bloomed | published`. Examples: `~/Posts/art-is-pattern/`, `~/Posts/smile-end-of-world/`.

**Gen 1 (legacy):** `index.qmd` with YAML frontmatter. Read in lossy mode — no topology/seed/energy. Each Gen 1 folder has a `_TODO-MIGRATE.md` with auto-extracted YAML and fields needing human judgment.

**Gen 0 (unstructured):** Folders with just files (a PNG, a raw `.md`, a podcast bundle). Substrate detected from file mix. Each has a `_TODO-METADATA.md` with a research checklist.

Full migration procedures: [`~/Posts/_MIGRATION-GUIDE.md`](../Posts/_MIGRATION-GUIDE.md) and [`~/Posts/_METADATA-GUIDE.md`](../Posts/_METADATA-GUIDE.md).

## Key Design Decisions

- **Content root is user-chosen.** `~/Posts/` is the default, not a hard dependency. Any folder with one-subfolder-per-piece works.
- **Metadata is a gradient.** Never refuse to show a piece because it lacks metadata. Surface what's there.
- **Substrate is first-class.** Every piece has a `kind` (`essay | image | podcast-episode | video | multi | archive | fragment`). The reader and publishing routes dispatch on kind.
- **TDD idea: `idea.topology` ≠ `tags`.** Tags are subject keywords; topology is substrate-independent structural pattern. Both are useful; they cluster differently.
- **`connected_to` edges are authored, not inferred.** When Harold writes a piece that echoes another, he lists the slug. Graph renders these distinct from tag-cluster edges.
- **Least-interfering TTS highlighting** is a load-bearing principle. Sentence highlighting must be ambient confirmation, not wayfinding. No sidebar progress, no karaoke, no forceful scroll. See memory: `feedback_least_interfering_highlighting.md`.
- **Adaptive Execution Flow (Act or Ask):** This pipeline is designed for AI operation. Handle all mechanical decisions autonomously. Escalate only at structural barriers (paywall, CAPTCHA, missing credentials) with exact reason + one specific request.
- **canonical_url** is still always the GitHub Pages URL for cross-posted essays. Every platform receives this as canonical to prevent duplicate-content penalties.

## Operational Context

Read [`ARCHITECTURE.md`](./ARCHITECTURE.md) and [`TCP.json`](./TCP.json) before starting work. They contain the full design context, known issues, and collaboration protocol. Do not ask Harold to re-explain what is already documented there.

Commits must be made as `halapenyoharry`, never as Claude or any AI agent name.
