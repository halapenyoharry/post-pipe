// generate-index.js
// Reads all articles' frontmatter → produces feed.json + index.html
// feed.json is the single source of truth — index.html fetches it at load time
// Settings loaded from settings.json for personalization
// Run: node generate-index.js
// Output: _site/index.html, _site/feed.json

const fs   = require('fs');
const path = require('path');
const matter = require('gray-matter');

const { loadFeedItems } = require('./platforms/feed-ingester');

const SETTINGS     = JSON.parse(fs.readFileSync(path.join(__dirname, 'settings.json'), 'utf8'));
const ARTICLES_DIR = path.resolve(__dirname, SETTINGS.content_dir);
const SITE_DIR     = path.join(__dirname, '_site');
const COVERS_DIR   = path.join(SITE_DIR, 'covers');
const D3_PATH      = path.join(__dirname, 'node_modules/d3/dist/d3.min.js');
const FONT_PATH    = path.join(__dirname, 'fonts/AtkinsonHyperlegible-Regular.woff2');
const FONT_BOLD_PATH = path.join(__dirname, 'fonts/AtkinsonHyperlegible-Bold.woff2');
const PAGES_BASE   = SETTINGS.site.base_url;

// ─── Scan articles ───────────────────────────────────────────────────────────

if (!fs.existsSync(COVERS_DIR)) fs.mkdirSync(COVERS_DIR, { recursive: true });

