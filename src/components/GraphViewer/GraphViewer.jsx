import React, { useRef, useEffect, useState } from 'react';
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
      originalItem: item // Keep the original for emitting to ReaderPanel
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

export function GraphViewer({ feedData, onNodeSelect }) {
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const resizeHandlerRef = useRef(null);

  const [tooltipData, setTooltipData] = useState({
    show: false,
    x: 0,
    y: 0,
    title: '',
    desc: '',
    date: ''
  });

  useEffect(() => {
    if (!feedData || !containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // We pass CSS var values via config mapping or defaults,
    // but the actual coloring will be handled via inline styles in DOM mutation
    const computedStyles = getComputedStyle(container);
    const config = {
      nodeDraftColor: computedStyles.getPropertyValue('--gv-node-draft').trim() || '#555',
      nodePublishedColor: computedStyles.getPropertyValue('--gv-node-published').trim() || '#2ecc71',
      tagColor: computedStyles.getPropertyValue('--gv-tag-color').trim() || '#f39c12'
    };

    const data = feedToGraph(feedData, config);

    // Clear previous D3 rendering if re-running
    d3.select(container).selectAll('svg').remove();

    const svg = d3.select(container).append('svg')
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom().on('zoom', (event) => {
        g.attr('transform', event.transform);
      }))
      .on('dblclick.zoom', null);

    svgRef.current = svg;

    const g = svg.append('g');

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id).distance(160))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('collide', d3.forceCollide().radius(d => (d._r || d.size / 2) + 8).strength(0.9))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .velocityDecay(0.85)
      .alphaDecay(0.05);

    simulationRef.current = simulation;

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      svg.attr('width', width).attr('height', height);
      simulation.force('center', d3.forceCenter(width / 2, height / 2));
      simulation.alpha(0.1).restart();
    };

    window.addEventListener('resize', handleResize);
    resizeHandlerRef.current = handleResize;

    // Render nodes & links
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
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
      );

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
        const isDraft = d.color === config.nodeDraftColor;
        const borderColor = isDraft ? '#555' : config.nodePublishedColor;

        if (d.kind === 'image' && d.image) {
          const cardW = 180, cardH = 180;
          el.append('foreignObject')
            .attr('width', cardW).attr('height', cardH + 24)
            .attr('x', -cardW / 2).attr('y', -cardH / 2)
            .append('xhtml:div')
            .attr('xmlns', 'http://www.w3.org/1999/xhtml')
            .style('width', cardW + 'px')
            .style('font-family', "'Atkinson', sans-serif")
            .style('cursor', 'pointer')
            .html(
              '<div style="width:' + cardW + 'px;height:' + cardH + 'px;' +
                "background:#000 url('" + d.image + "') center/cover no-repeat;" +
                'border:1.5px solid ' + borderColor + ';border-radius:4px;"></div>' +
              '<div style="font-size:11px;color:rgba(255,255,255,0.6);' +
                'text-align:center;margin-top:4px;line-height:1.2;">' +
                (d.short_title || d.title || d.label) + '</div>'
            );
          d._r = cardH / 2 + 12;
        } else {
          const cardW = 180, cardH = 140;
          const bgColor = isDraft ? '#2a2a3e' : '#1e3a5f';
          const bgImage = d.image
            ? "linear-gradient(" + (isDraft ? "rgba(42,42,62,0.85),rgba(42,42,62,0.85)" : "rgba(30,58,95,0.85),rgba(30,58,95,0.85)") + "), url('" + d.image + "')"
            : bgColor;
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
      }
    });

    probe.remove();

    nodes.filter(d => d.type === 'article')
      .on('click', (event, d) => {
        if (onNodeSelect) {
          // Emit the selected article's raw object to parent for ReaderPanel
          onNodeSelect(d.originalItem || d);
        }
      })
      .on('mouseover', (event, d) => {
        setTooltipData({
          show: true,
          x: event.clientX + 16,
          y: event.clientY + 16,
          title: d.title || d.label,
          desc: d.description || '',
          date: d.date || ''
        });
      })
      .on('mousemove', (event) => {
        setTooltipData(prev => ({
          ...prev,
          x: event.clientX + 16,
          y: event.clientY + 16
        }));
      })
      .on('mouseout', () => {
        setTooltipData(prev => ({ ...prev, show: false }));
      });

    let activeTag = null;

    nodes.filter(d => d.type === 'tag')
      .on('click', (event, d) => {
        event.stopPropagation();
        if (activeTag === d.id) {
          activeTag = null;
          nodes.classed('dimmed', false).classed('tag-active', false);
          links.classed('highlighted', false);
          simulation.force('x', null).force('y', null);
          simulation.alpha(0.4).restart();
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

          const cx = width / 2, cy = height / 2;
          simulation
            .force('x', d3.forceX(nd => connected.has(nd.id) ? cx : (nd.x < cx ? cx - 500 : cx + 500)).strength(nd => connected.has(nd.id) ? 0.3 : 0.15))
            .force('y', d3.forceY(cy).strength(nd => connected.has(nd.id) ? 0.3 : 0.1));
          simulation.alpha(0.6).restart();
        }
      });

    svg.on('click', () => {
      if (activeTag) {
        activeTag = null;
        nodes.classed('dimmed', false).classed('tag-active', false);
        links.classed('highlighted', false);
        simulation.force('x', null).force('y', null);
        simulation.alpha(0.4).restart();
      }
    });

    simulation.nodes(data.nodes).on('tick', () => {
      links.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
           .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      nodes.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
    });
    simulation.force('link').links(data.links);

    return () => {
      simulation.stop();
      if (resizeHandlerRef.current) {
        window.removeEventListener('resize', resizeHandlerRef.current);
      }
    };
  }, [feedData, onNodeSelect]);

  return (
    <>
      <div
        ref={containerRef}
        className={styles.graphContainer}
      />
      {tooltipData.show && (
        <div
          ref={tooltipRef}
          className={styles.tooltip}
          style={{
            display: 'block',
            left: tooltipData.x,
            top: tooltipData.y
          }}
        >
          <div className={styles.tooltipTitle}>{tooltipData.title}</div>
          <div className={styles.tooltipDesc}>{tooltipData.desc}</div>
          <div className={styles.tooltipDate}>{tooltipData.date}</div>
        </div>
      )}
    </>
  );
}
