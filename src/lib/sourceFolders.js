// sourceFolders — group and filter OPML sources by their folder hierarchy.
//
// opml.js preserves each <outline>'s container path as `source.folder`
// (e.g. 'Tech', 'Science/Biology', or '' at the top level).
//
// Provisional switch: settings.topBar.groupByFolder (default false, so
// existing flat sites do not change).

function normalizeFolder(folder) {
  if (typeof folder !== 'string') return '';
  return folder
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
    .join('/');
}

function groupByFolderEnabled(settings) {
  if (!settings || typeof settings !== 'object') return false;
  if (settings.topBar && typeof settings.topBar === 'object' && settings.topBar.groupByFolder === true) {
    return true;
  }
  if (settings.groupByFolder === true) return true;
  return false;
}

function folderAncestors(folderPath) {
  const norm = normalizeFolder(folderPath);
  if (!norm) return [];
  const parts = norm.split('/');
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    out.push(parts.slice(0, i + 1).join('/'));
  }
  return out;
}

function matchesFolderFilter(source, folderPrefix) {
  const prefix = normalizeFolder(folderPrefix);
  if (!prefix) return true;
  const f = normalizeFolder(source && source.folder);
  return f === prefix || f.startsWith(prefix + '/');
}

function filterSourcesByFolder(sources, folderPrefix) {
  const list = Array.isArray(sources) ? sources : [];
  const prefix = normalizeFolder(folderPrefix);
  if (!prefix) return list.slice();
  return list.filter((s) => matchesFolderFilter(s, prefix));
}

/**
 * Group sources by their OPML `folder` path in first-seen order.
 *
 * @param {Array} sources
 * @returns {Array<{ folder: string, label: string, sources: Array, itemCount: number }>}
 */
function groupSourcesByFolder(sources) {
  const list = Array.isArray(sources) ? sources : [];
  const byFolder = new Map();
  for (const src of list) {
    if (!src) continue;
    const folder = normalizeFolder(src.folder);
    if (!byFolder.has(folder)) {
      const parts = folder ? folder.split('/') : [];
      byFolder.set(folder, {
        folder,
        label: parts.length ? parts[parts.length - 1] : '',
        depth: parts.length,
        sources: [],
        itemCount: 0,
      });
    }
    const group = byFolder.get(folder);
    group.sources.push(src);
    group.itemCount += Number(src.itemCount) || 0;
  }
  return Array.from(byFolder.values());
}

/**
 * Determine which source ids to toggle when a folder pill is clicked:
 * if every source under `folderPrefix` is already hidden, return all of them
 * to show; otherwise return the currently visible ones to hide.
 *
 * @param {Array} sources
 * @param {string} folderPrefix
 * @param {Set<string>|Array<string>} hiddenSources
 * @returns {{ action: 'show' | 'hide', ids: string[] }}
 */
function toggleFolderSources(sources, folderPrefix, hiddenSources) {
  const hidden = hiddenSources instanceof Set
    ? hiddenSources
    : new Set(Array.isArray(hiddenSources) ? hiddenSources : []);
  const matching = filterSourcesByFolder(sources, folderPrefix);
  const allHidden = matching.length > 0 && matching.every((s) => hidden.has(s.id));
  if (allHidden) {
    return { action: 'show', ids: matching.map((s) => s.id) };
  }
  return {
    action: 'hide',
    ids: matching.filter((s) => !hidden.has(s.id)).map((s) => s.id),
  };
}

module.exports = {
  normalizeFolder,
  groupByFolderEnabled,
  folderAncestors,
  matchesFolderFilter,
  filterSourcesByFolder,
  groupSourcesByFolder,
  toggleFolderSources,
};
