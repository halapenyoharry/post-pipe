// generate-index.js
// Reads all articles' frontmatter → produces feed.json + index.html
// feed.json is the single source of truth — index.html fetches it at load time
// Run: node generate-index.js
// Output: _site/index.html, _site/feed.json

const fs   = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ARTICLES_DIR = path.join(__dirname, 'articles');
const SITE_DIR     = path.join(__dirname, '_site');
const D3_PATH      = path.join(__dirname, 'node_modules/d3/dist/d3.min.js');
const FONT_PATH    = path.join(__dirname, 'fonts/AtkinsonHyperlegible-Regular.woff2');
const FONT_BOLD_PATH = path.join(__dirname, 'fonts/AtkinsonHyperlegible-Bold.woff2');
const PAGES_BASE   = 'https://halapenyoharry.github.io/haroldyoung-human-posts';

// ─── Scan articles ───────────────────────────────────────────────────────────

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

    articles.push({
      id: `${PAGES_BASE}/${fm.slug}.html`,
      url: `${PAGES_BASE}/${fm.slug}.html`,
      title: fm.title,
      short_title: fm.short_title || '',
      summary: fm.description || '',
      date_published: fm.publish_date ? new Date(fm.publish_date).toISOString() : undefined,
      tags: fm.tags || [],
      _status: fm.status || 'draft',
    });
  }

  return articles;
}

// ─── Build feed.json ─────────────────────────────────────────────────────────

function buildFeed(articles) {
  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Harold Young — Human Posts',
    home_page_url: PAGES_BASE,
    feed_url: `${PAGES_BASE}/feed.json`,
    authors: [{ name: 'Harold Young' }],
    items: articles,
  };
}

// ─── Build index.html ────────────────────────────────────────────────────────
// D3 is inlined. Graph data is derived from feed.json at load time.

