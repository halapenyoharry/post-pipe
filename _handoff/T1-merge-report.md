# T1 Merge Report

**Merge:** `fix/feedz-toast-and-cli-add` into `main`  
**Task:** Finish resolving an in-progress merge across 8 files without shell access.

---

## File Summaries

### 1. `generate-index.js`
- **What MAIN contributed:** Settings component integration, viewState handling, custom graph color translation (`colorOverrides`), edge count logging, and Kokoro worker copying in the build step.
- **What FIXBRANCH contributed:** `TimeOverlay` import and component wiring in the App tree with `filteredArticleIds` and `handleTimeFilter` callback.
- **How combined:** Kept all settings, colorOverrides, and worker-copying logic from `main`, while adding `TimeOverlay` import, state hook, and JSX component instantiation alongside `FeedZ`.

### 2. `src/components/GraphViewer/GraphViewer.jsx`
- **What MAIN contributed:** Dynamic/configurable card dimensions via `makeCardSizeFor(CARD)`, custom styling variables, robust two-layer container hierarchy, and clean DOM unmounting.
- **What FIXBRANCH contributed:** `lod === 'marker'` handling in `cardSizeFor`, `applyTimeFilter` helper and effect hook, and `filteredArticleIds` prop integration with node/link dimming.
- **How combined:** Integrated `lod === 'marker'` branch into `makeCardSizeFor`, merged component props (`filteredArticleIds`, `colorOverrides`), wired `applyTimeFilter` alongside `applyVisibility`, and preserved `dragHandler` touch filtering and axis geometry.

### 3. `src/components/TTS/TTS.jsx`
- **What MAIN contributed:** Detailed download / model engine progress tracking with `engineProgress` state bar, plus robust event listener cleanup.
- **What FIXBRANCH contributed:** Enhanced status badge UI (`statusMessage`, `isError`) with animated pulse, and progress/error message listeners from `loadingProgress`.
- **How combined:** Unified both progress systems so engine model loading (`engineProgress`) and message status (`loadingProgress`, error toasts) display concurrently without conflict.

### 4. `tts.js`
- **What MAIN contributed:** Self-hosted Kokoro server backend transport (`mode === 'server'`) with timeout and abort handling, prefetching architecture, and Gemini engine registration.
- **What FIXBRANCH contributed:** `findDefaultBrowserVoice` targeting Google US English 7 (Natural) and natural/curated fallbacks, and defensive DOM cleanup sweeps for orphaned `mark.tts-active` tags.
- **How combined:** Retained Kokoro server backend and prefetch logic from `main` (adding audio playback error handling), adopted `findDefaultBrowserVoice` as the default browser voice resolver, and combined block and mark highlight cleanup sweeps.

### 5. `src/components/NodeView/TextView/TextView.jsx`
- **What MAIN contributed:** Source prominence styling, quiet background tints, image mark indicators (`imageMark`), and dynamic font sizing (`fitFontSize`).
- **What FIXBRANCH contributed:** `lod === 'marker'` visual mode support and resize handles integration via `ResizeHandles`.
- **How combined:** Both sets of changes were already reconciled in the working tree; verified all features against BASE, MAIN, and FIXBRANCH with no dropped functionality.

### 6. `src/components/TTS/TTS.module.css`
- **What MAIN contributed:** Styling for `.loadingBarContainer` and `.loadingBarFill` to render engine download progress.
- **What FIXBRANCH contributed:** Status badge styling (`.statusBadge`, `.statusBadge.error`, and `@keyframes pulse`) and `.errorToast`.
- **How combined:** Both style blocks are present and clean in the file; no conflicts or omissions.

### 7. `src/index.jsx`
- **What MAIN contributed:** Re-exports for `Settings` and `ConfigPanel` components.
- **What FIXBRANCH contributed:** Re-export for `TimeOverlay`.
- **How combined:** Verified all exports (`GraphViewer`, `ReaderPanel`, `TTS`, `FeedZ`, `Settings`, `ConfigPanel`, `TimeOverlay`, `React`, `ReactDOM`) are present.

### 8. `kokoro-worker.js`
- **What MAIN contributed:** Full Kokoro ONNX Web Worker implementation using `kokoro-js`, WebGPU detection with WASM fallback, and generation messaging returning audio blobs.
- **What FIXBRANCH contributed:** Equivalent worker script structure and model loading pipeline.
- **How combined:** Verified file matches MAIN's robust implementation passing audio blobs directly to the main thread's prefetch/resolver map.

---

## UNRESOLVED

None. All 8 target files have been merged, verified clean of conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), and confirmed syntactically valid.
