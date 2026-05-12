// generate-index.js
// Reads all articles' frontmatter → produces feed.json + index.html
// feed.json is the single source of truth — index.html fetches it at load time
// Settings loaded from settings.json for personalization
// Run: node generate-index.js
// Output: _site/index.html, _site/feed.json

const fs   = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, 'auth/.env') });

const { loadFeedItems } = require('./platforms/feed-ingester');
const { ingestFolder }  = require('./ingest');

const SETTINGS     = JSON.parse(fs.readFileSync(path.join(__dirname, 'settings.json'), 'utf8'));
const CONTENT_ROOT = resolveHome(SETTINGS.content_dir);
const SITE_DIR     = path.join(__dirname, '_site');
const COVERS_DIR   = path.join(SITE_DIR, 'covers');
const D3_PATH      = path.join(__dirname, 'node_modules/d3/dist/d3.min.js');
const FONT_PATH    = path.join(__dirname, 'fonts/AtkinsonHyperlegible-Regular.woff2');
const FONT_BOLD_PATH = path.join(__dirname, 'fonts/AtkinsonHyperlegible-Bold.woff2');
const PAGES_BASE   = SETTINGS.site.base_url;

function resolveHome(p) {
  if (!p) return p;
  if (p.startsWith('~')) return path.join(process.env.HOME, p.slice(1));
  return path.resolve(__dirname, p);
}

// ─── Scan content via ingester ──────────────────────────────────────────────

if (!fs.existsSync(COVERS_DIR)) fs.mkdirSync(COVERS_DIR, { recursive: true });

// Status → graph visual bucket. `bloomed` (finished but not publicly posted)
// reads as published in the graph; graph only has two colors today. TODO
// for a third tier if distinguishing bloomed-private from published-public
// becomes useful.
function statusBucket(c) {
  if (c.status === 'published') return 'published';
  if (c.syndication?.canonical) return 'published';
  if (c.status === 'bloomed')   return 'published';
  return 'draft';
}

function loadLocalContent() {
  const { contents } = ingestFolder(CONTENT_ROOT);
  const items = [];
  for (const c of contents) {
    // Copy cover into _site/covers/ if present. Use a relative URL so the
    // viewer works both locally (python http.server) and on GH Pages.
    let imageUrl = '';
    if (c.cover) {
      const srcPath = path.join(CONTENT_ROOT, c.id, c.cover);
      if (fs.existsSync(srcPath)) {
        const ext = path.extname(srcPath);
        const destName = `${c.id}${ext}`;
        fs.copyFileSync(srcPath, path.join(COVERS_DIR, destName));
        imageUrl = `covers/${destName}`;
      }
    }

    const pagesUrl = `${PAGES_BASE}/${c.id}.html`;
    const bucket   = statusBucket(c);

    items.push({
      id: pagesUrl,
      url: pagesUrl,
      title: c.title,
      short_title: c.short_title || '',
      summary: c.summary || '',
      tldr: c.summary || '',
      image: imageUrl,
      date_published: c.written ? toIsoDate(c.written) : undefined,
      reading_time: c.reading_time || '',
      tags: c.tags || [],
      series: c.series || '',
      series_part: c.series_part || null,
      license: c.license || '',
      canonical_url: c.syndication?.canonical || pagesUrl,
      syndication: c.syndication || {},
      _status: bucket,
      // New-schema fields — graph and future renderers consume these:
      kind: c.kind,
      substrate: c.substrate,
      seed: c.seed,
      topology: c.topology || [],
      energy: c.energy,
      forms: {
        current: c.forms_current,
        potential: c.forms_potential || [],
        companions: c.forms_companions || [],
      },
      connected_to: c.connected_to || [],
      note: c.note,
      todos: c.todos || [],
      schema: c.schema,
    });
  }
  return items;
}

