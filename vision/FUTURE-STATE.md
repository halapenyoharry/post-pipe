# post-pipe — Future State Dreaming

> Captured live as Harold speaks. Near-verbatim. Themes grouped as they emerge; connections preserved. Not a roadmap. Not prioritized. Holds contradictions.

> **Status (2026-05-12), reconsidered and preserved.** The dream remains intact as written. Its ideas have been decomposed into stack-agnostic structural layers in [[DECOMPOSITION]]. Use that document for architectural decisions. Use this document to remember what the dream wanted to be, before any tool was named. The two are companions, not replacements. Sections #9 (existing topology engines) and the deferred section #7 are explicitly **not** decomposed there, the first because it is stack-leaning by design, the second because it remains parked.

---

## Stance

This document is dreamt with a Claude instance acting as **future-state dreaming agent** — explicitly unbound from the basis a public-company CEO is forced to project onto: return on invested capital, defensibility, market fit, quarterly growth. Those constraints aren't bad — they're a fixed basis (cf. [#8](#8-little-matrices-vectors-in-hilbert-space)). But a fixed basis pre-collapses the state vector before anything can be imagined. It produces predictable software for the same structural reason an algorithmic feed produces predictable scrolling.

The job here is to hold the topology open. Possibilities that survive the shareholder filter are a thin slice; this document is the rest of the slice.

This is not a roadmap. It will not be screened for fundability, monetization, or defensibility. If a section reads as commercially unviable, that is a feature, not a defect — it means the basis is genuinely different.

---

## Index

1. [Information has hidden vectors](#1-information-has-hidden-vectors)
2. [The 2D ceiling](#2-the-2d-ceiling--what-thread-is-missing)
3. [3D infinite-zoom information cosmos](#3-3d-infinite-zoom-information-cosmos)
4. [User-built HUD / lenses / custom topology overlays](#4-user-built-hud--lenses--custom-topology-overlays)
5. [Control tiles, not a control panel](#5-control-tiles-not-a-control-panel)
6. [Flows as the invariant — personal infeed](#6-flows-as-the-invariant--personal-infeed)
7. [Deferred: building your own topology in your part of the world](#7-deferred-building-your-own-topology-in-your-part-of-the-world)
8. [Little matrices, vectors in Hilbert space](#8-little-matrices-vectors-in-hilbert-space)
9. [Standing on shoulders — let existing topology engines carry weight](#9-standing-on-shoulders--let-existing-topology-engines-carry-weight)

---

## 1. Information has hidden vectors

> "Information, a bit? a blurb, a meme? a watt? a — however we measure one of the things — has a vector or vectors, and we only see a few of them because of the limits of our biology and perhaps this level of decohered existence."

Open questions Harold raised:
- What **is** the unit? Bit, blurb, meme, watt — the unit is itself undecided.
- The thing has **multiple vectors**. We perceive a projection; the rest is invisible to us.
- Limits are **biological** and possibly **decoherence-level**.

Implication for the app: surface the hidden vectors. Make the unseen dimensions of an information object visualizable, even if our biology can only sample a few at a time.

→ connects to [#2](#2-the-2d-ceiling--what-thread-is-missing) (why 2D fails — too few vectors representable)
→ connects to [#3](#3-3d-infinite-zoom-information-cosmos) (3D physics-like space gives more vector room)

---

## 2. The 2D ceiling — what thread is missing?

> "I've reached the limit of what I can do with AI and a 2D surface topology."

Harold's three hypotheses for what's missing — held simultaneously, not narrowed:

- **Thread / musical phrasing.** Like how you *phrase* music — the connective tissue, the legato between notes. Maybe info objects need a phrasing layer, not just nodes and edges.
- **The schema.** Maybe the underlying data model is too thin to support what wants to emerge.
- **AI doesn't actually know how information works.** We assume it does. Maybe we have to *teach* AI how information works rather than assume comprehension.

→ "phrasing" is a candidate for a first-class concept (not yet in the schema).
→ connects to [#1](#1-information-has-hidden-vectors) — phrasing might *be* one of the hidden vectors.

---

## 3. 3D infinite-zoom information cosmos

> "Infinite zoom fractal-like structures in a three.js-like scene. I see this cloud, zoom in and it's an RSS feed, pretty organized looking. I zoom past to a more weird-looking cloud and I realize it's a branch from Tumblr about something or other. Like planetary bodies of information all following the physics laws (that make it available to us), and you can show the connections."

Concrete properties of the dream:
- **3D scene**, Three.js-like.
- **Infinite zoom** — fractal scale, no fixed altitude.
- **Source = visual character.** RSS feed reads as "pretty organized"; Tumblr branch reads as "weird-looking cloud." The substrate's *vibe* renders.
- **Planetary bodies metaphor.** Information objects have mass, orbits, gravitational relationships. Physics laws are the *rendering grammar* — they're what make the information legible to us.
- **Connections shown** between bodies.

→ connects to [#4](#4-user-built-hud--lenses--custom-topology-overlays) — physics is one rendering grammar; users can swap in others (castle, waterfall).

---

## 4. User-built HUD / lenses / custom topology overlays

> "You could build your own connection viewers, so like the user can build their own HUD for navigating information, lenses, overlay their own topology, stuff like that. The user isn't only limited to my topological vision of how information should be displayed. If we build well then the data can become anything: a bustling medieval castle, a waterfall system…"

Key principle: **Harold's topology is one possible rendering, not the canonical one.** The data layer must be expressive enough that other people can render it as a castle, a waterfall, a forest, a city — whatever their cognition wants.

Implications:
- Strict separation: data model ↔ rendering grammar.
- Renderers are **pluggable** and **user-authorable**.
- "Lenses" = transformations layered on the same data.
- "Overlay your own topology" = the user's mental model becomes a first-class artifact that can be saved, shared, swapped.

→ connects to [#7](#7-deferred-building-your-own-topology-in-your-part-of-the-world) — this scales to multiplayer, but parking that.

---

## 5. Control tiles, not a control panel

> "The HUD is key — so instead of a control panel like we have now, you could have a control tile that has the simple in-browser audio features, then there is another one that does Gemini TTS narration, another one that uses Gemini TTS to create an experience."

The current reader's monolithic toolbar dissolves into **modular tiles**. Each tile is a small composable unit:

- **Tile: simple in-browser audio** — Web Speech API, the baseline.
- **Tile: Gemini TTS narration** — straight read-aloud with a better voice.
- **Tile: Gemini TTS experience** — narration + something more (ambient, multi-voice, scoring, scene?). The "experience" is intentionally fuzzy.
- **(implied) Tile: …** — anyone can add a tile.

→ connects to [#6](#6-flows-as-the-invariant--personal-infeed) — tiles are how flows manifest in the UI.

---

## 6. Flows as the invariant — personal infeed

> "The invariant becomes your flows for creating experiences and adding them to your own personal infeed — the thing you control, for you, to intake linear information in an audible and video format."

The stable thing across the whole system isn't the topology and isn't the renderer — it's **the user's flows**. A flow:
- transforms information objects into **experiences** (audio, video, narration, ambient mix);
- routes them into a **personal infeed** — Harold's own curated linear stream;
- gives him **control** over his own intake, in his preferred substrates.

The infeed is **linear and substrate-rich** (audio + video), even though the source space is N-dimensional and topological. Linearity is *for consumption*; topology is *for navigation*.

→ this resolves a tension: how do you read/listen-through an N-dimensional cosmos? You don't. You compose flows that linearize slices of it for you.

---

## 7. Deferred: building your own topology in your part of the world

> "All the while you can use another widget to create your topology in your part of the world, or something. That part hurts to think about, but we'll get there, someday."

Flagged and parked. The shape of it: shared/multi-user topology space, where users author topology in their own region and others can visit, overlay, or fork. Not for now.

---

## 8. Little matrices, vectors in Hilbert space

> "Jesus, are we building the matrix? Little matrices with vectors in Hilbert space maybe."

Mid-session recognition: the structure underneath the dream has a real math shape. Not as decoration — as the actual scaffold.

*(Math elaboration below is Claude's, in response to Harold's prompt. Harold's intuition is the load-bearing part; the formalism is just naming what was already there.)*

**The shape:**

- Each information object is a **state vector** in a high-dimensional feature space. Dimensions: substrate, topology, energy, time, phrasing-signature, connections, age, heat, and many more we haven't named yet — including ones we can't perceive ([#1](#1-information-has-hidden-vectors)).
- LLM embeddings already live in this kind of space. That part isn't new. Every modern semantic-search system is quietly doing vectors-in-high-dim.
- **What's new in Harold's framing:** the user picks the basis. A **lens is a projection operator** — it takes the full state vector and projects it onto a chosen subspace, which is what you actually see. The unmeasured dimensions are still there, just unobserved.
- **Inner product → similarity.** The angle between two pieces is how related they are. Orthogonal pieces aren't *far apart* — they're *unrelated*, which is a different thing. (Current 2D layouts conflate distance and unrelatedness; this is part of the [2D ceiling](#2-the-2d-ceiling--what-thread-is-missing).)
- **Superposition.** A piece can be drafted-and-bloomed-and-scattered at once until you measure it through a status lens. The status isn't a fact about the piece — it's a fact about the lens you observed it through.
- **The HUD ([#4](#4-user-built-hud--lenses--custom-topology-overlays)) is the measurement apparatus.** Different users decohere the same cosmos into different observables. Two people looking at the same corpus through different HUDs are not seeing different *renderings* of the same view — they are making different *measurements*, and getting genuinely different states.

**Closes the loop with [#1](#1-information-has-hidden-vectors):**
Harold's opening line — *"this level of decohered existence"* — wasn't decorative. He was already reaching for the quantum framing in the first sentence of the session. The hidden vectors are the unmeasured dimensions. Biology is one fixed basis we can't escape; the algorithmic feed is **a dictatorship of one fixed basis pretending to be reality.** The whole project is: let people choose their own basis.

**What this implies for the schema:**
- The data model needs to be expressive enough to *hold* dimensions we don't yet have lenses for. Don't bake the lens into the data.
- Lenses are first-class artifacts (saveable, shareable, forkable).
- The same piece, observed through two lenses, may legitimately have different observables. The system should not try to reconcile them.

→ connects to all prior themes; this is the math-shaped backbone underneath them.

---

## 9. Standing on shoulders — let existing topology engines carry weight

> "What if we aren't being easy enough on ourselves about this, and allow tools that already do topology help us — like Mapbox?"

Mid-session course correction. Up through #8, the dream has been pure math + pure imagination — building everything from primitive geometry. This section grounds it: most of what the dream needs **already exists**, in a domain that has been doing topology for decades — geographic mapping. The match is so close it stops being metaphor.

**Mapbox GL JS / MapLibre GL (open fork) maps onto our framework cleanly:**

| Dream concept | Mapbox / MapLibre primitive |
|---|---|
| Hidden vectors that decohere at zoom ([#1](#1-information-has-hidden-vectors)) | **Vector tiles** — multi-attribute features that surface at different zoom levels by design |
| Lens / projection operator ([#8](#8-little-matrices-vectors-in-hilbert-space)) | **Style layer** — declarative spec for how a source decoheres into pixels |
| User-chosen basis / HUD ([#4](#4-user-built-hud--lenses--custom-topology-overlays)) | **Custom map style** — saveable, shareable, forkable; Mapbox Studio is a lens authoring tool |
| Infinite zoom cosmos ([#3](#3-3d-infinite-zoom-information-cosmos)) | Native — tiled rendering at any zoom |
| Planetary bodies ([#3](#3-3d-infinite-zoom-information-cosmos)) | `projection: 'globe'`, literally |
| Layout vs paint separation | Built in: `layout` = placement, `paint` = fine-grained style |
| Substrate as character ([#3](#3-3d-infinite-zoom-information-cosmos)) | The same data renders as parchment, satellite, dark, isometric, sketch — style determines character |
| Cosmos with overlays ([#4](#4-user-built-hud--lenses--custom-topology-overlays)) | Layer slots — drop overlays above land, below labels, etc. |
| Camera as measurement apparatus ([#8](#8-little-matrices-vectors-in-hilbert-space)) | `center` / `zoom` / `bearing` / `pitch` are the four measurement parameters |
| Substrate-agnostic input | Vector / GeoJSON / raster / image / video sources |
| Composable widgets ([#5](#5-control-tiles-not-a-control-panel)) | First-class plugin ecosystem (Turf.js for spatial ops, three.js for 3D models, Web Audio for ambient flow) |

**What this changes:** the dream is no longer "build a Three.js cosmos from scratch." It becomes "treat MapLibre as the rendering substrate for the geographic-style HUD, learn from its style spec (which already encodes the math from #8), and possibly host other HUDs on the same engine."

**Caveat that keeps the topology open:** using Mapbox does *not* mean the cosmos *has* to be a map. Geography is one HUD. The medieval castle, the waterfall system, Harold's graph are other HUDs. The point is the engine and the style-spec mental model are reusable beyond geography.

**Why MapLibre over Mapbox specifically (given the [Stance](#stance)):** MapLibre is the open-source fork of Mapbox GL JS made just before Mapbox switched to a proprietary license. No access token, no usage cap, no commercial dependency. Same API surface for the parts we'd use. Better aligned with the no-shareholder posture. Can swap to Mapbox later if a specific paid feature matters.

**Other shoulders worth knowing exist (not yet researched here):**
- **Deck.gl** — composable data layers, GPU-accelerated, designed to overlay on Mapbox/MapLibre. Maps directly to "layers as lenses."
- **Cosmograph** — GPU graph layout, for the graph-shaped HUD specifically.
- **Three.js** — still relevant for HUDs that don't fit a projected map (true-3D planetary bodies, fractal zoom not bounded by tile pyramids).
- **D3** — already in use; remains the right tool for bespoke 2D lenses and small custom visualizations.

Each is a different shoulder for a different kind of HUD. The job isn't to pick one — it's to recognize the dream can be **assembled from existing topology tools**, with custom code only where the dream genuinely has no precedent.

→ this is the first section about **practice**, not posture or vision. It earns its place by making the rest feel buildable without betraying it.

---

## Open threads (raised but not resolved)

- What is the unit of information? (#1)
- Is "phrasing" a first-class concept the schema needs? (#2)
- Does AI need to be *taught* how information works rather than assumed-fluent? (#2)
- What separates a *narration* from an *experience*? (#5)
- What's the minimum viable data model that can render as both Harold's graph **and** a medieval castle? (#4)
