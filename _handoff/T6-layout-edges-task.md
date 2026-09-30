Task T6: edges don't follow nodes after a layout change. You have NO shell access; only read and edit files. The operator builds and tests afterward.

Bug: in the graph viewer, switching LAYOUT (e.g. `cluster` → `ring`) moves the nodes, but the edges stay where they were. This includes the straight links, the curved sequence rails (quadratic Bezier paths), their animated pulse beads, and the container hulls. After the switch, every edge and hull is drawn between the nodes' OLD positions.

Fix, in `src/components/GraphViewer/GraphViewer.jsx` (and only other files if strictly required):
1. Find the code that updates edge paths, rail/bead paths, and hulls from node positions during normal movement (the simulation tick and node drag).
2. Find the code that applies a layout change and moves nodes to their new positions (including any animated transition).
3. Make the layout change call the same update on every frame of the transition and once when it finishes, so edges, rails, beads, and hulls end exactly at the nodes' new positions. Do not duplicate the update logic: reuse or extract the existing function.

Do not change layouts, styles, colors, or any other behavior. Do not edit `dist/` or `dist-embed/`.

Write `_handoff/T6-report.md`: the functions you found for (1) and (2), what you changed, and anything UNSURE.
