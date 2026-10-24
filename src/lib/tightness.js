// Tightness: the panel's slider for how close the cards sit in cluster. One
// number from 0 (loosest) to 1 (tightest) scales three of the simulation's
// settings together (settings.graph.simulation): the link distance, the charge
// and the collide padding. At 0.5 they are the site's own values, untouched.
// At the tight end the collide padding goes negative, about a quarter of the
// card's shorter side, so cards may overlap a little.
//
// Each setting runs straight from loose to the site's value over the first
// half and from the site's value to tight over the second, so the curve is
// continuous and monotone whatever a site configured.

const DEFAULTS = { linkDistance: 160, chargeStrength: -500, collidePadding: 10 };
const DEFAULT_CARD = { width: 180, height: 140 };

// Multipliers at the loose end (t = 0) and the tight end (t = 1).
const LOOSE = { linkDistance: 1.6, chargeStrength: 1.6, collidePadding: 2 };
const TIGHT = { linkDistance: 0.45, chargeStrength: 0.35 };
// The tight end of the collide padding is minus this fraction of the card's
// shorter side.
const TIGHT_OVERLAP = 0.25;

const num = (v, fallback) => (Number.isFinite(Number(v)) ? Number(v) : fallback);

// t clamped to [0, 1]; nothing, or anything that is not a number, is the middle.
function clampTightness(t) {
  if (t === null || t === undefined || t === '') return 0.5;
  const n = Number(t);
  if (!Number.isFinite(n)) return 0.5;
  return Math.max(0, Math.min(1, n));
}

// Two straight runs: loose -> site over [0, 0.5], site -> tight over [0.5, 1].
function run(loose, site, tight, t) {
  if (t <= 0.5) return loose + (site - loose) * (t / 0.5);
  return site + (tight - site) * ((t - 0.5) / 0.5);
}

// The three force settings at tightness t. sim is settings.graph.simulation
// (merged with its defaults or not); card gives the card's width and height.
function tightened(sim, t, card) {
  const s = sim && typeof sim === 'object' ? sim : {};
  const c = card && typeof card === 'object' ? card : {};
  const tt = clampTightness(t);
  const linkDistance = num(s.linkDistance, DEFAULTS.linkDistance);
  const chargeStrength = num(s.chargeStrength, DEFAULTS.chargeStrength);
  const collidePadding = num(s.collidePadding, DEFAULTS.collidePadding);
  const shorter = Math.min(num(c.width, DEFAULT_CARD.width), num(c.height, DEFAULT_CARD.height));
  return {
    linkDistance: run(linkDistance * LOOSE.linkDistance, linkDistance, linkDistance * TIGHT.linkDistance, tt),
    chargeStrength: run(chargeStrength * LOOSE.chargeStrength, chargeStrength, chargeStrength * TIGHT.chargeStrength, tt),
    collidePadding: run(collidePadding * LOOSE.collidePadding, collidePadding, -shorter * TIGHT_OVERLAP, tt),
  };
}

module.exports = { tightened, clampTightness, LOOSE, TIGHT, TIGHT_OVERLAP };
