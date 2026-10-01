// Which theme the page wears and in which mode. settings.theme.name picks the
// site's theme ('default', the original dark look, or 'sketchbook', paper
// and pencil); a viewer can choose another in the panel (viewState
// preferences theme and mode). A theme with a light and a dark variant
// follows the device (prefers-color-scheme) unless the viewer picks one.

const THEMES = {
  default: { id: 'default', label: 'Default', modes: ['dark'] },
  sketchbook: { id: 'sketchbook', label: 'Sketchbook', modes: ['light', 'dark'] },
};

function themeName(settings, pref) {
  if (pref && THEMES[pref]) return pref;
  const n = settings && settings.theme && settings.theme.name;
  return THEMES[n] ? n : 'default';
}

function themeMode(name, pref, prefersDark) {
  const modes = (THEMES[name] || THEMES.default).modes;
  if (pref && modes.includes(pref)) return pref;
  if (modes.length === 1) return modes[0];
  return prefersDark ? 'dark' : 'light';
}

module.exports = { THEMES, themeName, themeMode };
