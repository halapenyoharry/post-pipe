// What the graph does, by name, and which gesture on which target does it.
//
// The viewer (src/components/GraphViewer) never decides by itself what a
// tap, a double tap, a drag or a long press does: it asks this table for the
// action bound to that gesture on that target and runs the action by its id.
// A site changes what its gestures do in settings.json, graph.bindings, a
// list of rows:
//
//   { "target": "node", "gesture": "doubletap", "action": "node.openReader" }
//
// targets   container       a closed container (its node) or an open one's title
//           node            a card
//           node.readable   a card whose title already renders at
//                           graph.readablePx CSS px or more (default 16);
//                           with no row of its own it does what node does
//           space           the canvas: empty space, an open container's
//                           hull, and (for a double tap) an edge or a tag
// gestures  tap, doubletap, drag, longpress
//
// The engine's own rows (defaultBindings) are what the graph did before
// there was a table, so a site with no bindings works as it always has;
// graph.collapseGesture ('tap' or 'doubletap') still picks which gesture
// opens and closes a container. A site's rows go over them two ways: a row
// replaces the engine's rows for the same target and gesture, and an action
// the site binds is bound only where the site binds it. docs/ACTIONS.md is
// the readable version, with a site's table as the example. Pure, so it can
// be tested.

// kind: which gestures an action can answer: 'press' (tap, doubletap,
// longpress) or 'drag'. targets: where it means something.
const ANY = ['container', 'node', 'node.readable', 'space'];
const CARD = ['node', 'node.readable'];
const ACTIONS = {
  none: { kind: 'any', targets: ANY, does: 'Nothing.' },
  'container.toggle': { kind: 'press', targets: ['container'], does: 'Opens a closed container, or closes an open one.' },
  'view.zoomInStep': { kind: 'press', targets: ANY, does: 'Zooms in one step, the step of the + key (1.25 times), about the point every zoom keeps still (the cover art\'s pivot when the site has one, else the middle of the screen).' },
  'view.zoomAtPoint': { kind: 'press', targets: ANY, does: 'Zooms in about 2 times at the point tapped (out, with shift held); where every zoom is about the cover art\'s pivot, about the pivot.' },
  'node.zoomToReadable': { kind: 'press', targets: CARD, does: 'Zooms in until the card\'s title renders at graph.readablePx CSS px or more (default 16), in the site\'s zoom mode; when that would take the card off the screen, the view also pans so the card stays under the finger.' },
  'node.openReader': { kind: 'press', targets: CARD, does: 'Opens the reader on the card\'s piece.' },
  'node.select': { kind: 'press', targets: CARD, does: 'Opens or closes the card in place (its text inside it) and makes it the card the panel acts on; the reader stays as it is.' },
  'node.move': { kind: 'drag', targets: ['container', 'node', 'node.readable'], does: 'Moves the card, or the container with all it holds, with the pointer or the finger.' },
  'node.resize': { kind: 'drag', targets: CARD, does: 'A drag that starts on a card\'s edge or corner changes its size. Only while it is bound do the cards have edges to drag, and the panel "Reset sizes".' },
  'view.pan': { kind: 'drag', targets: ['space'], does: 'Moves the whole view with the pointer or the finger.' },
  'view.deselect': { kind: 'press', targets: ANY, does: 'Closes the reader, takes off a highlighted tag and hides an edge\'s name.' },
};
const TARGETS = ['container', 'node', 'node.readable', 'space'];
const GESTURES = ['tap', 'doubletap', 'drag', 'longpress'];
const kindOf = (gesture) => (gesture === 'drag' ? 'drag' : 'press');

// The engine's rows: what every gesture did before the table.
function defaultBindings(graphSettings) {
  const doubleOpens = !!graphSettings && graphSettings.collapseGesture === 'doubletap';
  return [
    doubleOpens
      ? { target: 'container', gesture: 'doubletap', action: 'container.toggle' }
      : { target: 'container', gesture: 'tap', action: 'container.toggle' },
    ...(doubleOpens ? [] : [{ target: 'container', gesture: 'doubletap', action: 'view.zoomAtPoint' }]),
    { target: 'container', gesture: 'drag', action: 'node.move' },
    { target: 'node', gesture: 'tap', action: 'node.select' },
    { target: 'node', gesture: 'doubletap', action: 'node.openReader' },
    { target: 'node', gesture: 'drag', action: 'node.move' },
    { target: 'node', gesture: 'drag', action: 'node.resize' },
    { target: 'space', gesture: 'tap', action: 'view.deselect' },
    { target: 'space', gesture: 'doubletap', action: 'view.zoomAtPoint' },
    { target: 'space', gesture: 'drag', action: 'view.pan' },
  ];
}

