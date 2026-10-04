const test = require('node:test');
const assert = require('node:assert');
const { createTapGate } = require('../src/components/GraphViewer/tapGate');

function clock() {
  let t = 0;
  const timers = new Map();
  let id = 0;
  return {
    now: () => t,
    setTimer: (fn, ms) => { timers.set(++id, { fn, at: t + ms }); return id; },
    clearTimer: (i) => timers.delete(i),
    advance(ms) {
      t += ms;
      for (const [i, tm] of [...timers]) if (tm.at <= t) { timers.delete(i); tm.fn(); }
    },
  };
}

test('a single tap runs once the wait is over, not before', () => {
  const c = clock();
  const gate = createTapGate({ ms: 250, now: c.now, setTimer: c.setTimer, clearTimer: c.clearTimer });
  const log = [];
  gate.tap(10, 10, () => log.push('single'), () => log.push('double'));
  c.advance(200);
  assert.deepStrictEqual(log, []);
  c.advance(60);
  assert.deepStrictEqual(log, ['single']);
});

test('two taps close together are a double and nothing single runs', () => {
  const c = clock();
  const gate = createTapGate({ ms: 250, now: c.now, setTimer: c.setTimer, clearTimer: c.clearTimer });
  const log = [];
  gate.tap(10, 10, () => log.push('single'), () => log.push('double'));
  c.advance(120);
  assert.strictEqual(gate.tap(14, 12, () => log.push('single2'), () => log.push('double')), 'double');
  c.advance(1000);
  assert.deepStrictEqual(log, ['double']);
});

test('the double is the first tap\'s: what was double-tapped is where the two taps began', () => {
  const c = clock();
  const gate = createTapGate({ ms: 250, px: 32, now: c.now, setTimer: c.setTimer, clearTimer: c.clearTimer });
  const log = [];
  gate.tap(10, 10, () => log.push('card single'), () => log.push('card double'));
  c.advance(120);
  gate.tap(30, 20, () => log.push('space single'), () => log.push('space double'));
  c.advance(1000);
  assert.deepStrictEqual(log, ['card double']);
  gate.tap(10, 10, () => log.push('a'));
  c.advance(100);
  gate.tap(10, 10, () => log.push('b'), () => log.push('second double'));
  c.advance(1000);
  assert.deepStrictEqual(log, ['card double', 'second double'], 'the second\'s when the first gave none');
});

test('a second tap far away or late settles the first as single', () => {
  const c = clock();
  const gate = createTapGate({ ms: 250, px: 32, now: c.now, setTimer: c.setTimer, clearTimer: c.clearTimer });
  const log = [];
  gate.tap(10, 10, () => log.push('a'), () => log.push('double'));
  c.advance(100);
  gate.tap(200, 10, () => log.push('b'), () => log.push('double'));
  assert.deepStrictEqual(log, ['a']);
  c.advance(300);
  assert.deepStrictEqual(log, ['a', 'b']);
  gate.tap(200, 10, () => log.push('c'));
  c.advance(260);
  gate.tap(200, 10, () => log.push('d'));
  c.advance(260);
  assert.deepStrictEqual(log, ['a', 'b', 'c', 'd']);
});

test('cancel drops a waiting tap', () => {
  const c = clock();
  const gate = createTapGate({ now: c.now, setTimer: c.setTimer, clearTimer: c.clearTimer });
  const log = [];
  gate.tap(0, 0, () => log.push('single'));
  gate.cancel();
  c.advance(1000);
  assert.deepStrictEqual(log, []);
});
