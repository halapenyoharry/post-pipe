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
const FONT_PATH    = path.join(__dirname, 'fonts/OpenDyslexic-Regular.woff2');
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Harold Young — Human Posts</title>
<style>
  @font-face {
    font-family: 'OpenDyslexic';
    src: url(data:font/woff2;base64,${fontB64}) format('woff2');
    font-weight: normal;
    font-style: normal;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #1a1a2e; color: #e0e0e0; font-family: 'OpenDyslexic', sans-serif; overflow: hidden; }
  #graph { width: 100vw; height: 100vh; }
  .node { cursor: pointer; }
  .node text { font-size: 13px; fill: #ccc; pointer-events: none; font-family: 'OpenDyslexic', sans-serif; }
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
</style>
</head>
<body>
<div id="graph"></div>
<div id="tooltip"><div class="title"></div><div class="desc"></div><div class="date"></div></div>
<div id="error"></div>

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
      .force('link', d3.forceLink().id(d => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('collide', d3.forceCollide().radius(d => d.size / 2 + 10).strength(0.9))
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

    nodes.each(function(d) {
      const el = d3.select(this);

      el.append('circle')
        .attr('r', d.size / 2)
        .attr('fill', d.color)
        .attr('stroke', d.type === 'article' ? '#fff' : 'none')
        .attr('stroke-width', d.type === 'article' ? 2 : 0)
        .attr('opacity', d.type === 'tag' ? 0.6 : 1);

      el.append('text')
        .attr('dy', d.size / 2 + 15)
        .attr('text-anchor', 'middle')
        .text(d.label);
    });

    nodes.filter(d => d.type === 'article')
      .on('click', (event, d) => { window.open(d.url, '_blank'); })
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
