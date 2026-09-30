# Task T9 Report: Display Changes

## Part 1: Container labels: much bigger
- **Files & locations modified**:
  - `src/components/GraphViewer/GraphViewer.jsx`:
    - `.container-badge-text`: updated `font-size` from `(!d.parent ? '28px' : '22px')` to `(!d.parent ? '64px' : '52px')`.
    - `.container-badge-count`: updated `font-size` to `(!d.parent ? '29px' : '23px')` (~45% of 64px / 52px).
    - `.container-macro-text`: updated `font-size` to `(!d.parent ? '64px' : '52px')`.
    - `.container-macro-count`: updated `font-size` to `(!d.parent ? '29px' : '23px')` (~45% of 64px / 52px).
    - Added `updateMacroBounds()` to ensure the collapsed container node's bounding rectangle (`.container-macro-bg`) computes proper width, height, and offsets around the larger text.
    - Updated `updateContainers()` so child closed containers contribute points to parent hulls using their computed macro dimensions rather than a hardcoded 180x90 box.
    - Color and opacity preserved; label remains centered in hull using `d3.polygonCentroid(hull)`.

## Part 2: Containers don't overlap (d3 separation force)
- **Files & locations modified**:
  - `src/components/GraphViewer/GraphViewer.jsx`:
    - Defined `createContainerSeparationForce()` and registered it on the simulation:
      `if (data.containers && data.containers.length > 0) simulation.force('containerSeparation', createContainerSeparationForce());`
    - Per tick: computes each container's centroid and radius (`max member distance from centroid + member half card size + c.padding (default 40)`).
    - Visibly accounts for open member nodes and collapsed child nodes (using their collapsed centroid and macro bounds); skips hidden members of collapsed containers.
    - For each pair of sibling containers (same `parent`, including two top-level ones), if circles overlap, pushes members away along the line between centroids by `overlap * alpha * 0.5` split evenly.
    - Uncontained nodes are pushed out of any top-level container circle along the centroid-to-node vector by `overlap * alpha * 0.5` split evenly.
    - Existing simulation forces remain unchanged.

## Part 3: Paragraph style: two independent switches
- **Why "space" currently had no visible effect in the node's scrolling text**:
  - Global CSS (such as `generate-index.js`) defines `* { margin: 0; padding: 0; box-sizing: border-box; }`, which strips default paragraph margins.
  - `ReaderPanel.module.css` explicitly restored paragraph margins via `.body :global(p) { margin-bottom: 16px; }`.
  - In contrast, `TextView.module.css` previously had NO rule setting paragraph margins for `.scroll :global(p)`. It only defined rules under `[data-pp-paragraph="indent"]` (which set `margin: 0; text-indent: 1.5em;`). When `paragraphStyle` was `'space'` (the default), `TextView.module.css` emitted no margin rules for `.scroll :global(p)`, leaving paragraphs with `margin: 0` from the universal reset.
- **Files & locations modified**:
  - `src/lib/viewState.js`:
    - Replaced single `paragraphStyle` setting with `paragraphIndent` (default `false`) and `paragraphSpace` (default `true`) in `emptyState()`.
    - Implemented `paragraphIndent()` / `setParagraphIndent(bool)` and `paragraphSpace()` / `setParagraphSpace(bool)`.
    - Added migration in `ready()`: if loaded state has legacy `paragraphStyle`, maps `'indent'` to indent on + space off, and `'space'` to indent off + space on. Retained `paragraphStyle()` / `setParagraphStyle()` as compatibility helpers.
  - `src/components/Settings/Settings.jsx`:
    - Replaced the two-button choice with two toggles: **Indent first line** and **Space between** (both can be on independently).
    - Replaced `data-pp-paragraph` attribute with `data-pp-indent="on|off"` and `data-pp-space="on|off"` on `<html>`.
  - `src/components/ReaderPanel/ReaderPanel.module.css`:
    - Replaced `data-pp-paragraph="indent"` with `:global(html[data-pp-indent="on"])` (`text-indent: 1.5em`, flush for first child and after headings/hr/blockquote) and `:global(html[data-pp-indent="off"])` (`text-indent: 0`).
    - Added `:global(html[data-pp-space="on"])` (`margin: 0 0 1em`) and `:global(html[data-pp-space="off"])` (`margin: 0`).
  - `src/components/NodeView/TextView/TextView.module.css`:
    - Replaced `data-pp-paragraph="indent"` with identical independent rules for `:global(html[data-pp-indent="on|off"])` and `:global(html[data-pp-space="on|off"])`.
  - `test/viewState.test.js`:
    - Added unit tests verifying independent boolean behavior, defaults, and legacy migration.

## Part 4: Chapter cards: title and a subtitle, no summary
- **Files & locations modified**:
  - `src/components/NodeView/TextView/TextView.jsx`:
    - Added `numberToLowercaseWords(n)` converting integers 0–99 into lowercase English words (with hyphens for compound numbers like `twenty-one`, up to `ninety-nine`).
    - Passed `cardSettings` down from `TextView` to `CardContent`.
    - In unselected (not open) cards: removed description/summary preview entirely.
    - Formatted subtitle using `cardSettings.subtitle` template: replaces `{n}` with `series_part` and `{n_words}` with lowercase word format. If no template or no `series_part`, subtitle is omitted.
    - Rendered title large and bold, with subtitle in a smaller, lighter weight with tight line-height (~1.05) and 3px gap, centered vertically and horizontally inside `.cardCenter`.
    - Open cards (`expanded`) continue showing chapter text.
  - `src/components/NodeView/TextView/TextView.module.css`:
    - Added `.cardCenter`, `.cardTitle`, and `.cardSubtitle`.
    - Included `.glow .cardTitle` to retain glow text shadows.
  - `src/components/GraphViewer/GraphViewer.jsx`:
    - In `renderArticleBody`, passed `cardSettings: CARD` into `React.createElement(Lens, ...)`.
  - `~/Projects/epicofelinorjones.com/settings.json`:
    - Merged `"subtitle": "chapter {n_words}"` into `graph.card`.

## Verification
- `cd ~/Projects/post-pipe && npm test`: 91 passing tests (0 failures).
- `npm run build`: succeeded (`dist/`).
- `npm run build:lib`: succeeded (`dist-lib/`).
- `npm run build:embed`: succeeded (`dist-embed/`).
- `node ~/Projects/epicofelinorjones.com/scripts/build.js --preview`: aggregated 28 items, generated feed.json and index.html without errors.

## UNSURE
- Nothing is unsure. All four requirements have been verified and built successfully without modifying manuscript prose or hand-editing dist assets.
