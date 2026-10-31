// The ledger: concept ids that survive from one build to the next. A SKOS concept is a URI, so an
// id must not move just because a spelling arrived or left; this file remembers which norms each id
// covered last time and hands the same id to the cluster that continues it.
//
// Format `rosetta-tagz/ledger@1`:
//   { schema, created, updated, builds,
//     concepts: { id: { members[], label, pin?, since, lastSeen, parent? } },   // live ids
//     retired:  { id: { members[], label, since, lastSeen, into? } },           // ids no cluster continues
//     events:   [ { type: split|merge|retire, at, … } ] }                        // the 200 most recent
//
// Nothing in here is invented: `members` are norms the corpus wrote, `label` is the canonical the
// stone chose (a spelling somebody wrote, or a human's pin), `pin` is the first pinned member norm
// (when several members are pinned the others stay members, which is continuity enough).
import fs from 'node:fs';
import path from 'node:path';
import { normalizeLabel, slugify } from './normalize.js';

export const LEDGER_SCHEMA = 'rosetta-tagz/ledger@1';
export const MAX_EVENTS = 200;

const isObject = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);
const normOf = (label) => normalizeLabel(label).norm;

export function emptyLedger(now = null) {
  return { schema: LEDGER_SCHEMA, created: now, updated: now, builds: 0, concepts: {}, retired: {}, events: [] };
}

// A ledger is one of ours, with every entry carrying a member list. Anything else is unreadable:
// the caller warns once, mints afresh and leaves the file alone.
export function isLedger(x) {
  if (!isObject(x) || x.schema !== LEDGER_SCHEMA || !isObject(x.concepts) || !isObject(x.retired)) return false;
  if (typeof x.builds !== 'number' || !Array.isArray(x.events)) return false;
  const entries = [...Object.values(x.concepts), ...Object.values(x.retired)];
  return entries.every((e) => isObject(e) && Array.isArray(e.members) && e.members.every((m) => typeof m === 'string'));
}

// -> { ledger, status: 'absent' | 'ok' | 'unreadable' }
export function readLedger(file) {
  if (!file || !fs.existsSync(file)) return { ledger: null, status: 'absent' };
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return isLedger(data) ? { ledger: data, status: 'ok' } : { ledger: null, status: 'unreadable' };
  } catch {
    return { ledger: null, status: 'unreadable' };
  }
}

// Written beside itself and renamed into place, so a crash mid-write never leaves half a ledger.
export function writeLedger(file, ledger) {
  fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(ledger, null, 1) + '\n');
  fs.renameSync(tmp, file);
}

