Task T9: four display changes. Work in `~/Projects/post-pipe` (engine) and `~/Projects/epicofelinorjones.com` (site settings only). Read `~/Projects/epicofelinorjones.com/DROIDZ.md` first: the engine stays content-agnostic (nothing novel-specific in engine code; site-specific text goes in the site's `settings.json`). Do not edit `dist/` or `dist-embed/` by hand. Do not commit.

## 1. Container labels: much bigger

In `src/components/GraphViewer/GraphViewer.jsx`, the container label (`.container-badge-text`, created with `font-size` 28px for top-level / 22px for nested) and the collapsed container node text: make them **64px for top-level and 52px for nested**, with the count tspan at about 45% of that. Same sizes in the collapsed node. Keep color and opacity. The label stays centered in the hull (see `updateContainers`, which positions it at `d3.polygonCentroid(hull)` each frame; keep that).

## 2. Containers don't overlap

Add a d3 force (registered on the simulation like the existing forces, active only when containers exist) that keeps containers apart:
- For each container, each tick: centroid of its visible member nodes (including nested members) and radius = max member distance from that centroid + the member's half card size + the container's `padding` (default 40).
- For every pair of **sibling** containers (same `parent`, including two top-level ones), if the circles overlap, push every member of each container away from the other along the line between centroids, by `overlap * alpha * 0.5` split between the two.
- Nodes that belong to no container are pushed out of any top-level container's circle the same way.
- Skip collapsed containers' hidden members (use the collapsed node's position instead).
Keep the existing forces unchanged.

## 3. Paragraph style: two independent switches

Today one setting, `paragraphStyle`, is `'space'` or `'indent'`. Replace it with two booleans in `src/lib/viewState.js`: `paragraphIndent()` / `setParagraphIndent(bool)` (default false) and `paragraphSpace()` / `setParagraphSpace(bool)` (default true). If saved state has the old `paragraphStyle`, map `'indent'` to indent on + space off, and `'space'` to indent off + space on.
- `src/components/Settings/Settings.jsx`: replace the two-button choice with two toggles, **Indent first line** and **Space between**; both can be on.
- Apply as two attributes on `<html>`: `data-pp-indent="on|off"` and `data-pp-space="on|off"` (replace `data-pp-paragraph`).
- CSS in `ReaderPanel.module.css` (`.body`) and `NodeView/TextView/TextView.module.css` (`.scroll`): replace the existing `data-pp-paragraph` rules. Indent on: `p { text-indent: 1.5em }`, with the first paragraph and any paragraph right after a heading, `hr`, or `blockquote` at `text-indent: 0`. Space on: `p { margin: 0 0 1em }`. Space off: `p { margin: 0 }`.
- Find why "space" currently has no visible effect in the node's scrolling text (look for rules in `TextView.module.css` or global CSS that set paragraph margins to 0 or override them) and make both switches visibly work in both the reader pane and the node's text.

## 4. Chapter cards: title and a subtitle, no summary

- In the unselected (not open) card, **do not show the summary** (the `idea.tldr` / description text). Leave the data untouched. Open cards keep showing the chapter text as now.
- Show the **title** large and bold, and under it a **subtitle** in a smaller, lighter weight, with tight spacing between them (line-height about 1.05, 2–4px gap), centered in the card. Keep the existing card style (colors, glow, borders).
- The subtitle comes from a new site setting: `settings.graph.card.subtitle`, a template string. `{n}` = the item's `series_part` as a number, `{n_words}` = the same number written in lowercase English words (one, two, … up to ninety-nine). If the setting is absent or the item has no `series_part`, show no subtitle. The template is passed from settings into the page the same way other `settings.graph` values reach the viewer.
- In `~/Projects/epicofelinorjones.com/settings.json` set `"graph": { ..., "card": { "subtitle": "chapter {n_words}" } }` (merge into the existing `graph` object; change nothing else).

## Done means

`cd ~/Projects/post-pipe && npm test` passes; `npm run build`, `npm run build:lib`, `npm run build:embed` succeed; `node ~/Projects/epicofelinorjones.com/scripts/build.js --preview` runs. Write `~/Projects/post-pipe/_handoff/T9-report.md`: for each part, what you changed (files/functions), why "space" was not working, and anything UNSURE.
