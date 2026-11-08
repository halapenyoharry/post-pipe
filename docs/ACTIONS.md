# Actions and what triggers them

The graph keeps two things apart, the way an editor keeps its commands apart from its keyboard map and a game engine keeps its actions apart from its input map:

- **actions**: what the graph can do, each with a plain id (`node.openReader`);
- **bindings**: a table that says which **gesture** on which **target** runs which action.

The viewer never decides by itself what a tap does. It asks the table and runs the action by its id. To change what a gesture does, a site changes one row of its table in `settings.json`, under `graph.bindings`; no code changes and no rebuild of the engine.

The code is [`src/lib/actions.js`](../src/lib/actions.js); this file is the readable version of it.

## Targets

| target | what it is |
|---|---|
| `container` | a closed container (its node), or an open container's title |
| `node` | a card |
| `node.readable` | a card whose title already renders at `graph.readablePx` CSS px or more (default 16). With no row of its own it does what `node` does. |
| `space` | the canvas: empty space and an open container's hull. A double tap on an edge or a tag bubble (or the dot a tag is drawn as) also does what a double tap on `space` does. |

## Gestures

| gesture | what it is |
|---|---|
| `tap` | one press and release under 4 to 5 px of movement. It runs only once `graph.doubleTapMs` (default 250 ms) has passed with no second tap, so it never runs as half of a double tap. |
| `doubletap` | two taps within `graph.doubleTapMs` and 32 px of each other. The first tap's target decides: a double tap that starts on a card is a double tap on that card even if the second tap lands just off it. Neither tap's single action runs. |
| `drag` | a press that moves. |
| `longpress` | a press held `graph.longPressMs` (default 500 ms) without moving 8 px. Its release is not counted as a tap. The graph listens for it only when a row uses it. |

## Actions

