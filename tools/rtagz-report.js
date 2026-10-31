#!/usr/bin/env node
// Measures a built feed's tags, so a change to rosetta-tagz can be judged with
// the same numbers before and after. Reads one feed.json and prints:
// items; tag edges by origin; distinct tag nodes; tags on exactly one item;
// items with no tag; item pairs sharing a tag, overall, within each source
// and across each pair of sources; for discovered tags, whether the N in
// "recurs in N of M items" equals the number of items carrying the tag; and
// the why check from Harold's spec of 2026-10-25 (Acceptance): whether that N
// equals the number of items carrying a discovered assertion of the tag.
//
//   node tools/rtagz-report.js [path/to/feed.json] [--scheme ID] [--depth N] [--ratio V]
//
// Default feed: ~/Projects/haroldyounghumxn.site/_site/feed.json. --scheme and
// --depth re-key the tags through feed._rtagz (src/lib/schemeLabels.js) when
// that module exists, so the same report can be read in another scheme or one
// step broader; without it they are ignored with one line. --ratio V counts
// what the viewer shows with its "Source coherence ratio" at V: a tag edge,
// and a tag reference, counts only when it carries no sourceRatio or one at
// or above V (ratioShows in src/lib/sourceRatio.js, the viewer's own rule).
// Without --ratio everything counts, as before.
//
// A feed from before 2026-10-31 carries feed._stone instead of feed._rtagz,
// and one from before 2026-10-25 has no sourceRatio and no PROV fields; both
// read the same, with n/a where a field is missing.
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { ratioShows, ratioRange, ratioText } = require('../src/lib/sourceRatio');

const DEFAULT_FEED = path.join(os.homedir(), 'Projects/haroldyounghumxn.site/_site/feed.json');
const WHY_RE = /recurs in (\d+) of (\d+) items/;
const isTag = (v) => typeof v === 'string' && v.startsWith('tag:');

function parseArgs(argv) {
  const opt = { scheme: null, depth: 0, ratio: null, feed: null, error: null };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--scheme') opt.scheme = argv[++i];
    else if (argv[i] === '--depth') opt.depth = Number(argv[++i]) || 0;
    else if (argv[i] === '--ratio') {
      const raw = argv[++i];
      const v = typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : NaN;
      if (Number.isFinite(v)) opt.ratio = v;
      else opt.error = `--ratio needs a number, got ${raw === undefined ? 'nothing' : JSON.stringify(raw)}`;
    } else positional.push(argv[i]);
  }
  opt.feed = positional[0] || DEFAULT_FEED;
  return opt;
}

// The why check. For every discovered tag (a tag with an assertion whose
// origin is discovered), the N its why gives ("recurs in N of M items")
// against the number of items whose _references carry a discovered assertion
// of it, with the items whose tag edge says attrs.origin discovered beside
// it, and the items carrying the tag by any origin for reference. shows
// (sourceRatio) says whether an assertion counts: the ratio filter, or
// everything. Pure, so it can be tested without a file.
function whyCheck(items, edges, shows = () => true) {
  const ids = new Set((items || []).map((i) => i.id));
  // Every tag seen, by label; only those with a discovered assertion showing
  // are checked.
  const tags = new Map();
  const tagOf = (label) => {
    if (!tags.has(label)) tags.set(label, { Ns: new Set(), Ms: new Set(), refItems: new Set(), hiddenRefs: 0, edgeItems: new Set(), allItems: new Set(), origins: new Set() });
    return tags.get(label);
  };
  for (const it of items || []) {
    for (const r of it._references || []) {
      if (!r || r.type !== 'tag' || r.origin !== 'discovered') continue;
      const t = tagOf(String(r.value));
      if (!shows(r.sourceRatio)) { t.hiddenRefs++; continue; }
      t.refItems.add(it.id);
      const m = WHY_RE.exec(String(r.why || ''));
      if (m) { t.Ns.add(+m[1]); t.Ms.add(+m[2]); }
    }
  }
  // Whether the feed's tag edges say their origin at all (a feed built
  // without rosetta-tagz's attrs does not; the edge count is then n/a).
  let edgesKnown = false;
  for (const e of edges || []) {
    if (!e || e.layer !== 'tag') continue;
    const t0 = isTag(e.target) ? e.target : (isTag(e.source) ? e.source : null);
    if (!t0) continue;
    const pid = t0 === e.target ? e.source : e.target;
    if (!ids.has(pid)) continue;
    const origin = e.attrs && e.attrs.origin;
    if (origin) edgesKnown = true;
    if (!shows(e.attrs ? e.attrs.sourceRatio : undefined)) continue;
    const t = tagOf(t0.slice(4));
    t.allItems.add(pid);
    t.origins.add(origin || '(no attrs)');
    if (origin === 'discovered') t.edgeItems.add(pid);
  }

  const rows = [];
  const edgeRows = [];
  let checked = 0, withN = 0, agree = 0, leftOut = 0;
  for (const [label, t] of tags) {
    if (!t.refItems.size && !t.edgeItems.size) { if (t.hiddenRefs) leftOut++; continue; }
    checked++;
    if (edgesKnown && t.edgeItems.size !== t.refItems.size) {
      edgeRows.push({ label, discoveredAssertions: t.refItems.size, discoveredEdges: t.edgeItems.size });
    }
    const Ns = [...t.Ns];
    if (!Ns.length) continue;
    withN++;
    if (Ns.every((N) => N === t.refItems.size)) { agree++; continue; }
    rows.push({
      label,
      N: Ns.join('/'),
      M: [...t.Ms].join('/'),
      discoveredAssertions: t.refItems.size,
      discoveredEdges: edgesKnown ? t.edgeItems.size : 'n/a',
      itemsCarrying: t.allItems.size,
      origins: [...t.origins].join(','),
    });
  }
  const gap = (r) => Math.abs(+String(r.N).split('/')[0] - r.discoveredAssertions);
  rows.sort((a, b) => gap(b) - gap(a) || (a.label < b.label ? -1 : a.label > b.label ? 1 : 0));
  return { checked, withN, agree, mismatches: rows, edgesKnown, edgesDisagree: edgeRows.length, edgeMismatches: edgeRows, leftOut };
}

