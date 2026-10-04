import test from 'node:test';
import assert from 'node:assert/strict';
import { syntheticStone, syntheticRecords, shippedSeed, conceptOf, rec } from './helpers.js';
import { buildStone, indexStone, resolveLabel } from '../lib/stone.js';

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
  assert.equal(conceptOf(stone, 'ai').canonical, 'AI'); // acronym shown as capitals, not "ai" or "A.I."
  assert.equal(conceptOf(stone, 'systems thinking').canonical, 'Systems Thinking'); // not the slug "systems-thinking"
  assert.equal(conceptOf(stone, 'machine learning').canonical, 'Machine Learning');
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
  const near = relations('near').map((p) => p.slice().sort().join(' ~ '));
  assert.ok(near.includes('Labor ~ labour'));
  assert.ok(near.includes('Criminal Justice ~ carceral state'));
});

test('adjacent never duplicates a pair that is already near or co-tagged', () => {
  const near = new Set(stone.relations.filter((r) => r.type === 'near').map((r) => [r.a, r.b].sort().join()));
  for (const r of stone.relations.filter((x) => x.type === 'adjacent')) assert.ok(!near.has([r.a, r.b].sort().join()));
});

test('systems report coverage honestly', () => {
  assert.equal(stone.systems.Science.items, 12);
  assert.equal(stone.systems.Science.tagged, 0);
  assert.equal(stone.systems.Science.untagged, 12);
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
