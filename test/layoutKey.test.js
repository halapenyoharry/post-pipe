// Saved positions are filed under the layout's name plus a signature of the
// settings that shape it, so positions left by an older arrangement are not
// read back into a new one, and a site can retire them on purpose with
// graph.layoutVersion.

const { test } = require('node:test');
const assert = require('node:assert');
const { layoutKey, layoutSignature } = require('../src/components/GraphViewer/layoutKey');

const SITE = {
  card: { width: 180, height: 140, cornerRadius: 10 },
  simulation: { linkDistance: 160, chargeStrength: -500, collidePadding: 10, alphaDecay: 0.028 },
  spiral: { spacing: 32, direction: 'outward', _direction_note: 'words' },
  roots: true,
};

test('the same settings give the same key, every time', () => {
  assert.equal(layoutKey('force', SITE), layoutKey('force', JSON.parse(JSON.stringify(SITE))));
  assert.equal(layoutKey('force', {}), layoutKey('force', undefined));
  assert.equal(layoutKey('force', {}), layoutKey('force', { layoutVersion: 1 }), 'version 1 is the default');
});

test('a changed spiral direction or spacing gives a different key', () => {
  const k = layoutKey('force', SITE);
  assert.notEqual(layoutKey('force', { ...SITE, spiral: { ...SITE.spiral, direction: 'inward' } }), k);
  assert.notEqual(layoutKey('force', { ...SITE, spiral: { ...SITE.spiral, spacing: 20 } }), k);
  assert.notEqual(layoutKey('force', { ...SITE, spiral: { ...SITE.spiral, startRadius: 90 } }), k);
  assert.notEqual(layoutKey('force', { ...SITE, card: { ...SITE.card, width: 200 } }), k);
});

test('graph.layoutVersion retires positions on purpose', () => {
  const k = layoutKey('force', SITE);
  assert.notEqual(layoutKey('force', { ...SITE, layoutVersion: 2 }), k);
  assert.equal(layoutKey('force', { ...SITE, layoutVersion: 2 }), layoutKey('force', { ...SITE, layoutVersion: '2' }));
});

test('settings that do not move nodes leave the key alone', () => {
  const k = layoutKey('force', SITE);
  assert.equal(layoutKey('force', { ...SITE, roots: false, containerCount: false }), k);
  assert.equal(layoutKey('force', { ...SITE, card: { ...SITE.card, cornerRadius: 3 } }), k);
  assert.equal(layoutKey('force', { ...SITE, spiral: { ...SITE.spiral, _direction_note: 'other words' } }), k);
});

test('each layout has its own key, and none contains the item separator', () => {
  assert.notEqual(layoutKey('force', SITE), layoutKey('radial', SITE));
  for (const name of ['force', 'radial', 'timeline']) {
    const key = layoutKey(name, SITE);
    assert.ok(key.startsWith(name + '@'));
    assert.ok(!key.includes('::'));
  }
  assert.ok(layoutSignature(SITE).includes('"direction":"outward"'));
});

test('the spiral on its tip: a set anchorEnd, openTowards, keepBelow or cardScale changes the key; their defaults do not', () => {
  const { layoutKey: key } = require('../src/components/GraphViewer/layoutKey');
  const base = { spiral: { spacing: 20 } };
  const same = { spiral: { spacing: 20, anchorEnd: 'center', openTowards: 'down', cardScale: 1, keepBelow: null } };
  assert.strictEqual(key('force', same), key('force', base));
  for (const extra of [{ anchorEnd: 'outer' }, { openTowards: 'down-left' }, { keepBelow: 'crown' }, { cardScale: 0.5 }]) {
    assert.notStrictEqual(key('force', { spiral: { spacing: 20, ...extra } }), key('force', base), JSON.stringify(extra));
  }
  const own = { layouts: { 'container:a': { spiral: { openTowards: 'down-right' } } } };
  assert.notStrictEqual(key('force', base, own), key('force', base));
});
