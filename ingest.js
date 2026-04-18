// ingest.js
// Walks a content root (e.g. ~/Posts), produces Content[] — substrate-agnostic,
// metadata-graceful. Each folder becomes one Content object regardless of how
// much metadata is filled in.

const fs     = require('fs');
const path   = require('path');
const matter = require('gray-matter');

const AUDIO_EXTS = new Set(['.m4a', '.mp3', '.wav', '.ogg', '.flac', '.aac']);
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm', '.mkv', '.avi']);
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);
const TEXT_EXTS  = new Set(['.md', '.qmd']);

// Folders in the content root that should never be treated as content.
const SKIP_FOLDERS = new Set(['authors', 'node_modules', '.git']);

// ─── Substrate detection ────────────────────────────────────────────────────

function ext(f)        { return path.extname(f).toLowerCase(); }
function isAudio(f)    { return AUDIO_EXTS.has(ext(f)); }
function isVideo(f)    { return VIDEO_EXTS.has(ext(f)); }
function isImage(f)    { return IMAGE_EXTS.has(ext(f)); }
function isText(f)     { return TEXT_EXTS.has(ext(f)); }
function isTodo(f)     { return f.startsWith('_TODO') || f === '_MIGRATE.md'; }

function detectSubstrate(files, explicit) {
  if (explicit) return explicit;
  const audible = files.some(isAudio);
  const watchable = files.some(isVideo);
  const readable = files.some(f => isText(f) && !isTodo(f)) || files.includes('index.html');
  const viewable = files.some(isImage);
  const substrates = [
    audible   && 'podcast-episode',
    watchable && 'video',
    readable  && 'essay',
    viewable  && 'image',
  ].filter(Boolean);
  if (substrates.length === 0) return 'fragment';
  if (substrates.length === 1) return substrates[0];
  return 'multi';
}

// ─── Frontmatter readers ────────────────────────────────────────────────────

function readFrontmatterJson(dir) {
  const p = path.join(dir, 'frontmatter.json');
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (err) { console.warn(`[ingest] malformed JSON: ${p} — ${err.message}`); return null; }
}

function readQmdFrontmatter(dir) {
  const p = path.join(dir, 'index.qmd');
  if (!fs.existsSync(p)) return null;
  try { return matter(fs.readFileSync(p, 'utf8')).data; }
  catch (err) { console.warn(`[ingest] couldn't parse ${p} — ${err.message}`); return null; }
}

// ─── Body & cover resolution ────────────────────────────────────────────────

function findBody(dir, files, explicitFile) {
  if (explicitFile) {
    const p = path.join(dir, explicitFile);
    if (fs.existsSync(p)) return { file: explicitFile, format: ext(explicitFile).slice(1) || 'html' };
  }
  for (const [name, format] of [
    ['index.md', 'md'],
    ['index.qmd', 'qmd'],
    ['index.html', 'html'],
  ]) {
    if (files.includes(name)) return { file: name, format };
  }
  // Fallback: any .md that isn't a TODO, or any .html archive
  const md = files.find(f => ext(f) === '.md' && !isTodo(f));
  if (md) return { file: md, format: 'md' };
  const html = files.find(f => ext(f) === '.html');
  if (html) return { file: html, format: 'html' };
  return null;
}

function findCover(dir, files, legacyCoverImage) {
  if (legacyCoverImage) {
    const p = path.join(dir, legacyCoverImage);
    if (fs.existsSync(p)) return legacyCoverImage;
  }
  for (const candidate of ['cover.jpg', 'cover.png', 'cover.jpeg', 'cover.webp',
                           'images/cover.jpg', 'images/cover.png', 'images/cover.jpeg']) {
    if (fs.existsSync(path.join(dir, candidate))) return candidate;
  }
  const art = files.find(f => (f.startsWith('art-') || f.startsWith('cover-')) && isImage(f));
  if (art) return art;
  // Unstructured image-only folders: the image IS the cover
  const soleImage = files.filter(isImage);
  if (soleImage.length === 1) return soleImage[0];
  return null;
}

function findMedia(dir, files) {
  const media = {};
  const audio = files.find(isAudio);
  const video = files.find(isVideo);
  if (audio) {
    const base = path.basename(audio, path.extname(audio));
    const srt     = files.find(f => f === `${base}.srt`);
    const txt     = files.find(f => f === `${base}.txt`);
    const timings = files.find(f => f === `${base}.json`);
    media.audio = {
      file: audio,
      srt: srt || null,
      transcript: txt || null,
      timings: timings || null,
    };
  }
  if (video) media.video = { file: video };
  return (audio || video) ? media : null;
}

