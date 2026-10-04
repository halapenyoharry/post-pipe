# Views: more than one way to draw the same feed

> Design note, 2026-10-04. Not built yet. [JSON-TREES.md](JSON-TREES.md) is the first new view planned on it.

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

- **Today there is one view:** GraphViewer (`src/components/GraphViewer/GraphViewer.jsx`, about 4,400 lines). No registry of views exists.
- **What already varies lives inside that one view, as layouts:**
  - the graph layouts (cluster and ring, `layouts.js`);
  - the container layouts (the golden spiral, ring, scatter, and `hang` in `containerLayout.js`);
  - the chapters on branches tried on the `branch-layout` branch.

  These arrange the same nodes and hulls differently.
- **A new view draws something else.** It is not a rearrangement of GraphViewer's nodes. JSON Trees grows roots from the feed's order and draws no hulls or force graph, so it is a view, not a layout.

## How a site uses views

- **The site lists its views** in settings: `views: ["graph", "json-trees"]`. The first one is the default.
- **A reader switches between them** with a top-bar control (shown only when a site lists more than one) or with `?view=json-trees` in the address. The choice is remembered on the device.
- **Each view is a component** with the same props: the feed, the settings, the view state, and an `onOpenItem` callback. It is exported from `src/index.jsx` like the engine's other components, so it ships in the library build and other hosts (exoskeleton) can import it.

## First steps, when built

1. Give GraphViewer a name in a small registry (`views: { graph: GraphViewer }`), with nothing about it changed.
2. The view switch in the top bar and the `?view=` parameter.
3. JSON Trees as the second entry ([JSON-TREES.md](JSON-TREES.md), its phase 3).
