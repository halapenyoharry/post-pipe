# Alpha Testing Feedback & Action Items

**Logged:** 2026-09-15  
**Context:** Alpha build testing (React component library, D3 GraphViewer, ReaderPanel, TTS)  
**Status:** Documented & Prioritized  

---

## 1. Bug: TTS Kokoro Engine Silent Failure & Stuck Highlight

### Issue Description
When switching to the **Kokoro (82M)** engine in the reader pane and pressing **Play**:
- The Play button changes to Stop.
- The title (first sentence) gets highlighted.
- No audio plays.
- After a delay, the Stop button reverts back to Play, but the title remains highlighted.

### Expected Behavior
- Press Play → Icon toggles to Stop.
- First sentence/title highlights and is read aloud.
- Sequential sentences highlight in sync with spoken audio.
- When playback ends or is stopped, the highlight clears completely and the view returns to its initial idle state (Play icon).

### Technical Cause & Investigation
- `tts.js` registers Kokoro with Web Worker (`kokoro-worker.js`) loading `onnx-community/Kokoro-82M-v1.0-ONNX`.
- If the model load or inference fails (WebGPU fallback, CDN failure, CORS, memory, or audio generation failure), the worker throws an error or silently fails.
- In `speakNext()`, the caught error triggers `stopAll()`, but if the promise rejects or hangs without an explicit reset of DOM nodes or state, the highlighted `<mark>` span may not unwrap properly, or the user is left with no feedback as to why synthesis failed.
- Needs:
  1. Worker health check / download progress indicator (since 82MB model takes time to load on first run).
  2. Fallback error toast / console alert.
  3. Clean teardown in `clearHighlight()` on error or timeout so the document DOM is never left dirty.

---

## 2. Preference: Default Browser TTS Voice to "Google US English 7 (Natural)"

### Issue Description
- Currently defaults to the first voice in browser synth or an uncurated default.
- Set default browser voice preference specifically to **Google US English 7 (Natural)** (or closest match available on Chromium / WebKit).

### Implementation Target
- Update default voice selection in `src/components/TTS/TTS.jsx` and `tts.js` browser engine definition so that upon loading voices, it looks for `Google US English 7 (Natural)` first before falling back to system defaults.

---

## 3. Feature / Design: Universal Node Block Resizing

### Issue Description
- Currently, node blocks only change size or become expanded when clicked/pinned.
- User expects interactive resize controls to be accessible directly on hover ("with just the over").

### Expected Interaction
- On hover over an article node card, resize handles / directional arrows appear.
- Resizing should be draggable from:
  - All 4 corners (NW, NE, SW, SE).
  - All 4 edges (top, bottom, left, right).
- Should allow freeform dimension adjustment of the card container directly in the spatial graph.

### Implementation Considerations
- CSS / Pointer interaction on `.card` / wrapper in `GraphViewer.jsx` / `TextView.jsx`.
- Needs to integrate with D3 drag / simulation bounds so dragging a resize handle resizes the card rather than dragging the graph node's position.
- Needs minimum/maximum bounds to prevent layout breakage.

---

## 4. Feature / Design: Stacked Temporal Overlay (Time Periods & Continuous Axis)

### Visual Specification (From Sketch)
- **Hierarchy & Layout:**
  - Stacked vertical time periods (e.g. Month blocks `Jan`, `Feb` stacked vertically in a primary column).
  - Branching / projecting horizontally to the right from each month into sub-periods (e.g. `Wk 1`, `Wk 2`, `Wk 3`, `Wk 4`, `(Wk 5)`).
- **Styling & Aesthetics:**
  - Transparent rounded block containers.
  - Subtle gradient fade from left to right, fading out to transparent on the right edge.
- **Data Completeness Rule:**
  - Continuous temporal range: **must include all months within the span**, even if certain months have zero articles (no gaps in the calendar continuity).
