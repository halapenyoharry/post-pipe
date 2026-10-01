// Contributions — what readers bring to a piece, kept apart from the piece.
//
// The canon is written by one hand and versioned by its history; a
// contribution is written by someone else, arrives at any time, and can be
// moderated, attributed and taken down. So contributions live in their own
// file (settings.contributions.src, default ./contributions.json), never in
// feed.json and never in the text, and they are drawn as their own marks.
//
// A contribution:
//   { id, type: 'essay' | 'comment' | 'art' | 'connection',
//     author, created, status, test?,
//     anchor: { chapter, exact?, prefix?, suffix? },
//     to?    (connection: the other chapter),
//     title? (an essay's title),
//     body?  (plain text; never HTML),
//     asset? (art: a path inside the site's own asset store),
//     alt?   (art: what the picture shows) }
//
// Only status "approved" is shown. Test items ("test": true) only with
// settings.contributions.showTest.

const TYPES = ['essay', 'comment', 'art', 'connection'];

const DEFAULTS = {
  src: './contributions.json',
  submit: false,
  showTest: false,
  endpoint: './api/contributions',
  assetBase: './contributions/assets/',
  limits: { name: 60, body: 8000, exact: 400 },
};

// settings.contributions, filled with the engine's defaults. null when the
// site has no contributions at all, so a page without them asks for nothing.
function contributionsConfig(settings) {
  const c = settings && settings.contributions;
  if (!c || c.enabled === false) return null;
  const o = typeof c === 'object' ? c : {};
  return {
    ...DEFAULTS,
    ...o,
    submit: o.submit === true,
    showTest: o.showTest === true,
    limits: { ...DEFAULTS.limits, ...(o.limits || {}) },
  };
}

// A chapter id: the piece's slug, the last part of its url without .html.
// Also accepted: the item's own id (a full url for local content).
function slugOf(item) {
  const u = (item && (item.url || item.id)) || '';
  return String(u).split('/').pop().replace(/\.html?$/, '');
}

function chapterIndex(items) {
  const bySlug = new Map();
  for (const it of items || []) {
    bySlug.set(slugOf(it), it);
    if (it.id) bySlug.set(String(it.id), it);
  }
  return bySlug;
}

const str = (v) => (typeof v === 'string' ? v : '');

// An art asset must be a plain relative path inside the asset store: no
// scheme, no host, no leading slash, no way up, and a raster image type.
// SVG is left out because it can carry script.
function isOwnAsset(asset) {
  const a = str(asset);
  if (!a || a.length > 200) return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(a) || a.startsWith('/') || a.startsWith('\\')) return false;
  if (a.split(/[\\/]/).some((p) => p === '..' || p === '.' || p === '')) return false;
  return /^[A-Za-z0-9][A-Za-z0-9/_-]*\.(png|jpe?g|webp|gif|avif)$/i.test(a);
}

function assetUrl(asset, cfg) {
  const base = (cfg && cfg.assetBase) || DEFAULTS.assetBase;
  return base.replace(/\/?$/, '/') + asset;
}

// The contributions a page shows: well formed, approved, attached to a
// chapter that exists, test items only when asked for. Everything else is
// dropped quietly; nothing a contributor wrote is trusted to be well formed.
function visibleContributions(data, { items, showTest = false } = {}) {
  const list = Array.isArray(data) ? data : (data && Array.isArray(data.contributions) ? data.contributions : []);
  const chapters = items ? chapterIndex(items) : null;
  const known = (id) => !chapters || chapters.has(str(id));
  const out = [];
  const seen = new Set();
  for (const c of list) {
    if (!c || typeof c !== 'object') continue;
    if (c.status !== 'approved') continue;
    if (c.test === true && !showTest) continue;
    if (!TYPES.includes(c.type)) continue;
    const id = str(c.id);
    if (!id || seen.has(id)) continue;
    const anchor = c.anchor && typeof c.anchor === 'object' ? c.anchor : {};
    const chapter = str(anchor.chapter);
    if (!chapter || !known(chapter)) continue;
    if (c.type === 'connection' && (!str(c.to) || !known(c.to) || str(c.to) === chapter)) continue;
    if (c.type === 'art' && !isOwnAsset(c.asset)) continue;
    if (c.type !== 'art' && !str(c.body).trim()) continue;
    seen.add(id);
    const canonical = (cid) => (chapters ? slugOf(chapters.get(cid)) : cid);
    out.push({
      id,
      type: c.type,
      author: str(c.author).trim() || 'A reader',
      created: str(c.created),
      test: c.test === true,
      chapter: canonical(chapter),
      to: c.type === 'connection' ? canonical(str(c.to)) : null,
      quote: str(anchor.exact).trim()
        ? { exact: str(anchor.exact), prefix: str(anchor.prefix), suffix: str(anchor.suffix) }
        : null,
      title: str(c.title).trim().slice(0, 140),
      body: str(c.body),
      asset: c.type === 'art' ? c.asset : null,
      alt: str(c.alt),
    });
  }
  return out;
}

// What belongs to one chapter: anything anchored there, and a connection
// from either end.
function forChapter(list, chapter) {
  return (list || []).filter((c) => c.chapter === chapter || (c.type === 'connection' && c.to === chapter));
}

