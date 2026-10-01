// The opening (settings.opening): its settings and defaults, who sees it
// (once, with and without anything stored), and the state machine from idle
// through playing to done, by play, dwell or skip, with and without reduced
// motion. Timers are fake, so every step is checked at its moment.

const { test } = require('node:test');
const assert = require('node:assert');
const {
  TIMINGS, openingConfig, hasStoredUsage, shouldShowOpening, playSteps, playDuration, createOpening,
} = require('../src/lib/opening');
const { createViewState, memoryBackend } = require('../src/lib/viewState');

function fakeClock() {
  let t = 0;
  let id = 0;
  const timers = new Map();
  return {
    setTimer(fn, ms) { id += 1; timers.set(id, { at: t + ms, fn }); return id; },
    clearTimer(h) { timers.delete(h); },
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
}

const SITE = {
  opening: {
    enabled: true, image: 'cover/plain.jpg', broken: 'cover/pixelated.png', blur: 9,
    alt: 'The cover', dwellMs: 3200, once: true, byline: { text: 'by someone', href: '/someone/' }, skipLabel: 'Skip',
  },
};

function run(config, opts = {}) {
  const clock = fakeClock();
  const log = [];
  const m = createOpening(config, {
    setTimer: clock.setTimer, clearTimer: clock.clearTimer,
    onState: (state, info) => log.push([state, info.phase === undefined ? info.how : info.phase, info.cause]),
    ...opts,
  });
  return { m, clock, log };
}

test('off by default, and off without an image', () => {
  assert.equal(openingConfig({}), null);
  assert.equal(openingConfig({ opening: { enabled: false, image: 'a.jpg' } }), null);
  assert.equal(openingConfig({ opening: { enabled: true, image: '' } }), null);
});

test('settings fill in their defaults', () => {
  const c = openingConfig({ opening: { enabled: true, image: 'a.jpg' } });
  assert.deepStrictEqual(c, {
    enabled: true, image: 'a.jpg', broken: '', blur: 9, alt: '', dwellMs: 3200, once: true,
    byline: { text: '', href: '' }, skipLabel: 'Skip',
  });
  const s = openingConfig(SITE);
  assert.equal(s.broken, 'cover/pixelated.png');
  assert.equal(s.byline.href, '/someone/');
});

test('once: a fresh reader sees it; anything stored skips it', () => {
  const c = openingConfig(SITE);
  assert.equal(shouldShowOpening(c, { state: null, hash: '' }), true);
  assert.equal(shouldShowOpening(c, { state: { reading: {}, bookmarks: [], nodes: {} } }), true);
  const stored = [
    { opening: { seenAt: 1 } },
    { reading: { a: { seenAt: 5 } } },
    { reading: { a: { scroll: 120 } } },
    { reading: { a: { max: 0.3 } } },
    { bookmarks: [{ id: 'bm', item: 'a', para: 2 }] },
    { nodes: { 'force::a': { x: 1, y: 2 } } },
  ];
  for (const state of stored) {
    assert.equal(hasStoredUsage(state), true, JSON.stringify(state));
    assert.equal(shouldShowOpening(c, { state }), false, JSON.stringify(state));
  }
  // A position the layout chose is not the reader's.
  assert.equal(hasStoredUsage({ nodes: { 'force::a': { x: 1, y: 2, auto: true } } }), false);
});

test('once false shows it to everyone; a link to a chapter goes to the chapter', () => {
  const c = openingConfig({ opening: { ...SITE.opening, once: false } });
  assert.equal(shouldShowOpening(c, { state: { opening: { seenAt: 1 } } }), true);
  assert.equal(shouldShowOpening(openingConfig(SITE), { hash: '#read=chapter-1' }), false);
  assert.equal(shouldShowOpening(null, {}), false);
});

test('idle, then playing through its steps, then done', () => {
  const c = openingConfig(SITE);
  const { m, clock, log } = run(c);
  assert.equal(m.state, 'idle');
  assert.equal(m.play('tap'), true);
  assert.equal(m.state, 'playing');
  assert.deepStrictEqual(log, [['playing', null, 'tap'], ['playing', 'broken', 'tap']]);
  clock.advance(TIMINGS.swapMs);
  assert.deepStrictEqual(log.at(-1), ['playing', 'dissolve', 'tap']);
  // A second input while playing does nothing.
  assert.equal(m.play('key'), false);
  clock.advance(TIMINGS.dissolveMs - 1);
  assert.equal(m.state, 'playing');
  clock.advance(1);
  assert.equal(m.state, 'done');
  assert.deepStrictEqual(log.at(-1), ['done', 'played', 'tap']);
  assert.equal(playDuration(c), TIMINGS.swapMs + TIMINGS.dissolveMs);
  assert.ok(playDuration(c) >= 1400 && playDuration(c) <= 1800, 'about 1.6 s');
});

test('without a broken image there is no swap step', () => {
  const c = openingConfig({ opening: { ...SITE.opening, broken: '' } });
  assert.deepStrictEqual(playSteps(c).map((s) => s.phase), ['dissolve']);
  const { m, clock, log } = run(c);
  m.play('wheel');
  assert.deepStrictEqual(log, [['playing', null, 'wheel'], ['playing', 'dissolve', 'wheel']]);
  clock.advance(TIMINGS.dissolveMs);
  assert.equal(m.state, 'done');
});

test('the dwell plays it by itself', () => {
  const { m, clock, log } = run(openingConfig(SITE));
  m.start();
  clock.advance(3199);
  assert.equal(m.state, 'idle');
  clock.advance(1);
  assert.equal(m.state, 'playing');
  assert.equal(m.cause, 'dwell');
  clock.advance(2000);
  assert.equal(m.state, 'done');
  assert.equal(log.filter((l) => l[0] === 'done').length, 1);
});

test('an input before the dwell cancels it', () => {
  const { m, clock } = run(openingConfig(SITE));
  m.start();
  clock.advance(1000);
  m.play('touch');
  clock.advance(5000);
  assert.equal(m.state, 'done');
  assert.equal(m.cause, 'touch');
  assert.equal(clock.pending, 0);
});

test('skip ends it at once, from idle or while playing', () => {
  const a = run(openingConfig(SITE));
  a.m.start();
  assert.equal(a.m.skip(), true);
  assert.equal(a.m.state, 'done');
  assert.deepStrictEqual(a.log, [['done', 'skipped', null]]);
  assert.equal(a.clock.pending, 0, 'no dwell left to fire');
  assert.equal(a.m.play('tap'), false);

  const b = run(openingConfig(SITE));
  b.m.play('key');
  b.clock.advance(100);
  b.m.skip();
  assert.equal(b.m.state, 'done');
  b.clock.advance(5000);
  assert.equal(b.log.filter((l) => l[0] === 'done').length, 1);
  assert.equal(b.m.skip(), false);
});

test('reduced motion: one short fade, no break-up and no blur', () => {
  const c = openingConfig(SITE);
  assert.deepStrictEqual(playSteps(c, { reducedMotion: true }), [{ phase: 'fade', at: 0, ms: TIMINGS.reducedFadeMs }]);
  const { m, clock, log } = run(c, { reducedMotion: true });
  m.play('tap');
  assert.deepStrictEqual(log.map((l) => l[1]), [null, 'fade']);
  clock.advance(TIMINGS.reducedFadeMs);
  assert.equal(m.state, 'done');
});

test('having seen it is stored, kept through undo, and forgotten with the rest', async () => {
  const vs = createViewState({ backend: memoryBackend(), corpusId: 'c', debounceMs: 0 });
  await vs.ready();
  assert.equal(vs.openingSeen(), false);
  vs.setLayout('radial');
  vs.markOpeningSeen();
  assert.equal(vs.openingSeen(), true);
  assert.equal(vs.canUndo, true);
  vs.undo();
  assert.equal(vs.openingSeen(), true, 'undo does not bring the opening back');
  assert.equal(hasStoredUsage(vs.state), true);
  await vs.forget({ local: null, session: null, idb: null });
  assert.equal(vs.openingSeen(), false);
  assert.equal(shouldShowOpening(openingConfig(SITE), { state: vs.state }), true);
});
