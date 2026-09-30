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
const { marked } = require('marked');

const { ingestFolder } = require('../../ingest');
const { stripFrontMatter, commitTimes } = require('../lib/frontMatter');

const ID = 'local';

/**
 * @param {{
 *   id: string,            // OPML xmlUrl, e.g. 'local://~/Posts'
 *   title: string,         // display name for the feed
 *   path: string,          // filesystem path or ~/-prefixed
 *   pagesBase: string,     // canonical site URL (for generating per-item URLs)
 *   coversDir: string,     // where to copy cover images for the static site
 *   pagesDir?: string      // where to write per-item HTML pages
 * }} config
 * @returns {Promise<{items, feedMeta}>}
 */
async function load(config) {
  const { id, title, path: rootPath, pagesBase, coversDir, pagesDir } = config;

  if (!fs.existsSync(coversDir)) {
    fs.mkdirSync(coversDir, { recursive: true });
  }

  const { contents } = ingestFolder(rootPath);
  
  const hiddenSlugs = new Set();
  const visibleContents = [];
  
  for (const c of contents) {
    let vis = c.posted;
    if (vis === undefined || vis === null) vis = config.visibilityDefault;
    const isVisible = (vis === true || vis === 'yes' || vis === 'true' || vis === 'public' || vis === 'title');
    if (isVisible) {
      visibleContents.push(c);
    } else {
      hiddenSlugs.add(c.id);
    }
  }

  const items = visibleContents.map(c => {
    if (c.connected_to && Array.isArray(c.connected_to)) {
      c.connected_to = c.connected_to.filter(slug => !hiddenSlugs.has(slug));
    }
    generateItemPage(c, rootPath, pagesDir, hiddenSlugs);
    return contentToItem(c, rootPath, pagesBase, coversDir, config.commits || {});
  });

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
function contentToItem(c, rootPath, pagesBase, coversDir, commitSettings = {}) {
  const hideMeta = commitSettings.hideMeta !== false;
  const isTitleOnly = c.posted === 'title';
  const imageUrl = copyCoverIfPresent(c, rootPath, coversDir);
  const pagesUrl = `${pagesBase}/${c.id}.html`;
  const bucket   = statusBucket(c);

  const tags = c.tags || [];

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
    author: (c.author ? c.author.replace(/\s*\[humxn\]/i, '').trim() : 'harold young').toLowerCase(),
    authors: [{ name: (c.author ? c.author.replace(/\s*\[humxn\]/i, '').trim() : 'harold young').toLowerCase(), url: c.syndication?.canonical || pagesUrl }],
    tags,
    series: c.series || '',
    series_part: c.series_part || null,
    timeline: c.timeline || undefined,
    // Commits with messages come first: they can be filtered. A bare
    // commit_times list is taken as given. Failing both, the item folder's
    // own git history.
    commit_times: isTitleOnly ? [] : (Array.isArray(c.commits) ? commitTimes(c.commits, { hideMeta })
      : Array.isArray(c.commit_times) ? c.commit_times : (() => {
      try {
        const itemFolder = path.join(resolveHome(rootPath), c.id);
        const out = require('child_process').execFileSync('git', ['log', '--format=%cI%x09%s', '--reverse', '--', '.'], {
          cwd: itemFolder,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
        });
        const commits = out.split('\n').filter(Boolean).map((line) => {
          const tab = line.indexOf('\t');
          return { date: line.slice(0, tab), message: line.slice(tab + 1) };
        });
        return commitTimes(commits, { hideMeta });
      } catch {
        return [];
      }
    })()),
    license: c.license || '',
    canonical_url: c.syndication?.canonical || pagesUrl,
    syndication: c.syndication || {},
    // JSON Feed 1.1 standard: per-item attachments. Each carries a _role
    // extension distinguishing how the item uses the file — 'cover' for
    // the node background, 'inline' for embedded media, 'reference' for
    // shared/external media that other items might also reference.
    attachments: buildAttachments(c, imageUrl),
    _status: bucket,
    _posted: c.posted,
    // Generalized references — every "thing the item points to that other
    // items can also point to" lives here, typed. Tags are the first
    // case; future case includes images-as-edges (type: 'image'),
    // people, places, dates. Code that still wants just tags keeps
    // reading `tags` (above) for compatibility.
    _references: tags.map(value => ({ type: 'tag', value })),
    // Project schema fields the graph and TextView consume. Underscore-
    // prefixing them to match JSON Feed conventions is a breaking
    // refactor for another day.
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
    version: isTitleOnly ? undefined : (c.version || undefined),
    version_maps: isTitleOnly ? undefined : (c.version_maps || undefined),
  };
}

// Build the attachments array for an item. Today the only attachment is
// the cover image; later this fans out to inline media and shared
// references — but the shape is already set so adding them is additive.
function buildAttachments(c, imageUrl) {
  const out = [];
  if (imageUrl) {
    out.push({
      url: imageUrl,
      mime_type: mimeFromExt(imageUrl),
      _role: 'cover',
    });
  }
  return out;
}

function mimeFromExt(url) {
  const ext = path.extname(url).toLowerCase();
  return ({
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif':  'image/gif',
    '.webp': 'image/webp',
    '.svg':  'image/svg+xml',
  })[ext] || 'application/octet-stream';
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

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateItemPage(c, rootPath, pagesDir, hiddenSlugs = new Set()) {
  if (!pagesDir || !c.body || c.posted === 'title') return;
  try {
    const { file, format } = c.body;
    if (format !== 'md' && format !== 'html') return;

    const resolvedRoot = resolveHome(rootPath);
    const srcPath = path.join(resolvedRoot, c.id, file);
    if (!fs.existsSync(srcPath)) return;

    if (!fs.existsSync(pagesDir)) {
      fs.mkdirSync(pagesDir, { recursive: true });
    }

    const outPath = path.join(pagesDir, `${c.id}.html`);

    if (format === 'html') {
      fs.copyFileSync(srcPath, outPath);
    } else if (format === 'md') {
      // Front matter is metadata, never text: stripped before anything
      // numbers, anchors, counts, or reads the body aloud.
      let rawMd = stripFrontMatter(fs.readFileSync(srcPath, 'utf8'));
      if (hiddenSlugs.size > 0) {
        // Find links in markdown, e.g. [some text](slug) or [some text](slug.html) or [some text](./slug.html)
        // We replace them with just the text if the slug is hidden.
        // A naive regex for markdown links:
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        rawMd = rawMd.replace(linkRegex, (match, text, url) => {
          // Normalize url to slug
          let slug = url.replace(/^\.\//, '').replace(/\.html$/, '').replace(/\/$/, '');
          if (hiddenSlugs.has(slug)) {
            return text; // Strip the link, leave the text
          }
          return match;
        });
      }
      const rendered = marked(rawMd);
      const escapedTitle = escapeHtml(c.title);
      const doc = `<!doctype html>\n<html><head><meta charset="utf-8"><title>${escapedTitle}</title></head><body><h1>${escapedTitle}</h1>\n${rendered}</body></html>\n`;
      fs.writeFileSync(outPath, doc, 'utf8');
    }
  } catch (err) {
    console.warn(`[LocalFolderAdapter] failed to generate page for item "${c.id}": ${err.message}`);
  }
}

module.exports = { id: ID, load };
