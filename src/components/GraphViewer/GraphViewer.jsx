import React, { useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import * as d3 from 'd3';
import styles from './GraphViewer.module.css';
import { lensFor } from '../NodeView';
import { computeLayout, layoutIsDegenerate, timeAxisGeometry } from './layouts';

// Transform the raw feed JSON into graph nodes and links. Links come from
// feed.edges — the authored connected_to edges, the tag/topology reifications,
// and any sequence edges are all already computed on disk (buildEdges.js);
// this just resolves each edge's endpoints to the ids this renderer uses.
function feedToGraph(feed, config = {}) {
  const nodes = [];
  const links = [];
  const auxNodes = new Map(); // tag:/topology:/placeholder id -> node
  const articleSlugs = new Set();
  const idToSlug = new Map(); // item.id (feed-item identity) -> renderer slug

  const draftColor = config.nodeDraftColor || '#555';
  const publishedColor = config.nodePublishedColor || '#2ecc71';
  const tagColor = config.tagColor || '#f39c12';
  const topologyColor = config.topologyColor || '#9b59b6';
  const placeholderColor = config.placeholderColor || '#7f8c8d';

  for (const item of feed.items) {
    const slug = item.url.split('/').pop().replace('.html', '');
    const status = item._status || 'draft';
    idToSlug.set(item.id, slug);
    articleSlugs.add(slug);

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
  }

  // Edge endpoints are item.id (a feed item's own identity — a full URL for
  // local content), or a synthetic 'tag:'/'topology:' id, or — for an
  // authored edge nobody has written yet — a bare slug with no item behind
  // it. Resolve each to the id this renderer actually uses for that node.
  function resolveEndpoint(rawId) {
    if (rawId.startsWith('tag:') || rawId.startsWith('topology:')) return rawId;
    return idToSlug.get(rawId) || rawId;
  }

  for (const edge of (feed.edges || [])) {
    const source = resolveEndpoint(edge.source);
    const target = resolveEndpoint(edge.target);

    if (edge.layer === 'tag' && !auxNodes.has(target)) {
      auxNodes.set(target, { id: target, label: target.slice(4), type: 'tag', size: 30, color: tagColor });
    } else if (edge.layer === 'topology' && !auxNodes.has(target)) {
      auxNodes.set(target, { id: target, label: target.slice(9), type: 'topology', size: 30, color: topologyColor });
    } else if (edge.layer === 'authored' && !articleSlugs.has(target) && !auxNodes.has(target)) {
      // A connected_to edge pointing at a piece that hasn't been written yet.
      // Not an error — a placeholder with gravity, per buildEdges.js.
      auxNodes.set(target, { id: target, label: target, type: 'placeholder', size: 40, color: placeholderColor });
    }

    links.push({ source, target, directed: !!edge.directed, role: edge.role, layer: edge.layer });
  }

  nodes.push(...auxNodes.values());
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


// Bounds for a hand-resized card. Below the minimum the label stops fitting;
// above the maximum one node eats the graph.
function makeCardSizeFor(CARD) {
  return function cardSizeFor({ hovered, pinned }) {
    if (pinned) return { width: CARD.pinnedWidth, height: CARD.pinnedHeight };
    if (hovered) return { width: CARD.hoverWidth, height: CARD.hoverHeight };
    return { width: CARD.width, height: CARD.height };
  };
}

export function GraphViewer({
  feedData, onNodeSelect, hiddenSources, viewState, layout = 'force', timeAxis, graphSettings,
  colorOverrides,
}) {
  // Visual parameters come from settings.json so they can be tuned without a
  // rebuild. The defaults here are the values they replaced, so a missing or
  // partial settings file still renders exactly as before rather than oddly.
  const GS = graphSettings || {};
  const CARD = { width: 180, height: 140, hoverWidth: 200, hoverHeight: 160,
    pinnedWidth: 230, pinnedHeight: 190, minWidth: 110, minHeight: 80,
    maxWidth: 620, maxHeight: 520, glowPadding: 16, ...(GS.card || {}) };
  const TAG = { fontSize: 22, padding: 11, maxWidth: 150, maxLines: 3,
    cornerRadius: 9, opacity: 0.7, ...(GS.tag || {}) };
  const AX = { dock: 'left', inset: 54, endPadding: 70, connectorOpacity: 0.45,
    connectorWidth: 1.6, spineOpacity: 0.55, spineWidth: 3, tickFontSize: 13,
    ...(GS.timeAxis || {}) };
  const SIM = { linkDistance: 160, chargeStrength: -500, collidePadding: 10,
    velocityDecay: 0.7, alphaDecay: 0.028, ...(GS.simulation || {}) };

  const containerRef = useRef(null);
  const svgRef = useRef(null);

  // Stable refs for callbacks so the simulation never rebuilds on prop change.
  const onNodeSelectRef = useRef(onNodeSelect);
  useEffect(() => { onNodeSelectRef.current = onNodeSelect; }, [onNodeSelect]);

  // Same reason as onNodeSelect: the store must be reachable from D3 handlers
  // without becoming a dependency that rebuilds the simulation.
  const viewStateRef = useRef(viewState);
  useEffect(() => { viewStateRef.current = viewState; }, [viewState]);

  // The live graph, reachable from effects that must not rebuild it.
  const cardSizeFor = makeCardSizeFor(CARD);
  const GLOW_PAD = CARD.glowPadding;

  const graphRef = useRef(null);
  const layoutRef = useRef(layout);
  const axisFittedRef = useRef(false);
  // Set by the axis effect so the simulation can ask for a redraw when the
  // nodes it is measured against have finished moving.
  const redrawAxisRef = useRef(null);
  // Set by the axis draw so pan and zoom can re-project the connectors.
  const connectorUpdateRef = useRef(null);

  // Where a node's arrangement is filed. Articles key by their item id — the
  // permalink — so the arrangement survives a rebuild that renumbers or
  // reorders everything. Tag and topology nodes key by their own synthetic id,
  // which is already stable.
  const persistKey = (d) => (d.originalItem && d.originalItem.id) || d.id;

  // Where a node sits depends on the layout — a node has one place in a ring
  // and another on a timeline — so positions are filed per layout. How big the
  // reader made it does not, so size is filed against the item alone.
  const positionKey = (d) => layoutRef.current + '::' + persistKey(d);

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

  // Settings writes a color profile to viewState; this repaints instantly by
  // setting the CSS custom properties every bubble and card already reads
  // via var(...) — no simulation rebuild, no React re-render of any node.
  useEffect(() => {
    if (!containerRef.current || !colorOverrides) return;
    for (const [prop, value] of Object.entries(colorOverrides)) {
      if (value) containerRef.current.style.setProperty(prop, value);
    }
  }, [colorOverrides]);

  useEffect(() => {
    if (!feedData || !containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const computedStyles = getComputedStyle(container);
    const config = {
      nodeDraftColor: computedStyles.getPropertyValue('--gv-node-draft').trim() || '#555',
      nodePublishedColor: computedStyles.getPropertyValue('--gv-node-published').trim() || '#2ecc71',
      tagColor: computedStyles.getPropertyValue('--gv-tag-color').trim() || '#f39c12',
      topologyColor: computedStyles.getPropertyValue('--gv-topology-color').trim() || '#9b59b6',
      placeholderColor: computedStyles.getPropertyValue('--gv-placeholder-color').trim() || '#7f8c8d'
    };

    const data = feedToGraph(feedData, config);

    d3.select(container).selectAll('svg').remove();
    d3.select(container).selectAll('.cards-layer').remove();

    const svg = d3.select(container).append('svg')
      .attr('width', width)
      .attr('height', height);

    svgRef.current = svg;
    
    // The two-layer architecture: SVG handles lines/bubbles, HTML handles cards.
    // Width/height 100% on the layer, but the transform container is 0x0
    // so Safari doesn't clip out-of-bounds accelerated children.
    const cardsLayer = d3.select(container).append('div')
      .attr('class', 'cards-layer')
      .style('position', 'absolute')
      .style('left', '0')
      .style('top', '0')
      .style('width', '100%')
      .style('height', '100%')
      .style('pointer-events', 'none');

    const cardsTransform = cardsLayer.append('div')
      .attr('class', 'cards-transform')
      .style('transform-origin', '0 0')
      .style('position', 'absolute')
      .style('left', '0')
      .style('top', '0')
      .style('width', '0')
      .style('height', '0')
      .style('overflow', 'visible');

    const g = svg.append('g');

    // Zoom — repaints node text content only when crossing an LOD boundary;
    // never touches the simulation. Re-renders card contents at the new
    // font-size on every zoom event so the on-screen label size stays
    // constant as the user zooms in/out.
    const zoom = d3.zoom().on('zoom', (event) => {
      g.attr('transform', event.transform);
      if (cardsTransform) {
        cardsTransform.style('transform', `translate3d(${event.transform.x}px, ${event.transform.y}px, 0px) scale(${event.transform.k})`);
      }
      const newScale = event.transform.k;
      zoomScaleRef.current = newScale;
      // The rail is pinned to the window and the nodes are not, so every pan
      // and zoom moves one end of every connector.
      if (connectorUpdateRef.current) connectorUpdateRef.current();
      const newLod = getLOD(newScale);
      if (newLod !== currentLodRef.current) {
        currentLodRef.current = newLod;
        renderAllArticleBodies();
      }
    });
    svg.call(zoom).on('dblclick.zoom', null);

    // Restore anything the reader has already placed. Setting fx/fy pins the
    // node, so the simulation lays out only what has never been positioned and
    // arranges the rest around the reader's choices rather than over them.
    // A stored arrangement is only worth restoring if it is a real one.
    //
    // The simulation runs on requestAnimationFrame, so a page that is never
    // looked at never lays out — and if anything wrote those unsettled
    // positions to storage, every later load would restore the pile and skip
    // both the settle and the fit, because it looked like the reader had an
    // arrangement. The graph would be permanently broken by one bad load.
    //
    // The check is area: a layout needs room for its nodes. Anything occupying
    // a small fraction of that is not an arrangement, whatever produced it.
    let positionsWereDegenerate = false;
    if (viewStateRef.current) {
      const restored = data.nodes
        .map(d => viewStateRef.current.nodeState(positionKey(d)))
        .filter(p => p && Number.isFinite(p.x) && Number.isFinite(p.y));
      positionsWereDegenerate = layoutIsDegenerate(
        restored, cardSizeFor({ hovered: false, pinned: false }),
      );
    }

    if (viewStateRef.current && !positionsWereDegenerate) {
      for (const d of data.nodes) {
        const saved = viewStateRef.current.nodeState(positionKey(d));
        const savedSize = viewStateRef.current.nodeState(persistKey(d));
        if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
          d.x = saved.x; d.y = saved.y;
          // Only a position the *reader* placed earns a hard pin. Pinning a
          // layout-generated one (saved.auto) freezes it against every force
          // including collide — so a stored arrangement with cards sitting on
          // top of each other stays on top of each other permanently, no
          // matter how many times the graph is reloaded or re-settled. That
          // is the "stuck there artificially" pile: articles restored into
          // overlap and nailed down, while tags (which settle freshly) spread
          // around them normally. Seeding x/y without fx/fy keeps the
          // arrangement the reader is used to and still lets physics push
          // overlapping cards apart.
          if (!saved.auto) { d.fx = saved.x; d.fy = saved.y; }
        }
        if (savedSize && typeof savedSize.w === 'number' && typeof savedSize.h === 'number') {
          d._size = { width: savedSize.w, height: savedSize.h };
        }
      }
    } else if (viewStateRef.current) {
      // Positions rejected, but a card the reader resized is still their work.
      for (const d of data.nodes) {
        const savedSize = viewStateRef.current.nodeState(persistKey(d));
        if (savedSize && typeof savedSize.w === 'number' && typeof savedSize.h === 'number') {
          d._size = { width: savedSize.w, height: savedSize.h };
        }
      }
    }


    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id).distance(SIM.linkDistance))
      .force('charge', d3.forceManyBody().strength(SIM.chargeStrength))
      // d._r is the node's real measured footprint, assigned during the
      // render pass — but forceCollide caches every radius when the force is
      // initialized, so if that pass has not run yet the fallback is what
      // sticks for the whole simulation. `size / 2` is 30 for an article
      // whose card is actually 180x140 (true radius 114), so the fallback
      // alone would let cards overlap almost completely — the same
      // footprint-vs-radius mismatch as before, just reachable by timing
      // rather than by arithmetic. Fall back to the real card geometry.
      .force('collide', d3.forceCollide()
        .radius(d => (d._r || (d.type === 'article'
          ? Math.hypot(CARD.width, CARD.height) / 2
          : d.size / 2)) + SIM.collidePadding)
        .strength(1).iterations(3))
      .force('center', d3.forceCenter(width / 2, height / 2))
      // Damping was heavy enough, and the run short enough, that collisions
      // never finished resolving before the simulation froze — nodes were
      // still overlapping when everything stopped. Looser damping over a
      // longer run lets things find their space. It settles once, at load,
      // and then holds still, which is the behaviour that matters.
      .velocityDecay(SIM.velocityDecay)
      .alphaDecay(SIM.alphaDecay);

    // Resize: rescale the SVG canvas only. Never restart the simulation —
    // node positions in graph-space stay fixed; only the viewport changes.
    const handleResize = () => {
      if (redrawAxisRef.current) redrawAxisRef.current();
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      svg.attr('width', width).attr('height', height);
    };
    window.addEventListener('resize', handleResize);

    // The axis layer is a sibling of the zoom container, not a child of it.
    // That is the whole difference between a ruler and a thing drawn on the
    // paper: the corpus pans and zooms underneath, the ruler stays where it is
    // pinned. Inside the zoom container it travelled with the graph and ended
    // up bisecting it.
    const axisLayer = svg.append('g').attr('class', 'time-axis-layer');

    // Render links + nodes.
    const links = g.selectAll('.link')
      .data(data.links)
      .enter().append('line')
      .attr('class', 'link');

    const nodes = g.selectAll('.node')
      .data(data.nodes)
      .enter().append('g')
      .attr('class', 'node')
    const dragHandler = d3.drag()
        // Under a mouse, moving a card and scrolling its text are different
        // gestures — drag versus wheel. Under a thumb they are the same
        // gesture, and drag would win every time, so a card's text could never
        // be scrolled on a phone. A touch that starts inside the scrollable
        // body is left to the browser, which the CSS has already told to pan
        // vertically there; anywhere else on the card still moves it.
        .filter((event) => {
          if (event.ctrlKey) return false;
          if (event.button !== undefined && event.button !== 0) return false;
          if (event.pointerType === 'touch' || event.type === 'touchstart') {
            const t = event.target;
            if (t && t.closest && t.closest('.rp-scroll')) return false;
          }
          return true;
        })
        .on('start', (event, d) => {
          // Without this, a touch-drag on a node is ambiguous between "move
          // this card" and "pan the canvas" — d3.zoom is bound to the same
          // svg and listens for the same touch sequence on any descendant,
          // since touch events bubble the way mouse events used by drag
          // here do not conflict with it. Stopping the underlying touch
          // event here is what lets a card win that race instead of the
          // whole canvas panning under a finger that meant to drag one node.
          if (event.sourceEvent) event.sourceEvent.stopPropagation();

          // Bypass the simulation entirely. We don't restart d3-force —
          // dragging directly updates this node's transform and its
          // incident link endpoints below. Nothing else in the graph
          // moves, period.
          d.fx = d.x; d.fy = d.y;

          // A drag that begins on the resize grip resizes instead of moving.
          // Same gesture, same handler; only the thing it changes differs.
          const target = event.sourceEvent && event.sourceEvent.target;
          d._resizing = Boolean(target && target.closest && target.closest('[data-resize="1"]'));
          if (d._resizing) {
            const start = d._size || cardSizeFor({
              hovered: hoveredIdRef.current === d.id,
              pinned: pinnedIdRef.current === d.id,
            });
            d._resizeFrom = { w: start.width, h: start.height, x: event.x, y: event.y };
          }
        })
        .on('drag', (event, d) => {
          if (d._resizing) {
            // The card is centred on the node, so the grip travels half as far
            // as the edge it is pulling — hence the doubling.
            const f = d._resizeFrom;
            const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
            d._size = {
              width: clamp(f.w + (event.x - f.x) * 2, CARD.minWidth, CARD.maxWidth),
              height: clamp(f.h + (event.y - f.y) * 2, CARD.minHeight, CARD.maxHeight),
            };
            renderArticleBody(d);
            if (viewStateRef.current) {
              viewStateRef.current.setNodeSize(
                persistKey(d), d._size.width, d._size.height, { transient: true },
              );
            }
            return;
          }
          d.x = event.x; d.y = event.y;
          d.fx = event.x; d.fy = event.y;
          if (viewStateRef.current) {
            viewStateRef.current.setNodePosition(persistKey(d), event.x, event.y, { transient: true });
          }
          nodes.filter(nd => nd.id === d.id)
            .attr('transform', 'translate(' + event.x + ',' + event.y + ')');
          if (articleNodes) {
            articleNodes.filter(nd => nd.id === d.id)
              .style('transform', `translate3d(${event.x}px, ${event.y}px, 0px)`);
          }
          if (connectorUpdateRef.current) connectorUpdateRef.current();
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
          const vs = viewStateRef.current;
          if (d._resizing) {
            d._resizing = false;
            // The resize is one history entry, like the drag.
            if (vs) vs.commit();
            return;
          }
          d.fx = d.x; d.fy = d.y;
          // One history entry for the whole drag, not one per frame.
          if (vs) {
            vs.setNodePosition(positionKey(d), d.x, d.y, { transient: true });
            vs.commit();
          }
        });
        
    nodes.call(dragHandler);

    // Tag-node rendering uses a probe to size the bubble.
    const probe = svg.append('text')
      .style('font-family', "'Atkinson', sans-serif")
      .style('visibility', 'hidden');

    // Wrap a tag's bubble round its text with the same real gap on all four
    // sides.
    //
    // getBBox looks like the tool for this and is not: on an SVG <text> it
    // returns the em box, built from the font's ascender and descender
    // metrics, not from the glyphs that were actually drawn. For 22px Atkinson
    // that box is around 31px tall while "psychology" inks about 22, so an
    // identical padding number sat 11px from the glyphs horizontally and about
    // 15px from them vertically. Measured equal, looked unequal, and the eye
    // was right.
    //
    // Canvas measureText reports actualBoundingBox* — the true ink extents —
    // so the bubble is built from those and the tspans are placed on baselines
    // this code controls rather than on a browser-computed central alignment.
    const TAG_FONT_FAMILY = "'Atkinson', sans-serif";
    const TAG_WEIGHT = 500;
    const measureCtx = typeof document !== 'undefined'
      ? document.createElement('canvas').getContext('2d')
      : null;

    function inkOf(text, fontSize) {
      if (!measureCtx) return { width: text.length * fontSize * 0.5, ascent: fontSize * 0.7, descent: fontSize * 0.2 };
      measureCtx.font = TAG_WEIGHT + ' ' + fontSize + 'px ' + TAG_FONT_FAMILY;
      const m = measureCtx.measureText(text);
      return {
        width: m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
        ascent: m.actualBoundingBoxAscent,
        descent: m.actualBoundingBoxDescent,
      };
    }

    const tagBubbles = [];
    function fitBubble(entry) {
      const { d, textEl, rectEl, lines, fontSize, lineH } = entry;
      const inks = lines.map(l => inkOf(l, fontSize));

      // Baselines one line-height apart, then shifted so the ink block is
      // centred on the node rather than the em block.
      const rawBaselines = lines.map((_, i) => i * lineH);
      const top = Math.min(...rawBaselines.map((b, i) => b - inks[i].ascent));
      const bottom = Math.max(...rawBaselines.map((b, i) => b + inks[i].descent));
      const shift = -(top + bottom) / 2;

      const inkTop = top + shift;
      const inkBottom = bottom + shift;
      const inkW = Math.max(...inks.map(i => i.width));

      textEl.selectAll('tspan').each(function (_, i) {
        d3.select(this).attr('y', rawBaselines[i] + shift);
      });

      rectEl
        .attr('x', -inkW / 2 - TAG.padding)
        .attr('y', inkTop - TAG.padding)
        .attr('width', inkW + TAG.padding * 2)
        .attr('height', (inkBottom - inkTop) + TAG.padding * 2);

      d._r = Math.hypot(inkW + TAG.padding * 2, (inkBottom - inkTop) + TAG.padding * 2) / 2;
    }

    nodes.each(function(d) {
      const el = d3.select(this);
      if (d.type !== 'article') {
        // Every non-article node (tag, topology, placeholder) gets the same
        // bubble treatment, distinguished only by color — a tag, a topology
        // handle, and an unwritten piece are all "a labeled handle on the
        // corpus, not an item in it."
        // Tag bubbles are measured from their text, so every constant here is
        // real estate. Three things were wasting it:
        //
        //   The pill shape. rx = height/2 means each rounded cap is as wide as
        //   the bubble is tall, and the text has to clear the curve — so the
        //   apparent padding grew with the font rather than staying put. It
        //   reads as percentage padding even though the padding was constant.
        //   A modest corner radius instead.
        //
        //   Vertical padding sized for a pill, which a two-line bubble does
        //   not need.
        //
        //   A long tag growing sideways forever. It wraps now, and a second
        //   line costs one line-height rather than doubling the width.
        //
        // What comes back from all three goes into the type: 26 to 32, in the
        // same band as the card labels so the two read as one system.
        // A tag is a handle on the corpus, not an item in it. At 32 units it
        // was rendering wider than the article cards it points at, which
        // inverts the hierarchy — the label for a pile of writing should not
        // outweigh the writing. 22 is still half again the 14 it started at,
        // and the width cap keeps a tag narrower than a card no matter how
        // long its text, by wrapping instead of growing.
        const fontSize = TAG.fontSize;
        // One padding value for all four sides. Keeping separate padX/padY
        // could not make the margins match, because the vertical one was
        // measured against the line box and the horizontal one against the
        // glyphs — line-height already carries leading above and below the
        // text, so an identical number produced visibly different gaps. The
        // bubble is measured from the rendered ink instead, below.
        const PAD = TAG.padding;
        const MAX_BUBBLE_W = TAG.maxWidth;
        const MAX_LINES = TAG.maxLines;

        probe.style('font-size', fontSize + 'px').style('font-weight', '500');
        const widthOf = (t) => { probe.text(t); return probe.node().getComputedTextLength(); };

        // Break on hyphens as well as spaces. Half this corpus's tags are
        // 'surveillance-capitalism' shaped, and a space-only rule left exactly
        // those growing sideways forever.
        const pieces = d.label.split(/(?<=-)|\s+/).filter(Boolean);
        const join = (arr) => arr.join('').replace(/\s+$/, '').trim();

        let lines = [d.label];
        if (widthOf(d.label) + PAD * 2 > MAX_BUBBLE_W && pieces.length > 1) {
          // Greedy fill, then rebalance the common two-line case so a wrapped
          // tag reads as a block rather than as an overflow.
          lines = [];
          let current = [];
          for (const piece of pieces) {
            const next = [...current, piece];
            if (current.length && widthOf(join(next)) + PAD * 2 > MAX_BUBBLE_W) {
              lines.push(join(current));
              current = [piece];
            } else {
              current = next;
            }
          }
          if (current.length) lines.push(join(current));

          if (lines.length === 2) {
            let bestSplit = 1;
            let bestCost = Infinity;
            for (let i = 1; i < pieces.length; i++) {
              const cost = Math.max(
                widthOf(join(pieces.slice(0, i))),
                widthOf(join(pieces.slice(i))),
              );
              if (cost < bestCost) { bestCost = cost; bestSplit = i; }
            }
            lines = [join(pieces.slice(0, bestSplit)), join(pieces.slice(bestSplit))];
          }
          // A tag long enough to need a fourth line is pathological; fold the
          // remainder onto the last allowed one and let it run a little wide
          // rather than growing the bubble downward without limit.
          if (lines.length > MAX_LINES) {
            const head = lines.slice(0, MAX_LINES - 1);
            lines = head.concat([lines.slice(MAX_LINES - 1).join(' ')]);
          }
        }

        // Tighter leading once it wraps: a second line should cost a line, not
        // double the bubble.
        const effLineH = lines.length > 1 ? fontSize * 1.0 : fontSize * 1.1;

        // Text first, then measure what was actually drawn, then wrap the
        // bubble round it. getBBox reports the ink, so PAD is the same real
        // distance on every side regardless of whether the text has capitals,
        // descenders, or one line or three.
        const textEl = el.append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', '#1a1a2e')
          .style('font-family', TAG_FONT_FAMILY)
          .style('font-size', fontSize + 'px')
          .style('font-weight', String(TAG_WEIGHT))
          .style('pointer-events', 'none');
        // Baselines are set by fitBubble; no dominant-baseline, because the
        // whole point is that this code knows where the baseline is.
        lines.forEach((line) => {
          textEl.append('tspan').attr('x', 0).text(line);
        });

        // Behind the text, not over it. Geometry is applied by fitBubble so the
        // same code can run again once the webfont has loaded.
        const rectEl = el.insert('rect', 'text')
          .attr('rx', TAG.cornerRadius).attr('ry', TAG.cornerRadius)
          // A CSS var reference, not the baked d.color value, so changing a
          // color in Settings repaints every bubble instantly — no rebuild.
          .attr('fill', 'var(--gv-' + (d.type === 'tag' ? 'tag-color' : d.type === 'topology' ? 'topology-color' : 'placeholder-color') + ')')
          .attr('opacity', TAG.opacity);
        const entry = { d, textEl, rectEl, lines, fontSize, lineH: effLineH };
        tagBubbles.push(entry);
        fitBubble(entry);

      } else {
        // SVG representation for articles is empty or just a group.
        // We track the geometry here. The actual HTML cards live in cardsTransform.
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

    probe.remove();

    // Text metrics change when the webfont finishes loading, and the bubbles
    // were sized against the fallback face — which is why the horizontal and
    // vertical margins came out one or two pixels apart despite being the same
    // number. Re-fit once the real font is in.
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        tagBubbles.forEach(fitBubble);
      }).catch(() => {});
    }

    // One React root per article node, mounted in the HTML cardsTransform layer.
    // Keyed by node id. Roots are unmounted on cleanup so we
    // don't leak across feedData changes. The React tree inside each root
    // is pure — TextView is presentational; D3 still owns all events on
    // the parent HTML wrapper.
    const reactRoots = new Map();
    
    // Explicitly scope the articleNodes selection so it can be updated
    let articleNodes = cardsTransform.selectAll('.node-card')
      .data(data.nodes.filter(d => d.type === 'article'));
      
    const articleNodesEnter = articleNodes.enter().append('div')
      .attr('class', 'node-card')
      .style('position', 'absolute')
      .style('left', '0')
      .style('top', '0')
      .style('will-change', 'transform')
      .style('pointer-events', 'auto')
      .call(dragHandler);
      
    articleNodes = articleNodes.merge(articleNodesEnter);

    articleNodesEnter.each(function(d) {
      const root = createRoot(this);
      reactRoots.set(d.id, { root, wrapper: this, cardSelection: d3.select(this) });
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
      // A size the reader set outright replaces the state-based default. They
      // asked for that size; growing it further on hover would be the graph
      // arguing with them.
      const { width: w, height: h } = d._size || cardSizeFor({ hovered, pinned });

      // Instead of sizing a foreignObject and adding glow padding, we size the wrapper
      // exactly and shift its transform origin to its own center.
      entry.wrapper.style.width = w + 'px';
      entry.wrapper.style.height = h + 'px';
      entry.wrapper.style.marginLeft = (-w / 2) + 'px';
      entry.wrapper.style.marginTop = (-h / 2) + 'px';

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
    // SVG zoom handler.
    articleNodes.on('wheel', (e) => e.stopPropagation());

    function renderAllArticleBodies() {
      data.nodes.forEach(d => { if (d.type === 'article') renderArticleBody(d); });
    }

    // Slug-label overlay: shown only at slug-LOD. Font-size is chosen so the
    // LONGEST slug exactly fits the viewport width — all slugs share that
    // size for consistency. As large as it can get without overflowing.
    // Hidden when the node is hovered or pinned.
    // Article-content fetch cache. Keyed by node id. Value is the body HTML
    // (with <h1> removed) or null on fetch failure.
    const articleContentCache = new Map();
    function loadFullContent(d) {
      if (articleContentCache.has(d.id)) {
        d._fullContent = articleContentCache.get(d.id);
        return Promise.resolve();
      }

      // Only same-origin bodies can be fetched. A subscribed feed's article
      // lives on somebody else's server, which sends no CORS header and has no
      // reason to — so pinning one used to fire a request that could only ever
      // fail, and fail loudly in the console, a hundred times over. The summary
      // the feed already gave us is what there is; reading the rest is what the
      // link is for.
      let sameOrigin = false;
      try {
        sameOrigin = new URL(d.url, window.location.href).origin === window.location.origin;
      } catch (_) { sameOrigin = false; }
      if (!sameOrigin) {
        articleContentCache.set(d.id, null);
        d._fullContent = null;
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
    applyVisibility(svg, hiddenSourcesRef.current);

    // Hover / click handlers. mouseover/mouseout (not mouseenter/leave)
    // because the foreignObject's inner HTML gets replaced on re-render
    // and mouseenter sometimes fails to re-fire on the new content.
    // We guard with relatedTarget so child-to-child cursor moves inside
    // the same node don't toggle the state.
    articleNodes
      .on('mouseover', (event, d) => {
        if (hoveredIdRef.current === d.id) return;
        hoveredIdRef.current = d.id;
        renderArticleBody(d);
      })
      .on('mouseout', (event, d) => {
        const related = event.relatedTarget;
        if (related && event.currentTarget.contains(related)) return;
        if (hoveredIdRef.current === d.id) {
          hoveredIdRef.current = null;
          renderArticleBody(d);
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
          }
          return;
        }
        // Toggle pin on this node.
        event.stopPropagation();
        const prevPinned = pinnedIdRef.current;
        if (prevPinned === d.id) {
          pinnedIdRef.current = null;
          renderArticleBody(d);
        } else {
          pinnedIdRef.current = d.id;
          renderArticleBody(d);
          nodes.filter(nd => nd.id === d.id).raise();
          articleNodes.filter(nd => nd.id === d.id).raise();
          if (prevPinned) {
            const prev = data.nodes.find(nd => nd.id === prevPinned);
            if (prev) renderArticleBody(prev);
          }
          // Fetch full article body so the pinned node becomes a mini-reader.
          // Re-render when content arrives, but only if this node is still
          // the pinned one (user might have unpinned in the meantime).
          loadFullContent(d).then(() => {
            if (pinnedIdRef.current === d.id) renderArticleBody(d);
          });
        }
      });

    // Bubble click (tag, topology, or placeholder): highlight only — no
    // rearrangement, no simulation restart.
    let activeTag = null;
    nodes.filter(d => d.type !== 'article')
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
      if (articleNodes) {
        articleNodes.style('transform', d => `translate3d(${d.x}px, ${d.y}px, 0px)`);
      }
    }
    let hasFitted = false;
    graphRef.current = { data, nodes, articleNodes, links, applyPositions, svg, zoom, fitToViewport, simulation, axisLayer, g };

    // The axis is measured against the corpus extent, which keeps changing
    // while the simulation runs — so drawing it once at the start pins it to
    // whatever the first frame happened to look like. Redrawn on a throttle
    // during the settle and once more at the end.
    let tickCount = 0;
    simulation.nodes(data.nodes).on('tick', () => {
      applyPositions();
      if (!hasFitted) hasFitted = fitToViewport({ initialZoomOut: true });
      if (connectorUpdateRef.current) connectorUpdateRef.current();
      ++tickCount;
      if (redrawAxisRef.current && tickCount % 25 === 0) redrawAxisRef.current();
    });
    simulation.force('link').links(data.links);

    // Paint once now, from whatever positions were restored or seeded, so the
    // first frame is correct with or without the simulation ever running.
    if (!hasFitted) hasFitted = fitToViewport({ initialZoomOut: true });
    applyPositions();

    // When the simulation ends, freeze every node by copying x/y to fx/fy.
    // Any later interaction (drag, etc.) keeps positions stable.
    // Frame the whole graph once it has settled, but only when the reader has
    // not arranged it themselves. Giving every node its true footprint spreads
    // looking for is not an improvement on one that overlaps.
    function fitToViewport({ animate = false, initialZoomOut = false } = {}) {
      const pts = data.nodes.filter(d => d.type === 'article');
      if (pts.length < 2) return false;
      const pad = 140;

      // The full min/max extent is not where the graph actually lives —
      // this corpus has plenty of orphan nodes (no edges) that charge
      // repulsion legitimately flings far from the mass. The middle 80% of
      // each axis is a much better proxy for "the graph," consistent with
      // layoutIsDegenerate's own trimmed measure — but the *midpoint* of
      // that trimmed range is still not reliably where the dense majority
      // sits, if the range itself is skewed: a tight cluster of articles
      // plus a sparser trail extending toward one edge (which tags, pulled
      // toward many different articles at once, naturally spread wider
      // than) puts the range's midpoint somewhere between the cluster and
      // the trail — landing right at the cluster's corner rather than
      // inside it. Confirmed on an actual phone: tags nicely spread across
      // the screen, but the articles themselves only a fragment of one
      // visible at the very edge. The median is robust to exactly this kind
      // of skew, so it drives the *center*; the trimmed range still drives
      // how much *area* to show.
      const median = (values) => {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      };
      const trimmedRange = (values) => {
        const sorted = [...values].sort((a, b) => a - b);
        return [sorted[Math.floor(sorted.length * 0.1)], sorted[Math.ceil(sorted.length * 0.9) - 1]];
      };
      const xsAll = pts.map(d => d.x);
      const ysAll = pts.map(d => d.y);
      const [trimMinX, trimMaxX] = trimmedRange(xsAll);
      const [trimMinY, trimMaxY] = trimmedRange(ysAll);
      const minX = trimMinX - pad;
      const maxX = trimMaxX + pad;
      const minY = trimMinY - pad;
      const maxY = trimMaxY + pad;
      const centerX = median(xsAll);
      const centerY = median(ysAll);

      let w = containerRef.current ? containerRef.current.clientWidth : window.innerWidth;
      let h = containerRef.current ? containerRef.current.clientHeight : window.innerHeight;
      if (w < 50) w = window.innerWidth;
      if (h < 50) h = window.innerHeight;
      // A container with no size yet — hidden tab, collapsed pane, a layout
      // that has not run — would give a scale of zero and collapse the whole
      // graph to a point. Leave the view alone and fit when there is a
      // viewport to fit to.
      if (w < 50 || h < 50) return false;
      // Even the trimmed core can still be large relative to a phone-width
      // viewport (confirmed: a 375px-wide container against a >10,000px
      // full extent computed k≈0.03 before this fix existed at all). This
      // floor keeps the initial overview at a size where card shapes and
      // colors are still legible at a glance; the reader pinch/scroll-zooms
      // in from there for detail, the same way they always could. Far-flung
      // orphans sit outside the initial frame rather than every node being
      // crammed on screen at once — a readable core beats a technically-
      // complete but illegible one.
      const MIN_SCALE = 0.2;
      let k = Math.max(
        Math.min(w / Math.max(maxX - minX, 1), h / Math.max(maxY - minY, 1), 1),
        MIN_SCALE,
      );
      if (initialZoomOut) {
        if (positionsWereDegenerate) {
          // Force the maximum zoomed-out state so the user can watch the physics explode
          k = MIN_SCALE * 0.85;
        } else {
          k *= 0.85;
        }
      }
      const tx = w / 2 - centerX * k;
      const ty = h / 2 - centerY * k;
      const transform = d3.zoomIdentity.translate(tx, ty).scale(k);
      if (animate) {
        svg.transition().duration(750).call(zoom.transform, transform);
      } else {
        svg.call(zoom.transform, transform);
      }
      return true;
    }

    let hasSettled = false;
    simulation.on('end', () => {
      hasSettled = true;
      // This simulation runs for the whole mount's lifetime regardless of
      // which layout is on screen — switching to ring or timeline just pins
      // every node's fx/fy to that layout's coordinates while this keeps
      // ticking underneath. If alpha happens to cross the end threshold
      // while a different layout is showing, d.x/d.y are that layout's
      // coordinates, not a converged cluster — treating them as one here
      // would bake, e.g., timeline's shape into cluster permanently. Only
      // capture the arrangement when cluster is actually what's displayed.
      if (layoutRef.current !== 'force') return;
      data.nodes.forEach(d => { d.fx = d.x; d.fy = d.y; d._forcePos = { x: d.x, y: d.y }; });

      // The layout the simulation settled on is itself an arrangement worth
      // remembering. It becomes the saved layout so a returning reader sees
      // what they left, rather than watching physics happen again. But we
      // only want to save a *good* layout. A simulation starting from an
      // already-saved arrangement barely ticks, and if that arrangement was
      // degenerate (shoved offscreen, over-compressed), saving it here
      // would just lock it in. The reader would never see the fresh fallback
      // layout it would then have to reject.
      if (layoutIsDegenerate(data.nodes, cardSizeFor({ hovered: false, pinned: false }))) return;

      const vs = viewStateRef.current;
      if (vs) {
        // We only want to save positions that were derived from the *current*
        // layout pass, not positions loaded from a prior one. The data-prep
        // phase tags freshly computed force coordinates with `_forcePos` so
        // we can distinguish them here. We explicitly *delete* that flag when
        // a user unpins everything, because the simulation resumes and computes
        // a fresh layout that is now worth saving.
        let savedAny = false;
        for (const d of data.nodes) {
          if (!d.pinned && d._forcePos) {
            vs.setNodePosition('force::' + persistKey(d), d.x, d.y, { silent: true });
            savedAny = true;
          }
        }
        if (savedAny) vs.notify(); // Commit the batch.
      }

      // Redraw the axis once more now that nodes have come to rest.
      if (redrawAxisRef.current) redrawAxisRef.current();
    });

    // d3-timer runs on requestAnimationFrame, and a hidden tab gets no frames.
    // A page opened in the background therefore never lays out: the reader
    // switches to it later and finds the graph unsettled, or off screen
    // entirely. Nothing is wrong with it — it simply never got to run. So run
    // it when the page is first actually looked at.
    const handleVisibility = () => {
      if (document.hidden) return;
      if (!hasSettled) { simulation.alpha(0.8).restart(); return; }
      // Settled while there was nothing to settle into. Frame it now that
      // there is.
      if (!hasFitted) hasFitted = fitToViewport({ initialZoomOut: true });
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // ── External reset actions ──────────────────────────────────────────────
    // LayoutControls dispatches these from outside the component. They reach
    // into the closure that owns the simulation, the zoom, and the data.

    const handleZoomToFit = () => { fitToViewport({ animate: true }); };

    const handleUnpinAll = () => {
      data.nodes.forEach(d => {
        d.fx = null;
        d.fy = null;
        delete d._forcePos;
      });
      // Wipe per-layout saved positions so they don't re-pin on next load.
      const vs = viewStateRef.current;
      if (vs) {
        for (const d of data.nodes) {
          const key = positionKey(d);
          if (vs.nodeState(key)) vs.setNodePosition(key, d.x, d.y, { silent: true });
        }
      }
      simulation.alpha(0.8).restart();
    };

    const handleResetSizes = () => {
      const rest = cardSizeFor({ hovered: false, pinned: false });
      data.nodes.forEach(d => { delete d._size; });
      const vs = viewStateRef.current;
      if (vs) {
        for (const d of data.nodes) {
          vs.setNodeSize(persistKey(d), rest.width, rest.height, { silent: true });
        }
      }
      // Repaint every card at the default size.
      applyPositions();
    };

    const handleResetLayout = () => {
      const vs = viewStateRef.current;
      if (vs && vs.resetLayout) vs.resetLayout();
      data.nodes.forEach(d => {
        d.fx = null;
        d.fy = null;
        delete d._forcePos;
      });
      simulation.alpha(0.8).restart();
      fitToViewport({ animate: true });
    };

    window.addEventListener('graph:zoom-to-fit', handleZoomToFit);
    window.addEventListener('graph:unpin-all', handleUnpinAll);
    window.addEventListener('graph:reset-sizes', handleResetSizes);
    window.addEventListener('graph:reset-layout', handleResetLayout);

    return () => {
      simulation.stop();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('graph:zoom-to-fit', handleZoomToFit);
      window.removeEventListener('graph:unpin-all', handleUnpinAll);
      window.removeEventListener('graph:reset-sizes', handleResetSizes);
      window.removeEventListener('graph:reset-layout', handleResetLayout);
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

  // The time axis. Drawn rather than laid out: it spends no position, so it
  // composes with whatever arrangement is on screen and you can read topic and
  // chronology at once. Redraws on its own state and on layout changes, since
  // the pieces it connects to have moved.
  useEffect(() => {
    const g = graphRef.current;
    if (!g || !g.axisLayer) return;
    const axis = timeAxis || {};

    // Re-entrant: the corpus extent the default placement is measured from
    // only exists once the simulation has settled, and the effect's own
    // dependencies cannot see that happen.
    const draw = () => drawAxis(g, axis);
    redrawAxisRef.current = axis.on ? draw : null;
    draw();
  }, [timeAxis, layout, feedData]);

  function drawAxis(g, axis) {
    g.axisLayer.selectAll('*').remove();
    connectorUpdateRef.current = null;
    if (!axis.on) { axisFittedRef.current = false; return; }

    const el = containerRef.current;
    const W = el ? el.clientWidth : window.innerWidth;
    const H = el ? el.clientHeight : window.innerHeight;
    if (W < 60 || H < 60) return;

    const dock = axis.dock || AX.dock;
    const vertical = dock === 'left' || dock === 'right';
    const pad = AX.endPadding;

    // Where the rail sits, in screen pixels. Dragging it moves it along the
    // edge it is docked to; nothing else about it changes.
    const offset = Number.isFinite(axis.offset) ? axis.offset : AX.inset;
    const railPos = (dock === 'right') ? W - offset
      : (dock === 'bottom') ? H - offset
      : offset;

    const length = Math.max((vertical ? H : W) - pad * 2, 120);
    const origin = vertical ? { x: railPos, y: pad } : { x: pad, y: railPos };

    // A side rail runs earliest at the top; a top or bottom rail earliest at
    // the left. Both are the western reading order for the direction they run.
    const geo = timeAxisGeometry(g.data.nodes, {
      orientation: vertical ? 'ttb' : 'ltr',
      origin,
      length,
    });
    if (!geo) return;

    const root = g.axisLayer.append('g').attr('class', 'time-axis');

    // Connectors first, so the rail sits on top of them.
    const conn = root.append('g').attr('class', 'time-connectors');
    const connected = [];
    g.data.nodes.forEach((d) => {
      const a2 = geo.anchors[d.id];
      if (!a2) return;
      const line = conn.append('line')
        .attr('class', 'time-connector')
        .attr('data-node', d.id)
        .attr('x1', a2.x).attr('y1', a2.y)
        .attr('stroke', (d._source && d._source.color) || '#7f8ea3')
        .attr('stroke-width', AX.connectorWidth)
        .attr('stroke-opacity', AX.connectorOpacity);
      connected.push({ node: d, anchor: a2, line });
    });

    // The rail is in screen space and the nodes are in graph space, so the
    // far end of every connector has to be projected through the current zoom
    // — and re-projected whenever it changes. This is the cost of the rail
    // staying still, and it is only an attribute write per connector.
    function updateConnectors() {
      const t = d3.zoomTransform(g.svg.node());
      connected.forEach(({ node, anchor, line }) => {
        const p = t.apply([node.x, node.y]);
        line.attr('x1', anchor.x).attr('y1', anchor.y).attr('x2', p[0]).attr('y2', p[1]);
      });
    }
    connectorUpdateRef.current = updateConnectors;
    updateConnectors();

    const rail = root.append('g').attr('class', 'time-spine').style('cursor', vertical ? 'ew-resize' : 'ns-resize');

    // A backing strip, so the rail reads as a fixed edge of the window rather
    // than a line that happens to be lying on top of the graph.
    const strip = 34;
    rail.append('rect')
      .attr('x', vertical ? railPos - strip / 2 : 0)
      .attr('y', vertical ? 0 : railPos - strip / 2)
      .attr('width', vertical ? strip : W)
      .attr('height', vertical ? H : strip)
      .attr('fill', 'rgba(18,20,28,0.82)');

    rail.append('line')
      .attr('x1', geo.from.x).attr('y1', geo.from.y)
      .attr('x2', geo.to.x).attr('y2', geo.to.y)
      .attr('stroke', 'rgba(255,255,255,' + AX.spineOpacity + ')')
      .attr('stroke-width', AX.spineWidth);

    const TICK_FONT = AX.tickFontSize;
    const labelRoom = geo.ticks.length > 1
      ? Math.hypot(geo.ticks[1].x - geo.ticks[0].x, geo.ticks[1].y - geo.ticks[0].y)
      : Infinity;
    const needed = vertical ? TICK_FONT * 1.7 : TICK_FONT * 4.2;
    const labelEvery = Math.max(1, Math.ceil(needed / Math.max(labelRoom, 1)));

    geo.ticks.forEach((t, ti) => {
      rail.append('line')
        .attr('x1', t.x).attr('y1', t.y)
        .attr('x2', t.x + (vertical ? 9 : 0)).attr('y2', t.y + (vertical ? 0 : -9))
        .attr('stroke', 'rgba(255,255,255,0.45)').attr('stroke-width', 1.5);
      if (ti % labelEvery !== 0) return;
      rail.append('text')
        .attr('x', t.x + (vertical ? 13 : 0))
        .attr('y', t.y + (vertical ? 0 : -14))
        .attr('text-anchor', vertical ? 'start' : 'middle')
        .attr('dominant-baseline', vertical ? 'central' : 'auto')
        .style('font-family', "'Atkinson', sans-serif")
        .style('font-size', TICK_FONT + 'px')
        .style('fill', 'rgba(255,255,255,0.62)')
        .style('pointer-events', 'none')
        .text(t.label);
    });

    // Drag slides the rail along its edge. The offset is applied to the DOM
    // during the gesture and written to state once on release — writing every
    // frame re-ran this effect, which destroyed the element under the pointer
    // mid-drag.
    let from = null;
    let delta = 0;
    rail.call(d3.drag()
      .on('start', (event) => { from = vertical ? event.x : event.y; delta = 0; })
      .on('drag', (event) => {
        if (from === null) return;
        delta = (vertical ? event.x : event.y) - from;
        rail.attr('transform', vertical ? 'translate(' + delta + ',0)' : 'translate(0,' + delta + ')');
        conn.selectAll('line').attr(vertical ? 'x1' : 'y1', function () {
          return Number(d3.select(this).attr(vertical ? 'x1' : 'y1'));
        });
        connected.forEach(({ anchor, line }) => {
          if (vertical) line.attr('x1', anchor.x + delta);
          else line.attr('y1', anchor.y + delta);
        });
      })
      .on('end', () => {
        if (from !== null && delta && viewStateRef.current) {
          const moved = (dock === 'right' || dock === 'bottom') ? offset - delta : offset + delta;
          viewStateRef.current.setTimeAxis({ offset: Math.max(20, moved), moved: true });
        }
        from = null;
      }));
  }

  // Switching layout moves nodes; it does not rebuild the graph. Everything
  // already on screen stays mounted, so a reader who has a card open keeps it.
  //
  // Movement here is deliberate and meaningful — the whole corpus reorganising
  // is the one moment where motion is the message — so it is animated rather
  // than cut, which is also the only way to keep track of where a given piece
  // went.
  useEffect(() => {
    layoutRef.current = layout;
    const g = graphRef.current;
    if (!g) return;

    const vs = viewStateRef.current;
    const rest = cardSizeFor({ hovered: false, pinned: false });

    // Prefer what the reader arranged in this layout; fall back to computing it.
    // Cluster is not a set of coordinates, it is the simulation. Asking for it
    // used to fall back to "wherever the nodes are right now" whenever the
    // simulation had not settled — so choosing cluster after ring left
    // everything in the ring, which looked like the button doing nothing.
    // If there is no cluster arrangement to return to, run one.
    if (layout === 'force') {
      const placed = g.data.nodes.filter((d) => {
        const saved = vs && vs.nodeState('force::' + persistKey(d));
        return (saved && !saved.auto) || d._forcePos;
      });
      if (placed.length < g.data.nodes.length * 0.5) {
        g.data.nodes.forEach((d) => {
          const saved = vs && vs.nodeState('force::' + persistKey(d));
          if (saved && !saved.auto) { d.fx = saved.x; d.fy = saved.y; }
          else { d.fx = null; d.fy = null; }
        });
        g.simulation.alpha(1).restart();
        return;
      }
    }

    const computed = layout === 'force'
      ? Object.fromEntries(g.data.nodes.map(d => [
          d.id,
          d._forcePos || (vs && vs.nodeState('force::' + persistKey(d))) || { x: d.x, y: d.y },
        ]))
      : computeLayout(layout, g.data.nodes, { cardW: rest.width, cardH: rest.height });
    if (!computed) return;

    g.data.nodes.forEach((d) => {
      const saved = vs && vs.nodeState(layout + '::' + persistKey(d));
      const target = (saved && typeof saved.x === 'number' && !saved.auto)
        ? { x: saved.x, y: saved.y }
        : computed[d.id];
      if (!target) return;
      d.x = target.x; d.y = target.y;
      d.fx = target.x; d.fy = target.y;
      if (vs && !(saved && !saved.auto)) {
        vs.setNodePosition(layout + '::' + persistKey(d), target.x, target.y, { silent: true });
      }
    });

    g.nodes.transition().duration(760).ease(d3.easeCubicInOut)
      .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
    if (g.articleNodes) {
      g.articleNodes.transition().duration(760).ease(d3.easeCubicInOut)
        .style('transform', d => `translate3d(${d.x}px, ${d.y}px, 0px)`);
    }
    g.links.transition().duration(760).ease(d3.easeCubicInOut)
      .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);

    const t = setTimeout(() => {
      if (redrawAxisRef.current) redrawAxisRef.current();
      if (g.fitToViewport) g.fitToViewport();
    }, 800);
    return () => clearTimeout(t);
  }, [layout]);

  return (
    <div
      ref={containerRef}
      className={styles.graphContainer}
    />
  );
}
