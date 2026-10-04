// The graph's named actions and the table of gestures that run them
// (src/lib/actions.js, graph.bindings), and docs/ACTIONS.md beside them.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const { ACTIONS, defaultBindings, bindingsOf, resolve, isBound, usesGesture, resizeOn } = require('../src/lib/actions');

// The table on epicofelinorjones.com (its settings.json), from Harold's
// note of 2026-10-04.
const SITE = [
  { target: 'container', gesture: 'doubletap', action: 'container.toggle' },
  { target: 'space', gesture: 'doubletap', action: 'view.zoomInStep' },
  { target: 'node', gesture: 'doubletap', action: 'node.zoomToReadable' },
  { target: 'node.readable', gesture: 'doubletap', action: 'node.openReader' },
  { target: 'node', gesture: 'drag', action: 'node.move' },
  { target: 'container', gesture: 'drag', action: 'node.move' },
];

const quiet = () => {};

test('the engine\'s own table does what the graph did before there was one', () => {
  const t = bindingsOf({});
  assert.deepStrictEqual(t, defaultBindings({}));
  assert.equal(resolve(t, 'container', 'tap'), 'container.toggle');
  assert.equal(resolve(t, 'container', 'doubletap'), 'view.zoomAtPoint');
  assert.equal(resolve(t, 'container', 'drag'), 'node.move');
  assert.equal(resolve(t, 'node', 'tap'), 'node.select');
  assert.equal(resolve(t, 'node', 'doubletap'), 'node.openReader');
  assert.equal(resolve(t, 'node', 'drag'), 'node.move');
  assert.equal(resolve(t, 'node', 'drag', { edge: true }), 'node.resize');
  assert.equal(resolve(t, 'space', 'tap'), 'view.deselect');
  assert.equal(resolve(t, 'space', 'doubletap'), 'view.zoomAtPoint');
  assert.equal(resolve(t, 'space', 'drag'), 'view.pan');
  assert.equal(resolve(t, 'node', 'longpress'), 'none');
  assert.ok(resizeOn({}) && resizeOn(null) && resizeOn(undefined));
  assert.equal(usesGesture(t, 'longpress'), false);
});

test('a readable card with no rows of its own does what a card does', () => {
  const t = bindingsOf({});
  for (const g of ['tap', 'doubletap', 'drag']) assert.equal(resolve(t, 'node.readable', g), resolve(t, 'node', g));
  assert.equal(resolve(t, 'node.readable', 'drag', { edge: true }), 'node.resize');
});

test('collapseGesture still picks the gesture that opens a container', () => {
  const tap = bindingsOf({ collapseGesture: 'tap' });
  assert.equal(resolve(tap, 'container', 'tap'), 'container.toggle');
  assert.equal(resolve(tap, 'container', 'doubletap'), 'view.zoomAtPoint');
  const dbl = bindingsOf({ collapseGesture: 'doubletap' });
  assert.equal(resolve(dbl, 'container', 'doubletap'), 'container.toggle');
  assert.equal(resolve(dbl, 'container', 'tap'), 'none', 'a single tap on a container does nothing then');
  assert.equal(resolve(dbl, 'space', 'doubletap'), 'view.zoomAtPoint', 'the rest as before');
  assert.equal(resolve(dbl, 'node', 'doubletap'), 'node.openReader');
  const other = bindingsOf({ collapseGesture: 'sideways' });
  assert.equal(resolve(other, 'container', 'tap'), 'container.toggle', 'anything else is the default, tap');
});

test('a site\'s rows go over the engine\'s: Harold\'s table', () => {
  const t = bindingsOf({ collapseGesture: 'tap', bindings: SITE }, { warn: quiet });
  assert.equal(resolve(t, 'container', 'doubletap'), 'container.toggle');
  assert.equal(resolve(t, 'container', 'tap'), 'none', 'the site moved container.toggle to the double tap, so a single tap no longer opens');
  assert.equal(resolve(t, 'container', 'drag'), 'node.move');
  assert.equal(resolve(t, 'space', 'doubletap'), 'view.zoomInStep');
  assert.equal(resolve(t, 'space', 'tap'), 'view.deselect', 'not named by the site: the engine\'s');
  assert.equal(resolve(t, 'space', 'drag'), 'view.pan');
  assert.equal(resolve(t, 'node', 'tap'), 'node.select', 'single taps select only');
  assert.equal(resolve(t, 'node', 'doubletap'), 'node.zoomToReadable');
  assert.equal(resolve(t, 'node.readable', 'doubletap'), 'node.openReader');
  assert.equal(resolve(t, 'node.readable', 'tap'), 'node.select');
  assert.equal(resolve(t, 'node', 'drag'), 'node.move');
  assert.equal(resolve(t, 'node', 'drag', { edge: true }), 'node.move', 'from the edge it moves the card too');
  assert.equal(isBound(t, 'node.resize'), false, 'nothing binds node.resize');
  assert.equal(resizeOn({ bindings: SITE }), false);
  assert.equal(isBound(t, 'node.openReader'), true);
});

