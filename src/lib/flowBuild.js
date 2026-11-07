// flowBuild.js — how post-pipe's build uses Flow (flow/README.md), the part
// that puts a site's cards in one order under a weight vector. A site lists
// presets under flow.presets (provisional); for each, the build runs Flow's
// programs over the finished feed (flow-select --all, then flow-score
// --preset <file>, then flow-order), as child processes fed JSON on stdin,
// and keeps the order it gets back:
//
//   feed.flows: [{ name, description, mode, order: [item ids] }]
//
// name and description are the preset's own, as flow-score read them; mode
// is flow-order's (score or walk); order is the card ids in flow order, which
// are the feed's item ids (flow-select gives a card its item's id). A walk's
// start is order[0], so no start is kept beside it.
//
// Like rtagz.js for rosetta-tagz, this speaks files and JSON only: post-pipe
// never imports from flow/lib/. Flow never fails a build: a preset that
// cannot be found, or a program that fails or runs too long, is one logged
// line, and the build goes on without that order. A site that lists no
// preset runs no Flow, and its feed.json gains nothing.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const POSTPIPE_ROOT = path.resolve(__dirname, '../..');
const FLOW_DIR = path.join(POSTPIPE_ROOT, 'flow');
const PROGRAMS = ['flow-select', 'flow-score', 'flow-order'];
// Each program is stopped after this long, as rtz-build is.
const TIMEOUT_MS = 120000;

// settings.flow.presets: the presets a site lists, trimmed, empty ones left
// out. Absent, empty or not a list: none.
function flowPresetList(settings) {
  const f = settings && settings.flow && typeof settings.flow === 'object' ? settings.flow : null;
  if (!f || !Array.isArray(f.presets)) return [];
  return f.presets.filter((p) => typeof p === 'string' && p.trim()).map((p) => p.trim());
}

// A listed preset made a file. A bare name (letters, digits, dot, dash and
// underscore, not ending in .json) is a preset in flow/presets/; anything
// else is a path to the site's own preset: relative to the site, a leading ~
// the home folder, an absolute path as given.
function presetFile(entry, siteRoot, flowDir = FLOW_DIR) {
  const s = String(entry || '').trim();
  if (/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(s) && !/\.json$/i.test(s)) return path.join(flowDir, 'presets', `${s}.json`);
  if (path.isAbsolute(s)) return s;
  if (s === '~' || s.startsWith('~/')) return path.join(os.homedir(), s.slice(1));
  return path.resolve(siteRoot || POSTPIPE_ROOT, s);
}

// One of Flow's programs: input on its stdin, its stdout back as text. Stopped
// after timeoutMs; a non-zero exit gives back the last line it wrote on stderr
// (Flow's programs refuse input with one plain line there).
function runProgram(bin, args, input, timeoutMs = TIMEOUT_MS) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (res) => {
      if (settled) return;
      settled = true;
      resolve(res);
    };

    let child;
    try {
      child = spawn(process.execPath, [bin, ...args], {
        detached: true,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (err) {
      finish({ ok: false, reason: `spawn error: ${err.message}` });
      return;
    }

    const out = [];
    let stderr = '';
    child.stdout.on('data', (chunk) => { out.push(chunk); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    // A program that stops before reading all of its input says why on
    // stderr; the broken pipe itself is not the news.
    child.stdin.on('error', () => {});

    const timer = setTimeout(() => {
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch (_) {
        try { child.kill('SIGKILL'); } catch (__) {}
      }
      finish({ ok: false, reason: `timed out after ${timeoutMs}ms` });
    }, timeoutMs);

    child.on('error', (err) => {
      clearTimeout(timer);
      finish({ ok: false, reason: err.message });
    });

    child.on('close', (code, signal) => {
      clearTimeout(timer);
      if (code !== 0) {
        const lastErr = stderr.trim().split('\n').pop() || `exit ${code ?? signal}`;
        finish({ ok: false, reason: `exit ${code ?? signal} (${lastErr})` });
        return;
      }
      finish({ ok: true, stdout: Buffer.concat(out).toString('utf8') });
    });

    child.stdin.end(input);
  });
}

// The orders for a finished feed, one per preset the site lists, in the order
// it lists them; null when it lists none (or Flow's programs are missing, or
// flow-select fails, each said in one line). flow-select --all is the same
// for every preset, so it runs once and its subfield goes to each flow-score.
// warn: where a failure's one line goes (console.warn by default).
async function runFlows(feed, settings, { siteRoot, flowDir = FLOW_DIR, timeoutMs = TIMEOUT_MS, warn = console.warn } = {}) {
  const f = settings && settings.flow && typeof settings.flow === 'object' ? settings.flow : null;
  if (f && f.presets !== undefined && f.presets !== null && !Array.isArray(f.presets)) {
    warn('flow: flow.presets is not a list of presets; built on without orders');
    return null;
  }
  const entries = flowPresetList(settings);
  if (!entries.length) return null;

  const bin = (name) => path.join(flowDir, 'bin', name);
  const missing = PROGRAMS.find((name) => !fs.existsSync(bin(name)));
  if (missing) {
    warn(`flow: ${missing} not found in ${path.join(flowDir, 'bin')}; built on without orders`);
    return null;
  }

  const ids = new Set(((feed && Array.isArray(feed.items)) ? feed.items : [])
    .map((it) => it && it.id)
    .filter((id) => typeof id === 'string'));

  const selected = await runProgram(bin('flow-select'), ['--all'], JSON.stringify(feed), timeoutMs);
  if (!selected.ok) {
    warn(`flow: flow-select failed (${selected.reason}); built on without orders`);
    return null;
  }

  const flows = [];
  for (const entry of entries) {
    const file = presetFile(entry, siteRoot, flowDir);
    if (!fs.existsSync(file)) {
      warn(`flow: preset ${entry} not found (${file}); built on without that order`);
      continue;
    }
    const scored = await runProgram(bin('flow-score'), ['--preset', file], selected.stdout, timeoutMs);
    if (!scored.ok) {
      warn(`flow: ${entry}: flow-score failed (${scored.reason}); built on without that order`);
      continue;
    }
    const ordered = await runProgram(bin('flow-order'), [], scored.stdout, timeoutMs);
    if (!ordered.ok) {
      warn(`flow: ${entry}: flow-order failed (${ordered.reason}); built on without that order`);
      continue;
    }
    let preset;
    let flow;
    try {
      preset = JSON.parse(scored.stdout).preset || {};
      flow = JSON.parse(ordered.stdout);
    } catch (err) {
      warn(`flow: ${entry}: unreadable output (${err.message}); built on without that order`);
      continue;
    }
    const name = flow && flow.summary && typeof flow.summary.preset === 'string' && flow.summary.preset
      ? flow.summary.preset
      : (typeof preset.name === 'string' ? preset.name : '');
    if (!name || !flow || !Array.isArray(flow.items)) {
      warn(`flow: ${entry}: no order in flow-order's output; built on without that order`);
      continue;
    }
    // The reader's choice is kept by name, so two orders may not share one.
    if (flows.some((x) => x.name === name)) {
      warn(`flow: ${entry}: another listed preset is already named ${name}; built on without this one`);
      continue;
    }
    flows.push({
      name,
      description: typeof preset.description === 'string' ? preset.description : '',
      mode: flow.summary && typeof flow.summary.mode === 'string' ? flow.summary.mode : null,
      order: flow.items.map((it) => it && it.id).filter((id) => ids.has(id)),
    });
  }
  return flows;
}

module.exports = { FLOW_DIR, TIMEOUT_MS, flowPresetList, presetFile, runProgram, runFlows };
