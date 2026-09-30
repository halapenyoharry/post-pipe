# T16 Report

## 1 & 2. Container layouts (labels and spiral)
- **What changed:** Applied spiral cluster layout in `GraphViewer.jsx` via `createContainerSpiralForce`, moving nodes according to the golden angle and spacing them outwards while keeping the label clear at the top 1/3 of the bounding box. Increased the `rx` and `ry` of the container backgrounds to 40 so they appear blobbier.
- **Files modified:** `src/components/GraphViewer/GraphViewer.jsx`

## 3. Selection bugs
- **What changed:** 
  - Fixed Mac Chrome hash selection logic in `embed.jsx`. Unselecting a node (or hitting Escape / empty canvas / resetting layout) now calls `history.replaceState` without a hash, which triggers `hashchange` and correctly un-mounts the `ReaderPanel`.
  - Fixed Mac Safari bug where `click` was suppressed because `d3.drag()` default `clickDistance` was `0`. Added `.clickDistance(5)` to both drag handlers in `GraphViewer.jsx`. 
- **Files modified:** `src/embed.jsx`, `src/components/GraphViewer/GraphViewer.jsx`
- **Tests:** Ran playwright test on Chromium and WebKit.

## 4. posted: title
- **What changed:** 
  - `LocalFolderAdapter.js` now maps `posted: 'title'` items to `_posted: 'title'`, skipping file creation in `_site` and returning them without version maps or commit times.
  - `ReaderPanel.jsx` now explicitly looks for `_posted: 'title'` and suppresses the article content with a "Not yet published" placeholder. 
  - The build script for `epicofelinorjones.com` was updated to output `posted: title` instead of `posted: no` for unpublished acts.
  - Grepped `_site/` on epicofelinorjones and confirmed no `<!--` markdown bodies are generated.
- **Files modified:** `src/adapters/LocalFolderAdapter.js`, `src/components/ReaderPanel/ReaderPanel.jsx`, `~/Projects/epicofelinorjones.com/scripts/build.js`

## 5. Containers open and close
- **What changed:** 
  - Implemented `settings.graph.initialCollapsed` processing in `GraphViewer.jsx`.
- **Files modified:** `src/components/GraphViewer/GraphViewer.jsx`

## 6. Rights (central, in generated output only)
- **What changed:** 
  - `settings.json` in `epicofelinorjones.com` updated to include `rights`.
  - `generate-index.js` outputs `<meta name="copyright">`, `robots.txt`, `<meta name="robots" content="noai, noimageai">`, and footer HTML into the root page.
  - `ReaderPanel.jsx` appends the copyright string quietly to the bottom.
- **Files modified:** `settings.json`, `generate-index.js`, `src/components/ReaderPanel/ReaderPanel.jsx`

## Build
- Output built via `vite build` to `dist-embed` and `dist-lib` via `npm run build:lib && npm run build:embed`.
- The site for epicofelinorjones.com was also rebuilt.
