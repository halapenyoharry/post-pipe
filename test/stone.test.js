import test from 'node:test';
import assert from 'node:assert/strict';
import { syntheticStone, syntheticRecords, shippedSeed, conceptOf, rec, earned } from './helpers.js';
import { buildStone, indexStone, resolveLabel } from '../lib/stone.js';
import { buildUniverse } from '../lib/universe.js';
import { DISCOVERED_SCHEME, SITE_SCHEME, schemeOfSource } from '../lib/corpus.js';
import { scoreVariants, rankingPool } from '../lib/canon.js';

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
  const pairs = s.relations.filter((r) => r.type === 'near').map((r) => r.evidence.terms.slice().sort().join(' ~ '));
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
  // the viewer re-scores live with the same pool, so it can never star a spelling the stone did not
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
  // an emergent label is a canonical of the stone that earned it, so unmapped it sits in `site` alone
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

test('universe: a discovered label the stone never absorbed is filed under discovered, not under the item\'s system', () => {
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
