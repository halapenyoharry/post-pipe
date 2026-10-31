// The last good copy of each fetched feed: the raw text of the last fetch of
// its address that parsed, kept in the engine's own .feed-cache/last-good/
// (beside colors.json, ignored by git; never in a site folder), so a build
// whose fetch fails can still show that feed's cards from it. One file per
// feed address, named by a hash of it: { url, fetchedAt, body }.
//
// Two sites that list the same address share its copy: it is the same feed.
// Nothing here fetches; the aggregator (src/aggregator.js) saves a copy after
// a fetch whose text its adapter parsed, and reads one after a fetch that
// failed.

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

// Keeps body as the address's copy, fetched at fetchedAt (an ISO date),
// replacing the one before. Written beside and then moved into place, so a
// build stopped halfway never leaves half a copy. False when it could not be
// written (the build goes on without it).
function writeLastGood(url, body, fetchedAt, dir = DEFAULT_DIR) {
  if (!url || typeof body !== 'string') return false;
  const file = copyFile(url, dir);
  const tmp = `${file}.${process.pid}.tmp`;
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(tmp, JSON.stringify({ url, fetchedAt, body }));
    fs.renameSync(tmp, file);
    return true;
  } catch (err) {
    console.warn(`[aggregator] could not keep a copy of ${url}: ${err.message}`);
    try { fs.unlinkSync(tmp); } catch (_) { /* nothing was written */ }
    return false;
  }
}

module.exports = { DEFAULT_DIR, copyFile, readLastGood, writeLastGood };
