// Front matter — a leading YAML block in a text file, fenced by `---` lines.
//
// Stripped before anything counts or numbers the text: paragraph numbers,
// version maps, anchors, word counts, and TTS all read the body only, so a
// file gaining front matter shifts nothing a reader has bookmarked.
//
// Only a block that parses as a YAML mapping counts. A chapter that opens
// with a scene-break `---`, prose, and another `---` is prose, not metadata.

const matter = require('gray-matter');

const OPEN = /^﻿?---[ \t]*\r?\n/;
const CLOSE = /^(?:---|\.\.\.)[ \t]*$/;

function splitFrontMatter(text) {
  const src = String(text == null ? '' : text);
  const open = OPEN.exec(src);
  if (!open) return { data: null, body: src, raw: '' };
  const rest = src.slice(open[0].length);
  const lines = rest.split('\n');
  let offset = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\r$/, '');
    if (CLOSE.test(line)) {
      const raw = rest.slice(0, offset);
      let data;
      try { data = raw.trim() ? matter.engines.yaml.parse(raw) : {}; } catch (_) { return { data: null, body: src, raw: '' }; }
      if (!data || typeof data !== 'object' || Array.isArray(data)) return { data: null, body: src, raw: '' };
      // Drop the fence and the blank lines under it.
      const body = rest.slice(offset + lines[i].length + 1).replace(/^(?:[ \t]*\r?\n)+/, '');
      return { data, body, raw };
    }
    offset += lines[i].length + 1;
  }
  return { data: null, body: src, raw: '' };
}

function stripFrontMatter(text) {
  return splitFrontMatter(text).body;
}

// Commits whose message starts with `meta:` are structural (moves, renames,
// front matter edits), not revisions of the text.
function isMetaCommit(message) {
  return /^\s*meta:/i.test(String(message || ''));
}

module.exports = { splitFrontMatter, stripFrontMatter, isMetaCommit };

// The dates the commits dimension draws, oldest first. `commits` is
// [{ date, message }]; with hideMeta (the default) structural commits are
// left out of the revision timeline.
function commitTimes(commits, { hideMeta = true } = {}) {
  if (!Array.isArray(commits)) return [];
  return commits
    .filter((c) => c && c.date && !(hideMeta && isMetaCommit(c.message)))
    .map((c) => c.date);
}

module.exports.commitTimes = commitTimes;
