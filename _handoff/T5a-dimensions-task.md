Task T5a: generalize the time axis into dimensions (data + geometry only). You have NO shell access. Do not run any command; only read and edit files. Harold's operator runs all tests.

Edit ONLY: `ingest.js`, `src/adapters/LocalFolderAdapter.js`, `src/components/GraphViewer/layouts.js`, `src/components/GraphViewer/GraphViewer.jsx` (only the node-mapping object described in step 3, and the anchor loop in step 6). Do not touch `dist/`, `generate-index.js`, `embed.jsx`, settings, or anything else.

Hard rule: with `axis.dimension` unset or `'time'`, the time axis must behave exactly as now.

## 1. ingest.js
In the function that builds content from `frontmatter.json` (it sets `series_part: fm.series_part ?? null`), add `timeline: fm.timeline || null`. In the other two builders (qmd yaml, unstructured) add `timeline: null`.

## 2. LocalFolderAdapter.js
In `contentToItem`, add to the returned item:
- `timeline: c.timeline || undefined`
- `commit_times`: an array of ISO strings, one per git commit touching the item's folder, oldest first. Compute with `require('child_process').execFileSync('git', ['log', '--format=%cI', '--reverse', '--', '.'], { cwd: <item folder>, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })`, split on newlines, drop empty lines. `<item folder>` is `path.join(resolveHome(rootPath), c.id)`. If it throws (not a git repo, git missing), use `[]`.

## 3. GraphViewer.jsx — node mapping only
In the object that maps an item to a node (it has `date: item.date_published ? ...`, `series: item.series || ''`), add:
`series_part: item.series_part ?? null`, `timeline: item.timeline || null`, `commit_times: item.commit_times || []`.

## 4. layouts.js — dimension values
Add a function `dimensionIntervals(nodes, dimension)` returning a Map from node id → array of `{ start, end }` (numbers; `end` may equal `start`). Only nodes with `type === 'article'` and at least one interval appear. Dimensions:
- `'time'`: `[{start: Date.parse(n.date)}]` when `n.date` parses.
- `'commits'`: one `{start}` per parseable entry of `n.commit_times`.
- `'chronology'`: from `n.timeline.calendar_time.span` (`start`, optional `end`); if no span, from `n.timeline.calendar_time.date` as start only. Parse with `parseLooseDate(str, side)` (below). Skip the node if start cannot be parsed. If end is missing, end = the `side:'end'` parse of the start string (so `2030-06-XX` covers the whole month).
- `'narrative'`: if `n.timeline.narrative_position` begins with digits, value = parseInt(those digits) / (10^digitCount − 1). Otherwise, if `n.series_part` is a number: value = (series_part − 1) / (maxPart − 1) where maxPart is the largest `series_part` among nodes with the same `series` (value 0 if maxPart is 1). One interval `{start: value, end: value}`.

`parseLooseDate(str, side)` where side is `'start'` or `'end'`: strip a trailing `?`; split an optional `THH:MM`. Year all `X` → return null. Month `XX` → January (start) / December (end). Day `XX` → 1st (start) / last day of that month (end). Without a time: 00:00 (start) / 23:59 (end). Return UTC milliseconds.

## 5. layouts.js — geometry
Rename nothing. Add `dimensionAxisGeometry(nodes, axis)`; keep `timeAxisGeometry` and make it return `dimensionAxisGeometry(nodes, { ...axis, dimension: 'time' })` ONLY IF the result is identical in shape; otherwise leave `timeAxisGeometry` exactly as it is and have `dimensionAxisGeometry` call it for `'time'`.

`dimensionAxisGeometry(nodes, axis)` with `axis.dimension` in `'time' | 'commits' | 'chronology' | 'narrative'` and `axis.granularity` in `'auto' | 'day' | 'week' | 'month' | 'year'` (default `'auto'`), returns `{ orientation, vertical, from, to, ticks, anchors }` where `anchors` is an object id → ARRAY of `{x, y}` (for `'time'`, wrap each single anchor in an array).

For `'commits'` and `'chronology'` (date dimensions):
- Buckets: day = UTC calendar day; week = ISO week starting Monday; month; year. A bucket's key time is its start.
- `'auto'`: choose the finest of day, week, month, year for which the total number of distinct buckets touched by all nodes' intervals is ≤ 60.
- For each node, the buckets its intervals overlap. If a node overlaps more than 12 buckets, keep only its first and last bucket.
- Position buckets with the existing `compressedTimeScale` over the sorted distinct bucket key times (span = axis length). Each overlapped bucket gives the node one anchor.
- Ticks: one per distinct bucket used, labelled day → `Jun 3`, week → `wk Jun 1`, month → `Jun '30`, year → `2030` (use `toLocaleDateString('en', {..., timeZone: 'UTC'})`).
- Return `null` if fewer than 2 nodes have anchors.

For `'narrative'`: linear positions, `position = value * length`. Ticks at every distinct value, labelled with the node's `series_part` when it came from series_part, otherwise the value as a percentage (`42%`). Return `null` if fewer than 2 nodes.

Export `dimensionAxisGeometry`, `dimensionIntervals`, and `parseLooseDate` in `module.exports`.

## 6. GraphViewer.jsx — anchor loop only
In `drawAxis`, replace the `timeAxisGeometry(...)` call with `dimensionAxisGeometry(g.data.nodes, { orientation..., origin, length, dimension: axis.dimension || 'time', granularity: axis.granularity || 'auto' })` (import it). In the connector loop, iterate over `geo.anchors[d.id]` as an array, drawing one connector per anchor. Keep everything else in `drawAxis` unchanged.

Finish by writing `_handoff/T5a-report.md`: each change with function names, and anything UNSURE.
