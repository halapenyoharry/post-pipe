import test from 'node:test';
import assert from 'node:assert/strict';
import { discover } from '../lib/discover.js';
import { makeConfig } from '../lib/config.js';
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

test('the per-item cap governs hub selection, not attachment: every hub lands on every item containing it', () => {
  const items = records.filter((r) => r.type === 'item');
  const taggedKeys = new Set(records.filter((r) => r.type === 'tag').map((r) => `${r.source}::${r.item}`));
  const orphans = items.filter((it) => !taggedKeys.has(`${it.source}::${it.id}`));
  const hubs = new Set(out.map((t) => t.label));
  assert.ok(hubs.size > 0);
  assert.ok(hubs.size <= orphans.length * 3, 'distinct hubs are chosen from the orphans, perItem each');
  for (const label of hubs) {
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${label}(?![\\p{L}\\p{N}])`, 'iu');
    const containing = items.filter((it) => re.test(`${it.title} ${it.text}`)).map((it) => `${it.source}::${it.id}`);
    const carrying = out.filter((t) => t.label === label).map((t) => `${t.source}::${t.item}`);
    for (const k of containing) assert.ok(carrying.includes(k), `"${label}" is in ${k} and must be attached there`);
  }
  // the defect this pins: q1 says "qubits" and q2 says "reporters"; before, the cap at attachment dropped them
  const on = (item, label) => out.some((t) => t.source === 'Wire' && t.item === item && t.label === label);
  assert.ok(on('q1', 'qubits'));
  assert.ok(on('q2', 'reporters'));
});

test('the why-count of a discovered concept equals the number of items asserting it', () => {
  const byLabel = Object.groupBy(out, (t) => t.label);
  for (const [label, list] of Object.entries(byLabel)) {
    for (const t of list) {
      const n = Number(t.why.match(/recurs in (\d+)/)[1]);
      assert.equal(n, list.length, `"${label}" claims ${n} items and is asserted on ${list.length}`);
      assert.equal(t.wasGeneratedBy.parameters.items, list.length);
    }
  }
});

test('every discovered record carries its provenance', () => {
  for (const t of out) {
    assert.equal(t.wasDerivedFrom.length, 1);
    const [d] = t.wasDerivedFrom;
    assert.equal(d.type, 'text');
    assert.equal(typeof d.phrase, 'string');
    assert.ok(d.count >= 1);
    assert.equal(typeof d.inTitle, 'boolean');
    const it = records.find((r) => r.type === 'item' && r.source === t.source && r.id === t.item);
    assert.ok(`${it.title} ${it.text}`.toLowerCase().includes(d.phrase), `"${d.phrase}" is in the item's text`);
    assert.equal(d.inTitle, it.title.toLowerCase().split(/[^\p{L}\p{N}]+/u).join(' ').includes(d.phrase), `inTitle for "${d.phrase}" on ${t.item}`);
    assert.equal(t.wasGeneratedBy.activity, 'discover');
    const P = t.wasGeneratedBy.parameters;
    assert.deepEqual(Object.keys(P).sort(), ['coherence', 'df', 'items', 'maxDfRatio', 'minDf', 'perItem', 'sourceBaseline', 'sourceCoherenceRatio']);
    assert.ok(P.items >= P.minDf && P.items <= P.df);
  }
});