// A warning said once per page, not once per lookup.
const warned = new Set();
function warnOnce(msg) {
  if (warned.has(msg)) return;
  warned.add(msg);
  if (typeof console !== 'undefined' && console.warn) console.warn(msg);
}

// A site's row as the table keeps it, or null when it names no target or
// gesture the table has. An action the engine does not have, or one that
// cannot answer that gesture on that target, becomes 'none', with a warning.
function rowOf(raw, warn) {
  if (!raw || typeof raw !== 'object') return null;
  const { target, gesture, action } = raw;
  if (!TARGETS.includes(target) || !GESTURES.includes(gesture)) {
    warn(`graph.bindings: no target "${target}" or gesture "${gesture}"; the row is left out (targets: ${TARGETS.join(', ')}; gestures: ${GESTURES.join(', ')})`);
    return null;
  }
  const a = ACTIONS[action];
  if (!a) {
    warn(`graph.bindings: no action "${action}"; ${target} ${gesture} does nothing (see docs/ACTIONS.md)`);
    return { target, gesture, action: 'none' };
  }
  if ((a.kind !== 'any' && a.kind !== kindOf(gesture)) || !a.targets.includes(target)) {
    warn(`graph.bindings: "${action}" cannot answer a ${gesture} on ${target}; it does nothing there`);
    return { target, gesture, action: 'none' };
  }
  return { target, gesture, action };
}

// The table in use: the engine's rows with the site's over them.
function bindingsOf(graphSettings, { warn = warnOnce } = {}) {
  const defaults = defaultBindings(graphSettings);
  const given = graphSettings && Array.isArray(graphSettings.bindings) ? graphSettings.bindings : null;
  if (!given) return defaults;
  const site = given.map((r) => rowOf(r, warn)).filter(Boolean);
  const pairs = new Set(site.map((r) => `${r.target} ${r.gesture}`));
  const named = new Set(site.map((r) => r.action).filter((a) => a !== 'none'));
  const kept = defaults.filter((r) => !pairs.has(`${r.target} ${r.gesture}`) && !named.has(r.action));
  return kept.concat(site);
}

// The action a gesture on a target runs. node.readable with no rows of its
// own does what node does. A target and gesture with two rows: the later
// one, except a drag on a card, which can have two: from the card's edge
// (edge: true) it resizes when node.resize is one of them, and anywhere
// else it does the other. Nothing bound: 'none'.
function resolve(table, target, gesture, { edge = false } = {}) {
  const rowsFor = (t) => (table || []).filter((r) => r.target === t && r.gesture === gesture);
  let rows = rowsFor(target);
  if (!rows.length && target === 'node.readable') rows = rowsFor('node');
  if (gesture === 'drag') {
    if (edge && rows.some((r) => r.action === 'node.resize')) return 'node.resize';
    rows = rows.filter((r) => r.action !== 'node.resize');
  }
  return rows.length ? rows[rows.length - 1].action : 'none';
}

// Whether any row binds the action.
function isBound(table, action) {
  return (table || []).some((r) => r.action === action);
}

// Whether any row uses the gesture (the viewer listens for a long press
// only when one does).
function usesGesture(table, gesture) {
  return (table || []).some((r) => r.gesture === gesture && r.action !== 'none');
}

// Whether a card can be resized at all: the cards draw their resize handles,
// and the panel offers "Reset sizes", only then.
function resizeOn(graphSettings) {
  return isBound(bindingsOf(graphSettings), 'node.resize');
}

module.exports = { ACTIONS, TARGETS, GESTURES, defaultBindings, bindingsOf, resolve, isBound, usesGesture, resizeOn };
