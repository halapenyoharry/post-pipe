import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import styles from './FeedZ.module.css';
import { Icon } from '../Icon/Icon';
import { Subscribe } from './Subscribe';

/**
 * FeedZ — pill-shaped feed list across a side of the viewport.
 *
 * Each feed is a small dimmed pill: a color dot, the feed name, an
 * integrated item count. Tap a pill to hide/unhide that feed's items in
 * the graph (without rebuilding the layout). A "+" pill at the end lets
 * you paste a feed URL — the component generates the OPML snippet to
 * the clipboard so you can add it to feeds.opml and rerun the build.
 *
 * Editing remains an OPML-tool job; this component is just a helper for
 * the common "add one" case.
 *
 * Props:
 *   sources        — array from feed._sources
 *   hiddenSources  — Set<string> of source ids currently hidden
 *   onToggleSource — (sourceId) => void
 *   viewState      — optional; enables the dot's color-ring picker and
 *                    persists the reader's choice per source
 *   showCount      — optional, default true; false hides the item count
 *                    (settings.graph.containerCount)
 *   pages          — optional; the top bar's pages (settings.topBar.pages,
 *                    src/lib/topBar.js resolvePages): a button each, after
 *                    the pills, that opens its item in the reader
 *                    (each with an optional icon, its label shown beside it
 *                    unless showLabel is false)
 *   onOpenPage     — (item) => void, for a page's button
 *   links          — optional; the top bar's links (settings.topBar.links,
 *                    src/lib/topBar.js): after the pages, an icon each that
 *                    goes to its address, its label as its name
 *   subscribe      — optional; the top bar's email sign-up
 *                    (settings.topBar.subscribe): after the links
 *   showAddButton  — optional, default true; false leaves out the "+"
 *                    (settings.topBar.addFeed; the embed's addFeed feature)
 *   intro          — optional HTML (settings.graph.intro, rendered at build
 *                    time): one short block under the pills, for a site's
 *                    bio line
 *   controls       — optional; the graph's controls when they sit in the top
 *                    bar (settings.toolbar.position top), after the rest.
 *                    The row then never wraps: when it does not fit, the
 *                    source pills after the first shrink to their dot, then
 *                    the first pill's text gives way (an ellipsis; its whole
 *                    text stays its name)
 */
export function FeedZ({ sources, hiddenSources, onToggleSource, viewState, showCount = true, pages = [], onOpenPage, links = [], subscribe = null, showAddButton = true, intro = '', controls = null }) {
  const barRef = useRef(null);
  const hasPages = Array.isArray(pages) && pages.length > 0;
  const hasLinks = Array.isArray(links) && links.length > 0;
  const fit = !!controls;
  useLayoutEffect(() => { if (fit && barRef.current) fitRow(barRef.current); });
  useEffect(() => {
    if (!fit) return undefined;
    const run = () => { if (barRef.current) fitRow(barRef.current); };
    window.addEventListener('resize', run);
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    return () => window.removeEventListener('resize', run);
  }, [fit]);
  if ((!sources || sources.length === 0) && !hasPages && !hasLinks && !subscribe && !intro && !controls) return null;

  const hidden = hiddenSources || new Set();

  return (
    <div ref={barRef} className={styles.bar} data-feeds>
      {(sources || []).map(src => (
        <FeedPill
          key={src.id}
          source={src}
          hidden={hidden.has(src.id)}
          onToggle={() => onToggleSource && onToggleSource(src.id)}
          viewState={viewState}
          showCount={showCount}
        />
      ))}
      {hasPages && pages.map((pg) => (
        <button
          key={pg.id}
          type="button"
          className={`${styles.pill} ${styles.pagePill} ${pg.icon && !pg.showLabel ? styles.iconOnly : ''}`}
          data-top-pages
          data-top-page={pg.id}
          data-has-icon={pg.icon ? '' : undefined}
          aria-label={pg.icon ? pg.label : undefined}
          title={pg.item && pg.item.title ? pg.item.title : pg.label}
          onClick={() => onOpenPage && onOpenPage(pg.item)}
        >
          {pg.icon && <Icon body={pg.icon} size={15} className={styles.pillIcon} />}
          {pg.showLabel !== false && <span className={`${styles.title} ${styles.pageLabel}`}>{pg.label}</span>}
        </button>
      ))}
      {hasLinks && links.map((l) => (
        <a
          key={l.id}
          href={l.href}
          className={`${styles.pill} ${styles.pagePill} ${styles.linkPill} ${l.icon && !l.showLabel ? styles.iconOnly : ''}`}
          data-top-link={l.id}
          data-has-icon={l.icon ? '' : undefined}
          aria-label={l.label}
          title={l.label}
          {...(l.newTab ? { target: '_blank', rel: 'noopener' } : {})}
        >
          {l.icon && <Icon body={l.icon} size={15} className={styles.pillIcon} />}
          {l.showLabel && <span className={`${styles.title} ${styles.pageLabel}`}>{l.label}</span>}
        </a>
      ))}
      {subscribe && <Subscribe config={subscribe} />}
      {showAddButton !== false && <AddPill />}
      {controls}
      {intro && <div className={styles.intro} data-graph-intro dangerouslySetInnerHTML={{ __html: intro }} />}
    </div>
  );
}

