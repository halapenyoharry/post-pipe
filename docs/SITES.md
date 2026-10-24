# Sites and the engine

#post-pipe #sites #contract
Written 2026-10-24. How a site relates to post-pipe, settled on 2026-10-22 and 2026-10-23 when the owner's own site moved out of the engine's folder.

## The shape

post-pipe is an engine. It holds no user's site. A **site** is a separate folder, usually its own git repository, that uses the engine as a dependency: a **downstream user** of post-pipe. Two exist today: `~/Projects/epicofelinorjones.com` (a novel) and `~/Projects/haroldyounghumxn.site` (the owner's writing beside publishers' feeds). The engine's word is "site"; the build setting that points the engine at one is named after it.

A site is a folder holding at least:

- `settings.json` — the site's values (title, author, base address, graph and reader settings, which engines it subscribes to). The notes that explain every setting live in `examples/site/settings.json`; copy a setting and its `_note` from there.
- `feeds.opml` — the site's sources. Each `<outline>` is one source: a publisher's RSS, Atom or JSON feed, or a local folder as `local://<path>` (a leading `~` expands; a relative path resolves against the site). One source is one tag-system to the stone.
- optionally `auth/.env` — credentials for publishing (GitHub token, API keys). Read from the site first; the engine's own `auth/.env` is the fallback, announced with one logged line.
- optionally `stone.overrides.json` — human decisions for the tag stone (see `docs/STONE-SEAM.md`).
- `_site/` — build output, git-ignored.
- `archive/` — by convention, git-ignored and Syncthing-synced, for material the site's owner keeps but the engine never reads.

## Building

```
cd ~/Projects/post-pipe
POSTPIPE_SITE=~/Projects/<site> node generate-index.js
```

Every script (`generate-index.js`, `add-feed.js`, `update-index.js`, the publishers in `platforms/`) finds the site the same way, through `src/lib/siteRoot.js`: `POSTPIPE_SITE` if set, else the example site at `examples/site/`. So a fresh clone builds the example and never someone else's site. The example site is also the engine's test corpus of five made-up pieces about ordinary things; it carries no person's name.

A site may convert its own content shape into post-pipe's before building, the way the novel's `scripts/build.js` assembles chapter folders from a manuscript repository and then calls `generate-index.js` with `POSTPIPE_SITE` set. That converter belongs to the site, not the engine. Formats many people share (a folder of pieces, feeds) are read by the engine directly.

Another checkout of the engine can be used with `POSTPIPE_ENGINE=<folder>` in a site's own build script; the novel's does this.

## What stays out of the engine

- Names, accounts, folders, colours, tag lists, chapter lists of any one site. They live in that site's settings.
- Fallbacks to a person. A piece with no author takes its site's author (`settings.author.name`, else `.display`), else stays empty. Publishing stops with a message naming the missing variable instead of defaulting to an account.
- Rules about one person's brand. "humxn" in an author name is shown as written; the engine neither adds nor strips it.
- Text from one site's content in the engine's tests. The unit tests use plain invented sentences. Browser checks for a site live in that site's repository (`test/e2e/` in the novel's) and load Playwright from the engine's `node_modules`.

## The tag stone

A site subscribes to `rosetta-tagz` with a `stone` block in its settings; off by default, full contract in `docs/STONE-SEAM.md`. The `discover` switch makes the stone propose tags from words that recur across a source with no tags of its own. Finding from the first real run (2026-10-22, 102 items): translation merged nothing because the sources shared no spellings; emergence tagged 18 items from the owner's own vocabulary; discovery connected everything but mostly with generic words, and a discovered word can rename an owner's tag (`process` became `processing`). A site that wants its own spellings to win can pin them or weight its own source in `stone.overrides.json`.

## Serving a build locally

Any static server on `_site/` works. The owner's preview runs as a LaunchAgent on port 8891 bound to all interfaces, with no-cache headers, serving `haroldyounghumxn.site/_site`; details in `~/Projects/localNetworkZ/services-registry.json`.
