// Small switches on settings.reader, read in one place so the reader and the
// tests agree on the defaults.

const PROGRESS_BARS = ['top', 'side', 'none'];

// settings.reader.progressBar: top (a horizontal bar along the top edge of
// the reader, the default), side (a vertical bar down its right edge), none.
function progressBarMode(settings) {
  const v = settings && settings.reader && settings.reader.progressBar;
  return PROGRESS_BARS.includes(v) ? v : 'top';
}

module.exports = { progressBarMode, PROGRESS_BARS };
