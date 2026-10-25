// What a tag node is called when the reader chooses a concept scheme and a
// depth (docs/STONE-SEAM.md). Pure: it reads feed._stone and answers; the
// graph applies the answers to its bubbles.
//
// A scheme is one of the lists in _stone.schemes: the site's own ('site',
// whose prefLabel is today's canonical), one per tag-system (its id is the
// system's name), 'discovered' (the stone's phrase scheme), or an external
// vocabulary the site vendors (kind 'external'; its concepts are reached
// through a concept's mappings and live in _stone.external).
//
// Depth is how many steps up skos:broader the label is read from: 0 is the
// concept itself, 1 its broader concept in the chosen scheme, 2 that one's.
// The walk stops at a concept with no broader in the scheme. Two tags that
// reach the same concept belong to one group (groupsFor), which the graph
// collapses into one bubble.
//
// No label is invented here: every label returned is a prefLabel the stone
// wrote, a vocabulary's own label, or the canonical the feed already shows.

const SITE_SCHEME = 'site';
const DISCOVERED_SCHEME = 'discovered';

// The layouts a position may be filed under (GraphViewer's placeOf names).
const LAYOUTS = ['force', 'radial', 'timeline'];

const TAG_PREFIX = 'tag:';
const CONCEPT_PREFIX = 'concept:';

// _stone, from a feed or from the summary itself.
function stoneOf(source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return null;
  if (source._stone && typeof source._stone === 'object' && !Array.isArray(source._stone)) return source._stone;
  if (Array.isArray(source.concepts) || Array.isArray(source.schemes)) return source;
  return null;
}

// The concept schemes a feed carries: _stone.schemes as the build wrote it,
// each with an id; nothing without a stone.
function schemesOf(feed) {
  const stone = stoneOf(feed);
  if (!stone || !Array.isArray(stone.schemes)) return [];
  return stone.schemes.filter((s) => s && typeof s === 'object' && typeof s.id === 'string' && s.id);
}

// One index per stone object, so a graph of hundreds of tags asks for its
// labels without rebuilding the maps each time.
const indexes = new WeakMap();

function indexOf(stone) {
  if (indexes.has(stone)) return indexes.get(stone);
  const byId = new Map();
  for (const c of Array.isArray(stone.concepts) ? stone.concepts : []) {
    if (!c || typeof c !== 'object') continue;
    if (typeof c.id === 'string' && c.id && !byId.has(c.id)) byId.set(c.id, c);
  }
  const schemes = new Map();
  const sourceToScheme = new Map();
  for (const s of schemesOf(stone)) {
    schemes.set(s.id, s);
    if (typeof s.sourceId === 'string' && s.sourceId && !sourceToScheme.has(s.sourceId)) sourceToScheme.set(s.sourceId, s.id);
  }
  const systems = stone.systems && typeof stone.systems === 'object' && !Array.isArray(stone.systems) ? stone.systems : {};
  for (const [name, info] of Object.entries(systems)) {
    if (info && typeof info.sourceId === 'string' && info.sourceId && !sourceToScheme.has(info.sourceId)) sourceToScheme.set(info.sourceId, name);
  }
  const external = stone.external && typeof stone.external === 'object' && !Array.isArray(stone.external) ? stone.external : {};
  const idx = { byId, schemes, systems, sourceToScheme, external };
  indexes.set(stone, idx);
  return idx;
}

// The scheme an external concept id belongs to: what its entry says, else
// the part before the colon.
function externalSchemeOf(idx, id) {
  const ext = idx.external[id];
  if (ext && typeof ext.scheme === 'string' && ext.scheme) return ext.scheme;
  if (ext && typeof ext.inScheme === 'string' && ext.inScheme) return ext.inScheme;
  if (ext && Array.isArray(ext.inScheme) && typeof ext.inScheme[0] === 'string') return ext.inScheme[0];
  const colon = typeof id === 'string' ? id.indexOf(':') : -1;
  return colon > 0 ? id.slice(0, colon) : '';
}

function isExternalScheme(idx, scheme) {
  if (scheme === SITE_SCHEME || scheme === DISCOVERED_SCHEME) return false;
  const s = idx.schemes.get(scheme);
  if (s && typeof s.kind === 'string') return s.kind === 'external';
  if (s || Object.prototype.hasOwnProperty.call(idx.systems, scheme)) return false;
  // Not listed: external when some external id is filed under it.
  return Object.keys(idx.external).some((id) => externalSchemeOf(idx, id) === scheme);
}

