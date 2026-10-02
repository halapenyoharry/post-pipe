import React, { useRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as d3 from 'd3';
import styles from './GraphViewer.module.css';
import { lensFor } from '../NodeView';
import { computeLayout, radialLayout, layoutIsDegenerate, timeAxisGeometry, dimensionAxisGeometry } from './layouts';
import { containerLayout, containerLayoutOf, hullDrawn, closedPillScaleOf } from './containerLayout';
import { showContainerCount, containerCountText } from './containerCount';
import { normalizeAngle, angleDelta, rotatedView, viewToScreen, screenToView } from './rotation';
import { zoomAbout, fitRatioAbout } from './zoomPivot';
import { minCardScale, homeScale } from './initialScale';
import { closedMemberSet, edgeHidden, initiallyClosed as initiallyClosedIds, closeAllPlan } from './closedState';
import { createTapGate } from './tapGate';
import { separateOpen } from './openOverlap';
import { rootShape, rootPath, rootSegments } from './roots';
import { layoutKey } from './layoutKey';
import { fraction, anchorWorld, homeView } from '../../lib/reach';
import { ghostOf, jitterPoints } from '../../lib/sketch';
import { config as todConfig, legibleOn, allBackgrounds } from '../../lib/timeOfDay';
import { countsByChapter, connectionEdges } from '../../lib/contributions';
import { isLinkItem, linkOf, followLink } from '../../lib/linkNode';

// The settings a link node's newTab rule is read from.
const settingsForLinks = () => (typeof window !== 'undefined' ? window.SETTINGS : null);

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

  // Which edge layers draw a line. A layer left out draws nothing and makes
  // none of its tag/topology/placeholder nodes; containment is never a line,
  // the hulls say it.
  const visibleLayers = new Set(config.visibleLayers || ['sequence']);
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
      // A variable, not a value: the card resolves it, so the theme and the
      // reader's color profile both reach it without a rebuild.
      color: containerColor || (status === 'published' ? 'var(--nv-published)' : 'var(--nv-draft)'),
      kind: item.kind || 'essay',
      substrate: item.substrate || 'essay',
      seed: item.seed || '',
      topology: item.topology || [],
      energy: item.energy || '',
      connected_to: item.connected_to || [],
      forms: item.forms || {},
      note: item.note || '',
      todos: item.todos || [],
      // A link node (src/lib/linkNode.js): what it follows, and the line
      // under its title.
      link: isLinkItem(item) ? linkOf(item) : '',
      subtitle: item.subtitle || '',
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

    if (!visibleLayers.has(edge.layer)) continue;
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

    // What the line says when hovered or tapped: its own label if it has one
    // (a flashback, say), otherwise its role.
    const label = edge.label || (edge.attrs && edge.attrs.label) || edge.role || edge.layer;
    links.push({ source, target, directed: !!edge.directed, role: edge.role, layer: edge.layer, label });
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
  // A member of a closed container stays hidden whatever its source.
  const isHidden = (d) => Boolean(d && (d._closedHidden || isHiddenArticle(d)));

  svg.selectAll('.node')
    .style('display', (d) => isHidden(d) ? 'none' : null);

  cardsLayer.selectAll('.node-card')
    .style('display', (d) => isHidden(d) ? 'none' : null);

  svg.selectAll('.link, .link-hit')
    .style('display', (l) => {
      const sNode = typeof l.source === 'object' ? l.source : null;
      const tNode = typeof l.target === 'object' ? l.target : null;
      if (isHidden(sNode) || isHidden(tNode)) return 'none';
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

// Where a site rests each container on its cover's art: { id: { x, y } },
// fractions of the art's width and height (containers[].anchor).
function anchorsOf(feed) {
  const out = {};
  for (const c of (feed && feed.containers) || []) {
    const a = fraction(c.anchor);
    if (a) out[c.id] = a;
  }
  return out;
}

// Each container's own layout settings ({ layout, hang, hull, spiral }), for
// the layout key.
function layoutsOf(feed) {
  const out = {};
  for (const c of (feed && feed.containers) || []) {
    const own = {};
    if (c.layout) own.layout = c.layout;
    if (c.hang && typeof c.hang === 'object') own.hang = c.hang;
    if (c.spiral && typeof c.spiral === 'object') own.spiral = c.spiral;
    if (c.hull === false || (c.hull && typeof c.hull === 'object')) own.hull = c.hull;
    if (Object.keys(own).length) out[c.id] = own;
  }
  return out;
}

// A container's title: where the layout puts it ('center', the default), at
// the top of its hull ('top'), or not drawn ('hidden').
function labelPositionOf(c) {
  return c && (c.labelPosition === 'top' || c.labelPosition === 'hidden') ? c.labelPosition : 'center';
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
  colorOverrides, apiRef, onNodeFocus, contributions,
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
  // A container's hull padding: containers.<id>.hull.padding, else
  // graph.hull.padding, else half a card for a hanging container and the
  // earlier fixed padding for the rest.
  const hullPadOf = (c) => {
    const own = c && c.hull && typeof c.hull === 'object' ? Number(c.hull.padding) : NaN;
    if (Number.isFinite(own)) return own;
    const all = GS.hull && typeof GS.hull === 'object' ? Number(GS.hull.padding) : NaN;
    if (Number.isFinite(all)) return all;
    if (containerLayoutOf(c, GS) === 'hang') return CARD.width / 2;
    return c && c.padding != null ? c.padding : (c && c.parent ? 42 : 75);
  };
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const cardsLayerRef = useRef(null);

  // Stable refs for callbacks so the simulation never rebuilds on prop change.
  const onNodeSelectRef = useRef(onNodeSelect);
  useEffect(() => { onNodeSelectRef.current = onNodeSelect; }, [onNodeSelect]);
  // The card the reader last opened on the graph: the node the settings
  // panel acts on when the reader is closed.
  const onNodeFocusRef = useRef(onNodeFocus);
  useEffect(() => { onNodeFocusRef.current = onNodeFocus; }, [onNodeFocus]);
  const focusedIdRef = useRef(null);
  const focusNode = (d) => {
    focusedIdRef.current = d ? d.id : null;
    if (onNodeFocusRef.current) onNodeFocusRef.current(d ? (d.originalItem || d) : null);
  };

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
  const renderAllArticleBodiesRef = useRef(null);
  const rootsUpdateRef = useRef(null);
  // Readers' contributions (settings.contributions): counted on the cards,
  // and their connections drawn as their own edge layer, the readers
  // dimension, off until the reader turns it on.
  const contributionsRef = useRef(contributions || []);
  const readersUpdateRef = useRef(null);

  // Where a node's arrangement is filed. Articles key by their item id — the
  // permalink — so the arrangement survives a rebuild that renumbers or
  // reorders everything. Tag and topology nodes key by their own synthetic id,
  // which is already stable.
  const persistKey = (d) => (d.originalItem && d.originalItem.id) || d.id;

  // Where a node sits depends on the layout — a node has one place in a ring
  // and another on a timeline — so positions are filed per layout, and per
  // the settings that shape it (layoutKey.js: a changed spiral, or a bumped
  // graph.layoutVersion, retires the old positions). How big the reader made
  // it does not, so size is filed against the item alone.
  // A container's anchor (where a site rests it on its cover's art) is part
  // of that signature too.
  const layoutKeys = useRef({ settings: null, feed: null, keys: new Map() });
  const placeOf = (name) => {
    const c = layoutKeys.current;
    if (c.settings !== graphSettings || c.feed !== feedData) { c.settings = graphSettings; c.feed = feedData; c.keys = new Map(); }
    if (!c.keys.has(name)) c.keys.set(name, layoutKey(name, graphSettings, { anchors: anchorsOf(feedData), layouts: layoutsOf(feedData) }) + '::');
    return c.keys.get(name);
  };
  const positionKey = (d) => placeOf(layoutRef.current) + persistKey(d);

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

  // An undo or a redo puts back an arrangement: where things were dragged,
  // which containers were open. The graph is drawn again from it, as a
  // reload would draw it.
  const [historyTick, setHistoryTick] = useState(0);
  useEffect(() => {
    if (!viewState) return undefined;
    let seen = viewState.historyVersion || 0;
    return viewState.subscribe(() => {
      const v = viewState.historyVersion || 0;
      if (v !== seen) { seen = v; setHistoryTick(v); }
    });
  }, [viewState]);

  // When bookmarks or other node viewState changes, re-render article cards
  useEffect(() => {
    if (!viewState) return;
    return viewState.subscribe(() => {
      if (renderAllArticleBodiesRef.current) {
        renderAllArticleBodiesRef.current();
      }
      if (rootsUpdateRef.current) rootsUpdateRef.current();
      if (readersUpdateRef.current) readersUpdateRef.current();
    });
  }, [viewState]);

  useEffect(() => {
    contributionsRef.current = contributions || [];
    if (renderAllArticleBodiesRef.current) renderAllArticleBodiesRef.current();
    if (readersUpdateRef.current) readersUpdateRef.current({ rebuild: true });
  }, [contributions]);

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
      tagColor: computedStyles.getPropertyValue('--gv-tag-color').trim() || '#f39c12',
      topologyColor: computedStyles.getPropertyValue('--gv-topology-color').trim() || '#9b59b6',
      placeholderColor: computedStyles.getPropertyValue('--gv-placeholder-color').trim() || '#7f8c8d',
      visibleLayers: Array.isArray(GS.visibleLayers) ? GS.visibleLayers : ['sequence'],
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
    // Whether the reader has panned or zoomed. Until they have, the view is
    // re-framed once the layout settles; after, it is theirs.
    let userMovedView = false;
    // Whether automatic framing still goes to settings.graph.initialFocus.
    let focusActive = !!GS.initialFocus && GS.initialFocus !== 'all';
    const FOCUS_MIN_SCALE = GS.initialFocusMinScale != null ? GS.initialFocusMinScale : 0.4;
    // The first frame shows cards at least graph.initialScale.minCardWidthPx
    // wide (initialScale.js); with anchors, that is the scale the graph state
    // rests at, the anchors placed through it.
    const MIN_CARD_K = minCardScale(GS.initialScale, CARD.width);
    const HOME_K = homeScale(FOCUS_MIN_SCALE, GS.initialScale, CARD.width);

    // Rotation (two fingers on a touch screen). The view is
    // translate · rotate · scale; d3.zoom keeps translate and scale and works
    // in the rotated frame, which pans and zooms correctly at any angle. While
    // two fingers turn, the drawn translate is corrected so the point under
    // them stays put; when they lift, that translate becomes d3's own. Labels
    // and cards turn back by the same angle, so they stay upright.
    let rotation = 0; // degrees
    let rotGesture = null; // { theta0, a0, mx, my, started }
    let paintedRotation = 0;
    let positionsReady = false;
    let anchoredOffsetsReady = false; // set once the anchors below are known
    let homeK = null; // the zoom the graph state rests at (applyHomeView, fitToViewport)
    let view = { x: 0, y: 0, k: 1 };
    const upright = () => (rotation ? ` rotate(${-rotation})` : '');
    const viewFor = (t) => rotatedView(t, rotGesture, rotation);
    function paintView(t) {
      view = viewFor(t);
      g.attr('transform', `translate(${view.x},${view.y}) rotate(${rotation}) scale(${view.k})`);
      if (cardsTransform) {
        cardsTransform.style('transform', `translate3d(${view.x}px, ${view.y}px, 0px) rotate(${rotation}deg) scale(${view.k})`);
      }
      if (container) container.style.setProperty('--gv-unrot', `${-rotation}deg`);
      if (paintedRotation !== rotation) {
        paintedRotation = rotation;
        if (positionsReady) applyPositions();
      }
    }
    // Graph point to screen point, through the view as drawn.
    const toScreen = (x, y) => viewToScreen(view, rotation, x, y);

    const zoom = d3.zoom().on('zoom', (event) => {
      if (event.sourceEvent) { userMovedView = true; focusActive = false; }
      paintView(event.transform);
      const newScale = event.transform.k;
      zoomScaleRef.current = newScale;
      if (edgeLabelFor) placeEdgeLabel();
      // The rail is pinned to the window and the nodes are not, so every pan
      // and zoom moves one end of every connector.
      if (connectorUpdateRef.current) connectorUpdateRef.current();
      if (positionsReady) publishWorld();
      const newLod = getLOD(newScale);
      if (newLod !== currentLodRef.current) {
        currentLodRef.current = newLod;
        renderAllArticleBodies();
        redrawLinks();
      }
    });
    svg.call(zoom).on('dblclick.zoom', null);

    // Two-finger rotate. Listening in the capture phase on the container runs
    // before d3.zoom's own touch handlers on the svg, so the angle is known
    // before d3 repaints the pinch.
    const touchAngle = (e) => {
      const a = e.touches[0], b = e.touches[1];
      return Math.atan2(b.clientY - a.clientY, b.clientX - a.clientX) * 180 / Math.PI;
    };
    const touchMid = (e) => {
      const r = container.getBoundingClientRect();
      const a = e.touches[0], b = e.touches[1];
      return [(a.clientX + b.clientX) / 2 - r.left, (a.clientY + b.clientY) / 2 - r.top];
    };
    const ROTATE_DEADZONE = 10; // degrees of twist before a pinch also turns
    const onRotateStart = (e) => {
      if (e.touches.length !== 2) return;
      const [mx, my] = touchMid(e);
      rotGesture = { theta0: rotation, a0: touchAngle(e), mx, my, started: false };
    };
    const onRotateMove = (e) => {
      if (!rotGesture || e.touches.length !== 2) return;
      const [mx, my] = touchMid(e);
      rotGesture.mx = mx; rotGesture.my = my;
      const twist = angleDelta(touchAngle(e), rotGesture.a0);
      if (!rotGesture.started) {
        if (Math.abs(twist) < ROTATE_DEADZONE) return;
        rotGesture.started = true;
        rotGesture.a0 = touchAngle(e);
        return;
      }
      rotation = normalizeAngle(rotGesture.theta0 + twist);
    };
    const onRotateEnd = (e) => {
      if (!rotGesture || e.touches.length >= 2) return;
      const v = viewFor(d3.zoomTransform(svg.node()));
      rotGesture = null;
      svg.call(zoom.transform, d3.zoomIdentity.translate(v.x, v.y).scale(v.k));
    };
    container.addEventListener('touchstart', onRotateStart, { capture: true, passive: true });
    container.addEventListener('touchmove', onRotateMove, { capture: true, passive: true });
    container.addEventListener('touchend', onRotateEnd, { capture: true, passive: true });
    container.addEventListener('touchcancel', onRotateEnd, { capture: true, passive: true });
    // Back to upright, keeping the point at the centre of the screen where it is.
    function resetRotation({ repaint = true } = {}) {
      if (!rotation && !rotGesture) return;
      rotGesture = null;
      const t = d3.zoomTransform(svg.node());
      const cx = width / 2, cy = height / 2;
      const p = screenToView(view, rotation, cx, cy);
      rotation = 0;
      if (repaint) svg.call(zoom.transform, d3.zoomIdentity.translate(cx - p[0] * t.k, cy - p[1] * t.k).scale(t.k));
    }

    // One tap or two. A double-tap (or double-click) zooms in about 2x at the
    // point tapped: empty canvas, a hull, a container title, an edge. On a
    // card it opens the reader for that piece instead (see the card's click).
    // Shift+double-click, or a double-tap with two fingers, zooms out. Because
    // a double-tap must not also open or toggle anything, a single tap waits
    // DOUBLE_TAP_MS to be sure no second tap is coming, and only then acts.
    const DOUBLE_TAP_MS = Number.isFinite(GS.doubleTapMs) ? GS.doubleTapMs : 250;
    const DOUBLE_TAP_PX = 32;
    const tapGate = createTapGate({ ms: DOUBLE_TAP_MS, px: DOUBLE_TAP_PX });
    function screenPoint(ev) {
      const src = ev && ev.changedTouches && ev.changedTouches.length ? ev.changedTouches[0] : ev;
      const r = container.getBoundingClientRect();
      if (!src || !Number.isFinite(src.clientX)) return [width / 2, height / 2];
      return [src.clientX - r.left, src.clientY - r.top];
    }
    function zoomAtPoint(x, y, factor) {
      userMovedView = true;
      focusActive = false;
      svg.transition('tap-zoom').duration(320).ease(d3.easeCubicOut).call(zoom.scaleBy, factor, [x, y]);
    }
    function tapOrDouble(ev, single, double) {
      const [x, y] = screenPoint(ev);
      const shift = !!(ev && ev.shiftKey);
      tapGate.tap(x, y, single, double || (() => zoomAtPoint(x, y, shift ? 0.5 : 2)));
    }

    // Two fingers down and up again without moving is a two-finger tap; two
    // of those in quick succession zoom out at their midpoint.
    let twoTap = null; // { t, x, y, moved }
    let lastTwoTap = null; // { t, x, y }
    const onTwoTapStart = (e) => {
      if (e.touches.length === 2) {
        const [mx, my] = touchMid(e);
        twoTap = { t: Date.now(), x: mx, y: my, moved: false };
      } else if (e.touches.length > 2) twoTap = null;
    };
    const onTwoTapMove = (e) => {
      if (!twoTap || e.touches.length !== 2) return;
      const [mx, my] = touchMid(e);
      if (Math.hypot(mx - twoTap.x, my - twoTap.y) > 14) twoTap.moved = true;
    };
    const onTwoTapEnd = (e) => {
      if (!twoTap || e.touches.length > 0) return;
      const tap = twoTap;
      twoTap = null;
      const now = Date.now();
      if (tap.moved || now - tap.t > 350) return;
      if (lastTwoTap && now - lastTwoTap.t <= 450 && Math.hypot(tap.x - lastTwoTap.x, tap.y - lastTwoTap.y) <= 60) {
        lastTwoTap = null;
        zoomAtPoint(tap.x, tap.y, 0.5);
      } else {
        lastTwoTap = { t: now, x: tap.x, y: tap.y };
      }
    };
    container.addEventListener('touchstart', onTwoTapStart, { capture: true, passive: true });
    container.addEventListener('touchmove', onTwoTapMove, { capture: true, passive: true });
    container.addEventListener('touchend', onTwoTapEnd, { capture: true, passive: true });

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
        if (d.type === 'article' && !d.link && saved && saved.pinned) pinnedIdsRef.current.add(d.id);
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

    // Roots (graph.roots): under everything else, hulls included, and never
    // touched by a pointer.
    const rootsLayer = g.append('g').attr('class', 'roots-layer')
      .attr('aria-hidden', 'true')
      .style('pointer-events', 'none');

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

    // Membership never changes after mount, and this is asked every tick.
    const memberSlugCache = new Map();
    function getAllMemberSlugs(cId, visited) {
      if (!visited && memberSlugCache.has(cId)) return memberSlugCache.get(cId);
      const seen = visited || new Set();
      if (seen.has(cId)) return [];
      seen.add(cId);
      const direct = Array.from(containerMembers.get(cId) || []);
      const children = Array.from(containerChildren.get(cId) || []);
      const fromChildren = children.flatMap((chId) => getAllMemberSlugs(chId, seen));
      const out = Array.from(new Set([...direct, ...fromChildren]));
      if (!visited) memberSlugCache.set(cId, out);
      return out;
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

    // The sketchbook theme's second pencil pass round each container.
    containerGroups.append('path')
      .attr('class', 'container-hull-ghost')
      .attr('stroke', (d) => d.stroke || 'rgba(212, 175, 55, 0.45)');

    // Whether the page wears the sketchbook theme: the pencil passes are
    // drawn only then.
    let sketchOn = typeof document !== 'undefined' && document.documentElement.getAttribute('data-pp-theme') === 'sketchbook';

    // Containers closed from the start (graph.containersStart, or else
    // graph.initialCollapsed; closedState.js); a reset returns to the same set.
    const initiallyClosed = () => initiallyClosedIds(feedData.containers || [], GS);
    const closedContainers = new Set(initiallyClosed());
    const containerCentroids = new Map();
    // Where each container's title (or, closed, its blob) is drawn: the
    // roots start there.
    const containerAnchor = new Map();


    // A container's label: its title wrapped to a few lines, the member count
    // after the last line (unless graph.containerCount is false). Lines are placed explicitly around the origin so the
    // rendered block matches the rectangle the layout reserved for it.
    const LABEL_LINE_H = 1.05;
    const LABEL_WRAP = 15;
    const SHOW_COUNT = showContainerCount(GS);
    function labelLines(d) {
      const words = (d.label || d.id).split(/\s+/);
      const lines = [];
      let currentLine = '';
      for (const w of words) {
        if (!currentLine) currentLine = w;
        else if (currentLine.length + 1 + w.length > LABEL_WRAP) { lines.push(currentLine); currentLine = w; }
        else currentLine += ' ' + w;
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    }
    // Status line under the title (e.g. "soon"), smaller, in the same color.
    const STATUS_SCALE = 0.42;
    const STATUS_GAP = 0.2;
    const statusOf = (d) => (d.status ? String(d.status) : '');
    function labelBlockEm(d) {
      const n = labelLines(d).length;
      const statusH = statusOf(d) ? STATUS_GAP + STATUS_SCALE * 1.3 : 0;
      return { n, statusH, total: n * LABEL_LINE_H + statusH };
    }
    function buildWrappedLabel(textSel, d) {
      const lines = labelLines(d);
      const { n: nLines, total } = labelBlockEm(d);
      const top = -total / 2;
      textSel.selectAll('*').remove();
      lines.forEach((line, i) => {
        textSel.append('tspan')
          .attr('class', 'label-line')
          .attr('x', 0)
          .attr('y', `${top + (i + 0.5) * LABEL_LINE_H}em`)
          .text(line);
        if (SHOW_COUNT && i === nLines - 1) {
          textSel.append('tspan')
            .attr('class', 'label-count')
            .attr('font-weight', '500')
            .attr('dx', '12px')
            .attr('font-size', '0.5em')
            .text('');
        }
      });
      const status = statusOf(d);
      if (status) {
        // y is in the tspan's own (smaller) em, hence the division.
        const yParent = top + nLines * LABEL_LINE_H + STATUS_GAP + (STATUS_SCALE * 1.3) / 2;
        textSel.append('tspan')
          .attr('class', 'label-status')
          .attr('x', 0)
          .attr('font-size', `${STATUS_SCALE}em`)
          .attr('font-weight', '500')
          .attr('letter-spacing', '0.02em')
          .attr('y', `${yParent / STATUS_SCALE}em`)
          .text(status);
      }
    }
    const labelMeasureCtx = typeof document !== 'undefined'
      ? document.createElement('canvas').getContext('2d')
      : null;
    function titleFamily() {
      if (typeof document === 'undefined') return "'Atkinson', sans-serif";
      const v = getComputedStyle(document.documentElement).getPropertyValue('--pp-title-font').trim();
      return v || "'Atkinson', sans-serif";
    }
    function labelInkWidth(text, fs, weight) {
      // Letter-spacing is 0.05em in the stylesheet; canvas does not apply it.
      const spacing = text.length * fs * 0.05;
      if (!labelMeasureCtx) return text.length * fs * 0.6 + spacing;
      // The face titles are drawn in: the theme's (--pp-title-font), else Atkinson.
      labelMeasureCtx.font = `${sketchOn ? 400 : weight} ${fs}px ${titleFamily()}`;
      return labelMeasureCtx.measureText(text).width * 1.06 + spacing;
    }
    // The rectangle a container's label occupies at font size fs.
    function labelBlockSize(c, fs) {
      const lines = labelLines(c);
      const countW = SHOW_COUNT ? labelInkWidth(' 000', fs * 0.5, 500) + 12 : 0;
      const status = statusOf(c);
      const w = Math.max(
        ...lines.map((l, i) => labelInkWidth(l, fs, 700) + (i === lines.length - 1 ? countW : 0)),
        status ? labelInkWidth(status, fs * STATUS_SCALE, 500) : 0,
      );
      // A text box is taller than its lines: ascenders and descenders.
      const h = labelBlockEm(c).total * fs + 0.3 * fs;
      return { w: w + 24, h: h + 12 };
    }
    function getContainerColor(c) {
      return c.badgeColor || c.color || c.stroke || '#d4af37';
    }

    const containerBadges = containerGroups.append('g')
      .attr('class', 'container-badge')
      // The whole book's title: a page that sets the title elsewhere (a
      // cover, src/components/Opening) can leave this one undrawn.
      .attr('data-container-top', (d) => (!d.parent ? '' : null))
      .style('touch-action', 'manipulation');

    // The title's text ignores the pointer, so this is what a tap lands on.
    containerBadges.append('rect')
      .attr('class', 'container-badge-hit')
      .attr('fill', 'transparent')
      .attr('pointer-events', 'all');

    const containerBadgeTexts = containerBadges.append('text')
      .attr('class', 'container-badge-text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('user-select', 'none')
      .attr('fill', (d) => getContainerColor(d))
      .attr('opacity', 0.55)
      .attr('font-size', (d) => (!d.parent ? '64px' : '52px'));
      
    containerBadgeTexts.each(function(d) {
      buildWrappedLabel(d3.select(this), d);
    });

    // A container's title sits straight on the page, translucent. It keeps
    // that look, but never below 3:1 (WCAG AA for large text) on any
    // background the page can show in the current mode: its own, and every
    // time-of-day palette. Repainted when the theme or mode changes.
    function applyLabelContrast() {
      if (typeof document === 'undefined') return;
      const S = typeof window !== 'undefined' ? window.SETTINGS : null;
      const mode = document.documentElement.getAttribute('data-pp-mode') || 'dark';
      const bodyBg = getComputedStyle(document.body).backgroundColor;
      const transparent = !bodyBg || /rgba\([^)]*,\s*0\)$/.test(bodyBg) || bodyBg === 'transparent';
      const bgs = allBackgrounds(todConfig(S), mode, transparent ? null : bodyBg);
      containerBadgeTexts.each(function (d) {
        const l = legibleOn(getContainerColor(d), bgs, { opacity: 0.55 });
        d3.select(this).attr('fill', l.color).attr('opacity', l.opacity);
      });
    }
    applyLabelContrast();
    // A change of theme or mode repaints the titles' contrast, and a change
    // of theme re-measures them (the sketchbook draws them in another face)
    // and lays the containers out again round them.
    function onThemeChange() {
      applyLabelContrast();
      const now = document.documentElement.getAttribute('data-pp-theme') === 'sketchbook';
      if (now === sketchOn) return;
      sketchOn = now;
      const relayout = () => {
        if (!positionsReady) return;
        relayoutContainers();
        applyPositions();
      };
      if (document.fonts && document.fonts.load) {
        document.fonts.load(`48px ${titleFamily()}`).then(relayout, relayout);
      } else relayout();
    }
    const themeObserver = typeof MutationObserver !== 'undefined' ? new MutationObserver(onThemeChange) : null;
    // Wearing the sketchbook from the start: measure the titles again once
    // their face has loaded.
    if (sketchOn && typeof document !== 'undefined' && document.fonts && document.fonts.load) {
      document.fonts.load(`48px ${titleFamily()}`).then(() => {
        if (!positionsReady || !svgRef.current) return;
        relayoutContainers();
        applyPositions();
      }, () => {});
    }
    if (themeObserver) themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-pp-mode', 'data-pp-theme'] });

    // Collapsed container macro node (when container is closed, represented like a single node)
    const containerMacroNodes = containerGroups.append('g')
      .attr('class', 'container-macro-node')
      .style('display', 'none')
      .style('touch-action', 'manipulation');

    // A closed container is a node, but a bigger, softer one: a blob in the
    // container's color rather than a card, with larger text than a chapter's.
    containerMacroNodes.append('path')
      .attr('class', 'container-macro-bg')
      .style('fill', (d) => `color-mix(in srgb, ${getContainerColor(d)} 16%, var(--pp-macro-base, #151826))`)
      .attr('stroke', (d) => getContainerColor(d))
      .attr('stroke-width', 2.2)
      .style('filter', (d) => `drop-shadow(0 0 18px color-mix(in srgb, ${getContainerColor(d)} 45%, transparent))`);

    const PILL_SCALE = closedPillScaleOf(GS);
    const CLOSED_FONT = Math.round((CARD.labelMaxFontSize || 26) * 1.6);
    const containerMacroTexts = containerMacroNodes.append('text')
      .attr('class', 'container-macro-text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', (d) => getContainerColor(d))
      .attr('font-size', (d) => `${!d.parent ? Math.round(CLOSED_FONT * 1.25) : CLOSED_FONT}px`)
      .attr('font-family', "'Atkinson', sans-serif")
      .attr('font-weight', '700')
      .attr('letter-spacing', '-0.02em');

    // A soft closed outline through points on a rounded rectangle, nudged in
    // and out a little (the same way every time for the same container).
    const blobLine = d3.line().curve(d3.curveCatmullRomClosed.alpha(0.5));
    function blobPath(id, hw, hh) {
      let seed = 0;
      for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) >>> 0;
      const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
      const pts = [];
      const N = 14;
      for (let k = 0; k < N; k++) {
        const t = (k / N) * Math.PI * 2;
        const c = Math.cos(t), sn = Math.sin(t);
        // superellipse, exponent 2.8: squarer than an ellipse, rounder than a card
        const e = 2 / 2.8;
        const wobble = 1 + (rand() - 0.5) * 0.08;
        pts.push([Math.sign(c) * Math.pow(Math.abs(c), e) * hw * wobble, Math.sign(sn) * Math.pow(Math.abs(sn), e) * hh * wobble]);
      }
      return blobLine(pts);
    }

    containerMacroTexts.each(function(d) {
      buildWrappedLabel(d3.select(this), d);
    });

    function updateMacroBounds() {
      containerMacroNodes.each(function (d) {
        const g = d3.select(this);
        const fs = parseFloat(g.select('.container-macro-text').attr('font-size')) || CLOSED_FONT;
        const block = labelBlockSize(d, fs);
        // At least half again a chapter card, and room for the text.
        const bw = Math.max(CARD.width * 1.5, block.w + fs * 1.4);
        const bh = Math.max(CARD.height * 1.5, block.h + fs * 1.4);
        g.select('.container-macro-bg').attr('d', blobPath(d.id, bw / 2, bh / 2));
        // Drawn at full size and scaled as a whole (graph.closedPillScale),
        // text and all; the layout and the hull take the scaled size.
        d._macroHalfW = (bw / 2) * PILL_SCALE;
        d._macroHalfH = (bh / 2) * PILL_SCALE;
      });
    }
    updateMacroBounds();

    function createContainerDragHandler({ isCollapsed }) {
      return d3.drag().clickDistance(5)
        .filter((event) => {
          if (event.ctrlKey) return false;
          if (event.button !== undefined && event.button !== 0) return false;
          return true;
        })
        .on('start', function (event, c) {
          if (event.sourceEvent) event.sourceEvent.stopPropagation();
          const startX = event.x;
          const startY = event.y;
          d3.select(this).datum()._dragState = {
            startX,
            startY,
            lastX: startX,
            lastY: startY,
            totalMove: 0,
          };
        })
        .on('drag', function (event, c) {
          const state = d3.select(this).datum()._dragState;
          if (!state) return;
          const dx = event.x - state.lastX;
          const dy = event.y - state.lastY;
          state.lastX = event.x;
          state.lastY = event.y;
          state.totalMove += Math.hypot(dx, dy);

          const memberSlugs = getAllMemberSlugs(c.id);
          for (const slug of memberSlugs) {
            const node = nodeBySlug.get(slug);
            if (node) {
              node.x += dx;
              node.y += dy;
              node.fx = node.x;
              node.fy = node.y;
              if (viewStateRef.current) {
                viewStateRef.current.setNodePosition(positionKey(node), node.x, node.y, { transient: true });
              }
            }
          }
          applyPositions();
          if (connectorUpdateRef.current) connectorUpdateRef.current();
        })
        .on('end', function (event, c) {
          const state = d3.select(this).datum()._dragState;
          delete d3.select(this).datum()._dragState;
          const totalMove = state ? state.totalMove : 0;

          if (totalMove >= 4) {
            anchorsAuto = false;
            const memberSlugs = getAllMemberSlugs(c.id);
            // The anchored containers it carried leave their anchors.
            if (anchoredOffsetsReady) {
              const carried = new Set(memberSlugs);
              for (const cId of ANCHORS.keys()) {
                const own = getAllMemberSlugs(cId);
                if (own.length && own.every((sl) => carried.has(sl))) detach(cId);
              }
            }
            const vs = viewStateRef.current;
            for (const slug of memberSlugs) {
              const node = nodeBySlug.get(slug);
              if (node) {
                node.fx = node.x;
                node.fy = node.y;
                if (vs) {
                  vs.setNodePosition(positionKey(node), node.x, node.y, { transient: true });
                }
              }
            }
            if (vs) vs.commit();
            applyPositions();
          } else {
            // A tap (under 4px of movement) on the title or the closed node
            // toggles it; a double-tap zooms, like anywhere else. With
            // collapseGesture 'doubletap' it is the other way round.
            const toggle = () => {
              if (isCollapsed) setContainersOpen([c.id], true);
              else setContainersOpen([c.id], closedContainers.has(c.id));
            };
            const gesture = graphSettings.collapseGesture || 'tap';
            if (gesture === 'doubletap') tapOrDouble(event.sourceEvent, () => {}, toggle);
            else tapOrDouble(event.sourceEvent, toggle);
          }
        });
    }

    containerBadges.call(createContainerDragHandler({ isCollapsed: false }));
    containerMacroNodes.call(createContainerDragHandler({ isCollapsed: true }));
    // The tap is handled above; it must not also reach the canvas, which
    // would read it as a tap on empty space and close the reader.
    containerBadges.on('click', (event) => event.stopPropagation());
    containerMacroNodes.on('click', (event) => event.stopPropagation());

    const hullLine = d3.line().curve(d3.curveCatmullRomClosed.alpha(0.5));
    const hangHullLine = d3.line().curve(d3.curveBasisClosed);
    // Points every `step` or so along each side of a polygon, the corners kept.
    function densify(poly, step) {
      const out = [];
      const s = Math.max(8, step);
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i + 1) % poly.length];
        out.push(a);
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const k = Math.floor(len / s);
        for (let j = 1; j < k; j++) out.push([a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k]);
      }
      return out;
    }
    const nodeBySlug = new Map(data.nodes.map((n) => [n.id, n]));

    // ── Nested container layout (cluster layout only) ──────────────────────
    // Every container is laid out in its own frame by containerLayout: label
    // reserved at the origin, first unit directly below it, chapters one after
    // another along a golden spiral (or the golden-angle scatter, with
    // spiral.mode 'scatter'), child containers placed as whole boxes. The result
    // is a set of target positions relative to each top-level container; the
    // top-level container itself is free to drift wherever the simulation puts
    // it, so the offset is re-measured from the members every time.
    const containerById = new Map((data.containers || []).map((c) => [c.id, c]));
    const depthOf = (c) => {
      let depth = 0;
      let p = c.parent;
      while (p && containerById.has(p) && depth < 20) { depth++; p = containerById.get(p).parent; }
      return depth;
    };
    const LABEL_MIN = (graphSettings.labelSize && graphSettings.labelSize.min) || 32;
    const LABEL_MAX = (graphSettings.labelSize && graphSettings.labelSize.max) || 96;
    const LABEL_NESTED = (graphSettings.labelSize && graphSettings.labelSize.nestedScale) || 0.75;
    const layoutMembers = () => {
      const m = new Map();
      for (const c of (data.containers || [])) {
        m.set(c.id, Array.from(containerMembers.get(c.id) || [])
          .map((slug) => nodeBySlug.get(slug))
          .filter(Boolean)
          .map((n) => ({
            id: n.id,
            w: (n._size && n._size.width) || (n.type === 'article' ? CARD.width : n.size),
            h: (n._size && n._size.height) || (n.type === 'article' ? CARD.height : n.size),
            order: Number.isFinite(n.series_part) ? n.series_part : null,
            date: n.date || '',
          })));
      }
      return m;
    };
    let CL = { roots: [], nodes: new Map(), containers: new Map() };
    function computeContainerLayout() {
      if (!data.containers || data.containers.length === 0) return;
      const members = layoutMembers();
      const run = () => containerLayout({
        containers: data.containers,
        members,
        closed: closedContainers,
        labelSize: (c) => labelBlockSize(c, c._fs || LABEL_MIN),
        macroSize: (c) => ({ w: (c._macroHalfW || 130) * 2, h: (c._macroHalfH || 45) * 2 }),
        options: {
          spacing: graphSettings.spiral?.spacing ?? 20,
          mode: layoutRef.current === 'radial' ? 'ring' : (graphSettings.spiral?.mode || 'path'),
          startRadius: graphSettings.spiral?.startRadius,
          direction: graphSettings.spiral?.direction,
          gap: 28,
          padding: hullPadOf,
          layoutOf: (c) => (layoutRef.current === 'force' ? containerLayoutOf(c, GS) : null),
          hangOf: (c) => ({ ...(GS.hang || {}), ...(c.hang || {}) }),
          spiralOf,
        },
      });
      // Two passes: the label's size depends on how wide its container ends
      // up, and the container's width depends on the label.
      for (const c of data.containers) c._fs = LABEL_MIN;
      let res = run();
      for (const c of data.containers) {
        const info = res.containers.get(c.id);
        const w = info ? info.box.x1 - info.box.x0 : 0;
        const max = LABEL_MAX * Math.pow(LABEL_NESTED, depthOf(c));
        c._fs = Math.max(LABEL_MIN, Math.min(Math.max(LABEL_MIN, max), w / 8));
        // A hanging container's title sits beside the top of its chain, in
        // a column a card wide: no larger than fits there.
        if (info && info.hang) {
          const room = CARD.width + info.hang.gap;
          for (let guard = 0; guard < 40 && c._fs > LABEL_MIN && labelBlockSize(c, c._fs).w > room; guard++) {
            c._fs = Math.max(LABEL_MIN, c._fs * 0.92);
          }
        }
      }
      res = run();
      CL = res;
      // Each laid-out card is drawn at its container's cardScale.
      for (const n of data.nodes) {
        const p = CL.nodes.get(n.id);
        n._cardScale = p && p.scale > 0 ? p.scale : 1;
      }
    }

    // A container's spiral settings: containers.<id>.spiral over
    // graph.spiral (containerLayout.js spiralOptions). keepBelow 'crown'
    // becomes keepBelowY, the crown's line in the container's frame: with
    // anchors, the frame's origin is the anchor, so the line is how far
    // above the anchor the crown falls on the art, through the home view.
    function spiralOf(c) {
      const s = { ...(GS.spiral || {}), ...((c && c.spiral) || {}) };
      return { ...s, keepBelowY: keepBelowYOf(c, s) };
    }
    function keepBelowYOf(c, s) {
      if (s.keepBelow !== 'crown' || !c || !ANCHORS.has(c.id)) return null;
      if (!(coverFrame && coverFrame.art && Number.isFinite(coverFrame.crownY))) return null;
      if (layoutRef.current !== 'force') return null;
      const view = homeView(HOME_K);
      const origin = graphOrigin();
      const a = anchorWorld(ANCHORS.get(c.id), coverFrame.art, view, origin);
      const crown = anchorWorld({ x: 0.5, y: coverFrame.crownY }, coverFrame.art, view, origin);
      return crown.y - a.y;
    }
    const keepBelowUsed = () => [GS.spiral, ...(data.containers || []).map((c) => c.spiral)]
      .some((s) => s && s.keepBelow === 'crown');

    // Where each top-level container's frame currently sits: the mean offset
    // between its members' positions and their targets.
    function rootOffset(rootId) {
      // With anchored containers inside it, a top-level container's own frame
      // is the mean of theirs, so what else it holds stays among them.
      if (anchoredOffsetsReady && anchorsOn()) {
        let ax = 0, ay = 0, an = 0;
        for (const cId of ANCHORS.keys()) {
          const info = CL.containers.get(cId);
          if (!info || info.root !== rootId) continue;
          const o = containerOffset(cId);
          if (o) { ax += o.x; ay += o.y; an++; }
        }
        if (an) return { x: ax / an, y: ay / an };
      }
      let sx = 0, sy = 0, n = 0;
      for (const [id, p] of CL.nodes) {
        if (p.root !== rootId) continue;
        const node = nodeBySlug.get(id);
        if (!node || !Number.isFinite(node.x) || !Number.isFinite(node.y)) continue;
        sx += node.x - p.x; sy += node.y - p.y; n++;
      }
      return n ? { x: sx / n, y: sy / n } : null;
    }

    function containerOffset(cId) {
      let sx = 0, sy = 0, n = 0;
      for (const id of getAllMemberSlugs(cId)) {
        const p = CL.nodes.get(id);
        const node = nodeBySlug.get(id);
        if (!p || !node || !Number.isFinite(node.x) || !Number.isFinite(node.y)) continue;
        sx += node.x - p.x; sy += node.y - p.y; n++;
      }
      return n ? { x: sx / n, y: sy / n } : null;
    }

    // Containers are laid out in cluster (spiral paths) and in ring (one ring
    // per container). The positional pull only matters in cluster: in ring
    // every node is placed outright.
    const spiralOn = () => graphSettings.spiral?.enabled !== false
      && (layoutRef.current === 'force' || layoutRef.current === 'radial');

    // ── Anchors ────────────────────────────────────────────────────────────
    // A site can rest a container on its cover's art (containers[].anchor,
    // fractions of the art; src/components/Opening publishes where the art
    // sits in the graph state as window.PostPipeCoverFrame). The view the
    // graph rests at is then the home view, at initialFocusMinScale from the
    // frame's corner, and a fresh layout (or Reset) puts each anchored
    // container's centre (its title, or its closed node) where its anchor
    // falls on the art. Each anchored container keeps a frame of its own:
    // it can be dragged on its own, and opens and closes in place. Saved
    // positions work as before; the anchors are part of their key.
    const ANCHORS = new Map(Object.entries(anchorsOf(feedData)).filter(([id]) => containerById.has(id)));
    let coverFrame = typeof window !== 'undefined' ? window.PostPipeCoverFrame || null : null;
    const anchorsOn = () => ANCHORS.size > 0 && !!(coverFrame && coverFrame.art)
      && spiralOn() && layoutRef.current === 'force' && CL.containers.size > 0;
    // Each member's innermost anchored container.
    const anchoredOf = new Map();
    for (const cId of [...ANCHORS.keys()].sort((a, b) => depthOf(containerById.get(b)) - depthOf(containerById.get(a)))) {
      for (const slug of getAllMemberSlugs(cId)) if (!anchoredOf.has(slug)) anchoredOf.set(slug, cId);
    }
    anchoredOffsetsReady = true;
    // Where an anchored container's centre is in the world now.
    function centreOf(cId) {
      const info = CL.containers.get(cId);
      const off = info && containerOffset(cId);
      return off ? { x: off.x + info.center.x, y: off.y + info.center.y } : null;
    }
    // Where the graph's frame sits on the screen in the graph state (the
    // cover moves it while it comes in).
    function graphOrigin() {
      if (!containerRef.current) return { x: 0, y: 0 };
      const r = containerRef.current.getBoundingClientRect();
      const shift = (typeof window !== 'undefined' && window.PostPipeCover && window.PostPipeCover.shift) || 0;
      return { x: r.left, y: r.top - shift };
    }
    // Where each anchor falls in the world, through the home view.
    function anchorTargets() {
      const out = new Map();
      if (!anchorsOn()) return out;
      const view = homeView(HOME_K);
      const origin = graphOrigin();
      for (const [cId, a] of ANCHORS) out.set(cId, anchorWorld(a, coverFrame.art, view, origin));
      return out;
    }
    // Move each anchored container, members and all, so its centre is on
    // its anchor; they stay there (pinned) until the reader moves them.
    const anchorsPending = new Set(); // fresh: placed when the art is known
    let anchorsAuto = false;          // placed by the layout and not moved since
    // An anchored container stays pinned to its anchor (the anchor is its
    // centre, closed or open, through every opening and closing) until the
    // reader drags it; then it stays where it was dropped, until Reset. The
    // drag is kept with the reader's arrangement, as the container's own
    // entry (layout key + its id), so it lasts across visits and Reset,
    // Forget and Undo take it back with the rest.
    const detachKey = (cId) => placeOf(layoutRef.current) + cId;
    const detachedHere = new Set(); // without a store
    function isDetached(cId) {
      const vs = viewStateRef.current;
      if (!vs) return detachedHere.has(cId);
      const st = vs.nodeState(detachKey(cId));
      return Boolean(st && !st.auto && Number.isFinite(st.x));
    }
    function detach(cId) {
      const c = centreOf(cId);
      const vs = viewStateRef.current;
      if (vs && c) vs.setNodePosition(detachKey(cId), c.x, c.y, { transient: true });
      else detachedHere.add(cId);
    }
    // A dragged container goes back where the reader dropped it (its own
    // entry says where its centre was), its members pinned in their saved
    // arrangement round it, or the layout's when theirs was not kept. Every
    // other one goes onto its anchor, its members keeping their arrangement
    // round it.
    const dropsPending = new Map(); // cId -> where its centre was dropped
    for (const cId of ANCHORS.keys()) {
      const vs = viewStateRef.current;
      if (vs && isDetached(cId)) {
        const st = vs.nodeState(detachKey(cId));
        for (const slug of getAllMemberSlugs(cId)) {
          if (anchoredOf.get(slug) !== cId) continue;
          const n = nodeBySlug.get(slug);
          if (n && Number.isFinite(n.x) && Number.isFinite(n.y)) { n.fx = n.x; n.fy = n.y; }
        }
        dropsPending.set(cId, { x: st.x, y: st.y });
      } else {
        anchorsPending.add(cId);
      }
    }
    // Move each container in `targets` (cId -> a world point), members and
    // all, so its centre is there, pinned.
    function moveCentres(targets) {
      for (const [cId, w] of targets) {
        const c = centreOf(cId);
        if (!w || !c) continue;
        const dx = w.x - c.x, dy = w.y - c.y;
        for (const slug of getAllMemberSlugs(cId)) {
          const n = nodeBySlug.get(slug);
          if (!n || !Number.isFinite(n.x) || !Number.isFinite(n.y)) continue;
          n.x += dx; n.y += dy;
          n.fx = n.x; n.fy = n.y;
          n.vx = 0; n.vy = 0;
        }
      }
    }
    // An anchored container's members onto the layout's arrangement, round
    // where its frame is now (placeAnchors then moves it onto its anchor).
    function snapToLayout(cId) {
      const off = containerOffset(cId);
      if (!off) return;
      for (const slug of getAllMemberSlugs(cId)) {
        if (anchoredOf.get(slug) !== cId) continue;
        const p = CL.nodes.get(slug);
        const n = nodeBySlug.get(slug);
        if (!p || !n || !Number.isFinite(n.x) || !Number.isFinite(n.y)) continue;
        n.x = off.x + p.x; n.y = off.y + p.y;
        n.vx = 0; n.vy = 0;
      }
    }
    function placeAnchors(ids = [...ANCHORS.keys()]) {
      if (!anchorsOn()) return false;
      const targets = anchorTargets();
      moveCentres(ids.map((cId) => [cId, targets.get(cId)]));
      for (const cId of ids) anchorsPending.delete(cId);
      anchorsAuto = ids.length === ANCHORS.size;
      return true;
    }
    function placeDrops() {
      if (!dropsPending.size) return false;
      moveCentres([...dropsPending]);
      dropsPending.clear();
      return true;
    }

    // ── The graph's world, for the page around it ─────────────────────────
    // The cover's rootlets (src/components/Opening) reach for containers
    // drawn here. window.PostPipeGraphWorld.snapshot() gives, in screen px,
    // each container they reach for (the anchored ones, or else each act: a
    // top-level container's children) as the outline it is drawn with,
    // closed or open, and its centre; and the zoom, k against the zoom the
    // graph rests at (homeK). 'graph:world' is sent whenever any of that may
    // have changed; the page draws at most once a frame.
    const reachIds = () => (ANCHORS.size
      ? [...ANCHORS.keys()]
      : (data.containers || []).filter((c) => c.parent && !containerById.get(c.parent)?.parent).map((c) => c.id));
    const outlineCache = new WeakMap();
    function outlineOf(path) {
      const d = path.getAttribute('d') || '';
      const hit = outlineCache.get(path);
      if (hit && hit.d === d) return hit.pts;
      let pts = [];
      try {
        const len = path.getTotalLength();
        const n = 72;
        for (let i = 0; i < n; i++) { const q = path.getPointAtLength((len * i) / n); pts.push([q.x, q.y]); }
      } catch { pts = []; }
      outlineCache.set(path, { d, pts });
      return pts;
    }
    function worldSnapshot() {
      const out = [];
      if (!positionsReady) return { containers: out, k: zoomScaleRef.current, homeK };
      for (const id of reachIds()) {
        const group = containerGroups.filter((c) => c.id === id);
        const el = group.node();
        if (!el || el.style.display === 'none') continue;
        const closed = closedContainers.has(id);
        const path = group.select(closed ? '.container-macro-bg' : '.container-hull').node();
        if (!path || (!closed && path.style.display === 'none')) continue;
        const local = outlineOf(path);
        const m = path.getScreenCTM();
        if (!m || local.length < 3) continue;
        const hull = local.map(([x, y]) => ({ x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f }));
        let cx = 0, cy = 0;
        for (const q of hull) { cx += q.x; cy += q.y; }
        out.push({ id, closed, hull, centre: { x: cx / hull.length, y: cy / hull.length } });
      }
      return { containers: out, k: zoomScaleRef.current, homeK };
    }
    function publishWorld() {
      if (typeof window === 'undefined') return;
      window.dispatchEvent(new CustomEvent('graph:world'));
    }
    if (typeof window !== 'undefined') window.PostPipeGraphWorld = { snapshot: worldSnapshot };

    function createContainerLayoutForce() {
      function force(alpha) {
        if (!spiralOn() || layoutRef.current !== 'force') return;
        const strength = graphSettings.spiral?.strength ?? 0.35;
        // An anchored container holds its shape in its own frame.
        const own = new Map();
        if (anchorsOn()) for (const cId of ANCHORS.keys()) own.set(cId, containerOffset(cId));
        for (const rootId of CL.roots) {
          const rootOff = rootOffset(rootId);
          for (const [id, p] of CL.nodes) {
            if (p.root !== rootId) continue;
            const n = nodeBySlug.get(id);
            if (!n || !Number.isFinite(n.x)) continue;
            const a = anchoredOf.get(id);
            const off = (a && own.get(a)) || rootOff;
            if (!off) continue;
            n.vx += (off.x + p.x - n.x) * strength * alpha;
            n.vy += (off.y + p.y - n.y) * strength * alpha;
          }
        }
      }
      force.initialize = function () {};
      return force;
    }

    // Top-level containers keep apart from each other, and nodes that belong
    // to no container stay outside them. Inside a container the layout above
    // decides everything, so nested containers are not separated here.
    function createContainerSeparationForce() {
      let simNodes = [];
      const getHalfSize = (n) => {
        if (n.type === 'article') {
          return (Math.hypot(n._size?.width || CARD.width, n._size?.height || CARD.height) / 2) * (n._cardScale || 1);
        }
        return (n._r || (n.size || 60) / 2);
      };

      function force(alpha) {
        if (!data.containers || data.containers.length === 0) return;
        const circles = [];
        for (const rootId of CL.roots) {
          const info = CL.containers.get(rootId);
          const off = rootOffset(rootId);
          if (!info || !off) continue;
          const members = getAllMemberSlugs(rootId).map((s) => nodeBySlug.get(s)).filter((n) => n && Number.isFinite(n.x));
          circles.push({
            x: off.x + (info.box.x0 + info.box.x1) / 2,
            y: off.y + (info.box.y0 + info.box.y1) / 2,
            r: Math.hypot(info.box.x1 - info.box.x0, info.box.y1 - info.box.y0) / 2,
            members,
          });
        }
        const push = (dx, dy, dist, minDist, apply) => {
          if (dist >= minDist) return;
          const overlap = minDist - dist;
          let nx = dist > 1e-4 ? dx / dist : 1;
          let ny = dist > 1e-4 ? dy / dist : 0;
          apply(nx * overlap * alpha * 0.5, ny * overlap * alpha * 0.5);
        };
        const spacing = graphSettings.containerSpacing !== undefined ? graphSettings.containerSpacing : -20;
        for (let i = 0; i < circles.length; i++) {
          for (let j = i + 1; j < circles.length; j++) {
            const a = circles[i], b = circles[j];
            const dx = b.x - a.x, dy = b.y - a.y;
            push(dx, dy, Math.hypot(dx, dy), a.r + b.r + spacing, (sx, sy) => {
              for (const n of a.members) { n.vx -= sx; n.vy -= sy; }
              for (const n of b.members) { n.vx += sx; n.vy += sy; }
            });
          }
        }
        const contained = new Set(CL.nodes.keys());
        const loose = (simNodes.length ? simNodes : data.nodes)
          .filter((n) => !contained.has(n.id) && Number.isFinite(n.x));
        for (const c of circles) {
          for (const n of loose) {
            const dx = n.x - c.x, dy = n.y - c.y;
            push(dx, dy, Math.hypot(dx, dy), c.r + getHalfSize(n), (sx, sy) => {
              n.vx += sx; n.vy += sy;
              for (const m of c.members) { m.vx -= sx * 0.2; m.vy -= sy * 0.2; }
            });
          }
        }
      }
      force.initialize = (_nodes) => { simNodes = _nodes; };
      return force;
    }

    if (data.containers && data.containers.length > 0) {
      computeContainerLayout();
      simulation.force('containerSeparation', createContainerSeparationForce());
      simulation.force('containerLayout', createContainerLayoutForce());
    }

    // Members of a closed container are hidden: they take no room and push
    // nothing. Inside a laid-out container the layout places members, so
    // their mutual repulsion and link springs are turned right down rather
    // than left to argue with it.
    let hiddenByClosed = new Set();
    const rootOfNode = (id) => (CL.nodes.get(id) || {}).root || null;
    const endId = (e) => (typeof e === 'object' ? e.id : e);
    function refreshContainerForces() {
      hiddenByClosed = new Set();
      for (const cId of closedContainers) for (const s of getAllMemberSlugs(cId)) hiddenByClosed.add(s);
      // A laid-out member already has a rectangle nobody else overlaps, so its
      // collision circle is the one inscribed in its card, not the one around it.
      simulation.force('collide').radius((d) => {
        if (hiddenByClosed.has(d.id)) return 0;
        if (CL.nodes.has(d.id) && d.type === 'article') {
          return (Math.min(d._size?.width || CARD.width, d._size?.height || CARD.height) / 2) * (d._cardScale || 1);
        }
        return (d._r || (d.type === 'article' ? Math.hypot(CARD.width, CARD.height) / 2 : d.size / 2)) + SIM.collidePadding;
      });
      simulation.force('charge').strength((d) => {
        if (hiddenByClosed.has(d.id)) return 0;
        return CL.nodes.has(d.id) ? SIM.chargeStrength * 0.05 : SIM.chargeStrength;
      });
    }
    if (CL.nodes.size > 0) {
      refreshContainerForces();
      const linkForce = simulation.force('link');
      const defaultLinkStrength = linkForce.strength();
      linkForce.strength((l) => {
        const rs = rootOfNode(endId(l.source));
        return rs && rs === rootOfNode(endId(l.target)) ? 0 : defaultLinkStrength(l);
      });
    }

    // Never-placed members start at their targets, so the first frame is
    // already the arrangement rather than a heap that has to unfold. Top-level
    // containers start side by side.
    function seedFromLayout(all) {
      let cursor = width / 2;
      for (const rootId of CL.roots) {
        const info = CL.containers.get(rootId);
        if (!info) continue;
        const w = info.box.x1 - info.box.x0;
        const ox = cursor - (info.box.x0 + info.box.x1) / 2 + (cursor === width / 2 ? 0 : w / 2);
        const oy = height / 2 - (info.box.y0 + info.box.y1) / 2;
        for (const [id, p] of CL.nodes) {
          if (p.root !== rootId) continue;
          const n = nodeBySlug.get(id);
          if (!n) continue;
          if (all || !Number.isFinite(n.x) || !Number.isFinite(n.y)) {
            n.x = ox + p.x; n.y = oy + p.y;
            n.vx = 0; n.vy = 0;
          }
        }
        cursor += (cursor === width / 2 ? w / 2 : w) + 200;
      }
    }
    if (CL.nodes.size > 0) seedFromLayout(positionsWereDegenerate);

    // The ring layout with containers: each top-level container (its rings
    // inside it) side by side, and anything in no container on a ring of its
    // own to the right.
    function ringTargets() {
      if (!data.containers || data.containers.length === 0) return null;
      computeContainerLayout();
      refreshContainerForces();
      if (CL.nodes.size === 0) return null;
      const out = {};
      let cursor = 0;
      for (const rootId of CL.roots) {
        const info = CL.containers.get(rootId);
        if (!info) continue;
        const ox = cursor - info.box.x0;
        const oy = -(info.box.y0 + info.box.y1) / 2;
        for (const [id, p] of CL.nodes) {
          if (p.root === rootId) out[id] = { x: ox + p.x, y: oy + p.y };
        }
        cursor += info.box.x1 - info.box.x0 + 200;
      }
      const loose = data.nodes.filter((n) => !CL.nodes.has(n.id));
      if (loose.length) {
        const pos = radialLayout(loose, { cardW: CARD.width, cardH: CARD.height });
        const xs = Object.values(pos).map((p) => p.x);
        const shift = xs.length ? cursor + CARD.width - Math.min(...xs) : cursor;
        for (const [id, p] of Object.entries(pos)) out[id] = { x: p.x + shift, y: p.y };
      }
      return out;
    }
    // Called when the layout changes: containers are laid out again for it.
    function recomputeContainers() {
      if (!data.containers || data.containers.length === 0) return;
      computeContainerLayout();
      refreshContainerForces();
    }

    function hasClosedAncestor(c) {
      let p = c.parent;
      let guard = 0;
      while (p && guard++ < 20) {
        if (closedContainers.has(p)) return true;
        p = containerById.get(p)?.parent;
      }
      return false;
    }

    function updateContainers() {
      if (sortedContainers.length === 0) return;
      publishWorld();
      const useLayout = spiralOn() && CL.containers.size > 0;
      // Each container's frame is measured from its own members, so a label
      // follows its container when the reader drags just that container.
      const framed = (c) => {
        const info = useLayout ? CL.containers.get(c.id) : null;
        const off = info ? containerOffset(c.id) : null;
        return info && off ? { info, off } : null;
      };
      // Where a closed container's node sits.
      const macroPos = (c) => {
        const f = framed(c);
        if (f) return { x: f.off.x + f.info.center.x, y: f.off.y + f.info.center.y };
        const ns = getAllMemberSlugs(c.id).map((s) => nodeBySlug.get(s)).filter((n) => n && Number.isFinite(n.x));
        return ns.length ? { x: d3.mean(ns, (n) => n.x), y: d3.mean(ns, (n) => n.y) } : null;
      };

      containerGroups.each(function (c) {
        const group = d3.select(this);
        const memberSlugs = getAllMemberSlugs(c.id);
        const memberNodes = memberSlugs
          .map((slug) => nodeBySlug.get(slug))
          .filter((n) => n && Number.isFinite(n.x) && Number.isFinite(n.y));

        if (memberNodes.length === 0 || hasClosedAncestor(c)) {
          group.style('display', 'none');
          containerAnchor.delete(c.id);
          return;
        }

        const isClosed = closedContainers.has(c.id);
        const fs = c._fs || 52;
        const f = framed(c);

        if (isClosed) {
          const pos = macroPos(c);
          containerCentroids.set(c.id, pos);
          containerAnchor.set(c.id, pos);
          group.style('display', null);
          group.select('.container-hull').style('display', 'none');
          group.select('.container-hull-ghost').attr('d', '');
          group.select('.container-badge').style('display', 'none');
          group.select('.container-macro-node')
            .style('display', null)
            .attr('transform', `translate(${pos.x}, ${pos.y})${upright()}${PILL_SCALE !== 1 ? ` scale(${PILL_SCALE})` : ''}`)
            .select('.label-count').text(containerCountText(GS, memberNodes.length));
          return;
        }

        const avgX = d3.mean(memberNodes, (n) => n.x);
        const avgY = d3.mean(memberNodes, (n) => n.y);
        containerCentroids.set(c.id, { x: avgX, y: avgY });

        group.style('display', null);
        group.select('.container-macro-node').style('display', 'none');
        group.select('.container-hull').style('display', null);
        group.select('.container-badge').style('display', null);

        const points = [];
        const pad = hullPadOf(c);

        // Closed children are drawn as nodes; the hull wraps those.
        for (const childId of (containerChildren.get(c.id) || [])) {
          if (!closedContainers.has(childId)) continue;
          const childObj = containerById.get(childId);
          const cp = childObj && macroPos(childObj);
          if (!cp) continue;
          const hw = (childObj._macroHalfW || 130) + pad / 2;
          const hh = (childObj._macroHalfH || 45) + pad / 2;
          points.push([cp.x - hw, cp.y - hh], [cp.x + hw, cp.y - hh], [cp.x + hw, cp.y + hh], [cp.x - hw, cp.y + hh]);
        }

        // Only open nodes count toward the hull.
        const openMemberNodes = memberNodes.filter((n) => {
          for (const cId of closedContainers) {
            if (getAllMemberSlugs(cId).includes(n.id)) return false;
          }
          return true;
        });

        for (const n of openMemberNodes) {
          const s = n._cardScale || 1;
          const w = (n._size?.width || (n.type === 'article' ? CARD.width : n.size)) * s;
          const h = (n._size?.height || (n.type === 'article' ? CARD.height : n.size)) * s;
          const halfW = w / 2 + pad;
          const halfH = h / 2 + pad;
          points.push(
            [n.x - halfW, n.y - halfH],
            [n.x + halfW, n.y - halfH],
            [n.x + halfW, n.y + halfH],
            [n.x - halfW, n.y + halfH]
          );
        }

        // The label is part of the container: the hull wraps it too, and the
        // labels of the open containers inside it, each on its own frame.
        // A label at the top of the hull, or not drawn, is not wrapped.
        const labelPos = labelPositionOf(c);
        let labelAt = null;
        if (f) {
          const lp = pad / 2;
          const inner = [];
          const walk = (id) => {
            for (const ch of (containerChildren.get(id) || [])) {
              if (closedContainers.has(ch)) continue;
              const chObj = containerById.get(ch);
              const fc = chObj && framed(chObj);
              if (fc && labelPositionOf(chObj) !== 'hidden') inner.push({ L: fc.info.label, off: fc.off });
              walk(ch);
            }
          };
          walk(c.id);
          for (const { L, off } of inner) {
            points.push(
              [off.x + L.x0 - lp, off.y + L.y0 - lp], [off.x + L.x1 + lp, off.y + L.y0 - lp],
              [off.x + L.x1 + lp, off.y + L.y1 + lp], [off.x + L.x0 - lp, off.y + L.y1 + lp]
            );
          }
          const L = f.info.label;
          labelAt = { x: f.off.x + (L.x0 + L.x1) / 2, y: f.off.y + (L.y0 + L.y1) / 2 };
          if (labelPos === 'center') {
            points.push(
              [f.off.x + L.x0 - lp, f.off.y + L.y0 - lp], [f.off.x + L.x1 + lp, f.off.y + L.y0 - lp],
              [f.off.x + L.x1 + lp, f.off.y + L.y1 + lp], [f.off.x + L.x0 - lp, f.off.y + L.y1 + lp]
            );
          }
        }

        if (points.length === 0) {
          group.select('.container-hull-ghost').attr('d', '');
          group.select('.container-hull').style('display', 'none');
          group.select('.container-badge').style('display', 'none');
          return;
        }

        let hull = d3.polygonHull(points);
        if (!hull || hull.length < 3) return;
        // A hanging container's hull hugs its cards: points along its
        // straight sides, and a curve that rounds the corners from inside
        // (a B-spline never leaves its points' outline), so it never bows
        // out past them, nor above the anchor at its top.
        const hanging = !!(f && f.info.hang);
        if (hanging) hull = densify(hull, pad / 2);
        const line = hanging ? hangHullLine : hullLine;
        if (hullDrawn(c)) {
          group.select('.container-hull').style('display', null).attr('d', line(hull));
          group.select('.container-hull-ghost').attr('d', sketchOn ? line(jitterPoints(hull, c.id, 3.5)) : '');
        } else {
          group.select('.container-hull').style('display', 'none').attr('d', '');
          group.select('.container-hull-ghost').attr('d', '');
        }

        const badge = group.select('.container-badge');
        badge.attr('data-label-position', labelPos);
        badge.select('.label-count').text(containerCountText(GS, memberNodes.length));

        const sizeHit = (size) => {
          const blk = labelBlockSize(c, size);
          badge.select('.container-badge-hit')
            .attr('x', -blk.w / 2).attr('y', -blk.h / 2).attr('width', blk.w).attr('height', blk.h);
        };

        if (labelPos === 'hidden') {
          badge.style('display', 'none');
          containerAnchor.set(c.id, labelAt || { x: d3.mean(hull, (p) => p[0]), y: d3.mean(hull, (p) => p[1]) });
          return;
        }
        if (labelPos === 'top') {
          // Centred across the hull, its top just inside the hull's top.
          const size = labelAt ? fs : Math.max(LABEL_MIN, Math.min(LABEL_MAX, (d3.max(hull, (p) => p[0]) - d3.min(hull, (p) => p[0])) / 8));
          const blk = labelBlockSize(c, size);
          const minY = d3.min(hull, (p) => p[1]);
          const x0 = d3.min(hull, (p) => p[0]), x1 = d3.max(hull, (p) => p[0]);
          const at = { x: (x0 + x1) / 2, y: minY + pad * 0.5 + blk.h / 2 };
          badge.select('.container-badge-text').attr('font-size', `${size}px`);
          sizeHit(size);
          badge.attr('transform', `translate(${at.x}, ${at.y})${upright()}`);
          containerAnchor.set(c.id, at);
          return;
        }

        if (labelAt) {
          badge.select('.container-badge-text').attr('font-size', `${fs}px`);
          sizeHit(fs);
          badge.attr('transform', `translate(${labelAt.x}, ${labelAt.y})${upright()}`);
          containerAnchor.set(c.id, labelAt);
          return;
        }

        // No layout frame (ring layout, or the spiral turned off): centred,
        // a third of the way down the hull.
        const minY = Math.min(...hull.map((p) => p[1]));
        const maxY = Math.max(...hull.map((p) => p[1]));
        const minX = Math.min(...hull.map((p) => p[0]));
        const maxX = Math.max(...hull.map((p) => p[0]));
        const fs2 = Math.max(LABEL_MIN, Math.min(LABEL_MAX, (maxX - minX) / 8));
        badge.select('.container-badge-text').attr('font-size', `${fs2}px`);
        sizeHit(fs2);
        const center = d3.polygonCentroid(hull);
        const cx = Number.isFinite(center[0]) ? center[0] : d3.mean(hull, (p) => p[0]);
        badge.attr('transform', `translate(${cx}, ${minY + (maxY - minY) / 3})${upright()}`);
        containerAnchor.set(c.id, { x: cx, y: minY + (maxY - minY) / 3 });
      });
    }

    // Closed means closed: a closed container's members, and every edge with
    // an end among them, are not drawn and cannot be touched. Only the
    // container's blob is.
    let closedHidden = new Set();
    function applyClosedDisplay() {
      closedHidden = closedMemberSet(closedContainers, getAllMemberSlugs);
      for (const d of data.nodes) d._closedHidden = closedHidden.has(d.id);
      if (articleNodes) {
        articleNodes.style('display', (d) => (closedHidden.has(d.id) ? 'none' : null));
      }
      nodes.style('display', (d) => (closedHidden.has(d.id) ? 'none' : null));
      const off = (l) => (edgeHidden(l, closedHidden) ? 'none' : null);
      links.style('display', off);
      linkGhosts.style('display', off);
      linkHits.style('display', off);
      sequencePulses.style('display', off);
      if (edgeLabelFor && edgeHidden(edgeLabelFor, closedHidden)) hideEdgeLabel();
    }

    function applyContainerVisibility() {
      applyClosedDisplay();
      relayoutContainers();
      updateContainers();
      applyPositions();
    }

    // ── Open and close ─────────────────────────────────────────────────────
    // The one way containers change state: a tap, the panel, or a program
    // calling the API all come through here.
    function containerState() {
      return Object.fromEntries((data.containers || []).map((c) => [c.id, closedContainers.has(c.id) ? 'closed' : 'open']));
    }
    function setContainersOpen(ids, open) {
      return setContainers(open ? { open: ids } : { close: ids });
    }
    // { open: [ids], close: [ids] }, drawn once.
    function setContainers({ open = [], close = [] }) {
      let changed = false;
      for (const id of open) {
        if (containerById.has(id) && closedContainers.has(id)) { closedContainers.delete(id); changed = true; }
      }
      for (const id of close) {
        if (containerById.has(id) && !closedContainers.has(id)) { closedContainers.add(id); changed = true; }
      }
      if (!changed) return false;
      applyContainerVisibility();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('graph:containers-changed', { detail: containerState() }));
      }
      return true;
    }
    const allContainerIds = () => (data.containers || []).map((c) => c.id);
    const containerApi = {
      openContainer: (id) => setContainersOpen([id], true),
      closeContainer: (id) => setContainersOpen([id], false),
      toggleContainer: (id) => setContainersOpen([id], closedContainers.has(id)),
      openAllContainers: () => setContainersOpen(allContainerIds(), true),
      closeAllContainers: () => setContainers(closeAllPlan(data.containers)),
      getContainerState: containerState,
    };
    if (apiRef) apiRef.current = containerApi;

    // Opening or closing a container changes the size of everything around
    // it. Re-run the layout, keep each top-level container's label where it
    // is, and move members to their new places.
    function relayoutContainers() {
      if (!data.containers || data.containers.length === 0) return;
      const anchors = new Map(CL.roots.map((r) => [r, rootOffset(r)]));
      // An anchored container keeps its anchor as its centre, or, once the
      // reader has dragged it, its centre where it is.
      const centres = new Map();
      if (anchorsOn()) {
        const targets = anchorTargets();
        for (const cId of ANCHORS.keys()) {
          const c = isDetached(cId) ? centreOf(cId) : (targets.get(cId) || centreOf(cId));
          if (c) centres.set(cId, c);
        }
      }
      updateMacroBounds();
      computeContainerLayout();
      refreshContainerForces();
      if (!spiralOn()) return;
      const moves = [];
      for (const [id, p] of CL.nodes) {
        const n = nodeBySlug.get(id);
        const a = anchoredOf.get(id);
        if (!n || !Number.isFinite(n.x) || !a || !centres.has(a)) continue;
        const c = centres.get(a), info = CL.containers.get(a);
        // Not laid out (inside a closed container): nothing to move to.
        if (!info) continue;
        moves.push({ n, x0: n.x, y0: n.y, x1: c.x - info.center.x + p.x, y1: c.y - info.center.y + p.y });
      }
      if (!hasSettled && !moves.length) { simulation.alpha(Math.max(simulation.alpha(), 0.3)).restart(); return; }
      for (const [id, p] of CL.nodes) {
        const n = nodeBySlug.get(id);
        const off = anchors.get(p.root);
        const a = anchoredOf.get(id);
        if (a && centres.has(a)) continue;
        if (!n || !off || !Number.isFinite(n.x)) continue;
        moves.push({ n, x0: n.x, y0: n.y, x1: off.x + p.x, y1: off.y + p.y });
      }
      // Named, so a newer relayout replaces one still running, and neither
      // interrupts the layout-switch transition.
      d3.transition('container-relayout').duration(600).ease(d3.easeCubicInOut)
        .tween('container-relayout', () => (t) => {
          for (const m of moves) {
            m.n.x = m.x0 + (m.x1 - m.x0) * t;
            m.n.y = m.y0 + (m.y1 - m.y0) * t;
            m.n.fx = m.n.x; m.n.fy = m.n.y;
          }
          applyPositions();
          if (connectorUpdateRef.current) connectorUpdateRef.current();
        })
        .on('end', () => { if (!userMovedView) fitToViewport({ animate: true }); });
    }

    // Half the size a card is drawn at right now, so an edge ends at its edge
    // whether it is a full card or, zoomed far out, a marker.
    function drawnHalf(n) {
      const hovered = hoveredIdRef.current === n.id;
      const pinned = pinnedIdsRef.current.has(n.id);
      const lod = getLOD(zoomScaleRef.current);
      if (lod === 'marker' && !hovered && !pinned) return { w: 8, h: 8 };
      const size = n._size || cardSizeFor({ hovered, pinned, lod });
      const s = n._cardScale || 1;
      return { w: (size.width / 2) * s, h: (size.height / 2) * s };
    }

    function linkEndpoints(l) {
      let sx = typeof l.source === 'object' ? l.source.x : 0;
      let sy = typeof l.source === 'object' ? l.source.y : 0;
      let tx = typeof l.target === 'object' ? l.target.x : 0;
      let ty = typeof l.target === 'object' ? l.target.y : 0;

      const sid = typeof l.source === 'object' ? l.source.id : l.source;
      const tid = typeof l.target === 'object' ? l.target.id : l.target;

      // An edge touching a closed container's member is not drawn at all.
      if (edgeHidden(l, closedHidden)) return { x1: 0, y1: 0, x2: 0, y2: 0, hidden: true };

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

      const srcHalf = drawnHalf(l.source);
      const srcW = srcClosed ? 90 : srcHalf.w + 4;
      const srcH = srcClosed ? 45 : srcHalf.h + 4;
      const rSrc = Math.min(
        Math.abs(cos) > 1e-4 ? srcW / Math.abs(cos) : Infinity,
        Math.abs(sin) > 1e-4 ? srcH / Math.abs(sin) : Infinity
      );

      const tgtHalf = drawnHalf(l.target);
      const tgtW = tgtClosed ? 90 : tgtHalf.w + 4;
      const tgtH = tgtClosed ? 45 : tgtHalf.h + 4;
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

    // A hidden edge has no geometry at all. It used to be "M 0 0": a path of
    // one point at the graph's origin, which still drew its arrowhead there.
    // With the whole book closed, all 25 next-chapter arrowheads stacked on
    // that point, a small orange mark north-west of the closed book. An empty
    // path draws nothing, markers included, whatever its display says.
    function linkPath(l, ep) {
      if (ep.hidden) return '';
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

      // A gentle bend, toward the right of travel: consecutive chapters on a
      // clockwise path then bow the way the path itself turns.
      const bend = Math.min(48, dist * 0.12);

      const cx = mx + nx * bend;
      const cy = my + ny * bend;

      return `M ${ep.x1} ${ep.y1} Q ${cx} ${cy} ${ep.x2} ${ep.y2}`;
    }

    // Every drawn edge shows its direction with a small arrowhead in its own
    // color, and says what it is on hover or tap. One marker per color.
    const arrowIds = new Map();
    function arrowFor(color) {
      if (!arrowIds.has(color)) {
        const id = 'edge-arrow-' + arrowIds.size;
        defs.append('marker')
          .attr('id', id)
          .attr('viewBox', '0 0 10 10')
          .attr('refX', 9)
          .attr('refY', 5)
          .attr('markerUnits', 'userSpaceOnUse')
          .attr('markerWidth', 13)
          .attr('markerHeight', 13)
          .attr('orient', 'auto')
          .append('path')
          .attr('d', 'M 0 1 L 10 5 L 0 9 z')
          .style('fill', color)
          .style('fill-opacity', 0.75);
        arrowIds.set(color, id);
      }
      return arrowIds.get(color);
    }
    const linkColor = (d) => {
      if (d.layer !== 'sequence') return '#8a8f9c';
      const sid = typeof d.source === 'object' ? d.source.id : d.source;
      const sn = nodeBySlug.get(sid);
      return sn?.containerColor || 'var(--gv-accent, #d4af37)';
    };

    // The hit area sits under the containers layer, so a container's title
    // always wins a tap over an edge passing near it; cards are above both.
    const linkHits = g.insert('g', '.containers-layer')
      .attr('class', 'link-hits')
      .selectAll('.link-hit')
      .data(data.links)
      .enter().append('path')
      .attr('class', 'link-hit')
      .attr('fill', 'none')
      .style('stroke', 'transparent')
      .style('stroke-width', '16px')
      .style('pointer-events', 'stroke')
      .style('cursor', 'default');

    // Render links (the moving bead on a sequence edge is drawn separately)
    const links = g.selectAll('.link')
      .data(data.links)
      .enter().append('path')
      .attr('class', (d) => [
        'link',
        d.layer ? `link-${d.layer}` : '',
        d.role ? `link-role-${d.role}` : '',
      ].filter(Boolean).join(' '))
      .attr('fill', 'none')
      .attr('data-label', (d) => d.label)
      .attr('marker-end', (d) => (d.directed ? `url(#${arrowFor(linkColor(d))})` : null))
      .style('stroke', (d) => (d.layer !== 'sequence' ? null : linkColor(d)))
      .style('stroke-opacity', (d) => (d.layer === 'sequence' ? 0.45 : null));

    // The readers' layer (see Readers below): over the book's edges, under
    // the cards.
    const readersLayer = g.append('g').attr('class', 'readers-layer').style('display', 'none');

    // The sketchbook theme's second pencil pass along each edge.
    const linkGhosts = g.selectAll('.link-ghost')
      .data(data.links)
      .enter().insert('path', '.link-sequence-pulse')
      .attr('class', 'link-ghost')
      .style('stroke', (d) => linkColor(d));
    const ghostKey = (l) => `${endId(l.source)}>${endId(l.target)}`;
    function redrawGhosts() {
      linkGhosts.attr('d', (l) => (sketchOn && l._path ? ghostOf(l._path, ghostKey(l)) : ''));
    }

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

    // An edge's label: shown while the pointer is on the edge, or for a few
    // seconds after a tap. The same size on screen at any zoom.
    const edgeLabel = g.append('g')
      .attr('class', 'edge-label')
      .style('pointer-events', 'none')
      .style('display', 'none');
    const edgeLabelBg = edgeLabel.append('rect')
      .attr('fill', 'rgba(15, 17, 26, 0.88)')
      .attr('stroke-opacity', 0.6);
    const edgeLabelText = edgeLabel.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-family', "'Atkinson', sans-serif")
      .attr('font-weight', 600)
      .attr('letter-spacing', '0.04em');
    let edgeLabelFor = null;
    let edgeLabelEl = null;
    let edgeLabelTimer = null;
    function placeEdgeLabel() {
      if (!edgeLabelFor || !edgeLabelEl) return;
      const len = edgeLabelEl.getTotalLength ? edgeLabelEl.getTotalLength() : 0;
      if (!len) { edgeLabel.style('display', 'none'); return; }
      const p = edgeLabelEl.getPointAtLength(len / 2);
      const k = zoomScaleRef.current || 1;
      const fs = 13 / k;
      const color = linkColor(edgeLabelFor);
      edgeLabelText.attr('font-size', fs).style('fill', color).text(edgeLabelFor.label);
      const w = (edgeLabelFor.label.length * 0.62 + 1.4) * fs;
      const h = fs * 1.7;
      edgeLabelBg.attr('x', -w / 2).attr('y', -h / 2).attr('width', w).attr('height', h)
        .attr('rx', h / 2).style('stroke', color).attr('stroke-width', 1 / k);
      edgeLabel.attr('transform', `translate(${p.x}, ${p.y})${upright()}`).style('display', null);
    }
    function showEdgeLabel(l, el) {
      clearTimeout(edgeLabelTimer);
      edgeLabelTimer = null;
      edgeLabelFor = l;
      edgeLabelEl = el;
      placeEdgeLabel();
    }
    function hideEdgeLabel() {
      clearTimeout(edgeLabelTimer);
      edgeLabelTimer = null;
      edgeLabelFor = null;
      edgeLabelEl = null;
      edgeLabel.style('display', 'none');
    }
    linkHits
      .on('mouseenter', function (event, l) { showEdgeLabel(l, this); })
      .on('mouseleave', () => { if (!edgeLabelTimer) hideEdgeLabel(); })
      .on('click', function (event, l) {
        // A tap names the edge; it does not count as a tap on the canvas.
        event.stopPropagation();
        const el = this;
        tapOrDouble(event, () => {
          showEdgeLabel(l, el);
          edgeLabelTimer = setTimeout(() => { edgeLabelTimer = null; hideEdgeLabel(); }, 2500);
        });
      });


    const nodes = g.selectAll('.node')
      .data(data.nodes)
      .enter().append('g')
      .attr('class', 'node');

    const dragHandler = d3.drag().clickDistance(5)
        // Pointer positions in graph coordinates, through the view as drawn
        // (zoom and rotation), for the HTML cards as much as the svg nodes.
        .container(() => g.node())
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
          d._dragFrom = { x: event.x, y: event.y };
          d._dragMoved = false;

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
          // Under the click distance a press is a tap, not a drag: nothing
          // moves and nothing is written, or the write re-renders the card
          // mid-click and WebKit never delivers the click.
          if (!d._dragMoved) {
            const from = d._dragFrom || { x: event.x, y: event.y };
            if (Math.hypot(event.x - from.x, event.y - from.y) < 5) return;
            d._dragMoved = true;
          }
          d.x = event.x; d.y = event.y;
          d.fx = event.x; d.fy = event.y;
          if (viewStateRef.current) {
            viewStateRef.current.setNodePosition(persistKey(d), event.x, event.y, { transient: true });
          }
          nodes.filter(nd => nd.id === d.id)
            .attr('transform', 'translate(' + event.x + ',' + event.y + ')' + upright());
          if (articleNodes) {
            articleNodes.filter(nd => nd.id === d.id)
              .style('transform', `translate3d(${event.x}px, ${event.y}px, 0px) rotate(var(--gv-unrot, 0deg))${d._cardScale && d._cardScale !== 1 ? ` scale(${d._cardScale})` : ''}`);
          }
          if (connectorUpdateRef.current) connectorUpdateRef.current();
          links.each(function(l) {
            const sid = typeof l.source === 'object' ? l.source.id : l.source;
            const tid = typeof l.target === 'object' ? l.target.id : l.target;
            if (sid === d.id || tid === d.id) {
              l._path = linkPath(l, linkEndpoints(l));
              d3.select(this).attr('d', l._path);
            }
          });
          linkHits.attr('d', (l) => l._path || '');
          redrawGhosts();
          hideEdgeLabel();
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
          if (!d._dragMoved) return;
          anchorsAuto = false;
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
      // No browser double-tap zoom on a card: two taps open the reader.
      .style('touch-action', 'manipulation')
      .call(dragHandler);
      
    articleNodes = articleNodes.merge(articleNodesEnter);

    // A link node is a link for the keyboard too: it takes focus, and Enter
    // follows it.
    articleNodesEnter.filter(d => !!d.link)
      .attr('tabindex', 0)
      .attr('role', 'link')
      .attr('data-link-node', '')
      .attr('aria-label', d => [d.title, d.subtitle, d.description].filter(Boolean).join('. '))
      .on('keydown', (event, d) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        event.stopPropagation();
        followLink(d.originalItem || d, { settings: settingsForLinks() });
      });

    articleNodesEnter.each(function(d) {
      const root = createRoot(this);
      reactRoots.set(d.id, { root, wrapper: this, cardSelection: d3.select(this) });
    });

    // How many contributions each card carries, by its slug; recounted only
    // when the list changes.
    let countsOf = null;
    let counts = new Map();
    function contributionCountsFor() {
      if (countsOf !== contributionsRef.current) {
        countsOf = contributionsRef.current;
        counts = countsByChapter(countsOf);
      }
      return counts;
    }

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
      const vs = viewStateRef.current;
      const bms = vs ? vs.bookmarks(persistKey(d)) : [];
      // How far this viewer has read it (graph.readingProgress, default on).
      const progress = GS.readingProgress !== false && vs && vs.readingProgress
        ? vs.readingProgress(persistKey(d)) : null;
      const contributionCount = contributionCountsFor().get(d.id) || 0;
      entry.root.render(
        React.createElement(Lens, {
          article: d,
          width: w,
          height: h,
          viewState: {
            hovered,
            pinned,
            lod,
            zoomScale: zoomScaleRef.current,
            bookmarks: bms,
            bookmarkCount: bms.length,
            progress,
            contributionCount,
          },
          fullContent: d._fullContent || null,
          cardSettings: CARD,
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
    renderAllArticleBodiesRef.current = renderAllArticleBodies;

    // Article-content fetch cache. Keyed by node id. Value is the body HTML
    // (with <h1> removed) or null on fetch failure.
    const articleContentCache = new Map();
    function loadFullContent(d) {
      // A title-only item has no page to fetch, by design.
      if ((d.originalItem && d.originalItem._posted) === 'title') {
        d._fullContent = null;
        return Promise.resolve();
      }
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
          // The page's own rights footer is fixed to its window; inside a
          // card it drew outside the card. The page shows the line once.
          doc.querySelectorAll('.pp-rights').forEach((el) => el.remove());
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
        // The browser's own double-click (selecting a word) is not wanted.
        event.stopPropagation();
        event.preventDefault();
        if (d.link) return; // a link node has no reader
        // Usually the two clicks have already been read as a double-tap and
        // opened the reader. A double-click that arrives on its own (from
        // assistive technology, or a browser that sends one for a
        // double-tap) opens it too, once.
        if (Date.now() - lastCardDouble < 300) return;
        const t = event.target;
        if (t && (t.dataset?.popout === '1' || t.closest?.('[data-popout="1"]'))) return;
        tapGate.cancel();
        readCard(d);
      })
      .on('click', (event, d) => {
        // A link node: a tap anywhere on it, its ↗ included, follows its
        // link. It never pins and the reader never opens for it.
        if (d.link) {
          event.stopPropagation();
          tapGate.cancel();
          followLink(d.originalItem || d, { settings: settingsForLinks() });
          return;
        }
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
        // A tap opens or closes the node once it is clear no second tap is
        // coming. Two taps anywhere on the card, its title included, open the
        // reader for it and leave the card as it was; they do not zoom.
        const cardEl = event.currentTarget;
        tapOrDouble(event, () => togglePinned(d, cardEl), () => readCard(d));
      });

    let lastCardDouble = 0;
    function readCard(d) {
      lastCardDouble = Date.now();
      if (onNodeSelectRef.current) onNodeSelectRef.current(d.originalItem || d);
    }

    function togglePinned(d, cardEl) {
      // Any number of nodes can be open at once. Opening one never closes
      // another: text you have open stays open until you close that node.
      if (pinnedIdsRef.current.has(d.id)) {
        pinnedIdsRef.current.delete(d.id);
        if (viewStateRef.current) viewStateRef.current.setNodePinned(persistKey(d), false);
        renderArticleBody(d);
        cardEl.style.zIndex = '';
        if (focusedIdRef.current === d.id) focusNode(null);
      } else {
        pinnedIdsRef.current.add(d.id);
        focusNode(d);
        if (viewStateRef.current) viewStateRef.current.setNodePinned(persistKey(d), true);
        renderArticleBody(d);
        nodes.filter(nd => nd.id === d.id).raise();
        articleNodes.filter(nd => nd.id === d.id).raise();
        cardEl.style.zIndex = 10;
        // Fetch full article body so the pinned node becomes a mini-reader.
        // Re-render when content arrives, but only if this node is still
        // open (user might have closed it in the meantime).
        loadFullContent(d).then(() => {
          if (pinnedIdsRef.current.has(d.id)) renderArticleBody(d);
        });
      }
    }

    // Bubble click (tag, topology, or placeholder): highlight only — no
    // rearrangement, no simulation restart.
    let activeTag = null;
    nodes.filter(d => d.type !== 'article')
      .on('click', (event, d) => {
        event.stopPropagation();
        tapOrDouble(event, () => toggleTagHighlight(d));
      });
    function toggleTagHighlight(d) {
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
    }

    svg.on('click', (event) => tapOrDouble(event, () => {
      hideEdgeLabel();
      if (activeTag) {
        activeTag = null;
        nodes.classed('dimmed', false).classed('tag-active', false);
        articleNodes.classed('dimmed', false);
        links.classed('highlighted', false);
      }
      if (onNodeSelectRef.current) onNodeSelectRef.current(null);
    }));

    // Simulation tick → position nodes. When alpha falls below alphaMin,
    // D3 stops automatically. We never call .restart() anywhere — once
    // settled, the graph stays still until the page is reloaded.
    // Painting positions is separate from the simulation advancing them.
    // Node transforms used to be written only inside the tick handler, which
    // silently assumed a tick would always happen. It does not: d3-timer runs
    // on requestAnimationFrame, and a page in a hidden tab or a collapsed pane
    // gets no frames at all. A reader whose whole arrangement is already saved
    // needs no simulation — and would have got a graph stacked at the origin.
    function redrawLinks() {
      links.each(function(l) {
        l._path = linkPath(l, linkEndpoints(l));
        d3.select(this).attr('d', l._path);
      });
      linkHits.attr('d', (l) => l._path || '');
      sequencePulses.attr('d', (l) => l._path || '');
      redrawGhosts();
      if (edgeLabelFor) placeEdgeLabel();
    }
    function applyPositions() {
      redrawLinks();
      nodes.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')' + upright());
      if (articleNodes) {
        articleNodes.style('transform', d => `translate3d(${d.x}px, ${d.y}px, 0px) rotate(var(--gv-unrot, 0deg))${d._cardScale && d._cardScale !== 1 ? ` scale(${d._cardScale})` : ''}`);
      }
      updateContainers();
      if (rootsUpdateRef.current) rootsUpdateRef.current();
      if (readersUpdateRef.current) readersUpdateRef.current();
    }
    // ── Readers ───────────────────────────────────────────────────────────
    // Connections readers drew between chapters: a layer of its own, dashed
    // and in its own colour so it never passes for one of the book's edges,
    // drawn only while the readers dimension is on. Each says what it is,
    // and whose, on hover.
    function readersOn() {
      const vs = viewStateRef.current;
      return !!(vs && vs.preference && vs.preference('readers') === true);
    }
    let readersList = [];
    function buildReaders() {
      readersLayer.selectAll('*').remove();
      readersList = connectionEdges(contributionsRef.current).map((e) => {
        const src = nodeBySlug.get(e.source);
        const tgt = nodeBySlug.get(e.target);
        if (!src || !tgt) return null;
        const el = readersLayer.append('g').attr('class', 'readers-edge').attr('data-readers-edge', e.id);
        el.append('title').text(`From a reader, ${e.author}: ${e.label}`);
        return {
          ...e,
          l: { source: src, target: tgt, layer: 'contribution' },
          el,
          line: el.append('path').attr('class', 'readers-line link-contribution').attr('fill', 'none').attr('data-label', e.label),
        };
      }).filter(Boolean);
    }
    function paintReaders({ rebuild = false } = {}) {
      if (rebuild) buildReaders();
      const on = readersOn();
      readersLayer.style('display', on && readersList.length ? null : 'none').attr('data-on', on ? 'true' : 'false');
      if (!on) return;
      for (const r of readersList) {
        const ep = linkEndpoints(r.l);
        const d = ep.hidden ? '' : `M ${ep.x1} ${ep.y1} L ${ep.x2} ${ep.y2}`;
        r.line.attr('d', d);
      }
    }
    readersUpdateRef.current = paintReaders;
    buildReaders();

    // ── Roots ─────────────────────────────────────────────────────────────
    // graph.roots (default off): thin branching roots grow along the reading
    // path, from the book's title to each act's, to each first chapter and
    // on from chapter to chapter. A root reaching a chapter draws in once
    // this reader opens it, and thickens and brightens once they finish it,
    // so their reading becomes a root system. Seeded per book, so the same
    // book grows the same roots. One small group per root, under the hulls.
    const ROOTS = GS.roots ? (GS.roots === true ? {} : GS.roots) : null;
    let rootsList = [];
    let rootsFrame = null;
    let rootsPainted = false;
    if (ROOTS) {
      const memberOf = new Map();
      for (const [cId, members] of containerMembers) for (const slug of members) memberOf.set(slug, cId);
      const seq = data.links.filter((l) => l.layer === 'sequence').map((l) => ({ source: endId(l.source), target: endId(l.target) }));
      const top = (data.containers || []).find((c) => !c.parent);
      const seed = String(ROOTS.seed || (top && top.id) || 'roots');
      rootsList = rootSegments({ containers: data.containers || [], memberOf, sequence: seq }).map((seg) => {
        const el = rootsLayer.append('g').attr('class', 'root').attr('data-root', seg.key).style('display', 'none');
        return {
          ...seg,
          shape: rootShape(seed + '|' + seg.key),
          el,
          main: el.append('path').attr('class', 'root-main').attr('fill', 'none').attr('vector-effect', 'non-scaling-stroke'),
          fine: el.append('path').attr('class', 'root-fine').attr('fill', 'none').attr('vector-effect', 'non-scaling-stroke'),
          state: 'hidden',
        };
      });
    }
    function rootEnd(end) {
      if (end.node) {
        const n = nodeBySlug.get(end.node);
        if (!n || !Number.isFinite(n.x) || closedHidden.has(n.id)) return null;
        if (n._source && hiddenSourcesRef.current.has(n._source.id)) return null;
        return { x: n.x, y: n.y };
      }
      return containerAnchor.get(end.container) || null;
    }
    // Opened (seen) and finished (done), for a chapter or, for a container,
    // any of its chapters opened and all of them finished.
    function reachState(reach) {
      const vs = viewStateRef.current;
      if (!vs || !vs.readingProgress) return 'hidden';
      const of = (slug) => { const n = nodeBySlug.get(slug); return n ? vs.readingProgress(persistKey(n)) : { seen: false, done: false }; };
      if (reach.node) {
        const p = of(reach.node);
        return p.done ? 'done' : (p.seen || p.max > 0) ? 'seen' : 'hidden';
      }
      const ps = getAllMemberSlugs(reach.container).map(of);
      if (!ps.length || !ps.some((p) => p.seen || p.max > 0)) return 'hidden';
      return ps.every((p) => p.done) ? 'done' : 'seen';
    }
    function paintRoots() {
      rootsFrame = null;
      if (!rootsList.length) return;
      for (const r of rootsList) {
        const state = reachState(r.reach);
        const a = rootEnd(r.from), b = rootEnd(r.to);
        if (state === 'hidden' || !a || !b) {
          r.el.style('display', 'none');
          if (state === 'hidden') r.state = 'hidden';
          continue;
        }
        const d = rootPath(a, b, r.shape);
        r.main.attr('d', d.main);
        r.fine.attr('d', d.fine);
        r.el.style('display', null).attr('data-state', state);
        // A root this reader has just reached draws in; one already there
        // when the page opened is simply there.
        if (r.state === 'hidden' && rootsPainted) {
          for (const p of [r.main, r.fine]) {
            p.attr('pathLength', 1).style('stroke-dasharray', '1 1').style('stroke-dashoffset', 1).style('transition', 'none');
            const node = p.node();
            if (node) node.getBoundingClientRect();
            p.style('transition', 'stroke-dashoffset 1.8s ease-out').style('stroke-dashoffset', 0);
          }
          setTimeout(() => {
            for (const p of [r.main, r.fine]) p.attr('pathLength', null).style('stroke-dasharray', null).style('stroke-dashoffset', null).style('transition', null);
          }, 1900);
        }
        r.state = state;
      }
      rootsPainted = true;
    }
    function scheduleRoots() {
      if (!rootsList.length || rootsFrame) return;
      rootsFrame = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame(paintRoots) : setTimeout(paintRoots, 16);
    }
    rootsUpdateRef.current = ROOTS ? scheduleRoots : null;

    let hasFitted = false;
    graphRef.current = { data, nodes, articleNodes, links, applyPositions, svg, zoom, fitToViewport, simulation, axisLayer, g, updateContainers, ringTargets, recomputeContainers, toScreen };
    positionsReady = true;

    // The cover says where its art sits in the graph state (and again when
    // that changes): a fresh layout puts the anchored containers on their
    // anchors, and the view rests at the home view until the reader moves it.
    function onCoverFrame() {
      coverFrame = (typeof window !== 'undefined' && window.PostPipeCoverFrame) || null;
      if (!anchorsOn()) return;
      // The anchors say where things are; centring the whole on the frame
      // would only drag whatever is not pinned away after the pinned mass.
      simulation.force('center', null);
      const pinned = [...ANCHORS.keys()].filter((cId) => anchorsPending.has(cId) || !isDetached(cId));
      // Where the crown falls against each anchor depends on the frame, so
      // a spiral kept below it is laid out again, and the pinned ones take
      // the new arrangement before they go onto their anchors.
      if (keepBelowUsed()) {
        computeContainerLayout();
        refreshContainerForces();
        for (const cId of pinned) snapToLayout(cId);
      }
      const dropped = placeDrops();
      if (pinned.length) placeAnchors(pinned);
      if (pinned.length || dropped) applyPositions();
      if (!userMovedView) applyHomeView(false);
    }
    window.addEventListener('postpipe:cover-frame', onCoverFrame);
    onCoverFrame();

    // The axis is measured against the corpus extent, which keeps changing
    // while the simulation runs — so drawing it once at the start pins it to
    // whatever the first frame happened to look like. Redrawn on a throttle
    // during the settle and once more at the end.
    // Open cards are larger than the closed ones a layout spaces for, and a
    // stored arrangement can put two of them on top of each other. Until the
    // first layout has settled, overlapping open cards are nudged apart; the
    // closed nodes are not moved. After that a reader's own arrangement is
    // left as they make it.
    let openNudgeDone = false;
    const nodeByIdForNudge = new Map(data.nodes.map((d) => [d.id, d]));
    function nudgeOpenCards() {
      if (openNudgeDone || layoutRef.current !== 'force') return false;
      const rects = [];
      for (const d of data.nodes) {
        if (d.type !== 'article' || !pinnedIdsRef.current.has(d.id) || d._closedHidden) continue;
        if (!Number.isFinite(d.x) || !Number.isFinite(d.y)) continue;
        const size = d._size || cardSizeFor({ hovered: false, pinned: true });
        const s = d._cardScale || 1;
        rects.push({ id: d.id, x: d.x, y: d.y, w: size.width * s, h: size.height * s });
      }
      if (rects.length < 2) return false;
      const moved = separateOpen(rects, { gap: 12 });
      for (const [id, p] of moved) {
        const d = nodeByIdForNudge.get(id);
        if (!d) continue;
        d.x = p.x; d.y = p.y; d.vx = 0; d.vy = 0;
        if (d.fx != null) d.fx = p.x;
        if (d.fy != null) d.fy = p.y;
      }
      return moved.size > 0;
    }

    let tickCount = 0;
    simulation.nodes(data.nodes).on('tick', () => {
      nudgeOpenCards();
      applyPositions();
      if (!hasFitted) hasFitted = fitToViewport({ initialZoomOut: true });
      if (connectorUpdateRef.current) connectorUpdateRef.current();
      ++tickCount;
      if (redrawAxisRef.current && tickCount % 25 === 0) redrawAxisRef.current();
    });
    simulation.force('link').links(data.links);

    // Paint once now, from whatever positions were restored or seeded, so the
    // first frame is correct with or without the simulation ever running.
    nudgeOpenCards();
    if (!hasFitted) hasFitted = fitToViewport({ initialZoomOut: true });
    applyPositions();

    // When the simulation ends, freeze every node by copying x/y to fx/fy.
    // Any later interaction (drag, etc.) keeps positions stable.
    // Frame the whole graph once it has settled, but only when the reader has
    // not arranged it themselves. Giving every node its true footprint spreads
    // looking for is not an improvement on one that overlaps.
    // With containers laid out, the frame is the containers themselves —
    // every label and every hull — rather than a trimmed core of nodes.
    function containerExtent() {
      if (!spiralOn() || CL.roots.length === 0) return null;
      const rects = [];
      // Anchored containers sit where they were put, each on its own frame.
      const anchoredOn = anchorsOn();
      if (anchoredOn) {
        for (const cId of ANCHORS.keys()) {
          const info = CL.containers.get(cId);
          const off = info && containerOffset(cId);
          if (!off || hasClosedAncestor(containerById.get(cId))) continue;
          rects.push({ x0: off.x + info.box.x0, y0: off.y + info.box.y0, x1: off.x + info.box.x1, y1: off.y + info.box.y1 });
        }
      }
      for (const rootId of CL.roots) {
        const info = CL.containers.get(rootId);
        const off = rootOffset(rootId);
        if (!info || !off) continue;
        if (anchoredOn && getAllMemberSlugs(rootId).every((s) => anchoredOf.has(s))) continue;
        if (getAllMemberSlugs(rootId).every((s) => hiddenSourcesRef.current.has(nodeBySlug.get(s)?._source?.id))) continue;
        rects.push({ x0: off.x + info.box.x0, y0: off.y + info.box.y0, x1: off.x + info.box.x1, y1: off.y + info.box.y1 });
      }
      for (const d of data.nodes) {
        if (d.type !== 'article' || CL.nodes.has(d.id) || !Number.isFinite(d.x)) continue;
        if (d._source && hiddenSourcesRef.current.has(d._source.id)) continue;
        const w = (d._size?.width || CARD.width) / 2, h = (d._size?.height || CARD.height) / 2;
        rects.push({ x0: d.x - w, y0: d.y - h, x1: d.x + w, y1: d.y + h });
      }
      if (!rects.length) return null;
      return {
        x0: Math.min(...rects.map((r) => r.x0)), y0: Math.min(...rects.map((r) => r.y0)),
        x1: Math.max(...rects.map((r) => r.x1)), y1: Math.max(...rects.map((r) => r.y1)),
      };
    }

    // The first screen: settings.graph.initialFocus is 'all' (everything) or a
    // container id. A container is framed at a scale where its cards are still
    // cards (initialFocusMinScale); if the whole top-level container it sits
    // in fits at that scale too, that is framed instead. Once the reader asks
    // for Zoom to Fit, or pans or zooms, the automatic framing stops focusing.
    function focusFrame() {
      if (!focusActive || !spiralOn()) return null;
      const id = GS.initialFocus;
      const info = CL.containers.get(id);
      const c = containerById.get(id);
      if (!info || !c || closedContainers.has(id) || hasClosedAncestor(c)) return null;
      const off = containerOffset(id);
      if (!off) return null;
      const box = { x0: off.x + info.box.x0, y0: off.y + info.box.y0, x1: off.x + info.box.x1, y1: off.y + info.box.y1 };
      const rootInfo = CL.containers.get(info.root);
      const rootOff = rootInfo && rootOffset(info.root);
      const root = rootOff
        ? { x0: rootOff.x + rootInfo.box.x0, y0: rootOff.y + rootInfo.box.y0, x1: rootOff.x + rootInfo.box.x1, y1: rootOff.y + rootInfo.box.y1 }
        : null;
      // The layout says where the cards belong; a reader may have left some
      // elsewhere (and open ones are larger). The frame takes in where they
      // actually are too.
      const withCards = (r, cId) => {
        if (!r) return r;
        const out = { ...r };
        for (const slug of getAllMemberSlugs(cId)) {
          const d = nodeBySlug.get(slug);
          if (!d || d.type !== 'article' || d._closedHidden || !Number.isFinite(d.x) || !Number.isFinite(d.y)) continue;
          const size = d._size || cardSizeFor({ hovered: false, pinned: pinnedIdsRef.current.has(d.id) });
          const s = d._cardScale || 1;
          const hw = (size.width / 2) * s, hh = (size.height / 2) * s;
          out.x0 = Math.min(out.x0, d.x - hw); out.x1 = Math.max(out.x1, d.x + hw);
          out.y0 = Math.min(out.y0, d.y - hh); out.y1 = Math.max(out.y1, d.y + hh);
        }
        return out;
      };
      return { box: withCards(box, id), root: withCards(root, info.root) };
    }

    // How much of the graph's top and bottom the page's own fixed controls
    // cover, measured where they are drawn: the source pills and the settings
    // gear above (data-feeds, data-settings-gear), the rights line and the
    // toolbar below (data-rights, data-toolbar). A frame keeps clear of them,
    // so on the first screen they cover nothing.
    function chromeInsets(h) {
      const none = { top: 0, bottom: 0 };
      if (typeof document === 'undefined' || !containerRef.current) return none;
      const box = containerRef.current.getBoundingClientRect();
      let top = 0, bottom = 0;
      for (const el of document.querySelectorAll('[data-feeds], [data-settings-gear], [data-rights], [data-toolbar]')) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (r.top >= box.top + h / 2) bottom = Math.max(bottom, box.top + h - r.top);
        else if (r.bottom <= box.top + h / 2) top = Math.max(top, r.bottom - box.top);
      }
      return { top: Math.max(0, Math.min(h / 4, top)), bottom: Math.max(0, Math.min(h / 3, bottom)) };
    }

    // The view the graph state rests at, and returns to: with anchors the
    // home view (initialFocusMinScale from the frame's corner, so each
    // anchored container sits on its anchor), else the first framing
    // (homeK, declared with the view above).
    function applyHomeView(animate) {
      const v = homeView(HOME_K);
      const transform = d3.zoomIdentity.translate(v.x, v.y).scale(v.k);
      homeK = v.k;
      resetRotation({ repaint: false });
      if (animate) svg.transition().duration(750).call(zoom.transform, transform);
      else svg.call(zoom.transform, transform);
      publishWorld();
      return true;
    }

    function fitToViewport({ animate = false, initialZoomOut = false, focus = true } = {}) {
      if (focus && anchorsOn()) return applyHomeView(animate);
      const fitted = fitTo({ animate, initialZoomOut, focus });
      if (fitted && focus) { homeK = fitted; publishWorld(); }
      return Boolean(fitted);
    }

    function fitTo({ animate = false, initialZoomOut = false, focus = true } = {}) {
      const ext = containerExtent();
      if (ext) {
        let w = containerRef.current ? containerRef.current.clientWidth : window.innerWidth;
        let h = containerRef.current ? containerRef.current.clientHeight : window.innerHeight;
        if (w < 50 || h < 50) return false;
        const inset = chromeInsets(h);
        h -= inset.top + inset.bottom;
        const margin = 24;
        const fitScale = (r) => Math.min((w - margin * 2) / Math.max(r.x1 - r.x0, 1), (h - margin * 2) / Math.max(r.y1 - r.y0, 1), 1);
        const ff = focus ? focusFrame() : null;
        let frame = ext;
        let k = fitScale(ext);
        let topAligned = false;
        if (ff) {
          k = fitScale(ff.box);
          frame = ff.box;
          if (ff.root && fitScale(ff.root) >= Math.min(k, FOCUS_MIN_SCALE)) {
            frame = ff.root;
            k = fitScale(ff.root);
          } else if (k < FOCUS_MIN_SCALE) {
            // Too big to fit legibly: keep the cards legible and show the
            // top of the container (its title and first chapters).
            k = FOCUS_MIN_SCALE;
            topAligned = (ff.box.y1 - ff.box.y0) * k > h - margin * 2;
          }
          // Cards at least minCardWidthPx wide: zoomed in that far, the
          // container's top shown when the whole no longer fits.
          if (k < MIN_CARD_K) {
            k = MIN_CARD_K;
            frame = ff.box;
            topAligned = (ff.box.y1 - ff.box.y0) * k > h - margin * 2;
          }
        }
        k = Math.max(k, 0.04);
        const cx = (frame.x0 + frame.x1) / 2;
        const ty = topAligned
          ? Math.max(inset.top + margin, margin + 32) - frame.y0 * k
          : inset.top + h / 2 - ((frame.y0 + frame.y1) / 2) * k;
        const transform = d3.zoomIdentity
          .translate(w / 2 - cx * k, ty)
          .scale(k);
        // A frame is computed upright, so framing brings the view upright.
        resetRotation({ repaint: false });
        if (animate) svg.transition().duration(750).call(zoom.transform, transform);
        else svg.call(zoom.transform, transform);
        return transform.k;
      }
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
      // Kept clear of the page's own fixed controls, as a container frame is.
      const inset = chromeInsets(h);
      const room = Math.max(50, h - inset.top - inset.bottom);
      let k = Math.max(
        Math.min(w / Math.max(maxX - minX, 1), room / Math.max(maxY - minY, 1), 1),
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
      const ty = inset.top + room / 2 - centerY * k;
      const transform = d3.zoomIdentity.translate(tx, ty).scale(k);
      resetRotation({ repaint: false });
      if (animate) {
        svg.transition().duration(750).call(zoom.transform, transform);
      } else {
        svg.call(zoom.transform, transform);
      }
      return transform.k;
    }

    let hasSettled = false;
    // Containers closed from the start (settings.graph.initialCollapsed).
    if (closedContainers.size) { applyClosedDisplay(); updateContainers(); }
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
      if (nudgeOpenCards()) applyPositions();
      openNudgeDone = true;
      data.nodes.forEach(d => { d.fx = d.x; d.fy = d.y; d._forcePos = { x: d.x, y: d.y }; });

      // The layout the simulation settled on is itself an arrangement worth
      // remembering. It becomes the saved layout so a returning reader sees
      // what they left, rather than watching physics happen again. But we
      // only want to save a *good* layout. A simulation starting from an
      // already-saved arrangement barely ticks, and if that arrangement was
      // degenerate (shoved offscreen, over-compressed), saving it here
      // would just lock it in. The reader would never see the fresh fallback
      // layout it would then have to reject.
      // A graph without containers is framed once it has settled too: the
      // first frame was taken before the cards had moved apart.
      if (!userMovedView) fitToViewport({ animate: true });

      if (layoutIsDegenerate(data.nodes, cardSizeFor({ hovered: false, pinned: false }))) return;

      const vs = viewStateRef.current;
      if (vs) {
        // We only want to save positions that were derived from the *current*
        // layout pass, not positions loaded from a prior one. The data-prep
        // phase tags freshly computed force coordinates with `_forcePos` so
        // we can distinguish them here. We explicitly *delete* that flag when
        // a user unpins everything, because the simulation resumes and computes
        // a fresh layout that is now worth saving.
        for (const d of data.nodes) {
          if (!d.pinned && d._forcePos) {
            vs.setNodePosition(placeOf('force') + persistKey(d), d.x, d.y, { silent: true });
          }
        }
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

    // Zoom about the middle of the viewport (src/components/GraphViewer/
    // zoomPivot.js), never re-centring on the graph: what hangs from the
    // cover's art stays over it. The wheel and a pinch zoom about the pointer
    // and the fingers (d3.zoom).
    function zoomAboutCentre(ratio, animate = true) {
      if (!Number.isFinite(ratio) || ratio <= 0) return;
      const t = d3.zoomTransform(svg.node());
      const k = Math.max(0.04, Math.min(8, t.k * ratio));
      const v = zoomAbout(t, k / t.k, width / 2, height / 2);
      const transform = d3.zoomIdentity.translate(v.x, v.y).scale(v.k);
      userMovedView = true;
      focusActive = false;
      if (animate) svg.transition('key-zoom').duration(260).ease(d3.easeCubicOut).call(zoom.transform, transform);
      else svg.call(zoom.transform, transform);
    }
    // Zoom to fit: the whole graph on the screen, zoomed about the middle of
    // the viewport. Falls back to framing the graph when it cannot be fitted
    // from there (it lies across the middle's far side of the screen).
    const handleZoomToFit = () => {
      focusActive = false;
      const ext = containerExtent() || nodeExtent();
      const inset = chromeInsets(height);
      const m = 24;
      const area = { x0: m, y0: inset.top + m, x1: width - m, y1: height - inset.bottom - m };
      if (ext) {
        const corners = [[ext.x0, ext.y0], [ext.x1, ext.y0], [ext.x0, ext.y1], [ext.x1, ext.y1]].map(([x, y]) => toScreen(x, y));
        const box = {
          x0: Math.min(...corners.map((c) => c[0])), x1: Math.max(...corners.map((c) => c[0])),
          y0: Math.min(...corners.map((c) => c[1])), y1: Math.max(...corners.map((c) => c[1])),
        };
        const r = fitRatioAbout(box, width / 2, height / 2, area);
        if (r && r > 0.02) { zoomAboutCentre(r); return; }
      }
      fitToViewport({ animate: true, focus: false });
    };
    function nodeExtent() {
      const pts = data.nodes.filter((d) => !d._closedHidden && Number.isFinite(d.x));
      if (!pts.length) return null;
      return { x0: d3.min(pts, (d) => d.x) - 40, y0: d3.min(pts, (d) => d.y) - 40, x1: d3.max(pts, (d) => d.x) + 40, y1: d3.max(pts, (d) => d.y) + 40 };
    }
    // + and - zoom in and out about the middle of the viewport; not while
    // typing, not with a modifier held (those are the browser's own zoom),
    // and not while the cover's art has the page.
    const handleZoomKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const tEl = e.target;
      if (tEl && (tEl.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(tEl.tagName))) return;
      if (typeof window !== 'undefined' && window.PostPipeCover && window.PostPipeCover.state && window.PostPipeCover.state !== 'graph') return;
      if (document.querySelector('[data-settings-panel]')) return;
      const inKey = e.key === '+' || e.key === '=';
      const outKey = e.key === '-' || e.key === '_';
      if (!inKey && !outKey) return;
      e.preventDefault();
      zoomAboutCentre(inKey ? 1.25 : 0.8);
    };
    window.addEventListener('keydown', handleZoomKey);

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
      resetRotation({ repaint: false });
      data.nodes.forEach(d => {
        d.fx = null;
        d.fy = null;
        delete d._forcePos;
      });
      if (anchorsOn()) { placeAnchors(); applyPositions(); }
      simulation.alpha(0.8).restart();
      fitToViewport({ animate: true });
    };

    // Reset: everything back to the site's defaults in one go: positions,
    // sizes and open cards, the layout, which containers are open, the
    // reader and any highlight, rotation, and the first screen's framing.
    // The positions go through viewState, so Undo can bring them back.
    const handleResetAll = () => {
      const vs = viewStateRef.current;
      if (vs && vs.resetLayout) vs.resetLayout();
      if (onNodeSelectRef.current) onNodeSelectRef.current(null);
      focusNode(null);
      hideEdgeLabel();
      activeTag = null;
      hoveredIdRef.current = null;
      nodes.classed('dimmed', false).classed('tag-active', false);
      articleNodes.classed('dimmed', false).style('z-index', null);
      links.classed('highlighted', false);
      pinnedIdsRef.current.clear();
      data.nodes.forEach((d) => {
        delete d._size; delete d._customWidth; delete d._customHeight; delete d._forcePos;
        d.fx = null; d.fy = null;
      });
      closedContainers.clear();
      for (const id of initiallyClosed()) closedContainers.add(id);
      detachedHere.clear();
      resetRotation({ repaint: false });
      userMovedView = false;
      focusActive = !!GS.initialFocus && GS.initialFocus !== 'all';
      renderAllArticleBodies();
      applyClosedDisplay();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('graph:containers-changed', { detail: containerState() }));
      }
      if (data.containers && data.containers.length && spiralOn()) {
        // Anchored containers back on their anchors first, then laid out
        // again round where they now are.
        if (anchorsOn()) placeAnchors();
        relayoutContainers();
        updateContainers();
        applyPositions();
        fitToViewport({ animate: true });
      } else {
        simulation.alpha(0.8).restart();
        fitToViewport({ animate: true });
      }
    };

    window.addEventListener('graph:reset-all', handleResetAll);
    window.addEventListener('graph:zoom-to-fit', handleZoomToFit);
    window.addEventListener('graph:unpin-all', handleUnpinAll);
    window.addEventListener('graph:reset-sizes', handleResetSizes);
    window.addEventListener('graph:reset-layout', handleResetLayout);
    // The same open/close API, reachable from outside React: the panel and
    // any page script dispatch these. detail.id names one container.
    const containerEvents = {
      'graph:open-container': (e) => containerApi.openContainer(e.detail && e.detail.id),
      'graph:close-container': (e) => containerApi.closeContainer(e.detail && e.detail.id),
      'graph:toggle-container': (e) => containerApi.toggleContainer(e.detail && e.detail.id),
      'graph:open-all-containers': () => containerApi.openAllContainers(),
      'graph:close-all-containers': () => containerApi.closeAllContainers(),
    };
    for (const [name, fn] of Object.entries(containerEvents)) window.addEventListener(name, fn);

    return () => {
      renderAllArticleBodiesRef.current = null;
      rootsUpdateRef.current = null;
      readersUpdateRef.current = null;
      if (rootsFrame && typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(rootsFrame);
      if (themeObserver) themeObserver.disconnect();
      simulation.stop();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('touchstart', onRotateStart, { capture: true });
      container.removeEventListener('touchmove', onRotateMove, { capture: true });
      container.removeEventListener('touchend', onRotateEnd, { capture: true });
      container.removeEventListener('touchcancel', onRotateEnd, { capture: true });
      container.removeEventListener('touchstart', onTwoTapStart, { capture: true });
      container.removeEventListener('touchmove', onTwoTapMove, { capture: true });
      container.removeEventListener('touchend', onTwoTapEnd, { capture: true });
      tapGate.cancel();
      window.removeEventListener('graph:reset-all', handleResetAll);
      window.removeEventListener('postpipe:cover-frame', onCoverFrame);
      if (window.PostPipeGraphWorld && window.PostPipeGraphWorld.snapshot === worldSnapshot) delete window.PostPipeGraphWorld;
      window.removeEventListener('graph:zoom-to-fit', handleZoomToFit);
      window.removeEventListener('keydown', handleZoomKey);
      window.removeEventListener('graph:unpin-all', handleUnpinAll);
      window.removeEventListener('graph:reset-sizes', handleResetSizes);
      window.removeEventListener('graph:reset-layout', handleResetLayout);
      for (const [name, fn] of Object.entries(containerEvents)) window.removeEventListener(name, fn);
      if (apiRef && apiRef.current === containerApi) apiRef.current = null;
      // Unmount React roots BEFORE D3 tears down the SVG — otherwise React
      // would try to reconcile against a detached DOM tree on the next
      // effect run. Defer the unmount so it doesn't fire inside a render.
      reactRoots.forEach(({ root }) => {
        queueMicrotask(() => root.unmount());
      });
      reactRoots.clear();
    };
  }, [feedData, historyTick]);

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
  }, [timeAxis, layout, feedData, historyTick]);

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
        // A node inside a closed container has no connector either.
        line.style('display', node._closedHidden ? 'none' : null);
        const p = g.toScreen ? g.toScreen(node.x, node.y) : t.apply([node.x, node.y]);
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
    if (g.recomputeContainers) g.recomputeContainers();

    // Prefer what the reader arranged in this layout; fall back to computing it.
    // Cluster is not a set of coordinates, it is the simulation. Asking for it
    // used to fall back to "wherever the nodes are right now" whenever the
    // simulation had not settled — so choosing cluster after ring left
    // everything in the ring, which looked like the button doing nothing.
    // If there is no cluster arrangement to return to, run one.
    if (layout === 'force') {
      const placed = g.data.nodes.filter((d) => {
        const saved = vs && vs.nodeState(placeOf('force') + persistKey(d));
        return (saved && !saved.auto) || d._forcePos;
      });
      if (placed.length < g.data.nodes.length * 0.5) {
        g.data.nodes.forEach((d) => {
          const saved = vs && vs.nodeState(placeOf('force') + persistKey(d));
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
          d._forcePos || (vs && vs.nodeState(placeOf('force') + persistKey(d))) || { x: d.x, y: d.y },
        ]))
      : (layout === 'radial' && g.ringTargets && g.ringTargets())
        || computeLayout(layout, g.data.nodes, { cardW: rest.width, cardH: rest.height });
    if (!computed) return;

    const startPositions = new Map(g.data.nodes.map(d => [d.id, { x: d.x, y: d.y }]));

    g.data.nodes.forEach((d) => {
      const saved = vs && vs.nodeState(placeOf(layout) + persistKey(d));
      const target = (saved && typeof saved.x === 'number' && !saved.auto)
        ? { x: saved.x, y: saved.y }
        : computed[d.id];
      if (!target) return;
      d.targetX = target.x;
      d.targetY = target.y;
      d.fx = target.x;
      d.fy = target.y;
      if (vs && !(saved && !saved.auto)) {
        vs.setNodePosition(placeOf(layout) + persistKey(d), target.x, target.y, { silent: true });
      }
    });

    const transitionDuration = 760;
    const transitionEase = d3.easeCubicInOut;

    // Transition a dummy element to drive applyPositions on every frame.
    // D3 transitions on g.nodes and g.articleNodes animate the visual elements,
    // while the tween interpolates the underlying node data (d.x, d.y) and calls
    // g.applyPositions() so edges, rails, pulses, and container hulls follow smoothly.
    d3.transition()
      .duration(transitionDuration)
      .ease(transitionEase)
      .tween('layout-transition', () => {
        const interpolators = g.data.nodes.map(d => {
          const start = startPositions.get(d.id) || { x: d.x, y: d.y };
          const endX = typeof d.targetX === 'number' ? d.targetX : d.x;
          const endY = typeof d.targetY === 'number' ? d.targetY : d.y;
          const ix = d3.interpolateNumber(start.x, endX);
          const iy = d3.interpolateNumber(start.y, endY);
          return (t) => {
            d.x = ix(t);
            d.y = iy(t);
          };
        });

        return (t) => {
          for (let i = 0; i < interpolators.length; i++) {
            interpolators[i](t);
          }
          g.applyPositions();
          if (connectorUpdateRef.current) connectorUpdateRef.current();
        };
      })
      .on('end', () => {
        g.data.nodes.forEach(d => {
          if (typeof d.targetX === 'number') d.x = d.targetX;
          if (typeof d.targetY === 'number') d.y = d.targetY;
          delete d.targetX;
          delete d.targetY;
        });
        g.applyPositions();
        if (connectorUpdateRef.current) connectorUpdateRef.current();
      });

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
      data-graph-root
    />
  );
}
