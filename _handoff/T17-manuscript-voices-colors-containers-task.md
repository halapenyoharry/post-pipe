# T17 — New manuscript home, voices, colors, act status, containers finished

#post-pipe #EoEJ #launch
Read `CLAUDE.md` first. Follows T14–T16 (`_handoff/T16-report.md`).

## ABSOLUTE RULES

- **Never edit anything in `~/Writing`**, including the new manuscript repo `~/Writing/the-epic-of-elinor-jones`. Read it only.
- Work in `~/Projects/post-pipe` and `~/Projects/epicofelinorjones.com`. Engine stays content-agnostic; site-specific values go in the site's `settings.json`.
- **One commit per part**, in the repo it belongs to. Commit messages are short, plain, lowercase, first person, the way Harold writes them (e.g. `removed kokoro, three english voices instead`). No tool, model, droid, or task names in messages. Do not change git config. **Do not push. Do not deploy.**
- `npm test` passes after every engine commit.
- Do not end your turn after reading files, and do not stop after one part. Keep going through all parts, then rebuild, verify, and report.

## 0. Book and act containers are indistinguishable (do this first)

Harold's screenshot: Act 1 sits in the middle of the book container and the book label draws on top of the Act 1 label. Causes found in `GraphViewer.jsx`:
- `createContainerSpiralForce` uses `getAllMemberSlugs(c.id)`, so the **book** container spirals all 28 chapters of all acts around one chapter, fighting each act's own spiral and pulling the book's first chapter (in Act 1) to the book's centroid. Spiral only over a container's **direct** children. For a container whose children are containers, place the child containers (as units, by their centroid) on the spiral, not their chapters.
- The first member is pulled to the centroid (`cp.y`); `targetY` is computed and never used. Pull it to just below the label.
- Members are ordered by `date`. Order by the member's order in the container (chapter number / `series_part` / manuscript order), falling back to date.
- The label's rectangle is not an obstacle to anything. Make each container's label rectangle repel member nodes **and child containers** (including a child's hull and label), at every level.
- Done means: in the Act-1-only-published build, the book label, Act 1, Act 2, and Act 3 labels are all fully visible and non-overlapping on desktop and 390×844, and Act 1 is not centered under the book label.

**Note:** a previous run of this task started part 1 and stopped: `settings.manuscript.root` in the site is already changed (keep it), and `~/Projects/post-pipe/patch_commits.py` is a scratch script. Use it or not, but don't commit it; delete it when done.

## 1. Site reads the new manuscript repo

- The canonical manuscript moved to `~/Writing/the-epic-of-elinor-jones` (folders `ACT1/`, `ACT2/`, `ACT3/`, `_unplaced-scenes/` at the repo root, full history kept). Point `settings.manuscript.root` there and fix any path in `scripts/build.js` that assumed the old `the_epic_of_elinor_jones/_final-draft-EoEJ` layout or the old repo root.
- Every commit id changed in the split. The map old→new is `~/Documents/EoEJ-private/commit-map-split-2026-09-30.txt` (two columns, old then new). Rewrite every stored commit id in the site repo (e.g. `published-versions.json`, per-chapter metadata) through that map. Report any id not found in the map.
- The commits dimension and version maps must read the new repo and show the same history as before (same dates and messages, new ids).

## 2. Engine: ready for front matter in the manuscript

- Strip a leading YAML front matter block from the text **before** paragraph numbering, version maps, anchors, word counts, and TTS. A file gaining front matter must not shift any paragraph number.
- In the commits dimension, commits whose message starts with `meta:` are structural: excluded from the revision timeline by default (`settings.commits.hideMeta`, default `true`).
- Tests for both.

## 3. Voices: Kokoro out, a few curated English voices in

- Remove Kokoro completely: code, worker (`kokoro-worker.js`), settings, picker entries, build copies (the site's `_site/kokoro-worker.js`).
- Replace the long browser voice list with a **curated list of English voices**: a settings list of preferred voice names in order (e.g. on Apple devices: Samantha, Daniel, Karen, Moira, Tessa; on Chrome: Google US English, Google UK English Female/Male; on Windows: Microsoft Aria, Jenny, Guy). Show only those that exist on the reader's device, at most five, plus one fallback if none match. Keep any non-browser voice that currently works (e.g. Gemini TTS) only if it's already wired and working; list what you kept in the report.

## 4. Colors and settings broken by recent work

Harold reports that recent sprints broke color settings and other appearance settings. Find every appearance setting the engine reads (`settings.graph`, theme, container colors, node colors, label colors, dark/light), check each still takes effect after T8–T16, and **fix it or remove it**. No setting may exist that silently does nothing. List each: works / fixed / removed.

## 5. Act status labels for title-only containers

- A container can carry a short status line under its title: `settings.containers.<id>.status` (site) or a front matter/metadata `status` on the container. Shown on the open and closed container, smaller than the title.
- Site values: Act 2 `beginning October 15th`, Act 3 `soon`.

## 6. Finish T16 part 5 (containers open and close)

T16 only added `initialCollapsed`. Still missing:
- Public API: `openContainer(id)`, `closeContainer(id)`, `toggleContainer(id)`, `getContainerState()`.
- A **single tap on a container's title** toggles it (Harold's choice; not double-tap, which readers use to zoom). Set `collapseGesture` default and site value to `tap`, and make sure a tap on the title is distinguished from dragging.
- A closed container is drawn as a node, but larger, with larger text and a softer, blobbier outline than chapter nodes, in the container's color, showing its title, count, and status line.
- A control in the panel to open or close all.

## Finish

- Rebuild all three bundles (`npm run build`, `npm run build:lib`, `npm run build:embed`) and commit `dist*/`.
- Rebuild the site (`node scripts/build.js`).
- Run the Playwright checks from T16 in Chromium and WebKit, desktop and 390×844: select/unselect four ways, tap container title to close and reopen, voice picker shows ≤5 voices. Put a results table in the report.
- Verify `_site/`: Act 1 fully present; Act 2 and 3 titles and status lines present, no body text, no `<!--`; no `kokoro` anywhere.
- `_handoff/T17-report.md`: per part, what changed, files, tests, settings with defaults, the results table, the `_site/` checks, anything uncertain.
