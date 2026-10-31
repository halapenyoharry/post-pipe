import test from 'node:test';
import assert from 'node:assert/strict';
import { syntheticStone, syntheticRecords, shippedSeed, conceptOf, rec, earned } from './helpers.js';
import { buildStone, indexStone, resolveLabel } from '../lib/stone.js';
import { buildUniverse } from '../lib/universe.js';
import { DISCOVERED_SCHEME, SITE_SCHEME, schemeOfSource } from '../lib/corpus.js';
import { scoreVariants, rankingPool } from '../lib/canon.js';
import { emerge } from '../lib/emerge.js';

const stone = syntheticStone();
const name = (id) => stone.concepts.find((c) => c.id === id).canonical;
const relations = (type) => stone.relations.filter((r) => r.type === type).map((r) => [name(r.a), name(r.b)]);

test('spellings that mean the same fold into one concept', () => {
  const same = [
    ['ai', 'artificial intelligence'],
    ['ml', 'machine learning'],
    ['prison', 'prisons'],
    ['system thinking', 'systems thinking'],
    ['climate change', 'global warming'],
  ];
  for (const [a, b] of same) assert.equal(conceptOf(stone, a), conceptOf(stone, b), `${a} = ${b}`);
});

test('case / punctuation variants are one TERM with several forms, across tag-systems', () => {
  const ai = conceptOf(stone, 'ai');
  const v = ai.variants.find((x) => x.norm === 'ai');
  assert.deepEqual(Object.keys(v.formsBySource).sort(), ['Archive', 'Journal', 'Wire']);
  assert.deepEqual(v.formsBySource.Journal, { ai: 3 });
  assert.deepEqual(v.formsBySource.Wire, { AI: 1 });
  assert.deepEqual(v.formsBySource.Archive, { 'A.I.': 1 });
});

test('things that are related but not the same stay separate', () => {
  const apart = [
    ['ai', 'agi'], // co-tagged by the same author: anti-synonym evidence
    ['climate', 'climate change'], // broader/related, not identical
    ['complex systems', 'systems thinking'],
    ['labor', 'unions'],
    ['prison', 'incarceration'],
  ];
  for (const [a, b] of apart) assert.notEqual(conceptOf(stone, a), conceptOf(stone, b), `${a} != ${b}`);
});

test('canonical label is the best-scoring variant, shown cleanly', () => {
  assert.equal(conceptOf(stone, 'ai').canonical, 'AI'); // "AI" and "A.I." were written once each: plain capitals win the tie
  assert.equal(conceptOf(stone, 'systems thinking').canonical, 'Systems Thinking'); // not the slug "systems-thinking"
  assert.equal(conceptOf(stone, 'machine learning').canonical, 'Machine Learning');
});

test('an acronym is shown as somebody wrote it, never rewritten', () => {
  const dotted = buildStone(rec('Journal', { 1: ['A.I.'], 2: ['A.I.'] }), {});
  assert.equal(conceptOf(dotted, 'ai').canonical, 'A.I.', 'the only written form stays');
  const mostly = buildStone([...rec('Journal', { 1: ['A.I.'], 2: ['A.I.'] }), ...rec('Wire', { 3: ['AI'] })], {});
  assert.equal(conceptOf(mostly, 'ai').canonical, 'A.I.', 'the most written acronym spelling wins');
});

test('every variant carries explainable score parts in 0..1', () => {
  for (const c of stone.concepts) {
    for (const r of c.rank) {
      for (const p of Object.values(r.parts)) assert.ok(p >= 0 && p <= 1, `${c.id} ${r.label} part out of range`);
      assert.ok(r.score >= 0 && r.score <= 1);
    }
    assert.equal(c.rank[0].label === c.canonical || c.pinned, true);
  }
});

test('relations: seed hierarchy resolves through alias groups; usage-derived related; review queue', () => {
  assert.ok(relations('broader').some(([a, b]) => a === 'AI' && b === 'Machine Learning'));
  assert.ok(relations('broader').some(([a, b]) => a === 'AI' && b === 'agi'), 'seed names "artificial general intelligence"; corpus only has agi');
  assert.ok(relations('related').some(([a, b]) => [a, b].sort().join() === ['General Strike', 'Labor'].sort().join()));
  // both review pairs are written by different tag-systems, so the queue names them closeMatch
  const near = relations('closeMatch').map((p) => p.slice().sort().join(' ~ '));
  assert.ok(near.includes('Labor ~ labour'));
  assert.ok(near.includes('Criminal Justice ~ carceral state'));
  assert.equal(relations('near').length, 0, 'no review pair is within one scheme on the synthetic corpus');
});

test('adjacent never duplicates a pair that is already near or co-tagged', () => {
  const near = new Set(stone.relations.filter((r) => r.type === 'near').map((r) => [r.a, r.b].sort().join()));
  for (const r of stone.relations.filter((x) => x.type === 'adjacent')) assert.ok(!near.has([r.a, r.b].sort().join()));
});

// ---- relations speak SKOS: typing by scheme, every relation with its reason ------------------------
const byType = (s, type) => s.relations.filter((r) => r.type === type);
const pairOf = (s, r) => [s.concepts.find((c) => c.id === r.a).canonical, s.concepts.find((c) => c.id === r.b).canonical];
// the same article under two tag-systems: one item carrying both vocabularies (shared url). Two tags
// that always travel together on such items look like translations of each other (the anchor
// signal), so the fixtures below say `notSame` where a human would: the point is the relation. Titles
// are the bare ids so no fixture word leaks into the text profiles.
const twoSchemes = (first, second) => [
  ...rec(first.source, Object.fromEntries(first.items.map((id) => [id, first.tags[id] ?? []])), Object.fromEntries(first.items.map((id) => [id, { url: `https://x/${id}`, title: id, text: first.text?.[id] ?? '' }]))),
  ...rec(second.source, Object.fromEntries(second.items.map((id) => [id, second.tags[id] ?? []])), Object.fromEntries(second.items.map((id) => [id, { url: `https://x/${id}`, title: id, text: second.text?.[id] ?? '' }]))),
];

test('every relation says why and carries its provenance', () => {
  for (const s of [stone, syntheticStone({ overrides: { relations: [{ a: 'ai', b: 'labor', type: 'synergy', note: 'x' }] } })]) {
    assert.ok(s.relations.length > 0);
    for (const r of s.relations) {
      assert.equal(typeof r.why, 'string', `${r.type} ${r.a} ${r.b} has a why`);
      assert.ok(r.why.length > 20, `${r.type} ${r.a} ${r.b}: "${r.why}" is a sentence`);
      assert.ok(Array.isArray(r.wasDerivedFrom) && r.wasDerivedFrom.length > 0, `${r.type} ${r.a} ${r.b}: wasDerivedFrom`);
      for (const d of r.wasDerivedFrom) assert.equal(typeof d.type, 'string');
      assert.equal(r.wasGeneratedBy.activity, 'relate');
      assert.equal(typeof r.wasGeneratedBy.parameters, 'object');
      assert.equal(typeof r.skos, 'boolean', `${r.type} ${r.a} ${r.b}: skos is said either way`);
      assert.ok(!['narrower', 'narrowMatch'].includes(r.type), 'the narrow side is never emitted; the inverse is implied');
    }
  }
  const strike = byType(stone, 'related').find((r) => pairOf(stone, r).sort().join() === ['General Strike', 'Labor'].sort().join());
  assert.match(strike.why, /share \d+ of their \d+ and \d+ items/);
  assert.match(strike.why, /NPMI/);
  assert.deepEqual(strike.wasDerivedFrom, [{ type: 'cooccurrence', items: strike.evidence.n }]);
  assert.deepEqual(strike.wasGeneratedBy.parameters, { minNpmi: 0.25, minCooc: 2 });
  const seeded = byType(stone, 'broader').find((r) => pairOf(stone, r).join() === 'AI,agi');
  assert.deepEqual(seeded.wasDerivedFrom, [{ type: 'seed' }]);
  assert.match(seeded.why, /curated seed/);
});

