const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { siteRoot, expandHome, loadSiteEnv, ENGINE_ROOT, DEFAULT_SITE } = require('../src/lib/siteRoot');
const { ingestFolder } = require('../ingest');
const LocalFolderAdapter = require('../src/adapters/LocalFolderAdapter');

test('siteRoot: returns example site when POSTPIPE_SITE is unset, regardless of working directory', () => {
  const expected = path.resolve(__dirname, '..', 'examples', 'site');
  assert.strictEqual(DEFAULT_SITE, expected);
  assert.strictEqual(ENGINE_ROOT, path.resolve(__dirname, '..'));
  assert.ok(path.isAbsolute(expected));

  const origCwd = process.cwd();
  try {
    const r1 = siteRoot({});
    process.chdir(os.tmpdir());
    const r2 = siteRoot({});
    const r3 = siteRoot({ POSTPIPE_SITE: '   ' });
    assert.strictEqual(r1, expected);
    assert.strictEqual(r2, expected);
    assert.strictEqual(r3, expected);
  } finally {
    process.chdir(origCwd);
  }
});

test('siteRoot: POSTPIPE_SITE wins and a leading ~ expands', () => {
  const home = process.env.HOME || os.homedir();
  const prevHome = process.env.HOME;
  process.env.HOME = home;
  try {
    assert.strictEqual(
      siteRoot({ POSTPIPE_SITE: '~/my-site/sub' }),
      path.resolve(path.join(home, 'my-site', 'sub'))
    );
    assert.strictEqual(
      siteRoot({ POSTPIPE_SITE: '/tmp/explicit-site' }),
      path.resolve('/tmp/explicit-site')
    );
    assert.strictEqual(
      expandHome('~/example'),
      path.resolve(path.join(home, 'example'))
    );
  } finally {
    if (prevHome === undefined) delete process.env.HOME;
    else process.env.HOME = prevHome;
  }
});

test('loadSiteEnv: prefers site auth/.env over engine folder', () => {
  const tmpSite = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-site-env-'));
  try {
    fs.mkdirSync(path.join(tmpSite, 'auth'), { recursive: true });
    fs.writeFileSync(path.join(tmpSite, 'auth', '.env'), 'POSTPIPE_TEST_VAR=from_site\n', 'utf8');
    const logs = [];
    const res = loadSiteEnv(tmpSite, (m) => logs.push(m));
    assert.strictEqual(res.source, 'site');
    assert.strictEqual(res.path, path.join(tmpSite, 'auth', '.env'));
    assert.strictEqual(logs.length, 0);
    assert.strictEqual(process.env.POSTPIPE_TEST_VAR, 'from_site');
  } finally {
    delete process.env.POSTPIPE_TEST_VAR;
    fs.rmSync(tmpSite, { recursive: true, force: true });
  }
});

