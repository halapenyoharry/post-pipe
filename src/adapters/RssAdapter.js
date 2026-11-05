// RssAdapter — RSS 2.0 and RSS 1.0 (RDF) fetcher + normalizer.
// Emits JSON Feed 1.1 items.

const { XMLParser } = require('fast-xml-parser');
const { fetchText } = require('./fetchText');
const { decodeHtmlEntities } = require('../lib/htmlEntities');

const ID = 'rss';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  trimValues: true,
  isArray: (name) => name === 'item',
});

// deps.fetchText: how the feed's text is fetched (the aggregator passes one
// that remembers the text, or one that hands back the feed's last good copy
// after a failed fetch); the plain one by default.
async function load(config, { fetchText: fetchFeed = fetchText } = {}) {
  const { id, title, xmlUrl } = config;
  const xml = await fetchFeed(xmlUrl);
  const doc = parser.parse(xml);

  // RSS 2.0: <rss><channel><item>…
  // RSS 1.0: <rdf:RDF><channel/><item/>…
  const channel = doc?.rss?.channel || doc?.['rdf:RDF']?.channel || null;
  const rawItems =
    (doc?.rss?.channel?.item) ||
    (doc?.['rdf:RDF']?.item) ||
    [];

  if (!channel) throw new Error(`RssAdapter: no channel found in ${xmlUrl}`);

  const items = rawItems.map(normalizeItem);

  return {
    items,
    feedMeta: {
      id: id || channel.link || xmlUrl,
      title: title || channel.title || xmlUrl,
      home_page_url: channel.link || null,
      // <image><url/></image> per RSS 2.0
      favicon: channel.image?.url || null,
      icon: channel.image?.url || null,
      // The feed's own date for itself: <lastBuildDate>, else the channel's
      // <pubDate> (RSS 2.0), else its <dc:date> (RSS 1.0); null when it
      // gives none that reads as a date.
      feedUpdated: feedUpdated(channel),
    },
  };
}

function feedUpdated(channel) {
  for (const v of [channel.lastBuildDate, channel.pubDate, channel['dc:date']]) {
    const d = parseDate(typeof v === 'string' ? v : (v && typeof v === 'object' ? v['#text'] : v));
    if (d) return d;
  }
  return null;
}

function normalizeItem(it) {
  const url = it.link || it.guid?.['#text'] || it.guid || '';
  const id  = (typeof it.guid === 'object' ? it.guid['#text'] : it.guid) || url;
  const description = stripCdata(it.description || it['content:encoded'] || '');
  // Text fields (title, summary, author) are shown as text, so the HTML
  // character references a feed leaves in them are decoded here, once.
  // content_html stays as it came: it is HTML and keeps its own entities.
  const summary = decodeHtmlEntities(description.replace(/<[^>]+>/g, '')).slice(0, 400);
  const author = decodeHtmlEntities((typeof it['dc:creator'] === 'string' ? it['dc:creator']
                : typeof it.author === 'string' ? it.author : '') || '');
  const image = extractImage(it);
  const tags  = extractCategories(it.category);
  // What the item carries of its own identity, kept for the card's slug
  // (src/lib/cardSlug.js): an <atom:link rel="canonical">, and a DOI in
  // <prism:doi> or <dc:identifier>.
  const canonical = canonicalLink(it['atom:link']);
  const doi = doiOf(it['prism:doi']) || doiOf(it['dc:identifier']);

  return {
    id,
    url,
    title: decodeHtmlEntities(stripCdata(it.title || '')),
    short_title: '',
    summary,
    tldr: summary,
    image,
    content_html: it['content:encoded'] || it.description || null,
    date_published: parseDate(it.pubDate || it['dc:date']),
    tags,
    authors: author ? [{ name: author }] : [],
    canonical_url: canonical || url,
    ...(doi ? { doi } : {}),
    kind: 'text',
    attachments: image ? [{ url: image, mime_type: 'image/*', _role: 'cover' }] : [],
    _references: tags.map(value => ({ type: 'tag', value })),
  };
}

// An <atom:link rel="canonical" href="…"> on the item, when it has one.
function canonicalLink(links) {
  if (!links) return '';
  const arr = Array.isArray(links) ? links : [links];
  const c = arr.find(l => l && typeof l === 'object' && l['@_rel'] === 'canonical' && l['@_href']);
  return c ? String(c['@_href']).trim() : '';
}

// A DOI in a field (bare, "doi:…" or a doi.org address); '' when none.
function doiOf(v) {
  const s = typeof v === 'string' ? v : (v && typeof v === 'object' && typeof v['#text'] === 'string' ? v['#text'] : '');
  const m = s.match(/(?:doi\.org\/|doi:\s*|^|[\s(])(10\.\d{4,9}\/[^\s"'<>]+)/i);
  return m ? m[1].replace(/[.,;:)\]]+$/, '') : '';
}

function stripCdata(s) {
  if (typeof s !== 'string') return '';
  return s.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();
}

function extractImage(it) {
  // RSS feeds dump cover images in a dozen ways. Try the common ones.
  if (it['media:content']?.['@_url']) return it['media:content']['@_url'];
  if (it['media:thumbnail']?.['@_url']) return it['media:thumbnail']['@_url'];
  if (it.enclosure?.['@_type']?.startsWith('image/') && it.enclosure['@_url']) {
    return it.enclosure['@_url'];
  }
  // Cheap regex on the HTML body — first <img src="…">.
  const html = it['content:encoded'] || it.description || '';
  const m = typeof html === 'string' && html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : '';
}

function extractCategories(cat) {
  if (!cat) return [];
  if (Array.isArray(cat)) return cat.map(c => typeof c === 'string' ? c : c?.['#text'] || '').filter(Boolean);
  if (typeof cat === 'string') return [cat];
  return cat['#text'] ? [cat['#text']] : [];
}

function parseDate(s) {
  if (!s) return undefined;
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

module.exports = { id: ID, load };
