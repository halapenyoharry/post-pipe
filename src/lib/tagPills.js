// How the graph draws its tag nodes (the tagz): the site's settings.graph.tag
// and the reader's choices in the panel, kept on the device in viewState.
//
//   show    settings.graph.tag.show, on unless it is false, and the
//           preference showTags: whether the tags are drawn at all. Off, no
//           tag and no edge to one is drawn, and none takes a tap; a tag
//           picked in the tag list still shows its pill while it is picked.
//   labels  settings.graph.tag.labels, off unless it is true, and the
//           preference showTagLabels (provisional): whether each tag shows
//           its text, the pill. Off, each tag is a dot (its mark, of radius
//           settings.graph.tag.markRadius, provisional, 7 graph units by
//           default) with every edge to it; a tag hovered, or picked with its
//           relatives, shows its pill. It counts only while show is on.
//
// The reader's choice wins; null means the site's own.
//
// Neither moves anything. A hidden pill or a dot is only drawn differently:
// the tag node stays in the simulation with its pill's footprint and keeps
// pulling its cards, so the layout is the same in every state, and neither
// setting is part of the layout key (layoutKey.js).
//
// Pure, so the panel, the graph and the tests agree.

// ViewState preference keys (provisional).
const PREF = 'showTags';
const LABELS_PREF = 'showTagLabels';

// A dot's radius in graph units when the site names none (provisional).
const MARK_RADIUS = 7;
// The radius of the transparent circle round a dot that takes a tap, in
// graph units: 44 across, the usual touch target at zoom 1, never smaller
// than the dot itself.
const MARK_HIT_RADIUS = 22;

// The graph.tag block, from the whole settings or the graph block; null when
// there is none.
function tagBlockOf(settings) {
  if (!settings || typeof settings !== 'object') return null;
  const graph = settings.graph && typeof settings.graph === 'object' ? settings.graph : settings;
  return graph.tag && typeof graph.tag === 'object' ? graph.tag : null;
}

// settings.graph.tag.show: on unless it is false.
function siteShowsTags(settings) {
  const tag = tagBlockOf(settings);
  return !(tag && tag.show === false);
}

// What is in force: the reader's choice (a boolean) when there is one, else
// the site's.
function showTagsChosen(pref, settings) {
  if (pref === true || pref === false) return pref;
  return siteShowsTags(settings);
}

// What to store for the reader's choice v: null when it is the site's own,
// so a later change to the site's default reaches a reader who never chose
// otherwise; else the boolean.
function showTagsPrefFor(v, settings) {
  const on = Boolean(v);
  return on === siteShowsTags(settings) ? null : on;
}

// settings.graph.tag.labels: off unless it is true.
function siteShowsTagLabels(settings) {
  const tag = tagBlockOf(settings);
  return Boolean(tag && tag.labels === true);
}

// The labels in force: the reader's choice (a boolean) when there is one,
// else the site's.
function showTagLabelsChosen(pref, settings) {
  if (pref === true || pref === false) return pref;
  return siteShowsTagLabels(settings);
}

// What to store for the reader's choice of labels: null when it is the
// site's own, else the boolean.
function showTagLabelsPrefFor(v, settings) {
  const on = Boolean(v);
  return on === siteShowsTagLabels(settings) ? null : on;
}

// How the tags are drawn, from the two preferences (null for the site's own)
// and the settings: 'hidden' (show off: no tag, no edge to one), 'pills'
// (show and labels on: each tag its pill) or 'marks' (show on, labels off,
// the default: each tag a dot, every edge to it drawn).
function tagDrawing(showPref, labelsPref, settings) {
  if (!showTagsChosen(showPref, settings)) return 'hidden';
  return showTagLabelsChosen(labelsPref, settings) ? 'pills' : 'marks';
}

// settings.graph.tag.markRadius when it is a number above 0, else
// MARK_RADIUS.
function tagMarkRadius(settings) {
  const tag = tagBlockOf(settings);
  const r = tag && tag.markRadius !== null && tag.markRadius !== '' && tag.markRadius !== undefined
    ? Number(tag.markRadius) : NaN;
  return Number.isFinite(r) && r > 0 ? r : MARK_RADIUS;
}

// The hit circle's radius round a dot of radius r.
function tagMarkHitRadius(r) {
  const n = Number(r);
  return Math.max(MARK_HIT_RADIUS, Number.isFinite(n) ? n : 0);
}

module.exports = {
  PREF, LABELS_PREF, MARK_RADIUS, MARK_HIT_RADIUS,
  siteShowsTags, showTagsChosen, showTagsPrefFor,
  siteShowsTagLabels, showTagLabelsChosen, showTagLabelsPrefFor,
  tagDrawing, tagMarkRadius, tagMarkHitRadius,
};
