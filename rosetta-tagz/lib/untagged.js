// Untagged items: every item of the universe that ends with no tag a viewer shows at the build's bar,
// and why, as far as the build knows. rtz-build writes the report into build.json. Nothing is forced
// onto an untagged item; this only says what happened.
//
// An item is untagged at the bar when none of its tags shows there: a tag shows when it has no
// `sourceRatio` or one at or above the bar (docs/FORMATS.md, "Trying another bar"). Its below-bar tags
// are listed in `under`, each with its ratio, so a viewer set lower can tell which cards it tags again;
// an item whose `under` is empty has no tag at any ratio. The reasons come from rtz-discover's report
// (`--report`), which says what became of each candidate phrase of the item's text; without one
// (discovery off) the only reason given is that no tag-system tagged it.

export const UNTAGGED_REASONS = ['underBar', 'queued', 'underFloor', 'nearCopy', 'tooCommon', 'incoherent', 'functionWord', 'ignored', 'dropped', 'notChosen', 'noRecurring', 'noCandidate', 'noDiscovery'];

// at most eight named in a sentence; the full lists are in `candidates`
const list = (xs, f) => xs.slice(0, 8).map(f).join(', ') + (xs.length > 8 ? `, and ${xs.length - 8} more` : '');
const ratio = (x) => (typeof x.sourceRatio === 'number' ? `${x.phrase ?? x.label} ${x.sourceRatio}` : `${x.phrase ?? x.label}`);
// a report written before a group existed (functionWord, ignored, queued since 2026-11-04) lacks the key
const group = (fate, k) => (Array.isArray(fate[k]) ? fate[k] : []);

// universe: universe.json; report: rtz-discover's report or null; bar: the source coherence ratio the
// build was made at (null when discovery did not run: then every tag shows).
export function untaggedReport(universe, report, bar) {
  const concepts = new Map((universe.concepts ?? []).map((c) => [c.id, c]));
  const fates = new Map();
  for (const [key, fate] of Object.entries(report?.untagged ?? {})) {
    for (const m of fate.members ?? [key]) fates.set(m, fate);
    fates.set(key, fate);
  }
  const shows = (t) => typeof bar !== 'number' || typeof t.sourceRatio !== 'number' || t.sourceRatio >= bar;
  const items = [];
  for (const it of universe.items ?? []) {
    const tags = it.tags ?? [];
    if (tags.some(shows)) continue;
    const under = tags
      .map((t) => ({ concept: t.c, label: concepts.get(t.c)?.canonical ?? t.c, origin: t.origin, sourceRatio: t.sourceRatio }))
      .sort((a, b) => b.sourceRatio - a.sourceRatio || (a.label < b.label ? -1 : 1));
    const fate = fates.get(it.key) ?? null;
    const reasons = [];
    const why = [];
    if (under.length) {
      reasons.push('underBar');
      why.push(`only tagz under the ${bar}× source coherence bar: ${list(under, ratio)}`);
    }
    if (!report) {
      reasons.push('noDiscovery');
      why.push('no tag-system tagged it, and discovery did not run');
    } else if (fate) {
      // below-bar candidates the build did not attach (no item chose them) are named here; the ones
      // it did attach are the `under` tags above
      const unattached = group(fate, 'underBar').filter((x) => !x.attached);
      if (unattached.length) {
        if (!reasons.includes('underBar')) reasons.push('underBar');
        why.push(`phrases under the ${bar}× bar that no item chose: ${list(unattached, ratio)}`);
      }
      // the queue: what would have tagged it, listed for a human instead of attached
      if (group(fate, 'queued').length) {
        reasons.push('queued');
        why.push(`candidates queued, none a tag until accepted in the overrides: ${list(fate.queued, ratio)}`);
      }
      if (group(fate, 'underFloor').length) {
        reasons.push('underFloor');
        why.push(`phrases under the ${report.floor ?? bar}× floor: ${list(fate.underFloor, ratio)}`);
      }
      if (group(fate, 'nearCopy').length) {
        reasons.push('nearCopy');
        why.push(`phrases that recur only in near-copies of one story, counted once: ${list(fate.nearCopy, (x) => `${x.phrase} (${x.items} items, ${x.df} counting near-copies once)`)}`);
      }
      if (group(fate, 'tooCommon').length) {
        reasons.push('tooCommon');
        why.push(`phrases on too many items (over ${report.maxDfRatio} of ${report.items}): ${list(fate.tooCommon, (x) => `${x.phrase} (${x.df})`)}`);
      }
      if (group(fate, 'incoherent').length) {
        reasons.push('incoherent');
        why.push(`phrases whose items are not alike without them: ${list(fate.incoherent, (x) => `${x.phrase} (${x.coherence}, under ${x.bar})`)}`);
      }
      if (group(fate, 'functionWord').length) {
        reasons.push('functionWord');
        why.push(`function words, never a tag whatever their score: ${list(fate.functionWord, (x) => `${x.phrase} (${x.df})`)}`);
      }
      if (group(fate, 'ignored').length) {
        reasons.push('ignored');
        why.push(`phrases the site's overrides ignore: ${list(fate.ignored, (x) => `${x.phrase} (${x.df})`)}`);
      }
      if (group(fate, 'dropped').length) {
        reasons.push('dropped');
        why.push(`hubs chosen and then left on fewer than ${report.minDf} items: ${list(fate.dropped, (x) => x.phrase)}`);
      }
      if (group(fate, 'notChosen').length) {
        reasons.push('notChosen');
        why.push(`hubs at the bar that no item chose: ${list(fate.notChosen, ratio)}`);
      }
      if (!reasons.length) {
        if (fate.candidates) {
          reasons.push('noRecurring');
          why.push(`none of its ${fate.candidates} candidate phrases recurs on another item`);
        } else {
          reasons.push('noCandidate');
          why.push('its text has no candidate phrase');
        }
      }
    } else if (!under.length) {
      // discovery ran but did not report the item: a tag-system tagged it and every tag was left out,
      // or an at-bar hub landed on another record of the same article
      reasons.push('noCandidate');
      why.push('discovery reported no candidate for it');
    }
    const entry = { key: it.key, source: it.source, id: it.id ?? keyId(it.key), title: it.title ?? '', reason: reasons[0], reasons, why, under };
    if (fate) {
      entry.candidates = {
        phrases: fate.candidates,
        single: fate.single,
        ...Object.fromEntries(['queued', 'underBar', 'underFloor', 'nearCopy', 'tooCommon', 'incoherent', 'functionWord', 'ignored', 'dropped', 'notChosen'].filter((k) => group(fate, k).length).map((k) => [k, fate[k]])),
      };
    }
    items.push(entry);
  }
  return { bar: typeof bar === 'number' ? bar : null, count: items.length, none: items.filter((x) => !x.under.length).length, items };
}

const keyId = (key) => {
  const i = key.indexOf('::');
  return i >= 0 ? key.slice(i + 2) : key;
};