test('author fallback: piece with no author takes site author (name, else display); with no site author stays empty', async () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-author-'));
  const contentDir = path.join(tmpRoot, 'items');
  const coversDir = path.join(tmpRoot, 'covers');
  const pagesDir = path.join(tmpRoot, 'pages');

  try {
    // 1. Gen 2 (frontmatter.json) with no author
    fs.mkdirSync(path.join(contentDir, 'gen2-no-author'), { recursive: true });
    fs.writeFileSync(
      path.join(contentDir, 'gen2-no-author', 'frontmatter.json'),
      JSON.stringify({ title: 'Gen 2 Piece', posted: true })
    );
    fs.writeFileSync(path.join(contentDir, 'gen2-no-author', 'index.md'), 'Body text.');

    // 2. Gen 1 (index.qmd) with no author
    fs.mkdirSync(path.join(contentDir, 'qmd-no-author'), { recursive: true });
    fs.writeFileSync(
      path.join(contentDir, 'qmd-no-author', 'index.qmd'),
      '---\ntitle: Qmd Piece\nposted: true\n---\nBody text.\n'
    );

    // 3. Gen 0 (unstructured) with no author
    fs.mkdirSync(path.join(contentDir, 'unstructured-no-author'), { recursive: true });
    fs.writeFileSync(path.join(contentDir, 'unstructured-no-author', 'notes.md'), 'Just notes.');

    // 4. Piece with explicit author
    fs.mkdirSync(path.join(contentDir, 'with-author'), { recursive: true });
    fs.writeFileSync(
      path.join(contentDir, 'with-author', 'frontmatter.json'),
      JSON.stringify({ title: 'Authored Piece', meta: { author: 'Ada Lovelace' }, posted: true })
    );

    // Case A: no site author -> stays empty
    {
      const { contents } = ingestFolder(contentDir);
      for (const c of contents) {
        if (c.id === 'with-author') {
          assert.strictEqual(c.author, 'ada lovelace');
        } else {
          assert.strictEqual(c.author, '', `${c.id} should have empty author when no site settings provided`);
        }
      }

      const { items } = await LocalFolderAdapter.load({
        id: 'local://items',
        title: 'Items',
        path: contentDir,
        pagesBase: 'https://example.test',
        coversDir,
        pagesDir,
        visibilityDefault: 'public',
        settings: {},
      });

      for (const item of items) {
        if (item.url.endsWith('/with-author.html')) {
          assert.strictEqual(item.author, 'ada lovelace');
          assert.deepStrictEqual(item.authors, [{ name: 'ada lovelace', url: 'https://example.test/with-author.html' }]);
        } else {
          assert.strictEqual(item.author, '');
          assert.deepStrictEqual(item.authors, []);
        }
      }
    }

    // Case B: site author via settings.author.name
    {
      const settings = { author: { name: 'Jane Doe', display: 'J. Doe' } };
      const { contents } = ingestFolder(contentDir, { settings });
      for (const c of contents) {
        if (c.id === 'with-author') {
          assert.strictEqual(c.author, 'ada lovelace');
        } else {
          assert.strictEqual(c.author, 'jane doe');
        }
      }

      const { items } = await LocalFolderAdapter.load({
        id: 'local://items',
        title: 'Items',
        path: contentDir,
        pagesBase: 'https://example.test',
        coversDir,
        pagesDir,
        visibilityDefault: 'public',
        settings,
      });

      for (const item of items) {
        if (item.url.endsWith('/with-author.html')) {
          assert.strictEqual(item.author, 'ada lovelace');
        } else {
          assert.strictEqual(item.author, 'jane doe');
          assert.strictEqual(item.authors[0].name, 'jane doe');
        }
      }
    }

    // Case C: site author via settings.author.display when name is absent
    {
      const settings = { author: { display: 'Display Only' } };
      const { items } = await LocalFolderAdapter.load({
        id: 'local://items',
        title: 'Items',
        path: contentDir,
        pagesBase: 'https://example.test',
        coversDir,
        pagesDir,
        visibilityDefault: 'public',
        settings,
      });

      const gen2 = items.find((i) => i.url.endsWith('/gen2-no-author.html'));
      assert.strictEqual(gen2.author, 'display only');
      assert.strictEqual(gen2.authors[0].name, 'display only');
    }
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
});

test('author suffix kept: an author written as \'Harold Young [humxn]\' comes out as \'harold young [humxn]\'', async () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-author-humxn-'));
  const contentDir = path.join(tmpRoot, 'items');
  const coversDir = path.join(tmpRoot, 'covers');
  const pagesDir = path.join(tmpRoot, 'pages');

  try {
    fs.mkdirSync(path.join(contentDir, 'with-author'), { recursive: true });
    fs.writeFileSync(
      path.join(contentDir, 'with-author', 'frontmatter.json'),
      JSON.stringify({ title: 'Piece', meta: { author: 'Harold Young [humxn]' }, posted: true })
    );

    const { contents } = ingestFolder(contentDir);
    assert.strictEqual(contents[0].author, 'harold young [humxn]');

    const { items } = await LocalFolderAdapter.load({
      id: 'local://items',
      title: 'Items',
      path: contentDir,
      pagesBase: 'https://example.test',
      coversDir,
      pagesDir,
      visibilityDefault: 'public',
      settings: {},
    });

    assert.strictEqual(items[0].author, 'harold young [humxn]');
    assert.strictEqual(items[0].authors[0].name, 'harold young [humxn]');
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
});

