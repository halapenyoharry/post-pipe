// The ledger: concept ids that survive from build to build.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildStone } from '../lib/stone.js';
import { assignIds, readLedger, writeLedger, isLedger, emptyLedger, LEDGER_SCHEMA, MAX_EVENTS } from '../lib/ledger.js';
import { rec, syntheticRecords, shippedSeed, tmpDir } from './helpers.js';

const idsOf = (stone) => Object.fromEntries(stone.concepts.map((c) => [c.variants.map((v) => v.norm).join('|'), c.id]));
const byMember = (stone, norm) => stone.concepts.find((c) => c.variants.some((v) => v.norm === norm));

// build with a ledger: `prior` is the ledger of the previous build (null the first time)
function ledgered(records, prior, { now, ...opts } = {}) {
  const ledger = { prior, path: 'ledger.json' };
  const stone = buildStone(records, { seeds: [shippedSeed()], now, ledger, ...opts });
  return { stone, next: ledger.next };
}

test('the same records twice: identical ids, nothing minted the second time', () => {
  const records = syntheticRecords();
  const first = ledgered(records, null, { now: '2026-10-25T10:00:00.000Z' });
  const second = ledgered(records, first.next, { now: '2026-10-25T11:00:00.000Z' });
  assert.deepEqual(idsOf(second.stone), idsOf(first.stone));
  assert.equal(first.stone.ledger.minted, first.stone.concepts.length);
  assert.deepEqual(second.stone.ledger, { path: 'ledger.json', minted: 0, reused: first.stone.concepts.length, retired: 0, splits: 0, merges: 0, events: [] });
  assert.ok(second.stone.concepts.every((c) => c.ledger.event === 'reused' && c.ledger.since === '2026-10-25T10:00:00.000Z'));
  assert.equal(second.next.builds, 2);
  assert.equal(second.next.created, '2026-10-25T10:00:00.000Z');
  assert.equal(second.next.updated, '2026-10-25T11:00:00.000Z');
});

test('adding one unrelated term keeps every prior id and mints exactly one', () => {
  const records = syntheticRecords();
  const first = ledgered(records, null, { now: 't1' });
  const more = [...records, ...rec('Journal', { zz: ['quantum gravity'] })];
  const second = ledgered(more, first.next, { now: 't2' });
  const before = idsOf(first.stone);
  const after = idsOf(second.stone);
  for (const [members, id] of Object.entries(before)) assert.equal(after[members], id, members);
  assert.equal(second.stone.ledger.minted, 1);
  assert.equal(second.stone.ledger.reused, first.stone.concepts.length);
  const fresh = byMember(second.stone, 'quantum gravity');
  assert.equal(fresh.id, 'c_quantum_gravity');
  assert.deepEqual(fresh.ledger, { since: 't2', event: 'minted' });
});

test('a notSame override that splits a cluster 3/1: the three keep the id, the one mints with a parent and a split event', () => {
  const records = rec('Journal', { 1: ['system thinking'], 2: ['systems thinking'], 3: ['thinking systems'], 4: ['thinking system'], 5: ['courts'] });
  const first = ledgered(records, null, { now: 't1' });
  const whole = byMember(first.stone, 'thinking system');
  assert.equal(whole.variants.length, 4, 'the fixture is one cluster of four spellings');
  assert.equal(whole.id, 'c_system_thinking');

  const notSame = [['thinking system', 'system thinking'], ['thinking system', 'systems thinking'], ['thinking system', 'thinking systems']];
  const second = ledgered(records, first.next, { now: 't2', overrides: { notSame } });
  const three = byMember(second.stone, 'system thinking');
  const one = byMember(second.stone, 'thinking system');
  assert.equal(three.variants.length, 3);
  assert.equal(one.variants.length, 1);
  assert.equal(three.id, 'c_system_thinking', 'the larger child keeps the id');
  assert.equal(one.id, 'c_thinking_system', 'the smaller child mints');
  assert.equal(second.next.concepts.c_thinking_system.parent, 'c_system_thinking');
  assert.deepEqual(one.ledger, { since: 't2', event: 'split' });
  assert.equal(three.ledger.event, 'split');
  const split = [{ type: 'split', at: 't2', parent: 'c_system_thinking', children: ['c_system_thinking', 'c_thinking_system'] }];
  assert.deepEqual(second.next.events, split);
  assert.deepEqual(second.stone.ledger, { path: 'ledger.json', minted: 1, reused: 2, retired: 0, splits: 1, merges: 0, events: split }, "this build's events ride on the stone, so build.json names the parent and children");
  assert.equal(byMember(second.stone, 'courts').ledger.event, 'reused');
});