function externalLabelOf(idx, id, scheme) {
  const ext = idx.external[id];
  if (!ext) return '';
  if (typeof ext.prefLabel === 'string') return ext.prefLabel;
  if (ext.prefLabel && typeof ext.prefLabel === 'object') {
    if (typeof ext.prefLabel[scheme] === 'string') return ext.prefLabel[scheme];
    const first = Object.values(ext.prefLabel).find((v) => typeof v === 'string' && v);
    return first || '';
  }
  return '';
}

// One step up the vocabulary: the first broader concept the feed carries.
function externalBroaderOf(idx, id) {
  const ext = idx.external[id];
  if (!ext || !Array.isArray(ext.broader)) return null;
  for (const b of ext.broader) {
    if (typeof b === 'string' && b && idx.external[b]) return b;
  }
  return null;
}

// The concept's target in an external scheme: its exactMatch there, else
// its broadMatch.
function mappedTarget(idx, concept, scheme) {
  const mappings = Array.isArray(concept.mappings) ? concept.mappings : [];
  for (const type of ['exactMatch', 'broadMatch']) {
    for (const m of mappings) {
      if (!m || m.type !== type || typeof m.target !== 'string' || !m.target) continue;
      if (externalSchemeOf(idx, m.target) === scheme) return m.target;
    }
  }
  return null;
}

// Whether a concept is filed in a scheme. Every concept is in the site's;
// a concept the stone wrote without inScheme is read by the forms it holds.
function inScheme(concept, scheme) {
  if (scheme === SITE_SCHEME) return true;
  if (Array.isArray(concept.inScheme)) return concept.inScheme.includes(scheme);
  if (scheme === DISCOVERED_SCHEME) return concept.discovered === true;
  return Boolean(concept.forms && typeof concept.forms === 'object' && concept.forms[scheme]);
}

// The concept's prefLabel in a scheme, or '' when it has none there. The
// site's prefLabel is the canonical the feed shows.
function prefLabelIn(concept, scheme) {
  const pref = concept.prefLabel && typeof concept.prefLabel === 'object' ? concept.prefLabel[scheme] : undefined;
  if (typeof pref === 'string' && pref) return pref;
  if (scheme === SITE_SCHEME && typeof concept.canonical === 'string' && concept.canonical) return concept.canonical;
  return '';
}

// One step up skos:broader within a scheme: the first broader concept that
// the feed carries and that is in the scheme, in the stone's order.
function broaderIn(idx, concept, scheme) {
  const list = Array.isArray(concept.broader) ? concept.broader : [];
  for (const b of list) {
    const up = typeof b === 'string' ? idx.byId.get(b) : null;
    if (up && inScheme(up, scheme)) return up;
  }
  return null;
}

// The scheme most of a tag's pieces come from: systems lists one source id
// per piece; each is read as a scheme id through the schemes' sourceId (or
// is one already). Ties go to the first in id order.
function majoritySystem(idx, systems) {
  const counts = new Map();
  for (const s of Array.isArray(systems) ? systems : []) {
    if (typeof s !== 'string' || !s) continue;
    const scheme = idx.sourceToScheme.get(s) || s;
    counts.set(scheme, (counts.get(scheme) || 0) + 1);
  }
  let best = null;
  for (const [scheme, n] of counts) {
    if (!best || n > best.n || (n === best.n && scheme < best.scheme)) best = { scheme, n };
  }
  return best ? best.scheme : null;
}

// What a tag shows when the reached concept has no label in the chosen
// scheme: the site's, the majority system's, the discovered scheme's, in that
// order, each a fallback; the canonical last of all.
function fallbackFor(idx, concept, chosen, systems, groupId) {
  const order = [SITE_SCHEME];
  const major = majoritySystem(idx, systems);
  if (major && major !== chosen) order.push(major);
  order.push(DISCOVERED_SCHEME);
  for (const scheme of order) {
    if (scheme === chosen) continue;
    const label = prefLabelIn(concept, scheme);
    if (label) return { label, scheme, fallback: true, groupId };
  }
  const canonical = typeof concept.canonical === 'string' && concept.canonical ? concept.canonical : null;
  return { label: canonical, scheme: canonical ? SITE_SCHEME : null, fallback: true, groupId };
}

