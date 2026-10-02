// The two screens of the cover (settings.opening): the art state with the
// plant across the screen's width, the graph state with the roots edge to
// edge, the title set to the widths it names and the byline to its last
// line's, the top bar in the graph state alone, and the way back above the
// crown.

const test = require('node:test');
const assert = require('node:assert');
const {
  openingConfig, coverGeometry, inkSpan, widestInkRow, lastInkRow, fitTitle, titleLayout,
} = require('../src/lib/opening');

const SITE = {
  opening: {
    enabled: true, mode: 'two-state',
    art: { artState: 'a.png', graphState: 'g.png' },
    byline: { text: 'by someone', gap: 0.1 },
    crownY: 0.63,
    top: { art: 44, graph: 6 },
    fit: 'width',
    sideMargin: 14,
    returnAbove: 'crown',
    graph: { artStateOpacity: 0, rootsFit: 'width' },
    title: {
      fit: 'width',
      art: { lines: [{ x: 0.27, y: 0.45, width: 0.46, spans: [{ text: 'Elinor', size: 0.14 }] }, { x: 0.27, y: 0.5, width: 0.47, spans: [{ text: 'Jones', size: 0.13 }] }] },
      graph: { lines: [{ x: 0.1, y: 0.61, width: 0.75, spans: [{ text: 'The', size: 0.03, rise: 0.03 }, { text: ' Epic', size: 0.06 }] }] },
    },
  },
  topBar: { band: { color: 'rgba(150, 150, 150, 0.16)' } },
};
const ART = { w: 1045, h: 2111 };
const INK = { art: 0, graph: 0.42, bottom: 1, bush: { l: 0.05, r: 0.97 }, roots: { l: 0.003, r: 0.93 } };
const close = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

test('settings: fit, sideMargin, rootsFit, returnAbove, topBarInArt and the band, with their defaults', () => {
  const c = openingConfig(SITE);
  assert.equal(c.fit, 'width');
  assert.equal(c.sideMargin, 14);
  assert.equal(c.graph.rootsFit, 'width');
  assert.equal(c.graph.artStateOpacity, 0, 'a site can hide the graph in the art state');
  assert.equal(c.returnAbove, 'crown');
  assert.equal(c.topBarInArt, false, 'the top bar is in the graph state alone by default');
  assert.deepStrictEqual(c.band, { color: 'rgba(150, 150, 150, 0.16)' });
  assert.equal(c.title.fit, 'width');
  assert.equal(c.title.art.lines[0].width, 0.46);
  const bare = openingConfig({ opening: { enabled: true, art: { full: 'a.png' } } });
  assert.equal(bare.fit, 'height');
  assert.equal(bare.graph.rootsFit, null);
  assert.equal(bare.returnAbove, null);
  assert.equal(bare.band, null);
  const noCrown = openingConfig({ opening: { ...SITE.opening, crownY: undefined } });
  assert.equal(noCrown.returnAbove, null, 'the way back above the crown needs a crown');
  assert.equal(openingConfig({ ...SITE, topBar: { band: { color: 'red; x: y' } } }).band, null, 'not a colour');
  assert.equal(openingConfig({ opening: { ...SITE.opening, topBarInArt: true } }).topBarInArt, true);
});

test('ink: its columns over some rows, its widest row, its last row', () => {
  // 6 x 4: row 0 ink at x 2; row 2 ink from x 1 to 4; row 3 none.
  const w = 6, h = 4;
  const px = new Uint8ClampedArray(w * h * 4);
  const ink = (x, y, a = 255) => { px[(y * w + x) * 4 + 3] = a; };
  ink(2, 0); ink(1, 2); ink(4, 2); ink(3, 1, 20);
  assert.deepStrictEqual(inkSpan(px, w, h, 0, 0.5), { l: 2 / 6, r: 3 / 6 });
  assert.deepStrictEqual(inkSpan(px, w, h, 0, 1), { l: 1 / 6, r: 5 / 6 });
  assert.equal(inkSpan(px, w, h, 0.75, 1), null);
  assert.deepStrictEqual(widestInkRow(px, w, h, 0, 1), { l: 1 / 6, r: 5 / 6, y: 0.5 });
  assert.equal(lastInkRow(px, w, h), 0.75);
  assert.equal(lastInkRow(new Uint8ClampedArray(16), 2, 2), 0);
});

