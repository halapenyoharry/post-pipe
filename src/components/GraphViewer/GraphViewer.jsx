import React, { useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import * as d3 from 'd3';
import styles from './GraphViewer.module.css';
import { lensFor } from '../NodeView';
import { computeLayout, layoutIsDegenerate, timeAxisGeometry, dimensionAxisGeometry } from './layouts';

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

    let containerColor = null;
    const containersList = feed.containers || config.containment || [];
    for (const c of containersList) {
      if (c.parent && c.tag && (item.tags || []).includes(c.tag)) {
        containerColor = c.badgeColor || c.color || c.stroke;
        break;
      }
    }

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
      series_part: item.series_part ?? null,
      timeline: item.timeline || null,
      commit_times: item.commit_times || [],
      license: item.license || '',
      canonical_url: item.canonical_url || item.url,
      syndication: item.syndication || {},
      size: 60,
      containerColor,
      color: containerColor || (status === 'published' ? publishedColor : draftColor),
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

  const containmentEdges = [];

  for (const edge of (feed.edges || [])) {
    if (edge.layer === 'containment' || edge.role === 'contains') {
      containmentEdges.push({
        source: edge.source,
        target: resolveEndpoint(edge.target),
        attrs: edge.attrs || {},
      });
      continue;
    }

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

  let containers = feed.containers || config.containment || [];
  if (containers.length === 0 && containmentEdges.length > 0) {
    const inferred = new Map();
    for (const edge of containmentEdges) {
      if (!articleSlugs.has(edge.source) && !inferred.has(edge.source)) {
        const rawLabel = edge.attrs?.label || edge.source.replace(/^container:/, '').replace(/^tag:/, '').replace(/-/g, ' ');
        inferred.set(edge.source, {
          id: edge.source,
          label: rawLabel.toUpperCase(),
          parent: edge.attrs?.parent || null,
        });
      }
    }
    containers = Array.from(inferred.values());
  }

  return { nodes, links, containmentEdges, containers };
}

// Walk article nodes + links and toggle their display based on whether
// the item's source is currently in the hidden set. Pure DOM mutation,
// no simulation involvement — node positions stay locked.
function applyVisibility(svg, cardsLayer, hiddenSet) {
  const isHiddenArticle = (d) =>
    d && d.type === 'article' && d._source && hiddenSet.has(d._source.id);

  svg.selectAll('.node')
    .style('display', (d) => isHiddenArticle(d) ? 'none' : null);

  cardsLayer.selectAll('.node-card')
    .style('display', (d) => isHiddenArticle(d) ? 'none' : null);

  svg.selectAll('.link')
    .style('display', (l) => {
      const sNode = typeof l.source === 'object' ? l.source : null;
      const tNode = typeof l.target === 'object' ? l.target : null;
      if (isHiddenArticle(sNode) || isHiddenArticle(tNode)) return 'none';
      return null;
    });
}

// Walk article nodes + links and dim non-matching nodes when a time filter is active.
function applyTimeFilter(svg, cardsLayer, filteredSet) {
  if (!filteredSet) {
    cardsLayer.selectAll('.node-card').classed('dimmed', false);
    svg.selectAll('.node').classed('dimmed', false);
    svg.selectAll('.link').classed('dimmed', false);
    return;
  }

  cardsLayer.selectAll('.node-card')
    .classed('dimmed', d => !filteredSet.has(d.id));

  svg.selectAll('.node')
    .classed('dimmed', d => {
      if (d.type === 'article') return !filteredSet.has(d.id);
      return false;
    });

  svg.selectAll('.link')
    .classed('dimmed', l => {
      const sid = typeof l.source === 'object' ? l.source.id : l.source;
      const tid = typeof l.target === 'object' ? l.target.id : l.target;
      return !filteredSet.has(sid) && !filteredSet.has(tid);
    });
}

// Zoom-aware level of detail.
const LOD_MARKER = 0.35;
const LOD_TITLE = 0.6;
function getLOD(scale) {
  if (scale < LOD_MARKER) return 'marker';
  if (scale < LOD_TITLE) return 'title';
  return 'full';
}

// Bounds for a hand-resized card. Below the minimum the label stops fitting;
// above the maximum one node eats the graph.
function makeCardSizeFor(CARD) {
  return function cardSizeFor({ hovered, pinned, lod }) {
    if (pinned) return { width: CARD.pinnedWidth, height: CARD.pinnedHeight };
    if (hovered) return { width: CARD.hoverWidth, height: CARD.hoverHeight };
    if (lod === 'marker') return { width: 16, height: 16 };
    return { width: CARD.width, height: CARD.height };
  };
}

export function GraphViewer({
  feedData, onNodeSelect, hiddenSources, filteredArticleIds, viewState, layout = 'force', timeAxis, graphSettings,
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
  const cardsLayerRef = useRef(null);

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
  const pinnedIdsRef = useRef(new Set());
  const hoveredIdRef = useRef(null);
  const zoomScaleRef = useRef(1);
  const currentLodRef = useRef('full');
  const hiddenSourcesRef = useRef(new Set());

  // Apply visibility from outside the main simulation effect.
  useEffect(() => {
    hiddenSourcesRef.current = hiddenSources instanceof Set
      ? hiddenSources
      : new Set(hiddenSources || []);
    if (!svgRef.current || !cardsLayerRef.current) return;
    applyVisibility(svgRef.current, d3.select(cardsLayerRef.current), hiddenSourcesRef.current);
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

  // Apply time filter dimming
  useEffect(() => {
    if (!svgRef.current || !cardsLayerRef.current) return;
    applyTimeFilter(svgRef.current, d3.select(cardsLayerRef.current), filteredArticleIds);
  }, [filteredArticleIds]);

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
      .attr('height', height)
      .style('position', 'absolute')
      .style('inset', '0')
      .style('pointer-events', 'all');

    svgRef.current = svg;

    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'sequence-arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 8)
      .attr('refY', 5)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 1.5 L 8 5 L 0 8.5 z')
      .attr('fill', 'var(--gv-accent, #d4af37)');
    
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

    cardsLayerRef.current = cardsLayer.node();

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
    }
    // Nodes the reader left open stay open across visits.
    pinnedIdsRef.current = new Set();
    if (viewStateRef.current) {
      for (const d of data.nodes) {
        const saved = viewStateRef.current.nodeState(persistKey(d));
        if (d.type === 'article' && saved && saved.pinned) pinnedIdsRef.current.add(d.id);
      }
    }
    if (viewStateRef.current && positionsWereDegenerate) {
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

    // Hierarchical containment layer (rendered underneath links and cards).
    const containersLayer = g.append('g').attr('class', 'containers-layer');

    const containerChildren = new Map();
    const containerMembers = new Map();

    for (const c of (data.containers || [])) {
      containerChildren.set(c.id, new Set());
      containerMembers.set(c.id, new Set());
    }

    for (const edge of (data.containmentEdges || [])) {
      if (containerChildren.has(edge.source) && containerChildren.has(edge.target)) {
        containerChildren.get(edge.source).add(edge.target);
      } else if (containerMembers.has(edge.source)) {
        containerMembers.get(edge.source).add(edge.target);
      }
    }

    function getAllMemberSlugs(cId, visited = new Set()) {
      if (visited.has(cId)) return [];
      visited.add(cId);
      const direct = Array.from(containerMembers.get(cId) || []);
      const children = Array.from(containerChildren.get(cId) || []);
      const fromChildren = children.flatMap((chId) => getAllMemberSlugs(chId, visited));
      return Array.from(new Set([...direct, ...fromChildren]));
    }

    // Sort so parent containers render first (bottom-most in SVG z-index)
    const sortedContainers = [...(data.containers || [])].sort((a, b) => {
      if (b.parent === a.id) return -1;
      if (a.parent === b.id) return 1;
      return 0;
    });

    const containerGroups = containersLayer.selectAll('.container-group')
      .data(sortedContainers, (d) => d.id)
      .enter().append('g')
      .attr('class', 'container-group')
      .attr('data-container-id', (d) => d.id);

    containerGroups.append('path')
      .attr('class', 'container-hull')
      .attr('fill', (d) => d.fill || 'rgba(212, 175, 55, 0.03)')
      .attr('stroke', (d) => d.stroke || 'rgba(212, 175, 55, 0.45)')
      .attr('stroke-width', (d) => d.strokeWidth || 1.5)
      .attr('stroke-dasharray', (d) => d.strokeDasharray || (d.parent ? null : '6 6'));

    const closedContainers = new Set();
    const containerCentroids = new Map();

    const containerBadges = containerGroups.append('g')
      .attr('class', 'container-badge')
      .style('cursor', 'pointer');

    containerBadges.append('rect')
      .attr('class', 'container-badge-bg')
      .attr('fill', (d) => d.badgeBg || 'rgba(15, 15, 18, 0.85)')
      .attr('stroke', (d) => d.stroke || 'rgba(212, 175, 55, 0.4)')
      .attr('stroke-width', 1)
      .attr('rx', 6)
      .attr('ry', 6);

    containerBadges.append('text')
      .attr('class', 'container-badge-text')
      .attr('fill', (d) => d.badgeColor || '#d4af37')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('user-select', 'none')
      .text((d) => d.label || d.id);

    // Collapsed container macro node (when container is closed, represented like a single node)
    const containerMacroNodes = containerGroups.append('g')
      .attr('class', 'container-macro-node')
      .style('cursor', 'pointer')
      .style('display', 'none');

    containerMacroNodes.append('rect')
      .attr('class', 'container-macro-bg')
      .attr('width', 170)
      .attr('height', 80)
      .attr('x', -85)
      .attr('y', -40)
      .attr('rx', 12)
      .attr('ry', 12)
      .attr('fill', (d) => d.badgeBg || 'rgba(20, 24, 38, 0.94)')
      .attr('stroke', (d) => d.badgeColor || d.stroke || '#d4af37')
      .attr('stroke-width', 1.8)
      .style('filter', 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.6))');

    containerMacroNodes.append('text')
      .attr('class', 'container-macro-title')
      .attr('y', -12)
      .attr('fill', (d) => d.badgeColor || '#fff')
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('font-family', "'Atkinson', sans-serif")
      .text((d) => `⊞ ${d.label || d.id}`);

    containerMacroNodes.append('text')
      .attr('class', 'container-macro-sub')
      .attr('y', 10)
      .attr('fill', 'rgba(255, 255, 255, 0.7)')
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-family', "'Atkinson', sans-serif")
      .text((d) => `${(getAllMemberSlugs(d.id) || []).length} Chapters`);

    containerMacroNodes.append('text')
      .attr('class', 'container-macro-hint')
      .attr('y', 27)
      .attr('fill', (d) => d.badgeColor || '#64ffda')
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('letter-spacing', '0.5px')
      .text('CLICK TO OPEN');

    // Clicking open container badge collapses it into a single node
    containerBadges.on('click', (event, d) => {
      event.stopPropagation();
      if (!d.parent) return; // Parent outer container stays open
      if (closedContainers.has(d.id)) {
        closedContainers.delete(d.id);
      } else {
        closedContainers.add(d.id);
      }
      applyContainerVisibility();
    });

    // Clicking collapsed container macro node opens it back up
    containerMacroNodes.on('click', (event, d) => {
      event.stopPropagation();
      closedContainers.delete(d.id);
      applyContainerVisibility();
    });

    const hullLine = d3.line().curve(d3.curveCatmullRomClosed.alpha(0.5));
    const nodeBySlug = new Map(data.nodes.map((n) => [n.id, n]));

    function updateContainers() {
      if (sortedContainers.length === 0) return;
      containerGroups.each(function (c) {
        const group = d3.select(this);
        const memberSlugs = getAllMemberSlugs(c.id);
        const memberNodes = memberSlugs
          .map((slug) => nodeBySlug.get(slug))
          .filter((n) => n && Number.isFinite(n.x) && Number.isFinite(n.y));

        if (memberNodes.length === 0) {
          group.style('display', 'none');
          return;
        }

        const avgX = d3.mean(memberNodes, (n) => n.x);
        const avgY = d3.mean(memberNodes, (n) => n.y);
        containerCentroids.set(c.id, { x: avgX, y: avgY });

        const isClosed = closedContainers.has(c.id);
        if (isClosed) {
          group.style('display', null);
          group.select('.container-hull').style('display', 'none');
          group.select('.container-badge').style('display', 'none');
          group.select('.container-macro-node')
            .style('display', null)
            .attr('transform', `translate(${avgX}, ${avgY})`);
          return;
        }

        group.style('display', null);
        group.select('.container-macro-node').style('display', 'none');
        group.select('.container-hull').style('display', null);
        group.select('.container-badge').style('display', null);

        const points = [];
        const isRoot = !c.parent;
        const pad = c.padding || (isRoot ? 75 : 42);

        // If child containers are closed, include their macro node bounds
        for (const childId of (containerChildren.get(c.id) || [])) {
          if (closedContainers.has(childId)) {
            const cp = containerCentroids.get(childId);
            if (cp) {
              points.push(
                [cp.x - 90, cp.y - 45],
                [cp.x + 90, cp.y - 45],
                [cp.x + 90, cp.y + 45],
                [cp.x - 90, cp.y + 45]
              );
            }
          }
        }

        // Only include open nodes in hull calculations
        const openMemberNodes = memberNodes.filter((n) => {
          for (const cId of closedContainers) {
            if (getAllMemberSlugs(cId).includes(n.id)) return false;
          }
          return true;
        });

        if (openMemberNodes.length === 0 && points.length === 0) {
          group.select('.container-hull').style('display', 'none');
          group.select('.container-badge').style('display', 'none');
          return;
        }

        for (const n of openMemberNodes) {
          const w = n._size?.width || (n.type === 'article' ? CARD.width : n.size);
          const h = n._size?.height || (n.type === 'article' ? CARD.height : n.size);
          const halfW = w / 2 + pad;
          const halfH = h / 2 + pad;
          points.push(
            [n.x - halfW, n.y - halfH],
            [n.x + halfW, n.y - halfH],
            [n.x + halfW, n.y + halfH],
            [n.x - halfW, n.y + halfH]
          );
        }

        const hull = d3.polygonHull(points);
        if (!hull || hull.length < 3) return;

        const pathD = hullLine(hull);
        group.select('.container-hull').attr('d', pathD);

        const minY = Math.min(...hull.map((p) => p[1]));
        const hullAvgX = d3.mean(hull, (p) => p[0]);

        const badge = group.select('.container-badge');
        const badgeLabel = c.parent ? `⊟ ${c.label} (${memberNodes.length})` : c.label;
        badge.select('text').text(badgeLabel);
        const textNode = badge.select('text').node();
        const bbox = textNode ? textNode.getBBox() : { width: 80, height: 18 };
        const badgeW = bbox.width + 24;
        const badgeH = Math.max(bbox.height + 8, 22);

        badge.select('rect')
          .attr('x', -badgeW / 2)
          .attr('y', -badgeH / 2)
          .attr('width', badgeW)
          .attr('height', badgeH);

        const badgeY = isRoot ? minY + 14 : minY + 8;
        badge.attr('transform', `translate(${hullAvgX}, ${badgeY})`);
      });
    }

    function applyContainerVisibility() {
      const hiddenSlugs = new Set();
      for (const cId of closedContainers) {
        for (const s of getAllMemberSlugs(cId)) hiddenSlugs.add(s);
      }

      if (articleNodes) {
        articleNodes.style('display', (d) => (hiddenSlugs.has(d.id) ? 'none' : null));
      }
      nodes.style('display', (d) => (hiddenSlugs.has(d.id) ? 'none' : null));
      updateContainers();
      applyPositions();
    }

    function linkEndpoints(l) {
      let sx = typeof l.source === 'object' ? l.source.x : 0;
      let sy = typeof l.source === 'object' ? l.source.y : 0;
      let tx = typeof l.target === 'object' ? l.target.x : 0;
      let ty = typeof l.target === 'object' ? l.target.y : 0;

      const sid = typeof l.source === 'object' ? l.source.id : l.source;
      const tid = typeof l.target === 'object' ? l.target.id : l.target;

      let srcClosed = null;
      let tgtClosed = null;
      for (const cId of closedContainers) {
        const slugs = getAllMemberSlugs(cId);
        if (slugs.includes(sid)) srcClosed = cId;
        if (slugs.includes(tid)) tgtClosed = cId;
      }

      // If both source and target are inside the same closed container, link is hidden
      if (srcClosed && srcClosed === tgtClosed) {
        return { x1: 0, y1: 0, x2: 0, y2: 0, hidden: true };
      }

      if (srcClosed) {
        const cp = containerCentroids.get(srcClosed);
        if (cp) { sx = cp.x; sy = cp.y; }
      }
      if (tgtClosed) {
        const cp = containerCentroids.get(tgtClosed);
        if (cp) { tx = cp.x; ty = cp.y; }
      }

      if (l.layer !== 'sequence') {
        return { x1: sx, y1: sy, x2: tx, y2: ty, hidden: false };
      }

      const dx = tx - sx;
      const dy = ty - sy;
      const dist = Math.hypot(dx, dy);
      if (dist < 40) {
        return { x1: sx, y1: sy, x2: tx, y2: ty, hidden: false };
      }

      const cos = dx / dist;
      const sin = dy / dist;

      const srcW = srcClosed ? 90 : ((l.source._size?.width || CARD.width) / 2 + 4);
      const srcH = srcClosed ? 45 : ((l.source._size?.height || CARD.height) / 2 + 4);
      const rSrc = Math.min(
        Math.abs(cos) > 1e-4 ? srcW / Math.abs(cos) : Infinity,
        Math.abs(sin) > 1e-4 ? srcH / Math.abs(sin) : Infinity
      );

      const tgtW = tgtClosed ? 90 : ((l.target._size?.width || CARD.width) / 2 + 4);
      const tgtH = tgtClosed ? 45 : ((l.target._size?.height || CARD.height) / 2 + 4);
      const rTgt = Math.min(
        Math.abs(cos) > 1e-4 ? tgtW / Math.abs(cos) : Infinity,
        Math.abs(sin) > 1e-4 ? tgtH / Math.abs(sin) : Infinity
      );

      if (dist <= rSrc + rTgt) {
        return { x1: sx, y1: sy, x2: tx, y2: ty, hidden: false };
      }

      return {
        x1: sx + cos * rSrc,
        y1: sy + sin * rSrc,
        x2: tx - cos * rTgt,
        y2: ty - sin * rTgt,
        hidden: false,
      };
    }

    function linkPath(l, ep) {
      if (ep.hidden) return 'M 0 0';
      if (l.layer !== 'sequence') {
        return `M ${ep.x1} ${ep.y1} L ${ep.x2} ${ep.y2}`;
      }
      const dx = ep.x2 - ep.x1;
      const dy = ep.y2 - ep.y1;
      const dist = Math.hypot(dx, dy);
      if (dist < 2) return `M ${ep.x1} ${ep.y1} L ${ep.x2} ${ep.y2}`;

      const mx = (ep.x1 + ep.x2) / 2;
      const my = (ep.y1 + ep.y2) / 2;

      // Normal perpendicular: (-dy / dist, dx / dist)
      const nx = -dy / dist;
      const ny = dx / dist;

      // Graceful bend: noticeable arc between 36px and 80px offset
      const bend = Math.min(80, Math.max(36, dist * 0.22));

      const cx = mx + nx * bend;
      const cy = my + ny * bend;

      return `M ${ep.x1} ${ep.y1} Q ${cx} ${cy} ${ep.x2} ${ep.y2}`;
    }

    // Render links + nodes without arrowheads (relying solely on the moving bead)
    const links = g.selectAll('.link')
      .data(data.links)
      .enter().append('path')
      .attr('class', (d) => [
        'link',
        d.layer ? `link-${d.layer}` : '',
        d.role ? `link-role-${d.role}` : '',
      ].filter(Boolean).join(' '))
      .attr('fill', 'none')
      .style('stroke', (d) => {
        if (d.layer !== 'sequence') return null;
        const sid = typeof d.source === 'object' ? d.source.id : d.source;
        const sn = nodeBySlug.get(sid);
        return sn?.containerColor || 'var(--gv-accent, #d4af37)';
      })
      .style('stroke-opacity', (d) => (d.layer === 'sequence' ? 0.45 : null));

    // Traveling single bead on sequence rail (matches act color)
    const sequencePulses = g.selectAll('.link-sequence-pulse')
      .data(data.links.filter(d => d.layer === 'sequence'))
      .enter().append('path')
      .attr('class', 'link-sequence-pulse')
      .attr('fill', 'none')
      .attr('pathLength', 100)
      .style('stroke', (d) => {
        const sid = typeof d.source === 'object' ? d.source.id : d.source;
        const sn = nodeBySlug.get(sid);
        return sn?.containerColor || '#ffe066';
      })
      .style('filter', (d) => {
        const sid = typeof d.source === 'object' ? d.source.id : d.source;
        const sn = nodeBySlug.get(sid);
        const col = sn?.containerColor || '#ffd700';
        return `drop-shadow(0 0 4px ${col})`;
      });


    const nodes = g.selectAll('.node')
      .data(data.nodes)
      .enter().append('g')
      .attr('class', 'node');

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
              pinned: pinnedIdsRef.current.has(d.id),
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
            updateContainers();
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
              const ep = linkEndpoints(l);
              d3.select(this).attr('d', linkPath(l, ep));
            }
          });
          sequencePulses.each(function(l) {
            const sid = typeof l.source === 'object' ? l.source.id : l.source;
            const tid = typeof l.target === 'object' ? l.target.id : l.target;
            if (sid === d.id || tid === d.id) {
              const ep = linkEndpoints(l);
              d3.select(this).attr('d', linkPath(l, ep));
            }
          });
          updateContainers();
        })
        .on('end', (event, d) => {
          const vs = viewStateRef.current;
          if (d._resizing) {
            d._resizing = false;
            // The resize is one history entry, like the drag.
            if (vs) vs.commit();
            updateContainers();
            return;
          }
          d.fx = d.x; d.fy = d.y;
          // One history entry for the whole drag, not one per frame.
          if (vs) {
            vs.setNodePosition(positionKey(d), d.x, d.y, { transient: true });
            vs.commit();
          }
          updateContainers();
        });
        
    nodes.call(dragHandler);

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
        const fontSize = TAG.fontSize;
        const PAD = TAG.padding;
        const MAX_BUBBLE_W = TAG.maxWidth;
        const MAX_LINES = TAG.maxLines;

        probe.style('font-size', fontSize + 'px').style('font-weight', '500');
        const widthOf = (t) => { probe.text(t); return probe.node().getComputedTextLength(); };

        const pieces = d.label.split(/(?<=-)|\s+/).filter(Boolean);
        const join = (arr) => arr.join('').replace(/\s+$/, '').trim();

        let lines = [d.label];
        if (widthOf(d.label) + PAD * 2 > MAX_BUBBLE_W && pieces.length > 1) {
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
          if (lines.length > MAX_LINES) {
            const head = lines.slice(0, MAX_LINES - 1);
            lines = head.concat([lines.slice(MAX_LINES - 1).join(' ')]);
          }
        }

        const effLineH = lines.length > 1 ? fontSize * 1.0 : fontSize * 1.1;

        const textEl = el.append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', '#1a1a2e')
          .style('font-family', TAG_FONT_FAMILY)
          .style('font-size', fontSize + 'px')
          .style('font-weight', String(TAG_WEIGHT))
          .style('pointer-events', 'none');
        lines.forEach((line) => {
          textEl.append('tspan').attr('x', 0).text(line);
        });

        const rectEl = el.insert('rect', 'text')
          .attr('rx', TAG.cornerRadius).attr('ry', TAG.cornerRadius)
          .attr('fill', 'var(--gv-' + (d.type === 'tag' ? 'tag-color' : d.type === 'topology' ? 'topology-color' : 'placeholder-color') + ')')
          .attr('opacity', TAG.opacity);
        const entry = { d, textEl, rectEl, lines, fontSize, lineH: effLineH };
        tagBubbles.push(entry);
        fitBubble(entry);

      } else {
        const rest = cardSizeFor({ hovered: false, pinned: false });
        d._r = Math.hypot(rest.width, rest.height) / 2;
      }
    });

    probe.remove();

    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        tagBubbles.forEach(fitBubble);
      }).catch(() => {});
    }

    const reactRoots = new Map();
    
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

    function renderArticleBody(d) {
      if (d.type !== 'article') return;
      const entry = reactRoots.get(d.id);
      if (!entry) return;
      const hovered = hoveredIdRef.current === d.id;
      const pinned = pinnedIdsRef.current.has(d.id);
      const lod = getLOD(zoomScaleRef.current);
      const defaultSize = cardSizeFor({ hovered, pinned, lod });
      let w, h;
      if (lod === 'marker' && !hovered && !pinned) {
        w = defaultSize.width;
        h = defaultSize.height;
      } else {
        const customSize = d._size || (d._customWidth && d._customHeight ? { width: d._customWidth, height: d._customHeight } : null);
        w = customSize ? customSize.width : defaultSize.width;
        h = customSize ? customSize.height : defaultSize.height;
      }

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
          viewState: { hovered, pinned, lod, zoomScale: zoomScaleRef.current },
          fullContent: d._fullContent || null,
          onResize: ({ width: newW, height: newH }) => {
            d._customWidth = newW;
            d._customHeight = newH;
            d._size = { width: newW, height: newH };
            entry.wrapper.style.width = newW + 'px';
            entry.wrapper.style.height = newH + 'px';
            entry.wrapper.style.marginLeft = (-newW / 2) + 'px';
            entry.wrapper.style.marginTop = (-newH / 2) + 'px';
            d._r = Math.max(newW, newH) / 2;
            renderArticleBody(d);
          }
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
      const filename = (d.url || '').split('/').pop();
      const tryFetch = async () => {
        let r;
        try {
          const isSameOrigin = d.url && new URL(d.url, window.location.href).origin === window.location.origin;
          if (!isSameOrigin && filename) {
            r = await fetch('./' + filename);
          }
        } catch (_) {}
        if (!r || !r.ok) {
          try { r = await fetch(d.url); } catch (_) {}
        }
        if (!r || !r.ok) {
          if (filename) r = await fetch('./' + filename);
        }
        if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : 'failed'));
        return r.text();
      };

      return tryFetch()
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

    renderAllArticleBodies();
    // Restored open nodes: fetch their text and bring them to the front.
    pinnedIdsRef.current.forEach((id) => {
      const d = data.nodes.find(nd => nd.id === id);
      if (!d) return;
      articleNodes.filter(nd => nd.id === id).raise().style('z-index', 10);
      loadFullContent(d).then(() => { if (pinnedIdsRef.current.has(id)) renderArticleBody(d); });
    });
    applyVisibility(svg, cardsLayer, hiddenSourcesRef.current);

    // Hover / click handlers. mouseover/mouseout (not mouseenter/leave)
    // because the card's inner HTML gets replaced on re-render
    // and mouseenter sometimes fails to re-fire on the new content.
    // We guard with relatedTarget so child-to-child cursor moves inside
    // the same node don't toggle the state.
    articleNodes
      .on('mouseover', (event, d) => {
        if (hoveredIdRef.current === d.id) return;
        hoveredIdRef.current = d.id;
        renderArticleBody(d);
        // Bring HTML node to front
        event.currentTarget.style.zIndex = 10;
      })
      .on('mouseout', (event, d) => {
        const related = event.relatedTarget;
        if (related && event.currentTarget.contains(related)) return;
        if (hoveredIdRef.current === d.id) {
          hoveredIdRef.current = null;
          renderArticleBody(d);
          event.currentTarget.style.zIndex = '';
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
        pinnedIdsRef.current.delete(d.id);
        if (viewStateRef.current) viewStateRef.current.setNodePinned(persistKey(d), false);
        hoveredIdRef.current = null;
        renderArticleBody(d);
      })
      .on('click', (event, d) => {
        const target = event.target;
        const isPopout = target && (target.dataset?.popout === '1' ||
                                    target.closest?.('[data-popout="1"]'));
        if (isPopout) {
          event.stopPropagation();
          if (onNodeSelectRef.current) {
            onNodeSelectRef.current(d.originalItem || d);
          }
          if (pinnedIdsRef.current.has(d.id)) {
            pinnedIdsRef.current.delete(d.id);
            if (viewStateRef.current) viewStateRef.current.setNodePinned(persistKey(d), false);
            hoveredIdRef.current = null;
            renderArticleBody(d);
            event.currentTarget.style.zIndex = '';
          }
          return;
        }
        event.stopPropagation();
        // Any number of nodes can be open at once. Opening one never closes
        // another: text you have open stays open until you close that node.
        if (pinnedIdsRef.current.has(d.id)) {
          pinnedIdsRef.current.delete(d.id);
          if (viewStateRef.current) viewStateRef.current.setNodePinned(persistKey(d), false);
          renderArticleBody(d);
          event.currentTarget.style.zIndex = '';
        } else {
          pinnedIdsRef.current.add(d.id);
          if (viewStateRef.current) viewStateRef.current.setNodePinned(persistKey(d), true);
          renderArticleBody(d);
          nodes.filter(nd => nd.id === d.id).raise();
          articleNodes.filter(nd => nd.id === d.id).raise();
          event.currentTarget.style.zIndex = 10;
          // Fetch full article body so the pinned node becomes a mini-reader.
          // Re-render when content arrives, but only if this node is still
          // open (user might have closed it in the meantime).
          loadFullContent(d).then(() => {
            if (pinnedIdsRef.current.has(d.id)) renderArticleBody(d);
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
          articleNodes.classed('dimmed', false);
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
          articleNodes.classed('dimmed', nd => !connected.has(nd.id));
          links.classed('highlighted', l => {
            const sid = typeof l.source === 'object' ? l.source.id : l.source;
            const tid = typeof l.target === 'object' ? l.target.id : l.target;
            return sid === d.id || tid === d.id;
          });
        }
      });

    svg.on('click', () => {
      if (activeTag) {
        activeTag = null;
        nodes.classed('dimmed', false).classed('tag-active', false);
        articleNodes.classed('dimmed', false);
        links.classed('highlighted', false);
      }
      // Open nodes stay open on a background click; each closes by clicking it.
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
      links.each(function(l) {
        const ep = linkEndpoints(l);
        d3.select(this).attr('d', linkPath(l, ep));
      });
      sequencePulses.each(function(l) {
        const ep = linkEndpoints(l);
        d3.select(this).attr('d', linkPath(l, ep));
      });
      nodes.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
      if (articleNodes) {
        articleNodes.style('transform', d => `translate3d(${d.x}px, ${d.y}px, 0px)`);
      }
      updateContainers();
    }
    let hasFitted = false;
    graphRef.current = { data, nodes, articleNodes, links, applyPositions, svg, zoom, fitToViewport, simulation, axisLayer, g, updateContainers };

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
    const geo = dimensionAxisGeometry(g.data.nodes, {
      orientation: vertical ? 'ttb' : 'ltr',
      origin,
      length,
      dimension: axis.dimension || 'time',
      granularity: axis.granularity || 'auto',
    });
    if (!geo) return;

    const root = g.axisLayer.append('g').attr('class', 'time-axis');

    // Connectors first, so the rail sits on top of them.
    const conn = root.append('g').attr('class', 'time-connectors');
    const connected = [];
    g.data.nodes.forEach((d) => {
      const anchors = geo.anchors[d.id];
      if (!anchors || !anchors.length) return;
      anchors.forEach((a2) => {
        const line = conn.append('line')
          .attr('class', 'time-connector')
          .attr('data-node', d.id)
          .attr('x1', a2.x).attr('y1', a2.y)
          .attr('stroke', (d._source && d._source.color) || '#7f8ea3')
          .attr('stroke-width', AX.connectorWidth)
          .attr('stroke-opacity', AX.connectorOpacity);
        connected.push({ node: d, anchor: a2, line });
      });
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
      if (g.updateContainers) g.updateContainers();
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
