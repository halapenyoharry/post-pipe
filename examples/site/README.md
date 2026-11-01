# Example site

This folder holds a small, self-contained example site for `post-pipe` and serves as the canonical home for the `_note` documentation keys in `settings.json` that explain every engine setting.

## Building

From the engine root:

- `node generate-index.js` builds this example site by default (writing output to `examples/site/_site/`).
- `POSTPIPE_SITE=/path/to/site node generate-index.js` builds any other site folder.

## Using your own site

A real site lives in its own folder outside the engine (or in its own repository) and keeps its own `settings.json`, `feeds.opml`, and content folders there. Point `POSTPIPE_SITE` at that folder when building.

## Per-feed display parameters (`feeds.opml` and `settings.json`)

Each `<outline>` in `feeds.opml` (or matching entry under `"feeds"` in `settings.json`, keyed by feed `xmlUrl`, `id`, or `title`) accepts optional per-feed display parameters:

- `cardScale` — positive number scaling cards from that feed in `GraphViewer` (for example `cardScale="0.85"`).
- `itemCap` (or `maxItems`) — positive integer capping how many of the feed's newest items enter the corpus (for example `itemCap="20"`).
- `defaultHidden` (or `hidden`) — `"true"` to start that feed hidden on a reader's first visit while keeping its source pill in `FeedZ` so they can toggle it on (`defaultHidden="true"`).

