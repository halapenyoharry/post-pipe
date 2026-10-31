---
title: post-pipe systems graph
date: 2026-10-31
tags: [post-pipe, systems, diagram, neat-view, rtagz, cognition]
status: draft for confirmation
---

# post-pipe systems graph

#post-pipe #systems #diagram #neat-view #rtagz #cognition

One graph, entered from two doors. **Launch** is everything that exists before a reader touches anything. **Input** is one gesture travelling through the system and coming back out as something the reader perceives. A third layer draws the reader as a system too, with states and the moves between them, so the machine side and the mind side are drawn the same way.

Files appear only as the place a state lives. Where a line is inferred rather than read from the code, it carries `?`; those are the lines for a droid to confirm. Related: [[POST-PIPE-USES-RTAGZ]], [[SITES]], [[ACTIONS]], issues #16 #17 #22.

---

## 1. Launch — the state before anyone arrives

```mermaid
flowchart TB
  subgraph SITE["Site folder (owner's, its own repo)"]
    settings["settings.json<br/>title · author · base_url<br/>graph · reader · opening · rtagz block"]
    opml["feeds.opml<br/>one outline = one source<br/>= one tag-system"]
    overrides["rtagz-overrides.json<br/>human decisions"]
    ids["rtagz-ids.json<br/>concept ids kept between builds"]
    contrib["contributions.json<br/>what readers brought"]
  end

  subgraph BUILD["generate-index.js  (POSTPIPE_SITE=site)"]
    adapters["adapters<br/>local · rss · atom · json"]
    p1["phase 1 fetch<br/>failed feed → last good copy"]
    p2["phase 2 colours<br/>explicit first, then hashed apart"]
    rt["rtagz phase<br/>rtz-build · emerge · discover<br/>never fails the build"]
    p3["phase 3 sources + provenance<br/>every item stamped"]
    edges["buildEdges · relationEdges<br/>skos relations as edge layers"]
  end

  subgraph RTAGZ["rosetta-tagz (own folder, own programs)"]
    schemes["concept schemes<br/>each source's spellings<br/>+ vendored vocabularies"]
    ledger["ledger<br/>id continuity: majority of members keeps the id"]
  end

  subgraph OUT["_site/ (static, git-ignored)"]
    feed["feed.json<br/>cards · tagz · edges · _rtagz schemes"]
    html["index.html + bundles"]
    skos["skos.jsonld · skos.ttl"]
    favicon["favicon"]
  end

  subgraph BROWSER["Reader's browser, first paint"]
    vs["viewState (localStorage, prefix post-pipe:)<br/>positions per layout · sizes · pins<br/>bookmarks · reading progress<br/>pruned to items that still exist"]
    opening["Opening: art ↔ graph<br/>startOn: remembered"]
    layout["layout chosen<br/>cluster | ring · tightness · min pieces per tag<br/>scheme + depth"]
    first["first frame:<br/>cards at remembered positions,<br/>else force settles"]
  end

  settings --> BUILD
  opml --> adapters --> p1 --> p2 --> rt --> p3 --> edges --> feed
  overrides --> rt
  ids <--> ledger
  rt <--> RTAGZ
  schemes --> feed
  rt --> skos
  settings --> html
  settings --> favicon
  contrib -.-> BROWSER
  feed --> BROWSER
  html --> BROWSER
  vs --> first
  opening --> first
  layout --> first
```

What holds still across a rebuild: the card's slug, the tag's concept id (through the ledger), and the reader's arrangement (through viewState, keyed by those ids). Everything else may move. That triad is the floor the ring layout, the neat view and reader-built orderings stand on.

---

## 2. Input — one gesture through the system

