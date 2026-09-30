# T15 — Hide Acts 2 and 3 for real; finish #15; redo #11

#post-pipe #visibility #launch
Read `~/Projects/post-pipe/CLAUDE.md` first. Follows T14 (`_handoff/T14-report.md`).

## ABSOLUTE RULES

- **Never edit anything in `~/Writing`.** The manuscript and its front matter are Harold's. Hiding happens in the site build, not in the text.
- Work in `~/Projects/post-pipe` (engine) and `~/Projects/epicofelinorjones.com` (site) only. Engine stays content-agnostic: no novel names or paths in engine code.
- One commit per part, in the repo it belongs to; message describes the change, ends `Refs #<n>` for engine issues. Do not change git config. **Do not push. Do not deploy.**
- `npm test` passes in post-pipe after every engine commit.
- Do not end your turn after reading files, and do not stop after one part. Keep going through all four, then verify and report.

## 1. Engine: #15 complete (post-pipe)

T14 put the filter in `LocalFolderAdapter` with a setting named `visibilityDefault`. Make it complete:
- Setting shape `settings.visibility.default` (`public` | `hidden`, engine default `public`); keep `visibilityDefault` working as a fallback alias.
- A hidden item leaves **no trace** anywhere in output: no node, page, feed item, edge (both directions), container member count, timeline entry, search entry, version map, commits-dimension entry, or link from a visible page. Container counts shown in labels must count visible members only.
- Tests: a fixture with a visible and a hidden item linked to each other; assert the hidden one is absent from every output artifact.

## 2. Site: publish Act 1 only (epicofelinorjones.com)

- In `settings.json`, a site setting listing which acts are public (e.g. `"publishedActs": ["ACT1"]`).
- In `scripts/build.js`, when assembling `_build/content/`, write `posted: no` into the **assembled copies** of chapters from unlisted acts. The source files in `~/Writing` stay untouched.
- Rebuild the site (`node scripts/build.js`).
- **Verify with grep on `_site/`:** no `eoej-a2`/`eoej-a3` files; no Act 2 or Act 3 chapter titles, ids, or slugs in `feed.json`, `index.html`, or any page; no `<!--` planning comments; the book container shows 11. Put the grep commands and their output in the report.

## 3. Engine: #11 redone (post-pipe)

T14 built "open the panel in a new browser window." That's wrong for phones. Replace it:
- The control panel opens **over the page**, from both the graph view and the reader, one component, same state.
- Narrow screens (coarse pointer or width ≤ 600 px): a bottom sheet that slides up, respects `env(safe-area-inset-bottom)`, dismisses by tapping outside or swiping down.
- Wider screens: a floating panel anchored near its button.
- Remove the new-window code path.

## 4. Report

`~/Projects/post-pipe/_handoff/T15-report.md`: per part, what changed, files, tests, settings with defaults, the `_site/` verification output, and anything uncertain or only testable on a real iPhone.
