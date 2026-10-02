// A container's look, open and closed alike (containerLook.js).
const test = require('node:test');
const assert = require('node:assert');

const { containerLook, faceFamily, lookFromSettings } = require('../src/components/GraphViewer/containerLook');

test('containerLook: without a look of its own, the engine\'s, as before', () => {
  const c = { id: 'container:act-1', badgeColor: '#d4af37', stroke: 'rgba(212, 175, 55, 0.75)', fill: 'rgba(212, 175, 55, 0.07)' };
  const l = containerLook(c);
  assert.deepStrictEqual(l.closed, {
    fill: 'color-mix(in srgb, #d4af37 16%, var(--pp-macro-base, #151826))',
    fillOpacity: null,
    stroke: '#d4af37',
    glow: '#d4af37',
  });
  assert.deepStrictEqual(l.open, { fill: 'rgba(212, 175, 55, 0.07)', fillOpacity: null, stroke: 'rgba(212, 175, 55, 0.75)' });
  assert.deepStrictEqual(l.label, { face: null, color: null });
  // Nothing at all: the engine's defaults.
  assert.deepStrictEqual(containerLook({}).open, { fill: 'rgba(212, 175, 55, 0.03)', fillOpacity: null, stroke: 'rgba(212, 175, 55, 0.45)' });
});

test('containerLook: its own fill, stroke, face and label colour on the closed node and the open hull alike', () => {
  const c = {
    id: 'container:act-2', badgeColor: '#64ffda', stroke: 'rgba(100, 255, 218, 0.75)', fill: 'rgba(100, 255, 218, 0.06)',
    look: { fill: '#00a7a4', fillOpacity: 0.35, stroke: '#00a7a4', labelFace: 'Dela Gothic One', labelColor: '#66cfcb' },
  };
  const l = containerLook(c);
  assert.deepStrictEqual(l.closed, { fill: '#00a7a4', fillOpacity: 0.35, stroke: '#00a7a4', glow: '#00a7a4' });
  assert.deepStrictEqual(l.open, { fill: '#00a7a4', fillOpacity: 0.35, stroke: '#00a7a4' });
  assert.deepStrictEqual(l.label, { face: "'Dela Gothic One', sans-serif", color: '#66cfcb' });
});

test('containerLook: a fill alone keeps the outlines the container\'s own; stroke none draws none and no glow', () => {
  const c = { badgeColor: '#eb5e28', stroke: 'rgba(235, 94, 40, 0.75)', look: { fill: '#00a7a4' } };
  const l = containerLook(c);
  assert.equal(l.closed.stroke, '#eb5e28');
  assert.equal(l.open.stroke, 'rgba(235, 94, 40, 0.75)');
  assert.equal(l.closed.fillOpacity, null);
  const none = containerLook({ look: { fill: '#00a7a4', stroke: 'none' } });
  assert.equal(none.closed.stroke, 'none');
  assert.equal(none.closed.glow, null);
  assert.equal(none.open.stroke, 'none');
});

test('faceFamily: the face first, a plain fallback after; quotes in a name dropped', () => {
  assert.equal(faceFamily('Dela Gothic One'), "'Dela Gothic One', sans-serif");
  assert.equal(faceFamily("It's"), "'Its', sans-serif");
  assert.equal(faceFamily(''), null);
  assert.equal(faceFamily(undefined), null);
});

test('lookFromSettings: the fields that are set, fillOpacity kept within 0 and 1, null for none', () => {
  assert.deepStrictEqual(lookFromSettings({ fill: ' #00a7a4 ', fillOpacity: '0.35', stroke: '#00a7a4', labelFace: 'Dela Gothic One', labelColor: '#66cfcb', anchor: { x: 0.5, y: 0.9 } }),
    { fill: '#00a7a4', fillOpacity: 0.35, stroke: '#00a7a4', labelFace: 'Dela Gothic One', labelColor: '#66cfcb' });
  assert.deepStrictEqual(lookFromSettings({ fillOpacity: 4 }), { fillOpacity: 1 });
  assert.equal(lookFromSettings({ fillOpacity: '' }), null);
  assert.equal(lookFromSettings({ status: 'soon' }), null);
  assert.equal(lookFromSettings(null), null);
});
