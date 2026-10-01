// The two-state page (settings.opening): its settings and defaults, the state
// a page starts on, where everything is at any progress, and the state
// machine that turns wheels, touches, keys and taps into progress: scrubbing
// partway, settling at a rest, the graph keeping its own wheel, and reduced
// motion. The clock and the frames are fake, so every step is checked.

const { test } = require('node:test');
const assert = require('node:assert');
const {
  DEFAULTS, TUNING, openingConfig, startState, coverGeometry, createCover, pageKey,
} = require('../src/lib/opening');
const { createViewState, memoryBackend } = require('../src/lib/viewState');

function fakeClock() {
  let t = 0;
  let id = 0;
  const timers = new Map();
  const clock = {
    now: () => t,
    setTimer(fn, ms) { id += 1; timers.set(id, { at: t + ms, fn }); return id; },
    clearTimer(h) { timers.delete(h); },
    frame(fn) { return clock.setTimer(fn, 16); },
    cancelFrame(h) { clock.clearTimer(h); },
    advance(ms) {
      const until = t + ms;
      for (;;) {
        const next = [...timers.entries()].filter(([, x]) => x.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        timers.delete(next[0]);
        t = next[1].at;
        next[1].fn();
      }
      t = until;
    },
    get pending() { return timers.size; },
  };
  return clock;
}

const SITE = {
  opening: {
    enabled: true, mode: 'two-state',
    art: { artState: 'cover/art-state.png', graphState: 'cover/graph-state.png' },
    alt: 'A plant', ground: 'dark', graph: { artOffset: 0.33, artOpacity: 1 },
    byline: { text: 'by someone', href: 'someone/' }, startOn: 'remembered', snapMs: 420,
  },
};

function run(opts = {}, settings = SITE) {
  const clock = fakeClock();
  const ps = [];
  const rests = [];
  const swaps = [];
  const m = createCover(openingConfig(settings), {
    travel: 500,
    now: clock.now, frame: clock.frame, cancelFrame: clock.cancelFrame,
    setTimer: clock.setTimer, clearTimer: clock.clearTimer,
    onChange: (p, info) => { ps.push(p); if (info.swap) swaps.push(p); },
    onRest: (s) => rests.push(s),
    ...opts,
  });
  return { m, clock, ps, rests, swaps };
}

test('settings: off by default, on with art, and every default filled in', () => {
  assert.equal(DEFAULTS.enabled, false);
  assert.equal(openingConfig({}), null);
  assert.equal(openingConfig({ opening: { ...SITE.opening, enabled: false } }), null);
  assert.equal(openingConfig({ opening: { ...SITE.opening, mode: 'dissolve' } }), null, 'another mode is not this one');
  assert.equal(openingConfig({ opening: { enabled: true, art: { artState: 'a.png' } } }), null, 'one state image and no full: no art');
  assert.equal(openingConfig({ opening: { enabled: true, art: { bush: 'b.png', roots: 'r.png' } } }), null, 'the old halves are not read');
  const both = openingConfig(SITE);
  assert.deepStrictEqual(both.art, { artState: 'cover/art-state.png', graphState: 'cover/graph-state.png', full: '' });
  const onlyFull = openingConfig({ opening: { enabled: true, art: { full: 'a.png' } } });
  assert.ok(onlyFull, 'full alone is enough');
  assert.deepStrictEqual(onlyFull.art, { artState: 'a.png', graphState: '', full: 'a.png' }, 'full stands for both states');
  assert.equal(openingConfig({ opening: { enabled: true, art: { artState: 'a.png', graphState: 'g.png', full: 'f.png' } } }).art.artState, 'a.png', 'the two states win over full');
  assert.deepStrictEqual(onlyFull.graph, { artOffset: 0.33, artOpacity: 1 });
  assert.equal(onlyFull.ground, 'dark');
  assert.equal(onlyFull.startOn, 'remembered');
  assert.equal(onlyFull.snapMs, 420);
  const odd = openingConfig({ opening: { enabled: true, art: { full: 'a.png' }, ground: 'neon', startOn: 'middle', snapMs: -5, graph: { artOffset: 3, artOpacity: 7 } } });
  assert.equal(odd.ground, 'dark');
  assert.equal(odd.startOn, 'remembered');
  assert.equal(odd.snapMs, 0);
  assert.equal(odd.graph.artOffset, 0.95);
  assert.equal(odd.graph.artOpacity, 1);
});

test('start: remembered lands where the reader left, the art with no memory, the graph for #read=', () => {
  const c = openingConfig(SITE);
  assert.equal(startState(c, {}), 'art');
  assert.equal(startState(c, { stored: 'graph' }), 'graph');
  assert.equal(startState(c, { stored: 'art' }), 'art');
  assert.equal(startState(c, { stored: 'nonsense' }), 'art');
  assert.equal(startState(c, { stored: 'art', hash: '#read=eoej-a1-01' }), 'graph');
  assert.equal(startState({ ...c, startOn: 'graph' }, { stored: 'art' }), 'graph');
  assert.equal(startState({ ...c, startOn: 'art' }, { stored: 'graph' }), 'art');
  assert.equal(startState(null, {}), 'graph', 'no cover: the graph');
});

test('geometry: the whole plant fits at the art rest, scrolled up by artOffset at the graph rest, one scale throughout', () => {
  const c = openingConfig(SITE);
  for (const [vw, vh] of [[390, 844], [1280, 800]]) {
    const view = { vw, vh, art: { w: 1045, h: 2111 }, bottom: 100 };
    const a = coverGeometry(c, view, 0);
    const g = coverGeometry(c, view, 1);
    assert.ok(a.art.top >= 0, 'top inside');
    assert.ok(a.byline.y + TUNING.bylineSize * 1.3 <= vh - 100 + 1, 'byline above the kept space');
    assert.ok(a.art.left >= 0 && a.art.left + a.art.width <= vw + 0.01, 'fits across');
    assert.ok(Math.abs(a.art.width / a.art.height - 1045 / 2111) < 1e-9, 'shape kept');
    assert.equal(g.art.scale, a.art.scale, 'one scale');
    assert.ok(Math.abs(g.art.top - (-0.33 * g.art.height)) < 1e-9);
    assert.equal(a.travel, a.art.top - g.art.top);
    const crown = (g.art.top + (1330 / 2111) * g.art.height) / vh;
    assert.ok(crown > 0.15 && crown < 0.35, `where the plant meets the roots, about a quarter down (${crown.toFixed(2)})`);
    assert.deepStrictEqual(a.fade, { art: 1, graph: 0 }, "the art state's image at the art rest");
    assert.deepStrictEqual(g.fade, { art: 0, graph: 1 }, "the graph state's image at the graph rest");
    assert.equal(a.graph.opacity, 0);
    assert.ok(a.graph.shift > 0, 'the graph is below at the art rest');
    assert.equal(g.graph.opacity, 1);
    assert.equal(g.graph.shift, 0);
    assert.equal(a.ground, 1);
    assert.equal(g.ground, 0);
    assert.equal(a.byline.opacity, 1);
    assert.equal(g.byline.opacity, 0);
  }
});

test('geometry: everything follows p continuously between the rests', () => {
  const c = openingConfig(SITE);
  const view = { vw: 390, vh: 844, art: { w: 1045, h: 2111 } };
  let prev = coverGeometry(c, view, 0);
  for (let i = 1; i <= 20; i += 1) {
    const g = coverGeometry(c, view, i / 20);
    assert.ok(Math.abs(g.fade.art - (1 - i / 20)) < 1e-9 && Math.abs(g.fade.graph - i / 20) < 1e-9, 'the images crossfade with p');
    assert.ok(g.art.top < prev.art.top, 'the art moves up');
    assert.ok(g.graph.opacity >= prev.graph.opacity, 'the graph comes in');
    assert.ok(g.graph.shift <= prev.graph.shift, 'and rises');
    assert.ok(Math.abs(g.art.top - prev.art.top) < prev.travel / 10, 'no jumps');
    prev = g;
  }
  const half = coverGeometry(c, view, 0.5);
  assert.ok(half.graph.opacity > 0 && half.graph.opacity < 1, 'partway is in between');
  const dim = coverGeometry({ ...c, graph: { artOffset: 0.33, artOpacity: 0.4 } }, view, 1);
  assert.equal(dim.art.opacity, 0.4, 'artOpacity behind the graph');
});

test('a wheel scrubs partway, and a pause settles it: on past the threshold, back short of it', () => {
  const { m, clock, ps, rests } = run();
  assert.equal(m.p, 0);
  assert.equal(m.wheel(100, { where: 'stage' }), true);
  assert.ok(Math.abs(m.p - 0.2) < 1e-9, 'p follows the wheel');
  assert.equal(m.moving, true);
  clock.advance(TUNING.wheelIdleMs + 1000);
  assert.equal(m.p, 0, 'short of the threshold: back to the art');
  assert.deepStrictEqual(rests, ['art']);

  m.wheel(200, { where: 'stage' });
  assert.ok(m.p > 0.3 && m.p < 0.5, 'in between');
  clock.advance(TUNING.wheelIdleMs + 1000);
  assert.equal(m.p, 1);
  assert.equal(m.rest, 'graph');
  assert.deepStrictEqual(rests, ['art', 'graph']);
  assert.ok(ps.some((p) => p > 0.5 && p < 1), 'the snap passes through the in-between');
});

test('a wheel up at the art rest, or down at the graph rest on the art, does nothing', () => {
  const { m, clock } = run();
  assert.equal(m.wheel(-100, { where: 'stage' }), true);
  assert.equal(m.p, 0);
  m.go('graph', { instant: true });
  clock.advance(1000);
  assert.equal(m.wheel(100, { where: 'stage' }), true);
  assert.equal(m.p, 1);
});

test('in the graph state the wheel is the graph\'s, except a scroll up at the top edge', () => {
  const { m, clock } = run({ start: 'graph' });
  clock.advance(1000);
  assert.equal(m.wheel(-120, { where: 'graph' }), false, 'up inside the graph: its zoom');
  assert.equal(m.wheel(120, { where: 'graph' }), false, 'down inside the graph: its zoom');
  assert.equal(m.wheel(120, { where: 'edge' }), false, 'down at the edge: still the graph');
  assert.equal(m.p, 1);
  assert.equal(m.wheel(-150, { where: 'edge' }), true, 'up at the edge: the page');
  assert.ok(m.p < 1);
  clock.advance(TUNING.wheelIdleMs + 1000);
  assert.equal(m.rest, 'art');
});

test('just after a page move, the graph does not take the trackpad\'s momentum', () => {
  const { m, clock } = run();
  m.go('graph');
  clock.advance(440);
  assert.equal(m.rest, 'graph');
  assert.equal(m.moving, false);
  assert.equal(m.wheel(30, { where: 'graph' }), true, 'swallowed');
  clock.advance(TUNING.quietMs + 10);
  assert.equal(m.wheel(30, { where: 'graph' }), false, 'then the graph has it');
});

test('keys: down to the graph, up to the art; a key at its own rest does nothing', () => {
  const { m, clock, rests } = run();
  assert.equal(m.key('up'), false);
  assert.equal(m.key('down'), true);
  clock.advance(1000);
  assert.equal(m.rest, 'graph');
  assert.equal(m.key('down'), false);
  assert.equal(m.key('up'), true);
  clock.advance(1000);
  assert.equal(m.rest, 'art');
  assert.deepStrictEqual(rests, ['graph', 'art']);
  assert.equal(m.key('sideways'), false);
});

test('which keys move the page', () => {
  assert.equal(pageKey({ key: 'ArrowDown' }), 'down');
  assert.equal(pageKey({ key: 'PageDown' }), 'down');
  assert.equal(pageKey({ key: ' ' }), 'down');
  assert.equal(pageKey({ key: ' ', shiftKey: true }), null);
  assert.equal(pageKey({ key: 'ArrowUp' }), 'up');
  assert.equal(pageKey({ key: 'PageUp' }), 'up');
  assert.equal(pageKey({ key: 'ArrowDown', metaKey: true }), null);
  assert.equal(pageKey({ key: 'Enter' }), null);
});

test('a tap on the art goes to the graph, a tap on the grip back to the art, over snapMs', () => {
  const { m, clock, ps } = run();
  assert.equal(m.tapArt(), true);
  clock.advance(200);
  assert.ok(m.p > 0 && m.p < 1, 'on its way');
  clock.advance(400);
  assert.equal(m.rest, 'graph');
  assert.ok(ps.length > 10, 'drawn frame by frame');
  assert.equal(m.tapTop(), true);
  clock.advance(600);
  assert.equal(m.rest, 'art');
  assert.equal(m.p, 0);
});

test('a touch drag scrubs; let go past the threshold goes on, a flick goes on however short', () => {
  const { m, clock } = run();
  m.touchStart(600, clock.now());
  clock.advance(100);
  m.touchMove(450, clock.now());
  assert.ok(Math.abs(m.p - 0.3) < 1e-9, 'p follows the finger');
  clock.advance(300);
  m.touchEnd(clock.now());
  clock.advance(1000);
  assert.equal(m.rest, 'graph');

  // a short fast flick down, back to the art
  m.touchStart(300, clock.now());
  clock.advance(16);
  m.touchMove(330, clock.now());
  clock.advance(16);
  m.touchMove(360, clock.now());
  m.touchEnd(clock.now());
  clock.advance(1000);
  assert.equal(m.rest, 'art');
});

test('go instant: no frames, straight to the rest', () => {
  const { m, ps, rests } = run();
  m.go('graph', { instant: true });
  assert.equal(m.p, 1);
  assert.deepStrictEqual(ps, [1]);
  assert.deepStrictEqual(rests, ['graph']);
  assert.equal(m.go('nowhere'), false);
});

test('reduced motion: no scrub, the two states swap in one step', () => {
  const { m, clock, ps, swaps, rests } = run({ reducedMotion: true });
  m.wheel(10, { where: 'stage' });
  assert.equal(m.p, 0, 'a little wheel does nothing yet');
  m.wheel(40, { where: 'stage' });
  assert.equal(m.p, 1);
  assert.deepStrictEqual(ps, [1], 'no in-between');
  assert.deepStrictEqual(swaps, [1]);
  clock.advance(1000);
  m.key('up');
  assert.equal(m.p, 0);
  m.tapArt();
  assert.equal(m.p, 1);
  m.touchStart(500, clock.now());
  m.touchMove(560, clock.now());
  assert.equal(m.p, 1, 'a drag does not scrub');
  m.touchEnd(clock.now());
  assert.equal(m.p, 0);
  assert.ok(ps.every((p) => p === 0 || p === 1));
  assert.deepStrictEqual(rests, ['graph', 'art', 'graph', 'art']);
});

test('the state is remembered, kept through undo, and forgotten with the rest', async () => {
  const vs = createViewState({ backend: memoryBackend(), corpusId: 'c', debounceMs: 0 });
  await vs.ready();
  assert.equal(vs.openingState(), null);
  vs.setLayout('radial');
  vs.setOpeningState('graph');
  assert.equal(vs.openingState(), 'graph');
  vs.setOpeningState('sideways');
  assert.equal(vs.openingState(), 'graph', 'only art or graph');
  vs.undo();
  assert.equal(vs.openingState(), 'graph', 'undo does not move the page');
  assert.equal(startState(openingConfig(SITE), { stored: vs.openingState() }), 'graph');
  await vs.forget({ local: null, session: null, idb: null });
  assert.equal(vs.openingState(), null);
  assert.equal(startState(openingConfig(SITE), { stored: vs.openingState() }), 'art');
});
