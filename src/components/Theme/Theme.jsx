import { useEffect, useState } from 'react';
import { themeName, themeMode } from '../../lib/theme';

/**
 * Theme — puts the chosen theme and mode on <html> as data-pp-theme and
 * data-pp-mode, where every stylesheet reads them. Renders nothing. Follows
 * the device's light or dark setting live when the viewer has not chosen.
 */
export function Theme({ settings, viewState }) {
  const [, bump] = useState(0);
  const mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const [prefersDark, setPrefersDark] = useState(mq ? mq.matches : true);
  useEffect(() => (viewState ? viewState.subscribe(() => bump((n) => n + 1)) : undefined), [viewState]);
  useEffect(() => {
    if (!mq) return;
    const on = (e) => setPrefersDark(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', on); else mq.addListener(on);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', on); else mq.removeListener(on); };
  }, []);
  const name = themeName(settings, viewState && viewState.preference ? viewState.preference('theme') : null);
  const mode = themeMode(name, viewState && viewState.preference ? viewState.preference('mode') : null, prefersDark);
  useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute('data-pp-theme') !== name) root.setAttribute('data-pp-theme', name);
    if (root.getAttribute('data-pp-mode') !== mode) root.setAttribute('data-pp-mode', mode);
    root.style.colorScheme = mode;
  }, [name, mode]);
  return null;
}
