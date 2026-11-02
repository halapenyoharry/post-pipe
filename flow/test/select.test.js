import test from 'node:test';
import assert from 'node:assert/strict';
import { select } from '../lib/subfield.js';
import { syntheticFeed } from './helpers.js';

const C = (n) => `https://example.test/c${n}`;

test('select --all: the subfield carries every card and tag, the relation, the link, and the untagged reference', () => {
  const sub = select(syntheticFeed(), { mode: 'all' });
  assert.equal(sub.cards.length, 6);
  assert.deepEqual(sub.tagz.map((t) => t.id).sort(), ['c_alpha', 'c_beta', 'c_delta', 'c_gamma']);
  assert.equal(sub.relations.length, 1);
  assert.deepEqual(sub.relations[0], { type: 'related', a: 'c_alpha', b: 'c_beta', directed: false, weight: 0.6, why: '"alpha" and "beta" share 1 of their 2 and 2 items' });
  assert.equal(sub.links.length, 1);
  assert.equal(sub.links[0].layer, 'authored');
  assert.equal(sub.position, null);
  assert.ok(sub.cards.every((c) => c.distance === null));
  assert.deepEqual(sub.schemes.map((s) => s.id), ['site', 'Journal', 'Wire', 'discovered']);
  const c6 = sub.cards.find((c) => c.id === C(6));
  assert.equal(c6.references.length, 1);
  assert.equal(c6.references[0].type, 'untagged');
  assert.deepEqual(c6.references[0].why, ['only tagz under the 1.6× source coherence bar: omega 1.2']);
});

test('select --all: a card keeps its tag references as the feed carries them, and a tag knows its members with weights', () => {
  const sub = select(syntheticFeed(), { mode: 'all' });
  const c1 = sub.cards.find((c) => c.id === C(1));
  assert.equal(c1.source, 'Journal');
  assert.equal(c1.date, '2026-10-30T00:00:00.000Z');
  assert.equal(c1.kind, 'text');
  assert.deepEqual(c1.references.map((r) => [r.concept, r.value, r.weight, r.origin]), [['c_alpha', 'alpha', 1, 'explicit'], ['c_beta', 'beta', 0.5, 'discovered']]);
  assert.deepEqual(c1.references[0].prefLabel, { site: 'alpha', Journal: 'Alpha' });
  assert.equal(c1.references[1].why, 'recurs in 2 of 6 items; 3× here');
  const beta = sub.tagz.find((t) => t.id === 'c_beta');
  assert.equal(beta.label, 'beta');
  assert.deepEqual(beta.members, [{ card: C(1), weight: 0.5, origin: 'discovered' }, { card: C(3), weight: 1, origin: 'explicit' }]);
  assert.deepEqual(beta.prefLabel, { site: 'beta', Journal: 'beta', discovered: 'beta' });
  assert.deepEqual(beta.inScheme, ['site', 'Journal', 'discovered']);
});

test('select --around: the position, its tagz, the cards one step away, and distances in hops (card to tag to card is 2)', () => {
  const sub = select(syntheticFeed(), { mode: 'around', id: C(1), hops: 1 });
  assert.equal(sub.position, C(1));
  assert.deepEqual(sub.cards.map((c) => c.id), [C(1), C(2), C(3)]);
  const dist = Object.fromEntries(sub.cards.map((c) => [c.id, c.distance]));
  assert.deepEqual(dist, { [C(1)]: 0, [C(2)]: 2, [C(3)]: 2 });
  // c2's gamma comes along as a hyperedge, with only c2 as a member here.
  assert.deepEqual(sub.tagz.map((t) => t.id).sort(), ['c_alpha', 'c_beta', 'c_gamma']);
  assert.deepEqual(sub.tagz.find((t) => t.id === 'c_gamma').members.map((m) => m.card), [C(2)]);
  assert.equal(sub.relations.length, 1);
  assert.equal(sub.links.length, 0);
});

test('select --around: a direct link is one step, and two steps reach through a shared tag twice', () => {
  const one = select(syntheticFeed(), { mode: 'around', id: C(5), hops: 1 });
  assert.deepEqual(one.cards.map((c) => c.id), [C(4), C(5)]);
  assert.equal(one.cards.find((c) => c.id === C(4)).distance, 1);
  assert.equal(one.links.length, 1);
  const two = select(syntheticFeed(), { mode: 'around', id: C(1), hops: 2 });
  assert.deepEqual(two.cards.map((c) => c.id), [C(1), C(2), C(3), C(4)]);
  assert.equal(two.cards.find((c) => c.id === C(4)).distance, 4);
});

test('select --set: the named cards, their tagz trimmed to them, no position', () => {
  const sub = select(syntheticFeed(), { mode: 'set', ids: [C(4), C(5)] });
  assert.deepEqual(sub.cards.map((c) => c.id), [C(4), C(5)]);
  assert.deepEqual(sub.tagz.map((t) => t.id).sort(), ['c_delta', 'c_gamma']);
  assert.equal(sub.position, null);
  assert.equal(sub.links.length, 1);
  assert.throws(() => select(syntheticFeed(), { mode: 'set', ids: ['nope'] }), /does not have/);
  assert.throws(() => select(syntheticFeed(), { mode: 'around', id: 'nope' }), /does not have/);
});

test('select: without references a tag string is read as an explicit tag of weight 1', () => {
  const feed = { items: [{ id: 'a', url: 'https://x/a.html', title: 'A', tags: ['one', 'two'] }, { id: 'b', url: 'https://x/b.html', title: 'B', tags: ['two'] }], edges: [] };
  const sub = select(feed, { mode: 'all' });
  assert.deepEqual(sub.tagz.map((t) => [t.id, t.label, t.concept]), [['tag:one', 'one', null], ['tag:two', 'two', null]]);
  assert.deepEqual(sub.tagz[1].members, [{ card: 'a', weight: 1, origin: 'explicit' }, { card: 'b', weight: 1, origin: 'explicit' }]);
  assert.equal(sub.schemes.length, 0);
});