test('fit width: the plant spans the screen less its margins on a phone; on a wide screen no larger than keeps the crown on it', () => {
  const c = openingConfig(SITE);
  const phone = coverGeometry(c, { vw: 390, vh: 844, art: ART, ink: INK, controls: 48 }, 0);
  const bushL = phone.art.left + INK.bush.l * phone.art.width;
  const bushR = phone.art.left + INK.bush.r * phone.art.width;
  assert.ok(close(bushL, 14) && close(bushR, 376), `the plant from 14 to 376 px (${bushL}, ${bushR})`);
  assert.ok(close(phone.art.top, 44), 'the plant 44 px under the screen top, the top bar not there');
  const crownPhone = phone.art.top + 0.63 * phone.art.height;
  assert.ok(crownPhone < 844, 'the crown on the screen');
  const desk = coverGeometry(c, { vw: 1280, vh: 800, art: ART, ink: INK, bottom: 60 }, 0);
  const crownDesk = desk.art.top + 0.63 * desk.art.height;
  assert.ok(close(crownDesk, 740), `on a desktop the crown at the screen's foot over the kept space (${crownDesk})`);
  assert.ok(close(desk.art.left + ((INK.bush.l + INK.bush.r) / 2) * desk.art.width, 640), 'centred');
});

test('roots fit width: the widest row of roots edge to edge in the graph state, under the band; scaled between the states', () => {
  const c = openingConfig(SITE);
  const view = { vw: 390, vh: 844, art: ART, ink: INK, controls: 52 };
  const g = coverGeometry(c, view, 1);
  assert.ok(close(g.art.left + INK.roots.l * g.art.width, 0) && close(g.art.left + INK.roots.r * g.art.width, 390), 'roots edge to edge');
  assert.ok(close(g.art.top + INK.graph * g.art.height, 58), 'the small plant 6 px under the band');
  const a = coverGeometry(c, view, 0);
  const mid = coverGeometry(c, view, 0.5);
  assert.ok(close(mid.art.scale, (a.art.scale + g.art.scale) / 2), 'the scale moves with p');
  assert.ok(a.travel > 0);
  const desk = coverGeometry(c, { vw: 1280, vh: 800, art: ART, ink: INK, controls: 52, bottom: 60 }, 1);
  assert.ok(close(desk.art.top + desk.art.height, 740), 'on a desktop the whole graph-state image fits the height');
  assert.ok(desk.art.width * (INK.roots.r - INK.roots.l) < 1280);
  // Without fit or rootsFit, one scale throughout, as before.
  const plain = openingConfig({ opening: { ...SITE.opening, fit: undefined, graph: { artOffset: 0.33 } } });
  const p0 = coverGeometry(plain, view, 0), p1 = coverGeometry(plain, view, 1);
  assert.equal(p0.art.scale, p1.art.scale);
  assert.equal(p0.art.left, (390 - p0.art.width) / 2);
});

test('the graph is not shown in the art state when artStateOpacity is 0, and at full strength in the graph state', () => {
  const c = openingConfig(SITE);
  const view = { vw: 390, vh: 844, art: ART, ink: INK };
  assert.equal(coverGeometry(c, view, 0).layer.opacity, 0);
  assert.equal(coverGeometry(c, view, 1).layer.opacity, 1);
});

test('title fit width: each line scaled to its width as measured; the byline set to the last line width, under it', () => {
  const c = openingConfig(SITE);
  // As drawn at their set sizes: Elinor 400 px, Jones 500 px, the graph line 700 px.
  const fitted = fitTitle(c.title, { art: [400, 500], graph: [700] }, ART.w);
  const k0 = (0.46 * 1045) / 400, k1 = (0.47 * 1045) / 500, kg = (0.75 * 1045) / 700;
  assert.ok(close(fitted.art.lines[0].spans[0].size, 0.14 * k0));
  assert.ok(close(fitted.art.lines[1].spans[0].size, 0.13 * k1));
  assert.ok(close(fitted.graph.lines[0].spans[1].size, 0.06 * kg));
  assert.equal(fitted.graph.lines[0].spans[0].rise, 0.03, 'a rise is kept');
  assert.equal(fitTitle(c.title, { art: [0, 500], graph: [] }, ART.w).art.lines[0], c.title.art.lines[0], 'unmeasured lines keep their sizes');
  assert.equal(fitTitle({ ...c.title, fit: null }, { art: [1, 1], graph: [1] }, ART.w).art, c.title.art, 'off without fit');
  const box = { left: 0, top: 0, width: 400, height: 808 };
  assert.ok(close(titleLayout(fitted.art, box).lines[1].width, 0.47 * 400));
  // The byline: 9 px wide per px of its size.
  const conf = { ...c, title: fitted };
  for (const p of [0, 1]) {
    const g = coverGeometry(conf, { vw: 390, vh: 844, art: ART, ink: INK, controls: 52, perPx: 9 }, p);
    const lines = (p ? fitted.graph : fitted.art).lines;
    const last = lines[lines.length - 1];
    assert.ok(close(g.byline.size * 9, last.width * g.art.width), `as wide as the last line (p ${p})`);
    assert.ok(close(g.byline.x, g.art.left + last.x * g.art.width), 'at its left edge');
    assert.ok(g.byline.y > g.art.top + last.y * g.art.height, 'under its baseline');
    assert.equal(g.byline.under, 'title');
  }
});
