#!/usr/bin/env node
// Measures a built feed's tags, so a change to the stone can be judged with
// the same numbers before and after. Reads one feed.json and prints:
// items; tag edges by origin; distinct tag nodes; tags on exactly one item;
// items with no tag; item pairs sharing a tag, overall, within each source
// and across each pair of sources; and, for discovered tags, whether the N in
// "recurs in N of M items" equals the number of items carrying the tag.
//
//   node tools/stone-report.js [path/to/feed.json] [--scheme ID] [--depth N]
//
// Default feed: ~/Projects/haroldyounghumxn.site/_site/feed.json. --scheme and
// --depth re-key the tags through feed._stone (src/lib/schemeLabels.js) when
// that module exists, so the same report can be read in another scheme or one
// step broader; without it they are ignored with one line.
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

const argv = process.argv.slice(2);
const opt = { scheme: null, depth: 0 };
const positional = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--scheme') opt.scheme = argv[++i];
  else if (argv[i] === '--depth') opt.depth = Number(argv[++i]) || 0;
  else positional.push(argv[i]);
}
const p = positional[0] || path.join(os.homedir(), 'Projects/haroldyounghumxn.site/_site/feed.json');
const f = JSON.parse(fs.readFileSync(p, 'utf8'));
const items = f.items || [];
const n = items.length;
const C2 = (k) => (k * (k - 1)) / 2;
const pct = (a, b) => (b ? (100 * a / b).toFixed(1) + '%' : 'n/a');
const srcOf = (it) => (it._source && (it._source.id || it._source.title)) || '(none)';
const srcName = new Map();
for (const it of items) srcName.set(srcOf(it), (it._source && it._source.title) || srcOf(it));
const ids = new Set(items.map((i) => i.id));
const isTag = (v) => typeof v === 'string' && v.startsWith('tag:');

// Optional re-keying through a scheme and depth.
let keyOf = (tagId, edge) => tagId;
if (opt.scheme || opt.depth) {
  let schemeLabels = null;
  try { schemeLabels = require('../src/lib/schemeLabels'); } catch (_) { schemeLabels = null; }
  if (!schemeLabels || !f._stone) {
    console.log('note: --scheme/--depth ignored (no src/lib/schemeLabels.js or no feed._stone)');
  } else {
    keyOf = (tagId, edge) => {
      const c = edge && edge.attrs && edge.attrs.concept;
      if (!c) return tagId;
      const r = schemeLabels.labelFor(f._stone, c, { scheme: opt.scheme || 'site', depth: opt.depth });
      return r && r.groupId ? 'concept:' + r.groupId : (r && r.label ? 'tag:' + r.label : tagId);
    };
  }
}

const tagEdges = (f.edges || []).filter((e) => e && e.layer === 'tag');
const itemTags = new Map(items.map((i) => [i.id, new Set()]));
const tagItems = new Map();
const tagItemsByOrigin = new Map();
const concepts = new Set();
let danglingEdges = 0;
const edgeOrigins = {};
for (const e of tagEdges) {
  const t0 = isTag(e.target) ? e.target : (isTag(e.source) ? e.source : null);
  if (!t0) continue;
  const pid = t0 === e.target ? e.source : e.target;
  if (!ids.has(pid)) { danglingEdges++; continue; }
  const t = keyOf(t0, e);
  const o = (e.attrs && e.attrs.origin) || '(no attrs)';
  edgeOrigins[o] = (edgeOrigins[o] || 0) + 1;
  if (e.attrs && e.attrs.concept) concepts.add(e.attrs.concept);
  if (!tagItems.has(t)) tagItems.set(t, new Set());
  tagItems.get(t).add(pid);
  if (!tagItemsByOrigin.has(t)) tagItemsByOrigin.set(t, new Map());
  const bo = tagItemsByOrigin.get(t);
  if (!bo.has(o)) bo.set(o, new Set());
  bo.get(o).add(pid);
  itemTags.get(pid).add(t);
}
const tagCount = tagItems.size;
const singletons = [...tagItems.values()].filter((s) => s.size === 1).length;
const untagged = items.filter((i) => itemTags.get(i.id).size === 0);

console.log('feed:', p, opt.scheme || opt.depth ? `(scheme ${opt.scheme || 'site'}, depth ${opt.depth})` : '');
console.log('items:', n);
console.log('tag edges (layer tag):', tagEdges.length, ' by attrs.origin:', JSON.stringify(edgeOrigins), ' dangling:', danglingEdges);
console.log('distinct tag nodes:', tagCount, ' distinct attrs.concept:', concepts.size);
console.log('tags on exactly one item:', singletons, '(' + pct(singletons, tagCount) + ' of tags)');
console.log('items with no tag edge:', untagged.length, '(' + pct(untagged.length, n) + ')');
const untaggedBySrc = {};
for (const it of untagged) { const k = srcName.get(srcOf(it)); untaggedBySrc[k] = (untaggedBySrc[k] || 0) + 1; }
console.log('  untagged by source:', JSON.stringify(untaggedBySrc));

