// The rights line a site shows wherever its text appears: in the reader,
// on the graph page, and on every piece's own page. From settings.rights:
// { holder, year, statement, noAiTraining, position }.

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// "© 2026 Holder. Statement". When noAiTraining is set and the statement
// does not already say so, a sentence saying it is added. null without a
// holder.
function rightsLine(rights) {
  if (!rights || !rights.holder) return null;
  const head = `© ${rights.year ? rights.year + ' ' : ''}${rights.holder}.`;
  let statement = (rights.statement || '').trim();
  if (rights.noAiTraining && !/train/i.test(statement)) {
    statement = (statement ? statement + ' ' : '') + 'Not to be used to train any machine-learning system.';
  }
  return statement ? `${head} ${statement}` : head;
}

// The head tags: copyright, and a no-AI robots line when asked for.
function rightsMeta(rights) {
  if (!rights || !rights.holder) return '';
  let out = `<meta name="copyright" content="${escapeHtml(`${rights.holder}${rights.year ? ' ' + rights.year : ''}`)}">`;
  if (rights.noAiTraining) out += '\n<meta name="robots" content="noai, noimageai">';
  return out;
}

// Where the graph page draws its line (rights.position): 'bottom-edge', at
// the screen's very foot, or null for the engine's place (above where a
// bottom bar would be).
function rightsPosition(rights) {
  return rights && rights.position === 'bottom-edge' ? 'bottom-edge' : null;
}

// A footer for a page. The reader leaves a fetched page's footer out and
// draws its own line, so the text is never followed by it twice.
function rightsFooterHtml(rights) {
  const line = rightsLine(rights);
  const pos = rightsPosition(rights);
  return line ? `<footer class="pp-rights" data-rights${pos ? ` data-rights-position="${pos}"` : ''}>${escapeHtml(line)}</footer>` : '';
}

// Whether the line's box (a DOMRect-like { left, top, right, bottom }) meets
// any of the cards' boxes: then it fades so it never sits over one.
function rightsOverCards(line, cards) {
  if (!line || !(line.right > line.left) || !(line.bottom > line.top)) return false;
  return (cards || []).some((c) => c && c.right > c.left && c.bottom > c.top
    && c.left < line.right && line.left < c.right && c.top < line.bottom && line.top < c.bottom);
}

module.exports = { rightsLine, rightsMeta, rightsFooterHtml, rightsPosition, rightsOverCards };
