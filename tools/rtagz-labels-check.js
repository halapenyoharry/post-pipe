#!/usr/bin/env node
// Checks the rule that does not move (Harold's spec of 2026-10-25): no tag
// label is invented. Every label a built feed carries must appear verbatim
// in a record's label, an item's text, the site's overrides, or an enabled
// vocabulary's published labels. A label with no origin means the build is
// wrong, not this script.
//
//   node tools/rtagz-labels-check.js <site folder> [--feed path] [--cache dir]
//
// --feed defaults to <site>/_site/feed.json. --cache defaults to the folder
// the build handed rosetta-tagz its records in, .feed-cache/rtagz/<site>-<hash>
// under post-pipe (cacheDirForSite in src/lib/rtagz.js), or .feed-cache/stone/
// for a site last built before 2026-10-31.
//
// The labels, each distinct string checked once, wherever it appears: every
// concept's canonical, prefLabel and altLabel in every scheme, forms per
// system and rank labels (feed._rtagz.concepts, or feed._stone.concepts in an
// older feed); every label in item.tags; every tag reference's value, forms
// and prefLabel; every tag node (an edge end tag:<label>, any layer); and
// every external concept's prefLabel (feed._rtagz.external).
//
// The origins, tried in this order, the first that holds counted:
//   record label  the type "tag" records post-pipe handed rosetta-tagz
//                 (records.jsonl in the cache folder; an earned tag record is
//                 output, not evidence, and is left out): exact, then
//                 case-insensitive
//   item text     the title and text of the same records' item lines, the
//                 text rosetta-tagz read, as a phrase on word boundaries with
//                 whitespace collapsed: exact case, then case-insensitive
//   overrides     the site's overrides file (settings rtagz.overrides, else
//                 rtagz-overrides.json in the site; absent is fine) with the
//                 container pins post-pipe merges into it (mergeOverrides),
//                 their labels: same, notSame, pin, relations, notRelated and
//                 ignore: exact, then case-insensitive
//   vocabulary    the prefLabel and altLabel values of each vocabulary the
//                 site enables (settings rtagz.conceptSchemes, each
//                 { id, path }, read as JSON, JSON-LD, JSON lines or Turtle):
//                 exact, then case-insensitive
//
// Prints where each input came from, how many labels were checked, the count
// per origin, and every label with no origin with where it appeared. Exit 0
// when every label has an origin, 1 when any has none, 2 when the check
// cannot run (no feed, or no records). Reads only; writes nothing.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { cacheDirForSite, rtagzSettings, mergeOverrides, buildConfig, OVERRIDES_FILE, IDS_FILE } = require('../src/lib/rtagz');

const POSTPIPE_ROOT = path.resolve(__dirname, '..');
// The default overrides file's name before 2026-10-31, read when only it
// exists in the site, as the build reads it.
const FORMER_OVERRIDES_FILE = 'stone.overrides.json';
const USAGE = 'usage: node tools/rtagz-labels-check.js <site folder> [--feed path] [--cache dir]';

// The origins, in the order they are tried.
const TIERS = [
  ['record-exact', 'record label, exact'],
  ['record-ci', 'record label, case-insensitive'],
  ['text-exact', 'item text, exact case'],
  ['text-ci', 'item text, case-insensitive'],
  ['overrides-exact', 'overrides, exact'],
  ['overrides-ci', 'overrides, case-insensitive'],
  ['vocabulary-exact', 'enabled vocabulary, exact'],
  ['vocabulary-ci', 'enabled vocabulary, case-insensitive'],
];

const collapse = (s) => String(s).replace(/\s+/g, ' ').trim();
const fold = (s) => collapse(s).toLowerCase();
const entries = (o) => (o && typeof o === 'object' && !Array.isArray(o) ? Object.entries(o) : []);
const list = (v) => (Array.isArray(v) ? v : []);

function expandHome(p) {
  const s = String(p);
  if (s === '~' || s.startsWith('~/')) return path.join(os.homedir(), s.slice(1));
  return s;
}