// ─── Content builders ───────────────────────────────────────────────────────

function buildFromFrontmatterJson(id, fm, files, dir) {
  const substrate = detectSubstrate(files, fm.idea?.substrate);
  return {
    id,
    kind: substrate,
    title:          fm.title || id,
    short_title:    fm.short_title || null,
    summary:        fm.idea?.tldr || fm.idea?.seed || '',
    seed:           fm.idea?.seed || null,
    topology:       fm.idea?.topology || [],
    energy:         fm.idea?.energy || null,
    substrate,
    status:         fm.meta?.status || 'scattered',
    written:        fm.meta?.written || null,
    updated:        fm.meta?.updated || null,
    reading_time:   fm.meta?.reading_time || null,
    author:         fm.meta?.author || 'harold young [humxn]',
    tags:           fm.tags || [],
    series:         fm.series || null,
    series_part:    fm.series_part ?? null,
    license:        fm.meta?.license || null,
    forms_current:  fm.forms?.current || substrate,
    forms_potential: fm.forms?.potential || [],
    forms_companions: fm.forms?.companions || [],
    syndication:    fm.syndication || {},
    connected_to:   fm.connected_to || [],
    note:           fm.note || null,
    cover:          findCover(dir, files, null),
    body:           findBody(dir, files, fm.body?.file),
    media:          findMedia(dir, files),
    todos:          files.filter(isTodo),
    source:         'local',
    schema:         'gen2',
  };
}

function buildFromQmd(id, yaml, files, dir) {
  return {
    id,
    kind:           'essay',
    title:          yaml.title || id,
    short_title:    yaml.short_title || null,
    summary:        yaml.tldr || yaml.description || '',
    seed:           null,
    topology:       [],
    energy:         null,
    substrate:      'essay',
    status:         yaml.status === 'published' ? 'published' : 'drafted',
    written:        yaml.publish_date || null,
    updated:        yaml.updated_date || null,
    reading_time:   yaml.reading_time || null,
    author:         yaml.author || 'harold young [humxn]',
    tags:           yaml.tags || [],
    series:         yaml.series || null,
    series_part:    yaml.series_part ?? null,
    license:        yaml.license || null,
    forms_current:  'essay',
    forms_potential: [],
    forms_companions: [],
    syndication: {
      canonical: yaml.canonical_url || null,
      ...(yaml.syndication || {}),
    },
    connected_to:   [],
    note:           null,
    cover:          findCover(dir, files, yaml.cover_image),
    body:           { file: 'index.qmd', format: 'qmd' },
    media:          findMedia(dir, files),
    todos:          files.filter(isTodo),
    source:         'local',
    schema:         'legacy-qmd',
  };
}

function buildFromUnstructured(id, files, dir) {
  const substrate = detectSubstrate(files, null);
  const title = id.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    id,
    kind:           substrate,
    title,
    short_title:    null,
    summary:        '',
    seed:           null,
    topology:       [],
    energy:         null,
    substrate,
    status:         'scattered',
    written:        null,
    updated:        null,
    reading_time:   null,
    author:         'harold young [humxn]',
    tags:           [],
    series:         null,
    series_part:    null,
    license:        null,
    forms_current:  substrate,
    forms_potential: [],
    forms_companions: [],
    syndication:    {},
    connected_to:   [],
    note:           null,
    cover:          findCover(dir, files, null),
    body:           findBody(dir, files, null),
    media:          findMedia(dir, files),
    todos:          files.filter(isTodo),
    source:         'local',
    schema:         'unstructured',
  };
}

// ─── Main ───────────────────────────────────────────────────────────────────

function ingestFolder(rootPath) {
  const resolved = rootPath.startsWith('~')
    ? path.join(process.env.HOME, rootPath.slice(1))
    : path.resolve(rootPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`ingest: root does not exist: ${resolved}`);
  }

  const entries = fs.readdirSync(resolved, { withFileTypes: true });
  const contents = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
    if (SKIP_FOLDERS.has(entry.name)) continue;

    const dir   = path.join(resolved, entry.name);
    const files = fs.readdirSync(dir);

    const fm = readFrontmatterJson(dir);
    if (fm) { contents.push(buildFromFrontmatterJson(entry.name, fm, files, dir)); continue; }

    const yaml = readQmdFrontmatter(dir);
    if (yaml) { contents.push(buildFromQmd(entry.name, yaml, files, dir)); continue; }

    contents.push(buildFromUnstructured(entry.name, files, dir));
  }
  return { root: resolved, contents };
}

module.exports = { ingestFolder, detectSubstrate };
