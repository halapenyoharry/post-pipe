// cardSlug.js — a card's slug: discovered from what the piece already carries,
// derived from the title only when nothing else exists, and once written to
// the site's cards ledger never changed by the engine (issue #19).
//
// Discovery order (discoverSlug): a canonical the feed gives (canonical_url
// when it differs from url, else a <link rel="canonical"> in the item's
// HTML); a DOI (a doi field, or a DOI inside the canonical, url or id); the
// slug part of the url's path (a numeric segment is fine: the path is the
// identity); and only then the title. Each result says which it came from.
//
// The ledger (settings.cards.ledger, cards.json in the site by default,
// provisional) maps slug -> { urls, titles, firstSeen, source }. A build
// reads it, adds the cards it does not hold, appends urls and titles newly
// seen for a known card, and never rewrites a slug. A new card whose slug is
// already another card's gets a plain suffix (-2, -3, …) on first sight, and
// that is frozen too. The slug is not for merging: two items with one
// identity both show, carrying the same slug (Harold, 2026-11-04).
//
// Nothing here changes an item's id; downstream keeps using what it uses.

const fs   = require('fs');
const os   = require('os');
const path = require('path');

const LEDGER_SCHEMA = 'post-pipe/cards@1';
const LEDGER_FILE   = 'cards.json';

const isObject = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);
const str = (v) => (typeof v === 'string' ? v.trim() : '');

// Letters of any script, digits, and . _ ~ - stay; everything else becomes
// one hyphen; nothing leads or trails.
function slugify(s) {
  return String(s ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}._~-]+/gu, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[-._~]+|[-._~]+$/g, '');
}

