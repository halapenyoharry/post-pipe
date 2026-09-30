# T14 Handoff Report

## Resolved Issues

**#9 iPhone node tap**
- Fixed Safari clipping/rendering issues on iOS when the reader panel is triggered by changing the CSS transforms in `ReaderPanel.module.css` from percentage-based translations to `translate3d(calc(100vw + 40px), 0, 0)`. 
- Added a `history.pushState(null, '', '#read=' + id)` behavior to `onNodeSelect` inside `embed.jsx`. 
- Intercepted `onHashChange` to ensure "Back" clears the selected article, bringing users back to the graph, and "Forward" opens the reader appropriately. 

**#10 Bottom controls overlap**
- Replaced fixed absolute offsets (`bottom: 24px`, etc.) with `env(safe-area-inset-bottom, 0px)` wrapped calculations for the ConfigPanel trigger, ReaderPanel, and TimeOverlay.
- Moved the `ConfigPanel` trigger to the right side on narrow screens (max-width: 440px) to prevent overlap with `TimeOverlay`.
- Adjusted `TimeOverlay` width bounds dynamically via media queries to fit narrow profiles and landscape properly. 

**#14 Touch collapse**
- Updated the drag handler in `GraphViewer.jsx` to respect `settings.graph.collapseGesture` allowing either `tap` (default) or `doubletap` triggers for collapsing containers on small threshold movements (<4px). 
- Implemented a 400ms time threshold state tracking for the `doubletap` check.
- Added inline style `touch-action: manipulation` for `.container-badge` and `.container-macro-node` elements to stop iOS Safari's default double-tap zoom behavior, avoiding conflict.

**#12 Container spacing**
- Added support for `settings.graph.containerSpacing` to explicitly space apart (or overlap) containers, injecting it directly into the boundary distance calculation of `createContainerSeparationForce()`. Defaults to allowing slight overlap (`-20px`) for a tighter arrangement. 

**#13 Container labels**
- Updated `GraphViewer.jsx` text handling to break labels on spaces dynamically onto new `<tspan>` elements forming independent lines via a `buildWrappedLabel` helper.
- Overhauled static font sizes. The labels now scale in size based on the width of their open layout bounds (`hullW`) and are bounded between `settings.graph.labelSize.min` and `.max`.
- Propagated this size interpolation to collapsed `.container-macro-node` states using their minimum defined extent constraint to keep sizes centered and uniform through layout transitions. 
- Tightened `letter-spacing` from `0.05em` down to `-0.02em` on macro tags.

**#11 Control panel pop-out**
- Added an "open in new window" toggle inside `ConfigPanel.jsx`. 
- When clicked, creates an external window initialized with a `noopener,noreferrer` popup profile and extracts existing app stylesheets via `cloneNode`. 
- Utilizes `ReactDOM.createPortal()` to pipe the active stateful React component tree seamlessly into the new window while persisting graph interactability beneath it on the main screen. 

**#15 Visibility**
- Updated `ingest.js` metadata ingestion to parse the newly mapped frontmatter tag `posted`. 
- Added visibility filtration logic inside `src/adapters/LocalFolderAdapter.js` defaulting to hiding the `posted: false` articles, driven by the new setting flag `visibilityDefault`. 
- Included robust tests inside `test/visibility.test.js` validating explicit defaults vs document overrides for proper boolean filtration.

## Additional Steps
- Ran `npm test` verifying 109 passing tests sequentially.
- Triggered all three library bundles via `npm run build`, `npm run build:lib`, and `npm run build:embed` and explicitly checked them into the index on `dist*/`.