test('a cross-scheme near is a closeMatch; a near inside one scheme keeps its name with skos false', () => {
  const cross = byType(stone, 'closeMatch').find((r) => pairOf(stone, r).sort().join(' ~ ') === 'Labor ~ labour');
  assert.ok(cross, 'Journal/Wire write "Labor", Archive writes "labour": a mapping between schemes');
  assert.equal(cross.skos, true);
  assert.ok(cross.weight >= 0.4 && cross.weight < 0.7);
  assert.deepEqual(cross.evidence.terms.slice().sort(), ['labor', 'labour']);
  assert.match(cross.why, /probably the same/);
  assert.ok(cross.wasDerivedFrom.every((d) => d.type === 'signal' && d.name));
  // the same two spellings inside ONE tag-system: a review item, not a mapping
  const one = buildStone(rec('A', { 1: ['labor'], 2: ['labour'] }), {});
  const within = one.relations.find((r) => r.evidence?.terms);
  assert.ok(within, 'the pair is still queued for review');
  assert.equal(within.type, 'near');
  assert.equal(within.skos, false);
  assert.equal(byType(one, 'closeMatch').length, 0);
});

test('a cross-scheme usage-broader is a broadMatch; within a scheme it stays broader with skos true', () => {
  // "alpha" (system X) covers every item that "beta" (system Y) covers, and more: subsumption across schemes
  const records = twoSchemes(
    { source: 'X', items: ['1', '2', '3', '4', '5'], tags: { 1: ['alpha'], 2: ['alpha'], 3: ['alpha'], 4: ['alpha'], 5: ['alpha'] } },
    { source: 'Y', items: ['3', '4', '5'], tags: { 3: ['beta'], 4: ['beta'], 5: ['beta'] } },
  );
  const s = buildStone(records, { overrides: { notSame: [['alpha', 'beta']] } });
  const [bm] = byType(s, 'broadMatch');
  assert.ok(bm, 'alpha broadMatch beta');
  assert.deepEqual(pairOf(s, bm), ['alpha', 'beta']);
  assert.equal(bm.skos, true);
  assert.equal(byType(s, 'broader').length, 0);
  assert.match(bm.why, /3 of 3 beta items also carry alpha \(P=1\.00\)/);
  assert.deepEqual(bm.wasDerivedFrom, [{ type: 'cooccurrence', items: 3 }]);
  assert.deepEqual(bm.wasGeneratedBy.parameters, { minSupport: 3, broaderP: 0.8, narrowerMaxP: 0.6 });
  // the same usage inside one system is skos:broader
  const same = buildStone(rec('X', { 1: ['alpha'], 2: ['alpha'], 3: ['alpha', 'beta'], 4: ['alpha', 'beta'], 5: ['alpha', 'beta'] }), {});
  const [br] = byType(same, 'broader');
  assert.deepEqual(pairOf(same, br), ['alpha', 'beta']);
  assert.equal(br.skos, true);
  assert.equal(byType(same, 'broadMatch').length, 0);
  // synthetic: AI (Archive, Journal, Wire) and agi (Journal) share Journal, so the seed hierarchy is skos:broader
  for (const r of byType(stone, 'broader')) assert.equal(r.skos, true, pairOf(stone, r).join(' > '));
});

test('adjacent alone is never SKOS, whatever the schemes', () => {
  assert.ok(byType(stone, 'adjacent').length > 0);
  for (const r of byType(stone, 'adjacent')) assert.equal(r.skos, false);
  assert.ok(stone.relations.every((r) => r.skos === false || ['broader', 'related', 'closeMatch', 'broadMatch', 'relatedMatch', 'exactMatch'].includes(r.type)));
});

test('related across schemes is a relatedMatch only when the texts agree (cosine >= minAdjacent)', () => {
  const quantum = 'quantum qubits entanglement coherence decoherence superposition';
  const records = [
    // E (system P) and F (system Q) co-occur on two of their three items, and every item reads alike
    ...twoSchemes(
      { source: 'P', items: ['e1', 'e2', 'e3'], tags: { e1: ['E'], e2: ['E'], e3: ['E'] }, text: { e1: quantum, e2: quantum, e3: quantum } },
      { source: 'Q', items: ['e2', 'e3', 'e4'], tags: { e2: ['F'], e3: ['F'], e4: ['F'] }, text: { e2: quantum, e3: quantum, e4: quantum } },
    ),
    // C and D co-occur the same way, but the items they do not share are about different things and the shared ones say nothing
    ...twoSchemes(
      { source: 'P', items: ['m1', 'm2', 'm3'], tags: { m1: ['C'], m2: ['C'], m3: ['C'] }, text: { m1: 'cats purr whiskers kitten feline' } },
      { source: 'Q', items: ['m2', 'm3', 'm4'], tags: { m2: ['D'], m3: ['D'], m4: ['D'] }, text: { m4: 'rockets orbit thrust booster payload' } },
    ),
    // filler so co-occurrence is more than chance
    ...rec('P', { f1: ['g1'], f2: ['g2'], f3: ['g3'], f4: ['g4'], f5: ['g5'], f6: ['g6'] }),
  ];
  const s = buildStone(records, { overrides: { notSame: [['E', 'F'], ['C', 'D']] } });
  const ef = s.relations.find((r) => pairOf(s, r).sort().join() === 'E,F' && r.type !== 'near');
  assert.ok(ef, 'E and F relate');
  assert.equal(ef.type, 'relatedMatch');
  assert.equal(ef.skos, true);
  assert.ok(ef.evidence.cosine >= 0.3);
  assert.match(ef.why, /read alike \(cosine/);
  assert.ok(ef.wasDerivedFrom.some((d) => d.type === 'cooccurrence' && d.items === 2));
  assert.ok(ef.wasDerivedFrom.some((d) => d.type === 'text' && d.cosine === ef.evidence.cosine));
  assert.equal(ef.wasGeneratedBy.parameters.minAdjacent, 0.3);
  const cd = s.relations.find((r) => pairOf(s, r).sort().join() === 'C,D' && r.type !== 'near');
  assert.ok(cd, 'C and D relate by co-occurrence');
  assert.equal(cd.type, 'related', 'without text support the name stays');
  assert.equal(cd.skos, false);
  assert.ok(cd.evidence.cosine < 0.3);
  assert.equal(byType(s, 'relatedMatch').length, 1);
  // the synthetic review pair also co-occurs on texts that read alike: both names, one pair
  const cj = byType(stone, 'relatedMatch').map((r) => pairOf(stone, r).sort().join(' ~ '));
  assert.deepEqual(cj, ['Criminal Justice ~ carceral state']);
});

test('lexical broader: "brain scans" contains the words of "brain", when usage corroborates it', () => {
  const ids = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));
  const tags = (brain, scans) => Object.fromEntries(ids(1, 9).map((id) => [id, [...(brain.includes(id) ? ['brain'] : []), ...(scans.includes(id) ? ['brain scans'] : [])]]));
  // brain on 1..8, brain scans on 4..9: 5 of 6 brain-scans items carry brain (P=0.83); usage alone would not say
  // broader (P(scans|brain)=0.63 is above narrowerMaxP), the words do
  const s = buildStone(rec('Science', tags(ids(1, 8), ids(4, 9))), {});
  const [lb] = byType(s, 'broader');
  assert.ok(lb, 'brain broader than brain scans');
  assert.deepEqual(pairOf(s, lb), ['brain', 'brain scans']);
  assert.equal(lb.skos, true, 'one scheme: skos:broader');
  assert.equal(lb.why, '"brain scans" contains the words of "brain"; 5 of 6 brain scans items also carry brain (P=0.83)');
  assert.deepEqual(lb.wasDerivedFrom, [{ type: 'cooccurrence', items: 5 }, { type: 'stem', key: 'brain' }]);
  assert.deepEqual(lb.wasGeneratedBy, { activity: 'relate', parameters: { lexicalBroader: { minP: 0.5, minN: 2 } } });
  assert.deepEqual(lb.evidence.derivation, ['lexical']);
  assert.equal(byType(s, 'related').length, 0, 'the hierarchy replaces the symmetric reading of the same pair');
  // without the corroboration (one shared item) the words alone say nothing
  const alone = buildStone(rec('Science', tags(ids(1, 3), ids(3, 8))), {});
  assert.equal(byType(alone, 'broader').length, 0);
  // across schemes the same evidence is a broadMatch
  const cross = buildStone(twoSchemes(
    { source: 'Posts', items: ids(1, 8), tags: Object.fromEntries(ids(1, 8).map((id) => [id, ['brain']])) },
    { source: 'Wire', items: ids(4, 9), tags: Object.fromEntries(ids(4, 9).map((id) => [id, ['brain scans']])) },
  ), { overrides: { notSame: [['brain', 'brain scans']] } });
  assert.equal(byType(cross, 'broader').length, 0);
  assert.deepEqual(pairOf(cross, byType(cross, 'broadMatch')[0]), ['brain', 'brain scans']);
  assert.equal(byType(cross, 'broadMatch')[0].skos, true);
});

