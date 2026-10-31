import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { buildSkos, checkBase, DEFAULT_BASE, RTZ_NS } from '../lib/skos.js';
import { syntheticUniverse, tmpDir, ROOT, SYN } from './helpers.js';

const { universe } = syntheticUniverse();
const out = buildSkos(universe);
const ttl = out.turtle;
const jsonld = JSON.parse(out.jsonld);
const node = (id) => jsonld['@graph'].find((n) => n['@id'] === id);
const C = (id, scheme) => `${DEFAULT_BASE}concept/${id}${scheme ? `/${encodeURIComponent(scheme)}` : ''}`;
const ids = (list) => (list ?? []).map((x) => x['@id']).sort();

test('every scheme a concept is filed in is a skos:ConceptScheme, and every concept a skos:Concept in site', () => {
  const schemes = jsonld['@graph'].filter((n) => (n['@type'] ?? []).includes('skos:ConceptScheme')).map((n) => n['@id']).sort();
  assert.deepEqual(schemes, ['Archive', 'Journal', 'ScienceDaily', 'Wire', 'discovered', 'site'].filter((s) => universe.concepts.some((c) => (c.inScheme ?? []).includes(s)) || s === 'site').map((s) => `${DEFAULT_BASE}scheme/${s}`).sort());
  for (const c of universe.concepts) {
    const n = node(C(c.id));
    assert.ok(n, c.id);
    assert.deepEqual(n['@type'], ['skos:Concept']);
    assert.deepEqual(ids(n['skos:inScheme']), [`${DEFAULT_BASE}scheme/site`]);
    assert.equal(n['skos:prefLabel'].length, 1, `${c.id}: one prefLabel`);
    assert.deepEqual(n['skos:prefLabel'][0], { '@value': c.prefLabel?.site ?? c.canonical, '@language': 'en' });
    assert.deepEqual(n['skos:notation'], [{ '@value': c.id }]);
  }
});

test('a concept merged from several schemes has a form in each, one prefLabel there, linked by exactMatch every pair', () => {
  const ai = universe.concepts.find((c) => c.id === 'c_ai');
  const own = ai.inScheme.filter((s) => s !== 'site');
  assert.ok(own.length >= 2, 'the synthetic AI is written in several schemes');
  const forms = [C('c_ai'), ...own.map((s) => C('c_ai', s))];
  for (const s of own) {
    const f = node(C('c_ai', s));
    assert.deepEqual(ids(f['skos:inScheme']), [`${DEFAULT_BASE}scheme/${encodeURIComponent(s)}`]);
    assert.deepEqual(f['skos:prefLabel'], [{ '@value': ai.prefLabel[s], '@language': 'en' }]);
    assert.deepEqual(ids(f['rtz:formOf']), [C('c_ai')]);
    for (const alt of f['skos:altLabel'] ?? []) assert.notEqual(alt['@value'], ai.prefLabel[s], 'altLabel never repeats the prefLabel');
  }
  let pairs = 0;
  for (let i = 0; i < forms.length; i++) for (let j = i + 1; j < forms.length; j++) {
    assert.ok(ids(node(forms[i])['skos:exactMatch']).includes(forms[j]), `${forms[i]} exactMatch ${forms[j]}`);
    pairs += 1;
  }
  assert.equal(pairs, (forms.length * (forms.length - 1)) / 2);
});

test('broader runs from the narrower concept to the broader, as rosetta-tagz writes {a, b} with a the broader', () => {
  const r = universe.relations.find((x) => x.type === 'broader' && x.skos);
  assert.ok(r);
  assert.ok(ids(node(C(r.b))['skos:broader']).includes(C(r.a)));
  assert.ok(!ids(node(C(r.a))['skos:broader'] ?? []).includes(C(r.b)));
});

