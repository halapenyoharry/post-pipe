# post-pipe — Architectural Decomposition

#post-pipe #architecture #vision #decomposition #negentropy

**Last updated:** 2026-05-12 (revised same day, additions for Layer 0 Exoskeleton, Bundle relaxations, Layer 2 edges-first and Rosetta stone, Layer 3 multi-corpus, Layer 5 split into Tile and Panel, source adapters and feed caching)
**Status:** Active. Companion to [[FUTURE-STATE]] and to [[ARCHITECTURE]] in the project root.

---

## What this is

[[FUTURE-STATE]] captures the dream as it was dreamt, held open as posture and possibility. This document decomposes the ideas in that dream into structural layers that do not depend on any specific stack. Stack choices (Mapbox, MapLibre, Three.js, Deck.gl, Cosmograph, D3, React, Svelte, whatever) are downstream of these layers and can be swapped without re-dreaming.

The point of decomposition is to name what each part of the system **is**, structurally, so that implementation choices become local decisions instead of architectural ones. A tile is a tile regardless of whether it is built in React or Svelte. A lens is a lens regardless of whether it is rendered in WebGL or SVG. A bundle is a bundle whether it lives on disk, in a database, or on someone else's computer. An edge is an object with its own properties, not a tag string in a list field on a node.

[[ARCHITECTURE]] describes what is currently built. [[FUTURE-STATE]] describes what was dreamt. This document is the conceptual structure the dream resolves to once stack is removed.

---

## The structural layers

The system decomposes into eight roles, indexed Layer 0 through Layer 7. Layer 0 is the runtime host, below everything. Layers 1 through 7 are the application architecture proper. Each layer has a single role and a clear boundary. Layers compose by passing well-defined artifacts upward. No layer reaches downward through another.

```
   Layer 7   │  Personal Infeed     │  linear consumption
              ▲
   Layer 6   │  Flow                │  the user's invariant
              ▲
   Layer 5   │  Tile and Panel      │  composable interaction, framed and hosted
              ▲
   Layer 4   │  Renderer            │  rendering grammar
              ▲
   Layer 3   │  Lens                │  projection operator, single or multi-corpus
              ▲
   Layer 2   │  Corpus              │  bundles plus edges, edges first-class
              ▲
   Layer 1   │  Bundle              │  substrate of content
              ▲
   Layer 0   │  Exoskeleton         │  runtime container, panel host, OSC routing
```

---

## Layer 0, Exoskeleton

The runtime container that hosts everything else. Below all the architectural layers in the sense that it is the host they run inside, not the application logic itself.

**Role.** A windowing and panel system with declarative layout, theme tokens, persistent state, and external control surfaces. The same exoskeleton hosts post-pipe panels, universal-viewer panels, the topo viewer, and anything else built on top.

**What it holds.** Panel registry, panel positions and sizes, pinned-versus-floating state, hide / show state, theme tokens (CSS custom properties), persistent user layout, OSC server and routing table, keyboard-and-pointer event dispatch, hardware-input adapters (game controllers, MIDI, OSC clients running on phones or tablets or hardware controllers).

**What it does not know.** What a bundle is, what a corpus is, what a renderer does. It hosts panels. Panels know.

**Why this matters.** Once OSC routing lives here, every panel and tile can declare "I respond to these OSC addresses," and external control surfaces (TouchOSC, Open Stage Control, Lemur, a custom phone webpage, a game controller) become first-class. The phone is a panel that runs on different hardware. The game controller is a panel that declares axes and buttons instead of mouse events. None of the upper layers need to know any of this is happening.

This is the layer that makes the universal viewer feel like one tool while staying logically separate from post-pipe, the topo viewer, and any other piece built on top. The negentropic property is that an exoskeleton with a settled panel-and-OSC contract is a permanent investment, anything built on top inherits panel management, hardware control, and layout persistence for free.

---

## Layer 1, Bundle

The smallest durable unit of content. A folder containing canonical text plus all derived and companion material that describes the same thing.

