import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStone } from '../lib/stone.js';
import { emerge } from '../lib/emerge.js';
import { syntheticStone, syntheticRecords, rec } from './helpers.js';

const stone = syntheticStone();
const records = syntheticRecords();
const fresh = emerge(stone, records);
const tagsOf = (source, item) => fresh.filter((r) => r.source === source && r.item === item).map((r) => r.concept);
const id = (label) => stone.concepts.find((c) => c.variants.some((v) => v.norm === label.toLowerCase())).id;

test('untagged items earn concept tags from what their text says', () => {
  const s1 = tagsOf('Science', 's1');
  for (const l of ['machine learning', 'deep learning', 'neural networks']) assert.ok(s1.includes(id(l)), l);
  assert.ok(tagsOf('Science', 's3').includes(id('ai')), '"artificial intelligence" in the text earns the AI concept');
  assert.ok(tagsOf('Science', 's2').includes(id('global warming')), '"climate change" in the text earns the merged concept');
});

test('items that mention nothing known stay untagged', () => {
  assert.deepEqual(tagsOf('Science', 's8'), []);
  assert.deepEqual(tagsOf('Science', 's9'), []);
});

test('every emergent tag explains itself and stays below certainty', () => {
  assert.ok(fresh.length > 10);
  for (const t of fresh) {
    assert.equal(t.origin, 'emergent');
    assert.ok(t.why.startsWith('text mentions'));
    assert.ok(t.weight >= 0.25 && t.weight <= 0.9);
  }
});

test('never re-tags what a human already tagged (even under another spelling)', () => {
  const j1 = tagsOf('Journal', 'j1'); // tagged "ai"; its summary also says "artificial intelligence"
  assert.ok(!j1.includes(id('ai')));
});

test('acronyms only match in capitals, never as a lowercase fragment', () => {
  const s = buildStone(
    [
      ...rec('A', { 1: ['AI'], 2: ['AI'] }),
      ...rec('B', { x: [], y: [], z: [] }, { x: { title: 'The AI boom', text: '' }, y: { title: 'said the maid', text: 'she waited' }, z: { title: 'ai', text: 'plain lowercase ai' } }),
    ],
    {},
  );
  const out = emerge(s, [
    ...rec('A', { 1: ['AI'], 2: ['AI'] }),
    ...rec('B', { x: [], y: [], z: [] }, { x: { title: 'The AI boom', text: '' }, y: { title: 'said the maid', text: 'she waited' }, z: { title: 'ai', text: 'plain lowercase ai' } }),
  ]);
  const hit = out.map((t) => t.item);
  assert.ok(hit.includes('x'));
  assert.ok(!hit.includes('y'), '"maid"/"waited" contain the letters a-i');
  assert.ok(!hit.includes('z'), 'lowercase ai is not the acronym');
});

test('a phrase on too many items is too common to be evidence', () => {
  const base = rec('T', { t1: ['media'], t2: ['media'] });
  const many = {};
  for (let i = 0; i < 12; i++) many[`m${i}`] = [];
  const meta = Object.fromEntries(Object.keys(many).map((k) => [k, { title: 'the media says', text: 'media media' }]));
  const recs = [...base, ...rec('U', many, meta)];
  const s = buildStone(recs, {});
  assert.equal(emerge(s, recs).length, 0);
});

test('single short words and stopwords are never phrase-matched', () => {
  const recs = [...rec('T', { 1: ['art'], 2: ['art'] }), ...rec('U', { a: [] }, { a: { title: 'art and the art of art', text: '' } })];
  const s = buildStone(recs, {});
  assert.equal(emerge(s, recs).length, 0, '"art" is 3 letters: too short to match on its own');
});

test('a generic single word needs context: it must read like the items that carry the tag', () => {
  const recs = [
    ...rec('Mine', { m1: ['water'], m2: ['water'] }, {
      m1: { title: 'Data centers drink the grid', text: 'cooling water consumption for hyperscale data centers and the municipal water supply' },
      m2: { title: 'Who owns the aquifer', text: 'water rights, aquifer depletion and municipal water supply politics' },
    }),
    ...rec('Wire', { w1: [], w2: [] }, {
      w1: { title: 'Mars rover finds ancient lakes', text: 'the rover found evidence of water in a crater lake bed' },
      w2: { title: 'Cooling demand strains municipal water supply', text: 'data centers draw heavily on municipal water supply and aquifer reserves' },
    }),
    // unrelated filler so "water" is not on every item (the common-phrase gate would reject it first)
    ...rec('Filler', Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`f${i}`, []]))),
  ];
  const s = buildStone(recs, {});
  const hit = emerge(s, recs).filter((t) => t.source === 'Wire');
  assert.deepEqual(hit.map((t) => t.item), ['w2'], 'w2 reads like the water essays; the Mars article only contains the word');
  assert.match(hit[0].why, /reads like its other items/);
});

test('every emergent record carries its provenance', () => {
  for (const t of fresh) {
    assert.deepEqual(Object.keys(t.wasDerivedFrom[0]).sort(), ['count', 'inTitle', 'phrase', 'type']);
    assert.equal(t.wasDerivedFrom[0].type, 'text');
    assert.ok(t.why.includes(`"${t.wasDerivedFrom[0].phrase}" ×${t.wasDerivedFrom[0].count}`));
    assert.equal(t.wasDerivedFrom[0].inTitle, t.why.includes('(in title)'));
    assert.equal(t.wasGeneratedBy.activity, 'emerge');
    const P = t.wasGeneratedBy.parameters;
    assert.equal('context' in P, t.why.includes('reads like its other items'), 'context is present exactly when it was computed, never null');
    assert.deepEqual(Object.keys(P).filter((k) => k !== 'context').sort(), ['maxDfRatio', 'minContext', 'minWeight']);
    for (const k of ['wasDerivedFrom', 'wasGeneratedBy']) assert.ok(t[k] != null);
  }
});

