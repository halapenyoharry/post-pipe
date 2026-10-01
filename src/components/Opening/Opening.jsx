import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './Opening.module.css';
import { openingConfig, startState, coverGeometry, createCover, pageKey, TUNING } from '../../lib/opening';

/**
 * Opening — the two-state page (settings.opening; off by default). The top of
 * the page is the cover art, full size on a dark ground, with the byline
 * under it; below it, mounted once and never unmounted, hangs the graph
 * section (this component's children). Scrolling, a touch drag, a key or a
 * tap moves one progress value between the two rests: the bush shrinks into a
 * band across the top, the roots keep their size under it, and the graph
 * rises to meet the root tips. Every frame is written straight to the DOM
 * from src/lib/opening.js's geometry, so scrubbing never re-renders React.
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

function Cover({ config, viewState, children }) {
  const stageRef = useRef(null);
  const bushRef = useRef(null);
  const rootsRef = useRef(null);
  const fullRef = useRef(null);
  const bylineRef = useRef(null);
  const sectionRef = useRef(null);
  const machineRef = useRef(null);
  const geoRef = useRef(null);
  const [sizes, setSizes] = useState(null);
  const reduced = useMemo(reducedMotionNow, []);
  const start = useMemo(() => startState(config, {
    stored: viewState && viewState.openingState ? viewState.openingState() : null,
    hash: typeof window !== 'undefined' ? window.location.hash : '',
  }), [config, viewState]);

  // The art's natural sizes decide the whole geometry, so the graph section
  // waits for them (the files are next to the page) and mounts at its size.
  useEffect(() => {
    let live = true;
    Promise.all([loadSize(config.art.bush), loadSize(config.art.roots)]).then(([bush, roots]) => {
      if (!live) return;
      setSizes({ bush: bush || { w: 2, h: 2 }, roots: roots || { w: 2, h: 1 } });
    });
    return () => { live = false; };
  }, [config]);

  // Paint progress p: every moving part, straight to the DOM.
  const paint = (p) => {
    if (!sizes) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const g = coverGeometry(config, { vw, vh, bush: sizes.bush, roots: sizes.roots }, p);
    geoRef.current = g;
    const root = document.documentElement;
    const shift = g.graphTop - g.graphRestTop;
    root.style.setProperty('--pp-cover-shift', `${shift}px`);
    root.style.setProperty('--pp-cover-p', String(g.p));
    const stage = stageRef.current;
    if (stage) stage.style.height = `${g.graphTop}px`;
    const place = (el, box, k) => {
      if (!el) return;
      el.style.width = `${box.width / (k || 1)}px`;
      el.style.height = `${box.height / (k || 1)}px`;
      el.style.transform = `translateX(-50%) translateY(${box.top}px) scale(${k || 1})`;
    };
    // The bush is drawn at the art state's size and scaled down from there,
    // anchored top centre, so it stays sharp at the top rest.
    const k0 = g.roots.scale;
    place(bushRef.current, { ...g.bush, width: g.bush.width, height: g.bush.height }, g.bush.scale / k0);
    place(rootsRef.current, g.roots, 1);
    if (fullRef.current) {
      const f = fullRef.current;
      f.style.width = `${g.artWidth}px`;
      f.style.height = `${g.artHeight}px`;
      f.style.transform = `translateX(-50%) translateY(${g.artTop}px)`;
      f.style.opacity = g.p === 0 ? '1' : '0';
    }
    const by = bylineRef.current;
    if (by) {
      by.style.left = `${g.byline.x}px`;
      by.style.top = `${g.byline.y}px`;
      by.style.fontSize = `${g.byline.size}px`;
      by.style.transform = `translateX(${-g.byline.anchor * 100}%)`;
      by.style.maxWidth = g.p > 0.5 ? `${Math.max(60, vw - g.byline.x - 10)}px` : `${vw - 20}px`;
    }
    const sec = sectionRef.current;
    if (sec) {
      sec.style.top = `${g.graphRestTop}px`;
      sec.style.height = `${Math.max(0, vh - g.graphRestTop)}px`;
      sec.style.transform = `translate3d(0, ${shift}px, 0)`;
    }
    const m = machineRef.current;
    const label = !m || m.moving ? 'moving' : m.rest;
    root.setAttribute('data-pp-cover', label);
    if (stage) {
      stage.setAttribute('data-cover-state', label);
      stage.setAttribute('aria-label', g.p < 0.5 ? 'Show the graph' : 'Show the cover');
    }
    if (sec) {
      const away = g.p === 0;
      sec.inert = away;
      if (away) sec.setAttribute('aria-hidden', 'true');
      else sec.removeAttribute('aria-hidden');
    }
  };
  const paintRef = useRef(paint);
  paintRef.current = paint;

  // The machine, once the sizes are known. Its rests are remembered.
  useLayoutEffect(() => {
    if (!sizes) return undefined;
    const travel = () => {
      const g = coverGeometry(config, { vw: window.innerWidth, vh: window.innerHeight, bush: sizes.bush, roots: sizes.roots }, 1);
      return window.innerHeight - g.graphRestTop;
    };
    let fadeTimer = null;
    const machine = createCover(config, {
      start,
      reducedMotion: reduced,
      travel: travel(),
      frame: (fn) => requestAnimationFrame(fn),
      cancelFrame: (h) => cancelAnimationFrame(h),
      onChange(p, info) {
        if (info && info.swap) {
          // Reduced motion: out, swap, back in.
          const half = Math.round((info.ms || TUNING.reducedFadeMs) / 2);
          const els = [stageRef.current, sectionRef.current].filter(Boolean);
          for (const el of els) { el.style.transition = `opacity ${half}ms linear`; el.style.opacity = '0'; }
          if (fadeTimer) clearTimeout(fadeTimer);
          fadeTimer = setTimeout(() => {
            paintRef.current(p);
            for (const el of els) el.style.opacity = '1';
            fadeTimer = setTimeout(() => { for (const el of els) el.style.transition = ''; fadeTimer = null; }, half + 20);
          }, half);
          return;
        }
        paintRef.current(p);
      },
      onRest(state) {
        paintRef.current(machine.p);
        if (viewState && viewState.setOpeningState) viewState.setOpeningState(state);
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

    let reentrant = false;
    const onResize = () => {
      if (reentrant) return;
      machine.resize(travel());
      paintRef.current(machine.p);
      // The graph measures itself on resize too, and may have done so before
      // the section took its new size: tell it again, once.
      requestAnimationFrame(() => {
        reentrant = true;
        window.dispatchEvent(new Event('resize'));
        reentrant = false;
      });
    };
    window.addEventListener('resize', onResize);

    const sec = sectionRef.current;
    const stage = stageRef.current;
    const whereOf = (e) => {
      const t = e.target;
      if (stage && stage.contains(t)) return 'stage';
      if (!sec || !sec.contains(t)) return null;
      const graph = t.closest && t.closest('[data-graph-root]');
      if (!graph) return machine.p === 1 && !machine.moving ? null : 'stage';
      const top = sec.getBoundingClientRect().top;
      return e.clientY - top <= TUNING.edgePx ? 'edge' : 'graph';
    };
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const where = whereOf(e);
      if (!where) return;
      if (e.ctrlKey && where !== 'stage') return; // a pinch is the graph's
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

    // A drag on the art or the band scrubs.
    let touching = false;
    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      if (e.target.closest && e.target.closest('[data-cover-byline]')) return;
      touching = true;
      machine.touchStart(e.touches[0].clientY, e.timeStamp || Date.now());
    };
    const onTouchMove = (e) => {
      if (!touching) return;
      e.preventDefault();
      machine.touchMove(e.touches[0].clientY, e.timeStamp || Date.now());
    };
    const onTouchEnd = (e) => {
      if (!touching) return;
      touching = false;
      machine.touchEnd(e.timeStamp || Date.now());
    };
    if (stage) {
      stage.addEventListener('touchstart', onTouchStart, { passive: true });
      stage.addEventListener('touchmove', onTouchMove, { passive: false });
      stage.addEventListener('touchend', onTouchEnd);
      stage.addEventListener('touchcancel', onTouchEnd);
    }

    return () => {
      machine.dispose();
      if (fadeTimer) clearTimeout(fadeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', onHash);
      if (stage) {
        stage.removeEventListener('touchstart', onTouchStart);
        stage.removeEventListener('touchmove', onTouchMove);
        stage.removeEventListener('touchend', onTouchEnd);
        stage.removeEventListener('touchcancel', onTouchEnd);
      }
      document.documentElement.removeAttribute('data-pp-cover');
      if (window.PostPipeCover && window.PostPipeCover.go) delete window.PostPipeCover;
      machineRef.current = null;
    };
  }, [sizes, config, reduced, start, viewState]);

  const toggle = () => {
    const m = machineRef.current;
    if (!m) return;
    if (m.p < 0.5) m.tapArt();
    else m.tapBand();
  };

  return (
    <div className={styles.cover} data-cover data-ground={config.ground}>
      <div
        ref={stageRef}
        className={styles.stage}
        role="button"
        tabIndex={0}
        aria-label="Show the graph"
        data-cover-stage
        data-cover-state={start}
        onClick={(e) => {
          if (e.target.closest && e.target.closest('[data-cover-byline]')) return;
          toggle();
        }}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            e.stopPropagation();
            toggle();
          }
        }}
      >
        <img ref={bushRef} className={styles.art} src={config.art.bush} alt="" aria-hidden="true" draggable="false" data-cover-bush />
        <img ref={rootsRef} className={styles.art} src={config.art.roots} alt="" aria-hidden="true" draggable="false" data-cover-roots />
        {config.art.full && (
          <img ref={fullRef} className={styles.art} src={config.art.full} alt="" aria-hidden="true" draggable="false" data-cover-full />
        )}
        {config.alt && <span className={styles.alt} role="img" aria-label={config.alt} data-cover-alt />}
        {config.byline.text && (
          <a
            ref={bylineRef}
            className={styles.byline}
            href={config.byline.href || undefined}
            data-cover-byline
            onClick={(e) => e.stopPropagation()}
          >
            {config.byline.text}
          </a>
        )}
      </div>
      {sizes && (
        <div ref={sectionRef} className={styles.section} data-cover-section>
          {children}
        </div>
      )}
    </div>
  );
}

export function Opening({ settings, viewState, children }) {
  const config = useMemo(() => openingConfig(settings), [settings]);
  if (!config) return <>{children}</>;
  return <Cover config={config} viewState={viewState}>{children}</Cover>;
}
