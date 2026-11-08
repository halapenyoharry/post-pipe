# post-pipe

An engine for reading a collection as a graph instead of a feed. Point it at a folder of writing and any number of published feeds, and it builds a static site where every piece is a card in a force-directed graph, tagz hold the cards together, a tap opens a card in place, and a double tap opens it in a reader with text-to-speech. Scrolling is one of the ways to meet a body of work; this is another.

post-pipe is also the publishing route for the writing it holds: a piece can go out to GitHub Pages, and through it to Medium, from the same folder it is read from (Substack and YouTube are stubs so far).

## What's in the repository

- The **engine**: `generate-index.js` reads a site's sources, runs them through rosetta-tagz if the site asks, and writes `_site/` (a `feed.json` and the viewer). `add-feed.js` adds a source to a site's `feeds.opml` and rebuilds; `update-index.js` pushes a built site's `feed.json`, `index.html` and covers to GitHub Pages. `ARCHITECTURE.md` describes the content model.
- The **viewer**: a React and D3 graph in `src/`, with cluster and ring layouts, a reader panel, tagz with adjustable depth, and a settings panel. What a tap, double tap, drag or long press does is a table a site can rewrite without touching code; see `docs/ACTIONS.md`.
- **rosetta-tagz** (`rtagz` for short), in `rosetta-tagz/`: the part that reads each source's own tag vocabulary and translates them into one, keeps every source's spelling visible, lets untagged items earn tagz from their text, and keeps each tag's id stable from one build to the next. It has its own programs, docs and tests, and post-pipe reaches it only through its programs. The contract is `docs/POST-PIPE-USES-RTAGZ.md`.
- **flow**, in `flow/` (since 2026-11-01): command-line programs that read a built site's `feed.json` and put its cards in one order, one after another, under a weight vector the reader owns, and write that order as text or as a line over the graph. Like rosetta-tagz it has its own programs, presets, tests and `flow/README.md`, and post-pipe reaches it only by running its programs. A site that lists presets in its settings (`flow.presets`, since 2026-11-07) has the build run them, and its readers go through the cards in one of those orders with the top bar's book and the reader's Next; a card whose source is hidden stays in the order (2026-11-08).
- **Publishers** in `platforms/`: GitHub Pages, and Medium through it; `substack.js` and `youtube.js` are stubs that answer they are not built yet.
- An **embed build** that compiles the viewer into one JavaScript and one CSS file for any web page.

## Sites

post-pipe holds no one's site. A site is its own folder, usually its own repository, with a `settings.json`, a `feeds.opml` naming its sources (RSS, Atom, JSON, a local folder as `local://<path>`, or single pages), and optionally credentials, rtagz overrides and the `rtagz-ids.json` that keeps tag ids stable. `examples/site/` is a complete, annotated site that reads two public feeds, ScienceDaily and ProPublica, so a fresh clone builds it and shows a graph without data of its own; that build fetches those two feeds over the network, and when it cannot, shows the copy of each the example ships (an outline's `savedCopy` names a feed's saved copy in the site). The full shape is in `docs/SITES.md`.

Each `<outline>` in `feeds.opml` is one source, and its `type` says what its `xmlUrl` is:

- `rss`, `atom`, `json` — a feed at that address. With no `type`, a feed is assumed and its kind inferred.
- `local` — a folder of pieces, as `local://<path>`.
- `page` — one article's address. At build that one page is fetched and read: its title, author and date where the page marks them up, its canonical link, its tags (`article:tag`, `meta keywords`), and its main text by a plain readability pass. It becomes one item whose source is the entry's title, and lands in the graph beside whatever shares its tags. Nothing is fetched that the file does not name, except, as for every source whose outline sets no `customColor`, its site's home page once for its colour (its `theme-color`) until that colour is cached.
- `pages` — a local text file (a path like `local`'s) listing such addresses one per line; blank lines and lines starting with `#` are skipped. Each address is one item under the entry's title; a page that fails is left out of that build with a warning.

The `+` in the top bar takes an address: when it leads to a feed, it shows the feed line to add, as before; when it answers with a page that names no feed, it shows the `page` line instead (and `node add-feed.js <url> --type=page` to add it).

```bash
npm install
POSTPIPE_SITE=~/path/to/your-site node generate-index.js
npx serve ~/path/to/your-site/_site
```

The build writes `_site/` inside the site's folder. Without `POSTPIPE_SITE` the example site is built, into `examples/site/_site/`.

## Publishing a piece

```bash
node index.js medium --login              # Medium needs no login: this says what it needs
node index.js medium article.md           # a draft, the default
```

Platforms: `medium`, through GitHub Pages: the piece is pushed to the site's GitHub Pages repository, then a browser opens Medium's "Import a story" with that address. `substack` and `youtube` are accepted and answer that they are not built yet; `--publish` is read, and no platform acts on it yet. Credentials (`GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`) are read from the site's `auth/.env` first, then the engine's.

## Embedding the viewer

`npm run build:embed` writes `dist-embed/post-pipe.embed.js` and `post-pipe.embed.css`. A host page needs a container, the two files, and one call:

```html
<link rel="stylesheet" href="dist-embed/post-pipe.embed.css">
<div id="viewer" style="width:100vw;height:100vh"></div>
<script src="dist-embed/post-pipe.embed.js"></script>
<script src="tts.js"></script> <!-- optional, for text-to-speech -->
<script>
  PostPipe.init('#viewer', { feed: './feed.json' });
</script>
```

`PostPipe.init` takes an options object: `features` (switch off any of `readerPanel`, `tts`, `feedBar`, `addFeed`, `layoutControls`, `dimensions`, `undoRedo`, `colorSettings`, `configPanel` and `keyboardShortcuts`, each on by default), `theme` (`bg`, `surface`, `accent`, `text`, `text_bright`), and `persistence` (`localStorage`, `memory` or `none`) for how the viewer remembers a reader's arrangement. The easiest way to find the options you want is the ⚡ panel in the viewer itself, which can show the exact `PostPipe.init()` snippet for its current state.

## Tests

```bash
npm test                                            # the engine
node --test flow/test/*.test.js                     # flow
cd rosetta-tagz && node --test test/*.test.js       # rosetta-tagz
```

## Licence

post-pipe is free for creators and for non-commercial use under the [PolyForm Noncommercial License 1.0.0](LICENSE), with an [additional permission](COMMERCIAL.md) from its author: creative work is free, and commercial use is free until it brings in US$10,000 a year. Above that, or to sell or host post-pipe itself, open an issue titled "commercial licence". Fonts and icons it ships keep their own licences; see [THIRD-PARTY-LICENSES.md](THIRD-PARTY-LICENSES.md).

post-pipe is a work in progress. A platform built on it is coming.
