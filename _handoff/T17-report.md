# T17 Report

All parts done. Engine: `npm test` passes (121 tests) after every engine commit. Three bundles rebuilt and committed. Site rebuilt. Nothing pushed, nothing deployed, nothing under `~/Writing` edited.

## Commits

**post-pipe** (after 8002feb)

| commit | part |
|---|---|
| 8c2cea4 laid out containers from the inside out so no label sits on another label, a card, or a child container | 0 |
| d8ed6b6 front matter comes off before anything counts or numbers the text, and meta: commits stay out of the revision timeline | 2 |
| 6f7a18b removed kokoro and the supertonic stub, the voice picker offers at most five curated english voices | 3 |
| 99db425 theme colors reach the graph, cards, reader and voice bar again, every card setting is read or gone, and the reader opens without crashing | 4 |
| de4c1b1 containers can carry a short status line under their title, open or closed | 5 |
| d49e096 a tap on a container's title opens or closes it, closed containers are soft blobs with title, count and status, open/close all in the panel, and an api for programs | 6 |
| 84379b9 the page clears #read= whenever the reader closes, a tap that doesn't move a card no longer eats safari's click, and title-only chapters aren't fetched | finish (found by the checks) |
| 05672c9 browser checks for selection, containers and voices in chromium and webkit | finish |
| b3e1463 rebuilt the three bundles | finish |
| 2f3c15a the generated page carries no html comments | finish |

**epicofelinorjones.com** (after 1d6008e)

| commit | part |
|---|---|
| 781180e reading the manuscript from its own repo now, ~/Writing/the-epic-of-elinor-jones | 1 |
| a5a061b build strips manuscript front matter and hands the engine commit messages so meta: commits can be left out | 2 |
| 3e8bc76 removed kokoro, a few curated english voices instead | 3 |
| ac535b4 dropped appearance settings nothing reads: badgeBg, compactHeight; card title max set to the 26 it has always been | 4 |
| 89a0616 act 2 says beginning october 15th, act 3 says soon | 5 |
| 8f5a2b6 containers open and close with a single tap on the title | 6 |

## 0. Book and act containers

8002feb did not meet "Done means": on the Act-1-only build, labels overlapped 13 chapter cards on desktop and 8 on the phone, the book label sat on Act 1's hull, the view wasn't framed, and the page threw `e.notify is not a function` when the layout settled (so the settled layout was never saved).

- **What changed:** the spiral and label-repel forces are replaced by a pure nested layout, `containerLayout.js`. Each container is laid out in its own frame. Its label is a reserved rectangle at the origin, and the first unit sits directly below it, centred. The remaining units follow a golden-angle spiral (k × 137.508°, radius c·√k), each pushed outward along its ray until it clears the label and every unit already placed. Units are ordered by `series_part` (chapter number), then date, then declaration order. A container whose children are containers places each child as one box (label, hull and padding included), laid out first. So the book places Act 1, 2, 3 as boxes and never spirals their chapters. The graph turns the result into a positional force, relative to each top-level container's measured offset. Members also start at their targets, so the first frame is already the arrangement.
- Inside a laid-out container, repulsion is turned down, link springs are turned off, and collision uses the circle inscribed in the card, because the layout already guarantees no overlap. These forces used to push members off their targets and grow the hull into a neighbour's label.
- Each label follows its own container's members, so dragging one act moves that act's label with it. The hull wraps the label too.
- Once the layout settles, the view is framed to every container (all labels and hulls), unless the reader has already panned or zoomed.
- Removed the stray `vs.notify()` call behind the crash. `LAYOUT_VERSION` bumped to `per-layout-positions-4`, so the old auto-saved piles are dropped (hand-placed positions are kept).
- **Files:** `src/components/GraphViewer/containerLayout.js` (new), `GraphViewer.jsx`, `generate-index.js`, `src/embed.jsx`, `test/containerLayout.test.js` (new: no label overlaps a label, child box or card; cards never overlap; first unit under the label; order beats date; closed child is one box).
- **Verified** on the Act-1-only build, Chromium and WebKit, 1280×800 and 390×844:

| | label on label | label on another container's hull | label on card (screen) | label on card / card on card (world) | label offscreen |
|---|---|---|---|---|---|
| chromium desktop | 0 | 0 | 0 | 0 | 0 |
| chromium phone | 0 | 0 | 0 | 0 | 0 |
| webkit desktop | 0 | 0 | 0 | 0 | 0 |
| webkit phone | 0 | 0 | 0 | 0 | 0 |

  Act 1 now sits below the book label, clear of it. It is no longer centred under (behind) it.
