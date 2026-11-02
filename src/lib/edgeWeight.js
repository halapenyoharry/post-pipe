// Edge weights for the cluster layout (settings.graph.edgeWeights): every
// link's strength and distance follow an effective weight built from the same
// factors and formulas flow-score uses (the reference's own weight, the
// degree penalty under the same switch, and recency under the same clock and
// half-life) times a per-type weight.
//
// Pure, so it can be tested without the DOM.

const DAY_MS = 86400000;

const EDGE_WEIGHT_MODES = ['uniform', 'weighted'];
const DEGREE_PENALTIES = ['none', 'sqrt', 'log'];
const RECENCY_CLOCKS = ['calendar', 'session'];

// ViewState preference keys (provisional) for the panel's two rows.
const MODE_PREF = 'edgeWeights';
const PENALTY_PREF = 'degreePenalty';

const EDGE_WEIGHT_DEFAULTS = Object.freeze({
  mode: 'weighted',
  degreePenalty: 'sqrt',
  recencyClock: 'calendar',
  recencyHalfLifeDays: 365,
  recencyFloor: 0.2,
  distanceSpread: 1,
  weights: Object.freeze({
    tag: 1,
    broader: 1,
    related: 1,
    closeMatch: 1,
    broadMatch: 1,
    relatedMatch: 1,
    exactMatch: 1,
    authored: 1,
    topology: 1,
  }),
});

function isFiniteNum(v) {
  return v !== null && v !== undefined && v !== '' && typeof v !== 'boolean' && Number.isFinite(Number(v));
}

function parseMs(v) {
  if (v === null || v === undefined || v === '' || typeof v === 'boolean') return NaN;
  if (typeof v === 'number') return Number.isFinite(v) ? v : NaN;
  if (typeof v === 'string') return Date.parse(v);
  return NaN;
}

// The degree penalty: none -> n, sqrt -> sqrt(n), log -> log(1 + n); anything
// else -> sqrt(n). Equals flow's penalise(n, how).
function penalty(n, how) {
  const v = isFiniteNum(n) && Number(n) > 0 ? Number(n) : 0;
  if (how === 'none') return v;
  if (how === 'log') return Math.log1p(v);
  return Math.sqrt(v);
}

// Flow's recency x for one card (calendar or session), 0 when undated or
// unknown.
function recencyX(dateIso, newestMs, opts = {}) {
  const o = opts && typeof opts === 'object' ? opts : {};
  if (o.clock === 'session') {
    if (!isFiniteNum(o.rankIndex) || !isFiniteNum(o.count)) return 0;
    const r = Number(o.rankIndex);
    const n = Number(o.count);
    if (r < 0 || n <= 0 || r >= n) return 0;
    return n > 1 ? 1 - r / (n - 1) : 1;
  }
  const t = parseMs(dateIso);
  const newest = parseMs(newestMs);
  if (!Number.isFinite(t) || !Number.isFinite(newest)) return 0;
  const hl = isFiniteNum(o.halfLifeDays) && Number(o.halfLifeDays) > 0
    ? Number(o.halfLifeDays)
    : EDGE_WEIGHT_DEFAULTS.recencyHalfLifeDays;
  return Math.pow(0.5, Math.max(0, newest - t) / DAY_MS / hl);
}

function endId(e) {
  return e && typeof e === 'object' ? e.id : e;
}

// A Map id -> degree from a feed's edges (or the viewer's links), counting
// every edge whose layer is not containment at both ends.
function degreesOf(edges) {
  const deg = new Map();
  for (const e of edges || []) {
    if (!e || e.layer === 'containment' || e.role === 'contains') continue;
    const s = endId(e.source);
    const t = endId(e.target);
    if (typeof s === 'string' && s) deg.set(s, (deg.get(s) || 0) + 1);
    if (typeof t === 'string' && t && t !== s) deg.set(t, (deg.get(t) || 0) + 1);
  }
  return deg;
}

function extractRawBlock(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {};
  if (input.graph && typeof input.graph === 'object' && !Array.isArray(input.graph)) {
    const ew = input.graph.edgeWeights;
    return ew && typeof ew === 'object' && !Array.isArray(ew) ? ew : {};
  }
  if (input.edgeWeights && typeof input.edgeWeights === 'object' && !Array.isArray(input.edgeWeights)) {
    return input.edgeWeights;
  }
  return input;
}