function parseArgs(argv) {
  const opt = { site: null, feed: null, cache: null, error: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--feed' || a === '--cache') {
      const v = argv[++i];
      if (typeof v !== 'string' || !v) { opt.error = `${a} needs a path`; break; }
      opt[a.slice(2)] = path.resolve(expandHome(v));
    } else if (a.startsWith('--')) {
      opt.error = `unknown option ${a}`;
      break;
    } else if (opt.site === null) {
      opt.site = path.resolve(expandHome(a));
    } else {
      opt.error = `one site folder, not two (${a})`;
      break;
    }
  }
  if (!opt.error && opt.site === null) opt.error = 'no site folder';
  return opt;
}

// ─── The phrase search ──────────────────────────────────────────────────────

// A word character: a letter, a digit, a combining mark or an underscore.
const WORD_CHAR = /[\p{L}\p{N}\p{M}_]/u;

function charBefore(s, i) {
  if (i <= 0) return '';
  const lo = s.charCodeAt(i - 1);
  if (lo >= 0xdc00 && lo <= 0xdfff && i >= 2) {
    const hi = s.charCodeAt(i - 2);
    if (hi >= 0xd800 && hi <= 0xdbff) return s.slice(i - 2, i);
  }
  return s[i - 1];
}

const charAt = (s, i) => (i < s.length ? String.fromCodePoint(s.codePointAt(i)) : '');

// Whether needle occurs in hay with no word character touching either end.
function phraseIn(hay, needle) {
  if (!needle) return false;
  for (let i = hay.indexOf(needle); i !== -1; i = hay.indexOf(needle, i + 1)) {
    if (!WORD_CHAR.test(charBefore(hay, i)) && !WORD_CHAR.test(charAt(hay, i + needle.length))) return true;
  }
  return false;
}

// ─── The inputs ─────────────────────────────────────────────────────────────

// records.jsonl: the type "tag" records' labels (only those a source wrote:
// origin explicit, or none) and the item records' title and text.
function readRecords(text) {
  const tagLabels = [];
  const texts = [];
  let items = 0, tags = 0, earned = 0, unreadable = 0;
  for (const line of String(text).split('\n')) {
    if (!line.trim()) continue;
    let r;
    try { r = JSON.parse(line); } catch (_) { unreadable++; continue; }
    if (!r || typeof r !== 'object') { unreadable++; continue; }
    if (r.type === 'tag') {
      if (r.origin !== undefined && r.origin !== 'explicit') { earned++; continue; }
      tags++;
      if (typeof r.label === 'string') tagLabels.push(r.label);
    } else if (r.type === 'item') {
      items++;
      texts.push({ id: r.id, title: typeof r.title === 'string' ? r.title : '', text: typeof r.text === 'string' ? r.text : '' });
    }
  }
  return { tagLabels, texts, items, tags, earned, unreadable };
}

// The labels an overrides object names (rosetta-tagz/docs/FORMATS.md,
// overrides.json): same and notSame groups, pin keys and values, relations
// and notRelated ends, ignore. sourceWeights, canon and config name no label.
function overrideLabels(o) {
  const out = [];
  const add = (v) => { if (typeof v === 'string') out.push(v); };
  if (!o || typeof o !== 'object') return out;
  for (const key of ['same', 'notSame']) for (const group of list(o[key])) for (const v of list(group)) add(v);
  for (const [k, v] of entries(o.pin)) { add(k); add(v); }
  for (const key of ['relations', 'notRelated']) for (const r of list(o[key])) if (r && typeof r === 'object') { add(r.a); add(r.b); }
  for (const v of list(o.ignore)) add(v);
  return out;
}

