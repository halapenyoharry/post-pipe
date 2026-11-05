// untaggedBecause.js — the one line a card with no tagz carries, saying why.
//
// Written by the rosetta-tagz phase (src/lib/rtagz.js) onto every feed item
// that ends a build with no tagz, as `untaggedBecause` (provisional name,
// 2026-11-04, T46), from the facts rosetta-tagz reports in build.json's
// untagged entry (its reason codes and its queued candidates) and the site's
// own rtagz switches. Nothing is guessed: each line is true of the build that
// wrote it. The reader panel shows the line where the tag chips would be
// (src/components/ReaderPanel/ReaderPanel.jsx); the card on the canvas does
// not change. A site built without rosetta-tagz carries no such line, so its
// feed stays byte for byte what it was.
//
// The lines (provisional wording, the lead's from the T46 brief; the last one
// is the worker's, for the case the brief's four do not cover):
//
//   source gave none, discovery off          rtagz.discover is false, or
//                                            rosetta-tagz says discovery did
//                                            not run (noDiscovery)
//   source gave none, candidates queued (N)  rtagz.discover is "queue" and N
//                                            candidates would have tagged it
//   source gave none, nothing recurred       discovery ran and no phrase of
//                                            the text is on a second distinct
//                                            item (noRecurring, noCandidate,
//                                            nearCopy, or nothing queued)
//   emerge found no concept                  phrases recurred and discovery
//                                            refused every one (function word,
//                                            ignored, too common, incoherent,
//                                            under the floor, dropped, not
//                                            chosen), and emergence, which ran,
//                                            matched no concept in the text
//   source gave none, every phrase refused   the same, with emergence off
//
// Pure, no React and no Node-only API: the build writes it and the viewer
// reads it through untaggedBecauseOf, which looks on the item, else on the
// feed item a viewer node keeps as originalItem.

const DISCOVERY_OFF = 'source gave none, discovery off';
const NOTHING_RECURRED = 'source gave none, nothing recurred';
const EMERGE_NONE = 'emerge found no concept';
const EVERY_REFUSED = 'source gave none, every phrase refused';
const queuedLine = (n) => `source gave none, candidates queued (${n})`;

// The reason codes that mean no phrase of the text recurred on a second
// distinct item (rosetta-tagz/docs/FORMATS.md, "build.json and untagged items").
const NOT_RECURRING = new Set(['noRecurring', 'noCandidate', 'nearCopy']);

// entry: an item of build.json's untagged report (reason, reasons, candidates)
// as feed._rtagz.untagged carries it; settings: the site's rtagz switches,
// discover (true | 'queue' | false) and emerge (boolean). Returns the line.
function untaggedBecause(entry, { discover = false, emerge = true } = {}) {
  const e = entry && typeof entry === 'object' ? entry : {};
  const reasons = Array.isArray(e.reasons)
    ? e.reasons.filter((r) => typeof r === 'string' && r)
    : (typeof e.reason === 'string' && e.reason ? [e.reason] : []);
  if (!discover || reasons.includes('noDiscovery')) return DISCOVERY_OFF;
  const queued = e.candidates && typeof e.candidates === 'object' && Array.isArray(e.candidates.queued)
    ? e.candidates.queued.length
    : 0;
  if (queued > 0) return queuedLine(queued);
  if (reasons.length && reasons.every((r) => NOT_RECURRING.has(r))) return NOTHING_RECURRED;
  if (discover === 'queue' && !reasons.length) return NOTHING_RECURRED;
  if (emerge) return EMERGE_NONE;
  if (!reasons.length) return NOTHING_RECURRED;
  return EVERY_REFUSED;
}

// The line on a viewer item or a feed item, or null.
function untaggedBecauseOf(item) {
  if (!item || typeof item !== 'object') return null;
  if (typeof item.untaggedBecause === 'string' && item.untaggedBecause) return item.untaggedBecause;
  const original = item.originalItem;
  if (original && typeof original === 'object' && typeof original.untaggedBecause === 'string' && original.untaggedBecause) {
    return original.untaggedBecause;
  }
  return null;
}

module.exports = { untaggedBecause, untaggedBecauseOf };
