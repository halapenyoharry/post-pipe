import React, { useEffect, useRef, useState } from 'react';
import { config as todConfig, ambienceFor } from '../../lib/timeOfDay';

/**
 * TimeOfDay — the page background, following the time of day of the piece
 * that is selected or open (settings.theme.timeOfDay; off by default). Two
 * full-screen layers behind everything: the new background is painted on
 * the hidden one, which then fades in over transitionSeconds, so the change
 * is slow and smooth whatever the browser can or cannot animate. It never
 * takes a pointer.
 *
 * The mode (dark or light) is read from <html data-pp-mode>, which the theme
 * sets; without one it is dark. The reader can turn it off in the panel
 * (viewState preference timeOfDay: false).
 */
function useMode() {
  const read = () => (typeof document !== 'undefined' && document.documentElement.getAttribute('data-pp-mode')) || 'dark';
  const [mode, setMode] = useState(read);
  useEffect(() => {
    const obs = new MutationObserver(() => setMode(read()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-pp-mode'] });
    return () => obs.disconnect();
  }, []);
  return mode;
}

const layerStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: -1,
  pointerEvents: 'none',
};

export function TimeOfDay({ item, settings, viewState }) {
  const cfg = todConfig(settings);
  const [, bump] = useState(0);
  useEffect(() => (viewState ? viewState.subscribe(() => bump((n) => n + 1)) : undefined), [viewState]);
  const mode = useMode();
  const userOn = !viewState || !viewState.preference || viewState.preference('timeOfDay') !== false;
  const amb = cfg && userOn ? ambienceFor(item, cfg, mode) : null;
  const key = amb ? `${amb.top}|${amb.bottom}` : '';

  // layers[i] holds a background; `front` is the one showing.
  const [layers, setLayers] = useState([null, null]);
  const [front, setFront] = useState(0);
  const last = useRef('');
  useEffect(() => {
    if (key === last.current) return;
    last.current = key;
    const back = 1 - front;
    setLayers((ls) => { const n = ls.slice(); n[back] = amb; return n; });
    // One frame later, so the new layer exists at opacity 0 before it fades.
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setFront(back)));
    return () => cancelAnimationFrame(id);
  }, [key]);

  useEffect(() => {
    const root = document.documentElement;
    if (amb) {
      root.setAttribute('data-pp-tod', amb.time);
      if (amb.season) root.setAttribute('data-pp-season', amb.season); else root.removeAttribute('data-pp-season');
    } else {
      root.removeAttribute('data-pp-tod');
      root.removeAttribute('data-pp-season');
    }
  }, [key]);

  if (!cfg) return null;
  const secs = cfg.transitionSeconds;
  return (
    <>
      {layers.map((l, i) => (
        <div
          key={i}
          aria-hidden="true"
          data-tod-layer={i === front && l ? 'front' : 'back'}
          data-tod-time={l ? l.time : ''}
          style={{
            ...layerStyle,
            background: l ? `linear-gradient(180deg, ${l.top} 0%, ${l.bottom} 100%)` : 'transparent',
            opacity: i === front && l ? 1 : 0,
            transition: `opacity ${secs}s ease-in-out`,
          }}
        />
      ))}
    </>
  );
}
