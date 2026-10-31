// Signal registry. Each signal turns a corpus into pair-evidence records:
//   {a, b, signal, score, why}      a < b, both are term norms
// External scorers (embeddings, an LLM, anything) can emit the same records as JSONL and be
// merged in by rtz-stone --pairs, so the engine never needs to know how they were computed.
import { lexicalSignals } from './lexical.js';
import { acronymSignals } from './acronym.js';
import { seedSignals } from './seed.js';
import { textSignals } from './textsim.js';
import { anchorSignals } from './anchor.js';

export const SIGNAL_GROUPS = {
  lexical: (c, caps) => lexicalSignals(c, caps),
  acronym: (c, caps) => acronymSignals(c, caps),
  seed: (c, caps, ctx) => seedSignals(c, caps, ctx.seeds),
  text: (c, caps) => textSignals(c, caps),
  anchor: (c, caps) => anchorSignals(c, caps),
};

export function computeSignals(corpus, cfg, { seeds = [], only = null } = {}) {
  const out = [];
  for (const [name, fn] of Object.entries(SIGNAL_GROUPS)) {
    if (only && !only.includes(name)) continue;
    out.push(...fn(corpus, cfg.signals, { seeds }));
  }
  return out;
}
