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

// Zoom-aware level of detail.
const LOD_MARKER = 0.35;
const LOD_TITLE = 0.6;
function getLOD(scale) {
  if (scale < LOD_MARKER) return 'marker';
  if (scale < LOD_TITLE) return 'title';
  return 'full';
}

// Card dimensions per view state. Returned to both GraphViewer and the host wrapper.
function cardSizeFor({ hovered, pinned, lod }) {
  if (pinned) return { width: 230, height: 190 };
  if (hovered) return { width: 200, height: 160 };
  if (lod === 'marker') return { width: 16, height: 16 };
  return { width: 180, height: 140 };
}

export function GraphViewer({ feedData, onNodeSelect, hiddenSources }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const cardsLayerRef = useRef(null);

  // Stable refs for callbacks so the simulation never rebuilds on prop change.
  const onNodeSelectRef = useRef(onNodeSelect);
  useEffect(() => { onNodeSelectRef.current = onNodeSelect; }, [onNodeSelect]);

  // View state lives in refs because it must not trigger React re-renders or
  // re-run the useEffect that owns the simulation.
  const pinnedIdRef = useRef(null);
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

    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container).append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('position', 'absolute')
      .style('inset', '0')
      .style('pointer-events', 'all');

    svgRef.current = svg;

    const cardsLayer = d3.select(container).append('div')
      .attr('class', 'cards-layer')
      .style('position', 'absolute')
      .style('inset', '0')
      .style('pointer-events', 'none')
      .style('overflow', 'hidden');

    cardsLayerRef.current = cardsLayer.node();

    const cardsTransform = cardsLayer.append('div')
      .attr('class', 'cards-transform')
      .style('transform-origin', '0 0')
      .style('position', 'absolute')
      .style('inset', '0');

    const g = svg.append('g');

    const zoom = d3.zoom().on('zoom', (event) => {
      g.attr('transform', event.transform);
      cardsTransform.style('transform', `translate(${event.transform.x}px, ${event.transform.y}px) scale(${event.transform.k})`);
      const newScale = event.transform.k;
      zoomScaleRef.current = newScale;
      const newLod = getLOD(newScale);
      if (newLod !== currentLodRef.current) {
        currentLodRef.current = newLod;
        renderAllArticleBodies();
      }
    });
    svg.call(zoom).on('dblclick.zoom', null);

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id).distance(160))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('collide', d3.forceCollide().radius(d => (d._r || d.size / 2) + 8).strength(0.9))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .velocityDecay(0.85)
      .alphaDecay(0.05);

    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      svg.attr('width', width).attr('height', height);
    };
    window.addEventListener('resize', handleResize);

    const links = g.selectAll('.link')
      .data(data.links)
      .enter().append('line')
      .attr('class', 'link');

    const dragHandler = d3.drag()
      .on('start', (event, d) => {
        d.fx = d.x; d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.x = event.x; d.y = event.y;
        d.fx = event.x; d.fy = event.y;
        if (d.type === 'article') {
          articleNodes.filter(nd => nd.id === d.id)
            .style('transform', `translate(${event.x}px, ${event.y}px)`);
        } else {
          tagNodesSelection.filter(nd => nd.id === d.id)
            .attr('transform', 'translate(' + event.x + ',' + event.y + ')');
        }
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
      });

    const tagNodesSelection = g.selectAll('.node')
      .data(data.nodes.filter(d => d.type === 'tag'))
      .enter().append('g')
      .attr('class', 'node')
      .call(dragHandler);

    const probe = svg.append('text')
      .style('font-family', "'Atkinson', sans-serif")
      .style('visibility', 'hidden');

    tagNodesSelection.each(function(d) {
      const el = d3.select(this);
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
    });
    probe.remove();

    const articleNodes = cardsTransform.selectAll('.node-card')
      .data(data.nodes.filter(d => d.type === 'article'))
      .enter().append('div')
      .attr('class', 'node-card')
      .style('position', 'absolute')
      .style('left', '0')
      .style('top', '0')
      .style('pointer-events', 'auto')
      .call(dragHandler);

    const reactRoots = new Map();
    articleNodes.each(function(d) {
      d._r = 100; // Will be updated on render
      reactRoots.set(d.id, { root: createRoot(this), wrapper: this });
    });

    function renderArticleBody(d) {
      if (d.type !== 'article') return;
      const entry = reactRoots.get(d.id);
      if (!entry) return;
      const hovered = hoveredIdRef.current === d.id;
      const pinned = pinnedIdRef.current === d.id;
      const lod = getLOD(zoomScaleRef.current);
      const { width: w, height: h } = cardSizeFor({ hovered, pinned, lod });

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
      d._r = Math.max(w, h) / 2;
    }

    articleNodes.on('wheel', (e) => e.stopPropagation());

    function renderAllArticleBodies() {
      data.nodes.forEach(d => { if (d.type === 'article') renderArticleBody(d); });
    }

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

    renderAllArticleBodies();
    applyVisibility(svg, cardsLayer, hiddenSourcesRef.current);

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
      .on('click', (event, d) => {
        const target = event.target;
        const isPopout = target && (target.dataset?.popout === '1' ||
                                    target.closest?.('[data-popout="1"]'));
        if (isPopout) {
          event.stopPropagation();
          if (onNodeSelectRef.current) {
            onNodeSelectRef.current(d.originalItem || d);
          }
          if (pinnedIdRef.current === d.id) {
            pinnedIdRef.current = null;
            hoveredIdRef.current = null;
            renderArticleBody(d);
            event.currentTarget.style.zIndex = '';
          }
          return;
        }
        event.stopPropagation();
        const prevPinned = pinnedIdRef.current;
        if (prevPinned === d.id) {
          pinnedIdRef.current = null;
          renderArticleBody(d);
          event.currentTarget.style.zIndex = '';
        } else {
          pinnedIdRef.current = d.id;
          renderArticleBody(d);
          event.currentTarget.style.zIndex = 10;
          if (prevPinned) {
            const prev = data.nodes.find(nd => nd.id === prevPinned);
            if (prev) {
               renderArticleBody(prev);
               articleNodes.filter(nd => nd.id === prev.id).style('z-index', '');
            }
          }
          loadFullContent(d).then(() => {
            if (pinnedIdRef.current === d.id) renderArticleBody(d);
          });
        }
      });

    let activeTag = null;
    tagNodesSelection
      .on('click', (event, d) => {
        event.stopPropagation();
        if (activeTag === d.id) {
          activeTag = null;
          tagNodesSelection.classed('dimmed', false).classed('tag-active', false);
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
          tagNodesSelection.classed('dimmed', nd => !connected.has(nd.id));
          tagNodesSelection.classed('tag-active', nd => nd.id === d.id);
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
        tagNodesSelection.classed('dimmed', false).classed('tag-active', false);
        articleNodes.classed('dimmed', false);
        links.classed('highlighted', false);
      }
      if (pinnedIdRef.current) {
        const prev = data.nodes.find(nd => nd.id === pinnedIdRef.current);
        pinnedIdRef.current = null;
        if (prev) {
          renderArticleBody(prev);
          articleNodes.filter(nd => nd.id === prev.id).style('z-index', '');
        }
      }
    });

    simulation.nodes(data.nodes).on('tick', () => {
      links.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
           .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      tagNodesSelection.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
      articleNodes.style('transform', d => `translate(${d.x}px, ${d.y}px)`);
    });
    simulation.force('link').links(data.links);

    simulation.on('end', () => {
      data.nodes.forEach(d => { d.fx = d.x; d.fy = d.y; });
    });

    return () => {
      simulation.stop();
      window.removeEventListener('resize', handleResize);
      reactRoots.forEach(({ root }) => {
        queueMicrotask(() => root.unmount());
      });
      reactRoots.clear();
    };
  }, [feedData]);

  return (
    <div
      ref={containerRef}
      className={styles.graphContainer}
    />
  );
}
