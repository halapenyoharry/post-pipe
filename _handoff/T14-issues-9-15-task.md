# T14 — Fix post-pipe issues #15, #9, #10, #14, #12, #13, #11 (in that order)

#post-pipe #iphone #containers #visibility
Read `CLAUDE.md` first and follow it. Read each issue with `gh issue view <n>` before starting it; the issue's "Done means" is the acceptance test.

## ABSOLUTE RULES

- **Work only in `~/Projects/post-pipe`.** Do not touch `~/Writing` (the manuscript) or `~/Projects/epicofelinorjones.com`.
- **Engine stays content-agnostic.** No novel-specific names, paths, or values in engine code. Anything a site might want different is a setting in `settings.json` with a sensible default.
- **One commit per issue**, message describes the change and ends with `Refs #<n>`. Do not use `Fixes`/`Closes`. Author is whatever git is configured with; do not change git config. **Do not push.**
- `npm test` passes after every issue. Add tests where the behavior is testable in Node.
- Do not end your turn after reading files, and do not stop after one issue. Keep going through all seven, then rebuild and report.

## Order and specifics

1. **#15 Visibility flag.** Front-matter field `posted` (accepts `yes`/`no`/`true`/`false`). When absent, use `settings.visibility.default` (engine default: `public`, so existing sites are unchanged). Hidden items leave no node, page, feed entry, edge, search entry, or version map in the output. Tests for both states and for the default.
2. **#9 iPhone node tap.** Opening a node in the reader pushes a history entry (existing `#read=<id>&p=<n>` hash); `popstate`/`hashchange` restores graph or reader. Back returns to the graph at the same view; Forward reopens the reader at the same paragraph. On narrow screens the reader must actually render (find why it goes blank on iPhone Safari: check viewport units, fixed positioning, overflow, and any hover-only handlers).
3. **#10 Bottom controls overlap.** Layout that holds from 320 px to tablet, portrait and landscape, respecting `env(safe-area-inset-bottom)`. No per-device magic numbers.
4. **#14 Touch collapse.** Tap on a container label toggles collapse, with a movement threshold so drag still works. Gesture configurable: `settings.graph.collapseGesture` = `tap` | `doubletap`, default `tap`. Avoid conflict with iOS double-tap zoom (`touch-action`).
5. **#12 Container spacing.** Reduce default separation between sibling containers; expose it as `settings.graph.containerSpacing`.
6. **#13 Container labels.** Tighter letter spacing, larger; font size scales with container extent between `settings.graph.labelSize.min` and `.max` (replaces fixed 64/52 px); long labels wrap onto centered lines and stay centered through layout and collapse.
7. **#11 Control panel pop-out.** One panel component, openable from both the reader and the graph view, same state in both; usable on phone and desktop.

**Mobile design is still being decided with Harold.** Where a visual choice isn't dictated by the issue, pick the plain option, put the value in settings, and list the choice in the report so it can be revisited.

## Finish

- Rebuild all three bundles: `npm run build`, `npm run build:lib`, `npm run build:embed`. Commit `dist*/` as its own commit (`Rebuild dist after #9–#15`).
- Write `_handoff/T14-report.md`: per issue, what changed, files, tests added, settings introduced with defaults, and anything not done or uncertain (especially what could only be verified on a real iPhone).
