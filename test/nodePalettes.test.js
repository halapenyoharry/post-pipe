// graph.nodePalettes (nodePalettes.js): the node colours a reader can
// choose, and what they colour (containerLook.js).
const test = require('node:test');
const assert = require('node:assert');

const { nodePalettesOf, nodePaletteFor } = require('../src/lib/nodePalettes');
const { containerLook } = require('../src/components/GraphViewer/containerLook');

const GS = {
  nodePalettes: [
    { id: 'teal', label: 'teal', color: '#00a7a4', fillOpacity: 0.35, labelColor: '#66cfcb' },
    { id: 'berry', label: 'berry', color: '#a63e27', fillOpacity: 0.35, labelColor: '#c64a2e' },
  ],
};

test('nodePalettesOf: the valid ones in order, each with its label, fillOpacity within 0 and 1', () => {
  const list = nodePalettesOf({ nodePalettes: [
    ...GS.nodePalettes,
    { id: 'teal', color: '#fff' },            // a second teal: left out
    { id: 'nocolour', label: 'x' },           // no colour: left out
    { color: '#123456' },                     // no id: left out
    { id: 'plain', color: '#123456', fillOpacity: 7 },
    { id: 'bad', color: 'red;}' },            // not a colour
  ] });
  assert.deepStrictEqual(list.map((p) => p.id), ['teal', 'berry', 'plain']);
  assert.equal(list[2].label, 'plain', 'its id when it has no label');
  assert.equal(list[2].fillOpacity, 1);
  assert.equal(list[2].labelColor, '');
  assert.deepStrictEqual(nodePalettesOf({}), []);
  assert.deepStrictEqual(nodePalettesOf(null), []);
});

test('nodePaletteFor: the one chosen, else the first; none without palettes', () => {
  assert.equal(nodePaletteFor(GS, 'berry').id, 'berry');
  assert.equal(nodePaletteFor(GS, null).id, 'teal');
  assert.equal(nodePaletteFor(GS, 'gone').id, 'teal', 'a choice the site no longer has: the first');
  assert.equal(nodePaletteFor({}, 'berry'), null);
});

test('containerLook with a palette: outline and fill in its colour, the fill at its opacity, the labels in its label colour, the face kept', () => {
  const c = {
    badgeColor: '#d4af37', stroke: 'rgba(212, 175, 55, 0.75)', fill: 'rgba(212, 175, 55, 0.07)',
    look: { fill: '#00a7a4', fillOpacity: 0.5, stroke: '#00a7a4', labelFace: 'Dela Gothic One', labelColor: '#66cfcb' },
  };
  const berry = containerLook(c, nodePaletteFor(GS, 'berry'));
  assert.deepStrictEqual(berry.closed, { fill: '#a63e27', fillOpacity: 0.35, stroke: '#a63e27', glow: '#a63e27' });
  assert.deepStrictEqual(berry.open, { fill: '#a63e27', fillOpacity: 0.35, stroke: '#a63e27' });
  assert.deepStrictEqual(berry.label, { face: "'Dela Gothic One', sans-serif", color: '#c64a2e' });
  // Without a label colour, the labels in the palette's colour.
  assert.equal(containerLook(c, { color: '#123456', fillOpacity: 0.2 }).label.color, '#123456');
  // A container with no look of its own takes the palette too.
  assert.deepStrictEqual(containerLook({ badgeColor: '#eb5e28' }, nodePaletteFor(GS, 'teal')).open, { fill: '#00a7a4', fillOpacity: 0.35, stroke: '#00a7a4' });
  // No palette: its own look, as before.
  assert.equal(containerLook(c, null).closed.fillOpacity, 0.5);
});
