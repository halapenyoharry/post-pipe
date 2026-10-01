import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './FeedZ.module.css';
import { Icon } from '../Icon/Icon';
import { subscribe } from '../../lib/topBar';

/**
 * Subscribe — the top bar's email sign-up (settings.topBar.subscribe,
 * src/lib/topBar.js). An icon button that opens a small sheet under the bar
 * (role dialog): one email field, a submit button, a message line. Escape or
 * a tap outside closes it. A submit sends the address to the site's action
 * and shows thanks or the error; nothing is sent until a reader submits.
 */
export function Subscribe({ config }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const sheetRef = useRef(null);
  const inputRef = useRef(null);

  const close = (refocus) => {
    setOpen(false);
    if (refocus && buttonRef.current) buttonRef.current.focus();
  };

  // The sheet sits just under the bar (and the gear), across the screen on a
  // phone and to the right on a wide one.
  useLayoutEffect(() => {
    if (!open || !sheetRef.current) return;
    let bottom = buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom : 36;
    const gear = document.querySelector('[data-settings-gear]');
    if (gear) bottom = Math.max(bottom, gear.getBoundingClientRect().bottom);
    sheetRef.current.style.top = `${Math.round(bottom + 8)}px`;
    if (inputRef.current) inputRef.current.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      e.stopImmediatePropagation();
      close(true);
    };
    document.addEventListener('pointerdown', onDown, true);
    window.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('pointerdown', onDown, true);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  const onSubmit = async (e) => {
    if (config.newTab) return; // the form goes the plain way, into a new tab
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setResult(null);
    const r = await subscribe(config, value);
    setBusy(false);
    setResult(r);
    if (r.ok) setValue('');
  };

  return (
    <div ref={wrapRef} className={styles.subscribe} data-top-subscribe-wrap>
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.pill} ${styles.pagePill} ${config.icon ? styles.iconOnly : ''} ${open ? styles.pillOn : ''}`}
        aria-label={config.label}
        title={config.label}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-top-subscribe
        data-has-icon={config.icon ? '' : undefined}
        onClick={() => { setResult(null); setOpen((o) => !o); }}
      >
        {config.icon ? <Icon body={config.icon} size={15} className={styles.pillIcon} /> : <span className={styles.title}>{config.label}</span>}
      </button>
      {open && (
        <div ref={sheetRef} className={styles.subscribeSheet} role="dialog" aria-label={config.label} data-top-subscribe-sheet>
          <form
            className={styles.subscribeForm}
            onSubmit={onSubmit}
            {...(config.newTab ? { action: config.action, method: 'post', target: '_blank', rel: 'noopener' } : {})}
          >
            <input
              ref={inputRef}
              className={styles.subscribeInput}
              type="email"
              name={config.field}
              required
              autoComplete="email"
              placeholder={config.placeholder}
              aria-label={config.placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button type="submit" className={styles.subscribeSubmit} disabled={busy} data-top-subscribe-submit>
              {config.label}
            </button>
          </form>
          <p className={`${styles.subscribeMessage} ${result ? (result.ok ? styles.subscribeOk : styles.subscribeError) : ''}`} role="status" aria-live="polite" data-top-subscribe-message>
            {result ? result.message : ''}
          </p>
        </div>
      )}
    </div>
  );
}
