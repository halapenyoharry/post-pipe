Task T2: two small engine changes. You have NO shell access; only read and edit files. Harold's operator runs all commands and tests afterward.

Edit ONLY these two files: `generate-index.js` and `src/adapters/LocalFolderAdapter.js`. Do not touch `dist/`, `dist-embed/`, `feeds.opml`, `settings.json`, or anything else.

Hard rule: when the environment variable `POSTPIPE_SITE` is not set, the build must behave exactly as it does now.

## Change A — site folder (generate-index.js)

1. Add near the top:
   `const SITE_ROOT = process.env.POSTPIPE_SITE ? expandHome(process.env.POSTPIPE_SITE) : __dirname;`
   where `expandHome(p)` turns a leading `~` into `process.env.HOME` and then returns `path.resolve(p)`.
2. Read `settings.json` from `SITE_ROOT` instead of `__dirname`.
3. Resolve `OPML_PATH` against `SITE_ROOT` instead of `__dirname`.
4. Set `SITE_DIR` to `path.join(SITE_ROOT, '_site')`.
5. Keep every engine asset read from `__dirname`: `auth/.env`, `fonts/`, `tts.js`, `src/lib/viewState.js`, `dist/`, `kokoro-worker.js`.
6. In `configFor`, for `local` entries: if the path after `local://` is relative (does not start with `/` or `~`), resolve it against `SITE_ROOT`. Absolute and `~` paths are unchanged.
7. Pass `pagesDir: SITE_DIR` in the local adapter config, next to `coversDir`.
8. At the start of `main()`, log one line: `Site root: <SITE_ROOT>`.

## Change B — per-item pages (LocalFolderAdapter.js)

For every local item, after it is ingested, if `config.pagesDir` is set and the item has a body (`c.body` = `{ file, format }` from ingest.js):
- Source file: `path.join(resolvedRoot, c.id, c.body.file)`.
- Output file: `path.join(config.pagesDir, c.id + '.html')`. Create `pagesDir` if missing.
- If `format` is `md`: read the file as UTF-8 and render it with `marked` (already a dependency: `const { marked } = require('marked');`) using default options. Do not modify the Markdown text before rendering: no trimming, no replacements, no cleanup.
- If `format` is `html`: copy the file as-is.
- Any other format (e.g. `qmd`): skip.
- Wrap rendered Markdown in exactly this document, with the title HTML-escaped (`& < > "`):
  `<!doctype html>\n<html><head><meta charset="utf-8"><title>TITLE</title></head><body><h1>TITLE</h1>\nRENDERED</body></html>\n`
- If reading or rendering one item fails, log a warning naming the item and continue with the rest.

Finish by writing `_handoff/T2-report.md`: for each change, the exact functions/lines you changed, and anything you were unsure about marked UNSURE.