**Role.** A leaf bundle in the Hugo sense. `{slug}/index.md` plus assets (cover image, audio narration, video short, sidecar timings, AI-derived shorts, language translations, alt-text transcripts) all living as siblings in the same folder.

**What it holds.** The canonical content, the metadata that describes the content, and the structural fields that other layers will need (substrate, topology, energy, forms.potential, connected_to, status). The bundle holds dimensions that the current renderer does not yet know how to display. Nothing refuses to be in the bundle for lack of a renderer.

**What it does not know.** It does not know about any specific lens, renderer, tile, or flow. It does not know whether it will be rendered as a graph node, a map marker, a castle tower, or a podcast item.

**Why this matters.** This is the state vector from layer #8 of [[FUTURE-STATE]]. Higher layers project it through different bases. Keeping the bundle stack-agnostic means new dimensions can be added without breaking anything that already exists. AI-derived material lives here alongside authored material, in the same folder, because they describe the same thing.

### Relaxations of the leaf-bundle convention

Hugo's structure is the right shape. Hugo's specific rules are not load-bearing. Several relaxations:

- **The canonical index can be any substrate.** `index.md`, `index.html`, `index.png`, `index.mp3`, `index.mp4`. The folder declares its canonical thing by naming a file `index.*`. Substrate reads from the extension.
- **A bundle can have multiple canonical objects.** `index.md` AND `index.png` AND `index.mp3` together is a multi-substrate bundle where each is a primary, not a primary plus companions. The existing `kind: "multi"` schema reaches for this; relaxing the index-naming rule gives it a clean filesystem signature.
- **A folder with no `index.*` is still walkable.** It just has no canonical center. The renderer treats it as a section and surfaces everything in it.
- **Loose `.md` files at the top of a tree** work the same way as the no-index case, one level up. This is the lowest-structure input, which makes it the most universal one. Walk the directory, treat each `.md` as a very loose leaf bundle, build edges from any `[[wikilinks]]` or markdown links between files. The Obsidian-vault case is free once this works.
- **Frontmatter is optional and lives wherever the substrate carries it naturally.** YAML at the top of `index.md`. EXIF in `index.png`. ID3 in `index.mp3`. Sidecar `frontmatter.json` for the folder when no canonical can carry it.

The leaf-versus-branch distinction is still useful. Leaf bundle is one piece (one or more canonical objects describing the same thing). Branch bundle is a section page with its own intro plus children inside. The marker can be Hugo's `_index.*` convention or any other, the convention itself is replaceable, the structural distinction is not.

**Open structural question.** When a bundle has multiple canonical objects, the renderer has to decide what to surface. The fallback chain: bundle's frontmatter declares display preference, lens overrides if the current view mode wants something else (in audio mode, audio is primary; in gallery mode, image is primary), renderer surfaces what lens picks. Authored intent wins by default, lens overrides when context demands.

---

## Layer 2, Corpus

The collection of bundles plus the edges between them, where edges are first-class citizens.

**Role.** A walked set of bundles, plus explicit `connected_to` edges authored by you, plus derivable edges (tag overlap, topology overlap, substrate clusters). Optionally extended with external bundles ingested from RSS or JSON feeds via source adapters, which appear as peer nodes alongside your own work. Optionally extended further with cross-corpus edges derived via the Rosetta stone (see below).

**What it holds.** A pure data structure. Shape only. No styling, no projection, no rendering.

**What it does not know.** How it will be drawn or queried. Which dimensions are being measured. Which bundles a particular lens cares about.

### Edges as first-class citizens

The structural commitment here is that an edge is its own entity, not a property of a node. Standard RSS-reader / blog-graph models treat tags as a list field on each post, and "the edge between two posts via shared tag X" is reified at view time, with no identity, no metadata, no history. This is the reification problem: by the time the visualizer sees the data, the relationship has been flattened into a derivable property and loses what made it a relationship.

The corpus treats every edge as an object with its own properties:

