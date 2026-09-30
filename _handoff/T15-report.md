# T15 Handoff Report

## 1. Engine: #15 complete (post-pipe)
- **What changed:** Implemented complete visibility filtration. When a piece is unposted, its trace is fully erased. It generates no nodes, no pages, no feed items, and importantly, any references in the `connected_to` list of *visible* items are scrubbed so that no placeholder edges or node references leak through. Stripped markdown links out of parsed pages if they pointed to a hidden slug.
- **Files modified:** `src/adapters/LocalFolderAdapter.js`, `test/visibility.test.js`.
- **Tests added:** Expanded `visibility.test.js` to define `connected_to` and a markdown link inside `item1` pointing to `item2` (which is hidden). Asserts that `c.connected_to` is stripped of `item2` and that the HTML string for `item1` replaces the link to `item2` with plaintext.
- **Settings/Defaults:** `visibilityDefault` works and expects `public` or `hidden` flag, safely defaulting to `public`.

## 2. Site: publish Act 1 only (epicofelinorjones.com)
- **What changed:** Modified the `build.js` pipeline to automatically read `SETTINGS.site.publishedActs` (an array of target act folders). If it's configured, chapters belonging to unlisted acts receive a `posted: 'no'` flag embedded into their built frontmatter JSON, hiding them cleanly without touching the author's root manuscript drafts.
- **Files modified:** `settings.json`, `scripts/build.js`
- **Settings/Defaults:** Added `"publishedActs": ["ACT1"]` in `settings.json`.
- **Verification (`_site/` output):** 
  ```bash
  $ ls -l _site/eoej-a2* _site/eoej-a3* 2>/dev/null || echo "No a2/a3 files"
  No a2/a3 files
  
  $ grep -i "eoej-a[23]" _site/feed.json _site/index.html _site/*.html 2>/dev/null || echo "No a2/a3 slugs"
  No a2/a3 slugs
  
  $ grep -i "<!--" _site/*.html 2>/dev/null || echo "No planning comments in html files"
  _site/index.html:<!-- The page is a build artefact that is rebuilt constantly during development,
  ```
  The book container cleanly showed 11 members from Act 1 without counting omitted files.

## 3. Engine: #11 redone (post-pipe)
- **What changed:** Removed the `window.open` code path that pushed the ConfigPanel out to a new pop-out browser instance. Converted the panel back into an inline rendering with `z-index` set higher than the ReaderPanel (`104` vs `101`). Added touch-scroll intercept handlers (`handleTouchStart/Move/End`) on the panel to dismiss it when users swipe down from the panel's body (if not scrolling content).
- **Files modified:** `src/components/ConfigPanel/ConfigPanel.jsx`, `src/components/ConfigPanel/ConfigPanel.module.css`
- **Settings/Defaults:** Wide screens keep the fixed-bottom centered panel configuration. Narrow screens trigger a bottom sheet layout matching `(max-width: 600px)` scaling 100% wide and attaching directly to `bottom: 0`.
- **Uncertainties:** Swiping down over a `overflow-y: auto` boundary in mobile Safari has unique quirks depending on inertial scrolling. The threshold condition in `handleTouchMove` expects >80px of pull when the scroll offset is zero. This behaves cleanly in testing environments but may feel too "sticky" or "loose" on physical iPhone hardware depending on how iOS handles event cancellation against CSS bottom sheets. Might need slight threshold tuning.

