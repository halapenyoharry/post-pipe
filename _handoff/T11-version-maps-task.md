Task T11: bookmarks follow edits exactly, using the manuscript's git history. Read `~/Projects/epicofelinorjones.com/DROIDZ.md` first (engine stays content-agnostic; never write under `~/Writing`; never change chapter text).

**Harold is redesigning the graph's look at the same time.** Do NOT edit `GraphViewer.jsx`, `TextView.jsx`, any `.css`/`.module.css` file, `generate-index.js`, `embed.jsx`, or `dist*/`. Touch only the files listed below. Do not run the builds that write `dist/`. Do not commit.

## Idea

A bookmark records which **version** of the chapter the reader saw. When the chapter changes, the build computes, for every previously **published** version, where each of its paragraphs went in the current version. The reader's browser looks the bookmark up in that map. The paragraph number + first-words anchor stays as the fallback.

## 1. Engine: pure paragraph map (`~/Projects/post-pipe/src/lib/paragraphMap.js`, new, CommonJS, no dependencies)

`mapParagraphs(oldParas, newParas)` → array, one entry per old paragraph: the new index, or `-1` if cut.
1. Normalize each paragraph (lowercase, collapse whitespace, strip punctuation).
2. Longest common subsequence on exact normalized equality → matched pairs.
3. For each gap between consecutive matches, pair remaining old and new paragraphs in order when their word-set similarity (Jaccard) ≥ 0.5 (edited paragraph); unpaired old paragraphs map to `-1`.
Also export `paragraphTexts(html)` → array of the plain text of each `<p>…</p>` in order (strip tags, decode `&amp; &lt; &gt; &quot; &#39;`).
Tests in `~/Projects/post-pipe/test/paragraphMap.test.js`: unchanged, inserted paragraph, deleted paragraph, edited paragraph, reordered, empty.

## 2. Engine: pass fields through (only these edits)

- `ingest.js`, frontmatter.json builder: add `version: fm.version || null, version_maps: fm.version_maps || null`.
- `src/adapters/LocalFolderAdapter.js`, `contentToItem`: add `version` and `version_maps` to the item when present.

## 3. Engine: bookmarks use the map

- `src/lib/viewState.js`: bookmarks gain an optional `version` field (store what `addBookmark` is given; old bookmarks without it still work).
- `src/components/ReaderPanel/ReaderPanel.jsx` (JS logic only, no CSS or markup changes): when adding a bookmark, pass the current item's `version`. When placing a bookmark: if `bookmark.version` differs from the item's `version` and `item.version_maps[bookmark.version]` exists, use `map[bookmark.paragraph]`; if that is `-1` or there's no map, use the existing `resolveParagraph` with the quote. Links (`#read=…&p=…`) are unchanged.
- Tests for the viewState field.

## 4. Site build (`~/Projects/epicofelinorjones.com/scripts/build.js`)

- **Version id** of a chapter = first 12 hex chars of SHA-1 of its stripped body (the exact text written to `_build/content/<id>/index.md`). Write it into the generated `frontmatter.json` as `version`.
- **Published ledger:** `~/Projects/epicofelinorjones.com/published-versions.json` (tracked in git), shape `{ "<chapter id>": [ { "version", "commit", "source", "date" } ] }`. With a new flag `--record`, after building, append each chapter's current version if it's not already its last entry. `commit` = the manuscript commit whose content of that file equals the working file (`git log -1 --format=%H -- <file>` when `git diff --quiet -- <file>` reports no change; otherwise `null`). `source` = the manuscript path at that time.
- **Maps:** for each chapter, for each ledger entry whose `version` differs from the current version and whose `commit` is not null: get the old file with `git show <commit>:<path relative to repo root>` (run in the manuscript's git repo), apply the same heading strip, render both old and current bodies to HTML with the engine's `marked` (`require(path.join(ENGINE, 'node_modules', 'marked'))`, same default options the engine uses), take `paragraphTexts` of each (require `paragraphMap.js` from the engine), and `mapParagraphs(old, current)`. Write all maps as `version_maps: { "<old version>": [ … ] }` in the generated `frontmatter.json`.
- Print in the summary how many chapters have maps.

## 5. Deploy

In `~/Projects/outer-rim/droids/deploy-eoej.sh`, change the build line to `node "$SITE_REPO/scripts/build.js" --record`. Nothing else in that file.

## Done means

`cd ~/Projects/post-pipe && npm test` passes (new tests included). `node ~/Projects/epicofelinorjones.com/scripts/build.js` and `… --record` both run (then restore `published-versions.json` to `{}`: the real ledger starts with the first real deploy). Show a map working: in a scratch copy under `/tmp` (never in `~/Writing`), demonstrate `mapParagraphs` on Act 1 chapter 2's paragraphs with one paragraph inserted and one edited. Write `~/Projects/post-pipe/_handoff/T11-report.md` with files changed and anything UNSURE.