- **kind** (tag-overlap, authored-connected_to, citation, temporal-adjacency, substrate-cluster, Rosetta-cross-corpus, phrasing-thread if that layer ever lands, ...)
- **source** (which bundle on each end, and which direction if directed)
- **strength** or weight (continuous)
- **provenance** (who or what declared the edge, when)
- optional **metadata** (annotations, the user's notes about the relationship itself)

Multiple edges between the same pair of bundles coexist without contradiction. A tag-overlap edge and an authored-connected_to edge between the same two pieces are different edges. A lens decides which kinds to surface and how to combine them. The renderer draws them, possibly differently.

This is the structural difference between a graph viewer and a graph-shaped viewer. A viewer that treats edges as derived properties of nodes ends up showing constellations of points; a viewer where edges are first-class can show the topology itself, which is the thing TopoThink is actually about.

### Rosetta stone of tags

A graph-of-graphs structure for translating between tag-systems.

**The problem.** Tag-systems differ across sources. "AI" here, "artificial intelligence" there, "machine learning" sometimes overlapping with both. "Systems thinking" and "complex systems" and "global thinking" and "big picture" are overlapping but not identical. Without a translation layer, cross-source edges are invisible because the labels do not match.

**The structure.**

- Each tag-system is its own graph. Nodes are tag-labels, edges are within-system relationships (hierarchy, hyponymy, near-synonymy, opposition).
- The Rosetta stone is the graph between systems. Nodes are tag-systems or specific tags within them. Edges are cross-system relationships (identity, synergy, adjacency, opposition, containment, near-equivalence).
- The user picks which system to display labels through. The viewer translates tag-labels via the Rosetta stone before drawing them.

**Prior art.** W3C's SKOS (Simple Knowledge Organization System) is exactly this shape and exists specifically for representing tag-vocabularies and their cross-mappings. WordNet is the canonical English example. Not required to adopt SKOS directly, but the wheel is already round and worth knowing.

**Build order.** Empirical, not architected from above. Build the source adapters first, observe the actual tag vocabularies that show up across sources, then build the translation layer once there is something to translate between. Before that, there is no signal to translate.

### Source adapters

A corpus is produced by source adapters. The filesystem walker that ingests `~/Posts/` is one. An RSS adapter that polls feeds and yields synthetic leaf bundles is another. An adapter for an Obsidian vault, an Atom-feed adapter, a stream adapter for continuous substrates, anyone-else's-`~/Posts/`-folder adapter, all produce the same corpus shape.

| URI scheme | Adapter | Produces |
|---|---|---|
| `file:///path/to/folder` | Filesystem walker | Corpus from leaf + branch bundles + loose files |
| `https://.../feed.json` | JSON Feed | Synthetic leaf bundles from items |
| `https://.../rss.xml` | RSS / Atom | Same |
| `obsidian://vault/...` | Vault reader | Leaf bundles with wikilink edges |
| `https://.../user.atom` | Microblog stream | Short leaf bundles, time-ordered |
| `stream://...` | Continuous substrate | One bundle pointing at a live URL |

The corpus produced by any adapter has the same shape. The viewer mounts on the corpus. Layers 3 through 7 do not know any of this happened.

**Streams as a substrate.** A stream (internet radio, live video, live audio) does not have an end, it has a tune-in point and a now. The cleanest mapping: substrate `stream` is a leaf bundle whose `index` is the live URL plus metadata, the renderer dispatches to a player tile when `kind: stream`. The bundle stays static, the player tile is what connects.

### Open question (preserved)

Whether the corpus also needs a phrasing or thread layer (from layer #2 of [[FUTURE-STATE]]) remains undecided. The corpus currently has bundles and edges. Whether the connective tissue between bundles needs to be a first-class structure the way phrasing is in music, is one of the [[FUTURE-STATE]] open threads.

---

## Layer 3, Lens

A choice of basis, a way of observing the corpus.

**Role.** A specification of which dimensions of the corpus to surface, and how. A lens is a projection operator, it takes a high-dimensional state vector (a bundle) and projects it onto a chosen subspace. The unmeasured dimensions remain in the bundle but are not visible through this lens.

**What it holds.** A declarative specification, saveable, shareable, forkable. Examples, "show my essays clustered by topology," "show everything I bloomed in 2025 grouped by substrate," "show the connection graph of my peace-and-war pieces," "show only podcast episodes ordered by date."

**What it does not know.** What visual form the projection will take. The same lens can be implemented as a force graph, a map, a list, a 3D cloud. The lens names observables, the renderer paints them.

**First-class property.** Lenses are saveable, shareable, forkable artifacts. Your topology is one lens. Someone else's medieval castle is another lens. The data layer does not know which is canonical, because none of them is.

### Multi-corpus lenses

A lens currently observes one corpus. A multi-corpus lens observes a stack of corpora, with the Rosetta stone as the cross-corpus edge-deriver. You see "AI" tagged in one corpus and "artificial intelligence" tagged in another, the stone says they are the same, the renderer draws the cross-corpus edge.

This is structurally a relaxation of Layer 3, not a new layer. A single-corpus lens is the case where the stack has one element. A multi-corpus lens is the general form. Worth naming because the renderer behaves differently when there are multiple sub-graphs to show plus inter-graph edges between them.

The view-list panel (Layer 5) is the UI surface where the user manages the corpus stack. It lists corpora currently being viewed, lets the user reorder them, check or uncheck them, set per-corpus display options. The multi-corpus lens reads from that panel's state.

---

## Layer 4, Renderer

The visual grammar that paints a lens.

**Role.** A module that takes a lens specification plus the corpus and produces a visual surface. Renderers are pluggable. Examples, force-graph renderer, map renderer, list renderer, gallery renderer, 3D cosmos renderer, castle renderer, waterfall renderer.

**What it holds.** Visual conventions, camera, interaction model. Knows how to draw nodes, edges, labels, clusters, transitions. Knows what hovering means, what clicking means, what panning means.

**What it does not know.** What the data means. It treats the lens output as instructions about what to surface and where. It does not interpret the corpus directly.

**Strict separation.** The data ↔ renderer separation is load-bearing. A renderer should be replaceable without touching the corpus, the lens, or anything above it. If swapping renderers requires changes elsewhere, the boundary has leaked.

---

## Layer 5, Tile and Panel

Composable interaction, in two parts. A tile is a self-describing UI unit. A panel is a frame that holds one or more tiles. The reader is a panel containing TTS, syndication, export, and other tiles. The graph viewer is a panel. The view-list is a panel. A Pixelmator-style tool palette is a panel.

### Tile

**Role.** A small self-describing piece of UI that operates on the current selection or session state. The monolithic reader toolbar dissolves into tiles. A TTS tile, a syndication tile, an export tile, a "make a short" tile, a narration tile, an experience tile.

**What it holds.** A self-description (what it does, what it needs, what it produces) and a small piece of UI. Registers with the tile registry at load time. Lazy-instantiates when activated.

**What it does not know.** Which other tiles exist or are loaded. Which panel it lives in. Which lens or renderer is active. It operates on whatever it is given.

**Pattern reuse.** The tile registry has the same shape as the existing TTS engine registry in [`tts.js`](../tts.js). Engines self-describe their capabilities, are lazy-loaded, and do not know about each other. Lifting that pattern one level up gives the tile model.

### Panel

**Role.** A positionable, hideable, pinnable frame that hosts one or more tiles. Panels are the unit of layout in the exoskeleton. The reader panel, the graph viewer panel, the view-list panel, the TTS controller panel, a project-status panel, all share the same panel contract.

**What it holds.** A frame, a sizing model, a position (floating, docked, pinned), a hide/show state, an OSC address (optional), a tile-slot specification (which tiles can be hosted here, and which are currently mounted). Panels declare their preferred minimum and maximum sizes, the exoskeleton resolves layout.

**What it does not know.** What its tiles do. How the exoskeleton renders it. Which other panels exist.

**Why both.** Tile is content. Panel is its host frame. They are the same layer of concern but two parts of it, the way a window-and-its-widgets are one concern split between the window manager and the widget toolkit. Keeping them named separately is what lets a tile move between panels (TTS controls in the reader, TTS controls as a standalone panel, TTS controls running on a phone via OSC), and what lets a panel host different tiles without each panel reinventing tile management.

**OSC consequence.** Once panels have OSC addresses, an external control surface (phone, tablet, hardware controller, even a game controller for fun) can address any panel. The control-surface authors are free to build whatever UI they want using open-source tools like TouchOSC or Open Stage Control. The viewer does not ship phone apps, it ships OSC schemas.

---

## Layer 6, Flow

The user's invariant. The stable thing across the whole system.

**Role.** A user-composed sequence that transforms one or more bundles into an experience. Examples, "narrate this essay with a Gemini voice and queue it in my morning listen feed," "make a 60-second video short from this bundle's three strongest paragraphs," "render my last month of writing as a single linear audio mix with ambient transitions."

**What it holds.** A composition. Which bundles to operate on, which tiles or renderers or external services to invoke, what the output substrate is, where it lands.

**What it does not know.** The specific implementation of any tile it composes. It calls them through their declared capabilities and routes their output forward.

**Why this is the invariant.** Bundles change. Lenses change. Renderers change. Tiles come and go. What persists is the user's own composed flows, because those encode what the user actually wants to do with their corpus. Linearity is for consumption, topology is for navigation. Flows linearize topological slices for consumption.

---

## Layer 7, Personal Infeed

The linear, substrate-rich consumption stream that the user controls.

**Role.** Your own curated feed, fed by flows, consumed in the substrates you prefer (primarily audio and video). Your intake, under your control.

**What it holds.** A queue, a play state, a substrate preference, a history.

**What it does not know.** What produced the items in the queue. From the infeed's point of view, each item is a substrate plus metadata. The flow that produced it has already done its work.

**Why this matters.** The infeed resolves the tension between an N-dimensional cosmos and a finite human attention. The cosmos is for navigation. The infeed is for consumption. You do not read or listen-through the cosmos directly. You compose flows that linearize slices of it for you.

---

## How the layers compose

Layers compose by passing artifacts upward.

- Exoskeleton hosts the runtime.
- Bundle is data.
- Corpus is data plus edges (edges first-class).
- Lens picks observables from the corpus, possibly across multiple corpora via the Rosetta stone.
- Renderer paints those observables.
- Tiles act on selections. Panels frame tiles. Both live inside the exoskeleton.
- Flow composes tiles into a sequence.
- Infeed receives the flow's outputs.

No layer reaches downward through another. A renderer never reads bundles directly, it reads what the lens surfaces. A tile never reads the corpus directly, it reads the current selection. A flow does not query bundles, it queries tiles. A panel does not know its tiles' internals, it knows their interfaces. This is what makes substitution local. Swapping a renderer does not affect tiles. Swapping a lens does not affect the corpus. Adding a new tile does not affect the flow specification language, it just makes new flows possible. Adding a new panel does not affect the exoskeleton's contract, it just becomes another addressable surface.

The negentropic property here is that each layer accumulates information independently. The exoskeleton accumulates layouts, OSC mappings, hardware adapters. The bundle accumulates content and metadata. The corpus accumulates edges and bundle counts. The lens collection accumulates saveable observation patterns. The renderer set accumulates rendering grammars. The tile registry accumulates capabilities. The panel set accumulates layout compositions. The flow library accumulates user habits. The infeed accumulates consumption history. None of these ratchets reset when another layer changes implementation.

---

## What flows between layers

The artifacts that cross layer boundaries are the long-term commitments. They are the data contracts that survive any stack swap.

| Crossing | Artifact | Stability |
|---|---|---|
| Exoskeleton ↔ Panels | Panel contract, lifecycle, sizing, OSC address, tile-slot spec | Cross-cutting, touches every panel |
| Source adapter → Corpus | Bundle yield, per-adapter format | Adapter-private, just has to yield bundles |
| Bundle → Corpus | Bundle metadata + content references | Schema must be open for new dimensions |
| Corpus → Lens | Corpus as queryable structure, edges queryable as objects | Read-only from the lens's perspective |
| Corpus ↔ Rosetta | Tag-system identifiers + cross-system mappings | Empirical, accretes over time |
| Lens → Renderer | Observable specification (what to draw, where) | Declarative, serializable |
| Renderer → Tile | Current selection + session state | Tile receives, does not pull |
| Tile ↔ Panel | Tile interface, declared capabilities, mount/unmount | Self-described, registry-discoverable |
| Tile → Flow | Capability declaration | Self-described, registry-discoverable |
| Flow → Infeed | Substrate-tagged output items | Infeed plays, does not transform |

The schema for each of these is more important than the implementation of any layer on either side. Once they are stable, the layers can be rewritten without consequence.

---

## Realization notes, stack-leaning but not stack-binding

Layer #9 of [[FUTURE-STATE]] points out that existing topology engines already do most of what this decomposition asks for. Translation, without commitment:

- **Exoskeleton.** The thing being built. OSC server libraries: liblo, node-osc, python-osc. Open-source control-surface authoring: TouchOSC, Open Stage Control, Lemur Editor, Chataigne. Panel-and-layout: any windowing-capable framework, or a thin custom layer.
- **Bundle, Corpus.** File system plus walker, no library needed. The Hugo leaf bundle convention is the public-domain shape (with the relaxations listed in Layer 1).
- **Edges first-class.** Property-graph thinking. Neo4j is the canonical example, but the structural shape can live in plain JSON without a graph database, as long as edges are objects with properties not strings in a list field.
- **Rosetta stone.** SKOS for the data model (W3C standard, RDF-based). WordNet for vocabulary precedent. Lightweight realization: a JSON document per tag-system plus a separate mapping document, no triple-store needed at first.
- **Source adapters.** RSS / Atom parsers exist everywhere (feedparser, rss-parser, etc.). JSON Feed is just JSON. Obsidian vault reader is a markdown walker plus wikilink resolver.
- **Lens.** Declarative spec, similar in shape to Mapbox style specs or Vega-Lite graph specs. Could be a JSON or YAML document. Stack-free.
- **Renderer.** This is where existing engines earn their keep. MapLibre for the geographic HUD. Cosmograph for graph-shaped HUDs. Three.js for true-3D. D3 for bespoke 2D. Deck.gl for layered visualization. Each is its own renderer plugin. None is canonical.
- **Tile.** A small component, framework-agnostic at the spec level, that implements a tile interface.
- **Panel.** A framing component with a layout contract. The exoskeleton's panel layer defines the contract, panels conform.
- **Flow.** A sequence of tile invocations. Could be a YAML document, a small DSL, or a UI-composable graph. Stack-free at the spec level.
- **Infeed.** A queue plus a player. Existing podcast-player models work.

### Feed caching and storage

For corpora ingested from external sources, feed management is a well-trodden problem. Established patterns:

- **One cache file per source.** `{source-id}.feed.json` per feed. Cache-friendly, invalidate-per-source, easy to reason about. Reeder-style readers do variants of this.
- **Single combined index.** Faster initial load, harder to update incrementally. Suited to read-only viewers, not active aggregators.
- **SQLite database.** What most desktop RSS readers actually use (NetNewsWire, etc.). Cheap, transactional, supports the lookup patterns aggregators need.
- **IndexedDB or OPFS.** Browser-side equivalent for web-based aggregators.
- **Hybrid.** Live fetch with TTL-based disk cache, refresh on expiry. FreshRSS, Miniflux, most server-side aggregators.

The decomposition does not specify which pattern. The choice depends on whether the universal viewer runs in the browser, on the desktop, or both. The structural commitment is just that each source adapter knows how to fetch, parse, and persist its own substrate, and produces bundles into the corpus on demand. Caching is an adapter concern, not a layer concern.

The decomposition commits to the roles, not the implementations.

---

## Parked, deferred, or held open

- **Shared topology, multiplayer.** Layer #7 of [[FUTURE-STATE]] flags this. Building your own topology in your part of the world, others visiting or forking. Not for now. The decomposition does not preclude it. A shared corpus is a corpus that lives somewhere addressable. A shared lens is a lens that has been published. The pattern reuses cleanly when the time comes.

- **Phrasing as first-class.** Layer #2 of [[FUTURE-STATE]] raises the question. Is phrasing between bundles a structural concept the corpus needs to hold? Currently the corpus has bundles and edges (now first-class). Music-like phrasing might be a first-class connective-tissue layer between them, or it might be an emergent property of certain lenses. Held open.

- **Teaching AI how information works.** Layer #2 of [[FUTURE-STATE]] also asks whether AI is fluent in information topology or needs explicit teaching. This is an operating-posture question, not an architectural one. When working with coding agents on this system, surface the decomposition itself as context. The layers are not obvious from the file tree.

- **Hidden vectors / unit of information.** Layer #1 of [[FUTURE-STATE]] holds the question open about what the unit of information actually is (bit, blurb, meme, watt). The decomposition does not answer this. It just makes sure the bundle can carry whatever dimensions get named without the corpus, lens, or renderer needing to be told first.

- **Multi-canonical resolution rules.** When a bundle has multiple `index.*` files, the exact rules for default rendering, lens override, and user override need empirical grounding. The fallback chain is named; the precise priorities will settle once the case appears in practice.

---

## Relationship to current code

| Current artifact | Lands at layer | Notes |
|---|---|---|
| Exoskeleton (separate project) | 0 | Below post-pipe, will host post-pipe's panels and the universal viewer's panels alike |
| [`ingest.js`](../ingest.js) | 1 → 2 source adapter | Walks `~/Posts/` bundles, produces corpus. One source adapter among future many. |
| [`generate-index.js`](../generate-index.js) | 2 → output | Emits corpus as `feed.json` |
| `_site/feed.json` | 2 | Materialized corpus, data contract |
| [`tts.js`](../tts.js) | 5 tile | Already a tile registry in spirit |
| `_site/index.html` graph code | 3 + 4, fused | Lens and renderer collapsed, needs separation |
| `_site/index.html` reader code | 4 + 5, fused | Renderer and tile/panel slot collapsed, needs separation |
| Reader toolbar | 5, collapsed | Tiles fused into one bar |
| Reader (entire) | 5 panel | A panel by another name, currently hardwired |
| Graph viewer (entire) | 5 panel | Same |
| [`platforms/*.js`](../platforms/) | 5 tile, publishing | Already operate per-bundle |
| [`settings.json`](../settings.json) | configuration, cross-layer | Theme tokens, engine list, feed list |
| `~/Posts/` | 1 + 2 source | post-pipe stays the canonical home for your own work |

The work ahead is mostly separation. Identifying where layers are currently fused, then extracting them. The [[POST-PIPE-BEHAVIOR-DIAGRAM]] catalog lists the collapse points in tier-priority order.

The schema migration to relaxed leaf bundles affects only Layer 1 and the ingester at the Layer 1 → 2 boundary. It does not touch Layers 3 through 7. As long as `feed.json` continues to be emitted in its current shape, the rest of the system keeps working through the migration. The data contract is the seam.

### post-pipe versus the universal viewer

post-pipe stays as the live thing: the corpus walker for `~/Posts/`, the publisher, the producer of derivatives, the source of the actual content. It is where bundles live and where they originate.

The universal viewer is what those bundles get viewed in, alongside any other corpus the user mounts (RSS, scattered markdown, anyone else's `~/Posts/`, an Obsidian vault, a live stream). Structurally it is the exoskeleton plus the panels post-pipe extracts, plus a set of source adapters for arrivals from other places, plus the multi-corpus lens, plus the Rosetta stone for cross-corpus tagging.

The one-line description, from this conversation: **an RSS reader on steroids plus magic plus graphs, made by people who understand that edges are first-class citizens and that reification often interprets the data in a way that isn't helpful for visualization or understanding.**

Whether the universal viewer is a separate binary, or a mode of post-pipe, is a packaging decision, not an architectural one. The components are the same either way.

---

## Sequence for getting there from here

Not a prioritized roadmap. The dependency order. Earlier moves unblock later ones. Each is independent of the rest at the layer above it.

1. **Extract the graph as its own component** at Layer 4. Currently fused with the lens spec inside `index.html`. Extract first because everything else in the reader depends on graph click events.

2. **Extract the reader as its own component** at Layer 4 + Layer 5 panel. Depends on the graph having a stable click-event contract.

3. **Extract TTS as a tile** at Layer 5. Already structured as a registry, just needs to leave the inline script.

4. **Mount the components inside the exoskeleton** at Layer 0. The exoskeleton becomes the host. post-pipe's `index.html` keeps working as a standalone artifact, the exoskeleton becomes the alternative host with full panel management and OSC routing.

5. **Separate lens spec from renderer** at the Layer 3 / 4 boundary. The graph today bakes "show all essays clustered by tag co-occurrence" into the renderer itself. The lens should be a declarative spec the graph renderer consumes.

6. **Split the reader toolbar into tiles** at Layer 5. Tile registry, same pattern as the TTS engine registry. Existing buttons become individual tiles, the toolbar becomes a tile-slot.

7. **Promote edges to first-class objects** at Layer 2. The corpus today stores tags as a list field on each bundle, edges are derived. Reshaping the corpus so edges are objects with their own properties unlocks all subsequent multi-corpus and Rosetta work. This is the structural move that makes the universal viewer different in kind, not just degree, from existing RSS readers.

8. **Migrate the ingester to relaxed leaf bundles** at Layer 1 → 2. Independent of most of the above because `feed.json` shape can stay stable.

9. **Build source adapters beyond the filesystem walker** at the Layer 1 source-adapter boundary. RSS, JSON Feed, Atom, scattered markdown, Obsidian vault. Each is a separate adapter. The universal viewer becomes useful around here.

10. **Build the view-list panel** at Layer 5. The multi-corpus management surface. Lists corpora, lets the user reorder and toggle them, picks the semantic system for label display.

11. **Build the Rosetta stone** at Layer 2. Empirical, after several source adapters exist. Without source diversity, there is no signal to translate.

12. **Build multi-corpus lenses** at Layer 3. Depends on Rosetta and edges-first.

13. **Introduce flow specifications** at Layer 6. Smallest first, "narrate this and queue it." A YAML or JSON shape that names which bundle, which tiles in which order, where the output goes.

14. **Build the personal infeed** at Layer 7. Receives flow outputs. Plays them. Starts as the simplest possible queue and player.

Steps 1, 2, 3 are the Jules-shaped work currently being scoped. Step 4 is the exoskeleton integration. Step 5 is the architectural payoff that splits lens from renderer. Step 6 is the toolbar dissolution from layer #5 of [[FUTURE-STATE]]. Step 7 is the structural shift that makes the viewer different in kind from existing RSS readers. Step 8 is the schema move. Step 9 is when the universal viewer actually starts being useful. Steps 10 through 12 are the cross-corpus / Rosetta arc. Steps 13 and 14 are the part of the dream that has not been touched yet, and turn the system from a viewer into flow-composing personal infrastructure.

---

## See also

- [[FUTURE-STATE]], the dream record. This document is its decomposition.
- [[ARCHITECTURE]], the current build.
- [[POST-PIPE-BEHAVIOR-DIAGRAM]], the collapse-point catalog with tier-priority list.
- [[TopoThink]], the framework book whose concepts (substrate-independence, topology, negentropy, wu wei, edges-as-real-structure) are load-bearing throughout.