test("a same override that merges two priors: one id (the larger prior's), one merge event, the other retired with into", () => {
  const records = rec('Journal', { 1: ['cat'], 2: ['cats'], 3: ['dog'] });
  const first = ledgered(records, null, { now: 't1' });
  assert.deepEqual(idsOf(first.stone), { 'cat|cats': 'c_cat', dog: 'c_dog' });

  const second = ledgered(records, first.next, { now: 't2', overrides: { same: [['cat', 'cats', 'dog']] } });
  assert.equal(second.stone.concepts.length, 1);
  const merged = second.stone.concepts[0];
  assert.equal(merged.id, 'c_cat', "the larger prior's id continues");
  assert.deepEqual(merged.ledger, { since: 't1', event: 'merged' });
  const merge = [{ type: 'merge', at: 't2', parents: ['c_cat', 'c_dog'], child: 'c_cat' }];
  assert.deepEqual(second.next.events, merge);
  assert.deepEqual(second.next.retired, { c_dog: { members: ['dog'], label: 'dog', since: 't1', lastSeen: 't1', into: 'c_cat' } });
  assert.equal(second.next.concepts.c_dog, undefined);
  assert.deepEqual(second.stone.ledger, { path: 'ledger.json', minted: 0, reused: 1, retired: 1, splits: 0, merges: 1, events: merge });
});

test('a concept of one spelling keeps its id when a second spelling joins it: nothing minted, nothing retired', () => {
  const first = ledgered(rec('Journal', { 1: ['cat'], 2: ['courts'] }), null, { now: 't1' });
  assert.deepEqual(idsOf(first.stone), { cat: 'c_cat', courts: 'c_courts' });
  const second = ledgered(rec('Journal', { 1: ['cat'], 2: ['courts'], 3: ['cats'] }), first.next, { now: 't2' });
  assert.deepEqual(idsOf(second.stone), { 'cat|cats': 'c_cat', courts: 'c_courts' });
  assert.deepEqual(second.stone.ledger, { path: 'ledger.json', minted: 0, reused: 2, retired: 0, splits: 0, merges: 0, events: [] });
  assert.deepEqual(byMember(second.stone, 'cats').ledger, { since: 't1', event: 'reused' });
  assert.deepEqual(second.next.retired, {});
  // directly: a prior wholly continued by a cluster twice its size, and a prior of two continued by a cluster of four
  assert.deepEqual(assignIds([{ terms: ['a', 'z'], label: 'a' }], { ...emptyLedger('t0'), concepts: { c_a: { members: ['a'], label: 'a', since: 't0', lastSeen: 't0' } } }, { now: 't1' }).ids, ['c_a']);
  const two = { ...emptyLedger('t0'), concepts: { c_a: { members: ['a', 'b'], label: 'a', since: 't0', lastSeen: 't0' } } };
  assert.deepEqual(assignIds([{ terms: ['a', 'b', 'y', 'z'], label: 'a' }], two, { now: 't1' }).ids, ['c_a']);
  // but one spelling of three continuing into a cluster of three is not a majority on either side
  const three = { ...emptyLedger('t0'), concepts: { c_a: { members: ['a', 'b', 'c'], label: 'a', since: 't0', lastSeen: 't0' } } };
  assert.deepEqual(assignIds([{ terms: ['a', 'y', 'z'], label: 'a' }], three, { now: 't1' }).ids, ['c_a_2']);
});

