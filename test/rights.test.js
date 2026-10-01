// settings.rights shows as one line wherever the text appears, and every
// piece's own page carries it.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { rightsLine, rightsMeta, rightsFooterHtml } = require('../src/lib/rights');
const LocalFolderAdapter = require('../src/adapters/LocalFolderAdapter');

const RIGHTS = {
  holder: 'A Holder',
  year: '2026',
  statement: 'All rights reserved. Not to be used to train any machine-learning system without permission.',
  noAiTraining: true,
};

test('the rights line is the year, holder and statement', () => {
  assert.strictEqual(rightsLine(RIGHTS), '© 2026 A Holder. ' + RIGHTS.statement);
  assert.strictEqual(rightsLine(null), null);
  assert.strictEqual(rightsLine({ statement: 'x' }), null);
});

test('noAiTraining adds a sentence only when the statement does not already say it', () => {
  assert.strictEqual(rightsLine({ holder: 'H', year: '2026', statement: 'All rights reserved.', noAiTraining: true }),
    '© 2026 H. All rights reserved. Not to be used to train any machine-learning system.');
  assert.strictEqual(rightsLine({ holder: 'H', statement: 'All rights reserved.' }), '© H. All rights reserved.');
});

test('meta and footer', () => {
  assert.match(rightsMeta(RIGHTS), /<meta name="copyright" content="A Holder 2026">/);
  assert.match(rightsMeta(RIGHTS), /noai, noimageai/);
  assert.doesNotMatch(rightsMeta({ ...RIGHTS, noAiTraining: false }), /noai/);
  assert.match(rightsFooterHtml(RIGHTS), /^<footer class="pp-rights" data-rights>© 2026 A Holder\. All rights reserved\./);
  assert.strictEqual(rightsFooterHtml(null), '');
});

test('every piece page carries the rights line and meta', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-rights-'));
  const content = path.join(root, 'content');
  fs.mkdirSync(path.join(content, 'one'), { recursive: true });
  fs.writeFileSync(path.join(content, 'one', 'frontmatter.json'), JSON.stringify({ title: 'One' }));
  fs.writeFileSync(path.join(content, 'one', 'index.md'), 'Some text.');
  const pagesDir = path.join(root, 'pages');
  await LocalFolderAdapter.load({
    id: 'local', title: 't', path: content, pagesBase: 'http://test',
    coversDir: path.join(root, 'covers'), pagesDir, visibilityDefault: 'public', rights: RIGHTS,
  });
  const page = fs.readFileSync(path.join(pagesDir, 'one.html'), 'utf8');
  assert.match(page, /<meta name="copyright"/);
  assert.match(page, /<footer class="pp-rights" data-rights>© 2026 A Holder\./);
  assert.ok(page.indexOf('Some text.') < page.indexOf('pp-rights'), 'the line follows the text');
  fs.rmSync(root, { recursive: true, force: true });
});
