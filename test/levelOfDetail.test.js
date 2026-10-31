// The graph's level of detail and the size a card is drawn at
// (src/components/GraphViewer/levelOfDetail.js): at every zoom a card is a
// card with its title, at its own size; there is no far level where it turns
// into a 16x16 dot (Harold, 2026-10-31: "the nodes should NEVER disappear").

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { LOD_TITLE, getLOD, makeCardSizeFor } = require('../src/components/GraphViewer/levelOfDetail');

// Zooms from far past the keys' limit (0.04) to past their top (8), in
// steps of a sixteenth of a doubling, and the ones named in the report.
const ZOOMS = [0, 1e-4, 0.001, 0.01, 0.04, 0.05, 0.1, 0.2, 0.28, 0.34, 0.35, 0.36, 0.5, 0.59, 0.6, 1, 8, 100];
for (let i = -14 * 16; i <= 7 * 16; i++) ZOOMS.push(2 ** (i / 16));

// GraphViewer's own defaults for graph.card.
const ENGINE_CARD = { width: 180, height: 140, hoverWidth: 200, hoverHeight: 160,
  pinnedWidth: 230, pinnedHeight: 190, minWidth: 110, minHeight: 80,
  maxWidth: 620, maxHeight: 520, glowPadding: 16 };
const EXAMPLE_CARD = { ...ENGINE_CARD,
  ...JSON.parse(fs.readFileSync(path.join(__dirname, '../examples/site/settings.json'), 'utf8')).graph.card };
const SMALL_CARD = { ...ENGINE_CARD, width: 120, height: 90, hoverWidth: 130, hoverHeight: 100, pinnedWidth: 150, pinnedHeight: 120 };

test('two levels: title below LOD_TITLE, full at it and above', () => {
  assert.strictEqual(LOD_TITLE, 0.6);
  assert.strictEqual(getLOD(0.59), 'title');
  assert.strictEqual(getLOD(0.6), 'full');
  assert.strictEqual(getLOD(1), 'full');
  // One wheel step out from 0.35, where the cards turned into dots.
  assert.strictEqual(getLOD(0.34), 'title');
  assert.strictEqual(getLOD(0.28), 'title');
  assert.strictEqual(getLOD(0.1), 'title');
  assert.strictEqual(getLOD(0.04), 'title');
});

test('getLOD never returns marker, at any zoom', () => {
  for (const k of ZOOMS) {
    const lod = getLOD(k);
    assert.notStrictEqual(lod, 'marker', `zoom ${k}`);
    assert.ok(lod === 'title' || lod === 'full', `zoom ${k} gave ${lod}`);
    assert.strictEqual(lod, k < LOD_TITLE ? 'title' : 'full', `zoom ${k}`);
  }
});

test('no card is sized 16x16 at any zoom, in any state', () => {
  for (const CARD of [ENGINE_CARD, EXAMPLE_CARD, SMALL_CARD]) {
    const sizeFor = makeCardSizeFor(CARD);
    for (const k of ZOOMS) {
      const lod = getLOD(k);
      for (const hovered of [false, true]) {
        for (const pinned of [false, true]) {
          const s = sizeFor({ hovered, pinned, lod });
          assert.ok(!(s.width === 16 && s.height === 16), `16x16 at zoom ${k}, hovered ${hovered}, pinned ${pinned}`);
          assert.ok(s.width >= CARD.minWidth && s.height >= CARD.minHeight, `under the card's minimum at zoom ${k}`);
        }
      }
    }
  }
});

test('a card is the size its state gives it, the same at every zoom', () => {
  for (const CARD of [ENGINE_CARD, EXAMPLE_CARD, SMALL_CARD]) {
    const sizeFor = makeCardSizeFor(CARD);
    for (const k of ZOOMS) {
      const lod = getLOD(k);
      assert.deepStrictEqual(sizeFor({ hovered: false, pinned: false, lod }), { width: CARD.width, height: CARD.height });
      assert.deepStrictEqual(sizeFor({ hovered: true, pinned: false, lod }), { width: CARD.hoverWidth, height: CARD.hoverHeight });
      assert.deepStrictEqual(sizeFor({ hovered: false, pinned: true, lod }), { width: CARD.pinnedWidth, height: CARD.pinnedHeight });
      assert.deepStrictEqual(sizeFor({ hovered: true, pinned: true, lod }), { width: CARD.pinnedWidth, height: CARD.pinnedHeight }, 'open wins over the pointer');
    }
  }
});

test('a caller still asking for the old marker level gets the card itself', () => {
  const sizeFor = makeCardSizeFor(ENGINE_CARD);
  assert.deepStrictEqual(sizeFor({ hovered: false, pinned: false, lod: 'marker' }), { width: 180, height: 140 });
  assert.deepStrictEqual(sizeFor(), { width: 180, height: 140 }, 'no state: at rest');
});
