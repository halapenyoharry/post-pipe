// The graph's controls (settings.toolbar): where they sit and which groups
// show, and the rows of the dimensions menu they use when they sit in the
// top bar.
//
//   "toolbar": { "position": "bottom" | "top", "show": { "history": true, "layout": true, "dimensions": true } }
//
// position bottom (default): the bar along the bottom (src/components/Toolbar).
// position top: no bottom bar; undo, redo, Reset and the dimensions menu join
// the top bar as icon buttons, then the sliders that open the main view's
// panel, where the view actions and the layout (when shown) are. show: each
// group on unless set false.

const { resizeOn } = require('./actions');

const GRANULARITIES = ['auto', 'day', 'week', 'month', 'year'];

const VIEW_ACTIONS = [
  { event: 'graph:zoom-to-fit', label: 'Zoom to fit', title: 'Frame every node' },
  { event: 'graph:unpin-all', label: 'Unpin all', title: 'Release every dragged node' },
  { event: 'graph:reset-sizes', label: 'Reset sizes', title: 'Return every card to its default size' },
];

// The view actions a site's panel and bar offer: "Reset sizes" only while a
// card can be resized at all (graph.bindings binds node.resize,
// src/lib/actions.js).
function viewActionsFor(settings) {
  const graph = settings && settings.graph && typeof settings.graph === 'object' ? settings.graph : {};
  return VIEW_ACTIONS.filter((a) => a.event !== 'graph:reset-sizes' || resizeOn(graph));
}

const RESET_TITLE = 'Reset: layout, zoom, rotation, open and closed containers, and selection, back to how the site starts (Undo brings the arrangement back)';

// settings.toolbar with its defaults. features (the embed's switches), when
// given, can turn a group off too.
function toolbarConfig(settings, features) {
  const t = (settings && settings.toolbar && typeof settings.toolbar === 'object') ? settings.toolbar : {};
  const s = (t.show && typeof t.show === 'object') ? t.show : {};
  const f = features || {};
  return {
    position: t.position === 'top' ? 'top' : 'bottom',
    show: {
      history: s.history !== false && f.undoRedo !== false,
      layout: s.layout !== false && f.layoutControls !== false,
      dimensions: s.dimensions !== false && f.dimensions !== false,
    },
  };
}

// The dimensions with a bucket size.
const hasGranularity = (axis) => !!(axis && axis.on && (axis.dimension === 'chronology' || axis.dimension === 'commits'));

// What a tap on a dimension does to the time axis: on, or off when it is the
// one already on (one at a time).
function toggleDimension(axis, id) {
  const current = (axis && axis.dimension) || 'time';
  return axis && axis.on && current === id ? { on: false } : { on: true, dimension: id };
}

// The bucket size after this one.
function nextGranularity(g) {
  const i = GRANULARITIES.indexOf(g || 'auto');
  return GRANULARITIES[(i + 1) % GRANULARITIES.length];
}

// The menu's rows, top to bottom (the timelines and their bucket size; the
// view actions and the layout are in the main view's panel,
// src/components/Settings):
//   { kind: 'dimension', id, label, title, checked }   one per dimension
//   { kind: 'layer', id, label, title, checked }        an edge layer's switch
//   { kind: 'granularity', value }                      when the dimension on has one
// heading is the group label. No rows without dimensions: then the menu and
// its button are left out.
function menuModel({ dimensions = [], layers = [], axis = {}, preferences = {}, show = {}, group = 'dimensions' }) {
  const rows = [];
  const current = axis.dimension || 'time';
  if (show.dimensions !== false) {
    for (const d of dimensions) rows.push({ kind: 'dimension', id: d.id, label: d.label, title: d.title, checked: !!axis.on && current === d.id });
    for (const d of layers) rows.push({ kind: 'layer', id: d.id, label: d.label, title: d.title, checked: preferences[d.id] === true });
    if (hasGranularity(axis)) rows.push({ kind: 'granularity', value: axis.granularity || 'auto' });
  }
  return { heading: group, rows };
}

// The menu's focus after a key: ArrowDown and ArrowUp move (and wrap), Home
// and End go to the ends. null for any other key.
function menuMove(index, key, count) {
  if (!count) return null;
  const i = Number.isInteger(index) && index >= 0 ? index : -1;
  if (key === 'ArrowDown') return (i + 1) % count;
  if (key === 'ArrowUp') return i <= 0 ? count - 1 : i - 1;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return null;
}

module.exports = { GRANULARITIES, VIEW_ACTIONS, viewActionsFor, RESET_TITLE, toolbarConfig, hasGranularity, toggleDimension, nextGranularity, menuModel, menuMove };
