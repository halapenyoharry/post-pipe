Task: finish resolving an in-progress git merge by editing files. Branch `fix/feedz-toast-and-cli-add` is being merged into `main`. Read `_handoff/HANDOFF-2026-09-26.md` first.

You have NO shell access. Do not try to run any command. Only read and edit files. Harold's operator runs all git and build commands after you finish.

For every file below, the two sides are saved in `_handoff/merge-sides/`, with `/` in the path replaced by `_`:
- `<name>.MAIN` = the `main` version
- `<name>.FIXBRANCH` = the `fix/feedz-toast-and-cli-add` version
- `<name>.BASE` = their common ancestor (when it exists)
Compare against BASE to see what each side changed.

Edit only these working files. Do not edit any other file (the `dist/` folder is rebuilt later; never touch it).

Group A — contain conflict markers. Replace every conflict (`<<<<<<<` … `=======` … `>>>>>>>`) with code that keeps the changes from BOTH sides:
1. `generate-index.js`
2. `src/components/GraphViewer/GraphViewer.jsx`
3. `src/components/TTS/TTS.jsx`
4. `tts.js` — keep the Kokoro server backend from `main` AND the browser-voice fallback improvements from the fix branch. Browser voices are used when the Kokoro server is not available.

Group B — no conflict markers, but the working file may be missing one side's changes. For each, check that every change MAIN made relative to BASE and every change FIXBRANCH made relative to BASE is present in the working file. Add anything missing. If both sides are already fully present, leave the file unchanged.
5. `src/components/NodeView/TextView/TextView.jsx`
6. `src/components/TTS/TTS.module.css`
7. `src/index.jsx`
8. `kokoro-worker.js` — currently identical to MAIN. There is no BASE (both sides added it). Add any code that exists only in FIXBRANCH and is not already covered.

Done means: none of the 8 files contains a line starting with `<<<<<<<`, `=======`, or `>>>>>>>`, and every file is syntactically valid.

Then write `_handoff/T1-merge-report.md` containing, for each of the 8 files: what MAIN contributed, what FIXBRANCH contributed, and how you combined them (one to three lines each). List anything you could not resolve under a heading UNRESOLVED.