// The prefLabel and altLabel values in a vocabulary file: JSON or JSON-LD
// (a key ending in prefLabel or altLabel, its value a string, a list, a
// language map or a JSON-LD value object, at any depth), JSON lines, or
// Turtle and N-Triples (skos:prefLabel or skos:altLabel, or their full IRIs,
// with one-line literals). Anything else reads as no labels.
const LABEL_KEY = /(?:^|[#:/])(?:prefLabel|altLabel)$/;

function labelValues(v, out) {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) for (const x of v) labelValues(x, out);
  else if (v && typeof v === 'object') {
    if (typeof v['@value'] === 'string') out.push(v['@value']);
    else for (const x of Object.values(v)) labelValues(x, out);
  }
}

function walkVocabulary(node, out) {
  if (Array.isArray(node)) { for (const x of node) walkVocabulary(x, out); return; }
  if (!node || typeof node !== 'object') return;
  for (const [k, v] of Object.entries(node)) {
    if (LABEL_KEY.test(k)) labelValues(v, out);
    else if (v && typeof v === 'object') walkVocabulary(v, out);
  }
}

const TTL_LABELS = /(?:skos:(?:prefLabel|altLabel)|<http:\/\/www\.w3\.org\/2004\/02\/skos\/core#(?:prefLabel|altLabel)>)\s+("(?:[^"\\\n]|\\.)*"(?:@[A-Za-z0-9-]+|\^\^\S+)?(?:\s*,\s*"(?:[^"\\\n]|\\.)*"(?:@[A-Za-z0-9-]+|\^\^\S+)?)*)/g;
const TTL_LITERAL = /"((?:[^"\\\n]|\\.)*)"/g;
const unescapeTtl = (s) => s.replace(/\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{8})|\\(.)/g, (m, u4, u8, c) => {
  if (u4) return String.fromCodePoint(parseInt(u4, 16));
  if (u8) return String.fromCodePoint(parseInt(u8, 16));
  return { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f' }[c] || c;
});

function vocabularyLabels(text) {
  const out = [];
  const s = String(text);
  try {
    walkVocabulary(JSON.parse(s), out);
    return out;
  } catch (_) { /* not one JSON document */ }
  let jsonLines = 0;
  for (const line of s.split('\n')) {
    const t = line.trim();
    if (!t.startsWith('{')) continue;
    try { walkVocabulary(JSON.parse(t), out); jsonLines++; } catch (_) { /* not a JSON line */ }
  }
  if (jsonLines) return out;
  for (const m of s.matchAll(TTL_LABELS)) {
    for (const lit of m[1].matchAll(TTL_LITERAL)) out.push(unescapeTtl(lit[1]));
  }
  return out;
}

// ─── The labels ─────────────────────────────────────────────────────────────

