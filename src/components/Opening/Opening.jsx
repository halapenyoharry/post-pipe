import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Opening.module.css';
import { openingConfig, shouldShowOpening, createOpening, TIMINGS } from '../../lib/opening';

/**
 * Opening — the site's first screen (settings.opening; off by default): one
 * image over the whole viewport, on the theme's paper, with the graph already
 * loading underneath. A tap or click, a wheel or touch scroll, a key, or the
 * dwell plays it: the image gives way to its broken-up version, blurs and
 * fades while the roots draw in behind it, and the layer is gone. The skip
 * control (and Escape) ends it at once; the byline is a plain link.
 *
 * Shown once per reader (opening.once): a reader with anything stored here
 * goes straight to the graph. The panel's "Show the opening again" sends
 * postpipe:show-opening. While it plays the layer sends postpipe:opening
 * with detail { phase: 'play', reducedMotion } and then { phase: 'done' },
 * which the graph's roots follow.
 */

const reducedMotionNow = () => typeof window !== 'undefined' && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function announce(detail) {
  window.dispatchEvent(new CustomEvent('postpipe:opening', { detail }));
}

// Keys that move focus or only modify another key do not play the opening:
// a keyboard reader can still reach the byline and the skip control.
const QUIET_KEYS = new Set(['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Fn']);

function OpeningLayer({ config, onDone }) {
  const layerRef = useRef(null);
  const skipRef = useRef(null);
  const machineRef = useRef(null);
  const [phase, setPhase] = useState('idle');
  const [ratio, setRatio] = useState(2 / 3);
  const reduced = useMemo(reducedMotionNow, []);

  useEffect(() => {
    let finished = false;
    const machine = createOpening(config, {
      reducedMotion: reduced,
      onState(state, info) {
        if (state === 'playing') {
          if (info.phase === null) announce({ phase: 'play', reducedMotion: reduced, cause: info.cause });
          setPhase(info.phase || 'playing');
        } else if (state === 'done' && !finished) {
          finished = true;
          announce({ phase: 'done', how: info.how });
          onDone(info.how);
        }
      },
    });
    machineRef.current = machine;
    machine.start();
    if (skipRef.current) skipRef.current.focus({ preventScroll: true });

    const onKey = (e) => {
      if (machine.state === 'done') return;
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        machine.skip();
        return;
      }
      if (QUIET_KEYS.has(e.key)) return;
      const onControl = e.target && e.target.closest && e.target.closest('[data-opening-control]');
      if (onControl && (e.key === 'Enter' || e.key === ' ')) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      machine.play('key');
    };
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      machine.dispose();
    };
  }, [config, reduced, onDone]);

  const play = (cause) => (e) => {
    if (e && e.target && e.target.closest && e.target.closest('[data-opening-control]')) return;
    if (machineRef.current) machineRef.current.play(cause);
  };

  const style = {
    '--pp-opening-ratio': ratio,
    '--pp-opening-blur': `${config.blur}px`,
    '--pp-opening-swap': `${TIMINGS.swapMs}ms`,
    '--pp-opening-dissolve': `${TIMINGS.dissolveMs}ms`,
    '--pp-opening-fade': `${TIMINGS.reducedFadeMs}ms`,
  };

  return (
    <div
      ref={layerRef}
      className={styles.layer}
      role="dialog"
      aria-modal="true"
      aria-label={config.alt || undefined}
      data-opening
      data-phase={phase}
      style={style}
      onClick={play('tap')}
      onWheel={play('wheel')}
      onTouchMove={play('touch')}
    >
      <div className={styles.frame} data-opening-frame>
        <img
          className={styles.image}
          src={config.image}
          alt={config.alt}
          draggable="false"
          decoding="async"
          onLoad={(e) => {
            const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
            if (w > 0 && h > 0) setRatio(w / h);
          }}
        />
        {config.broken && (
          <img className={`${styles.image} ${styles.broken}`} src={config.broken} alt="" aria-hidden="true" draggable="false" decoding="async" data-opening-broken />
        )}
        {config.byline.text && (
          <a
            className={styles.byline}
            href={config.byline.href || undefined}
            data-opening-control
            data-opening-byline
            onClick={(e) => e.stopPropagation()}
          >
            {config.byline.text}
          </a>
        )}
      </div>
      <button
        ref={skipRef}
        type="button"
        className={styles.skip}
        data-opening-control
        data-opening-skip
        onClick={(e) => { e.stopPropagation(); if (machineRef.current) machineRef.current.skip(); }}
      >
        {config.skipLabel}
      </button>
    </div>
  );
}

export function Opening({ settings, viewState }) {
  const config = useMemo(() => openingConfig(settings), [settings]);
  const [run, setRun] = useState(() => (shouldShowOpening(config, {
    state: viewState ? viewState.state : null,
    hash: typeof window !== 'undefined' ? window.location.hash : '',
  }) ? 1 : 0));
  const [shown, setShown] = useState(run > 0);

  useEffect(() => {
    if (!config) return undefined;
    const onShow = () => { setRun((n) => n + 1); setShown(true); };
    window.addEventListener('postpipe:show-opening', onShow);
    return () => window.removeEventListener('postpipe:show-opening', onShow);
  }, [config]);

  const onDone = useMemo(() => () => {
    if (viewState && viewState.markOpeningSeen) {
      viewState.markOpeningSeen();
      // Kept at once: a reader who skips and closes the tab has seen it.
      if (viewState.flush) viewState.flush();
    }
    setShown(false);
  }, [viewState]);

  if (!config || !shown) return null;
  return <OpeningLayer key={run} config={config} onDone={onDone} />;
}