- **Scratch script:** `patch_commits.py` did not exist when I started, so there was nothing to delete.

## 1. Site reads the new manuscript repo

- `settings.manuscript.root` = `~/Writing/the-epic-of-elinor-jones` (the earlier run's change, kept and committed).
- `scripts/build.js` already resolved every git path relative to the manuscript root (`git show <commit>:./<source>`, `git log --follow -- <source>`), which is right for the new repo. It now warns if the root is not a git repo, or is a subfolder of a larger one (the old layout). A failed version map now names the commit that wasn't found.
- `DROIDZ.md` and `DROiD-LEAD.md` point at the new repo (and its GitHub remote).
- **Commit ids:** I scanned every tracked file in the site repo for any of the 10,061 old ids in `commit-map-split-2026-09-30.txt`, full or 7-character. The site repo stores **no commit ids at all**: `published-versions.json` has been `{}` since it was created, per-chapter metadata has no commit field, and the only hex strings in the repo are two colours. So nothing needed rewriting, and no id is missing from the map.
- **History check (old repo vs new, per chapter, `%cI %s` with `--follow`):**
  - Identical in 5 of the 11 chapters that have metadata: ch05–ch09.
  - Different in 6: ch01 and ch02 lose one old commit (`0d817b4`, 2025-12-28 bulk add; it exists in the new repo as `1c5d185`, but `--follow` no longer reaches it for those paths). ch10 and ch11 begin at "auto-sync setup" (2026-03-10) instead of "Initial commit" (2025-11-09), because those files lived outside the final-draft folder before 2026-03-10 and that history wasn't carried into the split. ch03 and ch04 also lose one commit each, which I didn't trace commit by commit; I expect the same cause as ch01/ch02.
  - This is a property of the split. The site can't restore it without reading the old repo. Version maps: 0 before, 0 after (the ledger is empty).

## 2. Engine: front matter

- `src/lib/frontMatter.js` (new): `splitFrontMatter`, `stripFrontMatter`, `isMetaCommit`, `commitTimes`. A leading block counts as front matter only if it is fenced by `---` and parses as a YAML **mapping** (via gray-matter's YAML engine). A chapter that opens with a `---` scene break, prose, and another `---` is left alone, and so is an unclosed fence.
- **Where it is stripped:**
  - Engine: `LocalFolderAdapter` strips it before rendering a page, so paragraph numbers, anchors, reader and TTS all read the body only.
  - Site `build.js` strips it before the heading strip, word count, version id, and paragraph maps (both the current text and old versions pulled from git).
- **Commits:** the site build now emits `commits: [{date, message}]` per chapter (`commit_times` is no longer written). The engine turns these into `commit_times` and drops `meta:` commits unless `settings.commits.hideMeta` is `false` (default `true`, case-insensitive prefix). The engine's own git fallback reads messages too. The one `meta:` commit in the manuscript today touches no chapter, so the timeline is unchanged (28/28 items identical).
- **Tests:** `test/frontMatter.test.js` (7): strip and parse; gaining front matter shifts no paragraph number; prose between rules untouched; unclosed fence untouched; no-op on plain text; `meta:` detection; `commitTimes` with and without `hideMeta`.

## 3. Voices

- **Removed completely:** the Kokoro engine in `tts.js`, `kokoro-worker.js` (moved to the Trash, removed from git), its `TTS_CONFIG` keys and worker copy in `generate-index.js`, its keys in `embed.jsx`, its entries in both `settings.json` files, the ARCHITECTURE entry, and the site's `_site/kokoro-worker.js` (Trash). `grep -ri kokoro _site` finds nothing, and neither do the bundles.
- **Also removed:** the Supertonic engine. It was a stub whose worker file has never existed, so it could not have worked.
- **Kept:** Gemini TTS, as it was: registered, **not exposed** on the site (`exposed: false`), key only emitted when exposed. I did not verify that it works, because that would call a billed external API. Readers of the site can't see it either way.
- **Curated voices:** `settings.tts.engines.browser.preferredVoices` is an ordered list of names (default and site: Samantha, Daniel, Karen, Moira, Tessa, Google US English, Google UK English Female, Google UK English Male, Microsoft Aria, Microsoft Jenny, Microsoft Guy), and `maxVoices` defaults to 5. Only English voices on the reader's device are offered, matched exactly or by prefix (so "Samantha (Enhanced)" or "Microsoft Aria Online (Natural) - English (United States)" match), in list order, at most `maxVoices`. If none match, one English voice is offered as a fallback. The picker is now a flat list (no language groups), and the engine dropdown is hidden when there is only one engine.
- The old unused `voices: "auto"` key is gone.

## 4. Appearance settings: works / fixed / removed

**Root causes:**

- The graph, reader and voice-bar stylesheets declared their own colour variables on their own root elements. That shadowed the `:root` values `generate-index.js` and the embed write from `settings.theme`, so theme colours never reached them. Defaults now sit in a zero-specificity `:where(:root)` rule that the theme always beats.
- Cards took their status colour from a value read once at mount. They now use CSS variables, so both the theme and the reader's Settings profile reach them live.

| setting | status |
|---|---|
| `theme.bg` | works (page background; embed container) |
| `theme.surface` | **fixed** (reader panel surface; was shadowed) |
| `theme.accent` | **fixed** (graph accent, card accent, reader, voice bar, time overlay; was shadowed) |
| `theme.text` | works for page text; **fixed** for reader and voice bar |
| `theme.text_bright` | **fixed** (reader) |
| `theme.border` | **fixed** (reader) |
| `theme.node_published`, `theme.node_draft` | **fixed** (cards outside containers; also Settings' "Default" colours) |
| `theme.tag_color` | **fixed** (tag bubbles) |
| `containment[].color`, `badgeColor`, `stroke` | works (label colour, card glow, sequence edges) |
| `containment[].fill`, `strokeDasharray`, `strokeWidth`, `padding` | works (padding now also drives the layout) |
| `containment[].badgeBg` | **removed** (read nowhere; the label has no background) |
| `graph.card.width/height/hover*/pinned*/min*/max*/glowPadding` | works |
| `graph.card.cornerRadius` | **fixed** (was read nowhere; card corners) |
| `graph.card.labelMinFontSize`, `labelMaxFontSize` | **fixed** (were read nowhere; the card title was hard-wired 14–26px). Site value was 36; set to 26 so nothing moves. Raise it if 36 was intended. |
| `graph.card.imageMarkSize` | **fixed** (was read nowhere) |
| `graph.card.compactHeight` | **removed** (no compact mode exists) |
| `graph.card.subtitle` | works |
| `graph.tag.*`, `graph.timeAxis.*`, `graph.simulation.*` | works |
| `graph.spiral.enabled`, `spacing` | works (new layout) |
| `graph.labelSize.min/max` | works |
| `graph.containerSpacing` | works (top-level containers) |
| `graph.initialCollapsed` | **fixed** (members of initially closed containers were still drawn) |
| `graph.collapseGesture` | **fixed** (see part 6) |
| Settings colours: Draft, Published, Tags, Topology, Placeholder | **fixed**. They reach cards and bubbles live, and the panel now offers only the colours the corpus actually draws. On this site every chapter takes its act's colour and there are no tag, topology or placeholder nodes, so the panel shows no colour pickers (before, five that did nothing). "Default"/Reset now means the site theme, not engine colours. |
| dark / light | no such setting exists in the engine or the site |

**Also fixed here:** opening any chapter crashed the whole page (`currentBookmark is not defined`). In `ReaderPanel.jsx`, three lines had been pasted inside `getPersistentId`, which also made it call itself. Bookmark lookups compared a bookmark's own id to the chapter id, so the bookmark toggle and note never matched anything. The marks list called a function that only existed inside an effect. All repaired.

## 5. Status lines

- Engine: a container may carry `status` on its containment entry, or in `settings.containers.<id>.status`, which wins and may be keyed by full or bare id. `generate-index.js` merges it into `feed.containers`. It is drawn as a smaller line (0.42 of the title) under the title, in the container's colour, both on the open label and on the closed node. The layout's label rectangle includes it.
- Site: `settings.containers`: `container:act-2` → `beginning October 15th`, `container:act-3` → `soon`.

## 6. Containers open and close

- **API:** `openContainer(id)`, `closeContainer(id)`, `toggleContainer(id)`, `openAllContainers()`, `closeAllContainers()`, `getContainerState()` (→ `{id: 'open'|'closed'}`).
  - Available as `GraphViewer`'s `apiRef` prop, as `window.PostPipeGraph` on the generated page, and on the object `PostPipe.init()` resolves to.
  - Also as window events: `graph:open-container`, `graph:close-container`, `graph:toggle-container` (`{detail:{id}}`), `graph:open-all-containers`, `graph:close-all-containers`. Changes announce `graph:containers-changed`.
- **Tap:** a single tap on a title toggles it. The title text ignored the pointer, so there was nothing to hit; there is now a transparent hit area sized to the label. Edges drawn across a title also swallowed the tap and are now pointer-transparent (they have no interactions). Under 4px of movement is a tap; more drags the container. The tap no longer bubbles to the canvas, which would have closed the reader. `collapseGesture` default and site value: `tap` (`doubletap` still available).
- **Closed look:** a blob in the container's colour (superellipse outline, slight fixed wobble per container, glow), at least 1.5× a chapter card. The title is 1.6× the card title's max size (1.25× more for a top-level container), with count and status line.
- **Layout on open/close:** the layout is recomputed, the top-level label stays put, members animate to their new places, and the view re-frames unless the reader has moved it.
- **Panel:** Settings (gear) has a Containers row with Open all and Close all, shown when the corpus has containers.

## Found by the checks, fixed (84379b9)

- The site page (`generate-index.js`) never received T16's selection fixes, which went into `embed.jsx` only. It now writes `#read=<id>` when a chapter opens and clears it on every close: same chapter again, empty canvas, Escape, Reset layout, the reader's close button, Back.
- **Safari/WebKit: nodes could not be selected** (T16's open bug). Every press on a card, even one that didn't move, wrote a position and committed it to view state on mouseup. That re-rendered every card mid-click, and WebKit (unlike Chrome) drops a click whose pressed element was replaced. A press under the click distance now writes nothing. WebKit now gets click and dblclick.
- Tapping a title-only (Act 2/3) chapter tried to fetch its page from the staging server and logged an access-control error. Title-only items are no longer fetched.

## Playwright results (final build, `node test/e2e/t17_checks.js`)

Select = double-click (desktop) or tap plus double-tap (phone, touch) on Act 1 chapter one. When the reader covers that card, the "same chapter again" check sends the event to the card element. On the phone the reader covers the entire canvas, so "empty canvas" can't be tapped (n/a). Voice lists: "this device" is the real macOS voice list. The other two use stubbed device voice lists to exercise the cap and the fallback.

| engine | size | check | result | note |
|---|---|---|---|---|
| chromium | desktop | select (double-tap chapter) | PASS |  |
| chromium | desktop | unselect: same chapter again | PASS | card under reader; event on card |
| chromium | desktop | unselect: empty canvas | PASS |  |
| chromium | desktop | unselect: Escape | PASS |  |
| chromium | desktop | unselect: Reset layout | PASS |  |
| chromium | desktop | reload with #read= opens once, then unselects and stays closed | PASS |  |
| chromium | desktop | tap container title closes it | PASS |  |
| chromium | desktop | tap closed container reopens it | PASS |  |
| chromium | desktop | drag on title moves, does not toggle | PASS |  |
| chromium | desktop | voice picker, this device | PASS | 5 voice(s): Samantha, Daniel, Karen, Moira, Tessa |
| chromium | desktop | voice picker, 15 device voices | PASS | Samantha, Daniel, Karen, Moira, Tessa |
| chromium | desktop | voice picker, none preferred | PASS | Albert |
| chromium | desktop | no page errors | PASS |  |
| chromium | phone | select (double-tap chapter) | PASS |  |
| chromium | phone | unselect: same chapter again | PASS | card under reader; event on card |
| chromium | phone | unselect: empty canvas | n/a | reader covers the whole canvas at this size |
| chromium | phone | unselect: Escape | PASS |  |
| chromium | phone | unselect: Reset layout | PASS |  |
| chromium | phone | reload with #read= opens once, then unselects and stays closed | PASS |  |
| chromium | phone | tap container title closes it | PASS |  |
| chromium | phone | tap closed container reopens it | PASS |  |
| chromium | phone | voice picker, this device | PASS | 5 voice(s): Samantha, Daniel, Karen, Moira, Tessa |
| chromium | phone | voice picker, 15 device voices | PASS | Samantha, Daniel, Karen, Moira, Tessa |
| chromium | phone | voice picker, none preferred | PASS | Albert |
| chromium | phone | no page errors | PASS |  |
| webkit | desktop | select (double-tap chapter) | PASS |  |
| webkit | desktop | unselect: same chapter again | PASS | card under reader; event on card |
| webkit | desktop | unselect: empty canvas | PASS |  |
| webkit | desktop | unselect: Escape | PASS |  |
| webkit | desktop | unselect: Reset layout | PASS |  |
| webkit | desktop | reload with #read= opens once, then unselects and stays closed | PASS |  |
| webkit | desktop | tap container title closes it | PASS |  |
| webkit | desktop | tap closed container reopens it | PASS |  |
| webkit | desktop | drag on title moves, does not toggle | PASS |  |
| webkit | desktop | voice picker, this device | PASS | 5 voice(s): Samantha, Daniel, Karen, Moira, Tessa |
| webkit | desktop | voice picker, 15 device voices | PASS | Samantha, Daniel, Karen, Moira, Tessa |
| webkit | desktop | voice picker, none preferred | PASS | Albert |
| webkit | desktop | no page errors | PASS |  |
| webkit | phone | select (double-tap chapter) | PASS |  |
| webkit | phone | unselect: same chapter again | PASS | card under reader; event on card |
| webkit | phone | unselect: empty canvas | n/a | reader covers the whole canvas at this size |
| webkit | phone | unselect: Escape | PASS |  |
| webkit | phone | unselect: Reset layout | PASS |  |
| webkit | phone | reload with #read= opens once, then unselects and stays closed | PASS |  |
| webkit | phone | tap container title closes it | PASS |  |
| webkit | phone | tap closed container reopens it | PASS |  |
| webkit | phone | voice picker, this device | PASS | 5 voice(s): Samantha, Daniel, Karen, Moira, Tessa |
| webkit | phone | voice picker, 15 device voices | PASS | Samantha, Daniel, Karen, Moira, Tessa |
| webkit | phone | voice picker, none preferred | PASS | Albert |
| webkit | phone | no page errors | PASS |  |

## `_site/` checks (epicofelinorjones.com, final build)

- **Act 1 fully present:** 11 pages (`eoej-a1-01` … `eoej-a1-11`). Each chapter's `_build/content/<id>/index.md` is an exact suffix of its manuscript file (heading block removed, text untouched). Each page's paragraphs match the rendered body one for one (69, 48, 29, 9, 5, 17, 34, 81, 31, 23, 7).
- **Act 2 and 3:** all 17 titles in `feed.json` with `_posted: "title"`, empty summary and tldr, no version, no commits, no page. The status lines are in `feed.json` containers (Act 2 "beginning October 15th", Act 3 "soon") and drawn on the graph.
- **No body text:** 440 probe strings taken from the Act 2/3 manuscript files, 0 found anywhere in `_site/`.
- **No `<!--`:** 0 files (the engine's cache note in the page head is now a JS comment in `generate-index.js`).
- **No `kokoro`:** 0 files.

## New or changed settings (defaults)

| setting | default | site |
|---|---|---|
| `commits.hideMeta` | `true` | (default) |
| `tts.engines.browser.preferredVoices` | Samantha, Daniel, Karen, Moira, Tessa, Google US English, Google UK English Female/Male, Microsoft Aria/Jenny/Guy | same |
| `tts.engines.browser.maxVoices` | `5` | `5` |
| `containers.<id>.status` / `containment[].status` | none | Act 2, Act 3 as above |
| `graph.collapseGesture` | `tap` | `tap` |
| `graph.spiral.strength` | `0.35` (pull toward layout targets) | (default) |
| `graph.labelSize.nestedScale` | `0.75` (max label size shrinks by this per nesting level) | (default) |
| `graph.card.labelMaxFontSize` | `26` | `26` (was 36, unread) |

## Uncertain / not done

- **Ring layout:** container hulls and labels overlap the ring, because ring positions ignore containers. That is how it was before T17 (T16: "ring layout unchanged"); the cluster layout is the one that was fixed. Switching back to cluster restores it.
- **Book label position:** with only three acts, the book's spiral puts Act 3 above the label, so the book label sits near the middle of the book rather than a third of the way down. The label rules hold; with more units it lands higher.
- **Initial zoom:** framing everything on a phone means chapter cards start as dots (marker level of detail). Every label is legible, and pinch-zoom works as before.
- **Commit history:** 6 of the 11 Act 1 chapters with metadata show a slightly different history than the old repo (part 1): one commit fewer, or a later first commit. This comes from the split, not the site.
- **Gemini:** kept but unverified (unexposed; testing would bill a real key).
- **Phone "empty canvas":** can't be exercised while the reader covers the whole canvas. Escape, Reset layout and same-chapter-again all pass there.
- The part-4 reader crash fix and the selection/WebKit fixes are outside the six parts. They are included because the finish checks couldn't pass without them.