test('an even merge of two priors keeps one of the two ids and absorbs the other', () => {
  const prior = emptyLedger('t0');
  prior.concepts.c_a = { members: ['a', 'b'], label: 'b', since: 't0', lastSeen: 't0' };
  prior.concepts.c_c = { members: ['c', 'd'], label: 'c', since: 't0', lastSeen: 't0' };
  // equal overlap: the prior whose label the cluster holds wins; both hold, so the smaller id
  const r = assignIds([{ terms: ['a', 'b', 'c', 'd'], label: 'c' }], prior, { now: 't1' });
  assert.deepEqual(r.ids, ['c_a']);
  assert.deepEqual(r.summary, { minted: 0, reused: 1, retired: 1, splits: 0, merges: 1 });
  assert.deepEqual(r.events, [{ type: 'merge', at: 't1', parents: ['c_a', 'c_c'], child: 'c_a' }]);
  assert.equal(r.next.retired.c_c.into, 'c_a');
  assert.deepEqual(r.concepts, [{ since: 't0', event: 'merged', previousLabel: 'b' }]);
  // the same, but only one prior's label survives in the cluster's canonical position: the label holder wins the tie
  prior.concepts.c_a.label = 'gone';
  assert.deepEqual(assignIds([{ terms: ['a', 'b', 'c', 'd'], label: 'c' }], prior, { now: 't1' }).ids, ['c_c']);
});

test('in a split the larger child keeps the id even when the smaller child holds the pin', () => {
  const prior = emptyLedger('t0');
  prior.concepts.c_ai = { members: ['ai', 'ml', 'dl'], label: 'AI', pin: 'ai', since: 't0', lastSeen: 't0' };
  const r = assignIds([{ terms: ['dl', 'ml', 'nn'], label: 'dl' }, { terms: ['ai'], label: 'AI' }], prior, { pins: ['ai'], now: 't1' });
  assert.deepEqual(r.ids, ['c_ai', 'c_ai_2'], 'overlap decides first; the pinned one-member child mints with a parent');
  assert.equal(r.next.concepts.c_ai_2.parent, 'c_ai');
  assert.equal(r.next.concepts.c_ai_2.pin, 'ai');
  assert.deepEqual(r.events, [{ type: 'split', at: 't1', parent: 'c_ai', children: ['c_ai', 'c_ai_2'] }]);
  // with equal overlap the pin breaks the tie
  prior.concepts.c_ai.members = ['ai', 'ml', 'dl', 'nn'];
  const even = assignIds([{ terms: ['dl', 'ml'], label: 'dl' }, { terms: ['ai', 'nn'], label: 'AI' }], prior, { pins: ['ai'], now: 't1' });
  assert.deepEqual(even.ids, ['c_dl', 'c_ai']);
});

test('two clusters whose smallest members slugify alike: the second takes _2', () => {
  const r = assignIds([{ terms: ['a b'], label: 'a b' }, { terms: ['a_b'], label: 'a_b' }], null, { now: 't1' });
  assert.deepEqual(r.ids, ['c_a_b', 'c_a_b_2']);
  const again = assignIds([{ terms: ['a b'], label: 'a b' }, { terms: ['a_b'], label: 'a_b' }], r.next, { now: 't2' });
  assert.deepEqual(again.ids, ['c_a_b', 'c_a_b_2']);
  assert.equal(again.summary.minted, 0);
});

