// Copies of fetched feeds, for a build whose fetch fails. Two kinds, each a
// JSON file { url, fetchedAt, body }, body the raw text of a fetch whose text
// parsed:
//
//   the engine's last good copy  kept by every build in the engine's own
//       .feed-cache/last-good/ (beside colors.json, ignored by git), one file
//       per feed address, named by a hash of it, replaced after each good
//       fetch. Two sites that list the same address share it: it is the same
//       feed. A fresh clone, a fresh worktree or a new machine has none.
//   the site's saved copy  a file in the site's own folder, named on the
//       feed's outline in feeds.opml (savedCopy="saved/feed.json", relative
//       to the site), shipped with the site. An ordinary build never writes
//       it, since that would change the site's git on every build; it is
//       written only when the build is asked to (node generate-index.js
//       --save-copies), from that build's own good fetch.
//
// A build whose fetch fails takes the newer of the two by fetchedAt
// (copiesNewestFirst), and the source in feed.json says which it was
// (copyFrom: 'engine' or 'site'). Nothing here fetches; the aggregator
// (src/aggregator.js) keeps the engine's copy after a fetch its adapter
// parsed, and reads the copies after a fetch that failed.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// The engine's folder, wherever the build is run from.
const ENGINE_ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_DIR = path.join(ENGINE_ROOT, '.feed-cache', 'last-good');

function copyFile(url, dir = DEFAULT_DIR) {
  const hash = crypto.createHash('sha256').update(String(url)).digest('hex').slice(0, 24);
  return path.join(dir, `${hash}.json`);
}

// The copy kept for an address, { url, fetchedAt, body }, or null for none
// (or one that cannot be read).
function readLastGood(url, dir = DEFAULT_DIR) {
  if (!url) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(copyFile(url, dir), 'utf8'));
    if (!raw || raw.url !== url || typeof raw.body !== 'string') return null;
    return { url: raw.url, fetchedAt: typeof raw.fetchedAt === 'string' ? raw.fetchedAt : null, body: raw.body };
  } catch (_) {
    return null;
  }
}

// Writes { url, fetchedAt, body } to file, replacing what was there. Written
// beside and then moved into place, so a build stopped halfway never leaves
// half a copy. False when it could not be written (the build goes on
// without it).
function writeCopy(file, url, body, fetchedAt) {
  const tmp = `${file}.${process.pid}.tmp`;
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(tmp, JSON.stringify({ url, fetchedAt, body }));
    fs.renameSync(tmp, file);
    return true;
  } catch (err) {
    console.warn(`[aggregator] could not keep a copy of ${url} in ${file}: ${err.message}`);
    try { fs.unlinkSync(tmp); } catch (_) { /* nothing was written */ }
    return false;
  }
}

// Keeps body as the address's last good copy, fetched at fetchedAt (an ISO
// date), replacing the one before.
function writeLastGood(url, body, fetchedAt, dir = DEFAULT_DIR) {
  if (!url || typeof body !== 'string') return false;
  return writeCopy(copyFile(url, dir), url, body, fetchedAt);
}

// The site's saved copy in file (an absolute path, the outline's savedCopy
// resolved against the site), { url, fetchedAt, body }, or null for none (or
// one that cannot be read). Its url says where it was fetched from; the
// build uses it for the outline that names it whatever that says.
function readSavedCopy(file) {
  if (!file) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!raw || typeof raw.body !== 'string') return null;
    return {
      url: typeof raw.url === 'string' ? raw.url : null,
      fetchedAt: typeof raw.fetchedAt === 'string' ? raw.fetchedAt : null,
      body: raw.body,
    };
  } catch (_) {
    return null;
  }
}

// Writes the site's saved copy, only when the build was asked to
// (--save-copies), from that build's good fetch of url.
function writeSavedCopy(file, url, body, fetchedAt) {
  if (!file || !url || typeof body !== 'string') return false;
  return writeCopy(file, url, body, fetchedAt);
}

// The copies a failed fetch can fall back on, newest first by fetchedAt,
// each with from: 'engine' (the engine's last good copy) or 'site' (the
// site's saved copy). A copy with no readable date comes after a dated one;
// two copies of the same date (or two undated ones) keep the engine's
// first. Empty when there is neither.
function copiesNewestFirst(engineCopy, siteCopy) {
  const dated = (c) => {
    const t = c && typeof c.fetchedAt === 'string' ? Date.parse(c.fetchedAt) : NaN;
    return Number.isFinite(t) ? t : -Infinity;
  };
  const copies = [
    siteCopy ? { ...siteCopy, from: 'site' } : null,
    engineCopy ? { ...engineCopy, from: 'engine' } : null,
  ].filter(Boolean);
  // A stable sort: equal dates keep the site's copy first, since after
  // --save-copies the two are one fetch and the site's is the one a reader
  // can be told about.
  return copies.sort((a, b) => dated(b) - dated(a) || 0);
}

module.exports = {
  DEFAULT_DIR,
  copyFile,
  readLastGood,
  writeLastGood,
  readSavedCopy,
  writeSavedCopy,
  copiesNewestFirst,
};
