# CLAUDE.md

Guidance for Claude Code in this repository. This file holds rules and pointers only. It does not describe the architecture: a description kept here went stale while the engine moved on, and every session that trusted it started wrong (corrected 2026-10-22). The code, the tests and the documents below are canonical. When they disagree with anything written elsewhere, they win.

## Read first

- `README.md` — what post-pipe is, in its current voice.
- `ARCHITECTURE.md` — what is built. Check its date against the code before relying on a detail.
- `vision/DECOMPOSITION.md` — the layer vocabulary (Exoskeleton, Bundle, Corpus, Lens, Renderer, Tile and Panel, Flow, Infeed). `vision/` also holds FUTURE-STATE, VIEWS and JSON-TREES.
- `docs/` — contracts. `docs/ACTIONS.md` names the graph's actions and gestures; `docs/STONE-SEAM.md` is the tag-translation seam (2026-10-22).
- `package.json` — the commands. `npm test` runs the suite in `test/`. `npm run build`, `build:lib` and `build:embed` make the three bundles (`dist/`, `dist-lib/`, `dist-embed/`), which are committed after engine changes, in their own commit, "rebuilt the three bundles".
- `TCP.json` — the collaboration protocol.
- `_handoff/` — task briefs and reports, T1 onward, the recent history of why things are the way they are. Local only: git ignores it, so a fresh clone lacks it.

## Rules

1. **The engine stays content-agnostic.** Nothing specific to one site or corpus (names, tags, colours, authors, chapter lists) goes in here. It goes in that site's `settings.json`. A site is a folder holding `settings.json` and `feeds.opml`, built with `POSTPIPE_SITE=<folder> node generate-index.js`.
2. **Emergence.** A node exists because a file or a feed item exists. The engine never synthesizes content.
3. **Prose rule.** Never write, alter or correct prose of The Epic of Elinor Jones, in any file, for any reason.
4. **Nothing leaves this Mac without Harold.** No push, deploy, server, or GitHub change unless he asks for that specific action.
5. **No deleting without a backup.** Git history or an archive tag counts.
6. **Commits are Harold's.** Author `halapenyoharry`, never Claude or any AI name, no co-author or AI trailers. Messages in the repo's voice: lower-case, first person, plain, saying what changed. On `main`, pause and ask before committing.
7. **Humans name things.** Use the names already in the code and docs. When something has no name, describe it plainly and ask Harold.
8. **Design is Harold's.** Implement what he hands over. If a visual decision is unavoidable, describe the options and build the plainest.
9. **Metadata is a gradient, not a gate.** Never refuse to show a piece because it lacks metadata.
10. **Least-interfering TTS highlighting.** Ambient confirmation, never wayfinding.
11. **No network beyond the feeds a site lists.** Nothing fetches at build or run time except what `feeds.opml` names, and no CDNs.
12. **Add before you override (Harold, 2026-10-25).** When Harold says "change this to that" about something that works but is not perfect, first ask whether it should be a new option, feature or view beside the existing one rather than a replacement, and name the choices. He says "add a blur shadow to the toolbar so a node under it shows"; answer "we can add that as a choice: blur shadow, darker shadow, no shadow" and let him pick. A working thing is only overridden when he says so after seeing the options.

## Neighbours

- `rosetta-tagz/` is its own git repository nested here. post-pipe's tracked gitignore does not mention it; the local `.git/info/exclude` does, so a fresh clone of post-pipe lacks it and builds must work without it. post-pipe never imports its `lib/`; it calls its programs through the contract in `docs/STONE-SEAM.md`.
- With no `POSTPIPE_SITE`, every script uses the made-up example site in `examples/site/`, which also holds the notes explaining each setting. No user's site lives in this folder.
- `~/Projects/haroldyounghumxn.site` is Harold's own site, a downstream user of this engine like the novel's. The phone preview service (`com.harold.postpipe-preview`, port 8891, all interfaces) serves its `_site/`.
- `~/Projects/epicofelinorjones.com` is a site built on this engine. Its build script requires this checkout directly, or the one `POSTPIPE_ENGINE` names. Engine changes made for that site belong here, on `main`.
- `~/Posts/` is Harold's own corpus. It is loaded when a site's `feeds.opml` lists it as `local://~/Posts`.
