// Reading and writing for the flow programs: JSON on stdin, JSON or text on
// stdout, one plain line on stderr and a non-zero exit on bad input. Long
// options only. Nothing here knows what a card or a tag is.
import fs from 'node:fs';

/** One line on stderr, exit 1. Every program's only way of refusing input. */
export function fail(message) {
  process.stderr.write(`${String(message).replace(/\s+/g, ' ').trim()}\n`);
  process.exit(1);
}

export function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch (e) {
    return fail(`could not read stdin: ${e.message}`);
  }
}

export function parseJson(text, what = 'stdin') {
  if (!text || !text.trim()) return fail(`${what} is empty; expected JSON`);
  try {
    return JSON.parse(text);
  } catch (e) {
    return fail(`${what} is not JSON: ${e.message}`);
  }
}

export function readJsonStdin(what = 'stdin') {
  return parseJson(readStdin(), what);
}

export function readJsonFile(file, what = file) {
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (e) {
    return fail(`could not read ${what}: ${e.message}`);
  }
  return parseJson(text, what);
}

/** Deterministic JSON: two-space indent, trailing newline, key order as built. */
export function toJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function writeStdout(text) {
  process.stdout.write(text);
}

/**
 * Long options only: --name value, --name=value, --flag (boolean). `spec` maps
 * a name to { type: 'string' | 'number' | 'boolean', default, required }.
 * Unknown options, missing values and non-numbers are refused with one line.
 */
export function parseArgs(argv, spec, usage = '') {
  const out = {};
  for (const [name, s] of Object.entries(spec)) out[name] = s.default;
  const args = [...argv];
  while (args.length) {
    const arg = args.shift();
    if (arg === '--help' || arg === '-h') {
      process.stdout.write(usage ? `${usage}\n` : '');
      process.exit(0);
    }
    if (!arg.startsWith('--')) return fail(`unexpected argument "${arg}"${usage ? `; ${usage.split('\n')[0]}` : ''}`);
    let name = arg.slice(2);
    let value = null;
    const eq = name.indexOf('=');
    if (eq >= 0) {
      value = name.slice(eq + 1);
      name = name.slice(0, eq);
    }
    const s = spec[name];
    if (!s) return fail(`unknown option --${name}${usage ? `; ${usage.split('\n')[0]}` : ''}`);
    if (s.type === 'boolean') {
      out[name] = value === null ? true : !(value === 'false' || value === '0');
      continue;
    }
    if (value === null) {
      if (!args.length || args[0].startsWith('--')) return fail(`--${name} needs a value`);
      value = args.shift();
    }
    if (s.type === 'number') {
      const n = Number(value);
      if (!Number.isFinite(n)) return fail(`--${name} needs a number, got "${value}"`);
      out[name] = n;
    } else {
      out[name] = value;
    }
  }
  for (const [name, s] of Object.entries(spec)) {
    if (s.required && (out[name] === undefined || out[name] === null || out[name] === '')) return fail(`--${name} is required`);
    if (s.oneOf && out[name] !== undefined && out[name] !== null && !s.oneOf.includes(out[name])) {
      return fail(`--${name} must be one of ${s.oneOf.join(', ')}, got "${out[name]}"`);
    }
  }
  return out;
}

/** The viewer's node id for a card: the last path segment of its url without .html (GraphViewer.jsx feedToGraph). */
export function slugOf(url) {
  if (typeof url !== 'string' || !url) return '';
  return url.split('/').pop().replace('.html', '');
}

export function round(n, places = 3) {
  if (!Number.isFinite(n)) return n;
  const f = 10 ** places;
  return Math.round(n * f) / f;
}
