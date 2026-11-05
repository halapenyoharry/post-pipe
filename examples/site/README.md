# Example site

This folder is post-pipe's test page: a complete example site that anyone, a person or an agent, can build to see the engine work without bringing data of their own. It reads two public feeds, ScienceDaily and ProPublica (`feeds.opml`), with rosetta-tagz on so their items carry tagz. It is also the canonical home for the `_note` documentation keys in `settings.json` that explain every engine setting.

## Building

From the engine root:

- `node generate-index.js` builds this example site by default (writing output to `examples/site/_site/`). The build fetches the two feeds over the network; nothing else is fetched.
- `POSTPIPE_SITE=/path/to/site node generate-index.js` builds any other site folder.

The build writes its slug ledger (`cards.json`) and rosetta-tagz's ids (`rtagz-ids.json`, and `rtagz-queue.json` when discovery queues) beside `settings.json`. They follow the live feeds, so git ignores them here; a real site usually tracks its own.

## Using your own site

A real site lives in its own folder outside the engine (or in its own repository) and keeps its own `settings.json`, `feeds.opml`, and content folders there. Point `POSTPIPE_SITE` at that folder when building.

## Per-feed display parameters (`feeds.opml` and `settings.json`)

Each `<outline>` in `feeds.opml` (or matching entry under `"feeds"` in `settings.json`, keyed by feed `xmlUrl`, `id`, or `title`) accepts optional per-feed display parameters:

- `cardScale` — positive number scaling cards from that feed in `GraphViewer` (for example `cardScale="0.85"`).
- `itemCap` (or `maxItems`) — positive integer capping how many of the feed's newest items enter the corpus (for example `itemCap="20"`).
- `defaultHidden` (or `hidden`) — `"true"` to start that feed hidden on a reader's first visit while keeping its source pill in `FeedZ` so they can toggle it on (`defaultHidden="true"`).