// Frontmatter dates come in many shapes ("2025", "2026-03", "2026-03-18").
// Pad to a full ISO so JS Date parses consistently.
function toIsoDate(s) {
  if (!s) return undefined;
  const str = String(s).trim();
  if (/^\d{4}$/.test(str))        return new Date(`${str}-01-01T00:00:00Z`).toISOString();
  if (/^\d{4}-\d{2}$/.test(str))  return new Date(`${str}-01T00:00:00Z`).toISOString();
  const d = new Date(str);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

// ─── Build feed.json ─────────────────────────────────────────────────────────

function buildFeed(articles) {
  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: SETTINGS.site.title,
    home_page_url: PAGES_BASE,
    feed_url: `${PAGES_BASE}/feed.json`,
    authors: [{ name: SETTINGS.author.name }],
    items: articles,
  };
}

// ─── SVG Icons (inline, no dependencies) ─────────────────────────────────────

const ICONS = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  crown: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h20v2H2zM4 18l2-12 4 5 2-7 2 7 4-5 2 12z"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  medium: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>',
  substack: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><polygon fill="#fff" points="9.545,15.568 15.818,12 9.545,8.432"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  hackernews: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 0v24h24V0H0zm12.8 13.2V19h-1.6v-5.8L7.5 5.4h1.8l2.7 5.7 2.7-5.7h1.8l-3.7 7.8z"/></svg>',
  reddit: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>',
  bluesky: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.627 3.6 3.476 6.178 3.126-3.976.665-7.416 2.282-2.99 7.088C8.35 25.136 10.603 19.869 12 17.292c1.397 2.577 3.328 7.523 8.188 3.169 4.426-4.806.986-6.423-2.99-7.088 2.578.35 5.393-.499 6.178-3.126C23.622 9.418 24 4.458 24 3.768c0-.688-.139-1.86-.902-2.203-.659-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/></svg>'
};

// ─── Build index.html ────────────────────────────────────────────────────────

