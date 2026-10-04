# JSON Trees: a standalone view of procedural roots

> Design document, 2026-10-04. Not built yet. Each phase below becomes its own task, with checks, when Harold says go. The idea of more than one view is in [VIEWS.md](VIEWS.md); JSON Trees is the second view.

## 1. Harold's words (2026-10-04, verbatim)

> ok, let's make this a stand alone view for post-pipe, starting from scratch, with th post-pipe engine....
>
> This Json Trees, think algorythemic procedural organic branching, each main root is a container, a root breaks off again when the "next" is not the same as chrono order, we still have next as an option to render as a moving dot, the dot btw, should go from first, then when it gets to second it goes to third and so on. so the container name is the name of the root and labled thus, it's child roots are visible at first but only show up when you open the container by clicking on the name of the root,
>
> There is areaa for banner above the graph of roots, for image or text (this is like our second frame) and if you zoom in the root system zooms in to but becomes lighter as n ot to distract too much, but does this smoothlyu and blends into the top so it meets the image, if there is one that matches up.
>
> create a plan in an .md inside post-pipe for this. although, this is could also exist in exoskeleton as a react compontant, or both, hrem.

His answers the same day:
- A container's child roots are **hidden until the container is opened** (by clicking the root's name).
- The idea of several views gets **a separate doc** ([VIEWS.md](VIEWS.md)).
- The core lives in post-pipe; **exoskeleton hosts the same component** as a panel (section 7).

## 2. Requirements

Each requirement quotes Harold, then states the rule it sets.