```mermaid
flowchart LR
  subgraph READER["Reader"]
    intent["intent<br/>(read this · see what's near · tidy up)"]
    gesture["gesture<br/>tap · doubletap · drag · longpress<br/>wheel · pinch · key"]
    percept["percept<br/>what changed on screen,<br/>and why (hover reasons, counts)"]
  end

  subgraph RESOLVE["Target resolution"]
    target["target<br/>container · node · node.readable · space<br/>(a one-pixel hotspot today — issue #21)"]
  end

  subgraph TABLE["bindings table  (settings.graph.bindings)"]
    row["row: gesture × target → action id"]
  end

  subgraph ACTIONS["actions (src/lib/actions.js)"]
    a1["container.toggle"]
    a2["view.zoomInStep · view.zoomAtPoint"]
    a3["node.zoomToReadable"]
    a4["node.openReader"]
    a5["node.select"]
    a6["panel controls:<br/>layout · tightness · min pieces<br/>scheme · depth · tag list · lines to relatives"]
  end

  subgraph STATE["state that changes"]
    view["view transform<br/>(pan · zoom · pivot)"]
    graphst["graph state<br/>open containers · selected card<br/>pinned · dragged positions"]
    reader["reader state<br/>open piece · paragraph · TTS voice<br/>bookmarks · progress"]
    vs2["viewState persisted<br/>(transient during drag, committed on release)"]
  end

  subgraph RENDER["render"]
    sim["force simulation / ring constraint<br/>settles angle, radius, or both"]
    draw["D3 draws cards, tagz, edge layers<br/>reasons on hover"]
    panel["ReaderPanel · TTS · Toolbar · Settings"]
  end

  intent --> gesture --> target --> row --> ACTIONS
  a1 & a5 --> graphst
  a2 & a3 --> view
  a4 --> reader
  a6 --> graphst
  graphst --> vs2
  reader --> vs2
  graphst --> sim --> draw
  view --> draw
  reader --> panel
  draw --> percept
  panel --> percept
  percept --> intent
```

The viewer never decides what a tap does; it asks the table. That is the engine's one concession to the reader's side already in place: the meaning of a gesture is a setting, not code. The neat view (#16) and reader-built orderings (#17) extend the same move to *what comes first*.

---

## 3. The reader as a system

Drawn with the same shape as the machine: states, and the moves between them. The costs are working-memory costs. Nothing here is a diagnosis; it is what a person has to do to use the thing.

```mermaid
stateDiagram-v2
  [*] --> Arrive
  Arrive --> Scan : many cards at once
  Scan --> Overwhelm : no ordering offered,<br/>overlap in the middle
  Scan --> Locate : something near something known
  Overwhelm --> AskForNeat : "I don't like looking at information this way"
  AskForNeat --> Scroll : engine takes the ordering back (#16)
  Scroll --> Locate : each next item says why it is next
  Locate --> Read : open the card
  Read --> Hold : one piece, one place, TTS or eyes
  Hold --> Return : back to the field, position kept
  Return --> Scan
  Return --> Arrange : drag · pin · open a container
  Arrange --> OwnOrdering : the arrangement survives a rebuild
  OwnOrdering --> Weigh : "what's heavy goes to the top" (#17)
  Weigh --> Scan : the field re-settles under the reader's weights
  Read --> Contribute : note · bookmark · connection
  Contribute --> Return

  note right of Overwhelm
    cost: holding several
    orderings at once
  end note
  note right of Scroll
    cost: low;
    gain: borrowed from the engine
  end note
  note right of OwnOrdering
    cost: high once,
    then it is memory
  end note
```

The operations a reader performs, named once: **scanning** a field rather than a line; **choosing one ordering** or accepting the engine's; **holding more than one ordering at once**; **tolerating overlap** where the vocabulary is shared; **reading from a shared vocabulary** rather than a private one (that is what rtagz buys them); **letting go of neatness**, or asking for it back. The last two are a toggle, not a stage. Zettelkasten keepers kept the box and the sequential index both; this map keeps the graph and the scroll both.

---

## 4. Where the two meet

| exchange | engine side | reader side | state today |
|---|---|---|---|
| what a gesture means | bindings table | gesture → intent | built (ACTIONS.md) |
| where things are | viewState by stable id | arrangement memory | built |
| what a tag is called | rtagz schemes, scheme chosen in panel | shared vocabulary | built, deepening (IPTC next) |
| how deep to look | depth slider; folded lines as an option | granularity | in this release |
| what comes first | layout forces; ring radius attribute (#18) | one ordering vs. many | partly built |
| the scroll | neat view (#16) | low-cost default | not built |
| whose weights | reader-built orderings (#17) | own algorithm | not built |
| what a point means | nearest-wins / region select (#21) | pointing in a crowd | not built |

---

## To confirm (`?` lines)

- Whether `contributions.json` is read at launch or on opening a piece.
- Whether `startOn: remembered` falls back to art or graph on a first visit with no storage.
- Whether drag positions are stored per layout (`placeOf(layout) + persistKey`) in all layouts or only force and ring.
- Whether the tag list / min-pieces slider writes to viewState or only to in-memory panel state.

---

#post-pipe/systems #post-pipe/neat-view #flow-session/2026-10-31
