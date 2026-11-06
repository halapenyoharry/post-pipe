# Third-party licenses

What the engine ships that others made, and the terms it ships under.

post-pipe's own code is harold young's, under [LICENSE](LICENSE) and [COMMERCIAL.md](COMMERCIAL.md). Everything listed here keeps its own licence.

## Fonts

In `fonts/`:

- Atkinson Hyperlegible: SIL Open Font License 1.1 (no copy of the text in `fonts/` yet).
- Nothing You Could Do: SIL Open Font License 1.1 (`fonts/NothingYouCouldDo-OFL.txt`).
- OpenDyslexic: SIL Open Font License 1.1 (`fonts/OpenDyslexic-OFL.txt`).

## Icons

`src/lib/icons.js` carries SVG bodies copied from Lucide (https://lucide.dev): undo-2, redo-2, rotate-ccw, tag, hourglass, settings, check, sliders-horizontal, x, link, arrow-left, arrow-right, bookmark, maximize-2, minimize-2, minus, move-horizontal, list, info, download. Drawn inline; no icon font, nothing fetched.

```
ISC License

Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

## Libraries bundled into the viewer

Added 2026-11-05. The viewer's bundles carry these libraries, so every page a build writes carries them too: `dist/post-pipe-components.umd.js`, `dist-embed/post-pipe.embed.js` and each generated `index.html` hold React, react-dom, scheduler and d3; `dist-lib/` holds d3 and leaves React to the page that loads it (`vite.config.lib.js`). The minified bundles do not keep the libraries' own notices, so this file is where they are.

- React 19.2.6, react-dom 19.2.6 and scheduler 0.27.0 (https://react.dev): MIT License, Copyright (c) Meta Platforms, Inc. and affiliates.
- d3 7.9.0 and the d3 modules it gathers (https://d3js.org): ISC License, Copyright 2010-2023 Mike Bostock.

React, react-dom and scheduler:

```
MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

d3:

```
Copyright 2010-2023 Mike Bostock

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
```

The other packages in `package.json` run at build or publish time and are not shipped in a page.

## rosetta-tagz's viewer

`rosetta-tagz/vendor/` holds 3d-force-graph (MIT, Copyright (c) 2017 Vasco Asturiano) and three.js (MIT, Copyright © 2010-2026 three.js authors) for rosetta-tagz's own viewer, each with its licence beside it there (`LICENSE.3d-force-graph`, `LICENSE.three`).
