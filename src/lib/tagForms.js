// What each tag-system calls a tag concept, and which part of rosetta-tagz's
// ranking chose its canonical name (docs/POST-PIPE-USES-RTAGZ.md).
//
// Pure, so it can be tested without the DOM.

const PART_NAMES = [
  ['freq', 'frequency'],
  ['cover', 'coverage'],
  ['trust', 'trust'],
  ['quality', 'quality'],
];

function spellingsOf(raw) {
  if (!raw || typeof raw !== 'object') return [];
  const counts = new Map();
  if (Array.isArray(raw)) {
    for (const label of raw) {
      if (typeof label === 'string' && label) {
        counts.set(label, (counts.get(label) || 0) + 1);
      }
    }
  } else {
    for (const [label, count] of Object.entries(raw)) {
      const n = Number(count);
      if (label && Number.isFinite(n) && n > 0) {
        counts.set(label, (counts.get(label) || 0) + n);
      }
    }
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function orderedSystems(formsObj, preferredOrder) {
  const keys = Object.keys(formsObj || {});
  if (!preferredOrder || !preferredOrder.length) return keys;
  const present = new Set(keys);
  const out = [];
  for (const sys of preferredOrder) {
    if (present.has(sys)) {
      out.push(sys);
      present.delete(sys);
    }
  }
  for (const sys of keys) {
    if (present.has(sys)) out.push(sys);
  }
  return out;
}

function hasExtraBeyondCanonical(forms, canonical) {
  if (!forms || forms.length === 0) return false;
  if (forms.length > 1) return true;
  return forms[0].spellings.some((s) => s.label !== canonical);
}

function collectReferences(source, canonical, out = []) {
  if (!source) return out;
  if (Array.isArray(source)) {
    for (const el of source) collectReferences(el, canonical, out);
    return out;
  }
  if (typeof source !== 'object') return out;

  const itemRefs = source._references
    || (source.originalItem && source.originalItem._references)
    || source.references;
  if (Array.isArray(itemRefs)) {
    for (const ref of itemRefs) collectReferences(ref, canonical, out);
    return out;
  }
  if (Array.isArray(source.items)) {
    for (const item of source.items) collectReferences(item, canonical, out);
    return out;
  }
  if (source.forms && typeof source.forms === 'object') {
    if (source.type && source.type !== 'tag') return out;
    // The key is a canonical label or a concept id; a reference answers to either.
    if (source.value !== undefined && source.value !== canonical && source.concept !== canonical) return out;
    out.push(source);
  }
  return out;
}

function fromReferences(source, key, systemNames) {
  const refs = collectReferences(source, key);
  if (!refs.length) return null;
  // When the key was a concept id, the label is the reference's value.
  const canonical = typeof refs[0].value === 'string' && refs[0].value ? refs[0].value : key;

  const seenSystems = [...(systemNames || [])];
  const bySystem = {};

  for (const ref of refs) {
    if (Array.isArray(ref.systems)) {
      for (const sys of ref.systems) {
        if (typeof sys === 'string' && sys && !seenSystems.includes(sys)) {
          seenSystems.push(sys);
        }
      }
    }
    for (const [sys, raw] of Object.entries(ref.forms || {})) {
      if (!sys) continue;
      if (!seenSystems.includes(sys)) seenSystems.push(sys);
      if (!bySystem[sys]) bySystem[sys] = {};
      if (Array.isArray(raw)) {
        for (const label of raw) {
          if (typeof label === 'string' && label) {
            bySystem[sys][label] = (bySystem[sys][label] || 0) + 1;
          }
        }
      } else if (raw && typeof raw === 'object') {
        for (const [label, count] of Object.entries(raw)) {
          const n = Number(count);
          if (label && Number.isFinite(n) && n > 0) {
            bySystem[sys][label] = (bySystem[sys][label] || 0) + n;
          }
        }
      } else if (typeof raw === 'string' && raw) {
        bySystem[sys][raw] = (bySystem[sys][raw] || 0) + 1;
      }
    }
  }

  const forms = [];
  for (const system of orderedSystems(bySystem, seenSystems)) {
    const spellings = spellingsOf(bySystem[system]);
    if (spellings.length) forms.push({ system, spellings });
  }

  if (!hasExtraBeyondCanonical(forms, canonical)) return null;

  return {
    canonical,
    pinned: false,
    discovered: false,
    items: refs.length,
    forms,
    rank: [],
  };
}

// Given feed._rtagz (may be undefined) and a key, a concept id or a canonical
// label (the id is looked up first), returns null when there is nothing to
// show, else:
//   { canonical, pinned, discovered, items,
//     forms: [{ system, spellings: [{ label, count }] }],
//     rank: [{ label, score, parts }],
//     and, when the concept carries them: id, inScheme, prefLabel, altLabel,
//     broader, mappings }
// Concepts without id or prefLabel (feeds built before rosetta-tagz spoke
// SKOS) are read as before. Accepts item-level _references entries (or items
// carrying _references) as a fallback when feed._rtagz is absent.
function tagForms(rtagz, key, fallback) {
  const canonical = key;
  if (!canonical || typeof canonical !== 'string') return null;

  let rtagzObj = null;
  let fallbackSource = fallback;

  if (rtagz && typeof rtagz === 'object' && !Array.isArray(rtagz)) {
    if (rtagz.concepts && typeof rtagz.concepts === 'object') {
      rtagzObj = rtagz;
    } else if (rtagz._rtagz && typeof rtagz._rtagz === 'object') {
      rtagzObj = rtagz._rtagz;
      if (fallbackSource === undefined && rtagz.items) fallbackSource = rtagz.items;
    } else if (fallbackSource === undefined) {
      fallbackSource = rtagz;
    }
  } else if (fallbackSource === undefined && rtagz !== undefined) {
    fallbackSource = rtagz;
  }

  const systemNames = rtagzObj && rtagzObj.systems && typeof rtagzObj.systems === 'object'
    ? Object.keys(rtagzObj.systems)
    : [];

  if (rtagzObj && rtagzObj.concepts) {
    const list = Array.isArray(rtagzObj.concepts) ? rtagzObj.concepts : null;
    let concept;
    if (list) {
      concept = list.find((c) => c && c.id === canonical)
        || list.find((c) => c && c.canonical === canonical);
    } else {
      concept = rtagzObj.concepts[canonical]
        || Object.values(rtagzObj.concepts).find((c) => c && typeof c === 'object' && c.id === canonical);
    }
    if (!concept || typeof concept !== 'object') return null;
    const label = typeof concept.canonical === 'string' && concept.canonical ? concept.canonical : canonical;

    const rawForms = concept.forms && typeof concept.forms === 'object' ? concept.forms : {};
    const forms = [];
    for (const system of orderedSystems(rawForms, systemNames)) {
      const spellings = spellingsOf(rawForms[system]);
      if (spellings.length) forms.push({ system, spellings });
    }

    // Nothing to show: one system writing the canonical, no scheme naming
    // the concept otherwise, and no mapping.
    const prefLabels = concept.prefLabel && typeof concept.prefLabel === 'object' ? Object.values(concept.prefLabel) : [];
    const otherLabel = prefLabels.some((l) => typeof l === 'string' && l && l !== label);
    const anyMapping = Array.isArray(concept.mappings) && concept.mappings.length > 0;
    if (!hasExtraBeyondCanonical(forms, label) && !otherLabel && !anyMapping) return null;

    const rank = Array.isArray(concept.rank)
      ? concept.rank.map((r) => ({
          label: r.label,
          score: r.score,
          parts: r.parts ? { ...r.parts } : {},
        }))
      : [];

    const info = {
      canonical: label,
      pinned: Boolean(concept.pinned),
      discovered: Boolean(concept.discovered),
      items: typeof concept.items === 'number' ? concept.items : 0,
      forms,
      rank,
    };
    if (typeof concept.id === 'string' && concept.id) info.id = concept.id;
    if (Array.isArray(concept.inScheme) && concept.inScheme.length) info.inScheme = [...concept.inScheme];
    if (concept.prefLabel && typeof concept.prefLabel === 'object' && Object.keys(concept.prefLabel).length) {
      info.prefLabel = { ...concept.prefLabel };
    }
    if (concept.altLabel && typeof concept.altLabel === 'object' && Object.keys(concept.altLabel).length) {
      info.altLabel = {};
      for (const [scheme, labels] of Object.entries(concept.altLabel)) {
        info.altLabel[scheme] = Array.isArray(labels) ? [...labels] : labels;
      }
    }
    if (Array.isArray(concept.broader) && concept.broader.length) info.broader = [...concept.broader];
    if (Array.isArray(concept.mappings) && concept.mappings.length) {
      info.mappings = concept.mappings.map((m) => (m && typeof m === 'object' ? { ...m } : m));
    }
    return info;
  }

  if (fallbackSource !== undefined && fallbackSource !== null) {
    return fromReferences(fallbackSource, canonical, systemNames);
  }

  return null;
}

// The largest of freq, cover, trust, quality in the top rank entry, spelled
// out in words as frequency, coverage, trust, quality; or null when absent.
function winningPart(rank) {
  const top = Array.isArray(rank) ? rank[0] : rank;
  const parts = top && top.parts && typeof top.parts === 'object' ? top.parts : null;
  if (!parts) return null;
  let bestWord = null;
  let bestVal = -Infinity;
  for (const [key, word] of PART_NAMES) {
    const v = Number(parts[key]);
    if (Number.isFinite(v) && v > bestVal) {
      bestVal = v;
      bestWord = word;
    }
  }
  return bestWord;
}

// feed._rtagz from a feed or the summary itself, or null.
function summaryOf(rtagz) {
  if (!rtagz || typeof rtagz !== 'object' || Array.isArray(rtagz)) return null;
  if (rtagz._rtagz && typeof rtagz._rtagz === 'object') return rtagz._rtagz;
  return rtagz;
}

// A scheme's name as the panel shows it: its label in _rtagz.schemes (the
// site's own scheme carries the site's title there), else its id.
function schemeName(summary, id) {
  const list = summary && Array.isArray(summary.schemes) ? summary.schemes : [];
  const s = list.find((x) => x && x.id === id);
  return s && typeof s.label === 'string' && s.label ? s.label : id;
}

// What a mapping's target is called: one of rosetta-tagz's own concepts by its
// canonical, a published vocabulary's concept by its label there with the
// vocabulary named, else the target as written.
function targetName(summary, target) {
  const concepts = summary && Array.isArray(summary.concepts) ? summary.concepts : [];
  const own = concepts.find((c) => c && c.id === target);
  if (own && typeof own.canonical === 'string' && own.canonical) return own.canonical;
  const ext = summary && summary.external && typeof summary.external === 'object' ? summary.external[target] : null;
  if (ext) {
    const scheme = typeof ext.scheme === 'string' && ext.scheme ? ext.scheme
      : (typeof target === 'string' && target.includes(':') ? target.slice(0, target.indexOf(':')) : '');
    let label = '';
    if (typeof ext.prefLabel === 'string') label = ext.prefLabel;
    else if (ext.prefLabel && typeof ext.prefLabel === 'object') {
      label = typeof ext.prefLabel[scheme] === 'string' ? ext.prefLabel[scheme] : (Object.values(ext.prefLabel).find((v) => typeof v === 'string' && v) || '');
    }
    if (label) return scheme ? `${label} (${schemeName(summary, scheme)})` : label;
  }
  return String(target);
}

// The lines shown beside a tag bubble:
//   one "<system> writes <spellings>" line per system, and "named by
//   <winning part>" when a rank entry is present;
//   the concept's label in each scheme, "in <scheme>: <label>", the site's
//   own scheme first and named by the site's title as the panel names it
//   (options.rtagz, feed._rtagz, gives the scheme names), then the others in
//   the concept's inScheme order;
//   each mapping, "<type> <target> · weight <w>", the target named by
//   targetName;
//   for a bubble standing for several tags at the depth chosen,
//   "stands for <member>, <member>, …" (options.members, their labels).
// info may be null when only the members have something to say.
function tagFormsLines(info, { rtagz, members } = {}) {
  const lines = [];
  if (info && Array.isArray(info.forms)) {
    for (const f of info.forms) lines.push(`${f.system} writes ${(f.spellings || []).map((s) => s.label).join(', ')}`);
  }
  const winner = info && lines.length ? winningPart(info.rank) : null;
  if (winner) lines.push(`named by ${winner}`);
  const summary = summaryOf(rtagz);
  if (info && info.prefLabel && typeof info.prefLabel === 'object') {
    const order = ['site', ...(Array.isArray(info.inScheme) ? info.inScheme : []), ...Object.keys(info.prefLabel)];
    const seen = new Set();
    for (const scheme of order) {
      if (seen.has(scheme)) continue;
      seen.add(scheme);
      const label = info.prefLabel[scheme];
      if (typeof label === 'string' && label) lines.push(`in ${schemeName(summary, scheme)}: ${label}`);
    }
  }
  if (info && Array.isArray(info.mappings)) {
    for (const m of info.mappings) {
      if (!m || typeof m.type !== 'string' || typeof m.target !== 'string') continue;
      const w = typeof m.weight === 'number' && Number.isFinite(m.weight) ? ` · weight ${m.weight}` : '';
      lines.push(`${m.type} ${targetName(summary, m.target)}${w}`);
    }
  }
  const names = Array.isArray(members) ? members.filter((x) => typeof x === 'string' && x) : [];
  if (names.length > 1) lines.push(`stands for ${names.join(', ')}`);
  return lines;
}

module.exports = { tagForms, winningPart, tagFormsLines };
