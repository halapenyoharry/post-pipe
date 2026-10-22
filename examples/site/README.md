# Example site

This folder holds a small, self-contained example site for `post-pipe` and serves as the canonical home for the `_note` documentation keys in `settings.json` that explain every engine setting.

## Building

From the engine root:

- `node generate-index.js` builds this example site by default (writing output to `examples/site/_site/`).
- `POSTPIPE_SITE=/path/to/site node generate-index.js` builds any other site folder.

## Using your own site

A real site lives in its own folder outside the engine (or in its own repository) and keeps its own `settings.json`, `feeds.opml`, and content folders there. Point `POSTPIPE_SITE` at that folder when building.