// The bar's one row: the items that sit in it (not the intro's own line,
// nor what floats out of it).
function rowItems(bar) {
  return [...bar.children].filter((el) => {
    if (el.matches('[data-graph-intro]')) return false;
    const pos = getComputedStyle(el).position;
    return pos !== 'fixed' && pos !== 'absolute' && el.getBoundingClientRect().width > 0;
  });
}

function wraps(bar) {
  const items = rowItems(bar);
  if (items.length < 2) return false;
  const top = items[0].getBoundingClientRect().top;
  return items.some((el) => Math.abs(el.getBoundingClientRect().top - top) > 2);
}

// Keeps the row on one line, each step only when the one before is not
// enough: the source pills after the first shrink to their dot; a page or
// link with an icon shows the icon alone; the first pill's text gives way.
function fitRow(bar) {
  const steps = ['data-fit-dots', 'data-fit-icons'];
  const first = bar.querySelector('[data-source-pill]');
  for (const a of [...steps, 'data-fit-title']) bar.removeAttribute(a);
  if (first) first.style.maxWidth = '';
  for (const a of steps) {
    if (!wraps(bar)) return;
    bar.setAttribute(a, '');
  }
  if (!wraps(bar) || !first) return;
  bar.setAttribute('data-fit-title', '');
  const items = rowItems(bar);
  const gap = parseFloat(getComputedStyle(bar).columnGap) || 0;
  const used = items.reduce((sum, el) => sum + el.getBoundingClientRect().width, 0) + gap * (items.length - 1);
  const over = used - bar.clientWidth;
  const w = first.getBoundingClientRect().width;
  first.style.maxWidth = `${Math.max(34, Math.floor(w - over - 1))}px`;
}

// The pill is a div (not a <button>) because it hosts a real interactive
// control of its own — the dot's ring picker is a set of <button>s, and
// nesting <button> inside <button> is invalid HTML that browsers handle
// inconsistently (the outer control can silently stop receiving events).
// role="button" + a key handler keep it keyboard-operable regardless.
function FeedPill({ source, hidden, onToggle, viewState, showCount }) {
  const title = source.title || source.id;
  const ok = source.ok !== false;
  const color = (viewState && viewState.sourceColor(source.id)) || source.color;
  return (
    <div
      className={`${styles.pill} ${hidden ? styles.hidden : ''} ${!ok ? styles.failed : ''}`}
      data-source-pill
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      role="button"
      tabIndex={0}
      title={hidden ? `Show ${title}` : `Hide ${title}`}
      style={{ '--pill-color': color }}
    >
      <FeedDot color={color} sourceId={source.id} viewState={viewState} />
      <span className={styles.title}>{title}</span>
      {showCount && <span className={styles.count}>{source.itemCount}</span>}
    </div>
  );
}

// A curated spread of hues, not a full wheel — easy to hit on a touch
// screen, wide enough to actually distinguish feeds from each other.
const RING_COLORS = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
  '#1abc9c', '#3498db', '#9b59b6', '#e84393',
];

// Dwell duration before hovering the dot opens the ring on its own, for
// anyone who doesn't want to click/tap at all.
const DWELL_MS = 650;

function FeedDot({ color, sourceId, viewState }) {
  const [ringOpen, setRingOpen] = useState(false);
  const dwellTimer = useRef(null);

  useEffect(() => () => { if (dwellTimer.current) clearTimeout(dwellTimer.current); }, []);

  const openRing = (e) => {
    e.stopPropagation();
    setRingOpen(true);
  };
  const closeRing = (e) => {
    if (e) e.stopPropagation();
    setRingOpen(false);
  };

  const handleMouseEnter = () => {
    dwellTimer.current = setTimeout(() => setRingOpen(true), DWELL_MS);
  };
  const handleMouseLeave = () => {
    if (dwellTimer.current) { clearTimeout(dwellTimer.current); dwellTimer.current = null; }
  };

  const pick = (c, e) => {
    e.stopPropagation();
    if (viewState) viewState.setSourceColor(sourceId, c);
    setRingOpen(false);
  };

  // A downward arc, not a full circle — the pill bar sits right at the top
  // edge of the viewport, so a ring centered on the dot would be clipped
  // above the browser window. Spanning just below the dot keeps every
  // swatch reachable no matter how close to the top the pill sits.
  const RADIUS = 30;
  const START_DEG = 15;
  const END_DEG = 165;
  const n = RING_COLORS.length;

  return (
    <span
      className={styles.dotWrap}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={openRing}
      onTouchEnd={openRing}
    >
      <span
        className={`${styles.dot} ${ringOpen ? styles.dotActive : ''}`}
        aria-hidden="true"
      />
      {ringOpen && (
        <>
          <span className={styles.ringBackdrop} onClick={closeRing} onTouchEnd={closeRing} />
          <span className={styles.ring}>
            {RING_COLORS.map((c, i) => {
              const deg = n === 1 ? START_DEG : START_DEG + (i / (n - 1)) * (END_DEG - START_DEG);
              const rad = (deg * Math.PI) / 180;
              const dx = RADIUS * Math.cos(rad);
              const dy = RADIUS * Math.sin(rad);
              return (
                <button
                  key={c}
                  type="button"
                  className={`${styles.swatch} ${c.toLowerCase() === String(color).toLowerCase() ? styles.swatchCurrent : ''}`}
                  style={{ left: (dx - 8) + 'px', top: (dy - 8) + 'px', background: c }}
                  onClick={(e) => pick(c, e)}
                  title={c}
                />
              );
            })}
          </span>
        </>
      )}
    </span>
  );
}

