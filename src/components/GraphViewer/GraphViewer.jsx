import React, { useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import * as d3 from 'd3';
import styles from './GraphViewer.module.css';
import { lensFor } from '../NodeView';

// Transform the raw feed JSON into graph nodes and links.
function feedToGraph(feed, config = {}) {
  const nodes = [];
  const links = [];
  const tagNodes = new Map();

  const draftColor = config.nodeDraftColor || '#555';
  const publishedColor = config.nodePublishedColor || '#2ecc71';
  const tagColor = config.tagColor || '#f39c12';

  for (const item of feed.items) {
    const slug = item.url.split('/').pop().replace('.html', '');
    const status = item._status || 'draft';

    nodes.push({
      id: slug,
      // The zoomed-out label. Was the raw slug, which for a feed item is
      // something like '26090107054.htm' — unreadable, and the reason the
      // far-zoom view was a wall of noise.
      label: (item.labels && item.labels.short) || slug,
      labelMedium: (item.labels && item.labels.medium) || slug,
      labelFull: item.title || slug,
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
      color: status === 'published' ? publishedColor : draftColor,
      kind: item.kind || 'essay',
      substrate: item.substrate || 'essay',
      seed: item.seed || '',
      topology: item.topology || [],
      energy: item.energy || '',
      connected_to: item.connected_to || [],
      forms: item.forms || {},
      note: item.note || '',
      todos: item.todos || [],
      _source: item._source || null,
      originalItem: item
    });

    for (const tag of (item.tags || [])) {
      if (!tagNodes.has(tag)) {
        tagNodes.set(tag, {
          id: 'tag:' + tag,
          label: tag,
          type: 'tag',
          size: 30,
          color: tagColor,
        });
      }
      links.push({ source: slug, target: 'tag:' + tag });
    }
  }

  nodes.push(...tagNodes.values());
  return { nodes, links };
}

// Walk article nodes + links and toggle their display based on whether
// the item's source is currently in the hidden set. Pure DOM mutation,
// no simulation involvement — node positions stay locked.
function applyVisibility(svg, hiddenSet) {
  const isHiddenArticle = (d) =>
    d && d.type === 'article' && d._source && hiddenSet.has(d._source.id);

  svg.selectAll('.node')
    .style('display', (d) => isHiddenArticle(d) ? 'none' : null);

  svg.selectAll('.link')
    .style('display', (l) => {
      const sNode = typeof l.source === 'object' ? l.source : null;
      const tNode = typeof l.target === 'object' ? l.target : null;
      if (isHiddenArticle(sNode) || isHiddenArticle(tNode)) return 'none';
      return null;
    });
}

// Zoom-aware level of detail. Three levels of precision built into the
// graph: at deep zoom-out the node is just the slug; closer in, the
// short_title; closer still, the full card.
const LOD_SLUG_ONLY = 0.4;
const LOD_TITLE_ONLY = 0.7;
function getLOD(scale) {
  if (scale < LOD_SLUG_ONLY) return 'slug';
  if (scale < LOD_TITLE_ONLY) return 'title';
  return 'full';
}

// Card dimensions per view state. Returned to both GraphViewer (which sizes
// the foreignObject) and the host wrapper (which sizes the React mount).
// Space left around the card inside its foreignObject. An SVG foreignObject
// clips at its own bounds, so a card sized exactly to the frame has its glow
// sliced off square — worse than no glow. This gutter gives it room.
const GLOW_PAD = 16;

function cardSizeFor({ hovered, pinned }) {
  if (pinned) return { width: 230, height: 190 };
  if (hovered) return { width: 200, height: 160 };
  return { width: 180, height: 140 };
}

export function GraphViewer({ feedData, onNodeSelect, hiddenSources, viewState }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  // Stable refs for callbacks so the simulation never rebuilds on prop change.
  const onNodeSelectRef = useRef(onNodeSelect);
  useEffect(() => { onNodeSelectRef.current = onNodeSelect; }, [onNodeSelect]);

  // Same reason as onNodeSelect: the store must be reachable from D3 handlers
  // without becoming a dependency that rebuilds the simulation.
  const viewStateRef = useRef(viewState);
  useEffect(() => { viewStateRef.current = viewState; }, [viewState]);

  // Where a node's arrangement is filed. Articles key by their item id — the
  // permalink — so the arrangement survives a rebuild that renumbers or
  // reorders everything. Tag and topology nodes key by their own synthetic id,
  // which is already stable.
  const persistKey = (d) => (d.originalItem && d.originalItem.id) || d.id;

  // View state lives in refs because it must not trigger React re-renders or
  // re-run the useEffect that owns the simulation.
  const pinnedIdRef = useRef(null);
  const hoveredIdRef = useRef(null);
  const zoomScaleRef = useRef(1);
  const currentLodRef = useRef('full');
  const hiddenSourcesRef = useRef(new Set());

  // Apply visibility from outside the main simulation effect, so toggling
  // a feed never rebuilds the graph. We query the SVG via d3 directly and
  // flip display/visibility on the existing nodes and links.
  useEffect(() => {
    hiddenSourcesRef.current = hiddenSources instanceof Set
      ? hiddenSources
      : new Set(hiddenSources || []);
    if (!svgRef.current) return;
    applyVisibility(svgRef.current, hiddenSourcesRef.current);
  }, [hiddenSources]);

  useEffect(() => {
    if (!feedData || !containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const computedStyles = getComputedStyle(container);
    const config = {
      nodeDraftColor: computedStyles.getPropertyValue('--gv-node-draft').trim() || '#555',
      nodePublishedColor: computedStyles.getPropertyValue('--gv-node-published').trim() || '#2ecc71',
      tagColor: computedStyles.getPropertyValue('--gv-tag-color').trim() || '#f39c12'
    };

    const data = feedToGraph(feedData, config);

    d3.select(container).selectAll('svg').remove();

    const svg = d3.select(container).append('svg')
      .attr('width', width)
      .attr('height', height);

    svgRef.current = svg;

    const g = svg.append('g');

    // Zoom — repaints node text content only when crossing an LOD boundary;
    // never touches the simulation. Also updates the slug-label overlay's
    // font-size on every zoom event so the on-screen label size stays
    // constant as the user zooms in/out.
    const zoom = d3.zoom().on('zoom', (event) => {
      g.attr('transform', event.transform);
      const newScale = event.transform.k;
      zoomScaleRef.current = newScale;
      const newLod = getLOD(newScale);
      if (newLod !== currentLodRef.current) {
        currentLodRef.current = newLod;
        renderAllArticleBodies();
      }
      updateSlugLabels(newScale);
    });
    svg.call(zoom).on('dblclick.zoom', null);

    // Restore anything the reader has already placed. Setting fx/fy pins the
    // node, so the simulation lays out only what has never been positioned and
    // arranges the rest around the reader's choices rather than over them.
    if (viewStateRef.current) {
      for (const d of data.nodes) {
        const saved = viewStateRef.current.nodeState(persistKey(d));
        if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
          d.x = saved.x; d.y = saved.y;
          d.fx = saved.x; d.fy = saved.y;
        }
      }
    }

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id).distance(160))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('collide', d3.forceCollide().radius(d => (d._r || d.size / 2) + 10).strength(1).iterations(3))
      .force('center', d3.forceCenter(width / 2, height / 2))
      // Damping was heavy enough, and the run short enough, that collisions
      // never finished resolving before the simulation froze — nodes were
      // still overlapping when everything stopped. Looser damping over a
      // longer run lets things find their space. It settles once, at load,
      // and then holds still, which is the behaviour that matters.
      .velocityDecay(0.7)
      .alphaDecay(0.028);

    // Resize: rescale the SVG canvas only. Never restart the simulation —
    // node positions in graph-space stay fixed; only the viewport changes.
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      svg.attr('width', width).attr('height', height);
    };
    window.addEventListener('resize', handleResize);

    // Render links + nodes.
    const links = g.selectAll('.link')
      .data(data.links)
      .enter().append('line')
      .attr('class', 'link');

    const nodes = g.selectAll('.node')
      .data(data.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', (event, d) => {
          // Bypass the simulation entirely. We don't restart d3-force —
          // dragging directly updates this node's transform and its
          // incident link endpoints below. Nothing else in the graph
          // moves, period.
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.x = event.x; d.y = event.y;
          d.fx = event.x; d.fy = event.y;
          if (viewStateRef.current) {
            viewStateRef.current.setNodePosition(persistKey(d), event.x, event.y, { transient: true });
          }
          nodes.filter(nd => nd.id === d.id)
            .attr('transform', 'translate(' + event.x + ',' + event.y + ')');
          links.each(function(l) {
            const sid = typeof l.source === 'object' ? l.source.id : l.source;
            const tid = typeof l.target === 'object' ? l.target.id : l.target;
            if (sid === d.id || tid === d.id) {
              const sx = typeof l.source === 'object' ? l.source.x : 0;
              const sy = typeof l.source === 'object' ? l.source.y : 0;
              const tx = typeof l.target === 'object' ? l.target.x : 0;
              const ty = typeof l.target === 'object' ? l.target.y : 0;
              d3.select(this).attr('x1', sx).attr('y1', sy).attr('x2', tx).attr('y2', ty);
            }
          });
        })
        .on('end', (event, d) => {
          d.fx = d.x; d.fy = d.y;
          // One history entry for the whole drag, not one per frame.
          const vs = viewStateRef.current;
          if (vs) {
            vs.setNodePosition(persistKey(d), d.x, d.y, { transient: true });
            vs.commit();
          }
        })
      );

    // Tag-node rendering uses a probe to size the bubble.
    const probe = svg.append('text')
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
        d._r = Math.hypot(bubbleW, bubbleH) / 2;
      } else {
        // Article nodes get a foreignObject that we'll re-fill on state change.
        el.append('foreignObject').attr('class', 'article-fo');
        // Slug label overlay — visible only at slug-LOD. Font-size set
        // dynamically in updateSlugLabels so the longest slug fits the
        // current viewport width.
        el.append('text')
          .attr('class', 'slug-label')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .style('fill', '#fff')
          .style('font-family', "'Atkinson', sans-serif")
          .style('font-weight', '700')
          .style('pointer-events', 'none')
          .style('paint-order', 'stroke')
          .style('stroke', '#000')
          .style('stroke-width', '4px')
          .style('stroke-opacity', '0.75')
          .style('display', 'none')
          .text(d.label);
        // Collision radius from the card's real footprint. This was size/2,
        // which is 30 for a card that is 180x140 — the reason cards sat on top
        // of each other and tags landed inside them. A circle round a rectangle
        // is approximate either way; half the diagonal is the version that
        // guarantees no overlap rather than the version that looks tidy in
        // isolation.
        const rest = cardSizeFor({ hovered: false, pinned: false });
        d._r = Math.hypot(rest.width, rest.height) / 2;
      }
    });

    // Measure the longest slug's text width at a probe font-size so we can
    // compute the font-size that makes the longest slug exactly fit the
    // viewport. Done once at setup since slug strings are static.
    const SLUG_PROBE_SIZE = 100;
    probe.style('font-family', "'Atkinson', sans-serif")
      .style('font-weight', '700')
      .style('font-size', SLUG_PROBE_SIZE + 'px');
    let maxSlugWidthAtProbe = 1;
    data.nodes.forEach(d => {
      if (d.type === 'article') {
        probe.text(d.label);
        const w = probe.node().getComputedTextLength();
        if (w > maxSlugWidthAtProbe) maxSlugWidthAtProbe = w;
      }
    });
    // Width contributed by one unit of font-size = (max width at probe) / probe size.
    const slugWidthPerFontUnit = maxSlugWidthAtProbe / SLUG_PROBE_SIZE;
    probe.remove();

    // One React root per article node, mounted inside that node's
    // foreignObject. Keyed by node id. Roots are unmounted on cleanup so we
    // don't leak across feedData changes. The React tree inside each root
    // is pure — TextView is presentational; D3 still owns all events on
    // the parent <g>.
    const reactRoots = new Map();
    nodes.filter(d => d.type === 'article').each(function(d) {
      const fo = d3.select(this).select('foreignObject.article-fo').node();
      // React needs an HTML element to mount into (not the SVG foreignObject
      // itself). Append a single xhtml wrapper inside.
      const wrapper = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      wrapper.style.width = '100%';
      wrapper.style.height = '100%';
      wrapper.style.boxSizing = 'border-box';
      fo.appendChild(wrapper);
      reactRoots.set(d.id, { root: createRoot(wrapper), fo, wrapper });
    });

    // Paint one article node's lens based on its current state. Sizes the
    // foreignObject and re-renders the TextView with fresh props.
    function renderArticleBody(d) {
      if (d.type !== 'article') return;
      const entry = reactRoots.get(d.id);
      if (!entry) return;
      const hovered = hoveredIdRef.current === d.id;
      const pinned = pinnedIdRef.current === d.id;
      const lod = getLOD(zoomScaleRef.current);
      const { width: w, height: h } = cardSizeFor({ hovered, pinned });

      d3.select(entry.fo)
        .attr('width', w + GLOW_PAD * 2).attr('height', h + GLOW_PAD * 2)
        .attr('x', -w / 2 - GLOW_PAD).attr('y', -h / 2 - GLOW_PAD);
      entry.wrapper.style.width = w + 'px';
      entry.wrapper.style.height = h + 'px';
      entry.wrapper.style.margin = GLOW_PAD + 'px';

      const Lens = lensFor(d.kind);
      entry.root.render(
        React.createElement(Lens, {
          article: d,
          width: w,
          height: h,
          viewState: { hovered, pinned, lod },
          fullContent: d._fullContent || null
        })
      );
      // Keep the collision radius on the resting footprint. Growing it on
      // hover would shove the neighbours away every time the cursor passed,
      // which is exactly the restlessness the graph is built to avoid.
    }

    // Block wheel events from inside any article node from reaching the
    // SVG zoom handler. Attached on the foreignObject so wheel anywhere
    // inside the card is consumed; the browser's default scroll on
    // .rp-scroll still fires because we only stop propagation.
    nodes.filter(d => d.type === 'article').select('foreignObject.article-fo')
      .on('wheel', (e) => e.stopPropagation());

    function renderAllArticleBodies() {
      data.nodes.forEach(d => { if (d.type === 'article') renderArticleBody(d); });
    }

    // Slug-label overlay: shown only at slug-LOD. Font-size is chosen so the
    // LONGEST slug exactly fits the viewport width — all slugs share that
    // size for consistency. As large as it can get without overflowing.
    // Hidden when the node is hovered or pinned.
    function updateSlugLabels(scale) {
      const showAny = scale < LOD_SLUG_ONLY;
      const labels = nodes.filter(d => d.type === 'article').select('.slug-label');
      if (!showAny) {
        labels.style('display', 'none');
        return;
      }
      // Size the label so the longest one fits the viewport — but bounded at
      // both ends. Unbounded, this formula divides the viewport by the longest
      // label's width, so a corpus of SHORT labels produced enormous type, and
      // then divided it again by the zoom scale. At far zoom that gave 280px
      // words stacked on top of each other: the wall of overlapping text.
      const viewportPx = containerRef.current
        ? containerRef.current.clientWidth
        : window.innerWidth;
      const margin = 0.9;
      const MIN_LABEL_PX = 11;   // below this it is decoration, not a label
      const MAX_LABEL_PX = 26;   // above this one label owns the screen
      const fitted = (viewportPx * margin) / Math.max(slugWidthPerFontUnit, 1);
      const screenFontSize = Math.max(MIN_LABEL_PX, Math.min(MAX_LABEL_PX, fitted));

      // Density: labels are only useful while they do not collide. Estimate the
      // on-screen room each node has from the graph's own extent, and if a label
      // cannot fit in it, show none rather than a smear. Reading the shape is
      // the point at this zoom; reading the words is what zooming in is for.
      const articles = data.nodes.filter(d => d.type === 'article');
      let spacingOk = true;
      if (articles.length > 1) {
        const xs = articles.map(d => d.x || 0);
        const ys = articles.map(d => d.y || 0);
        const w = (Math.max(...xs) - Math.min(...xs)) * scale;
        const h = (Math.max(...ys) - Math.min(...ys)) * scale;
        const roomPerNode = Math.sqrt(Math.max(w * h, 1) / articles.length);
        const labelWidthPx = slugWidthPerFontUnit * screenFontSize;
        spacingOk = roomPerNode > labelWidthPx * 0.55;
      }
      if (!spacingOk) {
        labels.style('display', 'none');
        return;
      }

      // Convert to SVG units so it survives the zoom transform and renders
      // at the chosen on-screen size: svg_font_size * k = screen_font_size.
      const svgFontSize = screenFontSize / Math.max(scale, 0.01);
      labels
        .style('font-size', svgFontSize + 'px')
        .style('display', d => (d.id === hoveredIdRef.current || d.id === pinnedIdRef.current) ? 'none' : null);
    }

    // Article-content fetch cache. Keyed by node id. Value is the body HTML
    // (with <h1> removed) or null on fetch failure.
    const articleContentCache = new Map();
    function loadFullContent(d) {
      if (articleContentCache.has(d.id)) {
        d._fullContent = articleContentCache.get(d.id);
        return Promise.resolve();
      }
      return fetch(d.url)
        .then(r => {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.text();
        })
        .then(html => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const h1 = doc.querySelector('h1');
          if (h1) h1.remove();
          const bodyHtml = doc.querySelector('body')
            ? doc.querySelector('body').innerHTML
            : html;
          articleContentCache.set(d.id, bodyHtml);
          d._fullContent = bodyHtml;
        })
        .catch(() => {
          articleContentCache.set(d.id, null);
          d._fullContent = null;
        });
    }

    // Initial paint.
    renderAllArticleBodies();
    updateSlugLabels(zoomScaleRef.current);
    applyVisibility(svg, hiddenSourcesRef.current);

    // Hover / click handlers. mouseover/mouseout (not mouseenter/leave)
    // because the foreignObject's inner HTML gets replaced on re-render
    // and mouseenter sometimes fails to re-fire on the new content.
    // We guard with relatedTarget so child-to-child cursor moves inside
    // the same node don't toggle the state.
    nodes.filter(d => d.type === 'article')
      .on('mouseover', (event, d) => {
        if (hoveredIdRef.current === d.id) return;
        hoveredIdRef.current = d.id;
        renderArticleBody(d);
        updateSlugLabels(zoomScaleRef.current);
      })
      .on('mouseout', (event, d) => {
        const related = event.relatedTarget;
        if (related && event.currentTarget.contains(related)) return;
        if (hoveredIdRef.current === d.id) {
          hoveredIdRef.current = null;
          renderArticleBody(d);
          updateSlugLabels(zoomScaleRef.current);
        }
      })
      .on('dblclick', (event, d) => {
        // Double-click opens the reader. It used to land as two single clicks,
        // which pinned and then unpinned the node — a visible twitch and no
        // result. Same destination as the popout button: reader open, node
        // back to its resting size.
        event.stopPropagation();
        event.preventDefault();
        if (onNodeSelectRef.current) {
          onNodeSelectRef.current(d.originalItem || d);
        }
        pinnedIdRef.current = null;
        hoveredIdRef.current = null;
        renderArticleBody(d);
        updateSlugLabels(zoomScaleRef.current);
      })
      .on('click', (event, d) => {
        const target = event.target;
        const isPopout = target && (target.dataset?.popout === '1' ||
                                    target.closest?.('[data-popout="1"]'));
        if (isPopout) {
          // Open the side reader AND return this node to its default size.
          event.stopPropagation();
          if (onNodeSelectRef.current) {
            onNodeSelectRef.current(d.originalItem || d);
          }
          if (pinnedIdRef.current === d.id) {
            pinnedIdRef.current = null;
            // Also clear hover so the node truly returns to default.
            hoveredIdRef.current = null;
            renderArticleBody(d);
            updateSlugLabels(zoomScaleRef.current);
          }
          return;
        }
        // Toggle pin on this node.
        event.stopPropagation();
        const prevPinned = pinnedIdRef.current;
        if (prevPinned === d.id) {
          pinnedIdRef.current = null;
          renderArticleBody(d);
          updateSlugLabels(zoomScaleRef.current);
        } else {
          pinnedIdRef.current = d.id;
          renderArticleBody(d);
          nodes.filter(nd => nd.id === d.id).raise();
          if (prevPinned) {
            const prev = data.nodes.find(nd => nd.id === prevPinned);
            if (prev) renderArticleBody(prev);
          }
          updateSlugLabels(zoomScaleRef.current);
          // Fetch full article body so the pinned node becomes a mini-reader.
          // Re-render when content arrives, but only if this node is still
          // the pinned one (user might have unpinned in the meantime).
          loadFullContent(d).then(() => {
            if (pinnedIdRef.current === d.id) renderArticleBody(d);
          });
        }
      });

    // Tag click: highlight only — no rearrangement, no simulation restart.
    let activeTag = null;
    nodes.filter(d => d.type === 'tag')
      .on('click', (event, d) => {
        event.stopPropagation();
        if (activeTag === d.id) {
          activeTag = null;
          nodes.classed('dimmed', false).classed('tag-active', false);
          links.classed('highlighted', false);
        } else {
          activeTag = d.id;
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
        }
      });

    // Background click: unpin any pinned node, clear any active tag.
    svg.on('click', () => {
      if (activeTag) {
        activeTag = null;
        nodes.classed('dimmed', false).classed('tag-active', false);
        links.classed('highlighted', false);
      }
      const hadPinned = !!pinnedIdRef.current;
      if (pinnedIdRef.current) {
        const prev = data.nodes.find(nd => nd.id === pinnedIdRef.current);
        pinnedIdRef.current = null;
        if (prev) renderArticleBody(prev);
      }
      if (hadPinned) updateSlugLabels(zoomScaleRef.current);
    });

    // Simulation tick → position nodes. When alpha falls below alphaMin,
    // D3 stops automatically. We never call .restart() anywhere — once
    // settled, the graph stays still until the page is reloaded.
    // Painting positions is separate from the simulation advancing them.
    // Node transforms used to be written only inside the tick handler, which
    // silently assumed a tick would always happen. It does not: d3-timer runs
    // on requestAnimationFrame, and a page in a hidden tab or a collapsed pane
    // gets no frames at all. A reader whose whole arrangement is already saved
    // needs no simulation — and would have got a graph stacked at the origin.
    function applyPositions() {
      links.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
           .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      nodes.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
    }

    simulation.nodes(data.nodes).on('tick', applyPositions);
    simulation.force('link').links(data.links);

    // Paint once now, from whatever positions were restored or seeded, so the
    // first frame is correct with or without the simulation ever running.
    applyPositions();

    // When the simulation ends, freeze every node by copying x/y to fx/fy.
    // Any later interaction (drag, etc.) keeps positions stable.
    // Frame the whole graph once it has settled, but only when the reader has
    // not arranged it themselves. Giving every node its true footprint spreads
    // the corpus over far more space than before, and a layout you have to go
    // looking for is not an improvement on one that overlaps.
    function fitToViewport() {
      const pts = data.nodes.filter(d => d.type === 'article');
      if (pts.length < 2) return;
      const pad = 140;
      const minX = Math.min(...pts.map(d => d.x)) - pad;
      const maxX = Math.max(...pts.map(d => d.x)) + pad;
      const minY = Math.min(...pts.map(d => d.y)) - pad;
      const maxY = Math.max(...pts.map(d => d.y)) + pad;
      const w = containerRef.current ? containerRef.current.clientWidth : window.innerWidth;
      const h = containerRef.current ? containerRef.current.clientHeight : window.innerHeight;
      const k = Math.min(w / Math.max(maxX - minX, 1), h / Math.max(maxY - minY, 1), 1);
      const tx = w / 2 - ((minX + maxX) / 2) * k;
      const ty = h / 2 - ((minY + maxY) / 2) * k;
      svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(k));
    }

    simulation.on('end', () => {
      data.nodes.forEach(d => { d.fx = d.x; d.fy = d.y; });
      // The layout the simulation settled on is itself an arrangement worth
      // keeping — otherwise every reload reshuffles a graph the reader has
      // started to learn the shape of. Recorded without history: the reader
      // did not do this, so there is nothing for them to undo.
      const vs = viewStateRef.current;
      let anyRestored = false;
      if (vs) {
        for (const d of data.nodes) {
          if (vs.nodeState(persistKey(d))) anyRestored = true;
          else vs.setNodePosition(persistKey(d), d.x, d.y, { silent: true });
        }
      }
      if (!anyRestored) fitToViewport();
    });

    return () => {
      simulation.stop();
      window.removeEventListener('resize', handleResize);
      // Unmount React roots BEFORE D3 tears down the SVG — otherwise React
      // would try to reconcile against a detached DOM tree on the next
      // effect run. Defer the unmount so it doesn't fire inside a render.
      reactRoots.forEach(({ root }) => {
        queueMicrotask(() => root.unmount());
      });
      reactRoots.clear();
    };
    // Deliberately depend only on feedData — onNodeSelect changes are
    // handled through onNodeSelectRef without rebuilding the simulation.
  }, [feedData]);

  return (
    <div
      ref={containerRef}
      className={styles.graphContainer}
    />
  );
}
