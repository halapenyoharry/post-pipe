// What the dimensions are called wherever a reader sees them (the bottom
// bar's buttons and their tooltips). settings.dimensions.labels renames any
// of them: a string is the new name, or { label, title } sets the tooltip
// too. Engine defaults are the names they always had.

const DIMENSIONS = [
  { id: 'time', label: 'published', title: 'Published date' },
  { id: 'commits', label: 'commits', title: 'Edit history: one link per commit bucket' },
  { id: 'narrative', label: 'narrative', title: 'Narrative position: reading order, 0 to 1' },
  { id: 'chronology', label: 'chronology', title: 'Chronological position in story-world time' },
];

// Dimensions that lay an edge layer over the graph rather than a rail beside
// it. Each turns on and off by itself, and is off until the reader turns it on.
const LAYERS = [
  { id: 'readers', label: 'readers', title: "Readers' connections: links readers drew between chapters (not the book's own)" },
];

// The tooltip a renamed dimension gets when only its name was given.
const RENAMED_TITLE = {
  readers: (l) => `${l}: links readers drew between chapters (not the book's own)`,
  time: (l) => `${l}: the date each piece was published`,
  commits: (l) => `Edit history: one link per bucket of ${l}`,
  narrative: (l) => `${l}: reading order, 0 to 1`,
  chronology: (l) => `${l}: position in story-world time`,
};

function dimensionLabels(settings, list = DIMENSIONS) {
  const over = (settings && settings.dimensions && settings.dimensions.labels) || {};
  return list.map((d) => {
    const o = over[d.id];
    if (typeof o === 'string' && o.trim()) {
      const label = o.trim();
      return { ...d, label, title: RENAMED_TITLE[d.id](label) };
    }
    if (o && typeof o === 'object') {
      const label = (o.label && String(o.label).trim()) || d.label;
      const title = (o.title && String(o.title).trim()) || (label !== d.label ? RENAMED_TITLE[d.id](label) : d.title);
      return { ...d, label, title };
    }
    return { ...d };
  });
}

const layerLabels = (settings) => dimensionLabels(settings, LAYERS);

// What the group of dimensions is called where a reader sees it (the bottom
// bar's label, the More sheet's heading): settings.dimensions.groupLabel,
// 'dimensions' by default.
const GROUP_LABEL = 'dimensions';
function dimensionGroupLabel(settings) {
  const g = settings && settings.dimensions && settings.dimensions.groupLabel;
  return typeof g === 'string' && g.trim() ? g.trim() : GROUP_LABEL;
}

module.exports = { dimensionLabels, layerLabels, dimensionGroupLabel, DIMENSIONS, LAYERS, GROUP_LABEL };