test('every relation and every tag triple is reified with its why and the PROV pair', () => {
  const statements = jsonld['@graph'].filter((n) => (n['@type'] ?? []).includes('rdf:Statement'));
  const rel = universe.relations.find((x) => x.type === 'related' && x.skos && x.wasGeneratedBy);
  const st = statements.find((s) => s['rdf:subject'][0]['@id'] === C(rel.a) && s['rdf:predicate'][0]['@id'] === 'skos:related' && s['rdf:object'][0]['@id'] === C(rel.b));
  assert.ok(st, 'the related triple is reified');
  assert.equal(st['rtz:why'][0]['@value'], rel.why);
  const act = node(st['prov:wasGeneratedBy'][0]['@id']);
  assert.deepEqual(act['@type'], ['prov:Activity']);
  assert.equal(act['rtz:activity'][0]['@value'], 'relate');
  const ev = node(st['prov:wasDerivedFrom'][0]['@id']);
  assert.deepEqual(ev['@type'], ['prov:Entity']);
  assert.equal(ev['rtz:evidenceType'][0]['@value'], rel.wasDerivedFrom[0].type);
  const tagged = universe.items.flatMap((it) => it.tags.map((t) => [it, t]));
  const subjects = statements.filter((s) => s['rdf:predicate'][0]['@id'] === 'dcterms:subject');
  assert.equal(subjects.length, tagged.length, 'one statement per tag on an item');
  const [it, t] = tagged.find(([, x]) => x.origin === 'explicit');
  const s = subjects.find((x) => x['rdf:subject'][0]['@id'] === `${DEFAULT_BASE}item/${encodeURIComponent(it.key)}` && x['rdf:object'][0]['@id'] === C(t.c));
  assert.equal(node(s['prov:wasGeneratedBy'][0]['@id'])['rtz:activity'][0]['@value'], 'ingest');
  assert.equal(node(s['prov:wasDerivedFrom'][0]['@id'])['rtz:evidenceType'][0]['@value'], 'category');
});

test('a name SKOS lacks is in rosetta-tagz\'s own namespace', () => {
  assert.ok(ttl.includes(`@prefix rtz: <${RTZ_NS}> .`));
  assert.match(ttl, /rtz:schemeKind "discovered"|rtz:schemeKind "site"/);
  const adjacent = universe.relations.find((r) => r.type === 'adjacent');
  if (adjacent) assert.ok(ids(node(C(adjacent.a))['rtz:adjacent']).includes(C(adjacent.b)));
});

test('the base and the language are switches; a base Turtle cannot write is refused', () => {
  const other = buildSkos(universe, { base: 'https://example.test/vocab/', lang: 'en-GB' });
  assert.ok(other.turtle.includes('<https://example.test/vocab/concept/c_ai>'));
  assert.ok(other.turtle.includes('"AI"@en-GB') || other.turtle.includes('@en-GB'));
  const plain = buildSkos(universe, { lang: null });
  assert.ok(!/"@en\b/.test(plain.turtle.replace(/@prefix.*\n/g, '')) && !plain.turtle.includes('"@en'));
  assert.equal(other.triples, out.triples);
  assert.throws(() => checkBase('not an iri'), /not an absolute IRI/);
  assert.throws(() => buildSkos(universe, { base: 'urn:x y' }), /not an absolute IRI/);
  assert.throws(() => buildSkos(universe, { lang: 'english please' }), /not a language tag/);
});

test('the serialization is deterministic and both syntaxes carry the same number of triples', () => {
  const again = buildSkos(universe);
  assert.equal(again.turtle, out.turtle);
  assert.equal(again.jsonld, out.jsonld);
  let n = 0;
  for (const nd of jsonld['@graph']) for (const [k, v] of Object.entries(nd)) if (k !== '@id') n += v.length;
  assert.equal(n, out.triples);
});

const python = spawnSync('python3', ['-c', 'import rdflib'], { encoding: 'utf8' });
const haveRdflib = !python.error && python.status === 0;
const CHECK = path.join(ROOT, 'tools', 'skos-check.py');
const writeSkos = (u) => {
  const dir = tmpDir();
  const s = buildSkos(u);
  fs.writeFileSync(path.join(dir, 'skos.ttl'), s.turtle);
  fs.writeFileSync(path.join(dir, 'skos.jsonld'), s.jsonld);
  return dir;
};

test('rdflib parses both files, finds the same graph, and the SKOS integrity checks pass on a clean vocabulary', { skip: haveRdflib ? false : 'python3 with rdflib not found' }, () => {
  // the synthetic universe without its one seed-and-usage conflict (next test)
  const clean = { ...universe, relations: universe.relations.filter((r) => !(r.type === 'related' && [r.a, r.b].sort().join() === 'c_ai,c_machine_learning')) };
  const r = spawnSync('python3', [CHECK, writeSkos(clean)], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /ok {3}the two files are the same graph/);
  assert.match(r.stdout, /skos\.ttl {5}(\d+) triples\nskos\.jsonld {2}\1 triples/);
});

test('the check fails, naming the condition, when related is mixed with broader (the synthetic corpus has one such pair)', { skip: haveRdflib ? false : 'python3 with rdflib not found' }, () => {
  assert.ok(universe.relations.some((r) => r.type === 'related' && r.a === 'c_ai' && r.b === 'c_machine_learning'));
  assert.ok(universe.relations.some((r) => r.type === 'broader' && r.a === 'c_ai' && r.b === 'c_machine_learning'));
  const r = spawnSync('python3', [CHECK, writeSkos(universe)], { encoding: 'utf8' });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /FAIL S27 related and closeMatch not mixed with broader: 1/);
  // and a hand-broken file: two prefLabels in one language on one concept
  const dir = writeSkos(universe);
  fs.appendFileSync(path.join(dir, 'skos.ttl'), `<${C('c_ai')}> <http://www.w3.org/2004/02/skos/core#prefLabel> "A.I."@en .\n`);
  const r2 = spawnSync('python3', [CHECK, dir], { encoding: 'utf8' });
  assert.equal(r2.status, 1);
  assert.match(r2.stdout, /FAIL the two files are the same graph/);
  assert.match(r2.stdout, /FAIL S14 at most one prefLabel per language per concept: 1/);
});

