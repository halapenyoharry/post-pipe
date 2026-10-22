// What each tag-system calls a tag concept, and which part of the stone's
// ranking chose its canonical name (docs/STONE-SEAM.md).
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
    if (source.value !== undefined && source.value !== canonical) return out;
    out.push(source);
  }
  return out;
}

function fromReferences(source, canonical, systemNames) {
  const refs = collectReferences(source, canonical);
  if (!refs.length) return null;

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

// Given feed._stone (may be undefined) and a canonical label, returns null
// when there is nothing to show, else:
//   { canonical, pinned, discovered, items,
//     forms: [{ system, spellings: [{ label, count }] }],
//     rank: [{ label, score, parts }] }
// Accepts item-level _references entries (or items carrying _references) as a
// fallback when feed._stone is absent.
function tagForms(stone, canonical, fallback) {
  if (!canonical || typeof canonical !== 'string') return null;

  let stoneObj = null;
  let fallbackSource = fallback;

  if (stone && typeof stone === 'object' && !Array.isArray(stone)) {
    if (stone.concepts && typeof stone.concepts === 'object') {
      stoneObj = stone;
    } else if (stone._stone && typeof stone._stone === 'object') {
      stoneObj = stone._stone;
      if (fallbackSource === undefined && stone.items) fallbackSource = stone.items;
    } else if (fallbackSource === undefined) {
      fallbackSource = stone;
    }
  } else if (fallbackSource === undefined && stone !== undefined) {
    fallbackSource = stone;
  }

  const systemNames = stoneObj && stoneObj.systems && typeof stoneObj.systems === 'object'
    ? Object.keys(stoneObj.systems)
    : [];

  if (stoneObj && stoneObj.concepts) {
    const list = Array.isArray(stoneObj.concepts) ? stoneObj.concepts : null;
    const concept = list
      ? list.find((c) => c && c.canonical === canonical)
      : stoneObj.concepts[canonical];
    if (!concept || typeof concept !== 'object') return null;

    const rawForms = concept.forms && typeof concept.forms === 'object' ? concept.forms : {};
    const forms = [];
    for (const system of orderedSystems(rawForms, systemNames)) {
      const spellings = spellingsOf(rawForms[system]);
      if (spellings.length) forms.push({ system, spellings });
    }

    if (!hasExtraBeyondCanonical(forms, canonical)) return null;

    const rank = Array.isArray(concept.rank)
      ? concept.rank.map((r) => ({
          label: r.label,
          score: r.score,
          parts: r.parts ? { ...r.parts } : {},
        }))
      : [];

    return {
      canonical: concept.canonical || canonical,
      pinned: Boolean(concept.pinned),
      discovered: Boolean(concept.discovered),
      items: typeof concept.items === 'number' ? concept.items : 0,
      forms,
      rank,
    };
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

// The lines shown beside a tag bubble: one "<system> writes <spelling>" line
// per system, and "named by <winning part>" when a rank entry is present.
function tagFormsLines(info) {
  if (!info || !Array.isArray(info.forms) || info.forms.length === 0) return [];
  const lines = info.forms.map(
    (f) => `${f.system} writes ${(f.spellings || []).map((s) => s.label).join(', ')}`
  );
  const winner = winningPart(info.rank);
  if (winner) lines.push(`named by ${winner}`);
  return lines;
}

module.exports = { tagForms, winningPart, tagFormsLines };