function loadArticles() {
  const slugs = fs.readdirSync(ARTICLES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const articles = [];
  for (const dir of slugs) {
    const qmdPath = path.join(ARTICLES_DIR, dir, 'index.qmd');
    if (!fs.existsSync(qmdPath)) continue;

    const raw = fs.readFileSync(qmdPath, 'utf8');
    const { data: fm } = matter(raw);
    if (!fm.title || !fm.slug) continue;

    let imageUrl = '';
    if (fm.cover_image) {
      const srcPath = path.join(ARTICLES_DIR, dir, fm.cover_image);
      if (fs.existsSync(srcPath)) {
        const ext = path.extname(srcPath);
        const destName = `${fm.slug}${ext}`;
        fs.copyFileSync(srcPath, path.join(COVERS_DIR, destName));
        imageUrl = `${PAGES_BASE}/covers/${destName}`;
      }
    }

    articles.push({
      id: `${PAGES_BASE}/${fm.slug}.html`,
      url: `${PAGES_BASE}/${fm.slug}.html`,
      title: fm.title,
      short_title: fm.short_title || '',
      summary: fm.description || '',
      tldr: fm.tldr || '',
      image: imageUrl,
      date_published: fm.publish_date ? new Date(fm.publish_date).toISOString() : undefined,
      reading_time: fm.reading_time || '',
      tags: fm.tags || [],
      series: fm.series || '',
      series_part: fm.series_part || null,
      license: fm.license || '',
      canonical_url: fm.canonical_url || `${PAGES_BASE}/${fm.slug}.html`,
      syndication: fm.syndication || {},
      _status: fm.status || 'draft',
    });
  }

  return articles;
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
  const d3Source = fs.readFileSync(D3_PATH, 'utf8');
  const fontB64 = fs.readFileSync(FONT_PATH).toString('base64');
  const fontBoldB64 = fs.readFileSync(FONT_BOLD_PATH).toString('base64');
  const settingsJSON = JSON.stringify(SETTINGS);

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
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: var(--bg); color: var(--text); font-family: 'Atkinson', sans-serif; overflow: hidden; }

  /* ── Graph ── */
  #graph { width: 100vw; height: 100vh; }
  .node { cursor: pointer; overflow: visible; }
  .node text { fill: #ccc; pointer-events: none; font-family: 'Atkinson', sans-serif; }
  svg { overflow: visible; user-select: none; -webkit-user-select: none; }
  .link { stroke: #555; stroke-opacity: 0.4; stroke-width: 1.5; }
  .link.highlighted { stroke: var(--accent); stroke-opacity: 0.8; stroke-width: 2; }
  .node.dimmed { opacity: 0.2; }
  .tag-active rect, .tag-active ellipse { filter: drop-shadow(0 0 6px var(--accent)); }

  #tooltip {
    position: fixed; display: none; background: #16213e; border: 1px solid #0f3460;
    padding: 12px 16px; border-radius: 6px; max-width: 320px; font-size: 14px;
    pointer-events: none; z-index: 10;
  }
  #tooltip .title { font-weight: 600; margin-bottom: 4px; color: #fff; }
  #tooltip .desc { color: #aaa; font-size: 13px; }
  #tooltip .date { color: #666; font-size: 11px; margin-top: 6px; }
  #error { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #e74c3c; font-size: 18px; }

  /* ── Reader overlay ── */
  #reader-overlay {
    display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.5); z-index: 100; cursor: pointer;
  }

  /* ── Reader panel ── */
  #reader-panel {
    position: fixed; top: 0; right: -55vw; width: 55vw; height: 100vh;
    background: var(--surface); border-left: 1px solid var(--border);
    z-index: 101; display: flex; flex-direction: column; overflow: hidden;
    font-family: 'Atkinson', sans-serif;
    transition: right 0.3s ease;
  }
  #reader-panel.open { right: 0; }
  @media (max-width: 900px) {
    #reader-panel { width: 100vw; right: -100vw; }
  }

  /* ── Toolbar ── */
  #reader-toolbar {
    padding: 8px 16px; background: rgba(17, 24, 39, 0.95);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 4px; flex-shrink: 0;
    flex-wrap: wrap;
  }
  .toolbar-group {
    display: flex; align-items: center; gap: 4px;
  }
  .toolbar-separator {
    width: 1px; height: 24px; background: rgba(100, 255, 218, 0.15); margin: 0 8px;
  }
  .toolbar-spacer { flex: 1; }

  .tb {
    background: transparent; border: 1px solid rgba(100, 255, 218, 0.2);
    color: var(--accent); width: 36px; height: 36px; cursor: pointer;
    font-family: 'Atkinson', sans-serif; display: flex; align-items: center;
    justify-content: center; border-radius: 4px; transition: all 0.2s;
    position: relative; flex-shrink: 0;
  }
  .tb:hover { background: rgba(100, 255, 218, 0.1); border-color: var(--accent); }
  .tb.active { background: rgba(100, 255, 218, 0.15); border-color: var(--accent); }
  .tb.close-btn { border-color: rgba(239, 68, 68, 0.3); color: #ef4444; }
  .tb.close-btn:hover { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; }
  .tb svg { width: 18px; height: 18px; }

  .tb-tooltip {
    display: none; position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%);
    background: #16213e; color: #ccc; font-size: 11px; padding: 3px 8px; border-radius: 3px;
    white-space: nowrap; z-index: 200; pointer-events: none;
  }
  .tb:hover .tb-tooltip { display: block; }

  /* Syndication link icons */
  .synd-link { width: 28px; height: 28px; border: none; opacity: 0.5; }
  .synd-link:hover { opacity: 1; border: none; background: transparent; }
  .synd-link svg { width: 14px; height: 14px; }
  .synd-link.canonical { opacity: 1; position: relative; }
  .synd-link.canonical::after {
    content: ''; position: absolute; top: -2px; right: -2px;
    width: 10px; height: 10px; background: var(--accent);
    border-radius: 50%;
  }

  /* Voice dropdown */
  #voice-select {
    background: rgba(17, 24, 39, 0.9); border: 1px solid rgba(100, 255, 218, 0.2);
    color: var(--accent); padding: 4px 8px; font-size: 12px; font-family: 'Atkinson', sans-serif;
    border-radius: 4px; max-width: 140px; cursor: pointer;
  }
  #voice-select:focus { outline: none; border-color: var(--accent); }

  /* ── Progress bar ── */
  #reader-progress { height: 3px; background: rgba(148, 163, 184, 0.1); flex-shrink: 0; }
  #reader-progress-fill { height: 100%; background: var(--accent); width: 0%; transition: width 0.3s; }

  /* ── Frontmatter disclosure ── */
  #frontmatter-panel {
    display: none; padding: 16px 40px; background: rgba(17, 24, 39, 0.5);
    border-bottom: 1px solid var(--border); font-size: 13px;
    max-height: 300px; overflow-y: auto;
  }
  #frontmatter-panel.open { display: block; }
  .fm-row { display: flex; gap: 12px; padding: 4px 0; border-bottom: 1px solid rgba(100, 255, 218, 0.05); }
  .fm-label { color: var(--accent); min-width: 100px; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
  .fm-value { color: var(--text); }
  .fm-tag {
    display: inline-block; background: rgba(243, 156, 18, 0.15); color: #f39c12;
    padding: 2px 8px; border-radius: 10px; font-size: 11px; margin: 1px 2px;
  }
  .fm-synd-link { color: var(--accent); text-decoration: none; font-size: 12px; }
  .fm-synd-link:hover { text-decoration: underline; }

  /* ── Reader body ── */
  #reader-body {
    flex: 1; overflow-y: auto; padding: 32px 40px 48px; line-height: 1.9;
    font-size: 15px; color: var(--text);
  }
  #reader-body::-webkit-scrollbar { width: 8px; }
  #reader-body::-webkit-scrollbar-track { background: rgba(17, 24, 39, 0.5); }
  #reader-body::-webkit-scrollbar-thumb { background: rgba(100, 255, 218, 0.3); border-radius: 4px; }

  /* Article header in body */
  .article-header { margin-bottom: 32px; }
  .article-title {
    font-size: 28px; font-weight: 700; color: #fff; line-height: 1.3;
    margin-bottom: 12px;
  }
  .article-byline {
    font-size: 14px; color: rgba(100, 255, 218, 0.7); margin-bottom: 4px;
  }
  .article-byline a { color: var(--accent); text-decoration: none; }
  .article-byline a:hover { text-decoration: underline; }
  .article-meta { font-size: 13px; color: #666; }

  /* Article content */
  #reader-body h1, #reader-body h2, #reader-body h3 { color: var(--text-bright); margin: 28px 0 12px; font-weight: 600; }
  #reader-body h2 { font-size: 20px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
  #reader-body h3 { font-size: 16px; }
  #reader-body p { margin-bottom: 16px; }
  #reader-body blockquote {
    border-left: 3px solid var(--accent); padding: 12px 20px; margin: 16px 0;
    background: rgba(100, 255, 218, 0.03); font-style: italic;
  }
  #reader-body ul, #reader-body ol { padding-left: 24px; margin-bottom: 16px; }
  #reader-body li { margin-bottom: 8px; }
  #reader-body em { color: var(--text-bright); }
  #reader-body strong { color: var(--text-bright); font-weight: 600; }
  #reader-body a { color: var(--accent); text-decoration: none; }
  #reader-body a:hover { text-decoration: underline; }
  #reader-body .current-sentence {
    background: rgba(100, 255, 218, 0.15); color: var(--accent);
    padding: 1px 3px; transition: all 0.3s;
  }

  /* Copy feedback toast */
  #copy-toast {
    position: fixed; bottom: 24px; right: 24px; background: var(--accent); color: var(--bg);
    padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600;
    z-index: 300; opacity: 0; transition: opacity 0.3s; pointer-events: none;
  }
  #copy-toast.show { opacity: 1; }

  /* Print */
  @media print {
    #graph, #tooltip, #reader-overlay, #reader-toolbar, #reader-progress,
    #frontmatter-panel, #copy-toast { display: none !important; }
    #reader-panel {
      position: static !important; width: 100% !important; height: auto !important;
      background: #fff !important; border: none !important;
    }
    #reader-body {
      color: #222 !important; padding: 0 !important; overflow: visible !important;
    }
    .article-title { color: #000 !important; }
    .article-byline { color: #555 !important; }
  }
</style>
</head>
<body>
<div id="graph"></div>
<div id="tooltip"><div class="title"></div><div class="desc"></div><div class="date"></div></div>
<div id="error"></div>

<div id="reader-overlay"></div>
<div id="reader-panel">
  <div id="reader-toolbar">
    <div class="toolbar-group" id="tts-controls">
      <button class="tb" id="btnPlay" title="Play">${ICONS.play}<span class="tb-tooltip">Play</span></button>
      <button class="tb" id="btnPause" style="display:none" title="Pause">${ICONS.pause}<span class="tb-tooltip">Pause</span></button>
      <button class="tb" id="btnStop" style="display:none" title="Stop">${ICONS.stop}<span class="tb-tooltip">Stop</span></button>
      <select id="voice-select"><option>Loading voices...</option></select>
    </div>

    <div class="toolbar-separator"></div>

    <div class="toolbar-group">
      <button class="tb" id="btnFrontmatter" title="Article details">${ICONS.info}<span class="tb-tooltip">Details</span></button>
      <button class="tb" id="btnExport" title="Export markdown">${ICONS.download}<span class="tb-tooltip">Export</span></button>
      <button class="tb" id="btnCopy" title="Copy to clipboard">${ICONS.copy}<span class="tb-tooltip">Copy</span></button>
    </div>

    <div class="toolbar-separator"></div>

    <div class="toolbar-group" id="syndication-links"></div>

    <div class="toolbar-spacer"></div>

    <button class="tb close-btn" id="btnClose" title="Close">${ICONS.close}<span class="tb-tooltip">Close</span></button>
  </div>

  <div id="reader-progress"><div id="reader-progress-fill"></div></div>
  <div id="frontmatter-panel"></div>
  <div id="reader-body"></div>
</div>

<div id="copy-toast">Copied to clipboard</div>

<script>
${d3Source}
</script>
<script>
// ── Settings (injected at build) ──
const SETTINGS = ${settingsJSON};
const ICONS = ${JSON.stringify(ICONS)};

// ── State ──
let currentArticle = null;

// ── Reader ──
function openReader(article) {
  currentArticle = article;
  const panel = document.getElementById('reader-panel');
  const overlay = document.getElementById('reader-overlay');
  const body = document.getElementById('reader-body');

  // Build article header
  const dateStr = article.date ? new Date(article.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const metaParts = [dateStr, article.reading_time].filter(Boolean);

  let headerHTML = '<div class="article-header">';
  headerHTML += '<div class="article-title">' + (article.title || article.label) + '</div>';
  headerHTML += '<div class="article-byline">by <a href="' + SETTINGS.author.url + '" target="_blank" rel="noopener">' + SETTINGS.author.display + '</a></div>';
  if (metaParts.length) headerHTML += '<div class="article-meta">' + metaParts.join(' · ') + '</div>';
  headerHTML += '</div>';

  // Fetch article HTML and inject
  fetch(article.url).then(r => r.text()).then(html => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    // Remove the title from fetched content (we render our own)
    const h1 = doc.querySelector('h1');
    if (h1) h1.remove();
    const content = doc.querySelector('body') ? doc.querySelector('body').innerHTML : html;
    body.innerHTML = headerHTML + content;
    body.scrollTop = 0;
  }).catch(() => {
    body.innerHTML = headerHTML + '<p style="color:#666;">Could not load article content.</p>';
  });

  // Build syndication links
  buildSyndicationLinks(article);

  // Build frontmatter panel
  buildFrontmatter(article);

  // Show
  panel.classList.add('open');
  overlay.style.display = 'block';

  // Scroll progress
  body.onscroll = () => {
    const pct = body.scrollTop / (body.scrollHeight - body.clientHeight) * 100;
    document.getElementById('reader-progress-fill').style.width = Math.min(pct, 100) + '%';
  };
}

function closeReader() {
  document.getElementById('reader-panel').classList.remove('open');
  document.getElementById('reader-overlay').style.display = 'none';
  document.getElementById('frontmatter-panel').classList.remove('open');
  document.getElementById('btnFrontmatter').classList.remove('active');
  currentArticle = null;
}

function buildSyndicationLinks(article) {
  const container = document.getElementById('syndication-links');
  container.innerHTML = '';

  // Canonical (GitHub Pages) — always present
  const canonUrl = article.canonical_url || article.url;
  const canonBtn = document.createElement('a');
  canonBtn.href = canonUrl;
  canonBtn.target = '_blank';
  canonBtn.rel = 'noopener';
  canonBtn.className = 'tb synd-link canonical';
  canonBtn.innerHTML = ICONS.globe + '<span class="tb-tooltip">Canonical</span>';
  container.appendChild(canonBtn);

  // Other syndication links
  const synd = article.syndication || {};
  const iconMap = SETTINGS.toolbar.syndication_icons;
  for (const [platform, url] of Object.entries(synd)) {
    if (!url) continue;
    const cfg = iconMap[platform];
    if (!cfg) continue;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'tb synd-link';
    a.innerHTML = (ICONS[cfg.icon] || ICONS.globe) + '<span class="tb-tooltip">' + cfg.label + '</span>';
    container.appendChild(a);
  }
}

function buildFrontmatter(article) {
  const panel = document.getElementById('frontmatter-panel');
  const fields = SETTINGS.frontmatter_display;
  let html = '';

  for (const field of fields) {
    let value = '';
    switch (field) {
      case 'publish_date':
        if (article.date) value = new Date(article.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        break;
      case 'updated_date':
        if (article.updated_date) value = article.updated_date;
        break;
      case 'reading_time':
        value = article.reading_time || '';
        break;
      case 'tags':
        if (article.tags && article.tags.length) {
          value = article.tags.map(t => '<span class="fm-tag">' + t + '</span>').join(' ');
        }
        break;
      case 'series':
        value = article.series || '';
        break;
      case 'license':
        value = article.license || '';
        break;
      case 'syndication':
        const synd = article.syndication || {};
        const links = Object.entries(synd).filter(([,url]) => url);
        if (links.length) {
          value = links.map(([p, url]) => '<a class="fm-synd-link" href="' + url + '" target="_blank">' + p + '</a>').join(' · ');
        }
        break;
    }
    if (!value) continue;
    html += '<div class="fm-row"><span class="fm-label">' + field.replace(/_/g, ' ') + '</span><span class="fm-value">' + value + '</span></div>';
  }

  panel.innerHTML = html || '<div class="fm-row"><span class="fm-value" style="color:#666;">No metadata available.</span></div>';
}

// ── Toolbar actions ──

document.getElementById('btnClose').onclick = closeReader;
document.getElementById('reader-overlay').onclick = closeReader;

document.getElementById('btnFrontmatter').onclick = () => {
  const panel = document.getElementById('frontmatter-panel');
  const btn = document.getElementById('btnFrontmatter');
  panel.classList.toggle('open');
  btn.classList.toggle('active');
};

document.getElementById('btnCopy').onclick = async () => {
  if (!currentArticle) return;
  const body = document.getElementById('reader-body');
  const license = SETTINGS.export.license_header.replace('{{canonical_url}}', currentArticle.canonical_url || currentArticle.url);
  const text = license + '\\n\\n---\\n\\n' + body.innerText;
  try {
    await navigator.clipboard.writeText(text);
    const toast = document.getElementById('copy-toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  } catch(e) { console.error('Copy failed:', e); }
};

document.getElementById('btnExport').onclick = () => {
  if (!currentArticle) return;
  const body = document.getElementById('reader-body');
  const license = SETTINGS.export.license_header.replace('{{canonical_url}}', currentArticle.canonical_url || currentArticle.url);
  const text = license + '\\n\\n---\\n\\n' + body.innerText;
  const blob = new Blob([text], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (currentArticle.id.split('/').pop().replace('.html', '') || 'article') + '.md';
  a.click();
  URL.revokeObjectURL(a.href);
};

// ── TTS (placeholder — loads tts-reader.js if present) ──
// TTS integration point: tts-reader.js should expose window.TTS = { play, pause, stop, voices }
document.getElementById('btnPlay').onclick = () => {
  if (window.TTS && window.TTS.play) {
    window.TTS.play(document.getElementById('reader-body'));
    document.getElementById('btnPlay').style.display = 'none';
    document.getElementById('btnPause').style.display = 'flex';
    document.getElementById('btnStop').style.display = 'flex';
  }
};
document.getElementById('btnPause').onclick = () => {
  if (window.TTS && window.TTS.pause) window.TTS.pause();
  document.getElementById('btnPause').style.display = 'none';
  document.getElementById('btnPlay').style.display = 'flex';
};
document.getElementById('btnStop').onclick = () => {
  if (window.TTS && window.TTS.stop) window.TTS.stop();
  document.getElementById('btnPlay').style.display = 'flex';
  document.getElementById('btnPause').style.display = 'none';
  document.getElementById('btnStop').style.display = 'none';
};

// Populate voice dropdown from TTS provider
function loadVoices() {
  const sel = document.getElementById('voice-select');
  if (window.TTS && window.TTS.voices) {
    const voices = window.TTS.voices();
    sel.innerHTML = voices.map(v =>
      '<option value="' + v.id + '">' + v.label + '</option>'
    ).join('');
  } else {
    sel.innerHTML = '<option>No TTS</option>';
  }
}
// Try loading voices after a short delay (TTS module may load async)
setTimeout(loadVoices, 1000);

// ── D3 Graph ──

function feedToGraph(feed) {
  const nodes = [];
  const links = [];
  const tagNodes = new Map();

  for (const item of feed.items) {
    const slug = item.url.split('/').pop().replace('.html', '');
    const status = item._status || 'draft';

    nodes.push({
      id: slug,
      label: slug,
      title: item.title,
      short_title: item.short_title || '',
      type: 'article',
      url: item.url,
      description: item.summary || '',
      tldr: item.tldr || '',
      image: item.image || '',
      date: item.date_published ? item.date_published.split('T')[0] : '',
      reading_time: item.reading_time || '',
      tags: item.tags || [],
      series: item.series || '',
      license: item.license || '',
      canonical_url: item.canonical_url || item.url,
      syndication: item.syndication || {},
      size: 60,
      color: status === 'published' ? '${SETTINGS.theme.node_published}' : '${SETTINGS.theme.node_draft}',
    });

    for (const tag of (item.tags || [])) {
      if (!tagNodes.has(tag)) {
        tagNodes.set(tag, {
          id: 'tag:' + tag,
          label: tag,
          type: 'tag',
          size: 30,
          color: '${SETTINGS.theme.tag_color}',
        });
      }
      links.push({ source: slug, target: 'tag:' + tag });
    }
  }

  nodes.push(...tagNodes.values());
  return { nodes, links };
}

class PostGraph {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.tooltip = document.getElementById('tooltip');
    this.init();
  }

  init() {
    this.svg = d3.select(this.container).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .call(d3.zoom().on('zoom', (event) => {
        this.g.attr('transform', event.transform);
      }))
      .on('dblclick.zoom', null);

    this.g = this.svg.append('g');

    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id).distance(160))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('collide', d3.forceCollide().radius(d => (d._r || d.size / 2) + 8).strength(0.9))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .velocityDecay(0.85)
      .alphaDecay(0.05);

    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.svg.attr('width', this.width).attr('height', this.height);
      this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2));
      this.simulation.alpha(0.1).restart();
    });
  }

  render(data) {
    const links = this.g.selectAll('.link')
      .data(data.links)
      .enter().append('line')
      .attr('class', 'link');

    const nodes = this.g.selectAll('.node')
      .data(data.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) this.simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end', (event, d) => {
          if (!event.active) this.simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
      );

    const probe = this.svg.append('text')
      .style('font-family', "'Atkinson', sans-serif")
      .style('visibility', 'hidden');

    nodes.each(function(d) {
      const el = d3.select(this);

      if (d.type === 'tag') {
        const fontSize = 14;
        const padX = 14, padY = 8;
        probe.style('font-size', fontSize + 'px').style('font-weight', '400');
        probe.text(d.label);
        const textW = probe.node().getComputedTextLength();
        const bubbleW = textW + padX * 2;
        const bubbleH = fontSize * 1.4 + padY * 2;

        el.append('rect')
          .attr('x', -bubbleW / 2).attr('y', -bubbleH / 2)
          .attr('width', bubbleW).attr('height', bubbleH)
          .attr('rx', bubbleH / 2).attr('ry', bubbleH / 2)
          .attr('fill', d.color).attr('opacity', 0.7);
        el.append('text')
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
          .attr('fill', '#1a1a2e')
          .style('font-size', fontSize + 'px').style('font-weight', '400')
          .style('pointer-events', 'none')
          .text(d.label);
        d._r = Math.max(bubbleW, bubbleH) / 2;

      } else {
        const cardW = 180, cardH = 140;
        const status = d.color === '${SETTINGS.theme.node_draft}' ? 'draft' : 'published';
        const bgColor = status === 'draft' ? '#2a2a3e' : '#1e3a5f';
        const bgImage = d.image
          ? 'linear-gradient(' + (status === 'draft' ? 'rgba(42,42,62,0.85),rgba(42,42,62,0.85)' : 'rgba(30,58,95,0.85),rgba(30,58,95,0.85)') + '), url(\\'' + d.image + '\\')'
          : bgColor;
        const borderColor = status === 'draft' ? '#555' : '${SETTINGS.theme.node_published}';
        const desc = d.description || '';

        el.append('foreignObject')
          .attr('width', cardW).attr('height', cardH)
          .attr('x', -cardW / 2).attr('y', -cardH / 2)
          .append('xhtml:div')
          .attr('xmlns', 'http://www.w3.org/1999/xhtml')
          .style('width', cardW + 'px').style('height', cardH + 'px')
          .style('background', bgImage)
          .style('background-size', 'cover')
          .style('background-position', 'center')
          .style('border', '1.5px solid ' + borderColor)
          .style('border-radius', '4px')
          .style('padding', '10px 12px')
          .style('box-sizing', 'border-box')
          .style('overflow', 'hidden')
          .style('font-family', "'Atkinson', sans-serif")
          .style('cursor', 'pointer')
          .html((() => {
            const preview = desc.length > 120 ? desc.slice(0, 117) + '...' : desc;
            return '<span style="font-size:15px;font-weight:700;color:#fff;line-height:1.3;">' + (d.title || d.label) + '</span>' +
              (preview ? '<br><span style="zoom:0.65;font-size:15px;color:rgba(255,255,255,0.35);line-height:1.3;font-style:italic;">' + preview + '</span>' : '');
          })());

        d._r = Math.max(cardW, cardH) / 2;
      }
    });

    probe.remove();

    nodes.filter(d => d.type === 'article')
      .on('click', (event, d) => { openReader(d); })
      .on('mouseover', (event, d) => {
        this.tooltip.style.display = 'block';
        this.tooltip.querySelector('.title').textContent = d.title || d.label;
        this.tooltip.querySelector('.desc').textContent = d.description || '';
        this.tooltip.querySelector('.date').textContent = d.date || '';
      })
      .on('mousemove', (event) => {
        this.tooltip.style.left = (event.clientX + 16) + 'px';
        this.tooltip.style.top = (event.clientY + 16) + 'px';
      })
      .on('mouseout', () => { this.tooltip.style.display = 'none'; });

    // Tag click: arrange connected articles around tag, dim everything else
    // Click same tag again to restore
    let activeTag = null;

    nodes.filter(d => d.type === 'tag')
      .on('click', (event, d) => {
        event.stopPropagation();
        if (activeTag === d.id) {
          // Restore
          activeTag = null;
          nodes.classed('dimmed', false).classed('tag-active', false);
          links.classed('highlighted', false);
          this.simulation.force('x', null).force('y', null);
          this.simulation.alpha(0.4).restart();
        } else {
          activeTag = d.id;
          // Find connected article IDs
          const connected = new Set(
            data.links.filter(l => {
              const sid = typeof l.source === 'object' ? l.source.id : l.source;
              const tid = typeof l.target === 'object' ? l.target.id : l.target;
              return sid === d.id || tid === d.id;
            }).map(l => {
              const sid = typeof l.source === 'object' ? l.source.id : l.source;
              const tid = typeof l.target === 'object' ? l.target.id : l.target;
              return sid === d.id ? tid : sid;
            })
          );
          connected.add(d.id);

          nodes.classed('dimmed', nd => !connected.has(nd.id));
          nodes.classed('tag-active', nd => nd.id === d.id);
          links.classed('highlighted', l => {
            const sid = typeof l.source === 'object' ? l.source.id : l.source;
            const tid = typeof l.target === 'object' ? l.target.id : l.target;
            return sid === d.id || tid === d.id;
          });

          // Pull connected nodes toward tag center
          const cx = this.width / 2, cy = this.height / 2;
          this.simulation
            .force('x', d3.forceX(nd => connected.has(nd.id) ? cx : (nd.x < cx ? cx - 500 : cx + 500)).strength(nd => connected.has(nd.id) ? 0.3 : 0.15))
            .force('y', d3.forceY(cy).strength(nd => connected.has(nd.id) ? 0.3 : 0.1));
          this.simulation.alpha(0.6).restart();
        }
      });

    // Click background to clear tag selection
    this.svg.on('click', () => {
      if (activeTag) {
        activeTag = null;
        nodes.classed('dimmed', false).classed('tag-active', false);
        links.classed('highlighted', false);
        this.simulation.force('x', null).force('y', null);
        this.simulation.alpha(0.4).restart();
      }
    });

    this.simulation.nodes(data.nodes).on('tick', () => {
      links.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
           .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      nodes.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
    });
    this.simulation.force('link').links(data.links);
  }
}

// ── Load ──
fetch('./feed.json?v=' + Date.now())
  .then(r => r.json())
  .then(feed => {
    const graph = new PostGraph('graph');
    graph.render(feedToGraph(feed));
  })
  .catch(err => {
    const el = document.getElementById('error');
    el.style.display = 'block';
    el.textContent = 'Failed to load feed: ' + err.message;
  });
</script>
</body>
</html>`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const articles = loadArticles();
  console.log(`Found ${articles.length} local article(s)`);

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