// A DOI inside a string: bare, after "doi:", or in a doi.org address.
function doiIn(s) {
  const v = str(s);
  if (!v) return null;
  const m = v.match(/(?:doi\.org\/|doi:\s*|^|[\s(])(10\.\d{4,9}\/[^\s"'<>]+)/i);
  return m ? m[1].replace(/[.,;:)\]]+$/, '').toLowerCase() : null;
}

// The last part of a url's path, without query, fragment, trailing slashes
// or an .html/.htm ending, percent-decoded. '' when the path has no part.
function lastPathPart(u) {
  let s = str(u).split('#')[0].split('?')[0].replace(/\/+$/, '');
  if (!s) return '';
  // A bare scheme and host has no path part.
  const m = s.match(/^[a-z][a-z0-9+.-]*:\/\/([^/]*)(.*)$/i);
  if (m && !m[2]) return '';
  s = s.split('/').pop();
  try { s = decodeURIComponent(s); } catch (_) { /* as written */ }
  return s.replace(/\.html?$/i, '');
}

// A canonical the item carries that is not just its own url.
function canonicalOf(item) {
  const url = str(item.url);
  const c = str(item.canonical_url);
  if (c && c !== url) return c;
  const html = typeof item.content_html === 'string' ? item.content_html : '';
  const m = html.match(/<link\b[^>]*\brel=["']?canonical["']?[^>]*\bhref=["']([^"']+)["']/i)
    || html.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']?canonical["']?/i);
  if (m && str(m[1]) && str(m[1]) !== url) return str(m[1]);
  return '';
}

function doiOf(item, canonical) {
  for (const f of [item.doi, item._doi, canonical, item.url, item.external_url, item.id]) {
    const d = doiIn(f);
    if (d) return d;
  }
  return null;
}

// -> { slug, source: 'canonical' | 'doi' | 'url' | 'title', identity }
// identity is the value the slug was read from (the canonical address, the
// DOI, the url or id, or the title).
function discoverSlug(item) {
  const it = isObject(item) ? item : {};
  const canonical = canonicalOf(it);
  const doi = doiOf(it, canonical);
  // A canonical that is itself a DOI address is the DOI: its whole name is
  // the identity, not the last part of its path.
  if (canonical && !doiIn(canonical)) {
    const slug = slugify(lastPathPart(canonical));
    if (slug) return { slug, source: 'canonical', identity: canonical };
  }
  if (doi) return { slug: slugify(doi), source: 'doi', identity: doi };
  const u = str(it.url) || str(it.id);
  if (u) {
    const slug = slugify(lastPathPart(u));
    if (slug) return { slug, source: 'url', identity: u };
  }
  const title = str(it.title);
  return { slug: slugify(title) || 'untitled', source: 'title', identity: title };
}

// ─── The ledger ──────────────────────────────────────────────────────────────

function emptyLedger(now = null) {
  return { schema: LEDGER_SCHEMA, created: dateOf(now), cards: {} };
}

// The build's calendar date, YYYY-MM-DD: a Date (or nothing) is read in the
// machine's own time zone, so an evening build is dated the day it was made;
// a string is taken as written.
function dateOf(now) {
  if (typeof now === 'string' && now.trim()) return now.trim().slice(0, 10);
  const d = now instanceof Date ? now : new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// A ledger is one of ours, every card carrying its lists. Anything else is
// unreadable: the caller warns once, builds as if there were none, and
// leaves the file alone.
function isLedger(x) {
  if (!isObject(x) || x.schema !== LEDGER_SCHEMA || !isObject(x.cards)) return false;
  return Object.values(x.cards).every((c) => isObject(c)
    && Array.isArray(c.urls) && c.urls.every((u) => typeof u === 'string')
    && Array.isArray(c.titles) && c.titles.every((t) => typeof t === 'string')
    && typeof c.source === 'string');
}

// -> { ledger, status: 'absent' | 'ok' | 'unreadable' }
function readLedger(file) {
  if (!file || !fs.existsSync(file)) return { ledger: null, status: 'absent' };
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return isLedger(data) ? { ledger: data, status: 'ok' } : { ledger: null, status: 'unreadable' };
  } catch (_) {
    return { ledger: null, status: 'unreadable' };
  }
}

// Written beside itself and renamed into place, so a crash mid-write never
// leaves half a ledger.
function writeLedger(file, ledger) {
  fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(ledger, null, 2) + '\n');
  fs.renameSync(tmp, file);
}

// The addresses an item answers to, in the order they are looked up: the
// canonical or DOI discovery read, its url, its DOI as an address, its id.
function addressesOf(item, found) {
  const out = [];
  const add = (v) => { const s = str(v); if (s && !out.includes(s)) out.push(s); };
  if (found.source === 'canonical') add(found.identity);
  if (found.source === 'doi') add(`https://doi.org/${found.identity}`);
  add(item.url);
  const c = canonicalOf(item);
  if (c) add(c);
  const d = doiOf(item, c);
  if (d) add(`https://doi.org/${d}`);
  add(item.id);
  return out;
}

// Gives every item its slug and slugSource, from the ledger when it holds the
// card, else by discovery (suffixed when the slug is another card's), and
// returns the ledger to write. Items are changed in place.
// -> { ledger (next), changed, summary: { known, added, suffixed } }
function assignSlugs(items, prior, { now = null } = {}) {
  const base = isLedger(prior) ? prior : emptyLedger(now);
  const next = { schema: LEDGER_SCHEMA, created: base.created || dateOf(now), cards: {} };
  for (const [slug, card] of Object.entries(base.cards)) {
    next.cards[slug] = {
      ...card,
      urls: [...card.urls],
      titles: [...card.titles],
      ...(Array.isArray(card.ids) ? { ids: [...card.ids] } : {}),
    };
  }
  const byAddress = new Map(); // address -> slug
  const byTitle = new Map();   // title -> slug, for cards whose only identity is their title
  const index = (slug, card) => {
    for (const u of card.urls) if (!byAddress.has(u)) byAddress.set(u, slug);
    for (const i of card.ids || []) if (!byAddress.has(i)) byAddress.set(i, slug);
    if (card.source === 'title') for (const t of card.titles) if (!byTitle.has(t)) byTitle.set(t, slug);
  };
  for (const [slug, card] of Object.entries(next.cards)) index(slug, card);

  const summary = { known: 0, added: 0, suffixed: 0 };
  const today = dateOf(now);
  for (const item of Array.isArray(items) ? items : []) {
    if (!isObject(item)) continue;
    const found = discoverSlug(item);
    const addresses = addressesOf(item, found);
    const title = str(item.title);
    let slug = null;
    for (const a of addresses) { if (byAddress.has(a)) { slug = byAddress.get(a); break; } }
    if (!slug && !addresses.length && title && byTitle.has(title)) slug = byTitle.get(title);

    if (slug) {
      summary.known += 1;
      const card = next.cards[slug];
      for (const a of addresses) {
        if (card.urls.includes(a) || (card.ids || []).includes(a)) continue;
        if (a === str(item.id) && a !== str(item.url)) { card.ids = card.ids || []; card.ids.push(a); }
        else card.urls.push(a);
      }
      if (title && !card.titles.includes(title)) card.titles.push(title);
    } else {
      summary.added += 1;
      slug = found.slug;
      if (next.cards[slug]) {
        let k = 2;
        while (next.cards[`${found.slug}-${k}`]) k += 1;
        slug = `${found.slug}-${k}`;
        summary.suffixed += 1;
      }
      const id = str(item.id);
      const urls = addresses.filter((a) => !(a === id && a !== str(item.url)));
      const ids = addresses.filter((a) => a === id && a !== str(item.url));
      const card = { urls, titles: title ? [title] : [], firstSeen: today, source: found.source };
      if (ids.length) card.ids = ids;
      if (slug !== found.slug) card.disambiguatedFrom = found.slug;
      next.cards[slug] = card;
    }
    index(slug, next.cards[slug]);
    item.slug = slug;
    item.slugSource = next.cards[slug].source;
  }

  const changed = !isLedger(prior) || JSON.stringify(prior) !== JSON.stringify(next);
  return { ledger: next, changed, summary };
}

// Where the site keeps its cards ledger (settings.cards.ledger): a path
// relative to the site, cards.json by default; false keeps no ledger (slugs
// are still discovered, just not frozen). -> absolute path, or null.
function cardsLedgerPath(settings, siteRoot) {
  const cards = settings && isObject(settings.cards) ? settings.cards : {};
  if (cards.ledger === false) return null;
  const p = str(cards.ledger) || LEDGER_FILE;
  if (path.isAbsolute(p)) return p;
  if (p === '~' || p.startsWith('~/')) return path.join(os.homedir(), p.slice(1));
  return path.resolve(siteRoot || '.', p);
}

module.exports = {
  LEDGER_SCHEMA, LEDGER_FILE,
  slugify, doiIn, lastPathPart, discoverSlug,
  emptyLedger, isLedger, readLedger, writeLedger, assignSlugs, cardsLedgerPath,
};
