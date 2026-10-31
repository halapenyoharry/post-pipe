// Adapter registry. An adapter's only job is: native format -> item/tag records.
import fs from 'node:fs';
import { parseJSONL } from '../io.js';
import { fromJsonFeed } from './jsonfeed.js';
import { fromPairs } from './pairs.js';
import { fromFrontmatterDir, fromMarkdownDir } from './folders.js';

export const ADAPTERS = {
  jsonfeed: { input: 'file', run: (p, o) => fromJsonFeed(fs.readFileSync(p, 'utf8'), o), about: 'JSON Feed 1.1 / post-pipe feed.json' },
  pairs: { input: 'file', run: (p, o) => fromPairs(fs.readFileSync(p, 'utf8'), o), about: 'TSV: item<TAB>tag[<TAB>title<TAB>url]' },
  frontmatter: { input: 'dir', run: fromFrontmatterDir, about: 'folder of <piece>/frontmatter.json (post-pipe Gen-2)' },
  markdown: { input: 'dir', run: fromMarkdownDir, about: 'folder of .md with YAML tags (Obsidian); --inline adds #hashtags' },
  jsonl: { input: 'file', run: (p) => parseJSONL(fs.readFileSync(p, 'utf8'), p), about: 'already in rosetta-tagz record format' },
};

export function runAdapter(name, target, opts = {}) {
  const adapter = ADAPTERS[name];
  if (!adapter) throw new Error(`unknown adapter "${name}". available: ${Object.keys(ADAPTERS).join(', ')}`);
  if (!fs.existsSync(target)) throw new Error(`${name}: not found: ${target}`);
  const isDir = fs.statSync(target).isDirectory();
  if (adapter.input === 'dir' && !isDir) throw new Error(`${name}: expected a directory, got a file: ${target}`);
  if (adapter.input === 'file' && isDir) throw new Error(`${name}: expected a file, got a directory: ${target}`);
  return adapter.run(target, opts);
}
