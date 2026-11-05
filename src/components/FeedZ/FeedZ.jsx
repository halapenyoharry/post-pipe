import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import styles from './FeedZ.module.css';
import { Icon } from '../Icon/Icon';
import { Subscribe } from './Subscribe';
import { sourceStatus } from '../../lib/sourceStatus';
import { discoverSource } from '../../lib/feedAutodiscovery';
import { buildOutline, buildPageOutline, buildCommand } from '../../lib/addFeedLine';
import { groupSourcesByFolder, toggleFolderSources } from '../../lib/sourceFolders';

/**
 * FeedZ — pill-shaped feed list across a side of the viewport.
 *
 * Each feed is a small dimmed pill: a color dot, the feed name, an
 * integrated item count. Tap a pill to hide/unhide that feed's items in
 * the graph (without rebuilding the layout). A "+" pill at the end lets
 * you paste a feed URL — the component generates the OPML snippet to
 * the clipboard so you can add it to feeds.opml and rerun the build.
 * When the address answers with a page that names no feed, the snippet
 * is a type="page" entry instead: the page itself as one item.
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
 *   resume         — optional; the top bar's resume button
 *                    (settings.topBar.resume): opens the reader where this
 *                    reader was, through onResume
 *   order          — optional; the buttons' order as keys ('resume',
 *                    'page:<id>', 'link:<id>', 'subscribe'), from
 *                    topBarOrder (settings.topBar.order)
 *   showAddButton  — optional, default true; false leaves out the "+"
 *   showSources    — optional, default true; false leaves out the source
 *                    pills (settings.topBar.showSourcePills)
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
 *   views          — optional; the site's views (settings.views,
 *                    src/lib/views.js siteViews), entries { id, label }:
 *                    a button each, in the pill style, after the pages and
 *                    links, shown only when there is more than one
 *   currentView    — the id of the view in force (src/lib/views.js
 *                    currentView); its button is marked
 *   onSelectView   — (id) => void, for a view's button
 *   staleAge       — optional, default false; true shows the age of a stale
 *                    feed's copy beside its mark ("! 2d"), not only in the
 *                    pill's title (settings.topBar.staleAge), for a screen
 *                    with no hover to show a title
 *
 * A feed whose fetch failed when the site was built (src/lib/sourceStatus.js):
 * when its cards come from its last good copy (source.stale), its pill shows
 * a small mark after the count, and its title says the fetch failed, why, and
 * the copy's day and age; with no copy, the pill is struck through, its title
 * saying why.
 */