function run(argv, log = console.log) {
  const opt = parseArgs(argv);
  if (opt.error) {
    log(opt.error);
    log('usage: node tools/rtagz-report.js [path/to/feed.json] [--scheme ID] [--depth N] [--ratio V]');
    return 2;
  }
  const p = opt.feed;
  const f = JSON.parse(fs.readFileSync(p, 'utf8'));
  const items = f.items || [];
  const n = items.length;
  const C2 = (k) => (k * (k - 1)) / 2;
  const pct = (a, b) => (b ? (100 * a / b).toFixed(1) + '%' : 'n/a');
  const srcOf = (it) => (it._source && (it._source.id || it._source.title)) || '(none)';
  const srcName = new Map();
  for (const it of items) srcName.set(srcOf(it), (it._source && it._source.title) || srcOf(it));
  const ids = new Set(items.map((i) => i.id));
  // rosetta-tagz's summary: feed._rtagz, or feed._stone in a feed built before
  // the rename of 2026-10-31.
  const rtz = f._rtagz || f._stone || null;
  const rtzKey = f._rtagz ? '_rtagz' : (f._stone ? '_stone' : null);
  // The ratio filter: what the viewer shows at --ratio V, else everything.
  const shows = (ratio) => opt.ratio === null || ratioShows(ratio, opt.ratio);

  // Optional re-keying through a scheme and depth.
  let keyOf = (tagId, edge) => tagId;
  if (opt.scheme || opt.depth) {
    let schemeLabels = null;
    try { schemeLabels = require('../src/lib/schemeLabels'); } catch (_) { schemeLabels = null; }
    if (!schemeLabels || !rtz) {
      log('note: --scheme/--depth ignored (no src/lib/schemeLabels.js or no feed._rtagz)');
    } else {
      keyOf = (tagId, edge) => {
        const c = edge && edge.attrs && edge.attrs.concept;
        if (!c) return tagId;
        const r = schemeLabels.labelFor(rtz, c, { scheme: opt.scheme || 'site', depth: opt.depth });
        return r && r.groupId ? 'concept:' + r.groupId : (r && r.label ? 'tag:' + r.label : tagId);
      };
    }
  }

  const allTagEdges = (f.edges || []).filter((e) => e && e.layer === 'tag');
  const tagEdges = allTagEdges.filter((e) => shows(e.attrs ? e.attrs.sourceRatio : undefined));
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

  log('feed:', p, opt.scheme || opt.depth ? `(scheme ${opt.scheme || 'site'}, depth ${opt.depth})` : '');
  if (opt.ratio !== null) {
    // What the ratio left out: tag edges under it, and tag nodes none of
    // whose edges is left showing (the viewer hides those too).
    const nodesAll = new Set();
    const nodesShown = new Set();
    for (const e of allTagEdges) {
      const t0 = isTag(e.target) ? e.target : (isTag(e.source) ? e.source : null);
      if (!t0 || !ids.has(t0 === e.target ? e.source : e.target)) continue;
      nodesAll.add(t0);
      if (shows(e.attrs ? e.attrs.sourceRatio : undefined)) nodesShown.add(t0);
    }
    const range = ratioRange(f);
    if (!range.has) {
      log('source coherence ratio:', String(opt.ratio), ' no tag edge carries a sourceRatio (n/a): nothing left out');
    } else {
      const outside = opt.ratio < range.lo - 1e-9 || opt.ratio > range.hi + 1e-9;
      log('source coherence ratio:', String(opt.ratio), ' tag edges left out (sourceRatio under it):', allTagEdges.length - tagEdges.length, 'of', allTagEdges.length,
        ' tag nodes left out:', nodesAll.size - nodesShown.size, 'of', nodesAll.size,
        ` the viewer's slider runs ${ratioText(range.lo)} to ${ratioText(range.hi)}, the build's bar ${ratioText(range.bar)}` + (outside ? `; ${opt.ratio} is outside it` : ''));
    }
  }
  log('items:', n);
  log('tag edges (layer tag):', tagEdges.length, ' by attrs.origin:', JSON.stringify(edgeOrigins), ' dangling:', danglingEdges);
  log('distinct tag nodes:', tagCount, ' distinct attrs.concept:', concepts.size);
  log('tags on exactly one item:', singletons, '(' + pct(singletons, tagCount) + ' of tags)');
  log('items with no tag edge:', untagged.length, '(' + pct(untagged.length, n) + ')');
  const untaggedBySrc = {};
  for (const it of untagged) { const k = srcName.get(srcOf(it)); untaggedBySrc[k] = (untaggedBySrc[k] || 0) + 1; }
  log('  untagged by source:', JSON.stringify(untaggedBySrc));

  const shares = (a, b) => { const A = itemTags.get(a.id), B = itemTags.get(b.id); for (const t of A) if (B.has(t)) return true; return false; };
  let sharing = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (shares(items[i], items[j])) sharing++;
  log('item pairs sharing >=1 tag:', sharing, 'of', C2(n), '(' + pct(sharing, C2(n)) + ')');

  const bySrc = new Map();
  for (const it of items) { const k = srcOf(it); if (!bySrc.has(k)) bySrc.set(k, []); bySrc.get(k).push(it); }
  const srcKeys = [...bySrc.keys()];
  log('within source:');
  for (const k of srcKeys) {
    const L = bySrc.get(k); let s = 0;
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) if (shares(L[i], L[j])) s++;
    log('  ' + srcName.get(k) + ' (n=' + L.length + '):', s, 'of', C2(L.length), '(' + pct(s, C2(L.length)) + ')');
  }
  log('across sources:');
  for (let a = 0; a < srcKeys.length; a++) for (let b = a + 1; b < srcKeys.length; b++) {
    const A = bySrc.get(srcKeys[a]), B = bySrc.get(srcKeys[b]); let s = 0;
    for (const x of A) for (const y of B) if (shares(x, y)) s++;
    log('  ' + srcName.get(srcKeys[a]) + ' x ' + srcName.get(srcKeys[b]) + ':', s, 'of', A.length * B.length, '(' + pct(s, A.length * B.length) + ')');
  }

  // Discovered tags: the N in "recurs in N of M items" against the items carrying the tag.
  const disc = new Map();
  for (const it of items) {
    for (const r of it._references || []) {
      if (!r || r.type !== 'tag' || r.origin !== 'discovered') continue;
      if (!shows(r.sourceRatio)) continue;
      if (!disc.has(r.value)) disc.set(r.value, { claims: [] });
      const m = WHY_RE.exec(String(r.why || ''));
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
  log('discovered tags:', disc.size, ' with a parsable N:', disc.size - noClaim, ' N disagrees with items carrying the tag:', disagree, '(' + pct(disagree, disc.size - noClaim) + ')', ' N varies across items:', varies, ' M != items count:', Mmismatch);
  const over = rows.filter((r) => +String(r.N).split('/')[0] > r.actualItems).length;
  log('  of the disagreeing, N > actual:', over, ' N < actual:', rows.length - over);
  log('  examples (largest gap first):');
  for (const r of rows.slice(0, 5)) log('   ', JSON.stringify(r));

  // The why check, beside the comparison above: N against the items with a
  // discovered assertion of the tag, not every item carrying it.
  const w = whyCheck(items, f.edges || [], shows);
  const na = (v) => (w.withN ? v : 'n/a');
  const whyLine = ['why check (N against items with a discovered assertion of the tag, from _references):', 'discovered tags:', w.checked,
    ' with a parsable N:', w.checked ? w.withN : 'n/a',
    ' N equals discovered assertions:', na(w.agree),
    ' mismatches:', na(w.mismatches.length) + (w.withN ? ' (' + pct(w.mismatches.length, w.withN) + ')' : ''),
    ' discovered edges disagree with _references:', w.edgesKnown ? w.edgesDisagree : 'n/a'];
  if (opt.ratio !== null) whyLine.push(` discovered tags left out at ratio ${opt.ratio}:`, w.leftOut);
  log(...whyLine);
  if (w.mismatches.length) {
    log('  mismatches (largest gap first):');
    for (const r of w.mismatches) log('   ', JSON.stringify(r));
  }
  if (w.edgeMismatches.length) {
    log('  discovered edges disagreeing with _references:');
    for (const r of w.edgeMismatches) log('   ', JSON.stringify(r));
  }

  if (rtz) {
    const s = rtz;
    const rel = s.relations ? JSON.stringify(s.relations) : 'n/a';
    const map = s.mappings ? JSON.stringify(s.mappings) : 'n/a';
    const led = s.ledger ? JSON.stringify(s.ledger) : 'n/a';
    log(rtzKey + ': concepts', (s.concepts || []).length, ' schemes', (s.schemes || []).map((x) => x.id).join(',') || 'n/a', ' relations', rel, ' mappings', map, ' untagged', s.untagged ? s.untagged.count : 'n/a', ' ledger', led);
  }
  return 0;
}

module.exports = { parseArgs, whyCheck, run };

if (require.main === module) process.exitCode = run(process.argv.slice(2));