test('lexical and usage broader on one pair stay one relation that cites both', () => {
  // brain on 1..8, brain scans on 4..8: P(brain|scans)=1, P(scans|brain)=0.63 — not usage-broader; make it: scans on 4..7
  const s = buildStone(rec('Science', { 1: ['brain'], 2: ['brain'], 3: ['brain'], 4: ['brain', 'brain scans'], 5: ['brain', 'brain scans'], 6: ['brain', 'brain scans'], 7: ['brain'], 8: ['brain'] }), {});
  const both = byType(s, 'broader');
  assert.equal(both.length, 1);
  assert.deepEqual(both[0].evidence.derivation, ['usage', 'lexical']);
  assert.match(both[0].why, /by usage/);
  assert.match(both[0].why, /contains the words of/);
  assert.deepEqual(both[0].wasDerivedFrom.map((d) => d.type), ['cooccurrence', 'stem']);
  assert.deepEqual(both[0].wasGeneratedBy.parameters, { minSupport: 3, broaderP: 0.8, narrowerMaxP: 0.6, lexicalBroader: { minP: 0.5, minN: 2 } });
});

test('a hierarchy never runs both ways: the words do not overturn a usage broader in the other direction', () => {
  // "brain scans" on 1..10, "brain" on 1..6: usage says scans ⊃ brain (P(scans|brain)=1, P(brain|scans)=0.6),
  // the words say brain ⊃ brain scans (6 of 10, P=0.60 >= minP) — only the usage row is emitted
  const tags = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [String(i + 1), ['brain scans', ...(i < 6 ? ['brain'] : [])]]));
  const s = buildStone(rec('Science', tags), {});
  const broader = byType(s, 'broader');
  assert.equal(broader.length, 1, 'exactly one broader row on the pair');
  assert.deepEqual(pairOf(s, broader[0]), ['brain scans', 'brain']);
  assert.deepEqual(broader[0].evidence.derivation, ['usage']);
});

test('two spellings of the broader concept judge a pair once: why and provenance say it one time', () => {
  // "brain" / "brains" alternate on 1..8 (one concept), "brain scans" on 4..9
  const tags = {};
  for (let i = 1; i <= 9; i++) tags[String(i)] = [...(i <= 8 ? [i % 2 ? 'brain' : 'brains'] : []), ...(i >= 4 ? ['brain scans'] : [])];
  const s = buildStone(rec('Science', tags), {});
  assert.equal(conceptOf(s, 'brain'), conceptOf(s, 'brains'), 'brain and brains are one concept');
  const [lb] = byType(s, 'broader');
  assert.ok(lb);
  assert.equal(lb.why, '"brain scans" contains the words of "brain"; 5 of 6 brain scans items also carry brain (P=0.83)');
  assert.deepEqual(lb.wasDerivedFrom, [{ type: 'cooccurrence', items: 5 }, { type: 'stem', key: 'brain' }]);
  assert.deepEqual(lb.evidence.derivation, ['lexical']);
});

test('a lexical broader that replaced a related says so', () => {
  // brain on 1..5, brain scans on 3..6, ten items tagged otherwise: on that background the pair's
  // co-occurrence beats chance (NPMI), so usage calls it related before the words call it a hierarchy
  const tags = { 1: ['brain'], 2: ['brain'], 3: ['brain', 'brain scans'], 4: ['brain', 'brain scans'], 5: ['brain', 'brain scans'], 6: ['brain scans'] };
  for (let i = 0; i < 10; i++) tags[`x${i}`] = ['other'];
  const s = buildStone(rec('Science', tags), {});
  const [lb] = byType(s, 'broader');
  assert.equal(lb.evidence.replaced, 'related', 'usage had called the pair related (NPMI)');
  assert.equal(byType(s, 'related').length, 0);
  // where usage made no related, nothing is said to be replaced
  const both = buildStone(rec('Science', { 1: ['brain'], 2: ['brain'], 3: ['brain'], 4: ['brain', 'brain scans'], 5: ['brain', 'brain scans'], 6: ['brain', 'brain scans'], 7: ['brain'], 8: ['brain'] }), {});
  assert.equal(byType(both, 'broader')[0].evidence.replaced, undefined);
});

test('a human relation written in a SKOS name replaces the computed row of the same saying: one row per pair and saying', () => {
  const s = syntheticStone({ overrides: { relations: [{ a: 'labor', b: 'labour', type: 'closeMatch' }, { a: 'criminal justice', b: 'carceral state', type: 'relatedMatch' }] } });
  const labor = conceptOf(s, 'labor').id;
  const labour = conceptOf(s, 'labour').id;
  const cj = conceptOf(s, 'criminal justice').id;
  const cs = conceptOf(s, 'carceral state').id;
  const on = (x, y) => s.relations.filter((r) => [r.a, r.b].sort().join() === [x, y].sort().join());
  assert.deepEqual(on(labor, labour).map((r) => [r.type, r.locked]), [['closeMatch', true]], 'the human closeMatch replaced the computed near-turned-closeMatch');
  assert.deepEqual(on(cj, cs).filter((r) => r.type !== 'closeMatch').map((r) => [r.type, r.locked]), [['relatedMatch', true]]);
  assert.ok(on(cj, cs).some((r) => r.type === 'closeMatch' && !r.locked), 'the computed closeMatch on that pair says something else and stays');
  // the old name does the same: a human `related` replaces a computed relatedMatch
  const old = syntheticStone({ overrides: { relations: [{ a: 'criminal justice', b: 'carceral state', type: 'related' }] } });
  assert.deepEqual(old.relations.filter((r) => [r.a, r.b].sort().join() === [cj, cs].sort().join() && r.type !== 'closeMatch').map((r) => [r.type, r.locked, r.skos]), [['related', true, true]]);
});

test('an override type outside the documented list is dropped with one warning, not stored', () => {
  const warnings = [];
  const s = syntheticStone({ warn: (m) => warnings.push(m), overrides: { relations: [{ a: 'ai', b: 'labor', type: 'bogus' }, { a: 'ai', b: 'labor', type: 'near' }, { a: 'ai', b: 'labor', type: 'synergy' }] } });
  assert.deepEqual(s.relations.filter((r) => r.locked).map((r) => r.type), ['synergy']);
  assert.equal(warnings.length, 2);
  assert.match(warnings[0], /"bogus" is not a relation type/);
  assert.match(warnings[1], /"near" is not a relation type/);
});

test("a human's non-SKOS relation toward a published vocabulary is skos false", () => {
  const s = syntheticStone({ overrides: { relations: [{ a: 'ai', b: 'iptc-mediatopics:medtop:1', type: 'adjacent' }, { a: 'ai', b: 'iptc-mediatopics:medtop:2', type: 'synergy' }, { a: 'ai', b: 'iptc-mediatopics:medtop:3', type: 'exactMatch' }] } });
  assert.deepEqual(s.relations.filter((r) => r.external).map((r) => [r.type, r.skos]).sort(), [['adjacent', false], ['exactMatch', true], ['synergy', false]]);
});

