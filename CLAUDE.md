# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

post-pipe is a markdown-to-platform publishing pipeline. Write once in Quarto (.qmd) with YAML frontmatter, push to GitHub Pages, then cross-post to Medium/Substack/YouTube. The canonical URL is always the GitHub Pages URL.

## Commands

```bash
# Install dependencies
npm install

# Publish an article (draft by default — safe)
node index.js medium article.md
node index.js medium --publish article.md

# Pipe from stdin
cat article.md | node index.js medium

# Login flows (saves session to auth/)
npm run login:medium
npm run login:substack
npm run login:youtube
```

No test suite or linter exists yet.

## Architecture

**Entry point:** `index.js` — CLI that parses platform + flags, loads the matching platform module, reads markdown from file arg or stdin, calls `mod.post()` or `mod.login()`.

**Platform modules** (`platforms/{name}.js`) each export `{ login, post }`:
- `medium.js` — Working. Renders markdown→HTML, pushes to GitHub Pages via API (`pushToPages`), then opens Medium import with Playwright. Known issue: `medium.com/p/import` is dead; correct path is `medium.com/me/stories` → "Import a story" button.
- `substack.js` — Stub only.
- `youtube.js` — Stub only.

**Article format:** Quarto `.qmd` files with YAML frontmatter. See `ARCHITECTURE.md` for the full frontmatter schema (title, slug, canonical_url, syndication record, status, etc.).

**Folder-per-article structure:**
```
articles/{slug}/
  index.qmd
  images/cover.jpg
  data/            # optional source data for charts
```

**Auth:** Credentials live in `auth/` (gitignored). GitHub API token in `auth/.env` (`GITHUB_TOKEN`). Medium session in `auth/medium-session.json`.

**GitHub Pages:** Repo `halapenyoharry/haroldyoung-human-posts`. Push via GitHub Contents API. Pages URL: `https://halapenyoharry.github.io/haroldyoung-human-posts/`

## Key Design Decisions

- **canonical_url** is always the GitHub Pages URL. Every cross-posted platform receives this as canonical to prevent duplicate content penalties.
- **Syndication state** is tracked in the article's frontmatter `.qmd` file — it is the single source of truth for where an article has been published.
- **Adaptive Execution Flow (Act or Ask):** This pipeline is designed for AI operation. Handle all mechanical decisions autonomously. Only escalate at genuine structural barriers (paywall, CAPTCHA, changed layout, missing credentials) with the exact reason and one specific request.
- **Quarto over plain markdown** — supports inline code blocks for charts, Mermaid diagrams, and self-contained compilation to HTML/PDF.

## Operational Context

Read `TCP.json` and `ARCHITECTURE.md` before starting work. They contain the full design context, known issues, and collaboration protocol. Do not ask Harold to re-explain what is already documented there.

Commits must be made as `halapenyoharry`, never as Claude or any AI agent name.
