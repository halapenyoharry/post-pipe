# Task, Refactor post-pipe to consume extracted React components

#post-pipe #refactor #components #task #claude-code

**Created:** 2026-05-12
**For:** Claude Code session, Sonnet 4.6 recommended
**Author:** halapenyoharry (via Claude collaboration in chat)

---

## Goal

post-pipe currently emits a self-contained 425KB `_site/index.html` from `generate-index.js`, with the D3 graph, the reader panel, and the TTS module all inline as template literals inside `buildIndexHTML()`. Jules has extracted those three pieces (GraphViewer, ReaderPanel, TTS) as React components built with Vite in library mode, producing bundled output in `dist/`.

Your job, refactor `generate-index.js` and the emitted `_site/index.html` so the inline graph / reader / TTS code is replaced by mounting these components into target `<div>` elements. The corpus walker, the platform publishers, the GitHub Pages flow, and the `feed.json` schema all stay exactly as they are.

The validation criterion is **behavioral equivalence**. The new `_site/index.html` should behave identically to the old one when viewed against the current `~/Posts/` corpus and `feed.json`. Same interactions, same hover / click / zoom / drag, same reader transitions, same TTS behavior.

---

## Phase 0, Get comfortable with the project

### Read the project context, in this order

1. [`CLAUDE.md`](../CLAUDE.md), operating context, content schemas, design decisions, the Adaptive Execution Flow protocol
2. [`ARCHITECTURE.md`](../ARCHITECTURE.md), full design context, viewer architecture, TTS system
3. [`vision/DECOMPOSITION.md`](../vision/DECOMPOSITION.md), the eight-layer architectural decomposition. This refactor implements **Step 4** of the "Sequence for getting there from here" section, mounting components after extraction.
4. [`vision/FUTURE-STATE.md`](../vision/FUTURE-STATE.md), the original dream record. Preserved as context. Sections are referenced by DECOMPOSITION.md.
5. [`POST-PIPE-BEHAVIOR-DIAGRAM.md`](../POST-PIPE-BEHAVIOR-DIAGRAM.md), the collapse-point catalog showing exactly which inline blobs need to go where. Tier 1 items 1, 2, 3 are the scope of this task.
6. [`TCP.json`](../TCP.json), collaboration protocol.

### Inspect the extracted components

The Jules work is in `src/components/` (or wherever Jules placed it; verify path) with a Vite library-mode build emitting to `dist/`. Read:

- `vite.config.js` (or `.ts`)
- Each component's source directory and entry file
- `package.json` for new dependencies and scripts (look for a build script that produces `dist/`)

Understand the prop interfaces. The components should be **corpus-shaped, not post-shaped**, per [`vision/DECOMPOSITION.md`](../vision/DECOMPOSITION.md). That is, props look like `corpus: Corpus, selection: BundleId | null, onSelect: (id) => void` rather than `posts: Post[]`. Confirm that's how Jules built them. If not, surface the discrepancy as a structural question before refactoring (see Adaptive Execution Flow below).

### Inspect the current `buildIndexHTML()` to be replaced

Read [`generate-index.js`](../generate-index.js), specifically the `buildIndexHTML()` function. It is the big template literal. The contents map to:

- Page-level CSS, theme tokens at `:root` — stays in the host
- D3 library injection — gone, components own this now
- `tts.js` injection — gone, TTS component owns this
- Inline graph rendering JS, the `PostGraph` class, `feedToGraph()` — gone, GraphViewer component owns this
- Inline reader panel JS, `openReader`, `renderSubstrate`, etc. — gone, ReaderPanel component owns this
- TTS integration glue — gone, TTS component owns this
- SVG icon library — verify whether components carry their own icons or the host still injects them
- Runtime settings injection — stays in the host as JSON embedded in the page (or fetched), components read from it

Once you understand what goes and what stays, the refactor's shape is clear.

---

## Phase 1, Commit and bookmark BEFORE any refactor

This is non-negotiable. The pre-refactor state is the recoverable bookmark.

