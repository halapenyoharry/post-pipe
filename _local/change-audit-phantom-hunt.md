---
title: Change Audit — the phantom hunt
status: open
expires: when each row below has a verdict and the harness assertion is changed
---

#audit #rendering #webkit #graph-viewer
Related: [[card-paint-fix-and-layer-refactor]] · [[GraphViewer]] · [[webkit-harness]]

## Why this document exists

Several changes were shipped while chasing a bug that turned out to be a paint
failure, not a layout failure. None of them could have fixed the reported
symptom. Some of them are good anyway. The risk is that they survive by
inertia — present in the code, unexamined, credited to a fix that never
happened.

Each change gets a verdict on its own merit, with no reference to the bug it
was aiming at.

The second half of this document is about the instrument, which is the more
durable problem.

---

## The changes

Fill in the rows marked `unverified`. The list is drawn from the debugging
transcript and is probably incomplete — anything else touched during those
hours belongs here too.

### 1. Unpinning fix

**What it does:** releases pinned node positions so a restored arrangement can
re-settle instead of staying locked.

**Independent merit:** real. A stuck pile is a genuine failure mode, and the
seeded-localStorage run demonstrated the heal directly — piled arrangement in,
0 overlapping pairs and a 4160×3992 spread out.

**Verdict:** keep. This is the one change with its own evidence.

**Caveat:** the evidence is geometric, not visual, like everything else from
that session. It shows the simulation resolves. That is the claim being made,
so the evidence fits.

---

### 2. `fitToViewport` scale floor (`MIN_SCALE = 0.2`)

**What it does:** clamps zoom-to-fit so the graph cannot shrink below k=0.2.

**Independent merit:** the constant was chosen arbitrarily and is now known to
produce an unusable result — a 180×140 card at k=0.2 is a 36×28 rectangle with
text too small to read. At 375×739 with ~100 articles, fit-to-viewport will
land near this floor every time.

**Verdict:** the floor stays, the number is wrong, and the real answer is not a
number. See the level-of-detail section in
[[card-paint-fix-and-layer-refactor]]. Below a threshold, a card should become
a different representation, not a smaller card.

**Open:** whether fit-to-viewport should even target *all* nodes on a narrow
viewport, or frame a neighbourhood and let the rest sit off-screen.

---

### 3. Median centering

**What it does:** centers the initial view on the median article position
rather than the mean or the bounding-box center.

**Independent merit:** plausible on its own terms — median resists outliers, so
one stray node far from the cluster no longer drags the whole frame off. That
is a real property, independent of any bug.

**Verdict:** `unverified`. Cheap to settle: seed an arrangement with two or
three deliberate outliers, compare framing with median vs. bounding-box center,
keep whichever puts more nodes on screen.

---

### 4. `anyRestored` gate

**What it does:** branches behaviour on whether any node positions were
restored from localStorage.

**Independent merit:** `unverified`, and this one carries the most risk of the
set. A gate that changes layout behaviour based on stored state creates two
code paths that are hard to hold in mind at once, and the fresh-profile vs.
seeded-profile divergence in the WebKit runs is exactly the kind of thing such
a gate produces.

**Verdict:** needs a stated purpose before it stays. If the purpose is "don't
re-run the expensive initial layout when we already have positions," that is
legitimate and should be commented as such. If it was added to suppress a
symptom, remove it.

---

### 5. Anything else from that session

`unverified` — list it here. The test for each is the same: state what the
change does without mentioning the bug. If that sentence cannot be written, the
change was symptom suppression and comes out.

---

## The instrument

This is the part worth keeping past this bug.

For several hours the question was "do the cards appear where they should" and
the measurement was `getBoundingClientRect()`. Those are different questions.
`getBoundingClientRect()` reports what the layout engine computed. It returns
the same correct numbers for a card that paints perfectly and for a card that
paints nothing at all. Every green light in that session was a proxy for the
actual question, and the proxy was structurally incapable of failing.

The first WebKit run is the clearest case: *"102 articles, 0 overlapping pairs,
`scale(0.2)` applied, no errors"* — a fully blank screen would have produced
identical output.

### What changes

The WebKit harness is the asset that came out of the session. Its assertions
need to move from geometry to paint:

- **Pixel sampling.** For a sample of cards, read the actual rendered pixel at
  the expected center. A card that paints has non-background color there.
- **Screenshot diff** against a known-good reference at the same viewport, DPR
  and seed.
- **Both profiles.** Fresh localStorage *and* seeded, since they demonstrably
  diverge.
- **Keep the geometry assertions**, but label them as what they are. They
  answer "did the simulation resolve," which is a real question with its own
  value — just not this one.

### The general rule

Before trusting a measurement, name the failure it can detect. If a measurement
cannot distinguish "working" from a specific plausible failure mode, it is not
evidence about that failure mode.

---

## Reverting to the last working version

Considered and argued against.

The paint failure predates the changes and lives at the SVG/HTML seam.
Reverting would discard the unpin fix, which is independently verified and
addresses a real failure mode, while leaving the actual cause untouched. The
useful instinct inside that idea is the one this document serves: stop letting
changes inherit credibility from a fix that did not occur.