// clusters: [{ terms: [norm…] (sorted, the smallest first), label, mint? }] in deterministic order;
//           `mint` (sorted) is what a fresh id is made from when it is not `terms`: the spellings a
//           build at the bar holds, so a below-bar spelling joining a concept never renames it.
// prior:    the ledger read from disk, or null/absent (then every cluster mints, by today's rule).
// pins:     the norms a human pinned a canonical on (iterable); strong continuity evidence.
//
// -> { ids[i], next (the ledger to write), summary {minted, reused, retired, splits, merges},
//      events (this build's split/merge/retire events, also appended to next.events),
//      concepts[i] {since, event: minted|reused|split|merged, previousLabel?} }
//
// Per cluster C, in order:
//  (a) a pinned norm in C that exactly one prior (live or retired) carries, by pin or membership,
//      names that prior;
//  (b) else the prior C continues: one whose members overlap C in more than half of C, or in more
//      than half of the prior's own members (so a concept of one spelling keeps its id when a second
//      arrives). Live priors first, then retired; several candidates: the largest overlap, ties to
//      the prior whose label C still holds, then the most recently seen, then the smaller id;
//  (c) a prior named by several clusters is a split: its id goes to the child with the largest
//      overlap, ties to the child that named it by pin, then the child holding the prior's label
//      norm, then the smaller smallest member; the other children mint with `parent`;
//  (d) no candidate: mint `c_<slugify(C[0])>` (the first of `mint` when given), `_2`, `_3`… while
//      the id is live, retired or taken this build; live priors that overlap C without continuing
//      anywhere are absorbed (a merge);
//  (e) live priors no cluster touched are retired.
export function assignIds(clusters, prior, { pins = [], now = null } = {}) {
  const base = isLedger(prior) ? prior : emptyLedger(now);
  const live = base.concepts;
  const gone = base.retired;
  const pinSet = new Set(pins instanceof Map ? pins.keys() : pins);

  // indexes: norm -> live id (disjoint), norm -> retired ids, norm -> every prior carrying it
  const liveOf = new Map();
  const retiredOf = new Map();
  const carriers = new Map();
  const carry = (norm, id) => {
    if (!carriers.has(norm)) carriers.set(norm, new Set());
    carriers.get(norm).add(id);
  };
  for (const [id, c] of Object.entries(live)) {
    for (const m of c.members) {
      if (!liveOf.has(m)) liveOf.set(m, id);
      carry(m, id);
    }
    if (c.pin) carry(c.pin, id);
  }
  for (const [id, r] of Object.entries(gone)) {
    for (const m of r.members) {
      if (!retiredOf.has(m)) retiredOf.set(m, []);
      retiredOf.get(m).push(id);
      carry(m, id);
    }
  }
  const entryOf = (id) => live[id] ?? gone[id];
  const overlapOf = (C, id) => C.filter((n) => entryOf(id).members.includes(n)).length;

  // one claim per cluster: the prior it continues, if any, and how it was found
  const claims = clusters.map((cl, i) => {
    const C = cl.terms;
    for (const norm of C) {
      if (!pinSet.has(norm)) continue;
      const ids = carriers.get(norm);
      if (ids && ids.size === 1) {
        const [id] = ids;
        return { i, prior: id, by: 'pin', overlap: overlapOf(C, id) };
      }
    }
    // (b) a prior is a candidate when the cluster mostly continues it (overlap > half of C) or it
    // mostly continues into the cluster (overlap > half of the prior's members): a one-spelling
    // concept keeps its id when a second spelling joins it. Several candidates: the largest overlap
    // keeps the id, ties to the prior whose label the cluster still holds, then the most recently
    // seen, then the smaller id; the rest are absorbed below.
    const candidates = (map) => {
      const out = new Map();
      for (const n of C) for (const id of map(n)) out.set(id, (out.get(id) ?? 0) + 1);
      return [...out].filter(([id, n]) => n > C.length / 2 || n > entryOf(id).members.length / 2);
    };
    const holdsLabel = (id) => (C.includes(normOf(entryOf(id).label ?? '')) ? 1 : 0);
    const best = (list) =>
      list.sort(
        (x, y) =>
          y[1] - x[1] ||
          holdsLabel(y[0]) - holdsLabel(x[0]) ||
          String(entryOf(y[0]).lastSeen ?? '').localeCompare(String(entryOf(x[0]).lastSeen ?? '')) ||
          (x[0] < y[0] ? -1 : 1),
      )[0];
    const fromLive = candidates((n) => (liveOf.has(n) ? [liveOf.get(n)] : []));
    const chosen = fromLive.length ? best(fromLive) : best(candidates((n) => retiredOf.get(n) ?? []));
    if (chosen) return { i, prior: chosen[0], by: 'majority', overlap: chosen[1] };
    return { i, prior: null };
  });

  // (c) a prior named by several clusters keeps its id on one child; the others become its children
  const keeperOf = new Map(); // prior id -> cluster index
  const parentOf = new Map(); // cluster index -> prior id
  const splitChildren = new Map(); // prior id -> [cluster index…]
  const byPrior = new Map();
  for (const c of claims) {
    if (!c.prior) continue;
    if (!byPrior.has(c.prior)) byPrior.set(c.prior, []);
    byPrior.get(c.prior).push(c);
  }
  for (const [id, list] of byPrior) {
    if (list.length === 1) {
      keeperOf.set(id, list[0].i);
      continue;
    }
    const labelNorm = normOf(entryOf(id).label ?? '');
    const holdsLabel = (c) => (clusters[c.i].terms.includes(labelNorm) ? 1 : 0);
    list.sort(
      (x, y) =>
        y.overlap - x.overlap ||
        (y.by === 'pin') - (x.by === 'pin') ||
        holdsLabel(y) - holdsLabel(x) ||
        (clusters[x.i].terms[0] < clusters[y.i].terms[0] ? -1 : 1),
    );
    keeperOf.set(id, list[0].i);
    for (const other of list.slice(1)) parentOf.set(other.i, id);
    splitChildren.set(id, list.map((c) => c.i));
  }

  // ids: reused first (so a mint never collides with one), then minted
  const ids = new Array(clusters.length);
  const taken = new Set([...Object.keys(live), ...Object.keys(gone)]);
  const reusedFrom = new Map(); // cluster index -> prior id it continues
  for (const c of claims) {
    if (c.prior && keeperOf.get(c.prior) === c.i) {
      ids[c.i] = c.prior;
      taken.add(c.prior);
      reusedFrom.set(c.i, c.prior);
    }
  }
  for (let i = 0; i < clusters.length; i++) {
    if (ids[i]) continue;
    const stem = `c_${slugify((clusters[i].mint ?? clusters[i].terms)[0])}`;
    let id = stem;
    for (let k = 2; taken.has(id); k++) id = `${stem}_${k}`;
    taken.add(id);
    ids[i] = id;
  }

  // (d) absorbed: a live prior that overlaps some cluster but continues nowhere, filed into the
  // cluster it overlaps most (ties: the smaller smallest member). (e) unseen: retired, no `into`.
  const absorbedInto = new Map(); // prior id -> cluster index
  const absorbedBy = new Map(); // cluster index -> [prior id…]
  for (const id of Object.keys(live)) {
    if (keeperOf.has(id)) continue;
    let best = null;
    clusters.forEach((cl, i) => {
      const o = overlapOf(cl.terms, id);
      if (o >= 1 && (!best || o > best.o)) best = { i, o };
    });
    if (!best) continue;
    absorbedInto.set(id, best.i);
    if (!absorbedBy.has(best.i)) absorbedBy.set(best.i, []);
    absorbedBy.get(best.i).push(id);
  }

  // the next ledger
  const next = {
    schema: LEDGER_SCHEMA,
    created: base.created ?? now,
    updated: now,
    builds: (base.builds ?? 0) + 1,
    concepts: {},
    retired: {},
    events: [],
  };
  const concepts = clusters.map((cl, i) => {
    const id = ids[i];
    const from = reusedFrom.has(i) ? entryOf(reusedFrom.get(i)) : null;
    const pin = cl.terms.find((n) => pinSet.has(n));
    const label = cl.label ?? cl.terms[0];
    const entry = { members: [...cl.terms], label, since: from?.since ?? now, lastSeen: now };
    if (pin) entry.pin = pin;
    const parent = parentOf.get(i) ?? from?.parent;
    if (parent) entry.parent = parent;
    next.concepts[id] = entry;
    const event = absorbedBy.has(i) ? 'merged' : parentOf.has(i) || (from && splitChildren.has(ids[i])) ? 'split' : from ? 'reused' : 'minted';
    const note = { since: entry.since, event };
    if (from && from.label !== undefined && from.label !== label) note.previousLabel = from.label;
    return note;
  });

  let retiredNow = 0;
  for (const [id, c] of Object.entries(live)) {
    if (keeperOf.has(id)) continue;
    const r = { members: c.members, label: c.label, since: c.since, lastSeen: c.lastSeen };
    if (absorbedInto.has(id)) r.into = ids[absorbedInto.get(id)];
    next.retired[id] = r;
    retiredNow += 1;
  }
  for (const [id, r] of Object.entries(gone)) if (!keeperOf.has(id)) next.retired[id] = r;

  const events = [];
  for (const [id, children] of splitChildren) events.push({ type: 'split', at: now, parent: id, children: children.map((i) => ids[i]) });
  for (const [i, parents] of absorbedBy) {
    const all = reusedFrom.has(i) ? [reusedFrom.get(i), ...parents] : parents;
    events.push({ type: 'merge', at: now, parents: all, child: ids[i] });
  }
  const unseen = Object.keys(live).filter((id) => !keeperOf.has(id) && !absorbedInto.has(id));
  if (unseen.length) events.push({ type: 'retire', at: now, ids: unseen });
  next.events = [...(Array.isArray(base.events) ? base.events : []), ...events].slice(-MAX_EVENTS);

  const summary = {
    minted: ids.filter((_, i) => !reusedFrom.has(i)).length,
    reused: reusedFrom.size,
    retired: retiredNow,
    splits: splitChildren.size,
    merges: absorbedBy.size,
  };
  return { ids, next, summary, events, concepts };
}
