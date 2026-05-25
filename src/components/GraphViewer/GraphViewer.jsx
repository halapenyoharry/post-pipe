import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import styles from './GraphViewer.module.css';

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

// Build the inner HTML for an article node's foreignObject div.
// Pure function of node data + view state, no side effects.
function renderArticleNodeHTML(d, view, colors) {
  const { borderColor, bgImage } = colors;
  const { hovered, pinned, scale } = view;
  const expanded = hovered || pinned;

  // Three sizes: default / hovered (slightly bigger) / pinned (bigger still).
  let cardW, cardH;
  if (pinned) { cardW = 230; cardH = 190; }
  else if (hovered) { cardW = 200; cardH = 160; }
  else { cardW = 180; cardH = 140; }

  // Image-kind nodes keep their image-card look (no text morphing).
  if (d.kind === 'image' && d.image) {
    const imgH = pinned ? 230 : hovered ? 200 : 180;
    return {
      width: cardW,
      height: imgH + 24,
      html: (
        '<div style="width:' + cardW + 'px;height:' + imgH + 'px;' +
          'background:#000 url(\'' + d.image + '\') center/cover no-repeat;' +
          'border:' + (pinned ? '2px' : '1.5px') + ' solid ' + (pinned ? '#64ffda' : borderColor) + ';border-radius:4px;"></div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,0.6);' +
          'text-align:center;margin-top:4px;line-height:1.2;">' +
          (d.short_title || d.title || d.label) + '</div>' +
        (pinned ? popoutIconHTML() : '')
      )
    };
  }

  // Article body card. Inner content depends on state and LOD level.
  let inner;
  if (expanded) {
    // Hover shows the summary. Pin shows the full article body if it has
    // been fetched yet (loaded lazily on pin — see loadFullContent).
    const useFullArticle = pinned && d._fullContent;
    const contentBody = useFullArticle ? d._fullContent : (d.description || '');
    inner =
      '<div style="font-size:15px;font-weight:700;color:#fff;line-height:1.3;margin-bottom:6px;-webkit-user-select:none;user-select:none;">' +
        (d.title || d.label) +
      '</div>' +
      (contentBody
        ? '<div class="rp-scroll" style="font-size:' + (useFullArticle ? '11px' : '13px') + ';color:rgba(255,255,255,0.78);line-height:1.45;max-height:' + (cardH - 56) + 'px;overflow-y:auto;padding-right:6px;-webkit-user-select:text;user-select:text;">' + contentBody + '</div>'
        : '');
  } else {
    const lod = getLOD(scale);
    if (lod === 'slug') {
      // Slug-LOD: card content is empty. The floating <text class="slug-label">
      // overlay (sibling of the foreignObject in the parent g) provides the
      // counter-scaled label at constant on-screen size — see updateSlugLabels.
      inner = '';
    } else if (lod === 'title') {
      // Mid zoom: short_title or title.
      inner =
        '<div style="font-size:18px;font-weight:700;color:#fff;line-height:1.25;text-align:center;display:flex;align-items:center;justify-content:center;height:100%;-webkit-user-select:none;user-select:none;">' +
          (d.short_title || d.title || d.label) +
        '</div>';
    } else {
      // Close zoom: full card with title + truncated description preview.
      const desc = d.description || '';
      const preview = desc.length > 120 ? desc.slice(0, 117) + '...' : desc;
      inner =
        '<span style="font-size:15px;font-weight:700;color:#fff;line-height:1.3;-webkit-user-select:none;user-select:none;">' + (d.title || d.label) + '</span>' +
        (preview
          ? '<br><span style="zoom:0.65;font-size:15px;color:rgba(255,255,255,0.35);line-height:1.3;font-style:italic;-webkit-user-select:none;user-select:none;">' + preview + '</span>'
          : '');
    }
  }

  // Cursor: grab everywhere by default so the user knows the whole node is
  // draggable. When hovered/pinned and over the scrollable text, the inner
  // .rp-scroll div overrides cursor to text via user-select:text.
  return {
    width: cardW,
    height: cardH,
    html:
      '<div style="position:relative;width:' + cardW + 'px;height:' + cardH + 'px;' +
        'background:' + bgImage + ';background-size:cover;background-position:center;' +
        'border:' + (pinned ? '2px' : '1.5px') + ' solid ' + (pinned ? '#64ffda' : borderColor) + ';' +
        'border-radius:4px;padding:10px 12px;box-sizing:border-box;overflow:hidden;' +
        'font-family:\'Atkinson\', sans-serif;cursor:grab;' +
        '-webkit-user-select:none;user-select:none;">' +
        inner +
        (pinned ? popoutIconHTML() : '') +
      '</div>'
  };
}

// Popout icon — clicked to open the side reader. Marked with data-popout="1"
// so the click handler can route to onNodeSelect rather than pin/drag.
function popoutIconHTML() {
  return (
    '<div data-popout="1" title="Open in reader" ' +
      'style="position:absolute;top:6px;right:6px;width:24px;height:24px;' +
        'background:rgba(17,24,39,0.92);border:1px solid rgba(100,255,218,0.55);' +
        'border-radius:3px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:5;">' +
      '<svg data-popout="1" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64ffda" stroke-width="2.2" style="pointer-events:none;">' +
        '<path d="M14 3h7v7"/><path d="M21 3l-9 9"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>' +
      '</svg>' +
    '</div>'
  );
}

