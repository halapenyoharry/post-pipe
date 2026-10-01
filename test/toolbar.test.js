// The graph's controls: where they sit (toolbar.position), which groups show
// (toolbar.show, and the embed's switches), and the dimensions menu's rows
// and keys when they sit in the top bar.

const { test } = require('node:test');
const assert = require('node:assert');
const { toolbarConfig, menuModel, menuMove, toggleDimension, nextGranularity, VIEW_ACTIONS } = require('../src/lib/toolbar');

test('position: bottom by default, top only when set so', () => {
  assert.strictEqual(toolbarConfig(null).position, 'bottom');
  assert.strictEqual(toolbarConfig({}).position, 'bottom');
  assert.strictEqual(toolbarConfig({ toolbar: { position: 'top' } }).position, 'top');
  assert.strictEqual(toolbarConfig({ toolbar: { position: 'left' } }).position, 'bottom');
  assert.strictEqual(toolbarConfig({ toolbar: 'top' }).position, 'bottom');
});

test('show: every group on by default; false turns one off, at the top as at the bottom', () => {
  assert.deepStrictEqual(toolbarConfig({}).show, { history: true, layout: true, dimensions: true });
  const top = toolbarConfig({ toolbar: { position: 'top', show: { layout: false } } });
  assert.strictEqual(top.position, 'top');
  assert.deepStrictEqual(top.show, { history: true, layout: false, dimensions: true });
  assert.deepStrictEqual(toolbarConfig({ toolbar: { show: { history: false, dimensions: false } } }).show, { history: false, layout: true, dimensions: false });
});

test('show: the embed\'s switches can turn a group off as well', () => {
  const c = toolbarConfig({ toolbar: { position: 'top' } }, { undoRedo: false, layoutControls: true, dimensions: true });
  assert.deepStrictEqual(c.show, { history: false, layout: true, dimensions: true });
});

const DIMS = [
  { id: 'time', label: 'published', title: 't' },
  { id: 'commits', label: 'revisions', title: 'c' },
  { id: 'chronology', label: 'chronology', title: 'h' },
];
const LAYOUTS = [{ id: 'force', label: 'cluster', title: 'a' }, { id: 'radial', label: 'ring', title: 'b' }];

test('menu: a checkbox row per dimension, checked when its axis is on; then the view actions; the layout when shown', () => {
  const m = menuModel({ dimensions: DIMS, axis: { on: true, dimension: 'commits', granularity: 'week' }, show: {}, layouts: LAYOUTS, layout: 'radial', group: 'timelines' });
  assert.strictEqual(m.heading, 'timelines');
  assert.deepStrictEqual(m.rows.map((r) => r.kind), ['dimension', 'dimension', 'dimension', 'granularity', 'divider', 'action', 'action', 'action', 'layout']);
  assert.deepStrictEqual(m.rows.filter((r) => r.kind === 'dimension').map((r) => r.checked), [false, true, false]);
  assert.strictEqual(m.rows[3].value, 'week');
  assert.deepStrictEqual(m.rows.filter((r) => r.kind === 'action').map((r) => r.event), VIEW_ACTIONS.map((a) => a.event));
  assert.deepStrictEqual(m.rows[8].options.map((o) => [o.label, o.checked]), [['cluster', false], ['ring', true]]);
});

test('menu: no bucket size for a dimension without one, nor with the axis off; no layout row when it is hidden', () => {
  const off = menuModel({ dimensions: DIMS, axis: { on: false, dimension: 'commits' }, show: { layout: false }, layouts: LAYOUTS });
  assert.ok(!off.rows.some((r) => r.kind === 'granularity'));
  assert.ok(!off.rows.some((r) => r.kind === 'layout'));
  assert.ok(off.rows.filter((r) => r.kind === 'dimension').every((r) => !r.checked));
  const time = menuModel({ dimensions: DIMS, axis: { on: true, dimension: 'time' }, show: {} });
  assert.ok(!time.rows.some((r) => r.kind === 'granularity'));
  assert.strictEqual(time.rows[0].checked, true);
});

test('menu: an edge layer is its own switch; without dimensions the menu is the view actions, headed view', () => {
  const m = menuModel({ dimensions: DIMS, layers: [{ id: 'readers', label: 'readers' }], preferences: { readers: true }, axis: {}, show: {} });
  const layer = m.rows.find((r) => r.kind === 'layer');
  assert.deepStrictEqual([layer.id, layer.checked], ['readers', true]);
  const v = menuModel({ dimensions: DIMS, axis: {}, show: { dimensions: false, layout: false }, layouts: LAYOUTS });
  assert.strictEqual(v.heading, 'view');
  assert.deepStrictEqual(v.rows.map((r) => r.kind), ['action', 'action', 'action']);
});

test('a dimension tap: on, or off when it is the one on; one at a time', () => {
  assert.deepStrictEqual(toggleDimension({ on: false }, 'commits'), { on: true, dimension: 'commits' });
  assert.deepStrictEqual(toggleDimension({ on: true, dimension: 'commits' }, 'commits'), { on: false });
  assert.deepStrictEqual(toggleDimension({ on: true, dimension: 'commits' }, 'time'), { on: true, dimension: 'time' });
  assert.deepStrictEqual(toggleDimension({ on: true }, 'time'), { on: false });
});

test('bucket size cycles auto, day, week, month, year', () => {
  assert.strictEqual(nextGranularity(undefined), 'day');
  assert.strictEqual(nextGranularity('month'), 'year');
  assert.strictEqual(nextGranularity('year'), 'auto');
});

test('menu keys: arrows move and wrap, Home and End go to the ends, others do nothing', () => {
  assert.strictEqual(menuMove(-1, 'ArrowDown', 5), 0);
  assert.strictEqual(menuMove(4, 'ArrowDown', 5), 0);
  assert.strictEqual(menuMove(0, 'ArrowUp', 5), 4);
  assert.strictEqual(menuMove(-1, 'ArrowUp', 5), 4);
  assert.strictEqual(menuMove(2, 'Home', 5), 0);
  assert.strictEqual(menuMove(2, 'End', 5), 4);
  assert.strictEqual(menuMove(2, 'a', 5), null);
  assert.strictEqual(menuMove(0, 'ArrowDown', 0), null);
});