test('notRelated written in the pre-typing name removes the row typing renamed, and the other way round', () => {
  const labor = conceptOf(stone, 'labor').id;
  const labour = conceptOf(stone, 'labour').id;
  const cj = conceptOf(stone, 'criminal justice').id;
  const cs = conceptOf(stone, 'carceral state').id;
  assert.ok(stone.relations.some((r) => r.type === 'closeMatch' && [r.a, r.b].sort().join() === [labor, labour].sort().join()));
  const s = syntheticStone({ overrides: { notRelated: [{ a: 'labor', b: 'labour', type: 'near' }, { a: 'criminal justice', b: 'carceral state', type: 'related' }] } });
  assert.deepEqual(s.forbidden.map((r) => r.type).sort(), ['closeMatch', 'relatedMatch']);
  assert.ok(!s.relations.some((r) => r.type === 'closeMatch' && [r.a, r.b].sort().join() === [labor, labour].sort().join()));
  assert.ok(!s.relations.some((r) => r.type === 'relatedMatch' && [r.a, r.b].sort().join() === [cj, cs].sort().join()));
  assert.ok(s.relations.some((r) => r.type === 'closeMatch' && [r.a, r.b].sort().join() === [cj, cs].sort().join()), 'the pair\'s closeMatch says something else and stays');
  // a rule in the SKOS name removes a within-scheme row of the same saying
  const ai = conceptOf(stone, 'ai').id;
  const ml = conceptOf(stone, 'machine learning').id;
  const t = syntheticStone({ overrides: { notRelated: [{ a: 'ai', b: 'ml', type: 'relatedMatch' }, { a: 'ai', b: 'ml', type: 'broadMatch' }] } });
  assert.deepEqual(t.forbidden.map((r) => `${r.type} ${r.a} ${r.b}`).sort(), [`broader ${ai} ${ml}`, `related ${ai} ${ml}`]);
});

test('overrides.relations accepts SKOS names, flips the narrow side, and reaches a published vocabulary by "<scheme>:<id>"', () => {
  const s = syntheticStone({
    overrides: {
      relations: [
        { a: 'machine learning', b: 'ai', type: 'narrowMatch', note: 'ml is the narrower' },
        { a: 'ai', b: 'iptc-mediatopics:medtop:20000763', type: 'exactMatch', note: 'IPTC artificial intelligence' },
        { a: 'labor', b: 'iptc-mediatopics:medtop:20000521', type: 'narrower' },
      ],
    },
  });
  const ai = conceptOf(s, 'ai').id;
  const flipped = s.relations.find((r) => r.type === 'broadMatch' && r.locked);
  assert.deepEqual([flipped.a, flipped.b], [ai, conceptOf(s, 'machine learning').id], 'narrowMatch {ml, ai} is stored as broadMatch {ai, ml}');
  assert.equal(flipped.skos, true);
  assert.deepEqual(flipped.wasDerivedFrom, [{ type: 'override', note: 'ml is the narrower' }]);
  assert.match(flipped.why, /overrides\.json says "AI" broadMatch "Machine Learning": ml is the narrower/);
  const ext = s.relations.find((r) => r.b === 'iptc-mediatopics:medtop:20000763');
  assert.ok(ext, 'the external id is kept verbatim');
  assert.equal(ext.a, ai);
  assert.equal(ext.type, 'exactMatch');
  assert.equal(ext.skos, true);
  assert.equal(ext.locked, true);
  assert.equal(ext.external, true);
  assert.ok(!s.relations.some((r) => r.b === 'iptc-mediatopics:medtop:20000521'), 'narrower toward an external id cannot be flipped, so it is not stated');
  assert.ok(!s.relations.some((r) => r.a.includes(':')), 'an external id is never `a`');
  // it survives the universe's unknown-id filter
  const u = buildUniverse(s, syntheticRecords());
  const kept = u.relations.find((r) => r.b === 'iptc-mediatopics:medtop:20000763');
  assert.ok(kept && kept.a === ai && kept.skos === true);
  assert.ok(u.relations.every((r) => u.concepts.some((c) => c.id === r.a)));
  assert.ok(u.relations.every((r) => u.concepts.some((c) => c.id === r.b) || r.b.includes(':')));
});

test('overrides.notRelated removes exactly the named relation(s) and lists them in forbidden', () => {
  const before = stone.relations.map((r) => `${r.type} ${r.a} ${r.b}`);
  const labor = conceptOf(stone, 'labor').id;
  const strike = conceptOf(stone, 'general strike').id;
  const ai = conceptOf(stone, 'ai').id;
  const ml = conceptOf(stone, 'machine learning').id;
  // untyped: every relation between the pair, either direction; typed: that type only
  const s = syntheticStone({ overrides: { notRelated: [{ a: 'general strike', b: 'labor' }, { a: 'ai', b: 'ml', type: 'related' }, { a: 'nobody', b: 'labor' }] } });
  const after = s.relations.map((r) => `${r.type} ${r.a} ${r.b}`);
  const gone = before.filter((k) => !after.includes(k));
  assert.deepEqual(gone.sort(), [`related ${ai} ${ml}`, `related ${strike} ${labor}`].sort(), 'exactly those two');
  assert.deepEqual(after.filter((k) => !before.includes(k)), [], 'nothing added');
  assert.ok(after.includes(`broader ${ai} ${ml}`), 'the typed rule leaves the hierarchy alone');
  assert.deepEqual(s.forbidden, [
    { a: ai, b: ml, type: 'related', why: 'override' },
    { a: strike, b: labor, type: 'related', why: 'override' },
  ]);
  assert.equal(s.stats.relations, stone.stats.relations - 2);
  assert.deepEqual(stone.forbidden, [], 'nothing forbidden without the override');
  // forbidding also beats a human relation and a seed, since it is applied last
  const seeded = syntheticStone({ overrides: { relations: [{ a: 'ai', b: 'labor', type: 'synergy' }], notRelated: [{ a: 'labor', b: 'ai' }, { a: 'agi', b: 'ai', type: 'narrower' }] } });
  assert.ok(!seeded.relations.some((r) => r.type === 'synergy'));
  assert.ok(!seeded.relations.some((r) => r.type === 'broader' && r.a === ai && r.b === conceptOf(stone, 'agi').id), 'notRelated narrower {agi, ai} forbids broader {ai, agi}');
  assert.equal(seeded.forbidden.length, 2);
  // the universe carries the list through
  assert.deepEqual(buildUniverse(s, syntheticRecords()).forbidden, s.forbidden);
});

test('systems report coverage honestly', () => {
  assert.equal(stone.systems.Science.items, 12);
  assert.equal(stone.systems.Science.tagged, 0);
  assert.equal(stone.systems.Science.untagged, 12);
  assert.equal(stone.systems.Science.distinctTags, 0);
  // distinctTags counts the terms on a system's items from any origin: a discovered spelling on
  // the wire's items is a tag the wire carries, although its scheme is `discovered`
  const s = buildStone(driftRecords(), {});
  assert.equal(s.systems.Wire.occurrences, 3);
  assert.equal(s.systems.Wire.distinctTags, 1);
  assert.equal(s.systems.Posts.distinctTags, 1);
  const named = buildStone(rec('site', { 1: ['Thing'], 2: ['Other'] }), {});
  assert.equal(named.systems.site.distinctTags, 2, 'a system named like a scheme still counts its tags');
});

test('build is deterministic', () => {
  const a = JSON.stringify(syntheticStone());
  const b = JSON.stringify(syntheticStone());
  assert.equal(a, b);
});

// ---- overrides ---------------------------------------------------------------------------
test('overrides.same locks a merge the evidence alone would not make', () => {
  const s = syntheticStone({ overrides: { same: [['labor', 'labour']] } });
  const c = conceptOf(s, 'labour');
  assert.equal(c, conceptOf(s, 'labor'));
  assert.equal(c.locked, true);
  assert.ok(!s.relations.some((r) => r.type === 'near' && [r.a, r.b].every((id) => id === c.id)));
});

