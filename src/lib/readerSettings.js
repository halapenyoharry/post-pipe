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

module.exports = { progressBarMode, allowDownload, PROGRESS_BARS };
