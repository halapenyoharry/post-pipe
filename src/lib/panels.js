// The two panels made from the one settings surface (src/components/Settings):
// the main view's, from the sliders in the top bar, and the reader's, from
// the sliders in the reader's header. Each group says where it belongs, and
// a panel shows only its own groups: nothing of the reader's is in the main
// view's panel, and nothing of the main view's is in the reader's.
//
//   "panels": { "graph": { "title": "..." }, "reader": { "title": "..." } }
//
// graph   the look (theme, the time of day background, the graph's colors),
//         the view (zoom to fit, all containers closed or open, unpin, sizes,
//         the layout when shown), and the reader's memory (reset, forget)
// reader  how the text reads: face, size, paragraphs, the reading aids, the
//         voice and its speed, and light or dark paper when the page itself
//         is held dark by the cover (then the mode changes only the reader)

const { openingConfig } = require('./opening');

const GROUPS = [
  { id: 'look', where: 'graph', title: 'Look' },
  { id: 'view', where: 'graph', title: 'View' },
  { id: 'memory', where: 'graph', title: 'What this device remembers' },
  { id: 'reading', where: 'reader', title: 'Reading' },
  { id: 'paper', where: 'reader', title: 'Paper' },
  { id: 'listening', where: 'reader', title: 'Listening' },
];

const DEFAULT_TITLES = { graph: 'Things to change', reader: 'Reading' };

const whereOf = (w) => (w === 'reader' ? 'reader' : 'graph');

function panelTitle(settings, where) {
  const w = whereOf(where);
  const p = settings && settings.panels && settings.panels[w];
  return p && typeof p.title === 'string' && p.title.trim() ? p.title.trim() : DEFAULT_TITLES[w];
}

// Light or dark paper changes only the reader when a cover with a dark
// ground holds the page dark (src/components/Theme).
function modeInReader(settings) {
  const cover = openingConfig(settings);
  return !!(cover && cover.ground === 'dark');
}

// The groups a panel shows, in order. readable: the site has something to
// read; voice: a voice is on this page; modes: the theme has light and dark.
function panelGroups(where, { settings = null, readable = true, voice = false, modes = 1 } = {}) {
  const w = whereOf(where);
  const paperInReader = modeInReader(settings);
  return GROUPS.filter((g) => {
    if (g.where !== w) return false;
    if (g.id === 'reading') return readable;
    if (g.id === 'listening') return readable && voice;
    if (g.id === 'paper') return readable && paperInReader && modes > 1;
    return true;
  });
}

module.exports = { GROUPS, panelTitle, panelGroups, modeInReader, whereOf };