// How many marks a chapter's node carries.
function countsByChapter(list) {
  const counts = new Map();
  const add = (k) => counts.set(k, (counts.get(k) || 0) + 1);
  for (const c of list || []) {
    add(c.chapter);
    if (c.type === 'connection' && c.to) add(c.to);
  }
  return counts;
}

// The readers' edge layer: one edge per connection, never mixed with the
// canon's edges.
function connectionEdges(list) {
  return (list || []).filter((c) => c.type === 'connection').map((c) => ({
    id: c.id, source: c.chapter, target: c.to, layer: 'contribution', label: c.body, author: c.author,
  }));
}

// ── Text-quote anchors ──────────────────────────────────────────────────────
// A passage is found by its exact words in the current text, with a few words
// before and after to tell repeats apart. Whitespace is compared loosely, so
// a re-wrapped paragraph still matches. When the passage is gone, or appears
// more than once and its context cannot decide, there is no answer: the
// contribution falls back to its chapter rather than point at the wrong place.

const squash = (s) => String(s || '').replace(/\s+/g, ' ');

function allIndexes(hay, needle) {
  const out = [];
  if (!needle) return out;
  let i = hay.indexOf(needle);
  while (i !== -1) { out.push(i); i = hay.indexOf(needle, i + 1); }
  return out;
}

// paragraphs: the texts of the chapter's paragraphs, in order.
// Returns { para, offset, length } or null.
function resolveQuote(paragraphs, quote) {
  if (!quote || !squash(quote.exact).trim()) return null;
  const exact = squash(quote.exact).trim();
  const prefix = squash(quote.prefix).trim();
  const suffix = squash(quote.suffix).trim();
  const texts = (paragraphs || []).map((p) => squash(p));
  // One string with a known start for each paragraph; a passage may not
  // cross from one paragraph into the next.
  const starts = [];
  let whole = '';
  texts.forEach((t, i) => { starts.push(whole.length); whole += t + (i < texts.length - 1 ? '\n' : ''); });
  const hits = allIndexes(whole, exact).filter((i) => !whole.slice(i, i + exact.length).includes('\n'));
  if (!hits.length) return null;
  const score = (i) => {
    let s = 0;
    if (prefix && whole.slice(Math.max(0, i - prefix.length - 2), i).replace(/\n/g, ' ').trim().endsWith(prefix)) s += 1;
    if (suffix && whole.slice(i + exact.length, i + exact.length + suffix.length + 2).replace(/\n/g, ' ').trim().startsWith(suffix)) s += 1;
    return s;
  };
  let pick = hits[0];
  if (hits.length > 1) {
    const scored = hits.map((i) => ({ i, s: score(i) })).sort((a, b) => b.s - a.s);
    if (scored[0].s === 0 || scored[0].s === scored[1].s) return null;
    pick = scored[0].i;
  }
  let para = 0;
  while (para + 1 < starts.length && starts[para + 1] <= pick) para++;
  return { para, offset: pick - starts[para], length: exact.length };
}

// An essay's text as paragraphs, split on blank lines. Text only: the caller
// renders each as a text node, so nothing in it is ever read as markup.
function paragraphsOf(body) {
  return String(body || '').replace(/\r\n?/g, '\n').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

// ── Submissions ─────────────────────────────────────────────────────────────
// What the reader's form sends. The server checks all of it again; this is
// so the form can say what is wrong before sending.

// A passage the reader selected, with a few words either side.
function quoteFromSelection(text, start, end, words = 5) {
  const t = String(text || '');
  const exact = t.slice(start, end).trim();
  if (!exact) return null;
  const before = t.slice(0, start).trim().split(/\s+/).filter(Boolean);
  const after = t.slice(end).trim().split(/\s+/).filter(Boolean);
  return { exact, prefix: before.slice(-words).join(' '), suffix: after.slice(0, words).join(' ') };
}

function checkSubmission(s, cfg) {
  const limits = { ...DEFAULTS.limits, ...((cfg && cfg.limits) || {}) };
  const errors = [];
  const name = str(s && s.author).trim();
  const type = str(s && s.type);
  const body = str(s && s.body);
  if (!name) errors.push('A name to show is needed.');
  if (name.length > limits.name) errors.push(`The name can be at most ${limits.name} characters.`);
  if (!['essay', 'comment', 'connection'].includes(type)) errors.push('Choose essay, comment or connection.');
  if (!body.trim()) errors.push('Write something first.');
  if (body.length > limits.body) errors.push(`At most ${limits.body} characters.`);
  const anchor = (s && s.anchor) || {};
  if (!str(anchor.chapter)) errors.push('Which chapter is this about?');
  if (anchor.exact && str(anchor.exact).length > limits.exact) errors.push(`The passage can be at most ${limits.exact} characters.`);
  if (type === 'connection' && (!str(s.to) || s.to === anchor.chapter)) errors.push('Choose the other chapter.');
  return errors;
}

module.exports = {
  TYPES,
  DEFAULTS,
  contributionsConfig,
  slugOf,
  isOwnAsset,
  assetUrl,
  visibleContributions,
  forChapter,
  countsByChapter,
  connectionEdges,
  resolveQuote,
  paragraphsOf,
  quoteFromSelection,
  checkSubmission,
};
