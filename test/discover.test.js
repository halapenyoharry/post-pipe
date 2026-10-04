import test from 'node:test';
import assert from 'node:assert/strict';
import { discover } from '../lib/discover.js';
import { buildStone } from '../lib/stone.js';
import { emerge } from '../lib/emerge.js';
import { rec } from './helpers.js';

// A tagged system, an untagged wire, and filler so that no real phrase is "everywhere".
const filler = Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`f${i}`, []]));
const fillerMeta = Object.fromEntries(Object.keys(filler).map((k, i) => [k, { title: `zorbl${i} flarn${i} wumpus${i}`, text: `grindle${i} plonk${i} vexor${i} snarf${i}` }]));
const wire = {
  q1: { title: 'Quantum computers solve a hard problem', text: 'a quantum computer uses qubits to search; officials told reporters it is early' },
  q2: { title: 'New quantum chip adds qubits', text: 'engineers built a quantum chip with more qubits; officials told reporters little' },
  q3: { title: 'Quantum error correction keeps qubits stable', text: 'stable qubits make a quantum machine useful; the lab told reporters nothing' },
  v1: { title: 'Volcano eruption buried the city in ash', text: 'an ancient volcano erupted and ash covered every street' },
  v2: { title: 'Ash from a volcano eruption reveals old lives', text: 'the volcano eruption preserved ash layers in the city' },
  lone: { title: 'Pangolin conservation succeeds', text: 'pangolin numbers recover in a single reserve' },
};
const records = [
  ...rec('Wire', Object.fromEntries(Object.keys(wire).map((k) => [k, []])), wire),
  ...rec('Mine', { m1: ['physics'] }, { m1: { title: 'Notes on physics', text: 'I keep thinking about quantum computing and qubits as a way to think about measurement' } }),
  ...rec('Filler', filler, fillerMeta),
];
const out = discover(records);
const labels = (source) => new Set(out.filter((t) => t.source === source).map((t) => t.label));

test('every discovered tag is marked, weighted low, and explains itself', () => {
  assert.ok(out.length > 0);
  for (const t of out) {
    assert.equal(t.type, 'tag');
    assert.equal(t.origin, 'discovered');
    assert.ok(t.weight > 0 && t.weight <= 0.6);
    assert.match(t.why, /recurs in \d+ of \d+ items/);
  }
});

test('recurring, coherent topics become hubs', () => {
  const l = labels('Wire');
  assert.ok(l.has('qubits') || l.has('quantum'), `got ${[...l]}`);
  assert.ok(l.has('volcano') || l.has('eruption') || l.has('volcano eruption'), `got ${[...l]}`);
});

test('a phrase that appears in only one item never becomes a hub', () => {
  const hubs = new Map();
  for (const t of out) hubs.set(t.label, (hubs.get(t.label) ?? 0) + 1);
  assert.ok(![...hubs.keys()].some((l) => l.includes('pangolin')));
  assert.ok([...hubs.values()].every((n) => n >= 2), 'every hub connects at least two items');
});

test('generic words are never topics, even when they recur', () => {
  assert.ok(![...labels('Wire')].some((l) => l.split(' ').includes('told')));
});

test('hubs bridge into tagged items that contain them; items that never mention a hub get nothing', () => {
  const mine = labels('Mine');
  assert.ok(mine.has('qubits') || mine.has('quantum'), 'the tagged note mentions quantum computing and gains the wire\'s hub');
  assert.equal(out.filter((t) => t.source === 'Filler').length, 0);
  assert.equal(out.filter((t) => t.item === 'lone').length, 0);
});

test('only untagged items choose hubs; tagged items are capped lower', () => {
  const perWire = Object.groupBy(out.filter((t) => t.source === 'Wire'), (t) => t.item);
  for (const list of Object.values(perWire)) assert.ok(list.length <= 3);
  assert.ok(out.filter((t) => t.source === 'Mine').length <= 2);
});

test('discovery is deterministic', () => {
  assert.deepEqual(discover(records), out);
});

test('discovered phrases join the stone as evidence and fold into other systems\' vocabulary', () => {
  const shared = [
    ...rec('Editorial', { e1: ['Quantum'], e2: ['Quantum'] }, { e1: { title: 'Quantum sensing', text: 'quantum sensors' }, e2: { title: 'Quantum networks', text: 'quantum links' } }),
    ...records,
  ];
  const withDiscovered = [...shared, ...discover(shared)];
  const s = buildStone(withDiscovered, {});
  const c = s.concepts.find((x) => x.variants.some((v) => v.norm === 'quantum'));
  assert.ok(c, 'a quantum concept exists');
  assert.ok(Object.keys(c.variants.find((v) => v.norm === 'quantum').bySource).includes('Editorial'));
});

test('a concept only ever proposed by discovery is flagged and is not re-matched by emerge', () => {
  const s = buildStone([...records, ...out], {});
  const hubOnly = s.concepts.filter((c) => c.discovered);
  assert.ok(hubOnly.length > 0);
  assert.ok(s.concepts.filter((c) => !c.discovered).every((c) => c.variants.some((v) => v.explicit > 0)));
  const extra = emerge(s, [...records, ...out]);
  const discoveredIds = new Set(hubOnly.map((c) => c.id));
  assert.ok(extra.every((t) => !discoveredIds.has(t.concept)));
});