// Fill defaults and fall back quietly on invalid values.
function normaliseEdgeWeights(settings) {
  const raw = extractRawBlock(settings);
  const mode = EDGE_WEIGHT_MODES.includes(raw.mode) ? raw.mode : EDGE_WEIGHT_DEFAULTS.mode;
  const degreePenalty = DEGREE_PENALTIES.includes(raw.degreePenalty) ? raw.degreePenalty : EDGE_WEIGHT_DEFAULTS.degreePenalty;
  const recencyClock = RECENCY_CLOCKS.includes(raw.recencyClock) ? raw.recencyClock : EDGE_WEIGHT_DEFAULTS.recencyClock;
  const recencyHalfLifeDays = isFiniteNum(raw.recencyHalfLifeDays) && Number(raw.recencyHalfLifeDays) > 0
    ? Number(raw.recencyHalfLifeDays)
    : EDGE_WEIGHT_DEFAULTS.recencyHalfLifeDays;
  const recencyFloor = isFiniteNum(raw.recencyFloor) && Number(raw.recencyFloor) >= 0 && Number(raw.recencyFloor) <= 1
    ? Number(raw.recencyFloor)
    : EDGE_WEIGHT_DEFAULTS.recencyFloor;
  const distanceSpread = isFiniteNum(raw.distanceSpread) && Number(raw.distanceSpread) >= 0
    ? Number(raw.distanceSpread)
    : EDGE_WEIGHT_DEFAULTS.distanceSpread;
  const weights = { ...EDGE_WEIGHT_DEFAULTS.weights };
  if (raw.weights && typeof raw.weights === 'object' && !Array.isArray(raw.weights)) {
    for (const [k, v] of Object.entries(raw.weights)) {
      if (k.startsWith('_')) continue;
      if (isFiniteNum(v)) weights[k] = Math.max(0, Number(v));
    }
  }
  return {
    mode,
    degreePenalty,
    recencyClock,
    recencyHalfLifeDays,
    recencyFloor,
    distanceSpread,
    weights,
  };
}

function isAuxId(id) {
  return typeof id === 'string' && (
    id.startsWith('tag:') || id.startsWith('topology:') || id.startsWith('reference:') || id.startsWith('container:')
  );
}

function lookupIn(mapOrObj, key) {
  if (!mapOrObj || key === null || key === undefined) return undefined;
  if (mapOrObj instanceof Map) return mapOrObj.get(key);
  if (typeof mapOrObj === 'object' && key in mapOrObj) return mapOrObj[key];
  return undefined;
}

function findNode(ctx, id, obj) {
  if (obj) return obj;
  if (!id || !ctx) return null;
  const fromMap = lookupIn(ctx.nodeById, id) ?? lookupIn(ctx.nodes, id) ?? lookupIn(ctx.cards, id);
  if (fromMap && typeof fromMap === 'object') return fromMap;
  if (Array.isArray(ctx.nodes)) {
    const n = ctx.nodes.find((x) => x && x.id === id);
    if (n) return n;
  }
  if (Array.isArray(ctx.cards)) {
    const n = ctx.cards.find((x) => x && x.id === id);
    if (n) return n;
  }
  return null;
}

function dateOfNode(node) {
  if (!node || typeof node !== 'object') return null;
  if (node.originalItem && typeof node.originalItem.date_published === 'string' && node.originalItem.date_published) {
    return node.originalItem.date_published;
  }
  if (typeof node.date_published === 'string' && node.date_published) return node.date_published;
  if (typeof node.date === 'string' && node.date) return node.date;
  return null;
}

function inferNewestMs(ctx, sNode, tNode) {
  let newest = null;
  const consider = (d) => {
    const t = parseMs(d);
    if (Number.isFinite(t) && (newest === null || t > newest)) newest = t;
  };
  if (ctx.dates instanceof Map) {
    for (const v of ctx.dates.values()) consider(v);
  } else if (ctx.dates && typeof ctx.dates === 'object') {
    for (const v of Object.values(ctx.dates)) consider(v);
  }
  const lists = [ctx.cards, ctx.nodes, ctx.items];
  for (const list of lists) {
    if (Array.isArray(list)) for (const item of list) consider(dateOfNode(item));
    else if (list instanceof Map) for (const item of list.values()) consider(dateOfNode(item));
  }
  consider(dateOfNode(sNode));
  consider(dateOfNode(tNode));
  return newest;
}

