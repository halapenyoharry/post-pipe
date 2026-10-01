import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './Opening.module.css';
import { openingConfig, startState, coverGeometry, createCover, pageKey, TUNING } from '../../lib/opening';

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

function Cover({ config, viewState, children }) {
  const coverRef = useRef(null);
  const groundRef = useRef(null);
  const stageRef = useRef(null);
  const artRef = useRef(null);
  const artStateRef = useRef(null);
  const graphStateRef = useRef(null);
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
    return coverGeometry(config, { vw, vh, art: sizeRef.current || { w: 1, h: 2 }, bottom: bottomInset(vh) }, p);
  };

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
    if (graphStateRef.current) {
      if (artStateRef.current) artStateRef.current.style.opacity = String(g.fade.art);
      graphStateRef.current.style.opacity = String(g.fade.graph);
    }
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
  };
  const paintRef = useRef(paint);
  paintRef.current = paint;

  // The art's size is known: the whole scrub is the art's move.
  useLayoutEffect(() => {
    if (!art) return;
    sizeRef.current = art;
    const m = machineRef.current;
    if (m) {
      m.resize(geometry(0).travel);
      paintRef.current(m.p);
    }
  }, [art]); // eslint-disable-line react-hooks/exhaustive-deps

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
          fadeTimer = setTimeout(() => {
            paintRef.current(p);
            if (coverRef.current) coverRef.current.style.opacity = '1';
            fadeTimer = setTimeout(() => { for (const el of els) el.style.transition = ''; fadeTimer = null; }, half + 20);
          }, half);
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
      go: (s, o) => machine.go(s, o),
    };

    const onResize = () => {
      machine.resize(geometry(0).travel);
      paintRef.current(machine.p);
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
        <div ref={groundRef} className={styles.ground} style={{ opacity: startArt ? 1 : 0 }} />
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
                data-cover-image="graph" style={{ opacity: startArt ? 0 : 1 }} />
            )}
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
