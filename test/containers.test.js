// containers.js: a container keeps its pieces by concept once the build has
// resolved its tag to a concept id, and by the tag string otherwise. The three
// container tests (buildEdges, graphColors, readerNav) run the string path
// untouched; this file runs the concept path through the same four places.
const test = require('node:test');
const assert = require('node:assert');
const { containerHas, containerOfTag, conceptOfTag } = require('../src/lib/containers');
const { buildEdges } = require('../src/corpus/buildEdges');
const { relationEdges } = require('../src/corpus/relationEdges');
const { colorKeysInUse } = require('../src/lib/graphColors');
const { navStatus } = require('../src/lib/readerNav');
const { resolveContainerConcepts } = require('../src/lib/rtagz');

const ref = (value, concept) => ({ type: 'tag', value, concept, origin: 'explicit', weight: 1 });
// a piece whose container tag shows another label (a scheme or a canonical
// that moved), its reference still naming the container's concept
const moved = { id: 'p1', url: 'https://x.test/p1.html', tags: ['Act One', 'storm'], _references: [ref('Act One', 'c_act_1'), ref('storm', 'c_storm')] };
const plain = { id: 'p2', url: 'https://x.test/p2.html', tags: ['act-1'] };
const outside = { id: 'p3', url: 'https://x.test/p3.html', tags: ['storm'], _references: [ref('storm', 'c_storm')] };
const epic = { id: 'epic', label: 'Epic' };
const act = { id: 'act-1', tag: 'act-1', parent: 'epic', label: 'Act 1', status: 'soon' };
const actByConcept = { ...act, concept: 'c_act_1' };

test('membership by concept when the container has one, by the tag string otherwise', () => {
  assert.strictEqual(containerHas(actByConcept, moved), true, 'the reference names the concept');
  assert.strictEqual(containerHas(act, moved), false, 'without a concept only the string counts');
  assert.strictEqual(containerHas(actByConcept, plain), true, 'a piece with no references keeps the string path');
  assert.strictEqual(containerHas(actByConcept, outside), false);
  assert.strictEqual(containerHas(null, plain), false);
  assert.strictEqual(conceptOfTag(moved, 'Act One'), 'c_act_1');
  assert.strictEqual(conceptOfTag(plain, 'act-1'), null);
  const byTag = new Map([['act-1', act]]);
  const byConcept = new Map([['c_act_1', actByConcept]]);
  assert.strictEqual(containerOfTag(moved, 'Act One', byTag, byConcept), actByConcept);
  assert.strictEqual(containerOfTag(plain, 'act-1', byTag, byConcept), act);
  assert.strictEqual(containerOfTag(moved, 'storm', byTag, byConcept), undefined);
  assert.strictEqual(containerOfTag(moved, 'Act One', byTag, new Map()), undefined);
});

test('buildEdges: a tag whose reference names the container\'s concept is containment, not a tag edge', () => {
  const edges = buildEdges([moved, plain, outside], { containment: [epic, actByConcept] });
  const contains = edges.filter((e) => e.layer === 'containment' && e.role === 'contains' && e.source === 'act-1').map((e) => e.target).sort();
  assert.deepStrictEqual(contains, ['p1', 'p2']);
  assert.ok(!edges.some((e) => e.target === 'tag:Act One'), 'no tag node for the container\'s concept');
  assert.ok(edges.some((e) => e.source === 'p1' && e.target === 'tag:storm'));
  // the same container without a concept: the string path, as before
  const byString = buildEdges([moved, plain, outside], { containment: [epic, act] });
  assert.deepStrictEqual(byString.filter((e) => e.layer === 'containment' && e.source === 'act-1').map((e) => e.target), ['p2']);
  assert.ok(byString.some((e) => e.target === 'tag:Act One'));
});

test('graphColors and readerNav read membership the same way', () => {
  const feed = { items: [moved], edges: [], containers: [epic, actByConcept] };
  assert.ok(!colorKeysInUse(feed).has('draft'), 'a piece inside a container takes its colour, not draft');
  assert.ok(colorKeysInUse({ ...feed, containers: [epic, act] }).has('draft'));
  const titleOnly = { ...moved, _posted: 'title' };
  assert.strictEqual(navStatus({ items: [titleOnly], containers: [epic, actByConcept] }, titleOnly), 'soon');
  assert.strictEqual(navStatus({ items: [titleOnly], containers: [epic, act] }, titleOnly), 'not yet published');
});

test('relationEdges: the container\'s concept gets no relation edge, whatever its label', () => {
  const rtagz = { relationList: [{ a: 'c_act_1', b: 'c_storm', type: 'related', weight: 0.5 }] };
  assert.deepStrictEqual(relationEdges(rtagz, [moved, outside], { containment: [epic, actByConcept] }), []);
  assert.strictEqual(relationEdges(rtagz, [moved, outside], { containment: [epic, act] }).length, 1, 'by string alone, "Act One" is not the container');
});

test('at corpus time each container tag resolves to the concept that holds it: its canonical, else a variant spelled so', () => {
  const universe = {
    concepts: [
      { id: 'c_act_1', canonical: 'act-1', variants: [{ label: 'act-1', forms: { 'act-1': 3, 'Act 1': 1 } }] },
      { id: 'c_prologue', canonical: 'Prologue', variants: [{ label: 'Prologue', forms: { Prologue: 1, prologue: 2 } }] },
    ],
  };
  assert.deepStrictEqual(resolveContainerConcepts(universe, [epic, act, { id: 'pro', tag: 'prologue' }, { id: 'gone', tag: 'act-9' }]), {
    'act-1': 'c_act_1',
    prologue: 'c_prologue',
  }, 'a tag no concept holds is left out and keeps the string path');
  assert.deepStrictEqual(resolveContainerConcepts({}, [act]), {});
  assert.deepStrictEqual(resolveContainerConcepts(universe, undefined), {});
});
