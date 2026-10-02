import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './Opening.module.css';
import { openingConfig, startState, coverGeometry, createCover, pageKey, titleLayout, firstInkRow, lastInkRow, inkSpan, widestInkRow, fitTitle, bylineText, gripHeight, TUNING, revealFactor, rootsBrightnessAt } from '../../lib/opening';
import { artPoint, reachFor, createLag, reachShape, reachPath, backdropOpacity } from '../../lib/reach';
import { parseRoots, rootsModel, actRoots, bentRoots, pathD, createFollow } from '../../lib/rootsVector';

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

// Where an image's ink is, read at the image's own size (a small copy loses
// the thin tips): top, the first row with ink, and bottom, the last, as
// shares of its height; above, the columns its ink spans above `crown` (a
// share of its height: the plant), and below, its widest row under it (the
// roots), { l, r } as shares of its width. null when it cannot be read.
function loadInk(src, crown) {
  return new Promise((resolve) => {
    if (!src) { resolve(null); return; }
    const img = new Image();
    img.onload = () => {
      try {
        const w = Math.min(2048, img.naturalWidth), h = Math.max(1, Math.round((img.naturalHeight * w) / img.naturalWidth));
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        const at = crown === null || crown === undefined ? 1 : crown;
        resolve({
          top: firstInkRow(data, w, h),
          bottom: lastInkRow(data, w, h),
          above: inkSpan(data, w, h, 0, at),
          below: at < 1 ? widestInkRow(data, w, h, at, 1) : null,
        });
      } catch (e) { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// The bottom edge of the page's own controls along the top (the source
// pills, the top bar's pages, the settings gear), or 0 without them. They
// stay where they are in both states.
function topControls(vh) {
  if (typeof document === 'undefined') return 0;
  let bottom = 0;
  for (const el of document.querySelectorAll('[data-feeds] > *, [data-top-pages], [data-settings-gear]')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || r.top > vh * 0.2) continue;
    bottom = Math.max(bottom, r.bottom);
  }
  return bottom;
}

// The bottom of the top bar's row: the source pills, the pages and the
// controls in line with them, and the gear (not the intro on its own line
// under them). 0 without them.
function topRowBottom(vh) {
  if (typeof document === 'undefined') return 0;
  let bottom = 0;
  for (const el of document.querySelectorAll('[data-feeds] > *:not([data-graph-intro]), [data-settings-gear]')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || r.top > vh * 0.2 || getComputedStyle(el).position === 'fixed' && !el.matches('[data-settings-gear]')) continue;
    bottom = Math.max(bottom, r.bottom);
  }
  return bottom;
}

// Keys belong to whatever is being typed in, and to the reader or a dialog
// when one has focus or is open over the page.
const KEYED_ROLES = new Set(['radio', 'slider', 'listbox', 'option', 'menu', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'tab', 'spinbutton', 'textbox', 'combobox']);
function keysBelongElsewhere(e) {
  const t = e.target;
  if (t && t.nodeType === 1) {
    if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return true;
    if (KEYED_ROLES.has(t.getAttribute('role'))) return true;
    if (t.closest('[data-reader-panel], [role="dialog"], [role="menu"], [data-settings-panel]')) return true;
    if ((e.key === ' ' || e.key === 'Spacebar') && t.closest('button, a[href], summary, [role="button"]')) return true;
  }
  if (typeof window !== 'undefined' && window.location.hash.startsWith('#read=')) return true;
  if (typeof document !== 'undefined' && document.querySelector('[data-settings-panel]')) return true;
  return false;
}

// The space the page keeps at the bottom: the rights line, when there is one
// above the foot (at the very foot, rights.position bottom-edge, it lies over
// the picture and keeps no room).
function bottomInset(vh) {
  const el = typeof document !== 'undefined' && document.querySelector('[data-rights]');
  if (!el || el.getAttribute('data-rights-position') === 'bottom-edge') return 0;
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
function createReach(cfg, layer, { reduced, seed, skip = () => null }) {
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
    // An act whose roots are drawn as vectors reaches with its own roots.
    const own = skip();
    for (const c of world.containers) {
      if (own && own.has(c.id)) continue;
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

// The roots as vectors (opening.art.rootsVector): the file's parts as
// paths in an SVG on the art's own canvas, and, each frame the acts have
// moved, each act's roots bent toward it (src/lib/rootsVector.js).
function createRootsVector(svg, model, roots) {
  const els = new Map(); // edge number -> its parts' paths
  const actOf = new Map();
  for (const [id, tips] of roots) {
    for (const tip of tips) for (const e of model.chains.get(tip) || []) if (e.tip === tip) actOf.set(e.e, id);
  }
  const frag = document.createDocumentFragment();
  for (const edge of model.edges) {
    const list = edge.parts.map((part, i) => {
      const el = document.createElementNS(SVG_NS, 'path');
      el.setAttribute('d', pathD(part.pts));
      el.setAttribute('stroke', part.stroke || '#e4e1db');
      el.setAttribute('stroke-width', String(part.width));
      el.setAttribute('data-e', String(edge.e));
      el.setAttribute('data-part', String(i));
      if (edge.tip) el.setAttribute('data-tip', edge.tip);
      if (actOf.has(edge.e)) el.setAttribute('data-act-root', actOf.get(edge.e));
      frag.appendChild(el);
      return el;
    });
    els.set(edge.e, list);
  }
  svg.setAttribute('viewBox', `0 0 ${model.w} ${model.h}`);
  svg.appendChild(frag);
  let last = '';
  return {
    // drifts: Map act id -> { dx, dy } in the art's px.
    bend(drifts) {
      const key = [...drifts].map(([id, d]) => `${id}:${d.dx.toFixed(1)},${d.dy.toFixed(1)}`).join('|');
      if (key === last) return;
      last = key;
      const bent = bentRoots(model, roots, drifts);
      for (const [e, parts] of bent) {
        const list = els.get(e);
        if (!list) continue;
        parts.forEach((pts, i) => { if (list[i]) list[i].setAttribute('d', pathD(pts)); });
      }
    },
    dispose() { for (const list of els.values()) for (const el of list) el.remove(); els.clear(); },
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
  const vectorRef = useRef(null);      // the roots' SVG (rootsVector)
  const rootsRef = useRef(null);       // { draw, acts: Set } once it has loaded
  const followRef = useRef(null);      // the roots following their acts (rootsFollowMs)
  const zoomRef = useRef(null);       // { k, homeK }: the graph's zoom, from its world
  const geomRef = useRef(null);       // the last painted geometry
  const shiftRef = useRef(0);         // how far below its rest the graph layer is drawn
  const frameRef = useRef(null);
  const titleArtRef = useRef(null);
  const titleGraphRef = useRef(null);
  const bylineRef = useRef(null);
  const sectionRef = useRef(null);
  const handleRef = useRef(null);
  const bandRef = useRef(null);
  const machineRef = useRef(null);
  const sizeRef = useRef(null);
  const dragRef = useRef(() => false);
  const [art, setArt] = useState(null); // { w, h }: the canvas
  const inkRef = useRef(null);         // { art, graph }: where each image's plant starts
  const controlsRef = useRef(0);       // the top controls' bottom edge, px
  const reduced = useMemo(reducedMotionNow, []);
  const start = useMemo(() => startState(config, {
    stored: viewState && viewState.openingState ? viewState.openingState() : null,
    hash: typeof window !== 'undefined' ? window.location.hash : '',
  }), [config, viewState]);
  // opening.graph.hiddenUntilMove: on a load that starts on the art, the
  // graph and the rootlets wait for the reader's first move, then fade in
  // (revealFactor) and stay. revealRef.current.at: when they began to.
  const hideUntilMove = !!(config.graph && config.graph.hiddenUntilMove) && start === 'art';
  const revealRef = useRef({ at: null });
  const revealNow = () => revealFactor(hideUntilMove, revealRef.current.at, performance.now());
  const reveal = () => {
    if (!hideUntilMove || revealRef.current.at !== null) return;
    revealRef.current.at = performance.now();
    document.documentElement.setAttribute('data-pp-cover-acts', 'shown');
    const step = () => {
      // Mid-swap (reduced motion) the swap paints the new state once it is
      // out of sight; the reveal does not paint ahead of it.
      if (machineRef.current && !swapRef.current) paintRef.current(machineRef.current.p);
      if (revealNow() < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const swapRef = useRef(false); // a reduced-motion swap under way
  const revealRef2 = useRef(reveal);
  revealRef2.current = reveal;

  // The canvas's natural size: the art state's image (the graph state's is
  // drawn on the same canvas).
  useEffect(() => {
    let live = true;
    const wanted = config.top || config.fit === 'width' || config.graph.rootsFit === 'width';
    const inks = wanted
      ? Promise.all([loadInk(config.art.artState, config.crownY), loadInk(config.art.graphState || config.art.artState, config.crownY)])
      : Promise.resolve([null, null]);
    Promise.all([loadSize(config.art.artState), inks]).then(([s, [a, g]]) => {
      if (!live) return;
      inkRef.current = {
        art: a ? a.top : null,
        graph: g ? g.top : null,
        bottom: g ? g.bottom : null,
        bush: a && a.above,
        roots: g && g.below,
      };
      setArt(s || { w: 1, h: 2 });
    });
    return () => { live = false; };
  }, [config]);

  // The title as drawn: with title.fit 'width', each line set to its width
  // once the face has loaded (fitTitle); and the byline's width per px of
  // its size, to set it to the last line's width.
  const [title, setTitle] = useState(config.title);
  const titleRef = useRef(config.title);
  titleRef.current = title;
  const perPxRef = useRef(null);

  const geometry = (p) => {
    const vw = window.innerWidth, vh = window.innerHeight;
    return coverGeometry(titleRef.current === config.title ? config : { ...config, title: titleRef.current }, {
      vw, vh, art: sizeRef.current || { w: 1, h: 2 }, bottom: bottomInset(vh), zoom: zoomRef.current,
      controls: controlsRef.current, ink: inkRef.current, perPx: perPxRef.current,
    }, p);
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
    // Each act's roots bend toward it by how far it is drawn from its
    // anchor, through the zoom the graph rests at, in the art's own px; a
    // little behind it (art.rootsFollowMs), so the act moves first and its
    // roots answer. Frames go on while the act eases or its roots catch up.
    const rv = rootsRef.current;
    if (rv && world && world.homeK > 0 && sizeRef.current) {
      const g1 = geometry(1);
      const perPx = sizeRef.current.w / Math.max(1, g1.art.width);
      const drifts = new Map();
      for (const c of world.containers) {
        if (c.drift && rv.acts.has(c.id)) drifts.set(c.id, { dx: c.drift.x * world.homeK * perPx, dy: c.drift.y * world.homeK * perPx });
      }
      if (!followRef.current) followRef.current = createFollow(reduced ? 0 : config.art.rootsFollowMs);
      const follow = followRef.current;
      rv.draw.bend(follow.step(drifts, performance.now()));
      if (!follow.settled() || world.moving) requestFrame();
    }
    const reach = reachRef.current;
    if (!reach || !sizeRef.current) return;
    // The graph is not drawn: nor are the rootlets, which keep their state.
    if (graphHiddenRef.current) { if (reachLayerRef.current) reachLayerRef.current.style.opacity = '0'; return; }
    const zoomed = zoomRef.current ? backdropOpacity(config.backdrop, zoomRef.current.k, zoomRef.current.homeK) : config.backdrop.opacity;
    const moving = reach.draw(performance.now(), {
      box: g.art, world, opacity: g.layer.opacity * zoomed * revealNow(), settledCover: m.p >= 1 && !m.moving,
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
  // small plant (the copy masked above keepAbove) at its own; the roots at
  // graph.rootsBrightness in the graph state, as drawn in the art state.
  const paintRoots = (g) => {
    const roots = graphStateRef.current;
    const b = rootsBrightnessAt(config, g.p);
    const filter = b === 1 ? '' : `brightness(${b.toFixed(3)})`;
    if (vectorRef.current && vectorRef.current.style.filter !== filter) vectorRef.current.style.filter = filter;
    if (roots && roots.style.filter !== filter) roots.style.filter = filter;
    // Drawn as vectors: the image's roots give way to them.
    if (rootsRef.current && vectorRef.current) {
      vectorRef.current.style.opacity = String(g.fade.graph * g.roots);
      if (roots) roots.style.opacity = '0';
    } else if (roots) roots.style.opacity = String(g.fade.graph * g.roots);
    else if (artStateRef.current) artStateRef.current.style.opacity = String(g.roots);
    if (graphKeepRef.current) graphKeepRef.current.style.opacity = String(g.fade.graph);
  };

  const sizeGrip = () => {
    const row = topRowBottom(window.innerHeight);
    const band = bandRef.current;
    if (band) band.style.height = `calc(env(safe-area-inset-top, 0px) + ${Math.ceil(row + 8)}px)`;
    const h = handleRef.current;
    if (!h) return;
    const strip = `calc(env(safe-area-inset-top, 0px) + ${gripHeight(row, config.grip)}px)`;
    if (config.returnAbove === 'crown' && sizeRef.current) {
      const g1 = geometry(1);
      const crown = g1.art.top + config.crownY * g1.art.height;
      h.style.height = `max(${strip}, ${Math.max(0, Math.round(crown))}px)`;
      h.setAttribute('data-cover-handle-to', 'crown');
    } else h.style.height = strip;
  };
  const sizeGripRef = useRef(sizeGrip);
  sizeGripRef.current = sizeGrip;

  // The top controls' bottom edge: the top bar's, or its band's.
  const controlsNow = () => {
    const band = bandRef.current;
    const b = band ? band.getBoundingClientRect().bottom : 0;
    return Math.max(topControls(window.innerHeight), b);
  };

  // Where the art sits in the graph state, for the graph's anchors.
  const publishFrame = () => {
    if (!sizeRef.current) return;
    sizeGrip();
    const g1 = geometry(1);
    window.PostPipeCoverFrame = {
      art: { left: g1.art.left, top: g1.art.top, width: g1.art.width, height: g1.art.height },
      natural: { ...sizeRef.current },
      crownY: config.crownY,
      zoomPivot: config.zoomPivot,
    };
    window.dispatchEvent(new CustomEvent('postpipe:cover-frame'));
  };
  const publishFrameRef = useRef(publishFrame);
  publishFrameRef.current = publishFrame;

  // At the art rest, with graph.artStateOpacity 0, nothing of the graph is
  // drawn or can be hit: its layers are display: none (the graph's own box
  // keeps its size). Only once the graph has laid itself out (its world is
  // published), since it measures its text as it does.
  const graphHiddenRef = useRef(false);
  const hideGraph = (el, label, g) => {
    const off = label === 'art' && g.layer.opacity === 0 && Boolean(window.PostPipeGraphWorld);
    graphHiddenRef.current = off;
    for (const c of el.children) c.style.display = off ? 'none' : '';
  };

  // Paint progress p: every moving part, straight to the DOM.
  const paint = (p) => {
    const g = geometry(p);
    const m = machineRef.current;
    const label = m && m.moving ? 'moving' : (p >= 1 ? 'graph' : p <= 0 ? 'art' : 'moving');
    const root = document.documentElement;
    root.style.setProperty('--pp-cover-p', String(g.p));
    root.setAttribute('data-pp-cover', label);
    // The top bar (and its band) only in the graph state, unless the site
    // keeps it in the art state too (topBarInArt); the stylesheet fades it.
    if (!config.topBarInArt) root.setAttribute('data-pp-cover-bar', label === 'graph' ? 'shown' : 'hidden');

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
      by.setAttribute('data-cover-byline', g.byline.under);
      // Under the title it stays a link in both states; under the art (no
      // title) it gives way as the page moves to the graph.
      const live = g.byline.under === 'title' ? label !== 'moving' : g.byline.opacity > 0.5;
      by.style.pointerEvents = live ? 'auto' : 'none';
      by.tabIndex = g.byline.under === 'title' ? (live ? 0 : -1) : (label === 'art' ? 0 : -1);
    }
    const stage = stageRef.current;
    if (stage) {
      stage.setAttribute('data-cover-state', label);
      stage.tabIndex = label === 'art' ? 0 : -1;
    }
    const sec = sectionRef.current;
    if (sec) {
      const atRest = label === 'graph';
      shiftRef.current = atRest ? 0 : g.layer.follow;
      // The layer itself carries no opacity or transform, so it makes no
      // stacking context and the controls inside it sit as before; at the
      // graph rest nothing in it carries any. Away from it: the top bar
      // stays as it is, in both states; the graph hangs from the roots,
      // moved with the art, at its art-state strength; the other controls
      // fade out below. Only the top bar takes taps until the graph rests.
      sec.style.pointerEvents = atRest ? '' : 'none';
      for (const el of sec.children) {
        if (el.matches('[data-feeds], [data-top-bar], [data-top-band], [data-cover-handle]')) continue;
        const graph = el.matches('[data-graph-root]');
        if (graph) hideGraph(el, label, g);
        const shown = graph ? revealNow() : 1;
        el.style.opacity = atRest && shown >= 1 ? '' : String(atRest ? shown : (graph ? g.layer.opacity * shown : g.graph.opacity));
        el.style.transform = atRest ? '' : (graph
          ? `translate3d(0, ${g.layer.follow}px, 0)`
          : `translate3d(0, ${g.graph.shift}px, 0)`);
        el.inert = label === 'art';
        if (label === 'art') el.setAttribute('aria-hidden', 'true');
        else el.removeAttribute('aria-hidden');
      }
      // The graph's controls in the top bar (toolbar.position top) are there
      // in both states, and take taps only once the graph rests.
      for (const el of sec.querySelectorAll('[data-top-graph-controls]')) el.inert = !atRest;
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
    sizeGrip();
    controlsRef.current = config.top ? controlsNow() : 0;
    const m = machineRef.current;
    if (m) {
      m.resize(geometry(0).travel);
      paintRef.current(m.p);
    }
    publishFrameRef.current();
    // The controls take their size once their faces have loaded.
    let live = true;
    if (config.top && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        sizeGrip();
        const c = controlsNow();
        if (!live || Math.abs(c - controlsRef.current) < 0.5) return;
        controlsRef.current = c;
        const mm = machineRef.current;
        if (mm) { mm.resize(geometry(0).travel); paintRef.current(mm.p); }
        publishFrameRef.current();
      });
    }
    return () => { live = false; };
  }, [art]); // eslint-disable-line react-hooks/exhaustive-deps

  // title.fit 'width': once the title's face has loaded, each line is
  // measured as drawn and set to its width, and the byline measured at
  // 100 px in the same face; then everything is painted again.
  useEffect(() => {
    if (!art || !config.title || config.title.fit !== 'width') return undefined;
    let live = true;
    const lengths = (ref) => (ref.current
      ? [...ref.current.querySelectorAll('[data-cover-title-line]')].map((t) => { try { return t.getComputedTextLength(); } catch (e) { return 0; } })
      : []);
    const measure = () => {
      if (!live) return;
      setTitle((t) => fitTitle(t, { art: lengths(titleArtRef), graph: lengths(titleGraphRef) }, art.w));
      const by = bylineRef.current;
      if (by) {
        const probe = document.createElement('span');
        const cs = getComputedStyle(by);
        probe.textContent = by.textContent;
        Object.assign(probe.style, {
          position: 'absolute', left: '-10000px', top: '0', visibility: 'hidden', whiteSpace: 'nowrap',
          fontFamily: cs.fontFamily, fontWeight: cs.fontWeight, letterSpacing: cs.letterSpacing, fontSize: '100px',
        });
        document.body.appendChild(probe);
        const w = probe.getBoundingClientRect().width;
        probe.remove();
        if (w > 0) perPxRef.current = w / 100;
      }
    };
    const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(() => requestAnimationFrame(measure));
    return () => { live = false; };
  }, [art, config]); // eslint-disable-line react-hooks/exhaustive-deps

  // The fitted title: paint again with its sizes, and say where the art is.
  useLayoutEffect(() => {
    if (title === config.title) return;
    const m = machineRef.current;
    if (m) paintRef.current(m.p);
    publishFrameRef.current();
  }, [title]); // eslint-disable-line react-hooks/exhaustive-deps

  // The roots as vectors: read once (the site's own file), drawn, and from
  // then on bent toward their acts each frame (drawFrame).
  useEffect(() => {
    const src = config.art.rootsVector;
    if (!src || !art || typeof fetch === 'undefined') return undefined;
    let live = true;
    let built = null;
    fetch(src).then((r) => (r.ok ? r.text() : '')).then((text) => {
      const svg = vectorRef.current;
      const model = rootsModel(parseRoots(text));
      if (!live || !svg || !model) return;
      const roots = actRoots(model, config.acts);
      built = createRootsVector(svg, model, roots);
      rootsRef.current = { draw: built, acts: new Set(roots.keys()) };
      svg.setAttribute('data-roots-vector', 'ready');
      const m = machineRef.current;
      if (m) paintRef.current(m.p);
    }).catch(() => {});
    return () => {
      live = false;
      if (built) built.dispose();
      rootsRef.current = null;
    };
  }, [config, art]); // eslint-disable-line react-hooks/exhaustive-deps

  // The rootlets' layer, and the graph's word that its world has changed.
  useEffect(() => {
    if (config.reach && reachLayerRef.current) {
      reachRef.current = createReach(config.reach, reachLayerRef.current, {
        reduced, seed: config.art.graphState || config.art.artState,
        skip: () => (rootsRef.current ? rootsRef.current.acts : null),
      });
    }
    const onWorld = () => {
      const m = machineRef.current;
      if (m && !m.moving && m.p === 0 && !graphHiddenRef.current) paintRef.current(m.p);
      requestFrame();
    };
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
        // Any move of the page is a first move (hiddenUntilMove), the
        // reduced-motion swap included.
        if (p > 0 || (info && info.swap)) revealRef2.current();
        if (info && info.swap) {
          // Reduced motion: out, swap, back in.
          const half = Math.round((info.ms || TUNING.reducedFadeMs) / 2);
          swapRef.current = true;
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
            swapRef.current = false;
            paintRef.current(p);
            for (const x of els) x.style.opacity = '1';
            fadeTimer = setTimeout(() => {
              for (const x of els) x.style.transition = '';
              if (sectionRef.current) sectionRef.current.style.opacity = '';
              fadeTimer = null;
            }, half + 20);
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
      // How far the graph is shown, 0 to 1 (opening.graph.hiddenUntilMove).
      get acts() { return revealNow(); },
      go: (s, o) => machine.go(s, o),
    };

    // The grip reaches down to the top bar's row and a little below it, or
    // with returnAbove 'crown' down to the roots' crown in the graph state.
    // The band (topBar.band) is the top bar's row and 8 px under it.
    const sizeGrip = () => sizeGripRef.current();
    sizeGrip();
    const gripFrame = requestAnimationFrame(sizeGrip);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeGrip);
    const onResize = () => {
      sizeGrip();
      if (config.top) controlsRef.current = controlsNow();
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
      if (bylineRef.current && bylineRef.current.contains(t)) return machine.p < 1 || machine.moving ? 'stage' : 'graph';
      if (!sec || !sec.contains(t)) return null;
      if (machine.moving || machine.p < 1) return 'stage';
      return e.clientY <= edgeY() ? 'edge' : 'graph';
    };
    // Above this the page's top edge: the roots' crown (returnAbove), or a
    // thin strip at the top.
    const edgeY = () => {
      if (config.returnAbove !== 'crown' || !sizeRef.current) return TUNING.edgePx;
      const g1 = geometry(1);
      return Math.max(TUNING.edgePx, g1.art.top + config.crownY * g1.art.height);
    };
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const where = whereOf(e);
      if (!where) return;
      if (e.ctrlKey && where !== 'stage') return; // a pinch is the graph's, never the page's
      if (machine.wheel(e.deltaY, { deltaMode: e.deltaMode, where })) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('wheel', onWheel, { capture: true, passive: false });

    // The first move shows the graph (opening.graph.hiddenUntilMove): a
    // scroll or swipe down, a drag, or a tap anywhere but on a top-bar control.
    const topControl = (t) => !!(t && t.closest && t.closest('[data-feeds], [data-top-bar]') && t.closest('button, a, input, select, [role="button"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"]'));
    const onFirstWheel = (e) => { if (e.deltaY > 0) revealRef2.current(); };
    const onFirstTouchMove = () => revealRef2.current();
    const onFirstDown = (e) => { if (!topControl(e.target)) revealRef2.current(); };
    if (hideUntilMove) {
      window.addEventListener('wheel', onFirstWheel, { capture: true, passive: true });
      window.addEventListener('touchmove', onFirstTouchMove, { capture: true, passive: true });
      window.addEventListener('pointerdown', onFirstDown, { capture: true, passive: true });
      document.documentElement.setAttribute('data-pp-cover-acts', 'hidden');
    }

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
    // A mouse drag down from the grip scrubs too (touch has its own above).
    let mouse = null;
    const onPointerDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      mouse = { y: e.clientY, moved: 0 };
      try { handle.setPointerCapture(e.pointerId); } catch (_) { /* not captured */ }
      machine.touchStart(e.clientY, e.timeStamp || Date.now());
    };
    const onPointerMove = (e) => {
      if (!mouse) return;
      mouse.moved = Math.max(mouse.moved, Math.abs(e.clientY - mouse.y));
      if (mouse.moved >= DRAG_PX) machine.touchMove(e.clientY, e.timeStamp || Date.now());
    };
    const onPointerUp = (e) => {
      if (!mouse) return;
      if (mouse.moved >= DRAG_PX) dragged = Date.now();
      mouse = null;
      machine.touchEnd(e.timeStamp || Date.now());
    };
    if (handle) {
      handle.addEventListener('pointerdown', onPointerDown);
      handle.addEventListener('pointermove', onPointerMove);
      handle.addEventListener('pointerup', onPointerUp);
      handle.addEventListener('pointercancel', onPointerUp);
    }
    const surfaces = [stage, handle].filter(Boolean);
    for (const s of surfaces) {
      s.addEventListener('touchstart', onTouchStart, { passive: true });
      s.addEventListener('touchmove', onTouchMove, { passive: false });
      s.addEventListener('touchend', onTouchEnd);
      s.addEventListener('touchcancel', onTouchEnd);
    }

    return () => {
      machine.dispose();
      cancelAnimationFrame(gripFrame);
      if (handle) {
        handle.removeEventListener('pointerdown', onPointerDown);
        handle.removeEventListener('pointermove', onPointerMove);
        handle.removeEventListener('pointerup', onPointerUp);
        handle.removeEventListener('pointercancel', onPointerUp);
      }
      if (fadeTimer) clearTimeout(fadeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('wheel', onFirstWheel, { capture: true });
      window.removeEventListener('touchmove', onFirstTouchMove, { capture: true });
      window.removeEventListener('pointerdown', onFirstDown, { capture: true });
      document.documentElement.removeAttribute('data-pp-cover-acts');
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
            {config.art.rootsVector && (
              <svg ref={vectorRef} className={styles.roots} aria-hidden="true" data-roots-vector="loading"
                preserveAspectRatio="none" viewBox={art ? `0 0 ${art.w} ${art.h}` : undefined}
                style={{ opacity: 0, ...keepMask(config.backdrop.keepAbove, 'below') }} />
            )}
            <CoverTitle title={title} size={art} start={start} refs={{ art: titleArtRef, graph: titleGraphRef }} />
          </div>
          {config.alt && <span className={styles.alt} role="img" aria-label={config.alt} data-cover-alt />}
        </div>
        {config.reach && <svg ref={reachLayerRef} className={styles.reach} aria-hidden="true" data-cover-reach style={{ opacity: 0 }} />}
      </div>
      <div
        ref={sectionRef}
        className={styles.section}
        data-cover-section
        style={startArt ? { pointerEvents: 'none' } : undefined}
      >
        {children}
        {config.band && (
          <div ref={bandRef} className={styles.band} data-top-band aria-hidden="true" style={{ background: config.band.color }} />
        )}
        {/* The grip: the whole top strip, under the top bar's controls (they
            keep their taps) and over the graph; the mark is the hint. */}
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
      </div>
      {config.byline.text && (
        // Over the graph layer, so it stays a link in the graph state too.
        <a
          ref={bylineRef}
          className={`${styles.byline} ${config.title ? styles.bylineTitle : ''}`}
          href={config.byline.href || undefined}
          data-cover-byline={config.title ? 'title' : 'art'}
          style={{
            opacity: 0,
            ...(config.title ? { fontFamily: config.title.family, color: config.title.color || undefined } : null),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {bylineText(config.byline)}
        </a>
      )}
    </>
  );
}

export function Opening({ settings, viewState, children }) {
  const config = useMemo(() => openingConfig(settings), [settings]);
  if (!config) return <>{children}</>;
  return <Cover config={config} viewState={viewState}>{children}</Cover>;
}