export function GraphViewer({ feedData, onNodeSelect }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  // Stable refs for callbacks so the simulation never rebuilds on prop change.
  const onNodeSelectRef = useRef(onNodeSelect);
  useEffect(() => { onNodeSelectRef.current = onNodeSelect; }, [onNodeSelect]);

  // View state lives in refs because it must not trigger React re-renders or
  // re-run the useEffect that owns the simulation.
  const pinnedIdRef = useRef(null);
  const hoveredIdRef = useRef(null);
  const zoomScaleRef = useRef(1);
  const currentLodRef = useRef('full');

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

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id).distance(160))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('collide', d3.forceCollide().radius(d => (d._r || d.size / 2) + 8).strength(0.9))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .velocityDecay(0.85)
      .alphaDecay(0.05);

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
        d._r = Math.max(bubbleW, bubbleH) / 2;
      } else {
        // Article nodes get a foreignObject that we'll re-fill on state change.
        el.append('foreignObject').attr('class', 'article-fo');
        // Slug label overlay — visible only at slug-LOD, font-size set
        // inversely to zoom so the label stays a constant size on screen
        // regardless of how far out the user has zoomed.
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
        d._r = 100; // upper bound for collision radius; refined after first render
      }
    });
    probe.remove();

    // Build the colors lookup once.
    function colorsFor(d) {
      const isDraft = d.color === config.nodeDraftColor;
      const borderColor = isDraft ? '#555' : config.nodePublishedColor;
      const bgColor = isDraft ? '#2a2a3e' : '#1e3a5f';
      const bgImage = d.image
        ? "linear-gradient(" + (isDraft ? "rgba(42,42,62,0.85),rgba(42,42,62,0.85)" : "rgba(30,58,95,0.85),rgba(30,58,95,0.85)") + "), url('" + d.image + "')"
        : bgColor;
      return { borderColor, bgColor, bgImage };
    }

    // Paint one article node's foreignObject based on its current state.
    function renderArticleBody(d) {
      if (d.type !== 'article') return;
      const hovered = hoveredIdRef.current === d.id;
      const pinned = pinnedIdRef.current === d.id;
      const view = { hovered, pinned, scale: zoomScaleRef.current };
      const { width: w, height: h, html } = renderArticleNodeHTML(d, view, colorsFor(d));
      const sel = nodes.filter(nd => nd.id === d.id).select('foreignObject.article-fo');
      sel.attr('width', w).attr('height', h).attr('x', -w / 2).attr('y', -h / 2)
        .html(
          '<div xmlns="http://www.w3.org/1999/xhtml" style="width:' + w + 'px;height:' + h + 'px;">' +
            html +
          '</div>'
        );
      d._r = Math.max(w, h) / 2;
    }

    // Block wheel events from inside any article node from reaching the
    // SVG zoom handler. Attached ONCE on the foreignObject element (not
    // on the inner .rp-scroll) so wheel anywhere over the card — title,
    // padding, or scrollable text — is consumed. The browser's default
    // overflow-scroll behavior on .rp-scroll still fires because we
    // only stop propagation, not the default action.
    nodes.filter(d => d.type === 'article').select('foreignObject.article-fo')
      .on('wheel', (e) => e.stopPropagation());

    function renderAllArticleBodies() {
      data.nodes.forEach(d => { if (d.type === 'article') renderArticleBody(d); });
    }

    // Slug-label overlay: shown only at slug-LOD, with font-size counter-scaled
    // to the current zoom so the on-screen text size stays roughly constant
    // (~22px). Hidden when the node is hovered or pinned, since the expanded
    // card has its own title and the overlay would just clutter.
    function updateSlugLabels(scale) {
      const showAny = scale < LOD_SLUG_ONLY;
      const labels = nodes.filter(d => d.type === 'article').select('.slug-label');
      if (!showAny) {
        labels.style('display', 'none');
        return;
      }
      // Counter-scale: font-size in SVG units = baseSize / k, so the on-screen
      // size renders at baseSize regardless of zoom. Cap high enough that
      // the label stays ~22px on-screen even at very deep zoom-out (~0.09x).
      const fontSize = Math.min(22 / Math.max(scale, 0.08), 280);
      labels
        .style('font-size', fontSize + 'px')
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
    simulation.nodes(data.nodes).on('tick', () => {
      links.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
           .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      nodes.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
    });
    simulation.force('link').links(data.links);

    // When the simulation ends, freeze every node by copying x/y to fx/fy.
    // Any later interaction (drag, etc.) keeps positions stable.
    simulation.on('end', () => {
      data.nodes.forEach(d => { d.fx = d.x; d.fy = d.y; });
    });

    return () => {
      simulation.stop();
      window.removeEventListener('resize', handleResize);
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
