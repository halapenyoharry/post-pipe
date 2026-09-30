Task T8: container labels, dragging, and collapsing. Work in `~/Projects/post-pipe`. Read `DROIDZ.md` / `AGENTS.md` in `~/Projects/epicofelinorjones.com` for the rules (engine stays content-agnostic: nothing novel-specific in engine code).

Code is in `src/components/GraphViewer/GraphViewer.jsx` (container hulls, badges, collapse into macro-nodes; see `updateContainers()` and the badge/macro-node code) plus its CSS module. Everything here applies only when the site defines containers (`settings.containment`); graphs without containers must look and behave exactly as now.

## 1. Expanded container: a central label, no box

- The container's label (e.g. "The Epic of Elinor Jones", "Act 1") sits at the **center of its hull** (the centroid of its members), not on the hull's edge.
- **No visual boundary around the label:** no pill, background, or border. Just text.
- **Larger text:** about 28px for top-level containers and 22px for nested ones, in the container's `badgeColor`/`color`, semi-transparent (around 0.55 opacity) so cards stay readable. Keep the member count if shown now, smaller, after the name.
- Draw the label above the hull fill and below the chapter cards.
- The hull itself (outline and fill) stays as it is now.

## 2. Grab the label to move the whole container

- Pressing on the label and dragging moves the container: every member node, including members of nested containers, moves by the same offset, and hulls, edges, rails, and beads follow on every frame (reuse the same position-update function used by node dragging and the simulation tick; do not duplicate it).
- Treat moved members exactly like a dragged node when the drag ends (same pinning and same position saving to view state as node dragging).
- The cursor over the label is a grab hand.

## 3. Click the label to collapse; collapse works for every container, including the top-most

- A press and release with less than 4px of movement is a click: it collapses the container (existing behavior), otherwise it was a drag.
- The **top-most container** (e.g. the book) must be collapsible too. Collapsing it hides everything inside it, including nested containers and their members, and shows one collapsed node.
- Clicking a collapsed container expands it again, restoring its members to their positions (existing behavior).

## 4. Collapsed container: same text, now with a boundary

- The collapsed node shows the **same text, size, and color** as the expanded label, plus the member count.
- It **has** a visible boundary: a rounded rectangle outline in the container's color, a faint fill, padding around the text.
- It can be dragged like a node (moving it does not expand it; a click without movement expands it).

Do not change anything else (layouts, dimensions, reader, colors). Do not edit `dist/` or `dist-embed/`.

## Done means

`npm test` passes and `npm run build`, `npm run build:lib`, `npm run build:embed` all succeed (you may run these). Write `_handoff/T8-report.md`: what you changed (functions), how drag vs click is detected, how nested members are collected, and anything UNSURE. Do not commit.