function depthOf(depth) {
  const n = Number(depth);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.floor(n);
}

// The label a tag node shows for a concept in a scheme at a depth:
//   { label, scheme, fallback, groupId }
// label      what to write on the bubble (null when the concept is not in the
//            stone: the caller keeps what it has)
// scheme     the scheme the label is in
// fallback   true when the label is not in the chosen scheme
// groupId    the concept the walk reached: the concept's own id at depth 0,
//            a broader concept's id (or an external id) further up; tags
//            sharing one are one group
// systems    one source id per piece the tag joins, for the majority fallback
function labelFor(stone, conceptId, { scheme, depth, systems } = {}) {
  const chosen = typeof scheme === 'string' && scheme ? scheme : SITE_SCHEME;
  const steps = depthOf(depth);
  const st = stoneOf(stone);
  if (!st || typeof conceptId !== 'string' || !conceptId) {
    return { label: null, scheme: null, fallback: false, groupId: conceptId || null };
  }
  const idx = indexOf(st);
  const concept = idx.byId.get(conceptId);
  if (!concept) return { label: null, scheme: null, fallback: false, groupId: conceptId };

  if (isExternalScheme(idx, chosen)) {
    const target = mappedTarget(idx, concept, chosen);
    if (target) {
      let cur = target;
      for (let i = 0; i < steps; i++) {
        const up = externalBroaderOf(idx, cur);
        if (!up) break;
        cur = up;
      }
      const label = externalLabelOf(idx, cur, chosen);
      if (label) return { label, scheme: chosen, fallback: false, groupId: cur };
    }
    return fallbackFor(idx, concept, chosen, systems, conceptId);
  }

  let cur = concept;
  for (let i = 0; i < steps; i++) {
    const up = broaderIn(idx, cur, chosen);
    if (!up) break;
    cur = up;
  }
  const own = prefLabelIn(cur, chosen);
  if (own) return { label: own, scheme: chosen, fallback: false, groupId: cur.id };
  return fallbackFor(idx, cur, chosen, systems, cur.id);
}

// Which group each concept falls in at a scheme and depth: Map conceptId ->
// groupId (labelFor's). A concept the stone does not know is its own group.
function groupsFor(stone, conceptIds, { scheme, depth } = {}) {
  const out = new Map();
  for (const id of Array.isArray(conceptIds) ? conceptIds : []) {
    if (typeof id !== 'string' || !id || out.has(id)) continue;
    const r = labelFor(stone, id, { scheme, depth });
    out.set(id, r.groupId || id);
  }
  return out;
}

// Where a tag node's saved positions move when positions key on concept ids:
// [[oldKey, newKey], ...], for every tag node that names its concept, under
// each layout's prefix (placeOf(layout), as the graph files them) and bare,
// from its label today and from the label it had before (d.previousLabel,
// the ledger's). Nodes without a concept (no stone) have no pairs.
function migrationPairs(nodes, placeOf) {
  const pairs = [];
  const seen = new Set();
  const prefixes = [''];
  if (typeof placeOf === 'function') {
    for (const layout of LAYOUTS) {
      const p = placeOf(layout);
      if (typeof p === 'string' && !prefixes.includes(p)) prefixes.push(p);
    }
  }
  for (const d of Array.isArray(nodes) ? nodes : []) {
    if (!d || d.type !== 'tag' || typeof d.concept !== 'string' || !d.concept) continue;
    const labels = [];
    for (const l of [d.label, d.previousLabel]) {
      if (typeof l === 'string' && l && !labels.includes(l)) labels.push(l);
    }
    for (const label of labels) {
      for (const prefix of prefixes) {
        const from = prefix + TAG_PREFIX + label;
        const to = prefix + CONCEPT_PREFIX + d.concept;
        const key = from + '\u0000' + to;
        if (seen.has(key)) continue;
        seen.add(key);
        pairs.push([from, to]);
      }
    }
  }
  return pairs;
}

module.exports = {
  SITE_SCHEME,
  DISCOVERED_SCHEME,
  LAYOUTS,
  schemesOf,
  labelFor,
  groupsFor,
  migrationPairs,
};