```bash
# 1. Check what's outstanding
git status

# 2. If there's uncommitted work (Jules components, the new decomposition docs, this task file), commit it on whatever branch you're currently on
git add -A
git commit -m "Pre-refactor checkpoint, Jules components extracted, decomposition docs complete"

# 3. Push
git push

# 4. Tag the pre-refactor commit
git tag pre-component-refactor-2026-05-12
git push origin pre-component-refactor-2026-05-12
```

**Commit authorship rule** (from [`CLAUDE.md`](../CLAUDE.md)), all commits authored as `halapenyoharry`. Never as Claude, never as any AI agent name. Configure git user before committing if needed:

```bash
git config user.name "halapenyoharry"
git config user.email "<the email associated with the GitHub account>"
```

This tag is where to return if anything in the refactor goes sideways. After the tag is pushed and verified visible on the remote, proceed to Phase 2.

---

## Phase 2, Create the feature branch

```bash
git checkout -b feat/components-from-library
```

All refactor work happens on this branch. Do not push to `main`. Do not merge to `main`. Harry reviews and merges himself.

---

## Phase 3, The refactor

### What stays untouched

- `ingest.js`, the corpus walker
- `platforms/*.js`, all platform publishers
- `feed.json` schema, the data contract is the seam
- `_site/feed.json` build path
- `_site/covers/` copy logic
- `settings.json` consumption, same fields, same meaning
- All design tokens, theme behavior, font loading, same output to the browser
- The TTS engine registry pattern, preserved (it is already a tile-shaped registry, it just lifts out of inline)

### What changes

`generate-index.js::buildIndexHTML()` currently does:

1. Reads D3 library, `tts.js`, fonts
2. Embeds settings as runtime config
3. Emits a giant template literal containing CSS, graph JS, reader JS, TTS integration JS, SVG icons, and HTML structure

After refactor, `buildIndexHTML()` should:

1. Emit a thin HTML shell with mount points (`<div id="graph-root"></div>`, `<div id="reader-root"></div>`, etc.)
2. Reference the component library bundle via `<script type="module" src="./components.js"></script>` and `<link rel="stylesheet" href="./components.css">`
3. Emit a small inline boot script that loads `feed.json`, then calls the components' mount functions with the right props (corpus shape, settings, theme tokens)
4. Copy the library build outputs from `dist/` into `_site/` alongside `feed.json`, `covers/`, etc.

The CSS that was inlined splits in two:
- Component-internal CSS now lives in the library's CSS output (component-scoped, encapsulated)
- Host-level CSS (page layout, theme tokens at `:root`, font face declarations, the surrounding chrome) stays in `buildIndexHTML()` as a small style block

### Build integration

The library bundle has to be built before `generate-index.js` can copy it into `_site/`. Two options:

1. Run `npm run build` (or whatever the library build script is) as a prerequisite step, manually or via a wrapper script
2. Add a build step inside `generate-index.js` itself (e.g., spawn the vite build, then proceed)

Option 1 is simpler and decouples cleanly. Probably the right move for now. Consider adding a top-level `npm run build:site` script that chains both, for documentation and reproducibility.

---

## Phase 4, Commit cadence

Make small commits. Each one should be a coherent unit of work that leaves the build in a runnable state. Suggested sequence:

1. `Refactor, bootstrap component library build integration` — wire up the `dist/` outputs into the build path, copy them into `_site/`, no behavior change yet (inline blobs still present, just both paths exist)
2. `Refactor, replace inline graph with GraphViewer component mount` — graph swap, validate interaction parity (see validation below)
3. `Refactor, replace inline reader with ReaderPanel component mount` — reader swap, validate all reader modes
4. `Refactor, replace inline TTS with TTS component mount` — TTS swap, validate all engines
5. `Refactor, remove now-dead inline template literals from buildIndexHTML` — cleanup pass
6. `Refactor, final behavioral-equivalence validation` — anything surfaced during testing, fixes for it

If you discover that the components were built with assumptions that don't match what `generate-index.js` needs to pass them (missing prop, missing exposed mount function, library bundle in unexpected format, etc.), **stop**. Apply the Adaptive Execution Flow protocol from [`CLAUDE.md`](../CLAUDE.md):