// Every label the feed carries, each with where it appeared: kind (as
// printed) to { n, examples }, a few examples each (a concept id, an item id,
// the other end of an edge). occurrences counts every appearance by group.
function collectLabels(feed) {
  const labels = new Map();
  const occurrences = {};
  const add = (raw, kind, group, example) => {
    const label = typeof raw === 'number' ? String(raw) : raw;
    if (typeof label !== 'string') return;
    let places = labels.get(label);
    if (!places) labels.set(label, (places = new Map()));
    let p = places.get(kind);
    if (!p) places.set(kind, (p = { n: 0, examples: [] }));
    p.n++;
    if (example !== undefined && example !== null && p.examples.length < 3 && !p.examples.includes(String(example))) p.examples.push(String(example));
    occurrences[group] = (occurrences[group] || 0) + 1;
  };
  const f = feed && typeof feed === 'object' ? feed : {};
  const rtz = f._rtagz || f._stone || null;
  for (const c of list(rtz && rtz.concepts)) {
    if (!c || typeof c !== 'object') continue;
    const cid = c.id || c.canonical;
    add(c.canonical, 'concept canonical', 'concept canonical', cid);
    for (const [s, l] of entries(c.prefLabel)) add(l, `concept prefLabel.${s}`, 'concept prefLabel', cid);
    for (const [s, ls] of entries(c.altLabel)) for (const l of list(ls)) add(l, `concept altLabel.${s}`, 'concept altLabel', cid);
    for (const [s, m] of entries(c.forms)) for (const [l] of entries(m)) add(l, `concept forms.${s}`, 'concept forms', cid);
    for (const r of list(c.rank)) if (r && typeof r === 'object') add(r.label, 'concept rank', 'concept rank', cid);
  }
  for (const [id, ext] of entries(rtz && rtz.external)) {
    if (!ext || typeof ext !== 'object') continue;
    if (typeof ext.prefLabel === 'string') add(ext.prefLabel, 'external prefLabel', 'external prefLabel', id);
    else for (const [s, l] of entries(ext.prefLabel)) add(l, `external prefLabel.${s}`, 'external prefLabel', id);
  }
  for (const it of list(f.items)) {
    if (!it || typeof it !== 'object') continue;
    for (const t of list(it.tags)) add(t, 'item.tags', 'item.tags', it.id);
    for (const r of list(it._references)) {
      if (!r || r.type !== 'tag') continue;
      add(r.value, '_references value', '_references value', it.id);
      for (const [s, ls] of entries(r.forms)) for (const l of list(ls)) add(l, `_references forms.${s}`, '_references forms', it.id);
      for (const [s, l] of entries(r.prefLabel)) add(l, `_references prefLabel.${s}`, '_references prefLabel', it.id);
    }
  }
  for (const e of list(f.edges)) {
    if (!e || typeof e !== 'object') continue;
    for (const [end, other] of [[e.source, e.target], [e.target, e.source]]) {
      if (typeof end === 'string' && end.startsWith('tag:')) add(end.slice(4), `tag node, ${e.layer || 'no layer'} edge`, 'tag node', other);
    }
  }
  return { labels, occurrences };
}

// ─── The check ──────────────────────────────────────────────────────────────

function buildIndex({ recordLabels = [], texts = [], overrides = [], vocabulary = [] }) {
  const hay = [];
  for (const t of texts) {
    for (const s of [t.title, t.text]) {
      if (typeof s !== 'string' || !s) continue;
      const exact = collapse(s);
      hay.push({ exact, lower: exact.toLowerCase() });
    }
  }
  const setOf = (xs, fn) => new Set(xs.filter((x) => typeof x === 'string').map(fn));
  return {
    recordExact: new Set(recordLabels),
    recordFold: setOf(recordLabels, fold),
    hay,
    overridesExact: new Set(overrides),
    overridesFold: setOf(overrides, fold),
    vocabularyExact: new Set(vocabulary),
    vocabularyFold: setOf(vocabulary, fold),
  };
}

// The first origin that holds for a label, or null.
function originOf(label, idx) {
  const folded = fold(label);
  if (idx.recordExact.has(label)) return 'record-exact';
  if (folded && idx.recordFold.has(folded)) return 'record-ci';
  const phrase = collapse(label);
  if (phrase && idx.hay.some((h) => phraseIn(h.exact, phrase))) return 'text-exact';
  if (folded && idx.hay.some((h) => phraseIn(h.lower, folded))) return 'text-ci';
  if (idx.overridesExact.has(label)) return 'overrides-exact';
  if (folded && idx.overridesFold.has(folded)) return 'overrides-ci';
  if (idx.vocabularyExact.has(label)) return 'vocabulary-exact';
  if (folded && idx.vocabularyFold.has(folded)) return 'vocabulary-ci';
  return null;
}

// The check itself, on what has been read. recordLabels: the labels sources
// wrote; texts: [{ title, text }]; overrides and vocabulary: label lists.
// Returns the number of labels checked, the count per origin, each label's
// origin, every label with none (with where it appeared), and the
// appearances by group.
function checkLabels({ feed, recordLabels, texts, overrides, vocabulary }) {
  const { labels, occurrences } = collectLabels(feed);
  const idx = buildIndex({ recordLabels, texts, overrides, vocabulary });
  const counts = Object.fromEntries(TIERS.map(([k]) => [k, 0]));
  const origins = new Map();
  const missing = [];
  for (const [label, places] of labels) {
    const o = originOf(label, idx);
    origins.set(label, o);
    if (o) counts[o]++;
    else missing.push({ label, places: [...places].map(([kind, p]) => ({ kind, n: p.n, examples: p.examples })) });
  }
  missing.sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0));
  return { checked: labels.size, counts, origins, missing, occurrences };
}

