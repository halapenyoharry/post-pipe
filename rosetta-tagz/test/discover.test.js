import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { discover } from '../lib/discover.js';
import { makeConfig } from '../lib/config.js';
import { buildStone } from '../lib/stone.js';
import { emerge } from '../lib/emerge.js';
import { rec, syntheticRecords } from './helpers.js';

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
    const keys = ['coherence', 'df', 'items', 'maxDfRatio', 'minDf', 'nearCopy', 'nearCopyGrouping', 'nearCopyWords', 'perItem', 'sourceBaseline', 'sourceCoherenceRatio'];
    if ('sourceRatio' in t) keys.push('sourceRatio');
    else assert.equal(P.sourceBaseline, 0, 'the ratio is missing only when there was nothing to divide by');
    if (P.sourceRatio < P.sourceCoherenceRatio) keys.push('sourceRatioFloor'); // only on a hub the floor admitted
    assert.deepEqual(Object.keys(P).sort(), keys.sort());
    assert.equal(t.sourceRatio, P.sourceRatio, 'the record carries the ratio as a plain field too');
    assert.ok(P.items >= P.minDf && P.items <= P.df, 'no near-copies in this corpus, so every item is its own piece of evidence');
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

test('discovered phrases join stone.json as evidence and fold into other systems\' vocabulary', () => {
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
  assert.ok(eruption, 'the wire\'s "volcano eruption" is a concept stone.json knows only from discovery');

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
// what a build at the bar holds: the records whose measured ratio reaches it (or that have none)
const atBar = (found, bar = 1.6) => found.filter((t) => !(t.sourceRatio < bar));

test('a word spread over one homogeneous source is not a topic: its items are only as alike as the source makes them', () => {
  assert.ok(hubsOf(deskOff).has('instead'), 'measured against the whole corpus, the newsroom\'s likeness carries "instead" through');
  assert.ok(!hubsOf(atBar(deskOn)).has('instead'), 'measured against items from the same source, it adds nothing');
  assert.equal(atBar(deskOn).filter((t) => t.item === 'd8').length, 0, 'the untagged newsroom item had only "instead" to offer');
  const instead = deskOn.filter((t) => t.label === 'instead');
  assert.ok(instead.length > 0 && instead.every((t) => t.sourceRatio >= 1 && t.sourceRatio < 1.6 && t.wasGeneratedBy.parameters.sourceRatioFloor === 1), 'below the bar it is still handed over, with its ratio, for a viewer to try a lower bar');
  assert.match(instead[0].why, /under the 1\.6× bar, admitted by the 1× floor\)$/);
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

// Near-copies: one story told twice (two long articles about the same flood) shares its names,
// places and details, and incidental words besides. As on post-pipe's site corpus of 2026-10-31,
// each incidental word also turns up on one unrelated item, which picks it as its only hub: counted
// twice, the copies' likeness carries the word's coherence. Three short items about glaciers share
// only their topic. Filler keeps any phrase from being everywhere.
const story = 'flood ruidoso trotter riverview crawford swiftwater lincoln mescalero sierra blanca peak tourist cabins campground bridge culvert gauge sirens shelter levee arroyo burn scar sediment debris river mayor chief volunteers rescue';
const incidental = ['memory', 'staying', 'moderate', 'danger'];
const copyRecords = [
  ...rec('Paper', { a: [], b: [], c: [] }, {
    a: { title: 'Town leaders said they were prepared', text: `${story} ${story}. the village council met; residents said the memory of the fire was staying with them and a moderate rain could still bring danger` },
    b: { title: 'The river cannot be trusted', text: `${story.split(' ').reverse().join(' ')} ${story}. the county board reviewed the response; families described staying near the water, the memory of the night, and the danger of moderate storms` },
    c: { title: 'A flood in another valley', text: 'waters rose after rain on a burn scar near the river; sediment and debris closed the road' },
  }),
  ...rec('Wire', { g1: [], g2: [], g3: [], x0: [], x1: [], x2: [], x3: [] }, {
    g1: { title: 'Glacier retreat speeds up', text: 'the glacier lost ice as melt ran into the fjord' },
    g2: { title: 'Ice cores from a shrinking glacier', text: 'scientists drilled the glacier where melt pools spread' },
    g3: { title: 'Glacier melt raises lake levels', text: 'meltwater from the glacier filled a lake below the ice' },
    ...Object.fromEntries(incidental.map((w, i) => [`x${i}`, { title: `quillon${i} brask${i}`, text: `${w} ottery${i} frund${i}` }])),
  }),
  ...rec('Filler', filler, fillerMeta),
];
const copiesOn = {};
const withCopies = discover(copyRecords, makeConfig(), copiesOn);
const copiesOff = discover(copyRecords, makeConfig({ discover: { nearCopy: 0 } }));

test('two copies of one story are one piece of evidence: a word only they share is not a tag', () => {
  assert.deepEqual(copiesOn.nearCopies, [['Paper::a', 'Paper::b']], 'the two flood articles are found as near-copies, the short glacier items are not');
  for (const w of incidental) {
    assert.ok(hubsOf(copiesOff).has(w), `counted twice, the copies carry "${w}" through`);
    assert.ok(!hubsOf(withCopies).has(w), `counted once, "${w}" recurs nowhere`);
  }
});

test('a word spread over distinct items is still a tag, and a tag still lands on every copy', () => {
  assert.ok(hubsOf(withCopies).has('glacier'), `got ${[...hubsOf(withCopies)]}`);
  const flood = withCopies.filter((t) => t.label === 'flood');
  assert.deepEqual(flood.map((t) => t.item).sort(), ['a', 'b', 'c'], 'attached to both copies and the other flood item');
  for (const t of flood) {
    assert.equal(t.wasGeneratedBy.parameters.df, 2, 'df counts the copies once');
    assert.equal(t.wasGeneratedBy.parameters.items, 3, 'items counts where it lands');
    assert.match(t.why, /^recurs in 3 of 50 items \(2 of 49 counting near-copies once\), which stay alike without it/);
  }
});

// How near-copy pairs make groups (`nearCopyGrouping`). A roundup retells two different stories, as on
// haroldyounghumxn.site's corpus of 2026-10-31, where a ProPublica roundup was a near-copy of one story
// (0.485) and of another (0.396) that are not copies of each other (0.098). Here the roundup retells all
// of the lawyer story and most of the ballots story; the two stories share only "election officials in
// the county". Three tellings of the flood story above are near-copies every pair, and a wire item
// says "election officials" too.
const lawyer = 'marguerite vance lawyer halloway conference denial movement donors trained volunteers poll observers lawsuits fraud claims caucus foundation strategy memo canvass precinct challengers podcast seminar playbook audit recount affidavits';
const ballots = 'mail ballots rejections rural postal service sorting plant consolidation delays postmarks deadline tamsin clerks envelopes carriers routes overnight processing rejected signature cure letters trucks';
const roundupRecords = [
  ...rec('Paper', { roundup: [], ballots: [], lawyer: [], flood1: [], flood2: [], flood3: [] }, {
    roundup: { title: 'Key findings from our election reporting', text: `${lawyer}. ${ballots.split(' ').slice(0, 19).join(' ')}. election officials in the county` },
    ballots: { title: 'Rural ballots rejected after postal cuts', text: `${ballots} ${ballots}. election officials in the county weighed certification` },
    lawyer: { title: 'How a lawyer built a movement', text: `${lawyer} ${lawyer}. election officials in the county delayed certification` },
    flood1: { title: 'Town leaders said they were prepared', text: `${story} ${story}. the village council met` },
    flood2: { title: 'The river cannot be trusted', text: `${story.split(' ').reverse().join(' ')} ${story}. the county board reviewed the response` },
    flood3: { title: 'After the flood, a reckoning', text: `${story}. families described the night` },
  }),
  ...rec('Wire', { w1: [] }, {
    w1: { title: 'Certification fights reach county boards', text: 'county election officials weighed certification after mail ballots were rejected and poll observers filed lawsuits; certification deadlines loom' },
  }),
  ...rec('Filler', filler, fillerMeta),
];
const chained = {};
const allPaired = {};
const byChain = discover(roundupRecords, makeConfig(), chained);
const byAllPairs = discover(roundupRecords, makeConfig({ discover: { nearCopyGrouping: 'all-pairs' } }), allPaired);
const paper = (...ids) => ids.map((id) => `Paper::${id}`);
const floods = paper('flood1', 'flood2', 'flood3');

test('chain, the default: any near-copy pair joins two groups, so a roundup that retells two different stories makes them one item', () => {
  assert.deepEqual(chained.nearCopies, [paper('ballots', 'lawyer', 'roundup'), floods]);
  assert.deepEqual(chained.nearCopiesApart, []);
  for (const t of byChain) assert.equal(t.wasGeneratedBy.parameters.nearCopyGrouping, 'chain');
});

test('all-pairs: a group holds only items that are near-copies every pair, and the roundup joins the story it is more alike to', () => {
  assert.equal(makeConfig().discover.nearCopyGrouping, 'chain', 'chain is the default');
  assert.deepEqual(allPaired.nearCopies, [floods, paper('lawyer', 'roundup')], 'the ballots story comes first in item order, but the roundup is more alike to the lawyer story');
  assert.deepEqual(allPaired.nearCopiesApart.map(([a, b]) => [a, b]), [paper('ballots', 'roundup')], 'the near-copy pair left in different groups');
  assert.ok(allPaired.nearCopiesApart[0][2] >= 0.35, 'with the likeness that made it a near-copy pair');
  for (const t of byAllPairs) assert.equal(t.wasGeneratedBy.parameters.nearCopyGrouping, 'all-pairs');
});

test('a true triple of copies is one group under either value', () => {
  for (const info of [chained, allPaired]) assert.ok(info.nearCopies.some((g) => JSON.stringify(g) === JSON.stringify(floods)), JSON.stringify(info.nearCopies));
});

test('under all-pairs the two stories are two pieces of evidence; so are the roundup and the story it did not join', () => {
  const [c] = byChain.filter((t) => t.label === 'election officials');
  const [a] = byAllPairs.filter((t) => t.label === 'election officials');
  assert.equal(c.wasGeneratedBy.parameters.df, 2, 'chain: the roundup and both stories are one item, the wire item another');
  assert.match(c.why, /^recurs in 4 of 47 items \(2 of 43 counting near-copies once\)/);
  assert.equal(a.wasGeneratedBy.parameters.df, 3, 'all-pairs: the two stories count apart');
  assert.match(a.why, /^recurs in 4 of 47 items \(3 of 44 counting near-copies once\)/);
  // what all-pairs costs: a detail of the ballots story that the roundup retells now recurs in two items
  assert.ok(!hubsOf(byChain).has('postal'));
  assert.deepEqual(byAllPairs.filter((t) => t.label === 'postal').map((t) => t.item).sort(), ['ballots', 'roundup']);
});

test('an unknown nearCopyGrouping is an error that names the values', () => {
  assert.throws(() => discover(roundupRecords, makeConfig({ discover: { nearCopyGrouping: 'complete' } })), /unknown discover\.nearCopyGrouping "complete" \(all-pairs, chain\)/);
});

// The floor. On the shipped synthetic corpus every hub clears 1.6, so the bar is raised to 9 to put
// some below it; what is tested is the shape, not the number.
const synth = syntheticRecords();
const bar = (sourceCoherenceRatio, sourceRatioFloor) => discover(synth, makeConfig({ discover: { sourceCoherenceRatio, sourceRatioFloor } }));
const atNine = bar(9, 9);
const toOne = bar(9, 1);

test('a floor at the bar adds nothing: the output is the one without a floor, byte for byte', () => {
  assert.equal(JSON.stringify(atNine), JSON.stringify(bar(9, null)));
  assert.ok(atNine.length > 0 && atNine.every((t) => t.sourceRatio >= 9 && !('sourceRatioFloor' in t.wasGeneratedBy.parameters)));
});

test('a lower floor only adds: every record of the build at the bar is there unchanged, and the bar filters the rest away', () => {
  const key = (t) => `${t.label}\u0000${t.source}::${t.item}`;
  const lower = new Map(toOne.map((t) => [key(t), t]));
  for (const t of atNine) assert.deepEqual(lower.get(key(t)), t, `${key(t)} unchanged`);
  const extra = toOne.filter((t) => t.sourceRatio < 9);
  assert.ok(extra.length > 0, 'the floor admitted something');
  for (const t of extra) {
    assert.ok(t.sourceRatio >= 1);
    assert.equal(t.wasGeneratedBy.parameters.sourceRatioFloor, 1);
    assert.match(t.why, /under the 9× bar, admitted by the 1× floor/);
  }
  assert.equal(JSON.stringify(atBar(toOne, 9)), JSON.stringify(atNine), 'a viewer at the bar shows exactly the build at the bar, in the same order');
});

// The SHA-256 of discovery's output on the synthetic corpus before nearCopyGrouping existed (post-pipe
// 1.0.1, commit 5897101, default config). A deliberate change to that output puts its new digest here.
const BEFORE_THE_SWITCH = 'bdc7b3b503becf4e37025989a625b45f0f1546c9839812095262120f6986ee2b';
const withoutGrouping = (found) =>
  found.map((t) => {
    const { nearCopyGrouping, ...parameters } = t.wasGeneratedBy.parameters;
    return { ...t, wasGeneratedBy: { ...t.wasGeneratedBy, parameters } };
  });

test('with chain, discovery on the synthetic corpus is byte for byte what it was before the switch existed', () => {
  const chain = discover(synth, makeConfig({ discover: { nearCopyGrouping: 'chain' } }));
  assert.ok(chain.length > 0 && chain.every((t) => t.wasGeneratedBy.parameters.nearCopyGrouping === 'chain'), 'the switch is recorded on every record');
  const digest = createHash('sha256').update(JSON.stringify(withoutGrouping(chain))).digest('hex');
  assert.equal(digest, BEFORE_THE_SWITCH, 'taken out of the parameters, nothing else differs');
  // the synthetic corpus holds no near-copies, so all-pairs has nothing to group differently
  assert.equal(JSON.stringify(withoutGrouping(discover(synth))), JSON.stringify(withoutGrouping(chain)));
});
