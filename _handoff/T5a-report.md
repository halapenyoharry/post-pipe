# T5a Report: Generalize Time Axis into Dimensions

Carried out task T5a exactly according to `_handoff/T5a-dimensions-task.md`. No shell commands were run; only permitted files were read and edited.

---

## 1. Changes by File and Function

### `ingest.js`
- **`buildFromFrontmatterJson`**: Added `timeline: fm.timeline || null` to the returned content object.
- **`buildFromQmd`**: Added `timeline: null` to the returned content object.
- **`buildFromUnstructured`**: Added `timeline: null` to the returned content object.

### `src/adapters/LocalFolderAdapter.js`
- **`contentToItem`**:
  - Added `timeline: c.timeline || undefined`.
  - Added `commit_times` array calculated synchronously using `child_process.execFileSync` running `git log --format=%cI --reverse -- .` in the item folder (`path.join(resolveHome(rootPath), c.id)`), filtered for non-empty lines, defaulting to `[]` on error.

### `src/components/GraphViewer/GraphViewer.jsx`
- **`feedToGraph` (node mapping)**: Added properties to the article node object:
  - `series_part: item.series_part ?? null`
  - `timeline: item.timeline || null`
  - `commit_times: item.commit_times || []`
- **Imports**: Added `dimensionAxisGeometry` to imports from `./layouts`.
- **`drawAxis`**:
  - Replaced `timeAxisGeometry` call with `dimensionAxisGeometry(g.data.nodes, { orientation: vertical ? 'ttb' : 'ltr', origin, length, dimension: axis.dimension || 'time', granularity: axis.granularity || 'auto' })`.
  - Updated connector construction to iterate over `geo.anchors[d.id]` as an array, appending a connector per anchor point.

### `src/components/GraphViewer/layouts.js`
- **`timeAxisGeometry`**: Preserved existing implementation unchanged, maintaining backward compatibility for single-anchor geometry callers.
- **`parseLooseDate(str, side)`**:
  - Parses loose ISO dates/intervals (`start` or `end`).
  - Strips trailing `?`, splits optional `THH:MM`.
  - Handles year `XXXX` -> `null`.
  - Handles month `XX` -> January (start) / December (end).
  - Handles day `XX` -> 1st (start) / last day of that month (end).
  - Handles omitted time: 00:00 (start) / 23:59 (end).
  - Returns UTC milliseconds.
- **`dimensionIntervals(nodes, dimension)`**:
  - Returns Map of node id -> array of `{ start, end }` (numbers). Filters for `type === 'article'` and at least one interval.
  - Dimension `'time'`: `[{ start: Date.parse(n.date), end: Date.parse(n.date) }]` when parseable.
  - Dimension `'commits'`: one `{ start, end }` per parseable ISO entry in `n.commit_times`.
  - Dimension `'chronology'`: parsed from `n.timeline.calendar_time.span` (`start`, optional `end`) or `n.timeline.calendar_time.date` using `parseLooseDate`.
  - Dimension `'narrative'`: if `n.timeline.narrative_position` begins with digits, `value = parseInt(digits) / (10^digitCount - 1)`. Else if `series_part` is a number, normalized across same-series articles: `(series_part - 1) / (maxPart - 1)`. Retains series part reference for tick formatting.
- **`dimensionAxisGeometry(nodes, axis)`**:
  - Handles dimensions `'time'`, `'commits'`, `'chronology'`, and `'narrative'`.
  - Returns `{ orientation, vertical, from, to, ticks, anchors }` where `anchors` is `{ [id]: Array<{x, y}> }`.
  - For `'time'`: invokes `timeAxisGeometry` and wraps each anchor in an array.
  - For `'narrative'`: linear placement (`val * length`), ticks labelled with `series_part` or percentage (`42%`).
  - For date dimensions (`'commits'`, `'chronology'`):
    - Computes UTC buckets (`day`, `week` starting Monday, `month`, `year`).
    - Granularity `'auto'` selects the finest unit with total distinct buckets across all nodes ≤ 60.
    - Limits node overlapping buckets to first and last if > 12 buckets.
    - Uses `compressedTimeScale` on sorted bucket keys.
    - Formats ticks (`Jun 3`, `wk Jun 1`, `Jun '30`, `2030`).
    - Returns `null` if fewer than 2 nodes have anchors.
- **`module.exports`**: Exported `dimensionAxisGeometry`, `dimensionIntervals`, and `parseLooseDate`.

---

## 2. Anything UNSURE

- None. All requirements and edge cases specified in `_handoff/T5a-dimensions-task.md` were matched directly.