test('pin continuity: a cluster whose only overlap with its prior is the pinned norm keeps the id', () => {
  const prior = emptyLedger('t0');
  prior.concepts.c_ai = { members: ['ai', 'artificial intelligence', 'machine intelligence'], label: 'AI', pin: 'ai', since: 't0', lastSeen: 't0' };
  prior.concepts.c_courts = { members: ['courts'], label: 'courts', since: 't0', lastSeen: 't0' };
  // directly: one of three members overlaps, no majority, but that member is the pinned one
  const direct = assignIds([{ terms: ['ai', 'smart machines', 'thinking machines'], label: 'AI' }], prior, { pins: ['ai'], now: 't1' });
  assert.deepEqual(direct.ids, ['c_ai']);
  assert.equal(direct.summary.reused, 1);
  // and without the pin the same cluster mints (c_ai is in use, so the mint is c_ai_2)
  const unpinned = assignIds([{ terms: ['ai', 'smart machines', 'thinking machines'], label: 'ai' }], prior, { now: 't1' });
  assert.deepEqual(unpinned.ids, ['c_ai_2']);
  // through rtz-stone: `same` forces the cluster, `pin` names the norm
  const records = rec('Journal', { 1: ['ai'], 2: ['smart machines'], 3: ['thinking machines'] });
  const { stone } = ledgered(records, prior, { now: 't1', overrides: { same: [['ai', 'smart machines', 'thinking machines']], pin: { ai: 'AI' } } });
  const c = byMember(stone, 'ai');
  assert.equal(c.id, 'c_ai');
  assert.equal(c.canonical, 'AI');
  assert.equal(c.ledger.event, 'reused');
});

test('a term that disappears is retired and gets its old id back when it returns', () => {
  const withZ = rec('Journal', { 1: ['alpha'], 2: ['beta'], 3: ['zeta'] });
  const without = rec('Journal', { 1: ['alpha'], 2: ['beta'] });
  const first = ledgered(withZ, null, { now: 't1' });
  assert.equal(byMember(first.stone, 'zeta').id, 'c_zeta');
  const second = ledgered(without, first.next, { now: 't2' });
  assert.equal(second.stone.ledger.retired, 1);
  assert.deepEqual(second.next.retired.c_zeta, { members: ['zeta'], label: 'zeta', since: 't1', lastSeen: 't1' });
  assert.deepEqual(second.next.events, [{ type: 'retire', at: 't2', ids: ['c_zeta'] }]);
  const third = ledgered(withZ, second.next, { now: 't3' });
  const back = byMember(third.stone, 'zeta');
  assert.equal(back.id, 'c_zeta');
  assert.deepEqual(back.ledger, { since: 't1', event: 'reused' });
  assert.equal(third.next.retired.c_zeta, undefined);
  assert.deepEqual(third.stone.ledger, { path: 'ledger.json', minted: 0, reused: 3, retired: 0, splits: 0, merges: 0, events: [] });
});

test('the first ledgered build reproduces the ids of a build without a ledger', () => {
  const records = syntheticRecords();
  const plain = buildStone(records, { seeds: [shippedSeed()] });
  const { stone } = ledgered(records, null, { now: 't1' });
  assert.deepEqual(stone.concepts.map((c) => c.id), plain.concepts.map((c) => c.id));
  assert.equal(plain.ledger, undefined, 'without a ledger stone.json carries no ledger summary');
  assert.ok(plain.concepts.every((c) => c.ledger === undefined));
  assert.ok(stone.concepts.every((c) => c.ledger.event === 'minted' && c.ledger.since === 't1'));
});

test('previousLabel appears when the stored label differs from this build\'s canonical', () => {
  const records = rec('Journal', { 1: ['ai'], 2: ['ai'] });
  const first = ledgered(records, null, { now: 't1' });
  assert.equal(first.next.concepts.c_ai.label, 'ai');
  const second = ledgered(records, first.next, { now: 't2', overrides: { pin: { ai: 'Artificial Intelligence' } } });
  assert.deepEqual(byMember(second.stone, 'ai').ledger, { since: 't1', event: 'reused', previousLabel: 'ai' });
  assert.equal(second.next.concepts.c_ai.label, 'Artificial Intelligence');
  assert.equal(second.next.concepts.c_ai.pin, 'ai');
});

