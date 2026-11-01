// The SKOS serialization of a universe: the same triples written twice, as JSON-LD and as Turtle
// (docs/FORMATS.md, "SKOS serialization"). JSON stays the working format; this is for interchange.
//
// The shape, in short:
//   - every scheme a concept is filed in is a skos:ConceptScheme (<base>scheme/<id>);
//   - every concept is a skos:Concept in the `site` scheme (<base>concept/<id>), prefLabel its canonical,
//     altLabel every other spelling, notation its id;
//   - in every other scheme that wrote a spelling of it, the concept has a form of its own
//     (<base>concept/<id>/<scheme>), a skos:Concept in that scheme alone with that scheme's prefLabel and
//     altLabels. The forms of one concept are the spellings merged at or above mergeThreshold, so they
//     are linked by skos:exactMatch, every pair, and each names its concept with rtz:formOf;
//   - broader and related (skos: true) are written between the concepts in `site`; the mapping relations
//     (closeMatch, broadMatch, relatedMatch, exactMatch) between the forms in their own schemes, since
//     they map across schemes (a concept with no scheme but `site` maps from its `site` concept);
//     everything SKOS has no name for (adjacent, near, synergy, opposes, a cross-scheme related without
//     text support) as rtz:<type> between the concepts in `site`, and a forbidden relation as
//     rtz:notRelated;
//   - an item carries each of its tags as dcterms:subject, pointing at the concept in `site`;
//   - PROV: every relation triple and every tag triple is reified (an rdf:Statement naming its subject,
//     predicate and object), and the statement carries prov:wasDerivedFrom (one prov:Entity per piece of
//     evidence, its fields as rtz: properties) and prov:wasGeneratedBy (a prov:Activity of its own with
//     rtz:activity and one rtz: property per parameter), plus rtz:why, rtz:weight, rtz:origin and
//     rtz:sourceRatio where the universe has them.
// Names SKOS and PROV lack are in rosetta-tagz's own namespace (RTZ_NS), all provisional.
//
// Pure: universe in, { turtle, jsonld, triples } out. Deterministic: the same universe gives the same
// bytes.

export const SKOS_NS = 'http://www.w3.org/2004/02/skos/core#';
export const PROV_NS = 'http://www.w3.org/ns/prov#';
export const RDF_NS = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
export const RDFS_NS = 'http://www.w3.org/2000/01/rdf-schema#';
export const XSD_NS = 'http://www.w3.org/2001/XMLSchema#';
export const DCT_NS = 'http://purl.org/dc/terms/';
export const RTZ_NS = 'urn:rosetta-tagz:vocab#'; // provisional
export const DEFAULT_BASE = 'urn:rosetta-tagz:'; // provisional; a site that publishes its vocabulary sets its own
export const DEFAULT_LANG = 'en';

const PREFIXES = { skos: SKOS_NS, prov: PROV_NS, rdf: RDF_NS, rdfs: RDFS_NS, xsd: XSD_NS, dcterms: DCT_NS, rtz: RTZ_NS };
const SITE = 'site';
const MAPPINGS = new Set(['closeMatch', 'broadMatch', 'narrowMatch', 'relatedMatch', 'exactMatch']);
const SEMANTIC = new Set(['broader', 'related']); // within a scheme; narrower is never emitted
// broader and broadMatch {a, b}: b is the narrower one (b skos:broader a)
const FLIPPED = new Set(['broader', 'broadMatch']);

