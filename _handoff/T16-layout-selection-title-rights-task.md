# T16 — Labels, spiral layout, selection bugs, title-only posting, containers as nodes, rights

#post-pipe #layout #mobile #visibility #rights
Read `CLAUDE.md` first. Follows T14 and T15 (`_handoff/T14-report.md`, `_handoff/T15-report.md`). Screenshots from Harold (2026-09-30): the book label and the Act 1 label render on top of each other at the same center, chapter nodes cover both labels, and the outer book container collapsed onto Act 1 once Acts 2 and 3 were hidden.

## ABSOLUTE RULES

- **Never edit anything in `~/Writing`.**
- Work in `~/Projects/post-pipe` and `~/Projects/epicofelinorjones.com` only. Engine stays content-agnostic; every value a site might change is a setting with a default.
- One commit per part, message describes the change. Do not change git config. **Do not push. Do not deploy.**
- `npm test` passes after every engine commit.
- Do not end your turn after reading files, and do not stop after one part. Keep going through all parts, then rebuild, verify, and report.

## 1. Container labels never overlapped (cluster layout)

- Each container's label is a **reserved rectangle** in its parent's layout: no node, edge label, child container, or other label may overlap it. Applies at every nesting level (a book label must not sit on an act label).
- Label position: horizontally centered, vertically about **one third down from the top** of the container's final extent. Compute it from the laid-out member positions so the label ends up at the top third, and keep it there through simulation ticks, collapse, and resize.

## 2. Spiral placement inside a container (cluster layout)

- If the container has a first member (lowest order / chapter one), place it directly **below the label, centered**.
- Place the remaining members in order on a golden-angle spiral (phyllotaxis) around that first member: member *k* at angle *k* × 137.508° and radius *c*·√*k*, with *c* from node size plus a spacing setting (`settings.graph.spiral.spacing`). The spiral must skip the label rectangle (push the point outward along its ray until clear).
- Use these as initial positions and as a gentle positional force, so the result stays readable and doesn't collapse back into a heap. Setting `settings.graph.spiral.enabled`, default `true` for cluster layout.
- Ring layout unchanged.

## 3. Selection bugs

- **Chrome, Mac:** after selecting a chapter it cannot be unselected, even after Reset layout or a hard refresh. Likely the `#read=` hash (added in #9) survives the reload and reselects. Required: tapping the selected node again, tapping empty canvas, Escape, and Reset layout all unselect and clear the hash with `history.replaceState`. A reload with a `#read=` hash may open that chapter once, but must still be unselectable.
- **Safari, Mac:** nodes cannot be selected at all. Find the cause (suspects: the touch/tap threshold and pointer handling from #14, `touch-action`, pointer vs mouse events, WebKit-specific event order).
- **Test in both engines:** Playwright Chromium is installed. Install WebKit to the Playwright cache (`npx playwright install webkit`; this writes to `~/Library/Caches`, not the repo). Write a small script (not committed to `src/`; put it in `test/e2e/` if you commit it) that loads the built site, selects a node, unselects it four ways, reloads with a hash, and runs in both Chromium and WebKit at desktop and 390×844 phone sizes. Report the results.

## 4. `posted: title`

- `posted` accepts `yes` | `no` | `title`. `title`: the node appears with its title (and container membership, edges between title-only and visible nodes allowed) but **no content**: no page, no reader, no text, no audio, no feed body, no search entry, no version map, no commits entry. Tapping it shows the title and a quiet "not yet published" state, nothing else. It must not be possible to reach the text by URL or hash.
- Container counts show visible + title nodes; the reader treats title nodes as unreadable.
- **Site:** change the build so acts not listed in `publishedActs` get `posted: title` (instead of `no`), which restores the book container with all three acts. Verify by grep on `_site/` that no Act 2 or Act 3 **body text** or `<!--` comment appears anywhere, while their titles do.

## 5. Containers open and close, reader and program

- A public API on the component: `openContainer(id)`, `closeContainer(id)`, `toggleContainer(id)`, `getContainerState()`, plus `settings.graph.initialCollapsed` (list of ids or `"all"`).
- A **closed container looks like a node, but larger**: bigger text, a softer, blobbier outline than chapter nodes, its title and count, and it takes the container's color. Opening animates back out to the spiral.
- Reader controls: tap/double-tap per `collapseGesture` (from #14) and a control in the panel to open or close all.

## 6. Rights (central, in generated output only)

- Engine setting `settings.rights`: `{ holder, year, statement, noAiTraining }`. Site values: holder `Harold Young`, year `2026`, statement `All rights reserved. No part of this work may be reproduced, distributed, or used to train any machine-learning system without written permission.`, `noAiTraining: true`.
- Output: a quiet footer line on every page and in the reader; `<meta name="copyright">` and `rights` in `feed.json`; when `noAiTraining` is true, `<meta name="robots" content="noai, noimageai">` and a `robots.txt` that disallows known AI crawlers (GPTBot, ClaudeBot, anthropic-ai, Google-Extended, CCBot, PerplexityBot, Bytespider, Applebot-Extended) while allowing ordinary search.
- Nothing is written into the manuscript.

## Finish

- Rebuild all three bundles and commit `dist*/` (T15 left `dist-embed/` and `dist-lib/` uncommitted; include them).
- Rebuild the site (`node scripts/build.js` in the site repo).
- `_handoff/T16-report.md`: per part, what changed, files, tests, settings with defaults, the Playwright results table (engine × size × check), the `_site/` grep output, and anything uncertain.
