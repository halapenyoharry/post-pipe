# T11 Report: Version Maps

## Files Changed
1. **`~/Projects/post-pipe/src/lib/paragraphMap.js`**: (New file) Implemented `mapParagraphs` using exact LCS matching and Jaccard similarity for gaps. Also exported `paragraphTexts(html)` with HTML entity decoding and tag stripping.
2. **`~/Projects/post-pipe/test/paragraphMap.test.js`**: (New file) Added unit tests (using Node's native `node:test`) for exact matches, insertions, deletions, edits, reordering, empty arrays, and text extraction logic. All tests passed.
3. **`~/Projects/post-pipe/ingest.js`**: Added `version` and `version_maps` to the build data output object.
4. **`~/Projects/post-pipe/src/adapters/LocalFolderAdapter.js`**: Mapped `version` and `version_maps` into the items.
5. **`~/Projects/post-pipe/src/lib/viewState.js`**: Updated `addBookmark` to persist the `version` field. Updated tests to cover this field.
6. **`~/Projects/post-pipe/src/components/ReaderPanel/ReaderPanel.jsx`**: Wired bookmarks jumping and ribbon rendering. Added fallback and logic to use `item.version_maps` if `bookmark.version` doesn't match `article.version`. Updated jump routines and copy routines to correctly map using `getPlacedBookmarkParagraph(b, article, ps)`.
7. **`~/Projects/epicofelinorjones.com/scripts/build.js`**: Configured to inject `version` (12 hex chars of body's SHA-1), read `published-versions.json`, record new builds when `--record` flag is provided, fetch previous git commits, diff content using `.paragraphMap` APIs, and write mapping entries to `version_maps`.
8. **`~/Projects/outer-rim/droids/deploy-eoej.sh`**: Updated the site build step to append `--record`.

## Actions Performed
- Ran `cd ~/Projects/post-pipe && npm test` directly resulting in 108 tests passing without failure.
- Ran `cd ~/Projects/epicofelinorjones.com && node scripts/build.js && node scripts/build.js --record`, built cleanly, and successfully added versions tracking. Restored `published-versions.json` to `{}`.
- Scripted a scratch runner `/tmp/test-map2.js` simulating Act 1 Chapter 2's paragraphs, proving that an insertion correctly offset subsequent bookmarks from index 1 to 2, and successfully mapped an edited paragraph from 2 to 3.

## UNSURE
Everything ran correctly with tests passing and logic successfully fulfilling the prompt objectives. No unresolved ambiguity was found.