// ─── Finding the inputs for a site ──────────────────────────────────────────

// The cache folders the build may have used for this site, in the order
// tried: post-pipe's own .feed-cache (generate-index runs from post-pipe's
// root), the working directory's if that is elsewhere, then the stone/
// folders a build before 2026-10-31 wrote.
function cacheCandidates(siteRoot) {
  const bases = [...new Set([path.join(POSTPIPE_ROOT, '.feed-cache'), path.resolve('.feed-cache')])];
  const out = bases.map((b) => path.resolve(cacheDirForSite(siteRoot, b)));
  for (const b of bases) out.push(path.join(b, 'stone', path.basename(out[0])));
  return out;
}

// The site's overrides file, found as the build finds it (runRtagzPhase).
function overridesPath(siteRoot, cfg) {
  if (cfg && cfg.overrides) return path.isAbsolute(cfg.overrides) ? cfg.overrides : path.resolve(siteRoot, cfg.overrides);
  const current = path.resolve(siteRoot, OVERRIDES_FILE);
  const former = path.resolve(siteRoot, FORMER_OVERRIDES_FILE);
  return !fs.existsSync(current) && fs.existsSync(former) ? former : current;
}

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

function main(argv, log = console.log) {
  const opt = parseArgs(argv);
  if (opt.error) { log(opt.error); log(USAGE); return 2; }
  const siteRoot = opt.site;
  const feedPath = opt.feed || path.join(siteRoot, '_site', 'feed.json');

  let feed;
  try { feed = readJson(feedPath); } catch (err) {
    log(`feed: cannot read ${feedPath} (${err.message})`);
    return 2;
  }
  const rtzKey = feed._rtagz ? '_rtagz' : (feed._stone ? '_stone' : null);
  const feedBuilt = rtzKey && feed[rtzKey] && feed[rtzKey].built ? feed[rtzKey].built : null;

  let settings = null;
  const settingsPath = path.join(siteRoot, 'settings.json');
  try { settings = readJson(settingsPath); } catch (_) { settings = null; }
  const cfg = settings ? rtagzSettings(settings) : undefined;

  // The records rosetta-tagz read.
  const candidates = opt.cache ? [opt.cache] : cacheCandidates(siteRoot);
  const cacheDir = candidates.find((d) => fs.existsSync(path.join(d, 'records.jsonl'))) || candidates[0];
  const recordsPath = path.join(cacheDir, 'records.jsonl');
  let records;
  try { records = readRecords(fs.readFileSync(recordsPath, 'utf8')); } catch (err) {
    log(`site: ${siteRoot}`);
    log(`feed: ${feedPath}`);
    log(`records: cannot read ${recordsPath} (${err.code || err.message}); name the cache folder with --cache DIR`);
    return 2;
  }
  let cacheBuilt = null;
  try { cacheBuilt = readJson(path.join(cacheDir, 'build.json')).built || null; } catch (_) { cacheBuilt = null; }

  // The overrides rosetta-tagz was given: the site's file, and the container
  // pins post-pipe merges into it.
  const ovPath = overridesPath(siteRoot, cfg);
  let siteOverrides = {};
  let ovState = 'absent';
  if (fs.existsSync(ovPath)) {
    try { siteOverrides = readJson(ovPath); ovState = 'read'; } catch (err) { ovState = `unreadable (${err.message})`; }
  }
  const containment = settings && Array.isArray(settings.containment) ? settings.containment : [];
  const containerPins = containment.filter((c) => c && typeof c.tag === 'string' && c.tag).length;
  const overrides = overrideLabels(mergeOverrides(siteOverrides, containment));

  // The vocabularies the site enables, their paths as the build makes them
  // (buildConfig; the ledger is named only so it does not go looking for a
  // former ids file).
  const vocabLines = [];
  const vocabulary = [];
  const schemes = cfg && Array.isArray(cfg.conceptSchemes) && cfg.conceptSchemes.length
    ? (buildConfig({ conceptSchemes: cfg.conceptSchemes, siteRoot, ledger: IDS_FILE }).conceptSchemes || [])
    : [];
  for (const s of schemes) {
    let labels = [];
    let state;
    try {
      labels = vocabularyLabels(fs.readFileSync(s.path, 'utf8'));
      state = labels.length ? `${labels.length} labels` : 'no prefLabel or altLabel read';
    } catch (err) {
      state = `cannot read (${err.code || err.message})`;
    }
    vocabulary.push(...labels);
    vocabLines.push(`  ${s.id}: ${s.path}  ${state}`);
  }

  const result = checkLabels({ feed, recordLabels: records.tagLabels, texts: records.texts, overrides, vocabulary });

  log(`site: ${siteRoot}`);
  log(`feed: ${feedPath}  (${rtzKey || 'no _rtagz or _stone'}${feedBuilt ? ', built ' + feedBuilt : ''})`);
  log(`records: ${recordsPath}  ${records.items} items, ${records.tags} tag records (${new Set(records.tagLabels).size} distinct labels)` +
    (records.earned ? `, ${records.earned} earned tag records left out` : '') +
    (records.unreadable ? `, ${records.unreadable} unreadable lines` : '') +
    (cacheBuilt ? `; build.json built ${cacheBuilt}` : '; no build.json'));
  if (cacheBuilt && feedBuilt && cacheBuilt !== feedBuilt) {
    log(`warning: the records are from another build (${cacheBuilt}) than the feed (${feedBuilt}); this check may not describe the feed`);
  }
  log(`overrides: ${ovPath} ${ovState}; container pins from settings.containment: ${containerPins}; ${new Set(overrides).size} labels`);
  if (!schemes.length) log('vocabularies: none enabled');
  else { log('vocabularies:'); for (const l of vocabLines) log(l); }
  const occ = Object.entries(result.occurrences).map(([k, v]) => `${k} ${v}`).join(', ');
  log(`labels checked: ${result.checked} distinct (appearances: ${occ || 'none'})`);
  log('origins, the first that holds, in this order:');
  for (const [k, name] of TIERS) log(`  ${name}: ${result.counts[k]}`);
  log(`  no origin: ${result.missing.length}`);
  // The labels verbatim only when case is ignored, named, since the rule asks
  // for verbatim.
  for (const [k, name] of [['record-ci', 'record label'], ['text-ci', 'item text'], ['overrides-ci', 'overrides'], ['vocabulary-ci', 'enabled vocabulary']]) {
    const ls = [...result.origins].filter(([, o]) => o === k).map(([l]) => l).sort();
    if (!ls.length) continue;
    const shown = ls.slice(0, 40).map((l) => JSON.stringify(l)).join(', ');
    log(`case-insensitive only, ${name}: ${shown}${ls.length > 40 ? `, and ${ls.length - 40} more` : ''}`);
  }
  if (!result.missing.length) {
    log('every label has an origin');
    return 0;
  }
  log(`labels with no origin: ${result.missing.length}`);
  for (const m of result.missing) {
    log(`  ${JSON.stringify(m.label)}`);
    for (const p of m.places) log(`    ${p.kind}: ${p.n}${p.examples.length ? ' (' + p.examples.join(', ') + (p.n > p.examples.length ? ', ...' : '') + ')' : ''}`);
  }
  return 1;
}

module.exports = {
  TIERS, parseArgs, phraseIn, readRecords, overrideLabels, vocabularyLabels,
  collectLabels, checkLabels, cacheCandidates, main,
};

if (require.main === module) process.exitCode = main(process.argv.slice(2));