// Effective weight for one link:
//   raw * degreeFactor * recencyFactor * typeWeight
// Returns { eff, raw, degreeFactor, recencyFactor, typeWeight }.
function effectiveWeight(link, ctx = {}) {
  const c = ctx && typeof ctx === 'object' ? ctx : {};
  const ew = normaliseEdgeWeights(c.settings || c.edgeWeights || c);

  const wVal = link && isFiniteNum(link.weight)
    ? Number(link.weight)
    : (link && link.attrs && isFiniteNum(link.attrs.weight) ? Number(link.attrs.weight) : NaN);
  const raw = Number.isFinite(wVal) && wVal > 0 ? Math.min(1, wVal) : 1;

  const sObj = link && link.source && typeof link.source === 'object' ? link.source : null;
  const tObj = link && link.target && typeof link.target === 'object' ? link.target : null;
  const sId = sObj ? sObj.id : (link ? link.source : null);
  const tId = tObj ? tObj.id : (link ? link.target : null);
  const sNode = findNode(c, sId, sObj);
  const tNode = findNode(c, tId, tObj);

  const degMap = c.degrees || (Array.isArray(c.edges) ? degreesOf(c.edges) : null);
  const getDeg = (id, node) => {
    if (!degMap) return 0;
    const direct = lookupIn(degMap, id);
    if (isFiniteNum(direct)) return Number(direct);
    const origId = node && node.originalItem && node.originalItem.id;
    const orig = lookupIn(degMap, origId);
    return isFiniteNum(orig) ? Number(orig) : 0;
  };
  const ps = penalty(getDeg(sId, sNode), ew.degreePenalty);
  const pt = penalty(getDeg(tId, tNode), ew.degreePenalty);
  const denom = Math.sqrt(ps * pt);
  const degreeFactor = denom > 0 ? 1 / denom : 1;

  const isCardEnd = (id, node) => {
    if (node && typeof node.type === 'string') {
      return node.type === 'article' || node.type === 'card';
    }
    if (c.cardIds instanceof Set) return c.cardIds.has(id);
    return typeof id === 'string' && Boolean(id) && !isAuxId(id);
  };

  const newestMs = c.newestMs !== undefined ? c.newestMs : inferNewestMs(c, sNode, tNode);
  const rankMap = c.ranks || c.sessionRank || null;
  const totalCards = isFiniteNum(c.count)
    ? Number(c.count)
    : (isFiniteNum(c.cardCount)
      ? Number(c.cardCount)
      : (rankMap instanceof Map
        ? rankMap.size
        : (Array.isArray(c.cards) ? c.cards.length : undefined)));

  const cardX = (id, node) => {
    const pre = lookupIn(c.recencyById, id);
    if (isFiniteNum(pre)) return Math.max(0, Math.min(1, Number(pre)));
    const origId = node && node.originalItem && node.originalItem.id;
    const dateIso = lookupIn(c.dates, id) ?? lookupIn(c.dates, origId) ?? dateOfNode(node);
    const rankIndex = lookupIn(rankMap, id) ?? lookupIn(rankMap, origId) ?? (node && (node.rankIndex ?? node.index));
    return recencyX(dateIso, newestMs, {
      clock: ew.recencyClock,
      halfLifeDays: ew.recencyHalfLifeDays,
      rankIndex,
      count: totalCards,
    });
  };

  const sCard = isCardEnd(sId, sNode);
  const tCard = isCardEnd(tId, tNode);
  let x = 1;
  if (sCard && tCard) x = (cardX(sId, sNode) + cardX(tId, tNode)) / 2;
  else if (sCard) x = cardX(sId, sNode);
  else if (tCard) x = cardX(tId, tNode);
  const recencyFactor = ew.recencyFloor + (1 - ew.recencyFloor) * x;

  const layerName = link && (
    (link.layer === 'reference' && (link.refType || (link.attrs && link.attrs.type)))
    || link.layer
    || link.refType
    || ''
  );
  let typeWeight = 1;
  if (layerName && isFiniteNum(ew.weights[layerName])) {
    typeWeight = Math.max(0, Number(ew.weights[layerName]));
  } else if (link && link.layer && isFiniteNum(ew.weights[link.layer])) {
    typeWeight = Math.max(0, Number(ew.weights[link.layer]));
  }

  const eff = raw * degreeFactor * recencyFactor * typeWeight;
  return { eff, raw, degreeFactor, recencyFactor, typeWeight };
}

function linkStrength(eff) {
  if (!isFiniteNum(eff) || Number(eff) <= 0) return 0;
  return Math.min(1, Number(eff));
}

function linkDistance(eff, effMax, L, spread = EDGE_WEIGHT_DEFAULTS.distanceSpread) {
  const base = isFiniteNum(L) && Number(L) > 0 ? Number(L) : 160;
  const s = isFiniteNum(spread) && Number(spread) >= 0 ? Number(spread) : EDGE_WEIGHT_DEFAULTS.distanceSpread;
  if (!isFiniteNum(effMax) || Number(effMax) <= 0) return base;
  const max = Number(effMax);
  const e = isFiniteNum(eff) ? Math.max(0, Math.min(max, Number(eff))) : 0;
  return base * (1 + s * (1 - e / max));
}

// The hover line added in weighted mode:
//   pull 0.16: weight 1.00 × degree 0.32 × recency 0.70 × tag 1
function edgeWeightLine(link, factors) {
  if (!factors || typeof factors !== 'object') return '';
  const layer = (link && (
    (link.layer === 'reference' && (link.refType || (link.attrs && link.attrs.type)))
    || link.layer
    || link.refType
  )) || 'edge';
  const eff = Number(factors.eff || 0).toFixed(2);
  const raw = Number(factors.raw ?? 1).toFixed(2);
  const deg = Number(factors.degreeFactor ?? 1).toFixed(2);
  const rec = Number(factors.recencyFactor ?? 1).toFixed(2);
  const tw = Number(factors.typeWeight ?? 1);
  const twStr = Number.isInteger(tw) ? String(tw) : tw.toFixed(2);
  return `pull ${eff}: weight ${raw} × degree ${deg} × recency ${rec} × ${layer} ${twStr}`;
}

module.exports = {
  EDGE_WEIGHT_DEFAULTS,
  EDGE_WEIGHT_MODES,
  DEGREE_PENALTIES,
  RECENCY_CLOCKS,
  MODE_PREF,
  PENALTY_PREF,
  penalty,
  recencyX,
  degreesOf,
  effectiveWeight,
  linkStrength,
  linkDistance,
  normaliseEdgeWeights,
  edgeWeightLine,
};
