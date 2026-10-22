// stone.js — the Rosetta stone seam between post-pipe and rosetta-tagz.
//
// Everything here speaks files and JSON only; post-pipe never imports from
// rosetta-tagz/lib/. Pure functions handle records, overrides, HTML reduction,
// the canonical URL fold, the container guard, and write-back onto items.

const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

const POSTPIPE_ROOT = path.resolve(__dirname, '../..');

const NAMED_ENTITIES = {
  amp:  '&',
  lt:   '<',
  gt:   '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function htmlToText(html) {
  if (!html) return '';
  let s = String(html);
  s = s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ');
  s = s.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ');
  s = s.replace(/<[^>]+>/g, ' ');
  s = s.replace(/&(?:#(\d+)|#x([0-9a-fA-F]+)|([a-zA-Z0-9]+));/g, (match, dec, hex, named) => {
    if (dec !== undefined) {
      const code = parseInt(dec, 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    if (hex !== undefined) {
      const code = parseInt(hex, 16);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    if (named !== undefined) {
      const lower = named.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, lower)) {
        return NAMED_ENTITIES[lower];
      }
    }
    return match;
  });
  return s.replace(/\s+/g, ' ').trim();
}

function itemText(item) {
  if (item.content_text && String(item.content_text).trim()) {
    return String(item.content_text).trim();
  }
  if (item.content_html) {
    const reduced = htmlToText(item.content_html);
    if (reduced) return reduced;
  }
  if (item.summary && String(item.summary).trim()) {
    return String(item.summary).trim();
  }
  return String(item.title ?? '');
}

function canonicalUrl(url) {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, '')}${u.pathname.replace(/\/+$/, '')}`.toLowerCase();
  } catch (_) {
    return '';
  }
}

function foldTitle(raw) {
  let s = String(raw ?? '').normalize('NFKC').trim().replace(/^#+/, '');
  s = s.replace(/\b(?:\p{L}\.){2,}/gu, (m) => m.replace(/\./g, ''));
  s = s.replace(/c\+\+/gi, ' cpp ').replace(/c#/gi, ' csharp ').replace(/f#/gi, ' fsharp ').replace(/&/g, ' and ');
  s = s.normalize('NFD').replace(/\p{M}+/gu, '');
  s = s.replace(/([a-z])([A-Z])/g, '$1 $2');
  return s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}

function cacheDirForSite(siteRoot, cacheBase = './.feed-cache') {
  const abs = path.resolve(siteRoot || POSTPIPE_ROOT);
  const base = path.basename(abs);
  const hash = crypto.createHash('sha1').update(abs).digest('hex').slice(0, 8);
  return path.join(cacheBase, 'stone', `${base}-${hash}`);
}

function mergeOverrides(siteOverrides = {}, containment = []) {
  const merged = { ...(siteOverrides || {}) };
  const pins = { ...(siteOverrides && siteOverrides.pin ? siteOverrides.pin : {}) };
  for (const c of containment || []) {
    if (c && typeof c.tag === 'string' && c.tag) {
      pins[c.tag] = c.tag;
    }
  }
  if (Object.keys(pins).length > 0 || (siteOverrides && siteOverrides.pin)) {
    merged.pin = pins;
  }
  return merged;
}

function buildConfig({ emerge = true, discover = false } = {}) {
  return {
    out: '.',
    sources: [{ adapter: 'jsonl', path: 'records.jsonl' }],
    overrides: 'overrides.json',
    emerge: Boolean(emerge),
    discover: Boolean(discover),
  };
}

function buildRecords(results, overrides = {}) {
  const ignoreSet = new Set(
    (overrides.ignore || []).map((t) => String(t ?? '').trim().toLowerCase()).filter(Boolean)
  );
  const records = [];
  const systems = {};
  const resultSystems = new Map();
  const usedNames = new Set();
  let skippedDuplicateIds = 0;

  for (const r of results) {
    if (!r || !r.ok) continue;
    const feedId = (r.feedMeta && r.feedMeta.id) || (r.config && r.config.id) || '';
    const baseTitle = (r.feedMeta && r.feedMeta.title) || (r.config && r.config.title) || feedId;
    let sysName = baseTitle;
    if (usedNames.has(sysName)) {
      sysName = `${baseTitle} (${feedId})`;
    }
    usedNames.add(sysName);
    resultSystems.set(r, sysName);

    const seenIds = new Set();
    let itemCount = 0;
    let taggedCount = 0;

    for (const item of r.items || []) {
      const id = String(item.id ?? '');
      if (seenIds.has(id)) {
        skippedDuplicateIds += 1;
        continue;
      }
      seenIds.add(id);
      itemCount += 1;

      records.push({
        type: 'item',
        source: sysName,
        id,
        title: String(item.title ?? ''),
        text: itemText(item),
        url: String(item.url ?? ''),
        date: String(item.date_published ?? ''),
        kind: String(item.kind || ''),
        color: String(r.color ?? ''),
      });

      let itemTagged = false;
      for (const rawTag of item.tags || []) {
        const label = String(rawTag ?? '');
        const folded = label.trim().toLowerCase();
        if (!folded || ignoreSet.has(folded)) continue;
        itemTagged = true;
        records.push({
          type: 'tag',
          source: sysName,
          item: id,
          label,
          weight: 1,
          origin: 'explicit',
        });
      }
      if (itemTagged) taggedCount += 1;
    }

    systems[sysName] = {
      sourceId: feedId,
      items: itemCount,
      tagged: taggedCount,
    };
  }

  return { records, systems, resultSystems, skippedDuplicateIds };
}

function checkContainerGuard(results, universe, containment = []) {
  const containerTags = [];
  for (const c of containment || []) {
    if (c && typeof c.tag === 'string' && c.tag) containerTags.push(c.tag);
  }
  if (containerTags.length === 0) return { ok: true };

  const usedOnItems = new Set();
  for (const r of results) {
    if (!r || !r.ok) continue;
    for (const item of r.items || []) {
      for (const t of item.tags || []) {
        if (containerTags.includes(t)) usedOnItems.add(t);
      }
    }
  }
  if (usedOnItems.size === 0) return { ok: true };

  const canonicals = new Set((universe.concepts || []).map((c) => c.canonical));
  for (const tag of containerTags) {
    if (usedOnItems.has(tag) && !canonicals.has(tag)) {
      return { ok: false, tag };
    }
  }
  return { ok: true };
}

function applyUniverse(results, resultSystems, systems, skippedDuplicateIds, universe, buildManifest) {
  const conceptById = new Map();
  for (const c of universe.concepts || []) {
    conceptById.set(c.id, c);
  }

  const byKey = new Map();
  const byUrl = new Map();
  const byTitle = new Map();

  for (const uItem of universe.items || []) {
    if (uItem.key) byKey.set(uItem.key, uItem);
    const cu = canonicalUrl(uItem.url);
    if (cu && !byUrl.has(cu)) byUrl.set(cu, uItem);
    if (!cu) {
      const ft = foldTitle(uItem.title);
      if (ft.length >= 24 && !byTitle.has(ft)) byTitle.set(ft, uItem);
    }
  }

  let unjoined = 0;

  for (const r of results) {
    if (!r || !r.ok) continue;
    const sysName = resultSystems.get(r);
    if (!sysName) continue;
    const seenIds = new Set();

    for (const item of r.items || []) {
      const id = String(item.id ?? '');
      if (seenIds.has(id)) continue;
      seenIds.add(id);

      const key = `${sysName}::${id}`;
      let uItem = byKey.get(key);
      if (!uItem) {
        const cu = canonicalUrl(item.url);
        if (cu) uItem = byUrl.get(cu);
        if (!uItem && !cu) {
          const ft = foldTitle(item.title);
          if (ft.length >= 24) uItem = byTitle.get(ft);
        }
      }

      if (!uItem) {
        unjoined += 1;
        continue;
      }

      const originalTags = Array.isArray(item.tags) ? item.tags : [];
      const explicitEntries = [];
      const earnedEntries = [];

      for (const t of uItem.tags || []) {
        const concept = conceptById.get(t.c);
        if (!concept) continue;
        const canonical = concept.canonical;
        const origin = t.origin || 'explicit';
        const weight = t.w !== undefined ? t.w : 1;
        const rawList = Array.isArray(t.raw) ? t.raw : [];
        const sysList = Array.isArray(t.sys) ? [...t.sys] : [];
        const forms = {};
        for (const rawEntry of rawList) {
          if (!rawEntry || !rawEntry.s || rawEntry.l === undefined) continue;
          if (!forms[rawEntry.s]) forms[rawEntry.s] = [];
          if (!forms[rawEntry.s].includes(rawEntry.l)) {
            forms[rawEntry.s].push(rawEntry.l);
          }
        }

        const entry = {
          canonical,
          concept: t.c,
          origin,
          weight,
          systems: sysList,
          forms,
          via: t.via || 'known',
          why: origin === 'explicit' ? null : (t.why !== undefined ? t.why : null),
          rawLabels: rawList.map((x) => x.l),
        };

        if (origin === 'explicit') {
          let firstPos = Infinity;
          for (const rl of entry.rawLabels) {
            const idx = originalTags.indexOf(rl);
            if (idx !== -1 && idx < firstPos) firstPos = idx;
          }
          entry.firstPos = firstPos;
          explicitEntries.push(entry);
        } else {
          earnedEntries.push(entry);
        }
      }

      explicitEntries.sort((a, b) => a.firstPos - b.firstPos || (a.canonical < b.canonical ? -1 : a.canonical > b.canonical ? 1 : 0));
      earnedEntries.sort((a, b) => b.weight - a.weight || (a.canonical < b.canonical ? -1 : a.canonical > b.canonical ? 1 : 0));

      const ordered = [...explicitEntries, ...earnedEntries];
      const newTags = [];
      const newTagRefs = [];
      const seenCanonical = new Set();

      for (const e of ordered) {
        if (seenCanonical.has(e.canonical)) continue;
        seenCanonical.add(e.canonical);
        newTags.push(e.canonical);
        newTagRefs.push({
          type: 'tag',
          value: e.canonical,
          concept: e.concept,
          origin: e.origin,
          weight: e.weight,
          systems: e.systems,
          forms: e.forms,
          via: e.via,
          why: e.why,
        });
      }

      const nonTagRefs = Array.isArray(item._references)
        ? item._references.filter((ref) => ref && ref.type !== 'tag')
        : [];

      item.tags = newTags;
      item._references = [...nonTagRefs, ...newTagRefs];
    }
  }

  const summaryConcepts = [];
  for (const c of universe.concepts || []) {
    const itemCount = (c.n || 0) + (c.nEmergent || 0) || c.items || 0;
    if (itemCount <= 0) continue;

    const forms = {};
    for (const v of c.variants || []) {
      const fbs = v.formsBySource || {};
      for (const [src, formMap] of Object.entries(fbs)) {
        if (!forms[src]) forms[src] = {};
        for (const [label, count] of Object.entries(formMap)) {
          forms[src][label] = (forms[src][label] || 0) + count;
        }
      }
    }

    const rank = (c.rank || []).map((r) => ({
      label: r.label,
      score: r.score,
      parts: {
        freq: r.parts?.freq ?? 0,
        cover: r.parts?.cover ?? 0,
        trust: r.parts?.trust ?? 0,
        quality: r.parts?.quality ?? 0,
      },
    }));

    summaryConcepts.push({
      canonical: c.canonical,
      pinned: Boolean(c.pinned),
      discovered: Boolean(c.discovered),
      items: itemCount,
      forms,
      rank,
    });
  }

  const summary = {
    built: (buildManifest && buildManifest.built) || universe.generated || null,
    systems,
    concepts: summaryConcepts,
    unjoined,
    skippedDuplicateIds,
  };

  return { summary };
}

function runRtzBuild(engineBin, configPath, cwd, timeoutMs) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (res) => {
      if (settled) return;
      settled = true;
      resolve(res);
    };

    let child;
    try {
      child = spawn(process.execPath, [engineBin, '--config', configPath, '--no-view'], {
        cwd,
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (err) {
      finish({ ok: false, reason: `spawn error: ${err.message}` });
      return;
    }

    let stderr = '';
    if (child.stderr) {
      child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    }

    const timer = setTimeout(() => {
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch (_) {
        try { child.kill('SIGKILL'); } catch (__) {}
      }
      finish({ ok: false, timedOut: true, reason: `timed out after ${timeoutMs}ms` });
    }, timeoutMs);

    child.on('error', (err) => {
      clearTimeout(timer);
      finish({ ok: false, reason: err.message });
    });

    child.on('close', (code, signal) => {
      clearTimeout(timer);
      if (code !== 0) {
        const lastErr = stderr.trim().split('\n').pop() || `exit ${code ?? signal}`;
        finish({ ok: false, code, reason: `exit ${code ?? signal} (${lastErr})` });
        return;
      }
      finish({ ok: true });
    });
  });
}

async function runStonePhase(results, options = {}) {
  const stoneCfg = options.stone;
  if (!stoneCfg || !stoneCfg.enabled) {
    return { ran: false, stone: null };
  }

  try {
    const siteRoot = options.siteRoot ? path.resolve(options.siteRoot) : POSTPIPE_ROOT;
    const postpipeRoot = options.postpipeRoot ? path.resolve(options.postpipeRoot) : POSTPIPE_ROOT;
    const engineSetting = stoneCfg.engine || 'rosetta-tagz';
    const engineDir = path.isAbsolute(engineSetting)
      ? engineSetting
      : path.resolve(postpipeRoot, engineSetting);
    const engineBin = path.join(engineDir, 'bin', 'rtz-build');

    if (!fs.existsSync(engineBin)) {
      console.warn(`stone: engine not found at ${engineBin}, tags left as written`);
      return { ran: false, stone: null };
    }

    const overridesSetting = stoneCfg.overrides || 'stone.overrides.json';
    const overridesPath = path.isAbsolute(overridesSetting)
      ? overridesSetting
      : path.resolve(siteRoot, overridesSetting);
    let siteOverrides = {};
    if (fs.existsSync(overridesPath)) {
      siteOverrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
    }

    const mergedOverrides = mergeOverrides(siteOverrides, options.containment || []);
    const { records, systems, resultSystems, skippedDuplicateIds } = buildRecords(results, mergedOverrides);

    const cacheDir = options.cacheDir
      ? path.resolve(options.cacheDir)
      : path.resolve(cacheDirForSite(siteRoot));
    fs.mkdirSync(cacheDir, { recursive: true });

    const recordsPath = path.join(cacheDir, 'records.jsonl');
    const overridesOutPath = path.join(cacheDir, 'overrides.json');
    const configPath = path.join(cacheDir, 'rtz.config.json');

    const recordsText = records.map((r) => JSON.stringify(r)).join('\n') + (records.length ? '\n' : '');
    fs.writeFileSync(recordsPath, recordsText, 'utf8');
    fs.writeFileSync(overridesOutPath, JSON.stringify(mergedOverrides, null, 2) + '\n', 'utf8');

    const rtzConfig = buildConfig({
      emerge: stoneCfg.emerge !== false,
      discover: Boolean(stoneCfg.discover),
    });
    fs.writeFileSync(configPath, JSON.stringify(rtzConfig, null, 2) + '\n', 'utf8');

    const timeoutMs = Number.isFinite(Number(stoneCfg.timeoutMs)) && Number(stoneCfg.timeoutMs) > 0
      ? Number(stoneCfg.timeoutMs)
      : 120000;

    const runRes = await runRtzBuild(engineBin, configPath, cacheDir, timeoutMs);
    if (!runRes.ok) {
      console.warn(`stone: build failed (${runRes.reason}), tags left as written`);
      return { ran: false, stone: null };
    }

    const universePath = path.join(cacheDir, 'universe.json');
    const buildPath = path.join(cacheDir, 'build.json');
    const universe = JSON.parse(fs.readFileSync(universePath, 'utf8'));
    const buildManifest = JSON.parse(fs.readFileSync(buildPath, 'utf8'));

    const guard = checkContainerGuard(results, universe, options.containment || []);
    if (!guard.ok) {
      console.warn(`stone: container tag "${guard.tag}" is not canonical after build, tags left as written`);
      return { ran: false, stone: null };
    }

    const { summary } = applyUniverse(results, resultSystems, systems, skippedDuplicateIds, universe, buildManifest);
    return { ran: true, stone: summary };
  } catch (err) {
    console.warn(`stone: ${err.message}, tags left as written`);
    return { ran: false, stone: null };
  }
}

module.exports = {
  htmlToText,
  itemText,
  canonicalUrl,
  foldTitle,
  cacheDirForSite,
  mergeOverrides,
  buildConfig,
  buildRecords,
  checkContainerGuard,
  applyUniverse,
  runRtzBuild,
  runStonePhase,
};