test('wasDerivedFrom.phrase is a span of the item\'s own words, not the label whose stems matched', () => {
  const inText = (recs, out) => {
    for (const t of out) {
      const it = recs.find((r) => r.type === 'item' && r.source === t.source && r.id === t.item);
      const body = `${it.title} ${it.text}`.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ');
      const [d] = t.wasDerivedFrom;
      assert.ok(body.includes(d.phrase.toLowerCase()), `"${d.phrase}" is in ${t.source}::${t.item}`);
      assert.ok(t.why.includes(`"${d.phrase}"`));
    }
  };
  inText(records, fresh);
  // the stem of "courts" matches a "court" the text wrote; the record says "court"
  const recs = [
    ...rec('Law', { l1: ['courts'], l2: ['courts'] }, { l1: { title: 'Courts', text: 'the appeals court ruled' }, l2: { title: 'More courts', text: 'a district court ruled' } }),
    ...rec('Wire', { w1: [] }, { w1: { title: 'A ruling', text: 'the supreme court ruled again on the appeals court case' } }),
    ...rec('Filler', Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`f${i}`, []])), Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`f${i}`, { title: `zorbl${i}`, text: `plonk${i}` }]))),
  ];
  const out = emerge(buildStone(recs, {}), recs).filter((t) => t.source === 'Wire');
  assert.equal(out.length, 1);
  assert.equal(out[0].wasDerivedFrom[0].phrase, 'court');
  assert.equal(out[0].label, 'courts', 'the label stays the concept\'s canonical');
  inText(recs, out);
});

// A wire with no vocabulary, a tagged note that mentions the wire's topic, and filler so nothing is everywhere.
const wireFixture = () => {
  const filler = Object.fromEntries(Array.from({ length: 30 }, (_, i) => [`f${i}`, []]));
  const fillerMeta = Object.fromEntries(Object.keys(filler).map((k, i) => [k, { title: `zorbl${i} flarn${i}`, text: `grindle${i} plonk${i} vexor${i}` }]));
  return [
    ...rec('Wire', { q1: [], q2: [], q3: [], v1: [], v2: [] }, {
      q1: { title: 'Quantum computers solve a hard problem', text: 'a quantum computer uses qubits to search; officials told reporters it is early' },
      q2: { title: 'New quantum chip adds qubits', text: 'engineers built a quantum chip with more qubits; officials told reporters little' },
      q3: { title: 'Quantum error correction keeps qubits stable', text: 'stable qubits make a quantum machine useful; the lab told reporters nothing' },
      v1: { title: 'Volcano eruption buried the city in ash', text: 'an ancient volcano erupted and ash covered every street' },
      v2: { title: 'Ash from a volcano eruption reveals old lives', text: 'the volcano eruption preserved ash layers in the city' },
    }),
    ...rec('Mine', { m1: ['physics'] }, { m1: { title: 'Notes on physics', text: 'I keep thinking about quantum computing and qubits as a way to think about measurement' } }),
    ...rec('Filler', filler, fillerMeta),
  ];
};

test('a concept only discovery proposed is visible to emergence, and what discovery attached is never doubled', async () => {
  const { discover } = await import('../lib/discover.js');
  const base = wireFixture();
  const discovered = discover(base);
  const s = buildStone([...base, ...discovered], {});
  const hubOnly = s.concepts.filter((c) => c.discovered);
  const eruption = hubOnly.find((c) => c.variants.some((v) => v.norm === 'volcano eruption'));
  assert.ok(eruption);

  const fresh = emerge(s, base);
  assert.deepEqual(fresh.filter((t) => t.concept === eruption.id).map((t) => t.item).sort(), ['v1', 'v2'], 'the phrase is in both items\' text');
  for (const t of fresh.filter((t) => t.concept === eruption.id)) {
    assert.equal(t.origin, 'emergent');
    assert.equal(t.wasDerivedFrom[0].phrase, 'volcano eruption');
  }

  const carried = new Set(discovered.map((t) => `${t.source}::${t.item}::${t.label}`));
  const again = emerge(s, [...base, ...discovered]);
  const discoveredIds = new Set(hubOnly.map((c) => c.id));
  for (const t of again) if (discoveredIds.has(t.concept)) assert.ok(!carried.has(`${t.source}::${t.item}::${t.label}`), `${t.item} already carries "${t.label}"`);
});

test('a hub discovery kept off a tagged item reaches it through emergence, with the context guard', async () => {
  const { discover } = await import('../lib/discover.js');
  const { makeConfig } = await import('../lib/config.js');
  const base = wireFixture();
  const discovered = discover(base, makeConfig({ discover: { bridgeTagged: false } }));
  assert.equal(discovered.filter((t) => t.source === 'Mine').length, 0, 'the site keeps hubs off its tagged note');
  const s = buildStone([...base, ...discovered], {});
  const qubits = s.concepts.find((c) => c.discovered && c.variants.some((v) => v.norm === 'qubits'));
  assert.ok(qubits);
  const mine = emerge(s, [...base, ...discovered]).filter((t) => t.source === 'Mine' && t.concept === qubits.id);
  assert.equal(mine.length, 1, 'the note says qubits and reads like the wire\'s quantum items');
  assert.match(mine[0].why, /reads like its other items/);
  assert.ok(mine[0].wasGeneratedBy.parameters.context >= 0.12);
});