test('a site row replaces the engine\'s rows for its target and gesture, and a bound action stays where the site puts it', () => {
  const t = bindingsOf({ bindings: [{ target: 'space', gesture: 'tap', action: 'view.zoomInStep' }] }, { warn: quiet });
  assert.equal(resolve(t, 'space', 'tap'), 'view.zoomInStep');
  assert.equal(resolve(t, 'node', 'tap'), 'node.select');
  const moved = bindingsOf({ bindings: [{ target: 'node', gesture: 'tap', action: 'node.openReader' }] }, { warn: quiet });
  assert.equal(resolve(moved, 'node', 'tap'), 'node.openReader');
  assert.equal(resolve(moved, 'node', 'doubletap'), 'none', 'node.openReader is only where the site put it');
  const off = bindingsOf({ bindings: [{ target: 'node', gesture: 'doubletap', action: 'none' }] }, { warn: quiet });
  assert.equal(resolve(off, 'node', 'doubletap'), 'none', 'none unbinds a gesture');
  assert.equal(resolve(off, 'node', 'tap'), 'node.select');
  const last = bindingsOf({ bindings: [
    { target: 'space', gesture: 'tap', action: 'view.zoomInStep' },
    { target: 'space', gesture: 'tap', action: 'view.deselect' },
  ] }, { warn: quiet });
  assert.equal(resolve(last, 'space', 'tap'), 'view.deselect', 'of two rows for one gesture, the later');
  const lp = bindingsOf({ bindings: [{ target: 'node', gesture: 'longpress', action: 'node.openReader' }] }, { warn: quiet });
  assert.equal(usesGesture(lp, 'longpress'), true);
  assert.equal(resolve(lp, 'node', 'longpress'), 'node.openReader');
});

test('an action the engine does not have does nothing, with a warning', () => {
  const said = [];
  const t = bindingsOf({ bindings: [{ target: 'node', gesture: 'doubletap', action: 'node.explode' }] }, { warn: (m) => said.push(m) });
  assert.equal(resolve(t, 'node', 'doubletap'), 'none');
  assert.equal(said.length, 1);
  assert.match(said[0], /node\.explode/);
  // The default warning goes to the console, once.
  const orig = console.warn;
  const logged = [];
  console.warn = (m) => logged.push(m);
  try {
    const gs = { bindings: [{ target: 'space', gesture: 'tap', action: 'view.somersault' }] };
    assert.equal(resolve(bindingsOf(gs), 'space', 'tap'), 'none');
    bindingsOf(gs);
  } finally { console.warn = orig; }
  assert.equal(logged.length, 1);
  assert.match(logged[0], /view\.somersault/);
});

test('an action that cannot answer that gesture on that target does nothing, with a warning', () => {
  const said = [];
  const t = bindingsOf({ bindings: [
    { target: 'node', gesture: 'tap', action: 'node.move' },          // a drag action on a tap
    { target: 'space', gesture: 'doubletap', action: 'node.openReader' }, // a card action on space
    { target: 'container', gesture: 'drag', action: 'view.pan' },      // only space pans
  ] }, { warn: (m) => said.push(m) });
  assert.equal(resolve(t, 'node', 'tap'), 'none');
  assert.equal(resolve(t, 'space', 'doubletap'), 'none');
  assert.equal(resolve(t, 'container', 'drag'), 'none');
  assert.equal(said.length, 3);
});

test('a row with no such target or gesture is left out, with a warning', () => {
  const said = [];
  const t = bindingsOf({ bindings: [
    { target: 'edge', gesture: 'tap', action: 'none' },
    { target: 'node', gesture: 'triple', action: 'node.openReader' },
    null,
    'node tap',
  ] }, { warn: (m) => said.push(m) });
  assert.deepStrictEqual(t, defaultBindings({}));
  assert.equal(said.length, 2);
});

test('docs/ACTIONS.md names every action and every target', () => {
  const doc = fs.readFileSync(path.join(__dirname, '../docs/ACTIONS.md'), 'utf8');
  for (const id of Object.keys(ACTIONS)) assert.ok(doc.includes('`' + id + '`'), `${id} in docs/ACTIONS.md`);
  for (const t of ['container', 'node', 'node.readable', 'space']) assert.ok(doc.includes('`' + t + '`'), `${t} in docs/ACTIONS.md`);
});
