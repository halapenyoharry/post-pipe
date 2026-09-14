---
title: Card paint fix — diagnostic, then layer refactor
status: open
expires: when Step 0 resolves and either Path A or Path B is complete
---

#refactor #rendering #webkit #svg #graph-viewer
Related: [[change-audit-phantom-hunt]] · [[GraphViewer]] · [[webkit-harness]]

## The symptom

In WebKit at 375×739 / DPR 3, article cards rendered inside `<foreignObject>`
paint at the untransformed SVG origin, stacked, at full unscaled size —
"**erse**" visible top-left behind the pill bar — while
`getBoundingClientRect()` reports each card correctly transformed and
distributed. Tag bubbles and topology, being native SVG `<rect>`/`<text>`,
transform and paint normally. Chromium renders the whole thing correctly.

The data was always right. Only the paint was wrong.

---

## Step 0 — the diagnostic that decides the scope

**Do this before any refactor.** It takes minutes against the harness that
already exists, and it decides between deleting one CSS property and
restructuring the render tree.

### Why the current conclusion is too strong

The stated conclusion was that WebKit does not honour ancestor `<g transform>`
when painting `<foreignObject>` HTML. If that were categorically true, every
SVG graph library with HTML nodes would be visibly broken on every iPhone, and
it would be among the most famous rendering bugs in the browser. WebKit has
real `foreignObject` defects, but not that one.

What was actually varied across the four experiments was *how the transform is
applied* — transform attribute, CSS transform, `viewBox`, translate-only. All
four failed identically, which rules out the transform mechanism. What was
never varied is **what is inside the card**.

### The signature

Correct geometry from `getBoundingClientRect()` combined with paint at the
untransformed origin is the signature of a descendant escaping its containing
block, or being promoted to its own compositing layer whose transform mapping
to the SVG ancestor is lost. In WebKit that promotion is triggered by a short
list of properties — all of which are plausible in a card that has a
"provenance glow."

### Test 1 — minimal card

Render one `<foreignObject>` at the same ancestor transform containing nothing
but an unstyled `<div>` with a text node. No classes, no styled-components, no
glow.

- **Paints in the right place** → the engine is fine. Go to Test 2. Path A.
- **Paints at origin** → the structural claim holds. Path B.

### Test 2 — property bisect

Reintroduce the real card, then remove these one at a time from the card
subtree, checking paint after each:

- `position: fixed` anywhere in the subtree
- `filter` (the glow is the prime suspect)
- `backdrop-filter`
- `mix-blend-mode`
- `will-change`
- `transform: translateZ(0)` or any 3D transform used for smoothing
- `contain` / `isolation`

The first removal that restores correct paint is the cause.

---

## Path A — one property

If Test 2 finds it: replace the offending effect with something that does not
trigger layer promotion.

- A `filter`-based glow becomes a `box-shadow` glow, or moves *out* of the
  foreignObject entirely and becomes an SVG element behind the card — which is
  arguably where the provenance glow belongs anyway, since it is a property of
  the link cluster rather than of the card.
- `will-change` / `translateZ(0)` used for smoothing: delete. They were
  optimizations, not requirements.

Then the level-of-detail work below still applies, and the refactor is not
needed.

---

## Path B — two-layer architecture

Only if Test 1 fails.

### The cheap form, not the expensive one

The version described in the debugging session — "derive each card's screen
position from the zoom transform" — means per-card math on every frame,
converted coordinates in every handler, and drag/resize rewritten. That is the
expensive implementation.

The cheap form applies the *same* transform once per layer and leaves every
card in graph coordinates:

```
<div class="stage">                   position: relative; overflow: hidden
  <svg class="links-layer">           position: absolute; inset: 0
    <g transform="translate(tx,ty) scale(k)">
      links, tag bubbles, topology, provenance glow
    </g>
  </svg>
  <div class="cards-layer">           position: absolute; inset: 0;
                                      pointer-events: none
    <div class="cards-transform">     transform: translate(Xpx,Ypx) scale(k);
                                      transform-origin: 0 0
      <article style="left:{x}px; top:{y}px">   position: absolute;
                                                pointer-events: auto
      ...one per card, positioned in GRAPH coordinates
    </div>
  </div>
</div>
```

Both layers consume the identical `{tx, ty, k}` from zoom state, so they stay
locked together with no per-card math anywhere.

### What this preserves

- Cards keep graph coordinates. No conversion in the render path.
- Drag math is unchanged — still graph-space deltas.
- Hit-testing is unchanged — cards are real DOM elements receiving real pointer
  events, which is *simpler* than foreignObject hit-testing, not harder.
- Links, tags, topology and glow stay SVG. Nothing about the visual language
  changes.

### What actually has to be touched

1. The card mount point — cards move out of `<foreignObject>` into the overlay.
2. Where the zoom transform is applied — one place becomes two, fed from one
   source.
3. Any handler that reads SVG client coordinates. This is the real work.

### The single-source rule for that third item

Every screen↔graph conversion goes through one pair of functions:

```js
const toGraph = (sx, sy) => ({ x: (sx - tx) / k, y: (sy - ty) / k });
const toScreen = (gx, gy) => ({ x: gx * k + tx, y: gy * k + ty });
```

If there is more than one place in the codebase that does this arithmetic, the
two layers will drift and the drift will look exactly like the bug just fixed.

### Known risks

- **Z-order.** Cards now sit above all SVG, always. If any link or highlight
  state needs to draw *over* a card, it needs its own layer above the cards, or
  it becomes a card-level style.
- **Text at fractional scale.** HTML text under `scale(k)` for non-integer k can
  blur. Affects legibility at mid-zoom, not correctness.
- **Node count.** ~100 absolutely-positioned divs is unremarkable. If this grows
  past a few hundred, virtualize by viewport bounds — straightforward in this
  structure, since bounds are known in graph coordinates.

### Precedent

This is what react-flow and most mature graph tools converged on, for exactly
this reason. It is not a departure from the core idea; it is the standard
resolution of the SVG/HTML seam, and it removes the whole class of interop
defects permanently.

---

## Level of detail — required either way

`MIN_SCALE = 0.2` is a separate real problem that was identified and then
dropped when the bigger finding arrived. Once paint is fixed, 375px wide with
~100 articles will still look wrong, and it will read as the fix having failed.

A 180×140 card at k=0.2 is 36×28 px of dark rectangle with unreadable text.
Tag bubbles stay legible at the same scale because they are brightly filled —
that contrast is the whole explanation for why the screen looked like
"tags only."

Make this an explicit representation decision rather than a clamp:

| scale | representation |
|---|---|
| k ≥ 0.6 | full card — title, excerpt, metadata |
| 0.35 ≤ k < 0.6 | title only, larger type, no excerpt |
| k < 0.35 | marker — filled dot or glyph, cluster-colored, no text; title on hover/tap |

Numbers are a starting point, to be set by looking at the render. The principle
is that below a threshold a card becomes a *different thing*, brightly filled
like the tags, rather than a shrunken version of itself.

---

## Verification protocol

Applies to every step above. See [[change-audit-phantom-hunt]] for why.

- Assert on **pixels**, not on `getBoundingClientRect()`. Sample the rendered
  color at each expected card center.
- Run **fresh and seeded** localStorage profiles — they demonstrably diverge.
- WebKit at **375×739, DPR 3, touch**, plus Chromium as control.
- Keep geometry assertions, labelled as answering "did the simulation resolve."

A result is not a fix until a pixel assertion passes in WebKit.
