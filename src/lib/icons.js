// The engine's own icons: SVG bodies from Lucide (ISC; the license text is in
// THIRD-PARTY-LICENSES.md), each on a 24-unit box, drawn as inline SVG. No
// icon font, nothing fetched. A body is the markup inside <svg>, as Iconify
// keeps it, so a site's own icons (settings.topBar.links[].icon and the like)
// are drawn the same way.

const STROKE = (inner) => `<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">${inner}</g>`;

const ICONS = {
  'undo-2': STROKE('<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>'),
  'redo-2': STROKE('<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"/>'),
  'rotate-ccw': STROKE('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'),
  hourglass: STROKE('<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>'),
  settings: STROKE('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'),
  check: STROKE('<path d="M20 6 9 17l-5-5"/>'),
  'sliders-horizontal': STROKE('<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>'),
  x: STROKE('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  link: STROKE('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
  'arrow-left': STROKE('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>'),
  'arrow-right': STROKE('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
  bookmark: STROKE('<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>'),
  'maximize-2': STROKE('<path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/>'),
  'minimize-2': STROKE('<path d="m14 10 7-7"/><path d="M20 10h-6V4"/><path d="m3 21 7-7"/><path d="M4 14h6v6"/>'),
  minus: STROKE('<path d="M5 12h14"/>'),
  'move-horizontal': STROKE('<path d="m18 8 4 4-4 4"/><path d="M2 12h20"/><path d="m6 8-4 4 4 4"/>'),
  list: STROKE('<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>'),
  info: STROKE('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
  download: STROKE('<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>'),
};

// The body of one of the engine's icons, or '' for a name it does not have.
const iconBody = (name) => ICONS[name] || '';

// A site's icon: an SVG body string for a 24-unit box. Anything else is
// none; a whole <svg> element is unwrapped to its body; scripts, event
// handlers and foreign objects are not drawn.
function siteIcon(v) {
  if (typeof v !== 'string') return '';
  let s = v.trim();
  if (!s || s.indexOf('<') < 0) return '';
  const whole = s.match(/^<svg\b[^>]*>([\s\S]*)<\/svg>$/i);
  if (whole) s = whole[1].trim();
  if (/<\s*(script|foreignObject|iframe)\b/i.test(s) || /\son\w+\s*=/i.test(s) || /javascript:/i.test(s)) return '';
  return s;
}

module.exports = { ICONS, iconBody, siteIcon };
