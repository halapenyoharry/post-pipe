// The graph's controls (settings.toolbar): where they sit and which groups
// show, and the rows of the dimensions menu they use when they sit in the
// top bar.
//
//   "toolbar": { "position": "bottom" | "top", "show": { "history": true, "layout": true, "dimensions": true } }
//
// position bottom (default): the bar along the bottom (src/components/Toolbar).
// position top: no bottom bar; undo, redo, Reset and the dimensions menu join
// the top bar as icon buttons, and the layout (when shown) is a row in that
// menu. show: each group on unless set false.

const GRANULARITIES = ['auto', 'day', 'week', 'month', 'year'];

const VIEW_ACTIONS = [
  { event: 'graph:zoom-to-fit', label: 'Zoom to fit', title: 'Frame every node' },
  { event: 'graph:unpin-all', label: 'Unpin all', title: 'Release every dragged node' },
  { event: 'graph:reset-sizes', label: 'Reset sizes', title: 'Return every card to its default size' },
];

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

// The menu's rows, top to bottom:
//   { kind: 'dimension', id, label, title, checked }   one per dimension
//   { kind: 'layer', id, label, title, checked }        an edge layer's switch
//   { kind: 'granularity', value }                      when the dimension on has one
//   { kind: 'divider' }
//   { kind: 'action', event, label, title }            the view actions
//   { kind: 'layout', options: [{ id, label, title, checked }] }   when show.layout
// heading is the group label with dimensions, else "View".
function menuModel({ dimensions = [], layers = [], axis = {}, preferences = {}, show = {}, layouts = [], layout, group = 'dimensions' }) {
  const rows = [];
  const current = axis.dimension || 'time';
  if (show.dimensions !== false) {
    for (const d of dimensions) rows.push({ kind: 'dimension', id: d.id, label: d.label, title: d.title, checked: !!axis.on && current === d.id });
    for (const d of layers) rows.push({ kind: 'layer', id: d.id, label: d.label, title: d.title, checked: preferences[d.id] === true });
    if (hasGranularity(axis)) rows.push({ kind: 'granularity', value: axis.granularity || 'auto' });
    rows.push({ kind: 'divider' });
  }
  for (const a of VIEW_ACTIONS) rows.push({ kind: 'action', ...a });
  if (show.layout !== false && layouts.length) {
    rows.push({ kind: 'layout', options: layouts.map((l) => ({ id: l.id, label: l.label, title: l.title, checked: layout === l.id })) });
  }
  return { heading: show.dimensions !== false ? group : 'view', rows };
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

module.exports = { GRANULARITIES, VIEW_ACTIONS, RESET_TITLE, toolbarConfig, hasGranularity, toggleDimension, nextGranularity, menuModel, menuMove };