test('overrides.notSame beats a seed that says they are the same', () => {
  const s = syntheticStone({ overrides: { notSame: [['climate change', 'global warming']] } });
  assert.notEqual(conceptOf(s, 'climate change'), conceptOf(s, 'global warming'));
});

test('overrides.pin fixes the canonical label regardless of score', () => {
  const s = syntheticStone({ overrides: { pin: { ai: 'Artificial Intelligence' } } });
  const c = conceptOf(s, 'ai');
  assert.equal(c.canonical, 'Artificial Intelligence');
  assert.equal(c.pinned, true);
});

test('overrides.ignore drops a tag entirely', () => {
  const s = syntheticStone({ overrides: { ignore: ['political'] } });
  assert.equal(conceptOf(s, 'political'), undefined);
});

test('overrides.relations add human-authored, locked relations', () => {
  const s = syntheticStone({ overrides: { relations: [{ a: 'ai', b: 'labor', type: 'synergy', note: 'x' }] } });
  const syn = s.relations.find((r) => r.type === 'synergy');
  assert.ok(syn && syn.locked && syn.weight === 1);
});

test('overrides.sourceWeights and canon.prefer change which label wins', () => {
  const records = [
    ...rec('Trusted', { 1: ['Machine Learning'], 2: ['Machine Learning'] }),
    ...rec('Other', { 3: ['ML'], 4: ['ML'], 5: ['ML'], 6: ['ML'] }),
  ];
  const seed = { same: [['ml', 'machine learning']] };
  const base = buildStone(records, { seeds: [seed] });
  assert.equal(conceptOf(base, 'ml').canonical, 'ML'); // most used wins by default
  const trusted = buildStone(records, { seeds: [seed], overrides: { sourceWeights: { Trusted: 2, Other: 0.1 }, canon: { weights: { freq: 0, cover: 0, trust: 1, quality: 0 } } } });
  assert.equal(conceptOf(trusted, 'ml').canonical, 'Machine Learning');
});

// ---- translation of unseen data -------------------------------------------------------
test('resolveLabel places unseen spellings by stem / word-set, and refuses ambiguity', () => {
  const index = indexStone(stone);
  const ai = conceptOf(stone, 'ai').id;
  assert.deepEqual(resolveLabel(index, 'A.I.'), { concept: ai, via: 'known', conf: 1 });
  const st = resolveLabel(index, 'Systems-Thinkings');
  assert.equal(st.via, 'stem');
  assert.equal(st.concept, conceptOf(stone, 'systems thinking').id);
  assert.equal(resolveLabel(index, 'thinking systems').via, 'tokenset');
  assert.equal(resolveLabel(index, 'quantum gravity'), null);
  assert.equal(resolveLabel(index, '!!!'), null);
});

test('empty corpus builds an empty stone instead of crashing', () => {
  const s = buildStone([], { seeds: [shippedSeed()] });
  assert.equal(s.concepts.length, 0);
  assert.equal(s.stats.tags, 0);
});

test('records without a type are accepted as tag rows', () => {
  const s = buildStone(
    [
      { type: 'item', source: 'A', id: '1', title: 'x' },
      { source: 'A', item: '1', label: 'Thing' },
    ],
    {},
  );
  assert.equal(s.stats.tags, 1);
});

test('synthetic corpus is the documented size', () => {
  assert.equal(syntheticRecords().filter((r) => r.type === 'item').length, 43);
  assert.equal(stone.stats.tags, 52);
  assert.equal(stone.stats.concepts, 47);
});

// ---- regressions found by running on a real corpus ----------------------------------------
test('review queue: similar usage alone never qualifies; a spelling or strong anchor does', () => {
  const t = 'felines purr nap sunbeam whiskers';
  const records = [
    ...rec('A', { 1: ['labor', 'cats'], 2: ['labor', 'cats'] }, { 1: { title: 'one', text: t }, 2: { title: 'two', text: t } }),
    ...rec('B', { 3: ['labour', 'felines'], 4: ['labour', 'felines'] }, { 3: { title: 'three', text: t }, 4: { title: 'four', text: t } }),
  ];
  const s = buildStone(records, {});
  const pairs = s.relations.filter((r) => r.type === 'near' || r.type === 'closeMatch').map((r) => r.evidence.terms.slice().sort().join(' ~ '));
  assert.ok(pairs.includes('labor ~ labour'), 'spelling variants are review candidates');
  assert.ok(!pairs.some((p) => p.includes('cats') && p.includes('felines')), 'cats/felines share only usage: adjacent at most');
});

// ---- schemes: prefLabel / altLabel / inScheme, and the drift fix ---------------------------
// Posts writes "process" once; discovery proposes "processing" on three other items. They fold into
// one concept; the human's spelling is the canonical, discovery's is that scheme's prefLabel.
const driftRecords = () => [
  ...rec('Posts', { p1: ['process'] }, { p1: { title: 'On process', text: 'the process of writing' } }),
  ...rec('Wire', { w1: [], w2: [], w3: [] }, { w1: { title: 'a', text: 'processing signals' }, w2: { title: 'b', text: 'processing data' }, w3: { title: 'c', text: 'processing noise' } }),
  ...earned('Wire', ['w1', 'w2', 'w3'], 'processing'),
];

test("a discovered spelling never outranks a human's", () => {
  const s = buildStone(driftRecords(), {});
  const c = conceptOf(s, 'process');
  assert.equal(c, conceptOf(s, 'processing'), 'process and processing are one concept');
  assert.equal(c.canonical, 'process');
  assert.equal(c.discovered, false);
  assert.equal(c.prefLabel[DISCOVERED_SCHEME], 'processing');
  assert.equal(c.prefLabel[SITE_SCHEME], 'process');
  assert.equal(c.prefLabel.Posts, 'process');
  assert.ok(c.altLabel[SITE_SCHEME].includes('processing'));
  assert.deepEqual(c.inScheme, ['Posts', DISCOVERED_SCHEME, SITE_SCHEME]);
  assert.deepEqual(c.rank.map((r) => r.label), ['process'], 'the ranking pool is the human-written spellings');
  // the viewer re-scores live with the same pool, so it can never star a spelling rtz-stone did not
  assert.deepEqual(rankingPool(c.variants).map((v) => v.norm), ['process']);
  assert.equal(scoreVariants(rankingPool(c.variants), s.config.canon, s.config.sourceWeights)[0].label, c.rank[0].label);
  assert.notEqual(scoreVariants(c.variants, s.config.canon, s.config.sourceWeights)[0].label, c.canonical, 'without the pool, discovery would win: the drift this ends');
});

test("the credit for a human's spelling does not depend on record order", () => {
  const human = { type: 'tag', source: 'Posts', item: 'p1', label: 'process', weight: 1, origin: 'explicit' };
  const [item] = rec('Posts', { p1: [] }, { p1: { title: 'On process', text: 'the process of writing' } });
  const check = (records, order) => {
    const c = conceptOf(buildStone(records, {}), 'process');
    const v = c.variants.find((x) => x.norm === 'process');
    assert.equal(v.explicit, 1, `${order}: explicit`);
    assert.equal(v.count, 1, `${order}: one item counts once`);
    assert.deepEqual(v.bySource, { Posts: 1 }, `${order}: credited to the human's system`);
    assert.deepEqual(Object.keys(v.formsBySource).sort(), ['Posts', DISCOVERED_SCHEME], `${order}: both wrote the spelling`);
    assert.equal(c.discovered, false, order);
    assert.deepEqual(c.inScheme, ['Posts', DISCOVERED_SCHEME, SITE_SCHEME], order);
  };
  check([item, human, ...earned('Posts', ['p1'], 'process')], 'human first');
  check([item, ...earned('Posts', ['p1'], 'process'), human], 'discovery first');
});