function buildIndexHTML() {
  const d3Source = fs.readFileSync(D3_PATH, 'utf8');
  const fontB64 = fs.readFileSync(FONT_PATH).toString('base64');
  const fontBoldB64 = fs.readFileSync(FONT_BOLD_PATH).toString('base64');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Harold Young — Human Posts</title>
<style>
  @font-face {
    font-family: 'Atkinson';
    src: url(data:font/woff2;base64,${fontB64}) format('woff2');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'Atkinson';
    src: url(data:font/woff2;base64,${fontBoldB64}) format('woff2');
    font-weight: bold;
    font-style: normal;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #1a1a2e; color: #e0e0e0; font-family: 'Atkinson', sans-serif; overflow: hidden; }
  #graph { width: 100vw; height: 100vh; }
  .node { cursor: pointer; overflow: visible; }
  .node text { fill: #ccc; pointer-events: none; font-family: 'Atkinson', sans-serif; overflow: visible; paint-order: markers fill stroke; }
  svg { overflow: visible; }
  .link { stroke: #555; stroke-opacity: 0.4; stroke-width: 1.5; }
  #tooltip {
    position: fixed; display: none; background: #16213e; border: 1px solid #0f3460;
    padding: 12px 16px; border-radius: 6px; max-width: 320px; font-size: 14px;
    pointer-events: none; z-index: 10;
  }
  #tooltip .title { font-weight: 600; margin-bottom: 4px; color: #fff; }
  #tooltip .desc { color: #aaa; font-size: 13px; }
  #tooltip .date { color: #666; font-size: 11px; margin-top: 6px; }
  #error { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #e74c3c; font-size: 18px; }

  /* Reader panel */
  #reader-overlay {
    display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.7); z-index: 100;
  }
  #reader-panel {
    position: fixed; top: 0; right: 0; width: 55vw; height: 100vh;
    background: #0a0e1a; border-left: 1px solid rgba(100, 255, 218, 0.2);
    z-index: 101; display: flex; flex-direction: column; overflow: hidden;
    font-family: 'Atkinson', sans-serif;
  }
  @media (max-width: 900px) { #reader-panel { width: 100vw; } }
  #reader-header {
    padding: 16px 24px; background: rgba(17, 24, 39, 0.9);
    border-bottom: 1px solid rgba(100, 255, 218, 0.15);
    display: flex; align-items: center; gap: 12px; flex-shrink: 0;
  }
  #reader-header .reader-title {
    flex: 1; color: #64ffda; font-size: 15px; font-weight: 600;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  #reader-header .reader-voice {
    color: #8892b0; font-size: 11px; max-width: 180px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .reader-btn {
    background: transparent; border: 1px solid rgba(100, 255, 218, 0.3);
    color: #64ffda; padding: 6px 14px; font-size: 12px; cursor: pointer;
    font-family: 'Atkinson', sans-serif; text-transform: uppercase;
    letter-spacing: 0.05em; transition: all 0.2s;
  }
  .reader-btn:hover { background: rgba(100, 255, 218, 0.1); border-color: #64ffda; }
  .reader-btn.active { background: rgba(100, 255, 218, 0.15); border-color: #64ffda; }
  .reader-btn.close-btn { border-color: rgba(239, 68, 68, 0.4); color: #ef4444; }
  .reader-btn.close-btn:hover { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; }
  #reader-body {
    flex: 1; overflow-y: auto; padding: 32px 40px; line-height: 1.9;
    font-size: 15px; color: #a8b2d1;
  }
  #reader-body::-webkit-scrollbar { width: 8px; }
  #reader-body::-webkit-scrollbar-track { background: rgba(17, 24, 39, 0.5); }
  #reader-body::-webkit-scrollbar-thumb { background: rgba(100, 255, 218, 0.3); }
  #reader-body h1, #reader-body h2, #reader-body h3 { color: #ccd6f6; margin: 24px 0 12px; font-weight: 600; }
  #reader-body h1 { font-size: 22px; color: #64ffda; border-bottom: 1px solid rgba(100, 255, 218, 0.2); padding-bottom: 12px; }
  #reader-body h2 { font-size: 18px; }
  #reader-body p { margin-bottom: 16px; }
  #reader-body blockquote { border-left: 3px solid #64ffda; padding: 12px 20px; margin: 16px 0; background: rgba(100, 255, 218, 0.03); }
  #reader-body ul, #reader-body ol { padding-left: 24px; margin-bottom: 16px; }
  #reader-body li { margin-bottom: 8px; }
  #reader-body .current-sentence { background: rgba(100, 255, 218, 0.15); color: #64ffda; padding: 1px 3px; transition: all 0.3s; }
  #reader-progress { height: 3px; background: rgba(148, 163, 184, 0.1); flex-shrink: 0; }
  #reader-progress-fill { height: 100%; background: #64ffda; width: 0%; transition: width 0.3s; }
</style>
</head>
<body>
<div id="graph"></div>
<div id="tooltip"><div class="title"></div><div class="desc"></div><div class="date"></div></div>
<div id="error"></div>
<div id="reader-overlay"></div>
<div id="reader-panel" style="display:none;">
  <div id="reader-header">
    <span class="reader-title" id="readerTitle"></span>
    <span class="reader-voice" id="readerVoice"></span>
    <button class="reader-btn" id="readerEngine">Browser</button>
    <button class="reader-btn" id="readerPlay">Play</button>
    <button class="reader-btn" id="readerPause" style="display:none;">Pause</button>
    <button class="reader-btn" id="readerStop" style="display:none;">Stop</button>
    <button class="reader-btn close-btn" id="readerClose">Close</button>
  </div>
  <div id="reader-progress"><div id="reader-progress-fill"></div></div>
  <div id="reader-body"></div>
</div>
<script src="./tts-reader.js"></script>

<script>
${d3Source}
</script>
<script>
// Build graph nodes + links from JSON Feed items
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
      type: 'article',
      url: item.url,
      description: item.summary || '',
      date: item.date_published ? item.date_published.split('T')[0] : '',
      size: 60,
      color: status === 'published' ? '#3498db' : '#7f8c8d',
    });

    for (const tag of (item.tags || [])) {
      if (!tagNodes.has(tag)) {
        tagNodes.set(tag, {
          id: 'tag:' + tag,
          label: tag,
          type: 'tag',
          size: 30,
          color: '#f39c12',
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

    // Hidden text for measuring pixel widths
    const probe = this.svg.append('text')
      .style('font-family', "'Atkinson', sans-serif")
      .style('visibility', 'hidden');

    nodes.each(function(d) {
      const el = d3.select(this);

      if (d.type === 'tag') {
        // ─── Tags: pill bubbles ───────────────────────────────────────────
        const fontSize = 14;
        const padX = 14;
        const padY = 8;

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
          .attr('x', 0).attr('y', 0)
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
          .attr('fill', '#1a1a2e')
          .style('font-size', fontSize + 'px').style('font-weight', '400')
          .style('pointer-events', 'none')
          .text(d.label);

        d._r = Math.max(bubbleW, bubbleH) / 2;

      } else {
        // ─── Articles: HTML card via foreignObject ────────────────────────
        const cardW = 180;
        const cardH = 140;
        const status = d.color === '#7f8c8d' ? 'draft' : 'published';
        const bgColor = status === 'draft' ? '#2a2a3e' : '#1e3a5f';
        const borderColor = status === 'draft' ? '#555' : '#3498db';
        const desc = d.description || '';

        el.append('foreignObject')
          .attr('width', cardW).attr('height', cardH)
          .attr('x', -cardW / 2).attr('y', -cardH / 2)
          .append('xhtml:div')
          .attr('xmlns', 'http://www.w3.org/1999/xhtml')
          .style('width', cardW + 'px').style('height', cardH + 'px')
          .style('background', bgColor)
          .style('border', '1.5px solid ' + borderColor)
          .style('border-radius', '4px')
          .style('padding', '10px 12px')
          .style('box-sizing', 'border-box')
          .style('overflow', 'hidden')
          .style('font-family', "'Atkinson', sans-serif")
          .style('cursor', 'pointer')
          .style('overflow', 'hidden')
          .html((() => {
            const preview = desc.length > 120 ? desc.slice(0, 117) + '...' : desc;
            return \`
              <span style="font-size:15px;font-weight:700;color:#fff;line-height:1.3;">
                \${d.title || d.label}
              </span>
              \${preview ? \`<br><span style="zoom:0.65;font-size:15px;color:rgba(255,255,255,0.35);line-height:1.3;font-style:italic;">
                \${preview}
              </span>\` : ''}
            \`;
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

    this.simulation.nodes(data.nodes).on('tick', () => {
      links.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
           .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      nodes.attr('transform', d => \`translate(\${d.x},\${d.y})\`);
    });
    this.simulation.force('link').links(data.links);
  }
}

// Load feed.json → build graph → render
fetch('./feed.json')
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

const articles = loadArticles();
console.log(`Found ${articles.length} article(s)`);

const feed = buildFeed(articles);

if (!fs.existsSync(SITE_DIR)) fs.mkdirSync(SITE_DIR);

fs.writeFileSync(path.join(SITE_DIR, 'feed.json'), JSON.stringify(feed, null, 2));
fs.writeFileSync(path.join(SITE_DIR, 'index.html'), buildIndexHTML());

console.log(`Generated _site/feed.json (${feed.items.length} items)`);
console.log('Generated _site/index.html (reads feed.json at load time)');
