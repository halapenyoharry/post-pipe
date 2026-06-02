// LocalFolderAdapter — produces JSON Feed items from a user-pointed content
// folder (default: ~/Posts/).
//
// Wraps the lower-level folder walker in ingest.js (which produces project-
// specific `Content` objects) and turns those into normalized JSON Feed
// items, copying cover images into the site's covers/ directory as a side
// effect.
//
// This adapter is the local source. It's a peer of RssAdapter, AtomAdapter,
// etc. — the aggregator treats them all the same.

const fs   = require('fs');
const path = require('path');

const { ingestFolder } = require('../../ingest');

const ID = 'local';

/**
 * @param {{
 *   id: string,            // OPML xmlUrl, e.g. 'local://~/Posts'
 *   title: string,         // display name for the feed
 *   path: string,          // filesystem path or ~/-prefixed
 *   pagesBase: string,     // canonical site URL (for generating per-item URLs)
 *   coversDir: string      // where to copy cover images for the static site
 * }} config
 * @returns {Promise<{items, feedMeta}>}
 */
async function load(config) {
  const { id, title, path: rootPath, pagesBase, coversDir } = config;

  if (!fs.existsSync(coversDir)) {
    fs.mkdirSync(coversDir, { recursive: true });
  }

  const { contents } = ingestFolder(rootPath);
  const items = contents.map(c => contentToItem(c, rootPath, pagesBase, coversDir));

  return {
    items,
    feedMeta: {
      id,
      title,
      home_page_url: pagesBase,
    },
  };
}

// Turn one Content object into a JSON Feed 1.1 item with the project's
// existing extension fields. Field shapes match the legacy output exactly
// so this adapter is a drop-in for the inlined loadLocalContent() that
// used to live in generate-index.js.
function contentToItem(c, rootPath, pagesBase, coversDir) {
  const imageUrl = copyCoverIfPresent(c, rootPath, coversDir);
  const pagesUrl = `${pagesBase}/${c.id}.html`;
  const bucket   = statusBucket(c);

  return {
    id: pagesUrl,
    url: pagesUrl,
    title: c.title,
    short_title: c.short_title || '',
    summary: c.summary || '',
    tldr: c.summary || '',
    image: imageUrl,
    date_published: c.written ? toIsoDate(c.written) : undefined,
    reading_time: c.reading_time || '',
    tags: c.tags || [],
    series: c.series || '',
    series_part: c.series_part || null,
    license: c.license || '',
    canonical_url: c.syndication?.canonical || pagesUrl,
    syndication: c.syndication || {},
    _status: bucket,
    // Project schema fields the graph and TextView consume. (Underscore-
    // prefixing of these to match JSON Feed extension conventions is a
    // separate, breaking refactor — see plan step 7.)
    kind: c.kind,
    substrate: c.substrate,
    seed: c.seed,
    topology: c.topology || [],
    energy: c.energy,
    forms: {
      current: c.forms_current,
      potential: c.forms_potential || [],
      companions: c.forms_companions || [],
    },
    connected_to: c.connected_to || [],
    note: c.note,
    todos: c.todos || [],
    schema: c.schema,
  };
}

function copyCoverIfPresent(c, rootPath, coversDir) {
  if (!c.cover) return '';
  const resolvedRoot = resolveHome(rootPath);
  const srcPath = path.join(resolvedRoot, c.id, c.cover);
  if (!fs.existsSync(srcPath)) return '';
  const ext = path.extname(srcPath);
  const destName = `${c.id}${ext}`;
  fs.copyFileSync(srcPath, path.join(coversDir, destName));
  return `covers/${destName}`;
}

// Status → graph visual bucket. `bloomed` (finished but not publicly posted)
// reads as published for graph coloring purposes; the graph currently only
// has two tints (draft / published).
function statusBucket(c) {
  if (c.status === 'published')     return 'published';
  if (c.syndication?.canonical)     return 'published';
  if (c.status === 'bloomed')       return 'published';
  return 'draft';
}

// Frontmatter dates come in many shapes ("2025", "2026-03", "2026-03-18").
// Pad to a full ISO so JS Date.parse handles them consistently downstream.
function toIsoDate(s) {
  if (!s) return undefined;
  const str = String(s).trim();
  if (/^\d{4}$/.test(str))        return new Date(`${str}-01-01T00:00:00Z`).toISOString();
  if (/^\d{4}-\d{2}$/.test(str))  return new Date(`${str}-01T00:00:00Z`).toISOString();
  const d = new Date(str);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

function resolveHome(p) {
  if (!p) return p;
  if (p.startsWith('~')) return path.join(process.env.HOME, p.slice(1));
  return path.resolve(p);
}

module.exports = { id: ID, load };
