// A preset is a weight vector saved under a name, with the switches the
// programs read as defaults. A flag overrides a switch; nothing else does.

export const SWITCH_DEFAULTS = Object.freeze({
  degreePenalty: 'sqrt',       // none | sqrt | log
  recencyClock: 'calendar',    // calendar | session
  recencyHalfLifeDays: 365,
  tagMeasure: 'presence',      // presence | weight
  orderMode: 'score',          // score | walk
  walkStart: 'heaviest',       // heaviest | newest
  walkStartSource: null,       // source title string, or null for any source
  seam: 2,                     // a step longer than this many hops is a jump
  stability: 0.05,             // fraction of the score range, used only with --previous
});

export const DEGREE_PENALTIES = ['none', 'sqrt', 'log'];
export const RECENCY_CLOCKS = ['calendar', 'session'];
export const TAG_MEASURES = ['presence', 'weight'];
export const ORDER_MODES = ['score', 'walk'];
export const WALK_STARTS = ['heaviest', 'newest'];

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

/** Validate a preset's shape; return a normalised copy or throw with one plain sentence. */
export function normalisePreset(raw, what = 'preset') {
  if (!isPlainObject(raw)) throw new Error(`${what} is not an object`);
  if (typeof raw.name !== 'string' || !raw.name.trim()) throw new Error(`${what} has no name`);
  if (!isPlainObject(raw.weights)) throw new Error(`${what} has no weights object`);
  const weights = {};
  for (const [k, v] of Object.entries(raw.weights)) {
    if (k === 'source') {
      if (isPlainObject(v)) {
        const m = {};
        for (const [title, w] of Object.entries(v)) {
          if (!Number.isFinite(Number(w))) throw new Error(`${what} weights.source.${title} is not a number`);
          m[title] = Number(w);
        }
        weights.source = m;
      } else if (Number.isFinite(Number(v))) {
        weights.source = Number(v);
      } else {
        throw new Error(`${what} weights.source must be a map of source title to number`);
      }
      continue;
    }
    if (!Number.isFinite(Number(v))) throw new Error(`${what} weights.${k} is not a number`);
    weights[k] = Number(v);
  }
  if (weights.source === undefined) weights.source = {};
  const switches = { ...SWITCH_DEFAULTS };
  if (raw.switches !== undefined) {
    if (!isPlainObject(raw.switches)) throw new Error(`${what} switches is not an object`);
    for (const [k, v] of Object.entries(raw.switches)) {
      if (!(k in SWITCH_DEFAULTS)) throw new Error(`${what} has an unknown switch ${k}`);
      switches[k] = v;
    }
  }
  checkSwitches(switches, what);
  return {
    name: raw.name.trim(),
    description: typeof raw.description === 'string' ? raw.description : '',
    weights,
    switches,
  };
}

export function checkSwitches(s, what = 'switches') {
  if (!DEGREE_PENALTIES.includes(s.degreePenalty)) throw new Error(`${what}: degreePenalty must be one of ${DEGREE_PENALTIES.join(', ')}`);
  if (!RECENCY_CLOCKS.includes(s.recencyClock)) throw new Error(`${what}: recencyClock must be one of ${RECENCY_CLOCKS.join(', ')}`);
  if (!(Number(s.recencyHalfLifeDays) > 0)) throw new Error(`${what}: recencyHalfLifeDays must be a positive number`);
  if (!TAG_MEASURES.includes(s.tagMeasure)) throw new Error(`${what}: tagMeasure must be one of ${TAG_MEASURES.join(', ')}`);
  if (!ORDER_MODES.includes(s.orderMode)) throw new Error(`${what}: orderMode must be one of ${ORDER_MODES.join(', ')}`);
  if (!WALK_STARTS.includes(s.walkStart)) throw new Error(`${what}: walkStart must be one of ${WALK_STARTS.join(', ')}`);
  if (s.walkStartSource === undefined || s.walkStartSource === '') s.walkStartSource = null;
  if (s.walkStartSource !== null && typeof s.walkStartSource !== 'string') {
    throw new Error(`${what}: walkStartSource must be a source title string or null`);
  }
  if (!(Number(s.seam) >= 0)) throw new Error(`${what}: seam must be a number of hops, 0 or more`);
  if (!(Number(s.stability) >= 0)) throw new Error(`${what}: stability must be 0 or more`);
  s.recencyHalfLifeDays = Number(s.recencyHalfLifeDays);
  s.seam = Number(s.seam);
  s.stability = Number(s.stability);
  return s;
}

/** The weight of a feature in a preset: 0 when the preset does not name it. */
export function weightOf(preset, feature, sourceTitle) {
  if (feature === 'source') {
    const s = preset.weights.source;
    if (typeof s === 'number') return s;
    if (s && typeof s === 'object' && sourceTitle != null && Number.isFinite(s[sourceTitle])) return s[sourceTitle];
    return 1;
  }
  const w = preset.weights[feature];
  return Number.isFinite(w) ? w : 0;
}
