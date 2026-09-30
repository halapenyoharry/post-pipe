# Task T6 Report: Edges Follow Nodes During Layout Change

## 1. Functions Found

### Code that updates edge paths, rail/bead paths, and hulls from node positions during normal movement:
- **`applyPositions()`** (in `src/components/GraphViewer/GraphViewer.jsx`, lines ~1429–1443):
  - Updates straight link paths and quadratic Bezier sequence rail paths (`links.each(...)`).
  - Updates traveling sequence pulse bead paths (`sequencePulses.each(...)`).
  - Updates SVG node transforms (`nodes.attr('transform', ...)`) and HTML article card transforms (`articleNodes.style('transform', ...)`).
  - Calls **`updateContainers()`** (lines ~634–740), which computes container centroids, bounding boxes, and Catmull-Rom convex hulls (`.container-hull`) and positions container badges.
  - This function is registered in `graphRef.current.applyPositions` and is called during simulation ticks, initial fit/paint, and reset sizes.
  - In addition, during drag events (`dragHandler`), `linkEndpoints`, `linkPath`, and `updateContainers()` are called.

### Code that applies a layout change and moves nodes to new positions:
- **`useEffect(() => { ... }, [layout])`** (in `src/components/GraphViewer/GraphViewer.jsx`, lines ~1850–1952):
  - Handled the layout property change (`layoutRef.current = layout`).
  - Read target positions from viewState or computed layout via `computeLayout(layout, g.data.nodes, ...)`.
  - Previously set `d.x = target.x; d.y = target.y; d.fx = target.x; d.fy = target.y;` immediately on the node objects, then executed separate D3 transitions on `g.nodes`, `g.articleNodes`, and `g.links` with `.attr('x1', ...).attr('y1', ...)`, but `g.links` are SVG path elements (`<path d="...">`) rather than `<line>` elements, and neither `sequencePulses`, `linkPath` quadratic curves, nor `updateContainers` hulls were updated during or smoothly following the transition.

---

## 2. What Was Changed

In [src/components/GraphViewer/GraphViewer.jsx](file:///Users/harold/Projects/post-pipe/src/components/GraphViewer/GraphViewer.jsx):
1. **Captured initial and target positions**:
   - Recorded `startPositions` for all nodes using a `Map` before updating targets.
   - Assigned `d.targetX` and `d.targetY` along with pinning `d.fx = target.x; d.fy = target.y;`.
2. **Transitioned node positions and called `g.applyPositions()` on every frame**:
   - Replaced disconnected transitions on `g.nodes`, `g.articleNodes`, and `g.links` with a coordinated transition:
     ```javascript
     d3.transition()
       .duration(transitionDuration)
       .ease(transitionEase)
       .tween('layout-transition', () => {
         const interpolators = g.data.nodes.map(d => {
           const start = startPositions.get(d.id) || { x: d.x, y: d.y };
           const endX = typeof d.targetX === 'number' ? d.targetX : d.x;
           const endY = typeof d.targetY === 'number' ? d.targetY : d.y;
           const ix = d3.interpolateNumber(start.x, endX);
           const iy = d3.interpolateNumber(start.y, endY);
           return (t) => {
             d.x = ix(t);
             d.y = iy(t);
           };
         });

         return (t) => {
           for (let i = 0; i < interpolators.length; i++) {
             interpolators[i](t);
           }
           g.applyPositions();
           if (connectorUpdateRef.current) connectorUpdateRef.current();
         };
       })
       .on('end', () => {
         g.data.nodes.forEach(d => {
           if (typeof d.targetX === 'number') d.x = d.targetX;
           if (typeof d.targetY === 'number') d.y = d.targetY;
           delete d.targetX;
           delete d.targetY;
         });
         g.applyPositions();
         if (connectorUpdateRef.current) connectorUpdateRef.current();
       });
     ```
3. **End of transition guarantee**:
   - On transition completion (`.on('end', ...)`), all node coordinates (`d.x`, `d.y`) are finalized to their target values, temporary properties are cleaned up, and `g.applyPositions()` (plus `connectorUpdateRef.current()`) is invoked again to ensure exact alignment at resting positions.

---

## 3. Anything UNSURE

- None. Reusing `applyPositions()` ensures that straight links, curved sequence rails, pulse beads, node transforms, card transforms, and Catmull-Rom container hulls remain synchronized on every animation frame and at completion.
