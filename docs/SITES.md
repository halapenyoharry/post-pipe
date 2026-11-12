# Sites and the engine

#post-pipe #sites #contract
Written 2026-10-24. How a site relates to post-pipe, settled on 2026-10-22 and 2026-10-23 when the owner's own site moved out of the engine's folder.

## The shape

post-pipe is an engine. It holds no user's site. A **site** is a separate folder, usually its own git repository, that uses the engine as a dependency: a **downstream user** of post-pipe. Two exist today: `~/Projects/epicofelinorjones.com` (a novel) and `~/Projects/haroldyounghumxn.site` (the owner's writing beside publishers' feeds). The engine's word is "site"; the build setting that points the engine at one is named after it.

A site is a folder holding at least:

- `settings.json` — the site's values (title, author, base address, graph and reader settings, which engines it subscribes to). The notes that explain every setting live in `examples/site/settings.json`; copy a setting and its `_note` from there.
- `feeds.opml` — the site's sources. Each `<outline>` is one source: a publisher's RSS, Atom or JSON feed, a local folder as `local://<path>` (a leading `~` expands; a relative path resolves against the site), one article's page as `type="page"` (its address in `xmlUrl`), or a local list of such pages as `type="pages"` (a text file, one address per line, a path like `local`'s). One source is one tag-system to rosetta-tagz. The types are described in `README.md`.
- optionally saved copies of fetched feeds — a file per feed, `{ url, fetchedAt, body }`, named on its outline with `savedCopy` (relative to the site, provisional): used only when a build's fetch of that feed fails, if it is newer than the engine's last good copy; written only by `node generate-index.js --save-copies`, never by an ordinary build. Worth tracking in the site's git: a fresh clone or an offline machine then still shows those cards. The example site ships two in `saved/`.
- optionally `auth/.env` — credentials for publishing (GitHub token, API keys). Read from the site first; the engine's own `auth/.env` is the fallback, announced with one logged line.
- optionally `rtagz-overrides.json` — human decisions for rosetta-tagz (see `docs/POST-PIPE-USES-RTAGZ.md`).
- optionally `rtagz-ids.json` — written by rosetta-tagz when the site turns it on: the concept ids it keeps from one build to the next. Worth tracking in the site's git.
- optionally `rtagz-queue.json` (provisional) — written by rosetta-tagz on every build whose `discover` is `"queue"`, beside the overrides file: the tags discovery would have attached, for the site's owner to choose from (see `docs/POST-PIPE-USES-RTAGZ.md`).
- `cards.json` (the name is provisional; `settings.cards.ledger` names another, `false` keeps none) — written by the first build: every card's slug, discovered from what the piece carries and never rewritten after (`src/lib/cardSlug.js`, 2026-11-04). Worth tracking in the site's git.
- `_site/` — build output, git-ignored.
- `archive/` — by convention, git-ignored and Syncthing-synced, for material the site's owner keeps but the engine never reads.

## Building

```
cd ~/Projects/post-pipe
POSTPIPE_SITE=~/Projects/<site> node generate-index.js
```

Every script (`generate-index.js`, `add-feed.js`, `update-index.js`, the publishers in `platforms/`) finds the site the same way, through `src/lib/siteRoot.js`: `POSTPIPE_SITE` if set, else the example site at `examples/site/`. So a fresh clone builds the example and never someone else's site. The example site is post-pipe's test page, what anyone (a person or an agent) builds to see the engine work without bringing data of their own: it reads two public feeds, ScienceDaily and ProPublica, fetched at build, with rosetta-tagz on so their items carry tagz, and ships a saved copy of each for a build that cannot fetch them. It carries no person's name and no one's own writing. Its slug ledger and rosetta-tagz files follow the live feeds and stay out of git.

A site may convert its own content shape into post-pipe's before building, the way the novel's `scripts/build.js` assembles chapter folders from a manuscript repository and then calls `generate-index.js` with `POSTPIPE_SITE` set. That converter belongs to the site, not the engine. Formats many people share (a folder of pieces, feeds) are read by the engine directly.

Another checkout of the engine can be used with `POSTPIPE_ENGINE=<folder>` in a site's own build script; the novel's does this.

## What stays out of the engine

