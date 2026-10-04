// Tiny I/O helpers shared by the bin/ programs. JSONL in, JSONL out.
import fs from 'node:fs';
import { parseArgs } from 'node:util';

export async function readStdin() {
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  return Buffer.concat(chunks).toString('utf8');
}

// file path, '-' or undefined (=stdin)
export async function readText(file) {
  if (!file || file === '-') return readStdin();
  return fs.readFileSync(file, 'utf8');
}

export function parseJSONL(text, label = 'input') {
  const out = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    try {
      out.push(JSON.parse(line));
    } catch (e) {
      throw new Error(`${label}:${i + 1}: invalid JSON (${e.message})`);
    }
  }
  return out;
}

export function toJSONL(records) {
  return records.map((r) => JSON.stringify(r)).join('\n') + (records.length ? '\n' : '');
}

export function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function writeOut(text, file) {
  if (file && file !== '-') fs.writeFileSync(file, text);
  else process.stdout.write(text);
}

export function die(msg, code = 1) {
  process.stderr.write(`${msg}\n`);
  process.exit(code);
}

export function log(msg) {
  process.stderr.write(`${msg}\n`);
}

// Thin wrapper so each program declares its flags in one place and gets --help for free.
export function cli(name, usage, options, argv = process.argv.slice(2)) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      options: { help: { type: 'boolean', short: 'h' }, ...options },
      allowPositionals: true,
      strict: true,
    });
  } catch (e) {
    die(`${name}: ${e.message}\n\n${usage}`, 2);
  }
  if (parsed.values.help) {
    process.stdout.write(`${usage}\n`);
    process.exit(0);
  }
  return parsed;
}
