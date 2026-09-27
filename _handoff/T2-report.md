# Task T2 Report

## Summary of Changes

### Change A — Site Folder ([`generate-index.js`](file:///Users/harold/Projects/post-pipe/generate-index.js))

1. **Lines 18–26 (`expandHome` helper and `SITE_ROOT`)**:
   - Added `expandHome(p)` function which replaces a leading `~` with `process.env.HOME` and resolves the path with `path.resolve`.
   - Defined `const SITE_ROOT = process.env.POSTPIPE_SITE ? expandHome(process.env.POSTPIPE_SITE) : __dirname;`.
2. **Line 27 (`SETTINGS`)**:
   - Changed `path.join(__dirname, 'settings.json')` to `path.join(SITE_ROOT, 'settings.json')`.
3. **Line 28 (`SITE_DIR`)**:
   - Changed `path.join(__dirname, '_site')` to `path.join(SITE_ROOT, '_site')`.
4. **Line 29 (`COVERS_DIR`)**:
   - Kept relative to `SITE_DIR` (`path.join(SITE_DIR, 'covers')`), now pointing under the resolved `SITE_ROOT/_site/covers`.
5. **Line 32 (`OPML_PATH`)**:
   - Changed `path.join(__dirname, ...)` to `path.resolve(SITE_ROOT, SETTINGS.feeds_opml_path || 'feeds.opml')`.
6. **Lines 63–85 (`configFor`)**:
   - For `entry.type === 'local'`: checked if the path after `local://` is relative (does not start with `/` or `~`), and resolved it against `SITE_ROOT` using `path.resolve(SITE_ROOT, localPath)`.
   - Passed `pagesDir: SITE_DIR` in the local adapter config next to `coversDir`.
7. **Line 655 (`main()`)**:
   - Added `console.log(\`Site root: ${SITE_ROOT}\`);` as the very first line of `main()`.
8. **Preserved engine assets on `__dirname`**:
   - `auth/.env` (line 9), `fonts/` (lines 30-31), `tts.js` (line 158), `src/lib/viewState.js` (line 159), `dist/` (lines 164, 167), and `kokoro-worker.js` (line 679) remain read from `__dirname`.

---

### Change B — Per-Item Pages ([`src/adapters/LocalFolderAdapter.js`](file:///Users/harold/Projects/post-pipe/src/adapters/LocalFolderAdapter.js))

1. **Line 14 (Imports)**:
   - Added `const { marked } = require('marked');`.
2. **Lines 28, 32, 39–43 (`load`)**:
   - Extracted `pagesDir` from `config`.
   - After `ingestFolder(rootPath)`, in the items iteration, invoked `generateItemPage(c, rootPath, pagesDir)` for every local content object.
3. **Lines 172–208 (`generateItemPage` & `escapeHtml`)**:
   - Added HTML escaping helper `escapeHtml` that escapes `&`, `<`, `>`, `"`.
   - In `generateItemPage`:
     - Checked if `pagesDir` is set and item has `c.body` (`{ file, format }`).
     - Skipped any format other than `md` or `html`.
     - Resolved source file: `path.join(resolvedRoot, c.id, file)`.
     - Output file: `path.join(pagesDir, `${c.id}.html`)`.
     - Verified source file exists; ensured `pagesDir` exists with `fs.mkdirSync(pagesDir, { recursive: true })`.
     - If `format === 'html'`: copied file with `fs.copyFileSync(srcPath, outPath)`.
     - If `format === 'md'`: read UTF-8 file content directly without modification, rendered with `marked(rawMd)`, escaped `c.title`, and wrapped in:
       ```html
       <!doctype html>
       <html><head><meta charset="utf-8"><title>TITLE</title></head><body><h1>TITLE</h1>
       RENDERED</body></html>
       ```
     - Handled errors with a `try/catch` block that logs a warning naming the item ID (`c.id`) and continues execution.

---

## Uncertainties

None. Everything matched the requirements and existing codebase structure directly.