test('output order is by hub, then by item', () => {
  const keys = out.map((t) => `${t.label}\u0000${t.source}::${t.item}`);
  const labels = out.map((t) => t.label);
  assert.deepEqual(labels, [...labels].sort());
  assert.deepEqual(keys, [...keys].sort());
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

test('a concept only ever proposed by discovery is flagged, visible to emerge, and never doubled', () => {
  const s = buildStone([...records, ...out], {});
  const hubOnly = s.concepts.filter((c) => c.discovered);
  assert.ok(hubOnly.length > 0);
  assert.ok(s.concepts.filter((c) => !c.discovered).every((c) => c.variants.some((v) => v.explicit > 0)));
  const discoveredIds = new Set(hubOnly.map((c) => c.id));
  const eruption = hubOnly.find((c) => c.variants.some((v) => v.norm === 'volcano eruption'));
  assert.ok(eruption, 'the wire\'s "volcano eruption" is a concept the stone knows only from discovery');

  // without the discovered records, emergence sees the concept and earns it where the text says it
  const fresh = emerge(s, records);
  const earned = fresh.filter((t) => t.concept === eruption.id);
  assert.deepEqual(earned.map((t) => t.item).sort(), ['v1', 'v2']);
  for (const t of earned) assert.equal(t.label, eruption.canonical);

  // with them, every item that carries a discovered concept already is left alone
  const carried = new Set(out.map((t) => `${t.source}::${t.item}::${s.concepts.find((c) => c.variants.some((v) => v.norm === t.label.toLowerCase()))?.id}`));
  const extra = emerge(s, [...records, ...out]);
  for (const t of extra) if (discoveredIds.has(t.concept)) assert.ok(!carried.has(`${t.source}::${t.item}::${t.concept}`), `${t.item} already carries ${t.concept}`);
});

// A newsroom whose items are alike anyway (they share its vocabulary), one untagged newsroom item, a
// wire with a topic the newsroom also covers, and filler so nothing is everywhere. "instead" sits on
// five newsroom items and nowhere else; "wildfire" on three newsroom items and both wire items.
const newsroom = 'county commissioners weighed the budget after an audit of agency records; lawmakers demanded testimony and a subpoena from the department';
const deskMeta = {
  d1: { title: 'Wildfire response audit in Ashford County', text: `${newsroom}. the wildfire forced evacuation orders as smoke covered acres near ashford; firefighters held containment lines` },
  d2: { title: 'Brennan County wildfire costs', text: `${newsroom}. after the wildfire, smoke and evacuation costs grew as firefighters lost acres near brennan` },
  d3: { title: 'Calloway wildfire records', text: `${newsroom}. a wildfire near calloway sent smoke over acres; evacuation routes jammed and firefighters asked for relief` },
  d4: { title: 'Dunmore audit', text: `${newsroom}; dunmore spent the reserve instead` },
  d5: { title: 'Fairhaven audit', text: `${newsroom}; fairhaven hired a consultant instead` },
  d6: { title: 'Glenrock audit', text: `${newsroom}; glenrock delayed the vote instead` },
  d7: { title: 'Harlow audit', text: `${newsroom}; harlow borrowed the money instead` },
  d8: { title: 'Elmwood audit', text: `${newsroom}; elmwood paid the vendor instead` },
};
const deskRecords = [
  ...rec('Desk', { d1: ['Politics'], d2: ['Politics'], d3: ['Politics'], d4: ['Politics'], d5: ['Politics'], d6: ['Politics'], d7: ['Politics'], d8: [] }, deskMeta),
  ...rec('Wire', { w1: [], w2: [] }, {
    w1: { title: 'Wildfire smoke reaches the valley', text: 'smoke from the wildfire drifted over acres of orchards; evacuation shelters opened and firefighters worked overnight' },
    w2: { title: 'Firefighters gain on the wildfire', text: 'firefighters cut lines around the wildfire; smoke thinned, evacuation orders eased and acres of forest were saved' },
  }),
  ...rec('Filler', filler, fillerMeta),
];
const deskOn = discover(deskRecords);
const deskOff = discover(deskRecords, makeConfig({ discover: { sourceCoherenceRatio: 0 } }));
const hubsOf = (found) => new Set(found.map((t) => t.label));

test('a word spread over one homogeneous source is not a topic: its items are only as alike as the source makes them', () => {
  assert.ok(hubsOf(deskOff).has('instead'), 'measured against the whole corpus, the newsroom\'s likeness carries "instead" through');
  assert.ok(!hubsOf(deskOn).has('instead'), 'measured against items from the same source, it adds nothing');
  assert.equal(deskOn.filter((t) => t.item === 'd8').length, 0, 'the untagged newsroom item had only "instead" to offer');
});

test('a real topic whose items are alike beyond what their sources share is kept', () => {
  assert.ok(hubsOf(deskOn).has('wildfire'), `got ${[...hubsOf(deskOn)]}`);
  const w = deskOn.filter((t) => t.label === 'wildfire');
  assert.deepEqual(w.map((t) => t.item).sort(), ['d1', 'd2', 'd3', 'w1', 'w2'], 'it lands on every item that says it, newsroom items included');
  for (const t of w) {
    const P = t.wasGeneratedBy.parameters;
    assert.equal(P.sourceCoherenceRatio, 1.6);
    assert.ok(P.sourceBaseline > 0 && P.coherence >= P.sourceCoherenceRatio * P.sourceBaseline, `coherence ${P.coherence} against baseline ${P.sourceBaseline}`);
    assert.match(t.why, /^recurs in 5 of 50 items, which stay alike without it \(\d\.\d\d, \d+\.\d× the \d\.\d{3} that items from the same sources share\)/);
  }
});