// Since 2026-10-31 rtz-discover carries out the spelling the text writes ("Labor", "NASA"), no longer a
// lower-case one. One term (norm) can then hold a human's spelling and a different one discovery wrote.
const laborMeta = { title: 'x', text: 'the department of labor' };
const laborRecords = (humanLabels, discoveredLabel = 'Labor') => [
  ...rec('Posts', Object.fromEntries(humanLabels.map((l, i) => [`p${i}`, [l]])), Object.fromEntries(humanLabels.map((_, i) => [`p${i}`, laborMeta]))),
  ...rec('Wire', { w1: [], w2: [], w3: [] }, { w1: laborMeta, w2: laborMeta, w3: laborMeta }),
  ...earned('Wire', ['w1', 'w2', 'w3'], discoveredLabel),
];

test("within one term too, a spelling only discovery wrote never outranks a human's", () => {
  const c = conceptOf(buildStone(laborRecords(['labor']), {}), 'labor');
  assert.equal(c.canonical, 'labor', 'the text\'s "Labor" three times does not rename the human\'s "labor"');
  assert.deepEqual(c.prefLabel, { Posts: 'labor', [DISCOVERED_SCHEME]: 'Labor', [SITE_SCHEME]: 'labor' });
  assert.deepEqual(c.altLabel[SITE_SCHEME], ['Labor'], 'discovery\'s spelling is still one of the concept\'s');
  // and the other way round, as it was with lower-case discovered labels: a human's capitals stand
  assert.equal(conceptOf(buildStone(laborRecords(['Labor'], 'labor'), {}), 'labor').canonical, 'Labor');
});

test("discovery's occurrences of a spelling a human also wrote still count toward it, as they do between human variants", () => {
  // the human wrote "labor" twice and "Labor" once; discovery wrote "Labor" three times
  assert.equal(conceptOf(buildStone(laborRecords(['labor', 'labor', 'Labor']), {}), 'labor').canonical, 'Labor');
});

test('a spelling discovery carried out in capitals does not make a term an acronym; a human\'s does', () => {
  const meta = { title: 'y', text: 'news from nasa' };
  const wire = rec('Wire', { w1: [], w2: [] }, { w1: meta, w2: meta });
  const found = conceptOf(buildStone([...wire, ...earned('Wire', ['w1', 'w2'], 'NASA')], {}), 'nasa');
  assert.equal(found.canonical, 'NASA', 'shown as the text writes it');
  assert.equal(found.variants[0].acronym, false, 'emergence matches it by its stem and canonical scoring treats it as a word, as when it was "nasa"');
  const human = conceptOf(buildStone([...wire, ...rec('Desk', { d1: ['NASA'] }, { d1: meta }), ...earned('Wire', ['w1', 'w2'], 'NASA')], {}), 'nasa');
  assert.equal(human.variants[0].acronym, true);
});

test('a concept nobody wrote ranks among its own spellings and is still flagged discovered', () => {
  const s = buildStone([...rec('Wire', { w1: [], w2: [] }), ...earned('Wire', ['w1', 'w2'], 'qubits')], {});
  const c = conceptOf(s, 'qubits');
  assert.equal(c.discovered, true);
  assert.equal(c.canonical, 'qubits');
  assert.deepEqual(c.inScheme, [DISCOVERED_SCHEME, SITE_SCHEME]);
  assert.deepEqual(c.prefLabel, { [DISCOVERED_SCHEME]: 'qubits', [SITE_SCHEME]: 'qubits' });
});

test("prefLabel per scheme is a spelling present in that scheme's forms", () => {
  const drift = buildStone(driftRecords(), {});
  const universe = buildUniverse(drift, [...driftRecords(), ...earned('Wire', ['w2'], 'qubits'), { type: 'tag', source: 'Posts', item: 'p1', label: 'Fresh Tag', weight: 1 }]);
  assert.ok(universe.concepts.some((c) => c.unmapped), 'the universe has unmapped concepts to check too');
  for (const s of [stone, drift, universe]) {
    for (const c of s.concepts) {
      assert.ok(c.inScheme.includes(SITE_SCHEME), `${c.id} is in the site scheme`);
      assert.equal(c.inScheme.indexOf(SITE_SCHEME), c.inScheme.length - 1, `${c.id}: site last, once`);
      assert.equal(c.prefLabel[SITE_SCHEME], c.canonical);
      const allForms = new Set(c.variants.flatMap((v) => Object.keys(v.forms)));
      assert.ok(c.pinned || allForms.has(c.canonical), `${c.id}: canonical "${c.canonical}" was written by someone`);
      for (const scheme of c.inScheme) {
        if (scheme === SITE_SCHEME) continue;
        const written = c.variants.some((v) => Object.hasOwn(v.formsBySource[scheme] ?? {}, c.prefLabel[scheme]));
        assert.ok(written, `${c.id}: prefLabel "${c.prefLabel[scheme]}" was written in ${scheme}`);
        for (const alt of c.altLabel[scheme]) {
          assert.notEqual(alt, c.prefLabel[scheme]);
          assert.ok(c.variants.some((v) => Object.hasOwn(v.formsBySource[scheme] ?? {}, alt)), `${c.id}: altLabel "${alt}" was written in ${scheme}`);
        }
      }
      for (const alt of c.altLabel[SITE_SCHEME]) assert.ok(allForms.has(alt) && alt !== c.canonical, `${c.id}: site altLabel "${alt}" was written by someone`);
      assert.deepEqual(Object.keys(c.prefLabel).sort(), c.inScheme.slice().sort());
      assert.deepEqual(Object.keys(c.altLabel).sort(), c.inScheme.slice().sort());
    }
  }
});

test('discovered spellings are filed under the discovered scheme, not under the item\'s system', () => {
  const s = buildStone(driftRecords(), {});
  const v = conceptOf(s, 'processing').variants.find((x) => x.norm === 'processing');
  assert.deepEqual(Object.keys(v.formsBySource), [DISCOVERED_SCHEME]);
  assert.deepEqual(Object.keys(v.bySource), [DISCOVERED_SCHEME]);
  assert.equal(v.count, 3, 'discovered occurrences still count');
  assert.equal(v.explicit, 0);
  assert.equal(s.systems.Wire.items, 3, 'items stay with their real system');
  for (const c of s.concepts) for (const x of c.variants) assert.ok(!('Wire' in x.formsBySource), 'Wire wrote nothing');
});

test('a system literally named "site" or "discovered" gets its own scheme id', () => {
  assert.equal(schemeOfSource('site'), 'site (system)');
  assert.equal(schemeOfSource('discovered'), 'discovered (system)');
  assert.equal(schemeOfSource('Journal'), 'Journal');
  const s = buildStone(rec('site', { 1: ['Thing'] }), {});
  const c = conceptOf(s, 'thing');
  assert.deepEqual(c.inScheme, ['site (system)', 'site'], 'schemes sorted, then site last');
  assert.equal(c.prefLabel['site (system)'], 'Thing');
  assert.equal(c.prefLabel.site, 'Thing');
});