// An IRI is checked once, where a person can give it (the base): none of the characters Turtle's IRIREF
// forbids, and a scheme.
export function checkBase(base) {
  if (typeof base !== 'string' || !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(base) || /[\s<>"{}|^`\\]/.test(base)) {
    throw new Error(`skos base ${JSON.stringify(base)} is not an absolute IRI Turtle can write`);
  }
  return base;
}

const enc = (s) => encodeURIComponent(String(s)).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
const localName = (k) => String(k).replace(/[^A-Za-z0-9_]/g, '_').replace(/^([0-9])/, '_$1') || '_';

// terms: { iri } | { bnode } | { lit, lang? , type? }
const iri = (v) => ({ iri: v });
const P = (prefix, name) => iri(PREFIXES[prefix] + name);
function literal(v, lang) {
  if (typeof v === 'boolean') return { lit: String(v), type: `${XSD_NS}boolean` };
  if (typeof v === 'number' && Number.isFinite(v)) {
    if (Number.isInteger(v)) return { lit: String(v), type: `${XSD_NS}integer` };
    const s = String(v);
    return /e/i.test(s) ? { lit: s, type: `${XSD_NS}double` } : { lit: s, type: `${XSD_NS}decimal` };
  }
  if (v !== null && typeof v === 'object') return { lit: JSON.stringify(v) };
  return lang ? { lit: String(v), lang } : { lit: String(v) };
}

// A language tag as BCP 47 spells it, or null/'' for plain literals.
export function checkLang(lang) {
  if (lang === null || lang === '' || lang === false) return null;
  if (typeof lang !== 'string' || !/^[A-Za-z]{1,8}(-[A-Za-z0-9]{1,8})*$/.test(lang)) throw new Error(`skos lang ${JSON.stringify(lang)} is not a language tag`);
  return lang;
}

export function buildSkos(universe, { base = DEFAULT_BASE, lang = DEFAULT_LANG } = {}) {
  checkBase(base);
  checkLang(lang);
  const tag = typeof lang === 'string' && lang ? lang : null;
  const triples = [];
  let blank = 0;
  const bnode = () => ({ bnode: `b${++blank}` });
  const add = (s, p, o) => triples.push([s, p, o]);
  const label = (v) => literal(v, tag);

  const schemeIri = (id) => iri(`${base}scheme/${enc(id)}`);
  const conceptIri = (id) => iri(`${base}concept/${enc(id)}`);
  const formIri = (id, scheme) => (scheme === SITE ? conceptIri(id) : iri(`${base}concept/${enc(id)}/${enc(scheme)}`));
  const externalIri = (target) => {
    const i = target.indexOf(':');
    return iri(`${base}external/${enc(target.slice(0, i))}/${enc(target.slice(i + 1))}`);
  };
  const itemIri = (key) => iri(`${base}item/${enc(key)}`);

  const concepts = [...(universe.concepts ?? [])].filter((c) => c && typeof c.id === 'string').sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const byId = new Map(concepts.map((c) => [c.id, c]));
  const schemesOf = (c) => {
    const list = Array.isArray(c.inScheme) && c.inScheme.length ? c.inScheme.filter((s) => typeof s === 'string' && s) : [];
    return list.includes(SITE) ? list : [...list, SITE];
  };
  const ownSchemes = (c) => schemesOf(c).filter((s) => s !== SITE);

  // schemes
  const schemeKind = (id) => (id === SITE ? 'site' : id === 'discovered' ? 'discovered' : 'system');
  const schemeIds = new Set([SITE]);
  for (const c of concepts) for (const s of schemesOf(c)) schemeIds.add(s);
  for (const id of [...schemeIds].sort()) {
    const s = schemeIri(id);
    add(s, P('rdf', 'type'), P('skos', 'ConceptScheme'));
    add(s, P('skos', 'prefLabel'), label(id));
    add(s, P('rtz', 'schemeKind'), literal(schemeKind(id)));
  }

  // concepts and their forms
  for (const c of concepts) {
    const site = conceptIri(c.id);
    const canonical = typeof c.prefLabel?.[SITE] === 'string' && c.prefLabel[SITE] ? c.prefLabel[SITE] : c.canonical;
    add(site, P('rdf', 'type'), P('skos', 'Concept'));
    add(site, P('skos', 'inScheme'), schemeIri(SITE));
    add(site, P('skos', 'notation'), literal(c.id));
    if (typeof canonical === 'string' && canonical) add(site, P('skos', 'prefLabel'), label(canonical));
    const alts = (s) => {
      const pref = s === SITE ? canonical : c.prefLabel?.[s];
      return [...new Set((c.altLabel?.[s] ?? []).filter((l) => typeof l === 'string' && l && l !== pref))].sort();
    };
    for (const a of alts(SITE)) add(site, P('skos', 'altLabel'), label(a));
    if (c.discovered === true) add(site, P('rtz', 'discovered'), literal(true));
    if (typeof c.sourceRatio === 'number') add(site, P('rtz', 'sourceRatio'), literal(c.sourceRatio));
    const forms = [site];
    for (const s of ownSchemes(c)) {
      const pref = c.prefLabel?.[s];
      const f = formIri(c.id, s);
      add(f, P('rdf', 'type'), P('skos', 'Concept'));
      add(f, P('skos', 'inScheme'), schemeIri(s));
      add(f, P('rtz', 'formOf'), site);
      if (typeof pref === 'string' && pref) add(f, P('skos', 'prefLabel'), label(pref));
      for (const a of alts(s)) add(f, P('skos', 'altLabel'), label(a));
      forms.push(f);
    }
    for (let i = 0; i < forms.length; i++) for (let j = i + 1; j < forms.length; j++) add(forms[i], P('skos', 'exactMatch'), forms[j]);
  }

  // PROV on a reified triple
  const provenance = (stmt, src) => {
    for (const e of Array.isArray(src.wasDerivedFrom) ? src.wasDerivedFrom : src.wasDerivedFrom ? [src.wasDerivedFrom] : []) {
      if (!e || typeof e !== 'object') continue;
      const ent = bnode();
      add(stmt, P('prov', 'wasDerivedFrom'), ent);
      add(ent, P('rdf', 'type'), P('prov', 'Entity'));
      for (const [k, v] of Object.entries(e)) {
        if (v === undefined || v === null) continue;
        add(ent, iri(RTZ_NS + (k === 'type' ? 'evidenceType' : localName(k))), literal(v));
      }
    }
    const g = src.wasGeneratedBy;
    if (g && typeof g === 'object' && typeof g.activity === 'string' && g.activity) {
      const act = bnode();
      add(stmt, P('prov', 'wasGeneratedBy'), act);
      add(act, P('rdf', 'type'), P('prov', 'Activity'));
      add(act, P('rtz', 'activity'), literal(g.activity));
      for (const [k, v] of Object.entries(g.parameters ?? {})) {
        if (v === undefined || v === null) continue;
        add(act, iri(RTZ_NS + localName(k)), literal(v));
      }
    }
  };
  const statement = (s, p, o, src, extra = {}) => {
    add(s, p, o);
    const st = bnode();
    add(st, P('rdf', 'type'), P('rdf', 'Statement'));
    add(st, P('rdf', 'subject'), s);
    add(st, P('rdf', 'predicate'), p);
    add(st, P('rdf', 'object'), o);
    for (const [k, v] of Object.entries(extra)) if (v !== undefined && v !== null) add(st, iri(RTZ_NS + k), literal(v));
    provenance(st, src);
  };

  // relations
  const relations = [...(universe.relations ?? [])].filter((r) => r && typeof r.a === 'string' && typeof r.b === 'string' && typeof r.type === 'string');
  for (const r of relations) {
    const a = byId.get(r.a);
    const b = byId.get(r.b);
    if (!a) continue;
    const external = !b && r.b.includes(':');
    if (!b && !external) continue;
    const extra = { why: typeof r.why === 'string' && r.why ? r.why : undefined, weight: typeof r.weight === 'number' ? r.weight : undefined };
    if (r.skos === true && MAPPINGS.has(r.type)) {
      // across schemes: between the forms in their own schemes; b first for the flipped types
      const fromA = (ownSchemes(a).length ? ownSchemes(a) : [SITE]).map((s) => formIri(a.id, s));
      const toB = external ? [externalIri(r.b)] : (ownSchemes(b).length ? ownSchemes(b) : [SITE]).map((s) => formIri(b.id, s));
      for (const x of fromA) for (const y of toB) {
        if (FLIPPED.has(r.type) && !external) statement(y, P('skos', r.type), x, r, extra);
        else statement(x, P('skos', r.type), y, r, extra);
      }
      continue;
    }
    if (external) {
      statement(conceptIri(a.id), iri(RTZ_NS + localName(r.type)), externalIri(r.b), r, extra);
      continue;
    }
    if (r.skos === true && SEMANTIC.has(r.type)) {
      if (FLIPPED.has(r.type)) statement(conceptIri(b.id), P('skos', r.type), conceptIri(a.id), r, extra);
      else statement(conceptIri(a.id), P('skos', r.type), conceptIri(b.id), r, extra);
      continue;
    }
    statement(conceptIri(a.id), iri(RTZ_NS + localName(r.type)), conceptIri(b.id), r, extra);
  }
  for (const f of universe.forbidden ?? []) {
    if (!f || !byId.has(f.a) || !byId.has(f.b)) continue;
    statement(conceptIri(f.a), P('rtz', 'notRelated'), conceptIri(f.b), {}, { relationType: f.type, why: f.why });
  }

  // items and their tags
  const items = [...(universe.items ?? [])].filter((it) => it && typeof it.key === 'string').sort((x, y) => (x.key < y.key ? -1 : x.key > y.key ? 1 : 0));
  for (const it of items) {
    const s = itemIri(it.key);
    if (typeof it.title === 'string' && it.title) add(s, P('dcterms', 'title'), literal(it.title));
    if (typeof it.url === 'string' && /^https?:\/\/[^\s<>"{}|^`\\]+$/.test(it.url)) add(s, P('rdfs', 'seeAlso'), iri(it.url));
    for (const t of it.tags ?? []) {
      if (!t || !byId.has(t.c)) continue;
      statement(s, P('dcterms', 'subject'), conceptIri(t.c), t, {
        origin: t.origin,
        weight: typeof t.w === 'number' ? t.w : undefined,
        why: typeof t.why === 'string' && t.why ? t.why : undefined,
        sourceRatio: typeof t.sourceRatio === 'number' ? t.sourceRatio : undefined,
      });
    }
  }

  return { triples: triples.length, turtle: toTurtle(triples), jsonld: toJsonLd(triples) };
}

// ── Turtle ───────────────────────────────────────────────────────────────────────────────────────
function turtleTerm(t) {
  if (t.iri !== undefined) {
    for (const [p, ns] of Object.entries(PREFIXES)) {
      if (t.iri.startsWith(ns) && /^[A-Za-z_][A-Za-z0-9_]*$/.test(t.iri.slice(ns.length))) return `${p}:${t.iri.slice(ns.length)}`;
    }
    return `<${t.iri}>`;
  }
  if (t.bnode !== undefined) return `_:${t.bnode}`;
  const body = `"${t.lit
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/[\u0000-\u001F\u007F]/g, (c) => `\\u${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`)}"`;
  if (t.lang) return `${body}@${t.lang}`;
  if (t.type) return `${body}^^${turtleTerm({ iri: t.type })}`;
  return body;
}

function toTurtle(triples) {
  const out = Object.entries(PREFIXES).map(([p, ns]) => `@prefix ${p}: <${ns}> .`);
  out.push('');
  let last = null;
  let lines = [];
  const flush = () => {
    if (lines.length) out.push(`${lines.join(' ;\n    ')} .`);
    lines = [];
  };
  for (const [s, p, o] of triples) {
    const subj = turtleTerm(s);
    if (subj !== last) {
      flush();
      last = subj;
      lines.push(`${subj} ${turtleTerm(p)} ${turtleTerm(o)}`);
    } else lines.push(`${turtleTerm(p)} ${turtleTerm(o)}`);
  }
  flush();
  return out.join('\n') + '\n';
}

// ── JSON-LD ──────────────────────────────────────────────────────────────────────────────────────
function compact(i) {
  for (const [p, ns] of Object.entries(PREFIXES)) if (i.startsWith(ns) && i.length > ns.length) return `${p}:${i.slice(ns.length)}`;
  return i;
}
function jsonTerm(t) {
  if (t.iri !== undefined) return { '@id': compact(t.iri) };
  if (t.bnode !== undefined) return { '@id': `_:${t.bnode}` };
  if (t.lang) return { '@value': t.lit, '@language': t.lang };
  if (t.type) return { '@value': t.lit, '@type': compact(t.type) };
  return { '@value': t.lit };
}

function toJsonLd(triples) {
  const nodes = new Map();
  const TYPE = `${RDF_NS}type`;
  for (const [s, p, o] of triples) {
    const id = s.iri !== undefined ? compact(s.iri) : `_:${s.bnode}`;
    if (!nodes.has(id)) nodes.set(id, { '@id': id });
    const node = nodes.get(id);
    if (p.iri === TYPE && o.iri !== undefined) (node['@type'] ??= []).push(compact(o.iri));
    else (node[compact(p.iri)] ??= []).push(jsonTerm(o));
  }
  // an IRI written as a compact IRI is expanded by the context; a full IRI that is not under a prefix
  // stays absolute
  // one node per line: readable with grep, a third the size of an indented document
  const graph = [...nodes.values()].map((n) => JSON.stringify(n)).join(',\n');
  return `{"@context": ${JSON.stringify(PREFIXES)},\n"@graph": [\n${graph}\n]}\n`;
}