| action | what it does | answers |
|---|---|---|
| `none` | Nothing. Use it to switch a gesture off. | any |
| `container.toggle` | Opens a closed container, or closes an open one. | tap, double tap, long press on `container` |
| `view.zoomInStep` | Zooms in one step, the step of the + key (1.25 times), about the point every zoom keeps still: the cover art's pivot when the site has one (`graph.zoomPivot: "art"`), else the middle of the screen. With `graph.zoomMode: "grow-in-place"` each act grows on its own root tip. | tap, double tap, long press anywhere |
| `view.zoomAtPoint` | Zooms in about 2 times at the point tapped, out with shift held. Where every zoom is about the cover art's pivot, about the pivot. | tap, double tap, long press anywhere |
| `node.zoomToReadable` | Zooms in until the card's title renders at `graph.readablePx` CSS px or more (default 16), in the site's zoom mode (with grow-in-place the card's act grows about its anchor). When that would take the card off the screen, the view also pans so the card stays under the finger. | tap, double tap, long press on a card |
| `node.openReader` | Opens the reader on the card's piece. | tap, double tap, long press on a card |
| `node.select` | Opens or closes the card in place (its text inside it) and makes it the card the panel acts on. The reader stays as it is. | tap, double tap, long press on a card |
| `node.listen` | Reads the card's text aloud, in the voice and at the speed the panel has (one reading on the page: the reader's or a card's). On the card being read it pauses; on the card paused in it reads on; a closed card opens first and is read once its text has arrived. The same as the play button in an open card's listening strip. | tap, double tap, long press on a card |
| `node.stopListening` | Ends the reading when it is this card's; does nothing otherwise. The same as the stop button in the strip. | tap, double tap, long press on a card |
| `node.move` | Moves the card, or the container with all it holds, with the pointer or the finger. | drag on a card or a container |
| `node.resize` | A drag that starts on a card's edge or corner changes its size. Only while it is bound do the cards have edges to drag (their resize handles), and only then does the panel offer "Reset sizes" and the graph bring back sizes saved on an earlier visit. | drag on a card |
| `view.pan` | Moves the whole view with the pointer or the finger. | drag on `space` |
| `view.deselect` | Closes the reader, takes off a highlighted tag, hides an edge's name. | tap, double tap, long press anywhere |

A row that binds an action to a gesture it cannot answer, or to a target it means nothing on, does nothing there, and the page says why in the console. So does a row that names an action the engine does not have. A row that names a target or a gesture the table does not have is left out, with a line in the console too.

Not in the table, and fixed: a link card follows its link on a tap; the button inside an open card opens the reader; the listening strip under an open card's title (`cards.listen`, default true: play or pause, stop, the voice and the speed, the same ones the reader and the panel have) acts on the one reading, and taps on it never open, close or drag the card; a tap on a tag bubble highlights its pieces and a tap on an edge names it; while the tagz' labels are hidden (`graph.tag.labels: false`, or the reader's "Show their labels" off), each tag is a dot with a hit circle round it a finger can reach, a tap there does what a tap on its bubble does, and a mouse or a pen resting on a dot shows its bubble while it rests there; a double tap with two fingers zooms out; the wheel and a pinch zoom; two fingers turned rotate the view.

Outside the graph, in the top bar, and fixed too: a tap or click on a source pill hides or shows its source (Enter or Space with the keyboard's focus on it); its dot opens the colour ring on a tap or a mouse resting on it 650 ms. A mouse resting on the rest of the pill 350 ms, the keyboard's focus, or a finger held on it 500 ms without moving 8 px (a dwell) shows the pill's popover, which says when the source's items were taken in. A dwell does not hide or show the source and opens no menu or selection; its popover goes a few seconds after the finger lifts, or at a tap elsewhere. The mouse leaving the pill and its popover, the focus leaving, and Escape put the popover away. A row of the list of the tagz (the tag button among the graph's controls when they sit in the top bar) picks its tag in the graph as a tap on its bubble does. The book (`topBar.resume`, when the site sets it) opens the reader where this reader was; for a reader with no place yet, at the site's `start` when it names one, else, on a site with Flow presets, at the first card of the reading order in force, else at the first item.

In the reader, and fixed too: Next and Previous, the titles either side in the reader's nav row above and below the text, go to the piece after or before; so do the right and left arrow keys (with no modifier held, and not while typing) and a horizontal swipe on a touch screen (which stands aside for a selection, a mostly vertical drag, and a drag on the text while the follow-along highlighter is on). They go along `sequence` edges (a series' next part): a piece that cannot be read yet shows its title and status instead of a button, and an arrow key or a swipe goes only to a neighbour that can be read. On a site that lists Flow presets (`flow.presets`, provisional) they go instead to the nearest card either side in the reading order in force (the one chosen in the main view's panel, Reading order, provisional; else the site's first), passing over a card that cannot be read, a link card and the top bar's own pages; `flow.next: false` (provisional) keeps them on `sequence` edges. Changing the reading order changes Next, Previous and the book's start at once, and moves nothing in the graph.

## The engine's table (the defaults)

These are what the graph did before there was a table, so a site that sets no `bindings` works as it always has.

| target | gesture | action |
|---|---|---|
| `container` | tap | `container.toggle` |
| `container` | doubletap | `view.zoomAtPoint` |
| `container` | drag | `node.move` |
| `node` | tap | `node.select` |
| `node` | doubletap | `node.openReader` |
| `node` | drag | `node.move` (from anywhere but the edge) |
| `node` | drag | `node.resize` (from the edge or a corner) |
| `space` | tap | `view.deselect` |
| `space` | doubletap | `view.zoomAtPoint` |
| `space` | drag | `view.pan` |

`graph.collapseGesture` still works and only changes the first two rows: `"tap"` (the default) is as above; `"doubletap"` makes a double tap on a container `container.toggle` and a single tap on it nothing.

## How a site changes them

`graph.bindings` in the site's `settings.json` is a list of rows:

```json
{ "target": "node", "gesture": "doubletap", "action": "node.openReader" }
```

The site's rows go over the engine's two ways:

1. A site row replaces the engine's rows for the same target and gesture.
2. An action the site binds is bound only where the site binds it. A site that puts `container.toggle` on a double tap has taken it off the single tap.

Everything the site does not touch stays as the engine has it. Two site rows for the same target and gesture: the later one wins (a drag on a card can hold both `node.move` and `node.resize`). `"action": "none"` switches a gesture off.

## Example: The Epic of Elinor Jones

From Harold's note of 2026-10-04: "double tap opens a container, double tap on space zooms in, double tap on node zooms in until text is visible if double tap that, you get reader view", and no resizing of nodes by accidental finger drags. In `~/Projects/epicofelinorjones.com/settings.json`:

```json
"bindings": [
  { "target": "container",     "gesture": "doubletap", "action": "container.toggle" },
  { "target": "space",         "gesture": "doubletap", "action": "view.zoomInStep" },
  { "target": "node",          "gesture": "doubletap", "action": "node.zoomToReadable" },
  { "target": "node.readable", "gesture": "doubletap", "action": "node.openReader" },
  { "target": "node",          "gesture": "drag",      "action": "node.move" },
  { "target": "container",     "gesture": "drag",      "action": "node.move" }
]
```

What that table gives, with the engine's rows it leaves in place:

| target | tap | double tap | drag |
|---|---|---|---|
| `container` | nothing (rule 2: `container.toggle` moved to the double tap) | `container.toggle` | `node.move` |
| `node` | `node.select` (engine's) | `node.zoomToReadable` | `node.move`; no `node.resize`, so no card can be resized by any drag and "Reset sizes" is not in the panel |
| `node.readable` | `node.select` (as `node`) | `node.openReader` | `node.move` (as `node`) |
| `space` | `view.deselect` (engine's) | `view.zoomInStep` | `view.pan` (engine's) |

## Settings these use

| setting | default | what it is |
|---|---|---|
| `graph.bindings` | none | the site's rows, above |
| `graph.collapseGesture` | `"tap"` | which gesture toggles a container in the engine's table |
| `graph.doubleTapMs` | 250 | how long a single tap waits for a second one |
| `graph.longPressMs` | 500 | how long a press is held to be a long press |
| `graph.readablePx` | 16 | the title size, in CSS px, at which a card is `node.readable` and to which `node.zoomToReadable` zooms |
| `cards.listen` | `true` | whether an open card holds the listening strip; `false` leaves it out, and `node.listen` still reads a card when a row binds it |
