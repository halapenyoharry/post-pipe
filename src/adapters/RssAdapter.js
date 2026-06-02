// RssAdapter — RSS 2.0 and RSS 1.0 (RDF) fetcher + normalizer.
// Emits JSON Feed 1.1 items.

const { XMLParser } = require('fast-xml-parser');
const { fetchText } = require('./fetchText');

const ID = 'rss';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  trimValues: true,
  isArray: (name) => name === 'item',
});

async function load(config) {
  const { id, title, xmlUrl } = config;
  const xml = await fetchText(xmlUrl);
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
    },
  };
}

function normalizeItem(it) {
  const url = it.link || it.guid?.['#text'] || it.guid || '';
  const id  = (typeof it.guid === 'object' ? it.guid['#text'] : it.guid) || url;
  const description = stripCdata(it.description || it['content:encoded'] || '');
  const summary = description.replace(/<[^>]+>/g, '').slice(0, 400);
  const author = (typeof it['dc:creator'] === 'string' ? it['dc:creator']
                : typeof it.author === 'string' ? it.author : '') || '';

  return {
    id,
    url,
    title: stripCdata(it.title || ''),
    short_title: '',
    summary,
    tldr: summary,
    image: extractImage(it),
    content_html: it['content:encoded'] || it.description || null,
    date_published: parseDate(it.pubDate || it['dc:date']),
    tags: extractCategories(it.category),
    authors: author ? [{ name: author }] : [],
    canonical_url: url,
    kind: 'text',
  };
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