test('rtz-build writes skos.jsonld and skos.ttl beside universe.json; a skos failure is one line and never fails the build', () => {
  const dir = tmpDir();
  const cfg = path.join(dir, 'rtz.config.json');
  const base = { sources: [{ adapter: 'jsonfeed', path: `${SYN}wire.feed.json` }, { adapter: 'pairs', path: `${SYN}archive.tsv`, source: 'Archive' }], ledger: false };
  fs.writeFileSync(cfg, JSON.stringify({ ...base, out: 'a', skos: { base: 'https://example.test/v/', lang: 'en' } }));
  const r = spawnSync(process.execPath, [path.join(ROOT, 'bin/rtz-build'), '--config', cfg, '--no-view'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  for (const f of ['skos.jsonld', 'skos.ttl']) assert.ok(fs.existsSync(path.join(dir, 'a', f)), f);
  assert.ok(fs.readFileSync(path.join(dir, 'a', 'skos.ttl'), 'utf8').includes('<https://example.test/v/concept/'));
  assert.ok(JSON.parse(fs.readFileSync(path.join(dir, 'a', 'build.json'), 'utf8')).stages.some((s) => s.name === 'skos'));
  fs.writeFileSync(cfg, JSON.stringify({ ...base, out: 'b', skos: { base: 'not an iri' } }));
  const bad = spawnSync(process.execPath, [path.join(ROOT, 'bin/rtz-build'), '--config', cfg, '--no-view'], { encoding: 'utf8' });
  assert.equal(bad.status, 0, 'a skos error never fails the build');
  assert.equal(bad.stderr.split('\n').filter((l) => l.includes('skos files not written')).length, 1);
  assert.ok(fs.existsSync(path.join(dir, 'b', 'universe.json')));
  for (const f of ['skos.jsonld', 'skos.ttl', 'skos.jsonld.tmp', 'skos.ttl.tmp']) assert.ok(!fs.existsSync(path.join(dir, 'b', f)), `${f} not written`);
  fs.writeFileSync(cfg, JSON.stringify({ ...base, out: 'c', skos: false }));
  assert.equal(spawnSync(process.execPath, [path.join(ROOT, 'bin/rtz-build'), '--config', cfg, '--no-view'], { encoding: 'utf8' }).status, 0);
  assert.ok(!fs.existsSync(path.join(dir, 'c', 'skos.ttl')), 'skos: false writes none');
});
