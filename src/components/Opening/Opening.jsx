import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './Opening.module.css';
import { openingConfig, startState, coverGeometry, createCover, pageKey, titleLayout, TUNING } from '../../lib/opening';
import { artPoint, reachFor, createLag, reachShape, reachPath, backdropOpacity } from '../../lib/reach';

/**
 * Opening — the two-state page (settings.opening; off by default). The cover
 * art is fixed behind the page on a dark ground: the art state's image and
 * the graph state's, stacked on one canvas. In the art state the canvas is
 * scrolled so the whole plant fits, with the byline under it; in the graph
 * state it is scrolled up until the roots fill the view, and the graph (this
 * component's children: the canvas and its controls) is drawn over the
 * roots. Scrolling, a touch drag, a key or a tap moves one progress value
 * between the two: the canvas moves up, the two images crossfade, the graph
 * layer fades and rises in.
 * Every frame is written straight to the DOM from src/lib/opening.js's
 * geometry, so scrubbing never re-renders React. The graph is mounted once
 * and never unmounted; in the art state it is only hidden, so it is exactly
 * as it was on return. The art does not pan or zoom with the graph.
 *
 * A title can be set over the art (opening.title): real text in the site's
 * own face, one layout per state, drawn on the art's canvas so it scales and
 * moves with it, and crossfaded with the images. While it is there the
 * graph's own title for the whole book is not drawn (hideGraphTitle).
 *
 * The backdrop's roots fade as the reader zooms the graph in past the zoom it
 * rests at (opening.backdrop), the small plant at the top of the graph
 * state's image keeping its strength (a second copy of that image, masked
 * to the part above backdrop.keepAbove). With opening.reach, drawn rootlets
 * grow from tips named on the art to the containers the graph says they
 * reach for (window.PostPipeGraphWorld), stop short of each, and follow
 * them with a lag when they move: one SVG layer between the art and the
 * graph, drawn at most once a frame (ReachLayer below). Where the art sits in
 * the graph state is published as window.PostPipeCoverFrame, so the graph
 * can rest containers on their anchors on the art.
 *
 * The state a reader leaves it in is kept in viewState (opening.state) and is
 * where they land next time (startOn: 'remembered'). A #read= link opens on
 * the graph. With reduced motion the two states swap in one short fade.
 *
 * Without settings.opening the children render as they are.
 */