function AddPill() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  // pendingUrl is the URL the user just submitted; the result panel stays
  // open (sticky) until they explicitly dismiss it. No auto-fade.
  const [pendingUrl, setPendingUrl] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const urlIsValid = isLikelyUrl(value);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!urlIsValid) return;
    setPendingUrl(value.trim());
    setValue('');
    setOpen(false);
  };

  const close = () => {
    setValue('');
    setOpen(false);
  };

  return (
    <>
      {!open ? (
        <button
          className={`${styles.pill} ${styles.addPill}`}
          onClick={() => setOpen(true)}
          title="Add a feed"
        >
          <span className={styles.plus}>+</span>
        </button>
      ) : (
        <form className={`${styles.pill} ${styles.addOpen}`} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="url"
            placeholder="paste a feed URL…"
            className={styles.addInput}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') close(); }}
          />
          <button
            type="button"
            className={styles.addClose}
            onClick={close}
            title="Cancel"
            aria-label="Cancel"
          >×</button>
          <button
            type="submit"
            className={`${styles.addSubmit} ${urlIsValid ? styles.ready : ''}`}
            disabled={!urlIsValid}
            title={urlIsValid ? 'Continue' : 'Enter a URL first'}
            aria-label="Add feed"
          >+</button>
        </form>
      )}
      {pendingUrl && (
        <AddResultPanel
          url={pendingUrl}
          onDismiss={() => setPendingUrl(null)}
        />
      )}
    </>
  );
}

// Sticky result panel — opens right below the pill bar (where the user
// just clicked) and stays until dismissed. Shows both ways to actually
// install the feed:
//   1. CLI command (runs add-feed.js, which appends to OPML and rebuilds)
//   2. OPML snippet (for hand-editing or external OPML tools)
// Each line has its own "Copy" button so there's no ambiguity about
// which one ended up on the clipboard.
function AddResultPanel({ url, onDismiss }) {
  const [copied, setCopied] = useState('');
  const snippet = buildOutline(url);
  const cliCommand = `node add-feed.js ${shell(url)}`;

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(c => c === label ? '' : c), 1500);
    } catch (_) { /* clipboard denied; user can copy manually */ }
  };

  return (
    <div className={styles.resultPanel}>
      <button
        className={styles.resultClose}
        onClick={onDismiss}
        title="Dismiss"
        aria-label="Dismiss"
      >×</button>
      <div className={styles.resultTitle}>Add this feed</div>
      <div className={styles.resultUrl} title={url}>{url}</div>

      <div className={styles.resultSection}>
        <div className={styles.resultLabel}>One-step (recommended)</div>
        <div className={styles.resultBox}>
          <code className={styles.code}>{cliCommand}</code>
          <button
            className={`${styles.copyBtn} ${copied === 'cli' ? styles.copied : ''}`}
            onClick={() => copy(cliCommand, 'cli')}
          >
            {copied === 'cli' ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className={styles.resultHint}>
          Paste in your terminal — it appends to feeds.opml and rebuilds.
          Then refresh this page.
        </div>
      </div>

      <div className={styles.resultSection}>
        <div className={styles.resultLabel}>Or add manually</div>
        <div className={styles.resultBox}>
          <code className={styles.code}>{snippet}</code>
          <button
            className={`${styles.copyBtn} ${copied === 'opml' ? styles.copied : ''}`}
            onClick={() => copy(snippet, 'opml')}
          >
            {copied === 'opml' ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className={styles.resultHint}>
          Paste before <code className={styles.codeInline}>&lt;/body&gt;</code>{' '}
          in feeds.opml, then run <code className={styles.codeInline}>node generate-index.js</code>.
        </div>
      </div>
    </div>
  );
}

function isLikelyUrl(s) {
  const trimmed = (s || '').trim();
  if (!trimmed) return false;
  try {
    const u = new URL(trimmed);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Shell-quote a URL for safe inclusion in the CLI command suggestion.
// Single-quote everything and escape any embedded single quote.
function shell(s) {
  return `'${String(s).replace(/'/g, `'\\''`)}'`;
}

// Construct an OPML <outline> for a URL. We leave the type attribute off
// so the parser's detectType() heuristic runs — that's usually right for
// well-known feed extensions, and the user can edit if it isn't.
function buildOutline(url) {
  const safeUrl = url.replace(/"/g, '&quot;');
  return `<outline text="${urlToLabel(url)}" title="${urlToLabel(url)}" xmlUrl="${safeUrl}"/>`;
}

function urlToLabel(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (_) {
    return url;
  }
}