1. Identify the exact mechanical reason for the barrier
2. Do not invent a workaround
3. Ask Harry one specific question with one specific request for what you need
4. Wait for input
5. Resume from the point of failure

---

## Phase 5, Validation, before pushing the branch

Run all five before considering the refactor done:

### 1. Build comparison

Save the pre-refactor `_site/index.html` (it's in the bookmarked commit if you've already overwritten it). After the refactor, run `node generate-index.js`. Open both in browsers side by side and walk through every visible feature.

### 2. Interaction parity

- Click various graph nodes (essays, images, podcasts, fragments). Reader opens for each.
- Hover nodes. Tooltips appear.
- Drag nodes. Force sim responds.
- Click a tag node. Connected nodes highlight, others dim. Click again or click background, restore.
- Pan and zoom the graph.
- Open the reader in phone mode and sidebar mode. Swap between them.
- Scroll a long article. Progress bar updates.
- Trigger TTS with each available engine. Highlighting works.
- Use all reader toolbar buttons (export markdown, copy, close, syndication links).

### 3. Substrate dispatch

Open at least one node of each kind that exists in your `~/Posts/` corpus, essay, multi, image, podcast-episode, fragment. Each should render correctly through whatever path `renderSubstrate` used to handle (essay fetches HTML and injects, image shows inline, others show placeholder plus metadata).

### 4. No console errors

Open browser devtools. Console should be clean. Network panel should show only expected requests.

### 5. `feed.json` byte-identical

The data contract did not change. From the repo root, compare the pre- and post-refactor `_site/feed.json`:

```bash
git show pre-component-refactor-2026-05-12:_site/feed.json > /tmp/feed-before.json
node generate-index.js
diff /tmp/feed-before.json _site/feed.json
```

The diff must be empty. If it isn't, something in the build path drifted, find it before pushing.

---

## Phase 6, Push the branch

Once all five validation checks pass:

```bash
git push -u origin feat/components-from-library
```

Do **not** merge. Harry reviews the diff and merges himself.

Report back with a summary, what was done, what tests passed, anything notable that came up during validation, and the branch name plus the pre-refactor tag for reference.

---

## Out of scope for this task

These are tempting but not this task's job:

- Splitting lens spec from renderer (Step 5 of the DECOMPOSITION sequence)
- Mounting components inside the eventual exoskeleton (Step 4 in a different sense, the exoskeleton does not exist yet)
- Promoting edges to first-class objects (Step 7)
- Migrating to relaxed leaf bundles (Step 8)
- Building new source adapters (Step 9)
- Anything in the multi-corpus, Rosetta, flow, or infeed arcs

Stay strictly within "replace inline blobs with component mounts, preserve behavior." Anything else is a separate ticket.

---

## Operating notes

- **Reflection over suggestions.** If the prop interface needs negotiation, surface that as a structural question, do not silently invent a shape.
- **The `_site/` directory is the deploy surface.** It is git-tracked. Its output is production for GitHub Pages.
- **Do not reformat unrelated code.** Diff hygiene matters. This is a targeted refactor, not a cleanup pass.
- **The components are Layer 4 + Layer 5 panels** per [`vision/DECOMPOSITION.md`](../vision/DECOMPOSITION.md). Mounting them is the seam between Layer 0 (the eventual exoskeleton) and Layers 4 / 5. For now, `_site/index.html` is itself the host; later the exoskeleton replaces it. Keep the mount API clean enough that the exoskeleton can use the same calls.
- **Harry calls himself Harry**, in conversation. In commits, the author is `halapenyoharry`.
- **Negentropy preferred.** The whole point of this refactor is that post-pipe stops being a 425KB monolith without losing any of the accumulated behavior. Preserve, do not reset.

---

## Reference, the bookmark

After Phase 1, the recoverable state is:

```
Tag:        pre-component-refactor-2026-05-12
Branch:     (whatever branch you committed it on, probably main)
Remote:     pushed
```

If anything in the refactor produces output you cannot explain, return to that tag and start over.
