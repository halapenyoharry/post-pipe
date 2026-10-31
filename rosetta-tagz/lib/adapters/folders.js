// Folder adapters.
//   frontmatter  DIR/<piece>/frontmatter.json   (post-pipe's Gen-2 content layout)
//   markdown     DIR/**/*.md                    (Obsidian-style: YAML tags + optional inline #tags)
import fs from 'node:fs';
import path from 'node:path';

const MAX_TEXT = 3000;

function get(obj, dotted) {
  return dotted.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}

function listDirs(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith('.')).map((d) => d.name).sort();
}

// One piece of content: frontmatter.json (post-pipe Gen-2), else the YAML header of
// index.qmd / index.md (Gen-1, read in lossy mode). Returns null if neither exists.
function readPiece(dir, name) {
  const base = path.join(dir, name);
  const fm = path.join(base, 'frontmatter.json');
  const bodyFile = ['index.md', 'index.qmd', 'index.markdown'].map((f) => path.join(base, f)).find((f) => fs.existsSync(f));
  const raw = bodyFile ? fs.readFileSync(bodyFile, 'utf8') : '';
  if (fs.existsSync(fm)) {
    try {
      return { data: JSON.parse(fs.readFileSync(fm, 'utf8')), body: raw.replace(/^---[\s\S]*?\n---\n?/, '') };
    } catch {
      return null;
    }
  }
  if (!bodyFile) return null;
  const { header, body } = parseYamlHeader(raw);
  return Object.keys(header).length ? { data: { ...header, note: header.description }, body } : null;
}

export function fromFrontmatterDir(dir, opts = {}) {
  const source = opts.source || path.basename(path.resolve(dir));
  const field = opts.field || 'tags';
  const records = [];
  for (const name of listDirs(dir)) {
    const piece = readPiece(dir, name);
    if (!piece) continue;
    const { data, body } = piece;
    const value = get(data, field);
    if (field !== 'tags' && value == null) continue; // not part of this vocabulary at all
    const id = String(data.id ?? data.slug ?? name);
    const seed = [get(data, 'idea.seed'), data.note].filter((x) => typeof x === 'string').join(' ');
    records.push({
      type: 'item',
      source,
      id,
      title: data.title ?? name,
      text: `${seed} ${body}`.trim().slice(0, MAX_TEXT),
      url: '',
      date: get(data, 'meta.date') ?? data.publish_date ?? '',
      kind: get(data, 'idea.substrate') ?? '',
    });
    const labels = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[,;]/) : [];
    for (const label of labels) {
      if (typeof label === 'string' && label.trim()) records.push({ type: 'tag', source, item: id, label: label.trim(), weight: 1, origin: 'explicit' });
    }
  }
  return records;
}

// ---- markdown --------------------------------------------------------------

function parseYamlHeader(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { header: {}, body: text };
  const header = {};
  const lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rest] = kv;
    if (rest === '') {
      const list = [];
      while (i + 1 < lines.length && /^\s*-\s+/.test(lines[i + 1])) list.push(lines[++i].replace(/^\s*-\s+/, '').trim().replace(/^["']|["']$/g, ''));
      header[key] = list;
    } else if (/^\[.*\]$/.test(rest.trim())) {
      header[key] = rest.trim().slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else {
      header[key] = rest.trim().replace(/^["']|["']$/g, '');
    }
  }
  return { header, body: text.slice(m[0].length) };
}

function* walkMarkdown(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    if (entry.name.startsWith('.')) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkMarkdown(p);
    else if (/\.(md|markdown)$/i.test(entry.name)) yield p;
  }
}

export function fromMarkdownDir(dir, opts = {}) {
  const source = opts.source || path.basename(path.resolve(dir));
  const records = [];
  for (const file of walkMarkdown(dir)) {
    const { header, body } = parseYamlHeader(fs.readFileSync(file, 'utf8'));
    const id = path.relative(dir, file).replace(/\.(md|markdown)$/i, '');
    const labels = new Set();
    const raw = header.tags ?? header.tag ?? [];
    for (const t of Array.isArray(raw) ? raw : String(raw).split(/[,\s]+/)) if (t.trim()) labels.add(t.trim().replace(/^#/, ''));
    if (opts.inline) for (const m of body.matchAll(/(?:^|\s)#([\p{L}\p{N}_][\p{L}\p{N}_/-]*)/gu)) labels.add(m[1]);
    records.push({ type: 'item', source, id, title: header.title ?? path.basename(id), text: body.slice(0, MAX_TEXT), url: '', date: header.date ?? '', kind: 'note' });
    for (const label of labels) records.push({ type: 'tag', source, item: id, label, weight: 1, origin: 'explicit' });
  }
  return records;
}
