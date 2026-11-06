# Views: more than one way to draw the same feed

> Design note, 2026-10-04. The registry and the switch were built 2026-11-04 (see "First steps" below). [JSON-TREES.md](JSON-TREES.md) is the first new view planned on it.

## Harold's words (2026-10-04, verbatim)

> I don't have place in post-pipe for the graph is this way or that way, but I think having different views makes sense for the system.

## What a view is

A view is one way of drawing a feed. The views of a site share everything that is not drawing:
- the feed and its order (story, time, publication, revisions);
- the reader, so an item opens the same way from any view;
- the reader's selection, bookmarks, reading progress and settings (what the device remembers);
- the top bar and the panels.

A view owns only its drawing and the gestures on it.

## Views and layouts are different things

- **On 2026-10-04 there was one view:** GraphViewer (`src/components/GraphViewer/GraphViewer.jsx`, about 4,400 lines then, 6,055 on 2026-11-05), and no registry of views. Since 2026-11-04 the registry lists two entries, both GraphViewer, one per graph layout ("First steps", below).
- **What already varies lives inside that one view, as layouts:**
  - the graph layouts (cluster and ring, `layouts.js`);
  - the container layouts (the golden spiral, ring, scatter, and `hang` in `containerLayout.js`);
  - the chapters on branches tried on the `branch-layout` branch.

  These arrange the same nodes and hulls differently.
- **A new view draws something else.** It is not a rearrangement of GraphViewer's nodes. JSON Trees grows roots from the feed's order and draws no hulls or force graph, so it is a view, not a layout.

## How a site uses views

- **The site lists its views** in settings: `views: ["graph", "json-trees"]`. The first one is the default. (As built on 2026-11-04 the ids are `cluster` and `ring`; see "First steps".)
- **A reader switches between them** with a top-bar control (shown only when a site lists more than one) or with `?view=json-trees` in the address. The choice is remembered on the device.
- **Each view is a component** with the same props: the feed, the settings, the view state, and an `onOpenItem` callback (built on 2026-11-04 as GraphViewer's own `onNodeSelect`). It is exported from `src/index.jsx` like the engine's other components, so it ships in the library build and other hosts (exoskeleton) can import it.

## First steps

Built 2026-11-04 (T46 views, issue #37), from Harold's box in the plan: "Views toolbar. One list of views (cluster, ring, more) and a switch between them." He names cluster and ring as views; this document calls them layouts inside the one view. Both stay true: the registry's entries are what the reader switches between, and the first entries are GraphViewer drawn with each layout. Nothing in the code was renamed.

1. **The registry**: `src/views/index.js` exports `VIEWS`, a list of entries `{ id, label, component, props }`. Two entries ship: `cluster` (GraphViewer, `props.layout` `force`) and `ring` (GraphViewer, `props.layout` `radial`). GraphViewer changed in one place: it takes an optional `view` prop and, when the entry names a layout, draws with it. The pure helpers (no component, so they run in node) are `src/lib/views.js`: `siteViews`, `viewById`, `viewLayout`, `viewFromSearch`, `currentView`. All of them are exported from `src/index.jsx`, so the library build and other hosts have them.
2. **The site's list**: `views: ["cluster", "ring"]` in settings.json (note in `examples/site/settings.json`). The first is the default. Absent or empty is `["cluster"]`, so no existing site changes. An unknown id is skipped and said in one line in the page's console.
3. **The switch**: in the top bar (`src/components/FeedZ/FeedZ.jsx`, props `views`, `currentView`, `onSelectView`), one plain button per view in the pill style after the pages and links, shown only when the site lists more than one. `?view=<id>` in the address picks a listed view at load. The choice is remembered on the device: `viewState.state.view`, set with `viewState.setView(id, layout)`, which sets the view and its layout in one step (one undo); Reset clears it, so the first view is back. The reader's existing layout picker (the Layout row in the main view's panel, and the bottom bar when `toolbar.position` is `bottom`, the default before 2026-11-05) keeps working beside the switch: the page keeps the two in agreement through `currentView`, so picking ring in the bar is the ring view and picking the ring view sets the ring layout.
4. **Still to do**: JSON Trees as the next entry ([JSON-TREES.md](JSON-TREES.md), its phase 3). It takes the same props as GraphViewer (the feed, the settings, the view state, `onNodeSelect`) and names no layout.
