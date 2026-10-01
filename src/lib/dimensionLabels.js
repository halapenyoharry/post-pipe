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

// The tooltip a renamed dimension gets when only its name was given.
const RENAMED_TITLE = {
  time: (l) => `${l}: the date each piece was published`,
  commits: (l) => `Edit history: one link per bucket of ${l}`,
  narrative: (l) => `${l}: reading order, 0 to 1`,
  chronology: (l) => `${l}: position in story-world time`,
};

function dimensionLabels(settings) {
  const over = (settings && settings.dimensions && settings.dimensions.labels) || {};
  return DIMENSIONS.map((d) => {
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

module.exports = { dimensionLabels, DIMENSIONS };
