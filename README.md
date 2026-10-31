# post-pipe

An engine for reading a collection as a graph instead of a feed. Point it at a folder of writing and any number of published feeds, and it builds a static site where every piece is a card in a force-directed graph, tagz hold the cards together, and clicking a card opens it in a reader with text-to-speech. Scrolling is one of the ways to meet a body of work; this is another.

post-pipe is also the publishing route for the writing it holds: a piece can go out to Medium, Substack, YouTube or GitHub Pages from the same folder it is read from.

## What's in the repository

- The **engine**: `generate-index.js` reads a site's sources, runs them through rosetta-tagz if the site asks, and writes `_site/` (a `feed.json` and the viewer). `add-feed.js` and `update-index.js` tend a site's sources. `ARCHITECTURE.md` describes the content model.
- The **viewer**: a React and D3 graph in `src/`, with cluster and ring layouts, a reader panel, tagz with adjustable depth, and a settings panel. What a tap, double tap, drag or long press does is a table a site can rewrite without touching code; see `docs/ACTIONS.md`.
- **rosetta-tagz** (`rtagz` for short), in `rosetta-tagz/`: the part that reads each source's own tag vocabulary and translates them into one, keeps every source's spelling visible, lets untagged items earn tagz from their text, and keeps each tag's id stable from one build to the next. It has its own programs, docs and tests, and post-pipe reaches it only through its programs. The contract is `docs/POST-PIPE-USES-RTAGZ.md`.
- **Publishers** in `platforms/`: Medium, Substack, YouTube and GitHub Pages.
- An **embed build** that compiles the viewer into one JavaScript and one CSS file for any web page.

## Sites

post-pipe holds no one's site. A site is its own folder, usually its own repository, with a `settings.json`, a `feeds.opml` naming its sources (RSS, Atom, JSON, or a local folder as `local://<path>`), and optionally credentials, rtagz overrides and the `rtagz-ids.json` that keeps tag ids stable. `examples/site/` is a complete, annotated site of five invented pieces; a fresh clone builds it. The full shape is in `docs/SITES.md`.

```bash
npm install
POSTPIPE_SITE=~/path/to/your-site node generate-index.js
npx serve _site
```

Without `POSTPIPE_SITE` the example site is built.

## Publishing a piece

```bash
node index.js medium --login              # once per platform
node index.js medium article.md           # draft, the default
node index.js substack --publish article.md
```

Platforms: `medium`, `substack`, `youtube`. Credentials are read from the site's `auth/.env` first, then the engine's.

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

`PostPipe.init` takes an options object: `features` (switch off the reader, TTS, feed bar, layout controls, undo, colour settings or the settings panel individually), `theme` (`bg`, `surface`, `accent`, `text`, `text_bright`), and `persistence` (`localStorage`, `memory` or `none`) for how the viewer remembers a reader's arrangement. The easiest way to find the options you want is the ⚡ panel in the viewer itself, which can show the exact `PostPipe.init()` snippet for its current state. The embed build also writes a working demo at `_site/embed.html`.

## Tests

```bash
npm test                                            # the engine
cd rosetta-tagz && node --test test/*.test.js       # rosetta-tagz
```

## Licence

post-pipe is free for creators and for non-commercial use under the [PolyForm Noncommercial License 1.0.0](LICENSE), with an [additional permission](COMMERCIAL.md) from its author: creative work is free, and commercial use is free until it brings in US$10,000 a year. Above that, or to sell or host post-pipe itself, open an issue titled "commercial licence". Fonts and icons it ships keep their own licences; see [THIRD-PARTY-LICENSES.md](THIRD-PARTY-LICENSES.md).

post-pipe is a work in progress. A platform built on it is coming.