function buildIndexHTML() {
  const ttsSource = fs.readFileSync(path.join(__dirname, 'tts.js'), 'utf8');
  const fontB64 = fs.readFileSync(FONT_PATH).toString('base64');
  const fontBoldB64 = fs.readFileSync(FONT_BOLD_PATH).toString('base64');
  const settingsJSON = JSON.stringify(SETTINGS);

  const reactCss = fs.existsSync(path.join(__dirname, 'dist/post-pipe.css'))
    ? fs.readFileSync(path.join(__dirname, 'dist/post-pipe.css'), 'utf8')
    : '';
  const reactJs = fs.existsSync(path.join(__dirname, 'dist/post-pipe-components.umd.js'))
    ? fs.readFileSync(path.join(__dirname, 'dist/post-pipe-components.umd.js'), 'utf8')
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${SETTINGS.site.title}</title>
<meta name="description" content="${SETTINGS.site.description}">
<meta property="og:title" content="${SETTINGS.site.title}">
<meta property="og:description" content="${SETTINGS.site.description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${PAGES_BASE}">
<link rel="icon" type="image/svg+xml" href="./favicon.svg">
<style>
  @font-face {
    font-family: 'Atkinson';
    src: url(data:font/woff2;base64,${fontB64}) format('woff2');
    font-weight: normal; font-style: normal;
  }
  @font-face {
    font-family: 'Atkinson';
    src: url(data:font/woff2;base64,${fontBoldB64}) format('woff2');
    font-weight: bold; font-style: normal;
  }

  :root {
    --bg: ${SETTINGS.theme.bg};
    --surface: ${SETTINGS.theme.surface};
    --accent: ${SETTINGS.theme.accent};
    --text: ${SETTINGS.theme.text};
    --text-bright: ${SETTINGS.theme.text_bright};
    --border: ${SETTINGS.theme.border};

    /* Variables mapped for the new React Components */
    --gv-node-draft: ${SETTINGS.theme.node_draft};
    --gv-node-published: ${SETTINGS.theme.node_published};
    --gv-tag-color: ${SETTINGS.theme.tag_color};
    --gv-accent: ${SETTINGS.theme.accent};

    --rp-bg: ${SETTINGS.theme.bg};
    --rp-surface: ${SETTINGS.theme.surface};
    --rp-border: ${SETTINGS.theme.border};
    --rp-accent: ${SETTINGS.theme.accent};
    --rp-text: ${SETTINGS.theme.text};
    --rp-text-bright: ${SETTINGS.theme.text_bright};

    --tts-accent: ${SETTINGS.theme.accent};
    --tts-text: ${SETTINGS.theme.text};
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: var(--bg); color: var(--text); font-family: 'Atkinson', sans-serif; overflow: hidden; }

  #error { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #e74c3c; font-size: 18px; }

  /* Injected React Components CSS */
  ${reactCss}
</style>
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
</head>
<body>
<div id="error"></div>
<div id="app-root"></div>

<script>
// ── TTS Config ──
window.TTS_CONFIG = {
  geminiApiKey: '${process.env.GEMINI_API_KEY || ''}',
  geminiVoices: ${JSON.stringify(SETTINGS.tts?.engines?.gemini?.voices || [])},
  geminiModel: '${SETTINGS.tts?.engines?.gemini?.model || 'gemini-2.5-flash-preview-tts'}',
  geminiDefaultVoice: '${SETTINGS.tts?.engines?.gemini?.defaultVoice || 'Kore'}'
};
</script>
<script>
${ttsSource}
</script>
<script>
// ── Settings ──
window.SETTINGS = ${settingsJSON};
</script>
<script>
// ── React Components Library ──
${reactJs}
</script>
<script>
// ── Vanilla Orchestrator ──
(async function initApp() {
  try {
    const res = await fetch('./feed.json?v=' + Date.now());
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const feed = await res.json();

    const { GraphViewer, ReaderPanel, TTS } = window.PostPipeComponents;

    function App() {
      const [selectedArticle, setSelectedArticle] = React.useState(null);

      return React.createElement(React.Fragment, null,
        React.createElement(GraphViewer, {
          feedData: feed,
          onNodeSelect: (article) => setSelectedArticle(article)
        }),
        React.createElement(ReaderPanel, {
          article: selectedArticle,
          onClose: () => setSelectedArticle(null),
          settings: window.SETTINGS
        })
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('app-root'));
    root.render(React.createElement(App));

    // We will mount TTS manually inside the reader panel via a Portal or separate root
    // after the reader panel mounts (using MutationObserver to find the mount point).
    const observer = new MutationObserver(() => {
      const ttsMount = document.getElementById('tts-mount-point');
      if (ttsMount && !ttsMount.dataset.mounted) {
        ttsMount.dataset.mounted = 'true';
        const ttsRoot = ReactDOM.createRoot(ttsMount);
        // The reader body is the element we want to scroll/read
        const readerBody = document.querySelector('[class*="ReaderPanel_body"]');
        const ref = { current: readerBody };
        ttsRoot.render(React.createElement(TTS, { targetRef: ref }));
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

  } catch(err) {
    const el = document.getElementById('error');
    el.style.display = 'block';
    el.textContent = 'Failed to load feed: ' + err.message;
  }
})();
</script>
</body>
</html>`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const articles = loadLocalContent();
  console.log(`Ingested ${articles.length} local content item(s) from ${CONTENT_ROOT}`);
  const withTodos = articles.filter(a => a.todos.length).length;
  if (withTodos) console.log(`  (${withTodos} flagged with TODO files — see ${CONTENT_ROOT}/_MIGRATION-GUIDE.md + _METADATA-GUIDE.md)`);

  const feedItems = await loadFeedItems(SETTINGS);
  console.log(`Found ${feedItems.length} feed item(s)`);

  // Merge and sort by date descending
  const allArticles = [...articles, ...feedItems].sort((a, b) => {
    const da = new Date(a.date_published || 0);
    const db = new Date(b.date_published || 0);
    return db - da;
  });

  const feed = buildFeed(allArticles);

  if (!fs.existsSync(SITE_DIR)) fs.mkdirSync(SITE_DIR);

  fs.writeFileSync(path.join(SITE_DIR, 'feed.json'), JSON.stringify(feed, null, 2));
  fs.writeFileSync(path.join(SITE_DIR, 'index.html'), buildIndexHTML());

  console.log(`Generated _site/feed.json (${feed.items.length} items)`);
  console.log('Generated _site/index.html');
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});