const shares = (a, b) => { const A = itemTags.get(a.id), B = itemTags.get(b.id); for (const t of A) if (B.has(t)) return true; return false; };
let sharing = 0;
for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (shares(items[i], items[j])) sharing++;
console.log('item pairs sharing >=1 tag:', sharing, 'of', C2(n), '(' + pct(sharing, C2(n)) + ')');

const bySrc = new Map();
for (const it of items) { const k = srcOf(it); if (!bySrc.has(k)) bySrc.set(k, []); bySrc.get(k).push(it); }
const srcKeys = [...bySrc.keys()];
console.log('within source:');
for (const k of srcKeys) {
  const L = bySrc.get(k); let s = 0;
  for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) if (shares(L[i], L[j])) s++;
  console.log('  ' + srcName.get(k) + ' (n=' + L.length + '):', s, 'of', C2(L.length), '(' + pct(s, C2(L.length)) + ')');
}
console.log('across sources:');
for (let a = 0; a < srcKeys.length; a++) for (let b = a + 1; b < srcKeys.length; b++) {
  const A = bySrc.get(srcKeys[a]), B = bySrc.get(srcKeys[b]); let s = 0;
  for (const x of A) for (const y of B) if (shares(x, y)) s++;
  console.log('  ' + srcName.get(srcKeys[a]) + ' x ' + srcName.get(srcKeys[b]) + ':', s, 'of', A.length * B.length, '(' + pct(s, A.length * B.length) + ')');
}

// Discovered tags: the N in "recurs in N of M items" against the items carrying the tag.
const re = /recurs in (\d+) of (\d+) items/;
const disc = new Map();
for (const it of items) {
  for (const r of it._references || []) {
    if (!r || r.type !== 'tag' || r.origin !== 'discovered') continue;
    if (!disc.has(r.value)) disc.set(r.value, { claims: [] });
    const m = re.exec(String(r.why || ''));
    disc.get(r.value).claims.push({ item: it.id, N: m ? +m[1] : null, M: m ? +m[2] : null });
  }
}
for (const [t, bo] of tagItemsByOrigin) if (bo.has('discovered') && !disc.has(t.slice(4))) disc.set(t.slice(4), { claims: [] });
let disagree = 0, noClaim = 0, varies = 0, Mmismatch = 0;
const rows = [];
for (const [label, d] of disc) {
  const all = tagItems.get('tag:' + label) || new Set();
  const bo = tagItemsByOrigin.get('tag:' + label) || new Map();
  const discItems = (bo.get('discovered') || new Set()).size;
  const Ns = [...new Set(d.claims.map((c) => c.N).filter((x) => x !== null))];
  const Ms = [...new Set(d.claims.map((c) => c.M).filter((x) => x !== null))];
  if (Ms.some((M) => M !== n)) Mmismatch++;
  if (!Ns.length) { noClaim++; continue; }
  if (Ns.length > 1) varies++;
  const bad = Ns.some((N) => N !== all.size);
  if (bad) {
    disagree++;
    rows.push({ label, N: Ns.join('/'), M: Ms.join('/'), actualItems: all.size, discoveredEdges: discItems, origins: [...bo.keys()].join(',') });
  }
}
rows.sort((a, b) => Math.abs(+String(b.N).split('/')[0] - b.actualItems) - Math.abs(+String(a.N).split('/')[0] - a.actualItems));
console.log('discovered tags:', disc.size, ' with a parsable N:', disc.size - noClaim, ' N disagrees with items carrying the tag:', disagree, '(' + pct(disagree, disc.size - noClaim) + ')', ' N varies across items:', varies, ' M != items count:', Mmismatch);
const over = rows.filter((r) => +String(r.N).split('/')[0] > r.actualItems).length;
console.log('  of the disagreeing, N > actual:', over, ' N < actual:', rows.length - over);
console.log('  examples (largest gap first):');
for (const r of rows.slice(0, 5)) console.log('   ', JSON.stringify(r));

if (f._stone) {
  const s = f._stone;
  const rel = s.relations ? JSON.stringify(s.relations) : 'n/a';
  const map = s.mappings ? JSON.stringify(s.mappings) : 'n/a';
  const led = s.ledger ? JSON.stringify(s.ledger) : 'n/a';
  console.log('_stone: concepts', (s.concepts || []).length, ' schemes', (s.schemes || []).map((x) => x.id).join(',') || 'n/a', ' relations', rel, ' mappings', map, ' untagged', s.untagged ? s.untagged.count : 'n/a', ' ledger', led);
}
