// rtagz.js — how post-pipe uses rosetta-tagz (rtagz for short), the project
// that finds and categorizes tags (docs/POST-PIPE-USES-RTAGZ.md).
//
// Everything here speaks files and JSON only; post-pipe never imports from
// rosetta-tagz/lib/. Pure functions handle records, overrides, HTML reduction,
// the canonical URL fold, the container guard, and write-back onto items.

const fs     = require('fs');
const os     = require('os');
const path   = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

const POSTPIPE_ROOT = path.resolve(__dirname, '../..');

// rosetta-tagz's SKOS serialization, written beside universe.json when its
// skos stage ran, and copied beside feed.json by generate-index.
const SKOS_FILES = ['skos.jsonld', 'skos.ttl'];

const NAMED_ENTITIES = {
  amp:  '&',
  lt:   '<',
  gt:   '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function htmlToText(html) {
  if (!html) return '';
  let s = String(html);
  s = s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ');
  s = s.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ');
  s = s.replace(/<[^>]+>/g, ' ');
  s = s.replace(/&(?:#(\d+)|#x([0-9a-fA-F]+)|([a-zA-Z0-9]+));/g, (match, dec, hex, named) => {
    if (dec !== undefined) {
      const code = parseInt(dec, 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    if (hex !== undefined) {
      const code = parseInt(hex, 16);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    if (named !== undefined) {
      const lower = named.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, lower)) {
        return NAMED_ENTITIES[lower];
      }
    }
    return match;
  });
  return s.replace(/\s+/g, ' ').trim();
}

function itemText(item) {
  if (item.content_text && String(item.content_text).trim()) {
    return String(item.content_text).trim();
  }
  if (item.content_html) {
    const reduced = htmlToText(item.content_html);
    if (reduced) return reduced;
  }
  if (item.summary && String(item.summary).trim()) {
    return String(item.summary).trim();
  }
  return String(item.title ?? '');
}

function canonicalUrl(url) {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, '')}${u.pathname.replace(/\/+$/, '')}`.toLowerCase();
  } catch (_) {
    return '';
  }
}

function foldTitle(raw) {
  let s = String(raw ?? '').normalize('NFKC').trim().replace(/^#+/, '');
  s = s.replace(/\b(?:\p{L}\.){2,}/gu, (m) => m.replace(/\./g, ''));
  s = s.replace(/c\+\+/gi, ' cpp ').replace(/c#/gi, ' csharp ').replace(/f#/gi, ' fsharp ').replace(/&/g, ' and ');
  s = s.normalize('NFD').replace(/\p{M}+/gu, '');
  s = s.replace(/([a-z])([A-Z])/g, '$1 $2');
  return s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}

function cacheDirForSite(siteRoot, cacheBase = './.feed-cache') {
  const abs = path.resolve(siteRoot || POSTPIPE_ROOT);
  const base = path.basename(abs);
  const hash = crypto.createHash('sha1').update(abs).digest('hex').slice(0, 8);
  return path.join(cacheBase, 'rtagz', `${base}-${hash}`);
}

function mergeOverrides(siteOverrides = {}, containment = []) {
  const merged = { ...(siteOverrides || {}) };
  const pins = { ...(siteOverrides && siteOverrides.pin ? siteOverrides.pin : {}) };
  for (const c of containment || []) {
    if (c && typeof c.tag === 'string' && c.tag) {
      pins[c.tag] = c.tag;
    }
  }
  if (Object.keys(pins).length > 0 || (siteOverrides && siteOverrides.pin)) {
    merged.pin = pins;
  }
  return merged;
}

// A path from a site's settings, made absolute: as given when absolute, a
// leading ~ as the home folder, anything else against the site root.
function sitePath(p, siteRoot) {
  const s = String(p);
  if (path.isAbsolute(s)) return s;
  if (s === '~' || s.startsWith('~/')) return path.join(os.homedir(), s.slice(1));
  return path.resolve(siteRoot, s);
}

// The names post-pipe gives rosetta-tagz's files in a site folder when the
// site's rtagz settings name none: the ids file (rtz-stone's ledger) and the
// site's own overrides. Before 2026-10-31 they were stone.ledger.json and
// stone.overrides.json; a site that still holds only the old file has it
// read, with one logged line, so its concept ids and decisions carry over
// until the file is renamed.
const IDS_FILE = 'rtagz-ids.json';
const OVERRIDES_FILE = 'rtagz-overrides.json';
const FORMER_NAMES = {
  [IDS_FILE]: 'stone.ledger.json',
  [OVERRIDES_FILE]: 'stone.overrides.json',
};

// A file a site holds under one of the default names above, made absolute
// against the site root: the current name, or the former one when only that
// exists in the site.
function defaultSiteFile(name, siteRoot) {
  const current = path.resolve(siteRoot, name);
  const former = FORMER_NAMES[name] ? path.resolve(siteRoot, FORMER_NAMES[name]) : null;
  if (former && !fs.existsSync(current) && fs.existsSync(former)) {
    console.warn(`rtagz: read ${FORMER_NAMES[name]}, whose name is now ${name}; rename the file in the site`);
    return former;
  }
  return current;
}

// A site's rtagz settings (settings.rtagz). A site whose settings still name
// the block stone, its name before 2026-10-31, is read the same, with one
// logged line, so it builds until the key is renamed.
function rtagzSettings(settings) {
  if (!settings || typeof settings !== 'object') return undefined;
  if (settings.rtagz !== undefined) return settings.rtagz;
  if (settings.stone !== undefined) {
    console.warn('rtagz: the settings key "stone" is now "rtagz"; read as rtagz, rename it in settings.json');
    return settings.stone;
  }
  return undefined;
}

// The build config for rtz-build. conceptSchemes (settings.rtagz.conceptSchemes,
// each { id, path }) are the published vocabularies the site vendors, their
// paths made absolute against the site root; left out when there are none.
// ledger (settings.rtagz.ledger, default rtagz-ids.json in the site) is the
// ids file where rtz-stone keeps its concept ids between builds, so the ids
// stay stable in the site, not in post-pipe's disposable cache. Written only
// when a site root is known: no user's site lives in post-pipe's own folder,
// so a caller without one leaves the ledger to rosetta-tagz's own default.
function buildConfig({ emerge = true, discover = false, conceptSchemes, ledger, siteRoot } = {}) {
  const root = path.resolve(siteRoot || POSTPIPE_ROOT);
  const config = {
    out: '.',
    sources: [{ adapter: 'jsonl', path: 'records.jsonl' }],
    overrides: 'overrides.json',
    emerge: Boolean(emerge),
    discover: Boolean(discover),
  };
  const schemes = [];
  const list = Array.isArray(conceptSchemes) ? conceptSchemes : [];
  for (let i = 0; i < list.length; i += 1) {
    const s = list[i];
    const missing = [];
    if (!s || typeof s !== 'object') missing.push('id', 'path');
    else {
      if (typeof s.id !== 'string' || !s.id) missing.push('id');
      if (typeof s.path !== 'string' || !s.path) missing.push('path');
    }
    if (missing.length) {
      console.warn(`rtagz: conceptSchemes[${i}] skipped, no ${missing.join(' or ')}`);
      continue;
    }
    schemes.push({ id: s.id, path: sitePath(s.path, root) });
  }
  if (schemes.length) config.conceptSchemes = schemes;
  if (siteRoot) {
    config.ledger = typeof ledger === 'string' && ledger ? sitePath(ledger, root) : defaultSiteFile(IDS_FILE, root);
  }
  return config;
}

function buildRecords(results, overrides = {}) {
  const ignoreSet = new Set(
    (overrides.ignore || []).map((t) => String(t ?? '').trim().toLowerCase()).filter(Boolean)
  );
  const records = [];
  const systems = {};
  const resultSystems = new Map();
  const usedNames = new Set();
  let skippedDuplicateIds = 0;

  for (const r of results) {
    if (!r || !r.ok) continue;
    const feedId = (r.feedMeta && r.feedMeta.id) || (r.config && r.config.id) || '';
    const baseTitle = (r.feedMeta && r.feedMeta.title) || (r.config && r.config.title) || feedId;
    let sysName = baseTitle;
    if (usedNames.has(sysName)) {
      sysName = `${baseTitle} (${feedId})`;
    }
    usedNames.add(sysName);
    resultSystems.set(r, sysName);

    const seenIds = new Set();
    let itemCount = 0;
    let taggedCount = 0;

    for (const item of r.items || []) {
      const id = String(item.id ?? '');
      if (seenIds.has(id)) {
        skippedDuplicateIds += 1;
        continue;
      }
      seenIds.add(id);
      itemCount += 1;

      records.push({
        type: 'item',
        source: sysName,
        id,
        title: String(item.title ?? ''),
        text: itemText(item),
        url: String(item.url ?? ''),
        date: String(item.date_published ?? ''),
        kind: String(item.kind || ''),
        color: String(r.color ?? ''),
      });

      let itemTagged = false;
      for (const rawTag of item.tags || []) {
        const label = String(rawTag ?? '');
        const folded = label.trim().toLowerCase();
        if (!folded || ignoreSet.has(folded)) continue;
        itemTagged = true;
        records.push({
          type: 'tag',
          source: sysName,
          item: id,
          label,
          weight: 1,
          origin: 'explicit',
        });
      }
      if (itemTagged) taggedCount += 1;
    }

    systems[sysName] = {
      sourceId: feedId,
      items: itemCount,
      tagged: taggedCount,
    };
  }

  return { records, systems, resultSystems, skippedDuplicateIds };
}

function checkContainerGuard(results, universe, containment = []) {
  const containerTags = [];
  for (const c of containment || []) {
    if (c && typeof c.tag === 'string' && c.tag) containerTags.push(c.tag);
  }
  if (containerTags.length === 0) return { ok: true };

  const usedOnItems = new Set();
  for (const r of results) {
    if (!r || !r.ok) continue;
    for (const item of r.items || []) {
      for (const t of item.tags || []) {
        if (containerTags.includes(t)) usedOnItems.add(t);
      }
    }
  }
  if (usedOnItems.size === 0) return { ok: true };

  const canonicals = new Set((universe.concepts || []).map((c) => c.canonical));
  for (const tag of containerTags) {
    if (usedOnItems.has(tag) && !canonicals.has(tag)) {
      return { ok: false, tag };
    }
  }
  return { ok: true };
}

// The five SKOS mapping properties. A relation of one of these types is a
// mapping whatever it points at: an external vocabulary's concept, or one of
// rosetta-tagz's own in another scheme (a closeMatch or broadMatch across two
// tag-systems). Neither is reinterpreted: a's mapping to b is written as
// rosetta-tagz wrote it.
const MAPPING_TYPES = new Set(['exactMatch', 'closeMatch', 'broadMatch', 'narrowMatch', 'relatedMatch']);
// The relation types with a direction: in each, a is the broader concept.
const DIRECTED_TYPES = new Set(['broader', 'broadMatch']);

// The SKOS side of the universe, read once: which relations are SKOS
// (skos: true; rosetta-tagz's near and adjacent are not and are ignored), which
// of those are mappings (one of MAPPING_TYPES, or b an external id: one in
// universe.external, or no concept at all and spelled <scheme>:<id>), each
// concept's broader concepts (broader {a, b} means a is broader than b), and
// each concept's mappings, each once. A concept that carries its own, non-empty
// mappings[] or broader[] wins over what the relations say; an empty list is
// no answer and the relations are read.
function indexSkos(universe, conceptById) {
  const external = universe.external && typeof universe.external === 'object' && !Array.isArray(universe.external)
    ? universe.external
    : null;
  const isExternalId = (id) => typeof id === 'string' && id !== '' && (
    (external && Object.prototype.hasOwnProperty.call(external, id))
    || (!conceptById.has(id) && id.includes(':'))
  );

  const relationCounts = {};
  const mappingCounts = {};
  const mappingsByConcept = new Map();
  const broaderByConcept = new Map();
  // Every SKOS relation between two of rosetta-tagz's own concepts, typed,
  // with its weight, why and PROV as rosetta-tagz wrote them, each pair once: a
  // directed type (broader, broadMatch: a is the broader concept) once per
  // (type, a, b), a symmetric one (related and the other mappings) once per
  // unordered pair, the first entry kept. The pair list the relation edges
  // are drawn from (corpus/relationEdges.js). A relation to an external id is
  // a mapping on its concept and not in it.
  const relationList = [];
  const relationSeen = new Set();

  for (const r of universe.relations || []) {
    if (!r || r.skos !== true || typeof r.type !== 'string' || !r.type) continue;
    if (typeof r.a !== 'string' || typeof r.b !== 'string') continue;
    if (conceptById.has(r.a) && conceptById.has(r.b)) {
      const ordered = DIRECTED_TYPES.has(r.type) || r.a < r.b;
      const key = ordered ? `${r.type}\u0000${r.a}\u0000${r.b}` : `${r.type}\u0000${r.b}\u0000${r.a}`;
      if (!relationSeen.has(key)) {
        relationSeen.add(key);
        const entry = { a: r.a, b: r.b, type: r.type };
        if (typeof r.weight === 'number' && Number.isFinite(r.weight)) entry.weight = r.weight;
        if (typeof r.why === 'string' && r.why) entry.why = r.why;
        if (r.wasDerivedFrom !== undefined && r.wasDerivedFrom !== null) entry.wasDerivedFrom = r.wasDerivedFrom;
        if (r.wasGeneratedBy !== undefined && r.wasGeneratedBy !== null) entry.wasGeneratedBy = r.wasGeneratedBy;
        relationList.push(entry);
      }
    }
    if (MAPPING_TYPES.has(r.type) || isExternalId(r.b)) {
      if (!mappingsByConcept.has(r.a)) mappingsByConcept.set(r.a, []);
      const list = mappingsByConcept.get(r.a);
      if (list.some((m) => m.type === r.type && m.target === r.b)) continue;
      mappingCounts[r.type] = (mappingCounts[r.type] || 0) + 1;
      const m = { type: r.type, target: r.b };
      if (typeof r.weight === 'number' && Number.isFinite(r.weight)) m.weight = r.weight;
      if (typeof r.why === 'string' && r.why) m.why = r.why;
      list.push(m);
    } else {
      relationCounts[r.type] = (relationCounts[r.type] || 0) + 1;
      if (r.type === 'broader') {
        if (!broaderByConcept.has(r.b)) broaderByConcept.set(r.b, []);
        if (!broaderByConcept.get(r.b).includes(r.a)) broaderByConcept.get(r.b).push(r.a);
      }
    }
  }

  const mappingsOf = (concept) => {
    if (Array.isArray(concept.mappings) && concept.mappings.length) {
      const out = [];
      for (const m of concept.mappings) {
        if (!m || typeof m.type !== 'string' || typeof m.target !== 'string') continue;
        if (out.some((x) => x.type === m.type && x.target === m.target)) continue;
        const copy = { type: m.type, target: m.target };
        if (typeof m.weight === 'number' && Number.isFinite(m.weight)) copy.weight = m.weight;
        if (typeof m.why === 'string' && m.why) copy.why = m.why;
        out.push(copy);
      }
      return out;
    }
    return (mappingsByConcept.get(concept.id) || []).map((m) => ({ ...m }));
  };

  const broaderOf = (concept) => {
    if (Array.isArray(concept.broader) && concept.broader.length) {
      return concept.broader.filter((b) => typeof b === 'string' && b);
    }
    return [...(broaderByConcept.get(concept.id) || [])];
  };

  // The scheme an external id belongs to, and its label in it.
  const schemeOfExternal = (id) => {
    const ext = external ? external[id] : null;
    if (ext && typeof ext.scheme === 'string' && ext.scheme) return ext.scheme;
    if (ext && typeof ext.inScheme === 'string' && ext.inScheme) return ext.inScheme;
    if (ext && Array.isArray(ext.inScheme) && typeof ext.inScheme[0] === 'string') return ext.inScheme[0];
    const colon = id.indexOf(':');
    return colon > 0 ? id.slice(0, colon) : '';
  };
  const labelOfExternal = (id, scheme) => {
    const ext = external ? external[id] : null;
    if (!ext) return '';
    if (typeof ext.prefLabel === 'string') return ext.prefLabel;
    if (ext.prefLabel && typeof ext.prefLabel === 'object') {
      if (typeof ext.prefLabel[scheme] === 'string') return ext.prefLabel[scheme];
      const first = Object.values(ext.prefLabel).find((v) => typeof v === 'string' && v);
      return first || '';
    }
    return '';
  };

  // A concept's prefLabel per scheme as a reference carries it: rosetta-tagz's
  // own, plus an external scheme's label only through an exactMatch mapping.
  const prefLabelCache = new Map();
  const referencePrefLabel = (concept) => {
    if (prefLabelCache.has(concept.id)) return prefLabelCache.get(concept.id);
    const out = {};
    if (concept.prefLabel && typeof concept.prefLabel === 'object') {
      for (const [scheme, label] of Object.entries(concept.prefLabel)) {
        if (scheme && typeof label === 'string' && label) out[scheme] = label;
      }
    }
    for (const m of mappingsOf(concept)) {
      if (m.type !== 'exactMatch' || !external || !external[m.target]) continue;
      const scheme = schemeOfExternal(m.target);
      const label = labelOfExternal(m.target, scheme);
      if (scheme && label && out[scheme] === undefined) out[scheme] = label;
    }
    const result = Object.keys(out).length ? out : null;
    prefLabelCache.set(concept.id, result);
    return result;
  };

  return { external, relationCounts, mappingCounts, relationList, mappingsOf, broaderOf, referencePrefLabel };
}

// What the feed carries of a scheme record: the plan's shape and nothing
// else, so a vocabulary's header (its file path, when it was fetched) stays
// out of the published feed.
const SCHEME_KEYS = ['id', 'label', 'kind', 'sourceId', 'iri', 'license', 'concepts'];

// The concept schemes a feed carries: rosetta-tagz's own list when the universe
// has one, then whatever it leaves out that post-pipe knows anyway: the site
// scheme (labelled with the site's title), one scheme per tag-system with its
// source id, and the discovered scheme when any concept is filed in it or
// flagged discovered. A scheme rosetta-tagz lists bare gets the kind and label
// post-pipe knows for it. No label is invented: a scheme without one is
// labelled with its id (the site's with the site's title) until rosetta-tagz,
// or Harold, names it.
function buildSchemes(universe, systems, siteTitle) {
  const out = [];
  const seen = new Set();
  const push = (s) => {
    if (!s || typeof s.id !== 'string' || !s.id || seen.has(s.id)) return;
    seen.add(s.id);
    out.push(s);
  };
  const knownKind = (id) => {
    if (id === 'site') return 'site';
    if (id === 'discovered') return 'discovered';
    if (systems && Object.prototype.hasOwnProperty.call(systems, id)) return 'system';
    return undefined;
  };

  for (const s of Array.isArray(universe.schemes) ? universe.schemes : []) {
    if (!s || typeof s !== 'object' || typeof s.id !== 'string' || !s.id) continue;
    const copy = {};
    for (const k of SCHEME_KEYS) {
      if (s[k] !== undefined && s[k] !== null) copy[k] = s[k];
    }
    if (copy.id === 'site' && siteTitle && (!copy.label || copy.label === copy.id)) copy.label = siteTitle;
    if (typeof copy.label !== 'string' || !copy.label) copy.label = copy.id;
    if (typeof copy.kind !== 'string' || !copy.kind) {
      const kind = knownKind(copy.id);
      if (kind) copy.kind = kind;
    }
    if (systems && systems[copy.id] && copy.sourceId === undefined && systems[copy.id].sourceId !== undefined) {
      copy.sourceId = systems[copy.id].sourceId;
    }
    push(copy);
  }

  push({ id: 'site', label: siteTitle || 'site', kind: 'site' });
  for (const [name, info] of Object.entries(systems || {})) {
    push({ id: name, label: name, kind: 'system', sourceId: info ? info.sourceId : undefined });
  }
  const anyDiscovered = (universe.concepts || []).some(
    (c) => c && ((Array.isArray(c.inScheme) && c.inScheme.includes('discovered')) || c.discovered === true)
  );
  if (anyDiscovered) push({ id: 'discovered', label: 'discovered', kind: 'discovered' });
  return out;
}

// A sourceRatio as rosetta-tagz writes it (a number, three decimals), or
// undefined for anything else, so a field is only ever written where the
// universe has one.
function ratioOf(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function applyUniverse(results, resultSystems, systems, skippedDuplicateIds, universe, buildManifest, options = {}) {
  const conceptById = new Map();
  for (const c of universe.concepts || []) {
    conceptById.set(c.id, c);
  }
  const skos = indexSkos(universe, conceptById);
  // Which post-pipe items joined each universe item, for reading rosetta-tagz's
  // untagged list back onto post-pipe ids (a folded representative stands for
  // every item folded into it).
  const joinedByKey = new Map();

  const byKey = new Map();
  const byUrl = new Map();
  const byTitle = new Map();

  for (const uItem of universe.items || []) {
    if (uItem.key) byKey.set(uItem.key, uItem);
    const cu = canonicalUrl(uItem.url);
    if (cu && !byUrl.has(cu)) byUrl.set(cu, uItem);
    if (!cu) {
      const ft = foldTitle(uItem.title);
      if (ft.length >= 24 && !byTitle.has(ft)) byTitle.set(ft, uItem);
    }
  }

  let unjoined = 0;

  for (const r of results) {
    if (!r || !r.ok) continue;
    const sysName = resultSystems.get(r);
    if (!sysName) continue;
    const seenIds = new Set();

    for (const item of r.items || []) {
      const id = String(item.id ?? '');
      if (seenIds.has(id)) continue;
      seenIds.add(id);

      const key = `${sysName}::${id}`;
      let uItem = byKey.get(key);
      if (!uItem) {
        const cu = canonicalUrl(item.url);
        if (cu) uItem = byUrl.get(cu);
        if (!uItem && !cu) {
          const ft = foldTitle(item.title);
          if (ft.length >= 24) uItem = byTitle.get(ft);
        }
      }

      if (!uItem) {
        unjoined += 1;
        continue;
      }
      if (uItem.key) {
        if (!joinedByKey.has(uItem.key)) joinedByKey.set(uItem.key, []);
        joinedByKey.get(uItem.key).push({ id, source: sysName });
      }

      const originalTags = Array.isArray(item.tags) ? item.tags : [];
      const explicitEntries = [];
      const earnedEntries = [];

      for (const t of uItem.tags || []) {
        const concept = conceptById.get(t.c);
        if (!concept) continue;
        const canonical = concept.canonical;
        const origin = t.origin || 'explicit';
        const weight = t.w !== undefined ? t.w : 1;
        const rawList = Array.isArray(t.raw) ? t.raw : [];
        const sysList = Array.isArray(t.sys) ? [...t.sys] : [];
        const forms = {};
        for (const rawEntry of rawList) {
          if (!rawEntry || !rawEntry.s || rawEntry.l === undefined) continue;
          if (!forms[rawEntry.s]) forms[rawEntry.s] = [];
          if (!forms[rawEntry.s].includes(rawEntry.l)) {
            forms[rawEntry.s].push(rawEntry.l);
          }
        }

        const entry = {
          canonical,
          concept: t.c,
          origin,
          weight,
          systems: sysList,
          forms,
          via: t.via || 'known',
          why: origin === 'explicit' ? null : (t.why !== undefined ? t.why : null),
          rawLabels: rawList.map((x) => x.l),
          // SKOS and PROV, only when the universe carries them.
          prefLabel: skos.referencePrefLabel(concept),
          wasDerivedFrom: t.wasDerivedFrom !== undefined && t.wasDerivedFrom !== null ? t.wasDerivedFrom : undefined,
          wasGeneratedBy: t.wasGeneratedBy !== undefined && t.wasGeneratedBy !== null ? t.wasGeneratedBy : undefined,
          // The source coherence ratio a viewer must be set at or below to
          // show this tag (rosetta-tagz's "Trying another bar"), only when
          // the universe gives one: a tag a human wrote never has it.
          sourceRatio: ratioOf(t.sourceRatio),
        };

        if (origin === 'explicit') {
          let firstPos = Infinity;
          for (const rl of entry.rawLabels) {
            const idx = originalTags.indexOf(rl);
            if (idx !== -1 && idx < firstPos) firstPos = idx;
          }
          entry.firstPos = firstPos;
          explicitEntries.push(entry);
        } else {
          earnedEntries.push(entry);
        }
      }

      explicitEntries.sort((a, b) => a.firstPos - b.firstPos || (a.canonical < b.canonical ? -1 : a.canonical > b.canonical ? 1 : 0));
      earnedEntries.sort((a, b) => b.weight - a.weight || (a.canonical < b.canonical ? -1 : a.canonical > b.canonical ? 1 : 0));

      const ordered = [...explicitEntries, ...earnedEntries];
      const newTags = [];
      const newTagRefs = [];
      const seenCanonical = new Set();

      for (const e of ordered) {
        if (seenCanonical.has(e.canonical)) continue;
        seenCanonical.add(e.canonical);
        newTags.push(e.canonical);
        const ref = {
          type: 'tag',
          value: e.canonical,
          concept: e.concept,
          origin: e.origin,
          weight: e.weight,
          systems: e.systems,
          forms: e.forms,
          via: e.via,
          why: e.why,
        };
        if (e.prefLabel) ref.prefLabel = { ...e.prefLabel };
        if (e.wasDerivedFrom !== undefined) ref.wasDerivedFrom = e.wasDerivedFrom;
        if (e.wasGeneratedBy !== undefined) ref.wasGeneratedBy = e.wasGeneratedBy;
        if (e.sourceRatio !== undefined) ref.sourceRatio = e.sourceRatio;
        newTagRefs.push(ref);
      }

      const nonTagRefs = Array.isArray(item._references)
        ? item._references.filter((ref) => ref && ref.type !== 'tag')
        : [];

      item.tags = newTags;
      item._references = [...nonTagRefs, ...newTagRefs];
    }
  }

  const summaryConcepts = [];
  for (const c of universe.concepts || []) {
    const itemCount = (c.n || 0) + (c.nEmergent || 0) || c.items || 0;
    if (itemCount <= 0) continue;

    const forms = {};
    for (const v of c.variants || []) {
      const fbs = v.formsBySource || {};
      for (const [src, formMap] of Object.entries(fbs)) {
        if (!forms[src]) forms[src] = {};
        for (const [label, count] of Object.entries(formMap)) {
          forms[src][label] = (forms[src][label] || 0) + count;
        }
      }
    }

    const rank = (c.rank || []).map((r) => ({
      label: r.label,
      score: r.score,
      parts: {
        freq: r.parts?.freq ?? 0,
        cover: r.parts?.cover ?? 0,
        trust: r.parts?.trust ?? 0,
        quality: r.parts?.quality ?? 0,
      },
    }));

    const sc = {
      canonical: c.canonical,
      pinned: Boolean(c.pinned),
      discovered: Boolean(c.discovered),
      items: itemCount,
      forms,
      rank,
    };
    if (typeof c.id === 'string' && c.id) sc.id = c.id;
    // The concept's source coherence ratio (the highest of its variants',
    // when every variant has one), only where rosetta-tagz gave it.
    const conceptRatio = ratioOf(c.sourceRatio);
    if (conceptRatio !== undefined) sc.sourceRatio = conceptRatio;
    // SKOS, as rosetta-tagz wrote it, only where it did.
    if (Array.isArray(c.inScheme) && c.inScheme.length) {
      sc.inScheme = c.inScheme.filter((s) => typeof s === 'string' && s);
    }
    if (c.prefLabel && typeof c.prefLabel === 'object') {
      const pref = {};
      for (const [scheme, label] of Object.entries(c.prefLabel)) {
        if (scheme && typeof label === 'string' && label) pref[scheme] = label;
      }
      if (Object.keys(pref).length) sc.prefLabel = pref;
    }
    if (c.altLabel && typeof c.altLabel === 'object') {
      const alt = {};
      for (const [scheme, labels] of Object.entries(c.altLabel)) {
        if (!scheme || !Array.isArray(labels)) continue;
        const list = labels.filter((l) => typeof l === 'string' && l);
        if (list.length) alt[scheme] = list;
      }
      if (Object.keys(alt).length) sc.altLabel = alt;
    }
    const broader = skos.broaderOf(c);
    if (broader.length) sc.broader = broader;
    const mappings = skos.mappingsOf(c);
    if (mappings.length) sc.mappings = mappings;
    // The ledger's word on this concept's id: when it was first seen, what
    // happened to it this build, and the label it had before a relabel.
    if (c.ledger && typeof c.ledger === 'object' && !Array.isArray(c.ledger)) {
      const ledger = {};
      for (const k of ['since', 'event', 'previousLabel']) {
        if (typeof c.ledger[k] === 'string' && c.ledger[k]) ledger[k] = c.ledger[k];
      }
      if (Object.keys(ledger).length) sc.ledger = ledger;
    }
    summaryConcepts.push(sc);
  }

  const summary = {
    built: (buildManifest && buildManifest.built) || universe.generated || null,
    systems,
    concepts: summaryConcepts,
    unjoined,
    skippedDuplicateIds,
    schemes: buildSchemes(universe, systems, options.siteTitle),
  };

  if (Object.keys(skos.relationCounts).length) summary.relations = skos.relationCounts;
  // Each SKOS relation between two of rosetta-tagz's own concepts, with its why
  // and PROV, for the relation edges (corpus/relationEdges.js); none, nothing.
  if (skos.relationList.length) summary.relationList = skos.relationList;
  if (Object.keys(skos.mappingCounts).length) summary.mappings = skos.mappingCounts;

  // rosetta-tagz's untagged items (from the universe, else build.json, which
  // rtz-build writes too), on post-pipe's ids: a universe key joined by one or
  // more post-pipe items names each of them; one joined by none keeps the id
  // and source rosetta-tagz gave. An empty list writes nothing.
  const untaggedList = Array.isArray(universe.untagged)
    ? universe.untagged
    : (buildManifest && Array.isArray(buildManifest.untagged) ? buildManifest.untagged : null);
  if (untaggedList && untaggedList.length) {
    const items = [];
    for (const u of untaggedList) {
      if (!u || typeof u !== 'object') continue;
      const key = typeof u.key === 'string'
        ? u.key
        : (u.source !== undefined && u.id !== undefined ? `${u.source}::${u.id}` : '');
      const why = Array.isArray(u.why)
        ? u.why.filter((w) => typeof w === 'string' && w)
        : (typeof u.why === 'string' && u.why ? [u.why] : []);
      const joined = joinedByKey.get(key);
      if (joined && joined.length) {
        for (const j of joined) items.push({ id: j.id, source: j.source, why: [...why] });
      } else {
        const sep = key.indexOf('::');
        const id = u.id !== undefined && u.id !== null ? String(u.id) : (sep >= 0 ? key.slice(sep + 2) : key);
        const source = typeof u.source === 'string' ? u.source : (sep >= 0 ? key.slice(0, sep) : '');
        items.push({ id, source, why });
      }
    }
    if (items.length) summary.untagged = { count: items.length, items };
  }

  if (skos.external && Object.keys(skos.external).length) summary.external = JSON.parse(JSON.stringify(skos.external));

  if (buildManifest && buildManifest.ledger && typeof buildManifest.ledger === 'object') {
    const ledger = {};
    for (const k of ['minted', 'reused', 'retired']) {
      const v = buildManifest.ledger[k];
      if (typeof v === 'number' && Number.isFinite(v)) ledger[k] = v;
    }
    if (Object.keys(ledger).length) summary.ledger = ledger;
  }

  return { summary };
}

function runRtzBuild(engineBin, configPath, cwd, timeoutMs) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (res) => {
      if (settled) return;
      settled = true;
      resolve(res);
    };

    let child;
    try {
      child = spawn(process.execPath, [engineBin, '--config', configPath, '--no-view'], {
        cwd,
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (err) {
      finish({ ok: false, reason: `spawn error: ${err.message}` });
      return;
    }

    let stderr = '';
    if (child.stderr) {
      child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    }

    const timer = setTimeout(() => {
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch (_) {
        try { child.kill('SIGKILL'); } catch (__) {}
      }
      finish({ ok: false, timedOut: true, reason: `timed out after ${timeoutMs}ms` });
    }, timeoutMs);

    child.on('error', (err) => {
      clearTimeout(timer);
      finish({ ok: false, reason: err.message });
    });

    child.on('close', (code, signal) => {
      clearTimeout(timer);
      if (code !== 0) {
        const lastErr = stderr.trim().split('\n').pop() || `exit ${code ?? signal}`;
        finish({ ok: false, code, reason: `exit ${code ?? signal} (${lastErr})` });
        return;
      }
      finish({ ok: true });
    });
  });
}

async function runRtagzPhase(results, options = {}) {
  const rtagzCfg = options.rtagz;
  if (!rtagzCfg || !rtagzCfg.enabled) {
    return { ran: false, rtagz: null };
  }

  try {
    const siteRoot = options.siteRoot ? path.resolve(options.siteRoot) : POSTPIPE_ROOT;
    const postpipeRoot = options.postpipeRoot ? path.resolve(options.postpipeRoot) : POSTPIPE_ROOT;
    const engineSetting = rtagzCfg.engine || 'rosetta-tagz';
    const engineDir = path.isAbsolute(engineSetting)
      ? engineSetting
      : path.resolve(postpipeRoot, engineSetting);
    const engineBin = path.join(engineDir, 'bin', 'rtz-build');

    if (!fs.existsSync(engineBin)) {
      console.warn(`rtagz: engine not found at ${engineBin}, tags left as written`);
      return { ran: false, rtagz: null };
    }

    const overridesPath = rtagzCfg.overrides
      ? (path.isAbsolute(rtagzCfg.overrides) ? rtagzCfg.overrides : path.resolve(siteRoot, rtagzCfg.overrides))
      : defaultSiteFile(OVERRIDES_FILE, siteRoot);
    let siteOverrides = {};
    if (fs.existsSync(overridesPath)) {
      siteOverrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
    }

    const mergedOverrides = mergeOverrides(siteOverrides, options.containment || []);
    const { records, systems, resultSystems, skippedDuplicateIds } = buildRecords(results, mergedOverrides);

    const cacheDir = options.cacheDir
      ? path.resolve(options.cacheDir)
      : path.resolve(cacheDirForSite(siteRoot));
    fs.mkdirSync(cacheDir, { recursive: true });
    // rtz-build writes its SKOS files only when that stage runs and succeeds,
    // and never clears its out folder, so last build's are removed first: a
    // file left in the cache after the build is this build's.
    for (const name of SKOS_FILES) {
      const stale = path.join(cacheDir, name);
      if (fs.existsSync(stale)) fs.unlinkSync(stale);
    }

    const recordsPath = path.join(cacheDir, 'records.jsonl');
    const overridesOutPath = path.join(cacheDir, 'overrides.json');
    const configPath = path.join(cacheDir, 'rtz.config.json');

    const recordsText = records.map((r) => JSON.stringify(r)).join('\n') + (records.length ? '\n' : '');
    fs.writeFileSync(recordsPath, recordsText, 'utf8');
    fs.writeFileSync(overridesOutPath, JSON.stringify(mergedOverrides, null, 2) + '\n', 'utf8');

    const rtzConfig = buildConfig({
      emerge: rtagzCfg.emerge !== false,
      discover: Boolean(rtagzCfg.discover),
      conceptSchemes: rtagzCfg.conceptSchemes,
      ledger: rtagzCfg.ledger,
      siteRoot: options.siteRoot ? siteRoot : undefined,
    });
    fs.writeFileSync(configPath, JSON.stringify(rtzConfig, null, 2) + '\n', 'utf8');

    const timeoutMs = Number.isFinite(Number(rtagzCfg.timeoutMs)) && Number(rtagzCfg.timeoutMs) > 0
      ? Number(rtagzCfg.timeoutMs)
      : 120000;

    const runRes = await runRtzBuild(engineBin, configPath, cacheDir, timeoutMs);
    if (!runRes.ok) {
      console.warn(`rtagz: build failed (${runRes.reason}), tags left as written`);
      return { ran: false, rtagz: null };
    }

    const universePath = path.join(cacheDir, 'universe.json');
    const buildPath = path.join(cacheDir, 'build.json');
    const universe = JSON.parse(fs.readFileSync(universePath, 'utf8'));
    const buildManifest = JSON.parse(fs.readFileSync(buildPath, 'utf8'));

    const guard = checkContainerGuard(results, universe, options.containment || []);
    if (!guard.ok) {
      console.warn(`rtagz: container tag "${guard.tag}" is not canonical after build, tags left as written`);
      return { ran: false, rtagz: null };
    }

    // The site scheme is labelled with the site's title, which the caller
    // passes (generate-index reads settings.json once); absent, the scheme
    // is labelled with its id.
    const siteTitle = typeof options.siteTitle === 'string' ? options.siteTitle : '';

    const { summary } = applyUniverse(results, resultSystems, systems, skippedDuplicateIds, universe, buildManifest, { siteTitle });
    // cacheDir is where rtz-build wrote its files, for whoever copies the
    // SKOS serialization beside the feed.
    return { ran: true, rtagz: summary, cacheDir };
  } catch (err) {
    console.warn(`rtagz: ${err.message}, tags left as written`);
    return { ran: false, rtagz: null };
  }
}

module.exports = {
  SKOS_FILES,
  IDS_FILE,
  OVERRIDES_FILE,
  rtagzSettings,
  htmlToText,
  itemText,
  canonicalUrl,
  foldTitle,
  cacheDirForSite,
  mergeOverrides,
  buildConfig,
  buildRecords,
  checkContainerGuard,
  applyUniverse,
  runRtzBuild,
  runRtagzPhase,
};