| | Harold | The rule |
|---|---|---|
| R1 | "a stand alone view for post-pipe, starting from scratch, with the post-pipe engine" | A view of its own (`JsonTreesView`), not a mode of GraphViewer. It uses the engine's feed, ordering, reader, settings and memory, and none of GraphViewer's drawing. |
| R2 | "think algorythemic procedural organic branching" | The roots are grown by an algorithm, not drawn from a picture: seeded, so the same data grows the same roots on every load, and organic (tapering, gently curving, forking at natural angles). |
| R3 | "each main root is a container", "the container name is the name of the root and labled thus" | Off the tap root (the whole feed), one main root per container (in a novel, one per act). The container's name is written along its root. |
| R4 | "a root breaks off again when the 'next' is not the same as chrono order" | Within a container, a root runs as long as the story's next item is also the next in time. Where the story jumps in time, a new root breaks off. The proposed formal rule and examples are in section 3; Harold confirms it. |
| R5 | "we still have next as an option to render as a moving dot, the dot btw, should go from first, then when it gets to second it goes to third and so on" | One dot travels the story's order: from the first item to the second, then to the third, along the drawn roots, crossing at the forks. It is optional (a setting). This is not today's pulse, which runs on every sequence link at once (`src/components/GraphViewer/GraphViewer.jsx:2595-2598`, `GraphViewer.module.css:89-94`). |
| R6 | "it's child roots ... only show up when you open the container by clicking on the name of the root" (answer: hidden until opened) | At first only the tap root, the main roots and their names show. Clicking a root's name opens the container: its child roots and items grow in. Clicking again closes it. |
| R7 | "There is areaa for banner above the graph of roots, for image or text (this is like our second frame)" | A banner slot above the roots that holds an image or text, as the site's second frame holds the small plant and the title. |
| R8 | "if you zoom in the root system zooms in to but becomes lighter as n ot to distract too much, but does this smoothlyu and blends into the top so it meets the image, if there is one that matches up" | The roots zoom with everything else, and grow lighter as the zoom goes in, smoothly, never in a step. At the top the roots fade into the banner, so a banner image whose bottom matches the roots (as the cover's plant meets its roots) reads as one picture. |

Carried over from the standing requirements (kept locally in `_handoff/HAROLD-STANDING-REQUIREMENTS.md`, numbers as there):
- The reader controls the zoom (31): nothing the layout does caps it.
- Roots follow, never lead (24): anything that moves a root moves after the thing it answers.
- The engine stays content-agnostic (9): nothing about the novel in the code; site values in settings.
- No emoji in the interface, no internet fetches at runtime (10).

## 3. The branching rule (R4), proposed

**Terms.** Within one container, each item has a place in the story (its narrative order, from `series_part` and the `next` links) and a place in time (from `timeline.calendar_time`). An item's *chronological successor* is the item that comes right after it in time.

**Proposed rule.** Walk the items in story order.
- An item joins the root whose last item is its chronological predecessor, when such a root exists. So along any one root, every next item is also the next in time: "the next is the same as chrono order".
- Otherwise a new root breaks off, from the item the story was on when it jumped, and the item starts it.

**What the rule gives.**

| Story | In time | Roots | The moving dot |
|---|---|---|---|
| 1, 2, 3, 4, 5, told in order | 1, 2, 3, 4, 5 | one root: 1-2-3-4-5 | along the one root |
| 3 is a flashback set before 1 | 3, 1, 2, 4, 5 | main root 1-2-4-5; a side root [3] breaks off at 2 | 1, 2, down the side root to 3, back up to 4, then 5 |
| two threads told alternately (A1, B1, A2, B2) | A1 < A2, B1 < B2, threads overlap in time | each thread becomes its own root; the dot crosses between them | A1, B1, A2, B2 across the two roots |

The main root is the line of the present, and flashbacks and parallel threads grow off it as side roots. The shape shows where the story leaves time's order.

**For Harold to confirm:** this rule (the alternative is that every jump starts a new root off the one the story is on, so the roots form a chain and never rejoin), and what happens to items with no date (proposed: they stay on the root of the item before them).

## 4. Input

- **From a post-pipe feed** (the main host):
  - containers become the main roots;
  - story order comes from `series` and `series_part` and the `next` links built in `src/corpus/buildEdges.js:123-131`;
  - time comes from `timeline.calendar_time`, read the way `src/components/GraphViewer/layouts.js` reads it for the chronology dimension (`parseLooseDate` :428, `dimensionIntervals` :486).
- **From any JSON** (for exoskeleton and other hosts):
  - a plain schema: `{ id, label, chrono?, next?, children? }`;
  - when a document has no ids, they are made from the item's path (`root/2/children/0`), so selections can be shared between panels by identity.
- **Reading an item:** in post-pipe, an item opens in the reader (`ReaderPanel`); in another host, the host decides.

## 5. What exists to reuse

- **Roots that follow:** `src/lib/rootsVector.js` (`parseRoots` :38, `rootsModel` :86, `createFollow` :245, the damped spring that keeps roots behind what they follow).
- **Seeded procedural roots:** `src/components/GraphViewer/roots.js` (`rootShape` :33, `rootPath` :107, `rootSegments` :137).
- **Growth that looks like real roots:** on the `branch-layout` branch (unmerged), `src/components/GraphViewer/branchLayout.js`. It provides `growBranches` (seeded growth into empty space), `traceStyle` (fork angles, lengths and taper measured off a traced picture), `orderTips` and `placeCards`, plus `src/lib/cardFit.js` (card text set as large as fits).
- **Lighter on zoom:** `src/lib/reach.js` (`backdropConfig` :65, `backdropOpacity` :79). It eases opacity from its resting value down to a floor as the zoom goes past the resting zoom; R8 uses the same easing.
- **The banner:** the Opening component's art and title pipeline (`src/components/Opening/`, `src/lib/opening.js`).
- **The library build:** `src/index.jsx` exports the engine's components for `dist-lib/post-pipe-components.es.js`; `JsonTreesView` is exported the same way.

## 6. Phases

Each is a task of its own with unit and browser checks, built on a branch with its own preview port until Harold adopts it.

1. **Data** (`treeFromFeed`, `treeFromJson`): pure functions from input to a tree of roots per section 3. Unit tests on fixtures: a story told in order, a flashback, two alternating threads, undated items.
2. **Growth:** pure geometry from the tree to drawn roots (tap root, main roots, child roots), seeded and deterministic, with each container's name placed along its main root at the largest size that fits. Unit tests: the same input grows the same roots; roots never cross; names fit.
3. **The view** (`JsonTreesView`):
   - the banner, the roots, the names;
   - open and close a container by its name (R6);
   - zoom with smooth lightening and the top blend (R8);
   - the moving dot (R5);
   - an item opens the reader.

   Browser checks in Chromium and WebKit, at a desktop size and an iPhone 13.
4. **A standalone page** for a site: its own output page and preview port. epicofelinorjones.com is the first site to try it, beside the current graph, not replacing it.
5. **The exoskeleton panel** (section 7), a task in the exoskeleton repo.

## 7. Exoskeleton as the second host

Exoskeleton (Tauri 2 + React 19, AGPL-3.0-or-later) has a JSON suite: one JSON document drawn by several panels at once, kept in step by node identity rather than position. JSON Trees fits there as one more viewer.

- **Where:** a thin panel in exoskeleton's own `src/panels/json-trees/` (its AGENTS.md says all panels live in-repo; the reason for importing the core is written in its `docs/SESSIONS.md`).
- **The core:** imported as a bundled ES module from post-pipe's `dist-lib` (a `file:` dependency); exoskeleton's content security policy forbids loading code from a CDN.
- **Wiring**, following its 2026-09-12 precedent for adding a panel:
  - the lazy import in `src/App.tsx`;
  - the accent and glyph in `src/ColoredTab.tsx`, and the accent variable in `src/App.css`;
  - a registry entry in `src/persistence/default-layout.ts` (`introducedAt` 11, companion `json-edit`), and a bump of `CURRENT_VERSION` in `src/persistence/storage.ts`;
  - the `json-lab` preset;
  - `npx tsc --noEmit`, `npm run build` and `npm test`.
- **Data and sync:**
  - the document arrives through `useJsonDoc`;
  - hover and select go through the OSC channels (`broadcastNodeSelection`, `broadcastNodeFocus` in `src/osc/channels/`); `docs/cross-panel-sync.md` still says the json-bus carries them, which is out of date since commit 0d63925;
  - path-based ids (section 4), since exoskeleton's tree conversion gives nodes names but no ids.
- **Licences:** exoskeleton is AGPL; post-pipe's code is harold young's own (see [LICENSE](../LICENSE) and [COMMERCIAL.md](../COMMERCIAL.md)), so he may use it in both.

## 8. Open questions for Harold

1. The branching rule in section 3: side roots that rejoin the present (proposed), or a chain of breaks that never rejoins?
2. The banner: the site's second-frame art (the small plant and the title), or a new slot a site fills with any image or text?
3. Inside an open container: items as cards at the root tips (as on `branch-layout`), or as names along the roots?
4. Is the tap root the feed (the book) for every site, or can a site name it?