test('the ledger never holds a label that is not a member norm, the canonical, or a pin', () => {
  const records = syntheticRecords();
  const pin = { ml: 'Machine Learning (pinned)' };
  const { stone, next } = ledgered(records, null, { now: 't1', overrides: { pin } });
  const canonicalOf = new Map(stone.concepts.map((c) => [c.id, c.canonical]));
  const norms = new Set(stone.concepts.flatMap((c) => c.variants.map((v) => v.norm)));
  for (const [id, entry] of Object.entries(next.concepts)) {
    assert.ok(entry.members.every((m) => norms.has(m)), `${id} members are norms`);
    assert.ok(entry.label === canonicalOf.get(id) || entry.members.includes(entry.label) || Object.values(pin).includes(entry.label), `${id} label ${entry.label}`);
    if (entry.pin) assert.ok(entry.members.includes(entry.pin) && entry.pin in pin, `${id} pin is a pinned member norm`);
  }
  assert.equal(next.schema, LEDGER_SCHEMA);
  assert.ok(isLedger(next));
});

test('an unreadable prior is treated as absent: every cluster mints by the first-build rule', () => {
  const clusters = [{ terms: ['ai'], label: 'AI' }, { terms: ['courts'], label: 'courts' }];
  const fromNull = assignIds(clusters, null, { now: 't1' });
  const garbages = [
    {},
    { schema: 'other', concepts: {}, retired: {} },
    { schema: LEDGER_SCHEMA, concepts: { x: { members: 'nope' } }, retired: {} },
    { ...emptyLedger('t0'), builds: '1' },
    { ...emptyLedger('t0'), events: 'nope' },
    'text',
    42,
  ];
  for (const garbage of garbages) {
    assert.equal(isLedger(garbage), false);
    const r = assignIds(clusters, garbage, { now: 't1' });
    assert.deepEqual(r.ids, fromNull.ids);
    assert.deepEqual(r.summary, fromNull.summary);
  }
  assert.deepEqual(fromNull.ids, ['c_ai', 'c_courts']);
});

test('readLedger / writeLedger: tmp then rename, status per case', () => {
  const dir = tmpDir();
  const file = path.join(dir, 'nested', 'ledger.json');
  assert.deepEqual(readLedger(file), { ledger: null, status: 'absent' });
  const ledger = emptyLedger('t1');
  ledger.concepts.c_ai = { members: ['ai'], label: 'AI', since: 't1', lastSeen: 't1' };
  writeLedger(file, ledger);
  assert.ok(fs.existsSync(file));
  assert.ok(!fs.existsSync(`${file}.tmp`), 'the temporary file is renamed away');
  assert.deepEqual(readLedger(file), { ledger, status: 'ok' });
  fs.writeFileSync(file, '{ not json');
  assert.deepEqual(readLedger(file), { ledger: null, status: 'unreadable' });
  fs.writeFileSync(file, JSON.stringify({ schema: 'something-else' }));
  assert.deepEqual(readLedger(file), { ledger: null, status: 'unreadable' });
});

test('events keep only the most recent 200', () => {
  let prior = emptyLedger('t0');
  prior.events = Array.from({ length: MAX_EVENTS }, (_, i) => ({ type: 'retire', at: `old${i}`, ids: [] }));
  prior.concepts.c_gone = { members: ['gone'], label: 'gone', since: 't0', lastSeen: 't0' };
  const r = assignIds([{ terms: ['here'], label: 'here' }], prior, { now: 't1' });
  assert.equal(r.next.events.length, MAX_EVENTS);
  assert.deepEqual(r.next.events.at(-1), { type: 'retire', at: 't1', ids: ['c_gone'] });
  assert.equal(r.next.events[0].at, 'old1');
});