test('universe: tags carry provenance; unmapped concepts carry their scheme', () => {
  const records = [...driftRecords(), ...earned('Wire', ['w1'], 'signals', { origin: 'emergent', why: 'text mentions "signals"', wasDerivedFrom: [{ type: 'text', phrase: 'signals', count: 1 }], wasGeneratedBy: { activity: 'emerge', parameters: {} } })];
  const stone = buildStone(driftRecords(), {});
  const u = buildUniverse(stone, [...records, { type: 'tag', source: 'Posts', item: 'p1', label: 'Fresh Tag', weight: 1, origin: 'explicit' }]);
  const p1 = u.items.find((i) => i.key === 'Posts::p1');
  const explicit = p1.tags.find((t) => t.c === 'c_process');
  assert.deepEqual(explicit.wasDerivedFrom, [{ type: 'category', scheme: 'Posts', label: 'process' }]);
  assert.deepEqual(explicit.wasGeneratedBy, { activity: 'ingest', parameters: {} });
  const w1 = u.items.find((i) => i.key === 'Wire::w1');
  const discovered = w1.tags.find((t) => t.c === 'c_process');
  assert.equal(discovered.origin, 'discovered');
  assert.ok(!('wasDerivedFrom' in discovered) && !('wasGeneratedBy' in discovered), 'an earned record without provenance adds none, never null');
  const emergent = w1.tags.find((t) => t.c === 'u_signals');
  assert.deepEqual(emergent.wasDerivedFrom, [{ type: 'text', phrase: 'signals', count: 1 }]);
  assert.deepEqual(emergent.wasGeneratedBy, { activity: 'emerge', parameters: {} });
  // an emergent label is a canonical rtz-stone chose, so unmapped it sits in `site` alone
  const signals = u.concepts.find((c) => c.id === 'u_signals');
  assert.deepEqual(signals.inScheme, [SITE_SCHEME]);
  assert.deepEqual(signals.prefLabel, { [SITE_SCHEME]: 'signals' });
  assert.deepEqual(signals.altLabel, { [SITE_SCHEME]: [] });
  assert.deepEqual(signals.variants[0].formsBySource, { [SITE_SCHEME]: { signals: 1 } });
  const fresh = u.concepts.find((c) => c.id === 'u_fresh_tag');
  assert.deepEqual(fresh.inScheme, ['Posts', SITE_SCHEME]);
  assert.deepEqual(fresh.prefLabel, { [SITE_SCHEME]: 'Fresh Tag', Posts: 'Fresh Tag' });
  assert.deepEqual(fresh.altLabel, { Posts: [], [SITE_SCHEME]: [] });
  assert.deepEqual(fresh.variants[0].formsBySource, { Posts: { 'Fresh Tag': 1 } });
  assert.deepEqual(fresh.variants[0].bySource, { Posts: 1 });
  assert.equal(fresh.variants[0].explicit, 1);
  for (const it of u.items) for (const t of it.tags) for (const k of ['wasDerivedFrom', 'wasGeneratedBy']) if (k in t) assert.ok(t[k] != null, `${k} is never null`);
});

test('universe: a discovered label rtz-stone never absorbed is filed under discovered, not under the item\'s system', () => {
  const s = buildStone(rec('Wire', { w1: ['alpha'] }), {});
  const u = buildUniverse(s, [...rec('Wire', { w1: ['alpha'], w2: [] }), ...earned('Wire', ['w1', 'w2'], 'qubits')]);
  const q = u.concepts.find((c) => c.id === 'u_qubits');
  assert.ok(q?.unmapped);
  assert.deepEqual(q.inScheme, [DISCOVERED_SCHEME, SITE_SCHEME]);
  assert.deepEqual(q.prefLabel, { [DISCOVERED_SCHEME]: 'qubits', [SITE_SCHEME]: 'qubits' });
  assert.deepEqual(q.variants[0].formsBySource, { [DISCOVERED_SCHEME]: { qubits: 2 } });
  assert.deepEqual(q.variants[0].bySource, { [DISCOVERED_SCHEME]: 2 });
  assert.equal(q.variants[0].explicit, 0);
  assert.equal(q.variants[0].count, 2);
  assert.deepEqual(q.sources, { Wire: 2 }, 'the items still belong to their real system');
  for (const c of u.concepts) for (const v of c.variants) assert.ok(!('Wire' in v.formsBySource && 'qubits' in v.formsBySource.Wire), 'Wire never wrote qubits');
});

test('the same essay under two vocabularies counts once: no identical-text flood of adjacent relations', () => {
  const text = 'a long essay about frobnication and its discontents in modern society';
  const mk = (source, tags) => [
    { type: 'item', source, id: 'e1', title: 'On Frobnication And Its Discontents', text, url: '', date: '', kind: '' },
    ...tags.map((label) => ({ type: 'tag', source, item: 'e1', label, weight: 1 })),
  ];
  const s = buildStone([...mk('Tags', ['alpha', 'beta']), ...mk('Topology', ['gamma', 'delta'])], {});
  assert.equal(s.relations.filter((r) => r.type === 'adjacent').length, 0, 'they share one essay: that is co-tagging, not adjacency');
  assert.ok(s.relations.filter((r) => r.type === 'related').length === 0, 'one shared essay is not enough support for related either');
});

// ---- below-bar evidence (rtz-discover's floor) is layered on, never mixed in ---------------------
// A discovered record whose sourceRatio is under the sourceCoherenceRatio it was generated with is
// below its bar. `mixed` hands rtz-stone the same tags with the bar lowered to 1, so nothing is below
// it: that is what a single-layer stone would make of them, and why it must not.
const BAR = 1.6;
const rated = (source, items, label, sourceRatio, bar = BAR) =>
  earned(source, items, label, { sourceRatio, wasGeneratedBy: { activity: 'discover', parameters: { sourceCoherenceRatio: bar, sourceRatio } } });
const mixed = (records) => records.map((r) => (r.sourceRatio < BAR ? { ...r, wasGeneratedBy: { ...r.wasGeneratedBy, parameters: { ...r.wasGeneratedBy.parameters, sourceCoherenceRatio: 1 } } } : r));
const shownAt = (bar) => (x) => !(x.sourceRatio < bar);
const tagsAt = (u, bar) => u.items.map((it) => [it.key, it.tags.filter(shownAt(bar))]);
// what a viewer set at the bar keeps of a concept: its spellings and links at the bar
const atBarView = (c, norms) => {
  const x = structuredClone(c);
  x.variants = x.variants.filter(shownAt(BAR));
  x.links = x.links.filter((l) => norms.has(l.a) && norms.has(l.b));
  return x;
};
const sameAtBar = (atBar, below, label) => {
  const norms = new Set(atBar.concepts.flatMap((c) => c.variants.map((v) => v.norm)));
  const byId = new Map(below.concepts.map((c) => [c.id, c]));
  for (const c of atBar.concepts) assert.deepEqual(atBarView(byId.get(c.id), norms), c, `${label}: "${c.canonical}" (${c.id}) is the bar's concept`);
  const lateIds = new Set(below.concepts.filter((c) => !atBar.concepts.some((x) => x.id === c.id)).map((c) => c.id));
  assert.deepEqual(below.relations.filter((r) => !lateIds.has(r.a) && !lateIds.has(r.b)), atBar.relations, `${label}: relations between the bar's concepts are the bar's`);
  for (const id of lateIds) assert.ok(below.concepts.find((c) => c.id === id).sourceRatio < BAR, `${label}: a concept only below-bar evidence made carries a ratio under the bar`);
};

