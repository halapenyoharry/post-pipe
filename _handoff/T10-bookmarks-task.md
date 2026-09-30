Task T10: reader bookmarks, notes, and links. Work in `~/Projects/post-pipe` only (engine; must stay content-agnostic: nothing novel-specific). Read `~/Projects/epicofelinorjones.com/DROIDZ.md` for the rules. Do not edit `dist/`/`dist-embed/` by hand. Do not commit. Make the edits; do not end your turn after only reading files.

These are **reader-side** data: stored in the reader's own view state (`src/lib/viewState.js`, the same place reading positions live), never sent anywhere.

## 1. View state (`src/lib/viewState.js`)

Add `state.bookmarks`: an array of `{ id, item, para, quote, note, t }`:
- `id`: unique string (e.g. `bm-` + timestamp + random).
- `item`: the item's persistent key (the same key reading positions use).
- `para`: 0-based index of the paragraph (`p` element) in the chapter body.
- `quote`: the first 8 words of that paragraph's text (anchor for re-finding it).
- `note`: string, `''` for a plain bookmark.
- `t`: creation time.

API: `bookmarks(item?)` (all, or those for one item, in `para` order), `addBookmark({ item, para, quote, note })` → returns id, `setBookmarkNote(id, note)`, `removeBookmark(id)`. Persist like other reader state (not undo history). Add tests in `test/viewState.test.js` for add / list / note / remove / persistence.

## 2. Anchor resolution (a small pure function, exported and tested)

`resolveParagraph(paragraphTexts, { para, quote })` → index:
1. If `paragraphTexts[para]` starts with `quote` (compare normalized: lowercase, collapse whitespace, strip punctuation), return `para`.
2. Else return the index of the first paragraph that starts with `quote`, if any.
3. Else return `min(para, paragraphTexts.length - 1)`.
Put it in `src/lib/` and add tests.

## 3. Reader panel (`src/components/ReaderPanel/`)

- A **bookmark button** in the reader's toolbar: adds a bookmark at the first paragraph visible at the top of the reading area. After adding, show a small inline field to type an optional note (Enter or blur saves; Escape leaves it as a plain bookmark).
- A **marks list** toggle in the toolbar showing this chapter's bookmarks in order: first words of the paragraph, the note if any (editable), a jump action (scroll to the resolved paragraph), **Copy link**, and remove.
- In the text, a small ribbon in the left margin of each bookmarked paragraph (notes shown on hover or click).
- **Copy link** copies `<page URL without hash>#read=<item id>&p=<resolved para>`. Also add a **Copy link to here** button in the toolbar (current top paragraph, no bookmark saved). Notes are never put in links.

## 4. Opening a link

On page load (and on `hashchange`), if the URL hash has `read=<id>`, open that item in the reader panel (the same path as selecting it in the graph) and, once its text is loaded, scroll so paragraph `p` is at the top. Ignore unknown ids. Leave the hash in place.

## 5. Graph marker

Chapter cards whose item has one or more bookmarks show a small ribbon mark in a corner, with the count if more than one. Nothing else changes on cards.

## Done means

`npm test` passes (with the new tests); `npm run build`, `npm run build:lib`, `npm run build:embed` succeed; the engine's own build (`node generate-index.js`) still reports 80 items, 27 edges. Write `_handoff/T10-report.md`: files/functions changed, how the top visible paragraph is found, how link opening waits for the text, and anything UNSURE.