const reducedMotionNow = () => typeof window !== 'undefined' && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function loadSize(src) {
  return new Promise((resolve) => {
    if (!src) { resolve(null); return; }
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth > 0 ? { w: img.naturalWidth, h: img.naturalHeight } : null);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Keys belong to whatever is being typed in, and to the reader or a dialog
// when one has focus or is open over the page.
const KEYED_ROLES = new Set(['radio', 'slider', 'listbox', 'option', 'menu', 'menuitem', 'tab', 'spinbutton', 'textbox', 'combobox']);
function keysBelongElsewhere(e) {
  const t = e.target;
  if (t && t.nodeType === 1) {
    if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return true;
    if (KEYED_ROLES.has(t.getAttribute('role'))) return true;
    if (t.closest('[data-reader-panel], [role="dialog"], [data-settings-panel]')) return true;
    if ((e.key === ' ' || e.key === 'Spacebar') && t.closest('button, a[href], summary, [role="button"]')) return true;
  }
  if (typeof window !== 'undefined' && window.location.hash.startsWith('#read=')) return true;
  if (typeof document !== 'undefined' && document.querySelector('[data-settings-panel]')) return true;
  return false;
}

// The space the page keeps at the bottom: the rights line, when there is one.
function bottomInset(vh) {
  const el = typeof document !== 'undefined' && document.querySelector('[data-rights]');
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  return r.height > 0 ? Math.max(0, vh - r.top + 8) : 0;
}

const DRAG_PX = 8; // a touch that moved this far was a drag, not a tap

const SVG_NS = 'http://www.w3.org/2000/svg';

// The rootlets (opening.reach), drawn into one SVG layer in screen px. Each
// frame: the art's tips where the art is now; for each container the graph
// says they reach for, its nearest tips; from each, a rootlet aimed at the
// container's centre that stops stopShort before its outline. A rootlet's
// end follows its target with the lag; its start is on the art and moves
// with it at once. A new rootlet draws in over drawMs the first time it
// shows; with reduced motion it is simply there and follows at once.
//   draw(now, { box, opacity, settledCover, world })   world is the graph's
//   snapshot; returns true while any end is still on its way, so the caller
//   asks for another frame.
function createReach(cfg, layer, { reduced, seed }) {
  const rootlets = new Map();
  const lagMs = reduced ? 0 : cfg.lagMs;

  function make(key, cId, tip) {
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('data-reach', key);
    g.setAttribute('data-reach-container', cId);
    g.setAttribute('data-reach-tip', String(tip));
    const main = document.createElementNS(SVG_NS, 'path');
    main.setAttribute('class', 'reach-main');
    const fine = document.createElementNS(SVG_NS, 'path');
    fine.setAttribute('class', 'reach-fine');
    g.append(main, fine);
    g.style.visibility = 'hidden';
    layer.appendChild(g);
    return { key, g, main, fine, shape: reachShape(`${seed}|${key}`), lag: createLag(lagMs), state: 'new', timer: null };
  }

  function drawIn(r) {
    r.state = 'drawn';
    r.g.style.visibility = '';
    if (reduced || !cfg.drawMs) { r.g.setAttribute('data-drawn', 'drawn'); return; }
    r.g.setAttribute('data-drawn', 'drawing');
    for (const el of [r.main, r.fine]) {
      el.setAttribute('pathLength', '1');
      el.style.transition = 'none';
      el.style.strokeDasharray = '1 1';
      el.style.strokeDashoffset = '1';
    }
    r.main.getBoundingClientRect();
    for (const el of [r.main, r.fine]) {
      el.style.transition = `stroke-dashoffset ${cfg.drawMs}ms cubic-bezier(0.25, 0.6, 0.35, 1)`;
      el.style.strokeDashoffset = '0';
    }
    r.timer = setTimeout(() => {
      r.timer = null;
      for (const el of [r.main, r.fine]) {
        el.removeAttribute('pathLength');
        el.style.transition = '';
        el.style.strokeDasharray = '';
        el.style.strokeDashoffset = '';
      }
      r.g.setAttribute('data-drawn', 'drawn');
    }, cfg.drawMs + 60);
  }

  function remove(r) {
    if (r.timer) clearTimeout(r.timer);
    r.g.remove();
  }

  function draw(now, { box, opacity, settledCover, world }) {
    layer.style.opacity = String(opacity);
    if (!world || !box) return false;
    const tips = cfg.tips.map((t) => artPoint(t, box));
    const seen = new Set();
    let moving = false;
    for (const c of world.containers) {
      for (const hit of reachFor(tips, c, cfg.perContainer, cfg.stopShort)) {
        const i = hit.tip;
        const key = `${c.id}|${i}`;
        seen.add(key);
        let r = rootlets.get(key);
        if (!r) { r = make(key, c.id, i); rootlets.set(key, r); }
        // While the cover itself moves, the ends ride with it.
        if (r.state === 'new' || !settledCover) r.lag.jump(hit.end);
        else r.lag.to(hit.end, now);
        const end = r.lag.at(now);
        if (!r.lag.settled(now)) moving = true;
        const d = reachPath(tips[i], end, r.shape);
        r.main.setAttribute('d', d.main);
        r.fine.setAttribute('d', d.fine);
        r.g.setAttribute('data-target', `${hit.end.x.toFixed(1)},${hit.end.y.toFixed(1)}`);
        r.g.setAttribute('data-hit', `${hit.hit.x.toFixed(1)},${hit.hit.y.toFixed(1)}`);
        if (r.state === 'new' && opacity > 0.05) drawIn(r);
      }
    }
    for (const [key, r] of rootlets) if (!seen.has(key)) { remove(r); rootlets.delete(key); }
    return moving;
  }

  return {
    draw,
    dispose() { for (const r of rootlets.values()) remove(r); rootlets.clear(); },
  };
}

// The title over the art: an SVG on the art's own canvas (its viewBox is the
// canvas's natural size), so each line's left edge and baseline land where
// the layout puts them on the image at any size. A span's rise lifts it off
// the baseline, and the next span comes back down.
function TitleLayout({ layout, size, which, opacity }) {
  const lines = titleLayout(layout, { left: 0, top: 0, width: size.w, height: size.h }).lines;
  if (!lines.length) return null;
  return (
    <g data-cover-title={which} style={{ opacity }}>
      {lines.map((line, i) => {
        let lifted = 0;
        return (
          <text key={i} x={line.x} y={line.y} data-cover-title-line={i} xmlSpace="preserve">
            {line.spans.map((sp, k) => {
              const dy = lifted - sp.rise;
              lifted = sp.rise;
              return (
                <tspan key={k} fontSize={sp.size} dy={dy || undefined} data-cover-title-span={k}>{sp.text}</tspan>
              );
            })}
          </text>
        );
      })}
    </g>
  );
}

// The graph state's image in two parts: the part above keepAbove (a share
// of the canvas's height: the small plant) and the rest (its roots), with a
// short soft seam between them.
function keepMask(keepAbove, part) {
  if (!(keepAbove > 0)) return undefined;
  const a = Math.max(0, keepAbove * 100 - 1.5), b = Math.min(100, keepAbove * 100 + 1.5);
  const img = part === 'above'
    ? `linear-gradient(to bottom, #000 0%, #000 ${a}%, transparent ${b}%)`
    : `linear-gradient(to bottom, transparent 0%, transparent ${a}%, #000 ${b}%)`;
  return { WebkitMaskImage: img, maskImage: img, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' };
}

// The art state's ground as a night sky (opening.ground as an object): the
// base colour holds at its top down to colorFrom, then runs to the bottom
// colour (the theme's dark paper unless named) at the foot.
function skyStyle(sky) {
  if (!sky) return undefined;
  const bottom = sky.bottom || 'var(--sk-paper, var(--bg, #2a2a2e))';
  return {
    backgroundColor: sky.top,
    backgroundImage: `linear-gradient(to bottom, ${sky.top} 0%, ${sky.top} ${(sky.colorFrom * 100).toFixed(1)}%, ${bottom} 100%)`,
  };
}

// Absent above `from` (a share of the height), coming in to full at the foot.
function fromMask(from) {
  const img = `linear-gradient(to bottom, transparent 0%, transparent ${(from * 100).toFixed(1)}%, #000 100%)`;
  return { WebkitMaskImage: img, maskImage: img };
}

function CoverTitle({ title, size, start, refs }) {
  if (!title || !size) return null;
  return (
    <svg
      className={styles.title}
      viewBox={`0 0 ${size.w} ${size.h}`}
      preserveAspectRatio="none"
      role="heading"
      aria-level="1"
      aria-label={title.text}
      data-cover-title-svg
      style={{
        fontFamily: title.family,
        fill: title.color || 'var(--pp-accent, var(--accent))',
        fillOpacity: title.opacity,
      }}
    >
      <g ref={refs.art}>
        <TitleLayout layout={title.art} size={size} which="art" opacity={start === 'art' ? 1 : 0} />
      </g>
      <g ref={refs.graph}>
        <TitleLayout layout={title.graph} size={size} which="graph" opacity={start === 'art' ? 0 : 1} />
      </g>
    </svg>
  );
}

function Cover({ config, viewState, children }) {
  const coverRef = useRef(null);
  const groundRef = useRef(null);
  const stageRef = useRef(null);
  const artRef = useRef(null);
  const artStateRef = useRef(null);
  const graphStateRef = useRef(null);
  const graphKeepRef = useRef(null);
  const reachLayerRef = useRef(null);
  const reachRef = useRef(null);
  const zoomRef = useRef(null);       // { k, homeK }: the graph's zoom, from its world
  const geomRef = useRef(null);       // the last painted geometry
  const shiftRef = useRef(0);         // how far below its rest the graph layer is drawn
  const frameRef = useRef(null);
  const titleArtRef = useRef(null);
  const titleGraphRef = useRef(null);
  const bylineRef = useRef(null);
  const sectionRef = useRef(null);
  const handleRef = useRef(null);
  const machineRef = useRef(null);
  const sizeRef = useRef(null);
  const dragRef = useRef(() => false);
  const [art, setArt] = useState(null); // { w, h }: the canvas
  const reduced = useMemo(reducedMotionNow, []);
  const start = useMemo(() => startState(config, {
    stored: viewState && viewState.openingState ? viewState.openingState() : null,
    hash: typeof window !== 'undefined' ? window.location.hash : '',
  }), [config, viewState]);

  // The canvas's natural size: the art state's image (the graph state's is
  // drawn on the same canvas).
  useEffect(() => {
    let live = true;
    loadSize(config.art.artState).then((s) => { if (live) setArt(s || { w: 1, h: 2 }); });
    return () => { live = false; };
  }, [config]);

  const geometry = (p) => {
    const vw = window.innerWidth, vh = window.innerHeight;
    return coverGeometry(config, { vw, vh, art: sizeRef.current || { w: 1, h: 2 }, bottom: bottomInset(vh), zoom: zoomRef.current }, p);
  };

  // The backdrop's strength (it follows the graph's zoom) and the rootlets:
  // at most once a frame, and again while a rootlet's end is on its way.
  const drawFrame = () => {
    frameRef.current = null;
    const world = window.PostPipeGraphWorld ? window.PostPipeGraphWorld.snapshot() : null;
    if (world && world.k > 0 && world.homeK > 0) zoomRef.current = { k: world.k, homeK: world.homeK };
    const m = machineRef.current;
    if (!m) return;
    const g = geometry(m.p);
    geomRef.current = g;
    paintRoots(g);
    const reach = reachRef.current;
    if (!reach || !sizeRef.current) return;
    const zoomed = zoomRef.current ? backdropOpacity(config.backdrop, zoomRef.current.k, zoomRef.current.homeK) : config.backdrop.opacity;
    const moving = reach.draw(performance.now(), {
      box: g.art, world, opacity: g.graph.opacity * zoomed, settledCover: m.p >= 1 && !m.moving,
    });
    if (moving) requestFrame();
  };
  const requestFrame = () => {
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => drawFrameRef.current());
  };
  const drawFrameRef = useRef(drawFrame);
  drawFrameRef.current = drawFrame;

  // The graph state's image: its roots at the backdrop's strength, the
  // small plant (the copy masked above keepAbove) at its own.
  const paintRoots = (g) => {
    const roots = graphStateRef.current;
    if (roots) roots.style.opacity = String(g.fade.graph * g.roots);
    else if (artStateRef.current) artStateRef.current.style.opacity = String(g.roots);
    if (graphKeepRef.current) graphKeepRef.current.style.opacity = String(g.fade.graph);
  };

  // Where the art sits in the graph state, for the graph's anchors.
  const publishFrame = () => {
    if (!sizeRef.current) return;
    const g1 = geometry(1);
    window.PostPipeCoverFrame = {
      art: { left: g1.art.left, top: g1.art.top, width: g1.art.width, height: g1.art.height },
      natural: { ...sizeRef.current },
    };
    window.dispatchEvent(new CustomEvent('postpipe:cover-frame'));
  };
  const publishFrameRef = useRef(publishFrame);
  publishFrameRef.current = publishFrame;

  // Paint progress p: every moving part, straight to the DOM.
  const paint = (p) => {
    const g = geometry(p);
    const m = machineRef.current;
    const label = m && m.moving ? 'moving' : (p >= 1 ? 'graph' : p <= 0 ? 'art' : 'moving');
    const root = document.documentElement;
    root.style.setProperty('--pp-cover-p', String(g.p));
    root.setAttribute('data-pp-cover', label);

    const a = artRef.current;
    if (a) {
      a.style.width = `${g.art.width}px`;
      a.style.height = `${g.art.height}px`;
      a.style.transform = `translate3d(${g.art.left}px, ${g.art.top}px, 0)`;
      a.style.opacity = sizeRef.current ? String(g.art.opacity) : '0';
    }
    geomRef.current = g;
    if (graphStateRef.current && artStateRef.current) artStateRef.current.style.opacity = String(g.fade.art);
    paintRoots(g);
    const ta = titleArtRef.current && titleArtRef.current.firstChild;
    const tg = titleGraphRef.current && titleGraphRef.current.firstChild;
    if (ta) ta.style.opacity = String(g.fade.art);
    if (tg) tg.style.opacity = String(g.fade.graph);
    if (groundRef.current) groundRef.current.style.opacity = String(g.ground);
    const by = bylineRef.current;
    if (by) {
      by.style.left = `${g.byline.x}px`;
      by.style.top = `${g.byline.y}px`;
      by.style.fontSize = `${g.byline.size}px`;
      by.style.opacity = sizeRef.current ? String(g.byline.opacity) : '0';
      by.style.pointerEvents = g.byline.opacity > 0.5 ? 'auto' : 'none';
      by.tabIndex = label === 'art' ? 0 : -1;
    }
    const stage = stageRef.current;
    if (stage) {
      stage.setAttribute('data-cover-state', label);
      stage.tabIndex = label === 'art' ? 0 : -1;
    }
    const sec = sectionRef.current;
    if (sec) {
      const atRest = label === 'graph';
      shiftRef.current = atRest ? 0 : g.graph.shift;
      // At the graph rest the layer carries no opacity or transform, so it
      // makes no stacking context and the controls inside it sit as before.
      sec.style.opacity = atRest ? '' : String(g.graph.opacity);
      sec.style.transform = atRest ? '' : `translate3d(0, ${g.graph.shift}px, 0)`;
      sec.style.pointerEvents = atRest ? '' : 'none';
      sec.inert = label === 'art';
      if (label === 'art') sec.setAttribute('aria-hidden', 'true');
      else sec.removeAttribute('aria-hidden');
    }
    const h = handleRef.current;
    if (h) {
      h.style.opacity = String(g.graph.opacity);
      h.style.pointerEvents = label === 'graph' ? 'auto' : 'none';
      h.tabIndex = label === 'graph' ? 0 : -1;
    }
    requestFrame();
  };
  const paintRef = useRef(paint);
  paintRef.current = paint;

  // While the title is on the cover, the graph does not draw its own title
  // for the whole book (GraphViewer marks it data-container-top).
  useEffect(() => {
    if (!config.title || !config.title.hideGraphTitle) return undefined;
    const root = document.documentElement;
    root.setAttribute('data-pp-cover-title', '');
    return () => root.removeAttribute('data-pp-cover-title');
  }, [config]);

  // A night-sky ground: the paper's own grain and fibres, laid over the whole
  // page, are kept off its top while the art state shows (the stylesheet
  // masks them with the cover's progress).
  useEffect(() => {
    if (!config.sky) return undefined;
    const root = document.documentElement;
    root.setAttribute('data-pp-cover-sky', '');
    root.style.setProperty('--pp-sky-from', `${(config.sky.textureFrom * 100).toFixed(1)}%`);
    return () => {
      root.removeAttribute('data-pp-cover-sky');
      root.style.removeProperty('--pp-sky-from');
    };
  }, [config]);

  // The art's size is known: the whole scrub is the art's move.
  useLayoutEffect(() => {
    if (!art) return;
    sizeRef.current = art;
    const m = machineRef.current;
    if (m) {
      m.resize(geometry(0).travel);
      paintRef.current(m.p);
    }
    publishFrameRef.current();
  }, [art]); // eslint-disable-line react-hooks/exhaustive-deps

  // The rootlets' layer, and the graph's word that its world has changed.
  useEffect(() => {
    if (config.reach && reachLayerRef.current) {
      reachRef.current = createReach(config.reach, reachLayerRef.current, { reduced, seed: config.art.graphState || config.art.artState });
    }
    const onWorld = () => requestFrame();
    window.addEventListener('graph:world', onWorld);
    requestFrame();
    return () => {
      window.removeEventListener('graph:world', onWorld);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      if (reachRef.current) reachRef.current.dispose();
      reachRef.current = null;
      if (window.PostPipeCoverFrame) delete window.PostPipeCoverFrame;
    };
  }, [config, reduced]); // eslint-disable-line react-hooks/exhaustive-deps

  // The machine, from the first frame. Its rests are remembered.
  useLayoutEffect(() => {
    let fadeTimer = null;
    const machine = createCover(config, {
      start,
      reducedMotion: reduced,
      travel: geometry(0).travel,
      frame: (fn) => requestAnimationFrame(fn),
      cancelFrame: (h) => cancelAnimationFrame(h),
      onChange(p, info) {
        if (info && info.swap) {
          // Reduced motion: out, swap, back in.
          const half = Math.round((info.ms || TUNING.reducedFadeMs) / 2);
          const els = [coverRef.current, sectionRef.current].filter(Boolean);
          for (const el of els) { el.style.transition = `opacity ${half}ms linear`; el.style.opacity = '0'; }
          if (fadeTimer) clearTimeout(fadeTimer);
          // The new state is painted once the cover is out of sight, not
          // merely when the fade should have ended: a slow first frame (a
          // new layer to draw) would otherwise show the art jump.
          const t0 = Date.now();
          const outOfSight = () => {
            const el = coverRef.current;
            const o = el ? Number(getComputedStyle(el).opacity) : 0;
            if (o > 0.02 && Date.now() - t0 < half * 4) { fadeTimer = setTimeout(outOfSight, 16); return; }
            paintRef.current(p);
            if (el) el.style.opacity = '1';
            fadeTimer = setTimeout(() => { for (const x of els) x.style.transition = ''; fadeTimer = null; }, half + 20);
          };
          fadeTimer = setTimeout(outOfSight, half);
          return;
        }
        paintRef.current(p);
      },
      onRest(state) {
        // Mid-swap (reduced motion) the fade paints the new state at its
        // midpoint, out of sight.
        if (!fadeTimer) paintRef.current(machine.p);
        // Written at once, not after the usual pause, so a reader who leaves
        // straight after a move still lands there next time.
        if (viewState && viewState.setOpeningState) {
          viewState.setOpeningState(state);
          if (viewState.flush) viewState.flush();
        }
        window.dispatchEvent(new CustomEvent('postpipe:cover', { detail: { state } }));
      },
    });
    machineRef.current = machine;
    paintRef.current(machine.p);
    if (viewState && viewState.setOpeningState) viewState.setOpeningState(machine.rest);
    // Test and page hook: where the page is.
    window.PostPipeCover = {
      get state() { return machine.moving ? 'moving' : machine.rest; },
      get p() { return machine.p; },
      get shift() { return shiftRef.current; },
      go: (s, o) => machine.go(s, o),
    };

    const onResize = () => {
      machine.resize(geometry(0).travel);
      paintRef.current(machine.p);
      publishFrameRef.current();
    };
    window.addEventListener('resize', onResize);

    const sec = sectionRef.current;
    const stage = stageRef.current;
    const handle = handleRef.current;
    const whereOf = (e) => {
      const t = e.target;
      if (!t || !t.closest) return null;
      if (handle && handle.contains(t)) return 'edge';
      if (stage && stage.contains(t)) return 'stage';
      if (!sec || !sec.contains(t)) return null;
      if (machine.moving || machine.p < 1) return 'stage';
      return e.clientY <= TUNING.edgePx ? 'edge' : 'graph';
    };
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const where = whereOf(e);
      if (!where) return;
      if (e.ctrlKey && where === 'graph') return; // a pinch is the graph's
      if (machine.wheel(e.deltaY, { deltaMode: e.deltaMode, where })) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('wheel', onWheel, { capture: true, passive: false });

    const onKey = (e) => {
      const k = pageKey(e);
      if (!k || e.defaultPrevented || keysBelongElsewhere(e)) return;
      if (machine.key(k)) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);

    // A link straight to a chapter goes to the graph.
    const onHash = () => { if (window.location.hash.startsWith('#read=')) machine.go('graph'); };
    window.addEventListener('hashchange', onHash);

    // A drag on the art, or on the handle, scrubs. A tap that ends a drag
    // does not also count as a tap.
    let touch = null;
    let dragged = 0;
    dragRef.current = () => Date.now() - dragged < 500;
    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      if (e.target.closest && e.target.closest('[data-cover-byline]')) return;
      touch = { y: e.touches[0].clientY, moved: 0 };
      machine.touchStart(e.touches[0].clientY, e.timeStamp || Date.now());
    };
    const onTouchMove = (e) => {
      if (!touch) return;
      e.preventDefault();
      touch.moved = Math.max(touch.moved, Math.abs(e.touches[0].clientY - touch.y));
      machine.touchMove(e.touches[0].clientY, e.timeStamp || Date.now());
    };
    const onTouchEnd = (e) => {
      if (!touch) return;
      if (touch.moved >= DRAG_PX) dragged = Date.now();
      touch = null;
      machine.touchEnd(e.timeStamp || Date.now());
    };
    const surfaces = [stage, handle].filter(Boolean);
    for (const s of surfaces) {
      s.addEventListener('touchstart', onTouchStart, { passive: true });
      s.addEventListener('touchmove', onTouchMove, { passive: false });
      s.addEventListener('touchend', onTouchEnd);
      s.addEventListener('touchcancel', onTouchEnd);
    }

    return () => {
      machine.dispose();
      if (fadeTimer) clearTimeout(fadeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', onHash);
      for (const s of surfaces) {
        s.removeEventListener('touchstart', onTouchStart);
        s.removeEventListener('touchmove', onTouchMove);
        s.removeEventListener('touchend', onTouchEnd);
        s.removeEventListener('touchcancel', onTouchEnd);
      }
      document.documentElement.removeAttribute('data-pp-cover');
      document.documentElement.style.removeProperty('--pp-cover-p');
      if (window.PostPipeCover && window.PostPipeCover.go) delete window.PostPipeCover;
      machineRef.current = null;
    };
  }, [config, reduced, start, viewState]); // eslint-disable-line react-hooks/exhaustive-deps

  const tap = (to) => {
    const m = machineRef.current;
    if (!m || dragRef.current()) return;
    if (to === 'graph') m.tapArt(); else m.tapTop();
  };

  const startArt = start === 'art';
  return (
    <>
      <div ref={coverRef} className={styles.cover} data-cover data-ground={config.ground}>
        <div ref={groundRef} className={styles.ground} data-cover-ground data-sky={config.sky ? '' : undefined}
          style={{ opacity: startArt ? 1 : 0, ...skyStyle(config.sky) }}>
          {config.sky && config.sky.texture > 0 && (
            <div className={styles.groundTexture} data-cover-ground-texture style={{ opacity: config.sky.texture, ...fromMask(config.sky.textureFrom) }} />
          )}
        </div>
        <div
          ref={stageRef}
          className={styles.stage}
          role="button"
          tabIndex={startArt ? 0 : -1}
          aria-label="Show the graph"
          data-cover-stage
          data-cover-state={start}
          onClick={(e) => {
            if (e.target.closest && e.target.closest('[data-cover-byline]')) return;
            if (machineRef.current && machineRef.current.p < 0.5) tap('graph');
          }}
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
              e.preventDefault();
              e.stopPropagation();
              tap('graph');
            }
          }}
        >
          <div ref={artRef} className={styles.art} data-cover-art style={{ opacity: 0 }}>
            <img ref={artStateRef} className={styles.image} src={config.art.artState} alt="" draggable="false"
              data-cover-image="art" style={config.art.graphState ? { opacity: startArt ? 1 : 0 } : undefined} />
            {config.art.graphState && (
              <img ref={graphStateRef} className={styles.image} src={config.art.graphState} alt="" draggable="false"
                data-cover-image="graph" style={{ opacity: startArt ? 0 : config.backdrop.opacity, ...keepMask(config.backdrop.keepAbove, 'below') }} />
            )}
            {config.art.graphState && config.backdrop.keepAbove > 0 && (
              <img ref={graphKeepRef} className={styles.image} src={config.art.graphState} alt="" draggable="false"
                data-cover-image="graph-keep" style={{ opacity: startArt ? 0 : 1, ...keepMask(config.backdrop.keepAbove, 'above') }} />
            )}
            <CoverTitle title={config.title} size={art} start={start} refs={{ art: titleArtRef, graph: titleGraphRef }} />
          </div>
          {config.alt && <span className={styles.alt} role="img" aria-label={config.alt} data-cover-alt />}
          {config.byline.text && (
            <a
              ref={bylineRef}
              className={styles.byline}
              href={config.byline.href || undefined}
              data-cover-byline
              style={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {config.byline.text}
            </a>
          )}
        </div>
        {config.reach && <svg ref={reachLayerRef} className={styles.reach} aria-hidden="true" data-cover-reach style={{ opacity: 0 }} />}
      </div>
      <div
        ref={sectionRef}
        className={styles.section}
        data-cover-section
        style={startArt ? { opacity: 0, pointerEvents: 'none' } : undefined}
      >
        {children}
      </div>
      <button
        ref={handleRef}
        type="button"
        className={styles.handle}
        aria-label="Show the cover"
        title="Show the cover"
        data-cover-handle
        tabIndex={startArt ? -1 : 0}
        style={{ opacity: startArt ? 0 : 1, pointerEvents: startArt ? 'none' : 'auto' }}
        onClick={() => tap('art')}
      >
        <span className={styles.grip} aria-hidden="true" />
      </button>
    </>
  );
}

export function Opening({ settings, viewState, children }) {
  const config = useMemo(() => openingConfig(settings), [settings]);
  if (!config) return <>{children}</>;
  return <Cover config={config} viewState={viewState}>{children}</Cover>;
}
