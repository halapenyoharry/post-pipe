// Small switches on settings.reader, read in one place so the reader and the
// tests agree on the defaults.

const PROGRESS_BARS = ['top', 'side', 'none'];

// settings.reader.progressBar: top (a horizontal bar along the top edge of
// the reader, the default), side (a vertical bar down its right edge), none.
function progressBarMode(settings) {
  const v = settings && settings.reader && settings.reader.progressBar;
  return PROGRESS_BARS.includes(v) ? v : 'top';
}

// settings.reader.allowDownload: whether the reader offers to download the
// piece as a file (Export). Default true; false removes the button.
function allowDownload(settings) {
  return !(settings && settings.reader && settings.reader.allowDownload === false);
}

// The faces the reader can choose for the text (Settings → Reading). Each
// non-default face ships with the page as a file next to it, with its
// license; nothing is fetched from anywhere else.
const READER_FONTS = {
  default: { id: 'default', label: 'Atkinson Hyperlegible', family: "'Atkinson', sans-serif" },
  opendyslexic: {
    id: 'opendyslexic',
    label: 'OpenDyslexic',
    family: "'OpenDyslexic', 'Atkinson', sans-serif",
    file: 'OpenDyslexic-Regular.woff2',
    license: 'OpenDyslexic-OFL.txt',
    licenseName: 'SIL Open Font License 1.1',
  },
};

// settings.reader.fonts: which faces are offered, in order. Default: the
// page's own face and OpenDyslexic. The page's own face is always offered.
function readerFonts(settings) {
  const list = settings && settings.reader && Array.isArray(settings.reader.fonts)
    ? settings.reader.fonts
    : ['default', 'opendyslexic'];
  const ids = ['default', ...list.filter((id) => id !== 'default' && READER_FONTS[id])];
  return [...new Set(ids)].map((id) => READER_FONTS[id]);
}

module.exports = { progressBarMode, allowDownload, readerFonts, READER_FONTS, PROGRESS_BARS };
