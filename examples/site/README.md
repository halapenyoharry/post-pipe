# Example site

This folder is post-pipe's test page: a complete example site that anyone, a person or an agent, can build to see the engine work without bringing data of their own. It reads two public feeds, ScienceDaily and ProPublica (`feeds.opml`), with rosetta-tagz on so their items carry tagz. It is also the canonical home for the `_note` documentation keys in `settings.json` that explain every engine setting.

## Building

From the engine root:

- `node generate-index.js` builds this example site by default (writing output to `examples/site/_site/`). The build fetches the two feeds over the network and, when post-pipe's `.feed-cache/colors.json` has no colour for a feed yet (the first build on a machine), that feed's home page, for its `theme-color`; nothing else is fetched. When a fetch fails, that feed's cards come from its saved copy (below).
- `POSTPIPE_SITE=/path/to/site node generate-index.js` builds any other site folder.

The build writes its slug ledger (`cards.json`) and rosetta-tagz's ids (`rtagz-ids.json`, and `rtagz-queue.json` when discovery queues) beside `settings.json`. They follow the live feeds, so git ignores them here; a real site usually tracks its own.

## Saved copies of the two feeds

So that a build which cannot reach the feeds (a machine offline, a feed slow to answer, a fresh clone with nothing fetched yet) still shows cards, the example ships a copy of each feed in `saved/`: `saved/sciencedaily.json` and `saved/propublica.json`. Each outline in `feeds.opml` names its own with `savedCopy` (a path relative to the site; the name is provisional). A copy is the same JSON the engine keeps as its last good copy of a feed: `{ url, fetchedAt, body }`, `body` being the feed's text as fetched.

- A build uses a copy only when its fetch of that feed fails. It then takes the newer, by `fetchedAt`, of the site's saved copy and the engine's last good copy (the one every good fetch leaves in the engine's `.feed-cache/last-good/` on the machine that builds). The source's pill shows the stale mark, and its popover says which copy the cards came from and when it was fetched; in `feed.json` the source carries `stale`, `copyDate`, `copyFrom` (`site` or `engine`) and `error`.
- An ordinary build never writes the saved copies, so building does not change this folder's git.
- To refresh them, build with the flag, from the engine root:

  ```bash
  node generate-index.js --save-copies
  ```

  Each outline that names a `savedCopy` gets it written from this build's own fetch, when that fetch succeeds; one whose fetch fails is left as it was. Commit the two files afterwards. Another site does the same with `POSTPIPE_SITE` set, after adding `savedCopy` to the outlines it wants copies of.

Every source pill, hovered, focused from the keyboard, or held with a finger for about half a second, shows when its items were taken in: when the feed was fetched for this build (or when the copy was), and the feed's own date for itself when it gives one (ScienceDaily's does, as `lastBuildDate`; ProPublica's gave none when these copies were saved, on 2026-11-05). A tap still hides or shows the source.

## Using your own site

A real site lives in its own folder outside the engine (or in its own repository) and keeps its own `settings.json`, `feeds.opml`, and content folders there. Point `POSTPIPE_SITE` at that folder when building.

## Per-feed display parameters (`feeds.opml` and `settings.json`)

Each `<outline>` in `feeds.opml` (or matching entry under `"feeds"` in `settings.json`, keyed by feed `xmlUrl`, `id`, or `title`) accepts optional per-feed display parameters:

- `cardScale` — positive number scaling cards from that feed in `GraphViewer` (for example `cardScale="0.85"`).
- `itemCap` (or `maxItems`) — positive integer capping how many of the feed's newest items enter the corpus (for example `itemCap="20"`).
- `defaultHidden` (or `hidden`) — `"true"` to start that feed hidden on a reader's first visit while keeping its source pill in `FeedZ` so they can toggle it on (`defaultHidden="true"`).