- Names, accounts, folders, colours, tag lists, chapter lists of any one site. They live in that site's settings.
- Fallbacks to a person. A piece with no author takes its site's author (`settings.author.name`, else `.display`), else stays empty. Publishing stops with a message naming the missing variable instead of defaulting to an account.
- Rules about one person's brand. "humxn" in an author name is shown as written; the engine neither adds nor strips it.
- Text from one site's content in the engine's tests. The unit tests use plain invented sentences. Browser checks for a site live in that site's repository (`test/e2e/` in the novel's) and load Playwright from the engine's `node_modules`.

## rosetta-tagz

A site subscribes to rosetta-tagz (rtagz for short, a folder in this repository with its own programs, tests and docs) with an `rtagz` block in its settings; off by default, full contract in `docs/POST-PIPE-USES-RTAGZ.md`. The block was named `stone` before 2026-10-31; a site whose settings still say `stone` builds the same, with one logged line asking for the rename. The `discover` switch makes `rtz-discover` propose tags from words that recur across a source with no tags of its own; set to `"queue"` (since 2026-11-04), it attaches none of them and lists them in the site's `rtagz-queue.json` for its owner to choose from, by moving one into the overrides file's `accept` list. Finding from the first real run (2026-10-22, 102 items): translation merged nothing because the sources shared no spellings; emergence tagged 18 items from the owner's own vocabulary; discovery connected everything but mostly with generic words, and a discovered word can rename an owner's tag (`process` became `processing`). A site that wants its own spellings to win can pin them or weight its own source in `rtagz-overrides.json`. Since 2026-10-25 the block can also name `conceptSchemes` (published vocabularies the site vendors, each `{ id, path }`) and `ledger` (the ids file, where `rtz-stone` keeps its concept ids between builds, `rtagz-ids.json` in the site by default, provisional), and the feed's `_rtagz` then carries `schemes[]`, each concept's `prefLabel` per scheme, and rosetta-tagz's `skos.jsonld` and `skos.ttl` are copied into `_site/` when this build wrote them (one left there by an earlier build is removed, so a file beside `feed.json` always describes it).

## Flow

A site lets its readers read its cards one after another in Flow's order (Flow is a folder in this repository with its own programs, presets, tests and `flow/README.md`) with a `flow` block in its settings (since 2026-11-07, provisional): `presets`, the names of presets in `flow/presets/` or paths to the site's own, relative to the site. The build runs Flow's programs for each and writes the orders into `feed.json` as `flows`; the reader's Next and Previous then follow the order the reader chose, the top bar's book (`topBar.resume`, with no `start`) starts a reader with no place yet at its first card, and with two or more presets the main view's panel offers the choice. `next: false` keeps Next and Previous on `sequence` edges. A card whose source a reader hides with its pill stays in the order, and the reader shows that source's own pill in its off state (2026-11-08; the pill 2026-11-09), as it shows every card's source with its pill, on or off as the top bar's is, on any site whose top bar shows source pills (2026-11-10). Absent or empty, nothing runs and `feed.json` is as it was. The notes are in `examples/site/settings.json`; the details in `ARCHITECTURE.md`, Reading in Flow's order.

## The reader

A site's `reader` block holds the reader's switches, each with its note in `examples/site/settings.json`: `header` (a line above the title, and the byline), `progressBar`, `allowDownload`, `bookmarksList` and `fonts`. `words` (provisional, since 2026-11-10) says how much of the open card the reader shows at first; the reader shows one card at a time, with nothing beneath it (2026-11-11): `50`, `100`, `250` or `500` (about that many words, to the end of a sentence, with read the rest under them to show the whole card in place) or `"whole"` (the whole card). `"one"`, offered from 2026-11-10 to 2026-11-11, still works and means `"whole"`. Absent means `100`. A visitor's own choice in the reader's panel (Reading, Words before the next, provisional) wins on their device. The details are in `ARCHITECTURE.md`, The reader, one card at a time.

## Serving a build locally

Any static server on `_site/` works. The owner's preview runs as a LaunchAgent on port 8891 bound to all interfaces, with no-cache headers, serving `haroldyounghumxn.site/_site`; details in `~/Projects/localNetworkZ/services-registry.json`.