const volcanoMeta = Object.fromEntries(['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7'].map((k, i) => [k, { title: `Volcano report ${i}`, text: `the volcano near town ${i} erupted again; ash fell on the fields` }]));
const quietMeta = Object.fromEntries(Array.from({ length: 30 }, (_, i) => [`f${i}`, { title: `zorbl${i} flarn${i}`, text: `grindle${i} plonk${i} vexor${i}` }])); // so the volcano is not on every item
const volcanoAtBar = [
  ...rec('Wire', Object.fromEntries(Object.keys(volcanoMeta).map((k) => [k, []])), volcanoMeta),
  ...rec('Filler', Object.fromEntries(Object.keys(quietMeta).map((k) => [k, []])), quietMeta),
  ...rated('Wire', ['w1', 'w2'], 'volcanoes', 3),
];
const volcanoBelow = [...volcanoAtBar, ...rated('Wire', ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'], 'volcano', 1.2)];

test('a below-bar spelling joins a concept at the bar without moving its canonical, items, scheme labels or id', () => {
  const atBar = buildStone(volcanoAtBar, {});
  const below = buildStone(volcanoBelow, {});
  const single = conceptOf(buildStone(mixed(volcanoBelow), {}), 'volcanoes');
  assert.ok(single.canonical === 'volcano' && single.id === 'c_volcano', 'mixed in, the more frequent spelling would rename the concept and its id');
  const c = conceptOf(below, 'volcanoes');
  const was = conceptOf(atBar, 'volcanoes');
  assert.equal(c.id, 'c_volcanoes');
  assert.equal(c.canonical, 'volcanoes');
  assert.deepEqual(c.variants.map((v) => [v.norm, v.sourceRatio]), [['volcano', 1.2], ['volcanoes', 3]], 'the below-bar spelling is a variant, with its ratio');
  assert.equal(c.sourceRatio, 3, 'the concept shows when any of its spellings would');
  assert.deepEqual(c.rank, was.rank, 'only the bar\'s spellings rank');
  assert.equal(c.items, was.items, 'described at the bar');
  sameAtBar(atBar, below, 'volcano');
  const fresh = buildStone(volcanoBelow, { ledger: { prior: null } });
  assert.equal(conceptOf(fresh, 'volcanoes').id, 'c_volcanoes', 'a first ledgered build mints from the bar\'s spellings too');
});

test('two concepts at the bar never merge through a below-bar spelling', () => {
  const meta = Object.fromEntries(['i1', 'i2', 'i3', 'i4', 'i5', 'i6'].map((k) => [k, { title: `zorbl${k}`, text: `grindle${k} plonk${k}` }])); // texts share nothing, so only the given evidence links the spellings
  const base = [...rec('Wire', Object.fromEntries(Object.keys(meta).map((k) => [k, []])), meta), ...rated('Wire', ['i1', 'i2'], 'alpha', 3), ...rated('Wire', ['i3', 'i4'], 'beta', 3)];
  const withGamma = [...base, ...rated('Wire', ['i5', 'i6'], 'gamma', 1.1)];
  const extraSignals = [
    { a: 'alpha', b: 'gamma', signal: 'seed', score: 0.95, why: 'test' },
    { a: 'beta', b: 'gamma', signal: 'seed', score: 0.95, why: 'test' },
    { a: 'alpha', b: 'beta', signal: 'fuzzy', score: 0.6, why: 'test' },
  ];
  const single = buildStone(mixed(withGamma), { extraSignals });
  assert.equal(conceptOf(single, 'alpha').id, conceptOf(single, 'beta').id, 'mixed in, gamma would bridge alpha and beta into one concept');
  const atBar = buildStone(base, { extraSignals });
  const below = buildStone(withGamma, { extraSignals });
  assert.notEqual(conceptOf(below, 'alpha').id, conceptOf(below, 'beta').id);
  assert.equal(conceptOf(below, 'gamma').id, conceptOf(below, 'alpha').id, 'gamma joins the first concept it reaches');
  sameAtBar(atBar, below, 'alpha/beta');
});

test('a below-bar tag on a spelling a human wrote does not move the choice between human spellings', () => {
  const meta = Object.fromEntries(['d1', 'd2', 'd3', 'd4', 'd5', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6'].map((k) => [k, { title: k, text: `climate note ${k}` }]));
  const human = [
    ...rec('Desk', { d1: ['Climate Change'], d2: ['Climate Change'], d3: ['Climate Change'], d4: ['Climate Crisis'], d5: ['Climate Crisis'] }, meta),
    ...rec('Wire', { w1: [], w2: [], w3: [], w4: [], w5: [], w6: [] }, meta),
  ];
  const below = [...human, ...rated('Wire', ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'], 'climate crisis', 1.3)];
  const overrides = { same: [['Climate Change', 'Climate Crisis']] };
  assert.equal(conceptOf(buildStone(mixed(below), { overrides }), 'climate change').canonical, 'Climate Crisis', 'mixed in, the discovered occurrences would win it (in the spelling the human wrote, since a human wrote that term)');
  const atBar = buildStone(human, { overrides });
  const s = buildStone(below, { overrides });
  assert.equal(conceptOf(s, 'climate change').canonical, 'Climate Change');
  sameAtBar(atBar, s, 'climate');
});

test('emergence and the universe hand a viewer set at the bar exactly what a build at the bar has', () => {
  const atBarStone = buildStone(volcanoAtBar, {});
  const belowStone = buildStone(volcanoBelow, {});
  const earnedAtBar = emerge(atBarStone, volcanoAtBar);
  const earnedBelow = emerge(belowStone, volcanoBelow);
  assert.ok(earnedAtBar.length > 0 && earnedAtBar.every((t) => t.sourceRatio === 3), 'a tag earned through a discovered spelling carries its ratio');
  assert.deepEqual(earnedBelow.filter(shownAt(BAR)), earnedAtBar);
  const u16 = buildUniverse(atBarStone, [...volcanoAtBar, ...earnedAtBar]);
  const u10 = buildUniverse(belowStone, [...volcanoBelow, ...earnedBelow]);
  assert.deepEqual(tagsAt(u10, BAR), tagsAt(u16, BAR), 'every tag a viewer shows at the bar is the bar\'s tag, origin, why and weight included');
  const w7 = u10.items.find((it) => it.key === 'Wire::w7').tags;
  assert.ok(w7.every((t) => t.sourceRatio === 3), 'an item only emergence reached shows with the concept');
  const human = buildUniverse(buildStone(rec('Desk', { d1: ['Geology'] }), {}), [...rec('Desk', { d1: ['Geology'] }), ...rated('Desk', ['d1'], 'Geology', 2)]);
  assert.ok(!('sourceRatio' in human.items[0].tags[0]), 'a tag a human wrote always shows, whatever discovery also said');
});

test('a below-bar hub on a word a human also wrote earns nothing a viewer at the bar would see', () => {
  // A human wrote "power" on one post about attention. Under the bar, discovery finds "power" on four
  // wire items about the grid; a fifth says "powered" and reads like them. At the bar the post is all
  // "power" is about, so emergence earns it nowhere; the below-bar hub's items must not change that.
  const grid = (i) => `grid outage ${i}: the utility restored power to the substation after the storm knocked out transformers`;
  const wire = { w1: grid(1), w2: grid(2), w3: grid(3), w4: grid(4), w5: 'crews powered the substation again after transformers failed in the outage; the utility thanked the grid crews' };
  const atBar = [
    ...rec('Posts', { p1: ['power'] }, { p1: { title: 'The power of attention', text: 'attention shapes what a writer notices and keeps' } }),
    ...rec('Wire', Object.fromEntries(Object.keys(wire).map((k) => [k, []])), Object.fromEntries(Object.entries(wire).map(([k, text]) => [k, { title: `Grid report ${k}`, text }]))),
    ...rec('Filler', Object.fromEntries(Object.keys(quietMeta).map((k) => [k, []])), quietMeta),
  ];
  const below = [...atBar, ...rated('Wire', ['w1', 'w2', 'w3', 'w4'], 'power', 1.141)];
  const s16 = buildStone(atBar, {});
  const s10 = buildStone(below, {});
  const e16 = emerge(s16, atBar);
  const e10 = emerge(s10, below);
  assert.deepEqual(e10.filter(shownAt(BAR)), e16, 'a viewer at the bar shows the bar\'s emergent tags, byte for byte, and nothing else');
  const extra = e10.filter((t) => t.sourceRatio < BAR);
  assert.deepEqual(extra.map((t) => t.item), ['w5'], 'what the below-bar hub makes possible: the item that reads like its items');
  for (const t of extra) {
    assert.equal(t.concept, 'c_power');
    assert.equal(t.sourceRatio, 1.141, 'the ratio of the below-bar evidence that made it possible, though a human wrote the word');
    assert.equal(t.wasGeneratedBy.parameters.sourceCoherenceRatio, BAR);
    assert.match(t.why, /; only with discovered tags under the 1\.6× bar \(1\.141\)$/);
  }
  assert.ok(!e10.some((t) => ['w1', 'w2', 'w3', 'w4'].includes(t.item)), 'an item carrying the below-bar tag is not tagged again');
  const u16 = buildUniverse(s16, [...atBar, ...e16]);
  const u10 = buildUniverse(s10, [...below, ...e10]);
  assert.deepEqual(tagsAt(u10, BAR), tagsAt(u16, BAR));
  const cards = (u, bar) => u.items.filter((it) => it.tags.some((t) => t.c === 'c_power' && shownAt(bar)(t))).map((it) => it.item ?? it.key);
  assert.deepEqual(cards(u10, BAR), ['Posts::p1'], 'at the bar "power" is on the one post');
  assert.deepEqual(cards(u10, 1.1).sort(), ['Posts::p1', 'Wire::w1', 'Wire::w2', 'Wire::w3', 'Wire::w4', 'Wire::w5'], 'at 1.1 the below-bar hub and what it made possible show');
});