export function FeedZ({ sources, hiddenSources, onToggleSource, viewState, showCount = true, pages = [], onOpenPage, links = [], subscribe = null, resume = null, onResume, order = null, showAddButton = true, intro = '', controls = null, showSources = true, staleAge = false, autodiscover = true, groupByFolder = false, views = [], currentView = null, onSelectView }) {
  const barRef = useRef(null);
  const hasPages = Array.isArray(pages) && pages.length > 0;
  const hasLinks = Array.isArray(links) && links.length > 0;
  const viewList = Array.isArray(views) ? views.filter((v) => v && v.id) : [];
  const hasViews = viewList.length > 1;
  const fit = !!controls;
  useLayoutEffect(() => { if (fit && barRef.current) fitRow(barRef.current); });
  useEffect(() => {
    if (!fit) return undefined;
    const run = () => { if (barRef.current) fitRow(barRef.current); };
    window.addEventListener('resize', run);
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    return () => window.removeEventListener('resize', run);
  }, [fit]);
  if (showSources === false) sources = [];
  if ((!sources || sources.length === 0) && !hasPages && !hasLinks && !subscribe && !resume && !intro && !controls && !hasViews) return null;

  const hidden = hiddenSources || new Set();

  // The buttons after the source pills, in the site's order (topBar.order,
  // src/lib/topBar.js topBarOrder); without one, resume, pages, links, then
  // the sign-up.
  const buttonOrder = Array.isArray(order) && order.length ? order : [
    ...(resume ? ['resume'] : []),
    ...(hasPages ? pages.map((p) => `page:${p.id}`) : []),
    ...(hasLinks ? links.map((l) => `link:${l.id}`) : []),
    ...(subscribe ? ['subscribe'] : []),
  ];
  const renderPage = (pg) => (
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
  );
  const renderLink = (l) => (
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
  );
  // topBar.resume: opens the reader where this reader was, or at the start.
  const renderResume = () => (resume ? (
    <button
      key="resume"
      type="button"
      className={`${styles.pill} ${styles.pagePill} ${resume.icon && !resume.showLabel ? styles.iconOnly : ''}`}
      data-top-resume
      data-has-icon={resume.icon ? '' : undefined}
      aria-label={resume.label}
      title={resume.label}
      onClick={() => onResume && onResume()}
    >
      {resume.icon && <Icon body={resume.icon} size={15} className={styles.pillIcon} />}
      {resume.showLabel && <span className={`${styles.title} ${styles.pageLabel}`}>{resume.label}</span>}
    </button>
  ) : null);

  // The view switch (settings.views): one plain button per view in the pill
  // style, the one in force marked; only when the site lists more than one.
  const renderViews = () => (hasViews ? (
    <span key="views" className={styles.views} data-top-views role="group" aria-label="View">
      {viewList.map((v) => {
        const on = v.id === currentView;
        return (
          <button
            key={v.id}
            type="button"
            className={`${styles.pill} ${styles.pagePill} ${on ? styles.pillOn : ''}`}
            data-top-view={v.id}
            aria-pressed={on}
            title={v.label || v.id}
            onClick={() => { if (!on && onSelectView) onSelectView(v.id); }}
          >
            <span className={`${styles.title} ${styles.pageLabel}`}>{v.label || v.id}</span>
          </button>
        );
      })}
    </span>
  ) : null);

  const renderSourcePill = (src) => (
    <FeedPill
      key={src.id}
      source={src}
      hidden={hidden.has(src.id)}
      onToggle={() => onToggleSource && onToggleSource(src.id)}
      viewState={viewState}
      showCount={showCount}
      staleAge={staleAge}
    />
  );

  const handleToggleFolder = (folderPath) => {
    if (!onToggleSource) return;
    const { ids } = toggleFolderSources(sources || [], folderPath, hidden);
    for (const id of ids) onToggleSource(id);
  };

  return (
    <div ref={barRef} className={styles.bar} data-feeds>
      {groupByFolder ? groupSourcesByFolder(sources || []).map((group) => (
        <React.Fragment key={group.folder || '__root__'}>
          {group.folder && (
            <FolderPill
              group={group}
              allHidden={group.sources.length > 0 && group.sources.every((s) => hidden.has(s.id))}
              onToggle={() => handleToggleFolder(group.folder)}
              showCount={showCount}
            />
          )}
          {group.sources.map(renderSourcePill)}
        </React.Fragment>
      )) : (sources || []).map(renderSourcePill)}
      {buttonOrder.map((k) => {
        if (k === 'resume') return renderResume();
        if (k === 'subscribe') return subscribe ? <Subscribe key="subscribe" config={subscribe} /> : null;
        if (k.startsWith('page:')) { const pg = pages.find((p) => `page:${p.id}` === k); return pg ? renderPage(pg) : null; }
        if (k.startsWith('link:')) { const l = links.find((x) => `link:${x.id}` === k); return l ? renderLink(l) : null; }
        return null;
      })}
      {renderViews()}
      {showAddButton !== false && <AddPill autodiscover={autodiscover} />}
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
// The build's word on the feed (sourceStatus): a stale feed (its fetch
// failed, its cards from its last good copy) gets a small mark after the
// count, the copy's age beside it when staleAge is on; a failed feed with no
// copy is struck through. Either way the pill's title says why.
function FolderPill({ group, allHidden, onToggle, showCount }) {
  const action = allHidden ? `Show ${group.folder}` : `Hide ${group.folder}`;
  return (
    <button
      type="button"
      className={`${styles.pill} ${styles.folderPill} ${allHidden ? styles.hidden : ''}`}
      data-source-folder={group.folder}
      onClick={onToggle}
      title={action}
    >
      <span className={styles.folderPrefix} aria-hidden="true">/</span>
      <span className={styles.title}>{group.folder}</span>
      {showCount && <span className={styles.count}>{group.itemCount}</span>}
    </button>
  );
}

function FeedPill({ source, hidden, onToggle, viewState, showCount, staleAge }) {
  const title = source.title || source.id;
  const status = sourceStatus(source);
  const failed = Boolean(status && status.kind === 'failed');
  const stale = Boolean(status && status.kind === 'stale');
  const color = (viewState && viewState.sourceColor(source.id)) || source.color;
  const action = hidden ? `Show ${title}` : `Hide ${title}`;
  return (
    <div
      className={`${styles.pill} ${hidden ? styles.hidden : ''} ${failed ? styles.failed : ''}`}
      data-source-pill
      data-source-stale={stale ? '' : undefined}
      data-source-failed={failed ? '' : undefined}
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      role="button"
      tabIndex={0}
      title={status ? `${action} · ${status.note}` : action}
      style={{ '--pill-color': color }}
    >
      <FeedDot color={color} sourceId={source.id} viewState={viewState} />
      <span className={styles.title}>{title}</span>
      {showCount && <span className={styles.count}>{source.itemCount}</span>}
      {stale && (
        <span className={styles.staleMark} data-stale-mark title={status.note}
          role="img" aria-label={status.age ? `not fetched, the copy is ${status.age.long}` : 'not fetched, an earlier copy'}>
          <span aria-hidden="true">!</span>
          {staleAge && status.age && <span className={styles.staleAge} aria-hidden="true" data-stale-age>{status.age.short}</span>}
        </span>
      )}
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

function AddPill({ autodiscover = true }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  // pendingUrl is the URL the user just submitted; the result panel stays
  // open (sticky) until they explicitly dismiss it. No auto-fade.
  const [pendingUrl, setPendingUrl] = useState(null);
  // The route the panel shows for it: 'feed' (as ever) or, when
  // autodiscovery read an HTML page that names no feed, 'page' (the page
  // itself as one item), with the page's own title when it has one.
  const [pendingKind, setPendingKind] = useState('feed');
  const [pendingTitle, setPendingTitle] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const urlIsValid = isLikelyUrl(value);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!urlIsValid) return;
    const submitted = value.trim();
    setPendingUrl(submitted);
    setPendingKind('feed');
    setPendingTitle('');
    setValue('');
    setOpen(false);
    if (autodiscover !== false) {
      discoverSource(submitted, { autodiscover: true }).then((found) => {
        if (!found) return;
        if (found.kind === 'feed' && found.url && found.url !== submitted) {
          setPendingUrl((cur) => (cur === submitted ? found.url : cur));
        } else if (found.kind === 'page') {
          setPendingUrl((cur) => {
            if (cur === submitted) { setPendingKind('page'); setPendingTitle(found.title || ''); }
            return cur;
          });
        }
      });
    }
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
          kind={pendingKind}
          pageTitle={pendingTitle}
          onKind={setPendingKind}
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
// kind 'page' (autodiscovery found an HTML page with no feed) shows the
// same two ways for a type="page" entry, the page itself as one item, and
// a line to take the feed route anyway; onKind switches between the two.
function AddResultPanel({ url, kind = 'feed', pageTitle = '', onKind, onDismiss }) {
  const [copied, setCopied] = useState('');
  const isPage = kind === 'page';
  const snippet = isPage ? buildPageOutline(url, pageTitle) : buildOutline(url);
  const cliCommand = buildCommand(url, isPage ? 'page' : 'feed', pageTitle);

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
      <div className={styles.resultTitle} data-add-kind={isPage ? 'page' : 'feed'}>{isPage ? 'Add this page' : 'Add this feed'}</div>
      <div className={styles.resultUrl} title={url}>{url}</div>
      {isPage && (
        <div className={styles.resultHint} data-add-no-feed>
          No feed was found at this address, so it is listed as one page: one card, in its place by its tags.
          {typeof onKind === 'function' && (
            <>
              {' '}
              <button type="button" className={styles.resultLink} onClick={() => onKind('feed')}>Add it as a feed anyway</button>
            </>
          )}
        </div>
      )}

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

// The lines the panel shows (the <outline>, the command) are made in
// src/lib/addFeedLine.js, so their text is tested without the component.
