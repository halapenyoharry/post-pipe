import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './ReaderPanel.module.css';
import { ICONS } from '../../utils/icons';
import { resolveParagraph } from '../../lib/resolveParagraph';
import { readerHeader } from '../../lib/readerHeader';
import { progressBarMode, allowDownload } from '../../lib/readerSettings';
import { attachFollowAlong } from './followHighlighter';
import { boldStartHtml } from './boldStartHtml';
import { rightsLine } from '../../lib/rights';
import { neighbours, navStatus, isReadable, step } from '../../lib/readerNav';
import { Contributions } from './Contributions';


// contributions: what readers brought (settings.contributions), already
// filtered to what this page shows; contributionsConfig its settings.
export function ReaderPanel({ article, onClose, settings, viewState, targetParagraph, feedData, onNavigate, contributions, contributionsConfig }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [floatingPos, setFloatingPos] = useState(null);
  const [showFrontmatter, setShowFrontmatter] = useState(false);
  const [contentHtml, setContentHtml] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  // Reader always leaves the graph visible — `wide` toggles between
  // narrow (540px) and wide (760px).
  const [wide, setWide] = useState(false);
  const bodyRef = useRef(null);
  // The chapter's own text, apart from everything drawn around it.
  const textRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  // A page turn: 'next' or 'prev' while the old chapter leaves and the new
  // one arrives, null otherwise.
  const [turnOut, setTurnOut] = useState(null);
  const [turnIn, setTurnIn] = useState(null);
  const turnTimers = useRef([]);

  // Derive initial state when article changes
  useEffect(() => {
    // A save still waiting belongs to the chapter that is leaving.
    if (saveTimer.current) { clearTimeout(saveTimer.current); saveProgress(); }
    if (article) {
      setIsOpen(true);
      setIsMinimized(false);
      setTurnOut(null);
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
      setScrollProgress(0);
      fetchContent(article);
    } else {
      setIsOpen(false);
      setIsMinimized(false);
      setContentHtml('');
      setScrollProgress(0);
      setShowFrontmatter(false);
    }
  }, [article]);

  const getPersistentId = (item) => {
    if (!item) return null;
    return (item.originalItem && item.originalItem.id) || item.id || item.url;
  };

  // A bookmark belongs to an item (b.item); its own id is separate.
  const pId = getPersistentId(article);
  const itemBookmarks = viewState && pId ? viewState.bookmarks(pId) : [];

  // Bold word beginnings (Settings → Reading): applied to the drawn copy
  // only; contentHtml stays the text as published.
  const boldOn = Boolean(viewState && viewState.readerAid && viewState.readerAid('boldStart'));
  const displayHtml = useMemo(() => (boldOn ? boldStartHtml(contentHtml) : contentHtml), [contentHtml, boldOn]);
  // One object per text: React resets innerHTML whenever this object is new,
  // which on every scroll wiped anything drawn into the text (a passage a
  // reader's comment points at, the follow-along marks).
  const textInner = useMemo(() => ({ __html: displayHtml }), [displayHtml]);

  const handleToolbarMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: floatingPos ? floatingPos.x : 0,
      posY: floatingPos ? floatingPos.y : 0,
    };
    window.addEventListener('mousemove', handleToolbarMouseMove);
    window.addEventListener('mouseup', handleToolbarMouseUp);
  };

  const handleToolbarMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    setFloatingPos({
      x: dragStartRef.current.posX + dx,
      y: dragStartRef.current.posY + dy,
    });
  };

  const handleToolbarMouseUp = () => {
    isDraggingRef.current = false;
    window.removeEventListener('mousemove', handleToolbarMouseMove);
    window.removeEventListener('mouseup', handleToolbarMouseUp);
  };

  const fetchContent = async (item) => {
    const kind = item.kind || 'essay';

    if (kind === 'placeholder' || item.substrate === 'placeholder') {
      const partNum = item.series_part || item.title || '';
      const actNum = Number(partNum) >= 21 ? '3' : '2';
      setContentHtml(`
        <div style="padding: 40px 24px; text-align: center; border: 1px dashed rgba(212, 175, 55, 0.35); border-radius: 12px; background: rgba(20, 24, 38, 0.6); margin-top: 24px;">
          <div style="font-size: 32px; margin-bottom: 12px; opacity: 0.9;">📖</div>
          <div style="font-size: 20px; font-weight: 600; color: var(--rp-accent, #d4af37); margin-bottom: 8px;">Chapter ${partNum}</div>
          <div style="font-size: 13px; color: var(--rp-text, #a8b2d1); opacity: 0.8; letter-spacing: 0.5px;">Act ${actNum} · In Progress</div>
        </div>
      `);
      return;
    }

    // A title-only piece has no page to fetch: say what is coming instead.
    if (item._posted === 'title') {
      const status = navStatus(feedData, item) || '';
      setContentHtml(`<div class="${styles.notYet}" data-not-yet><div class="${styles.notYetTitle}">${escapeHtml(item.title || '')}</div><div class="${styles.notYetStatus}">${escapeHtml(status)}</div></div>`);
      return;
    }

    if (kind === 'essay' || kind === 'multi') {
      try {
        const filename = (item.url || '').split('/').pop();
        let r;
        // If current origin differs from item.url (e.g. previewing on localhost),
        // try the local sibling file first
        try {
          const isSameOrigin = item.url && new URL(item.url, window.location.href).origin === window.location.origin;
          if (!isSameOrigin && filename) {
            r = await fetch('./' + filename);
          }
        } catch (_) {}

        if (!r || !r.ok) {
          try {
            r = await fetch(item.url);
          } catch (_) {}
        }

        if (!r || !r.ok) {
          if (filename) {
            r = await fetch('./' + filename);
          }
        }

        if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : 'failed'));
        const html = await r.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const h1 = doc.querySelector('h1');
        if (h1) h1.remove();
        // The page's own rights footer; the reader draws its own line.
        doc.querySelectorAll('.pp-rights').forEach((el) => el.remove());
        let bodyHtml = doc.querySelector('body') ? doc.querySelector('body').innerHTML : html;
        setContentHtml(bodyHtml + renderCompanions(item));
      } catch (e) {
        setContentHtml(renderPlaceholder(item, 'Rendered article not yet published to GitHub Pages.'));
      }
    } else if (kind === 'image') {
      const img = item.image
        ? `<img src="${item.image}" style="max-width:100%;height:auto;border-radius:4px;display:block;margin:0 auto;">`
        : `<p style="color:#666;">No image resolved.</p>`;
      setContentHtml(img + renderMetadata(item));
    } else {
      setContentHtml(renderPlaceholder(item) + renderMetadata(item));
    }
  };

  // How far through the chapter the reader is, kept per viewer in the
  // browser (viewState.setReadingProgress): the graph draws it on the node.
  // Written at most every few hundred ms while scrolling, and at once on
  // reaching the end. Only for a chapter with text.
  const saveTimer = useRef(null);
  const progressFor = useRef(null);
  const saveProgress = () => {
    saveTimer.current = null;
    const el = bodyRef.current;
    const id = progressFor.current;
    if (!el || !id || !viewState || !viewState.setReadingProgress) return;
    const room = el.scrollHeight - el.clientHeight;
    viewState.setReadingProgress(id, room > 0 ? el.scrollTop / room : 1);
  };
  const handleScroll = () => {
    if (bodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = bodyRef.current;
      const room = scrollHeight - clientHeight;
      const pct = room > 0 ? (scrollTop / room) * 100 : 100;
      setScrollProgress(Math.max(0, Math.min(pct, 100)));
      if (progressFor.current) {
        if (pct >= 98) { clearTimeout(saveTimer.current); saveProgress(); }
        else if (!saveTimer.current) saveTimer.current = setTimeout(saveProgress, 350);
      }
    }
  };

  const toggleBookmark = () => {
    if (!viewState || !article) return;
    const pId = getPersistentId(article);
    const marks = viewState.bookmarks(pId);
    if (marks.length) {
      marks.forEach(b => viewState.removeBookmark(b.id));
    } else {
      const topP = findTopVisibleParagraph();
      const ps = bodyRef.current ? bodyRef.current.querySelectorAll('p') : [];
      const words = topP !== null && ps[topP] ? ps[topP].innerText.trim().split(/\s+/).slice(0, 8).join(' ') : '';
      viewState.addBookmark({ item: pId, para: topP !== null ? topP : undefined, quote: words, version: article.version });
    }
  };

  const findTopVisibleParagraph = () => {
    if (!bodyRef.current) return null;
    const containerRect = bodyRef.current.getBoundingClientRect();
    const ps = bodyRef.current.querySelectorAll('p');
    for (let i = 0; i < ps.length; i++) {
      const rect = ps[i].getBoundingClientRect();
      if (rect.bottom > containerRect.top + 10) {
        return i;
      }
    }
    return null;
  };

  const handleCopyLinkToHere = async () => {
    if (!article) return;
    const pId = getPersistentId(article);
    const topP = findTopVisibleParagraph();
    let url = window.location.href.split('#')[0] + '#read=' + encodeURIComponent(pId);
    if (topP !== null) {
      url += '&p=' + topP;
    }
    try {
      await navigator.clipboard.writeText(url);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    } catch(e) {
      console.error('Copy link failed:', e);
    }
  };

  const jumpToParagraph = (pIndex) => {
    if (!bodyRef.current || pIndex === undefined || pIndex === null) return;
    const ps = bodyRef.current.querySelectorAll('p');
    if (ps[pIndex]) {
      const containerRect = bodyRef.current.getBoundingClientRect();
      const pRect = ps[pIndex].getBoundingClientRect();
      bodyRef.current.scrollTop += (pRect.top - containerRect.top) - 20; // 20px padding
    }
  };

  const handleCopyBookmarkLink = async (pId, pIndex) => {
    let url = window.location.href.split('#')[0] + '#read=' + encodeURIComponent(pId);
    if (pIndex !== undefined && pIndex !== null) {
      url += '&p=' + pIndex;
    }
    try {
      await navigator.clipboard.writeText(url);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    } catch(e) {
      console.error('Copy link failed:', e);
    }
  };

  const handleCopy = async () => {
    if (!article || !bodyRef.current) return;
    const licenseHeader = settings?.export?.license_header || '';
    const license = licenseHeader.replace('{{canonical_url}}', article.canonical_url || article.url);
    const text = `${license}\n\n---\n\n${bodyRef.current.innerText}`;
    try {
      await navigator.clipboard.writeText(text);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    } catch(e) {
      console.error('Copy failed:', e);
    }
  };

  const handleExport = () => {
    if (!article || !bodyRef.current || !allowDownload(settings)) return;
    const licenseHeader = settings?.export?.license_header || '';
    const license = licenseHeader.replace('{{canonical_url}}', article.canonical_url || article.url);
    const text = `${license}\n\n---\n\n${bodyRef.current.innerText}`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(article.id || article.url).split('/').pop().replace('.html', '') || 'article'}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleCopyUrl = async (e) => {
    e.preventDefault();
    if (!article) return;
    try {
      await navigator.clipboard.writeText(article.canonical_url || article.url);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    } catch(err) {
      console.error('Copy URL failed:', err);
    }
  };

  // When a chapter's text arrives: go back to where this reader left it
  // (unless a link asked for a paragraph, or they had reached the end), and
  // start keeping its progress.
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = null;
    progressFor.current = null;
    if (!contentHtml || !article || article._posted === 'title' || !viewState || !viewState.readingProgress) return;
    const id = getPersistentId(article);
    const t = setTimeout(() => {
      const el = bodyRef.current;
      if (!el) return;
      const p = viewState.readingProgress(id);
      const room = el.scrollHeight - el.clientHeight;
      if ((targetParagraph === undefined || targetParagraph === null) && p.at > 0.02 && p.at < 0.98 && room > 0) {
        el.scrollTop = p.at * room;
      }
      progressFor.current = id;
      handleScroll();
      if (room <= 0) saveProgress();
    }, 60);
    return () => clearTimeout(t);
  }, [contentHtml]);

  useEffect(() => {
    if (contentHtml && targetParagraph !== undefined && targetParagraph !== null && bodyRef.current) {
      // Need a small timeout to let the DOM actually render dangerouslySetInnerHTML
      setTimeout(() => {
        jumpToParagraph(targetParagraph);
      }, 50);
    }
  }, [contentHtml, targetParagraph]);

  // Where a bookmark lands in the current text, through the version map or
  // its quote when the text has changed since it was made.
  const getPlacedBookmarkParagraph = (b, article, ps) => {
    const para = b.para !== undefined ? b.para : b.paragraph;
    if (para === undefined || para === null) return null;
    if (b.version && article.version && b.version !== article.version) {
      if (article.version_maps && article.version_maps[b.version]) {
        const mapped = article.version_maps[b.version][para];
        if (mapped !== undefined && mapped !== -1) return mapped;
      }
      if (b.quote) {
        const paragraphTexts = Array.from(ps).map(p => p.innerText);
        return resolveParagraph(para, b.quote, paragraphTexts);
      }
    }
    return para;
  };

  useEffect(() => {
    if (!viewState || !bodyRef.current) return;
    const pId = article ? getPersistentId(article) : null;
    const marks = viewState.bookmarks();
    
    // Clear old ribbons
    const oldRibbons = bodyRef.current.querySelectorAll('.bookmarkRibbon');
    oldRibbons.forEach(el => el.remove());

    if (pId) {
      const b = marks.find(m => m.item === pId);
      if (b) {
        const ps = bodyRef.current.querySelectorAll('p');
        const placedPara = getPlacedBookmarkParagraph(b, article, ps);
        if (placedPara !== null && ps[placedPara]) {
          const ribbon = document.createElement('div');
          ribbon.className = 'bookmarkRibbon';
          ribbon.setAttribute('aria-hidden', 'true');
          ribbon.innerHTML = ICONS.bookmark;
          ribbon.style.position = 'absolute';
          ribbon.style.left = '-30px';
          ribbon.style.top = '0';
          ribbon.style.color = 'var(--rp-accent)';
          ribbon.style.width = '20px';
          ribbon.style.height = '20px';
          
          ps[placedPara].style.position = 'relative';
          ps[placedPara].appendChild(ribbon);
        }
      }
    }
  }, [displayHtml, viewState ? viewState.bookmarks() : null, article]);

  // Follow along (Settings → Reading): tap or drag through the text and the
  // sentence and word under the finger are marked, with or without the voice.
  const followOn = Boolean(viewState && viewState.readerAid && viewState.readerAid('followAlong'));
  useEffect(() => {
    if (!followOn || !bodyRef.current) return;
    return attachFollowAlong(bodyRef.current);
  }, [followOn, displayHtml, article]);

  // Where the reader can go from here, along the sequence edges.
  const nav = useMemo(() => (article && feedData ? neighbours(feedData, article.id) : { prev: [], next: [] }), [article, feedData]);

  const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Turn the page: the old chapter slides away, the new one comes in from
  // the side it was turned toward.
  const goTo = (item, dir) => {
    if (!item || !onNavigate || !isReadable(item)) return;
    turnTimers.current.forEach(clearTimeout);
    turnTimers.current = [];
    if (reduceMotion()) { onNavigate(item); return; }
    setTurnOut(dir);
    turnTimers.current.push(setTimeout(() => {
      setTurnIn(dir);
      onNavigate(item);
      turnTimers.current.push(setTimeout(() => setTurnIn(null), 520));
    }, 170));
  };
  const goStep = (dir) => {
    if (!article || !feedData) return;
    const item = step(feedData, article.id, dir);
    if (item) goTo(item, dir);
  };
  const goStepRef = useRef(goStep);
  goStepRef.current = goStep;
  useEffect(() => () => turnTimers.current.forEach(clearTimeout), []);

  // Arrow keys on a keyboard: right for the next chapter, left for the one
  // before. Not while typing, and not with a modifier held.
  const live = !!article && isOpen && !isMinimized;
  useEffect(() => {
    if (!live) return;
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); goStepRef.current('next'); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goStepRef.current('prev'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [live]);

  // A horizontal swipe on a touch screen turns the page. It stands aside for
  // text selection (a long press, or any selection made), for a mostly
  // vertical drag (that is scrolling), and, while the follow-along
  // highlighter is on, for a drag that starts on the text, which is the
  // highlighter's own gesture.
  useEffect(() => {
    const el = bodyRef.current;
    if (!live || !el) return;
    let start = null;
    const onStart = (e) => {
      if (e.touches.length !== 1) { start = null; return; }
      const t = e.touches[0];
      const onText = !!(e.target && e.target.closest && e.target.closest('p, li, blockquote'));
      start = { x: t.clientX, y: t.clientY, t: Date.now(), onText };
    };
    const onEnd = (e) => {
      if (!start) return;
      const s0 = start;
      start = null;
      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - s0.x;
      const dy = t.clientY - s0.y;
      const dt = Date.now() - s0.t;
      if (dt > 700 || Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.5) return;
      const sel = window.getSelection && window.getSelection();
      if (sel && !sel.isCollapsed && String(sel).trim()) return;
      if (followOn && s0.onText) return;
      goStepRef.current(dx < 0 ? 'next' : 'prev');
    };
    const onCancel = () => { start = null; };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    el.addEventListener('touchcancel', onCancel, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchcancel', onCancel);
    };
  }, [live, followOn]);

  // The panel's "Mark here" acts on the open chapter.
  const toggleRef = useRef(null);
  toggleRef.current = toggleBookmark;
  useEffect(() => {
    const onMark = () => { if (toggleRef.current) toggleRef.current(); };
    window.addEventListener('postpipe:reader-mark', onMark);
    return () => window.removeEventListener('postpipe:reader-mark', onMark);
  }, []);

  if (!article) return null;

  const navLink = (item, dir, big) => {
    const status = navStatus(feedData, item);
    const label = dir === 'next' ? 'Next' : 'Previous';
    if (status) {
      return (
        <div key={item.id} className={`${styles.navItem} ${styles.navLocked} ${big ? styles.navBig : ''}`} data-reader-nav={dir} data-nav-status>
          <span className={styles.navDir}>{label}</span>
          <span className={styles.navTitle}>{item.title}</span>
          <span className={styles.navStatus}>{status}</span>
        </div>
      );
    }
    return (
      <button
        key={item.id}
        className={`${styles.navItem} ${big ? styles.navBig : ''}`}
        data-reader-nav={dir}
        onClick={() => goTo(item, dir)}
        title={`${label}: ${item.title}`}
      >
        <span className={styles.navDir}>{dir === 'prev' ? '← ' : ''}{label}{dir === 'next' ? ' →' : ''}</span>
        <span className={styles.navTitle}>{item.title}</span>
      </button>
    );
  };

  const dateStr = article.date ? new Date(`${article.date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const metaParts = [dateStr, article.reading_time].filter(Boolean);

  let authorName = (settings?.author?.name || settings?.author?.display || 'harold young').toLowerCase();
  let authorLink = settings?.author?.url;

  if (article.authors && article.authors.length > 0 && article.authors[0].name) {
    authorName = article.authors.map(a => a.name).join(', ').toLowerCase();
    authorLink = article.authors[0].url || article.canonical_url || article.url;
  } else if (article.author) {
    authorName = article.author.replace(/\s*\[humxn\]/i, '').trim().toLowerCase();
    authorLink = article.canonical_url || article.url;
  }

  // settings.reader.header: a small line above the title, and whether the
  // byline sits under it.
  const header = readerHeader(settings, article);
  const progressMode = progressBarMode(settings);
  const canDownload = allowDownload(settings);
  const rights = rightsLine(settings && settings.rights);

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen && !isMinimized ? styles.open : ''}`}
        onClick={onClose}
      />
      <div
        className={`${styles.panel} ${isOpen && !isMinimized ? styles.open : ''} ${isMinimized ? styles.minimized : ''} ${wide ? styles.wide : ''}`}
        style={floatingPos ? { transform: `translate3d(${floatingPos.x}px, ${floatingPos.y}px, 0px)` } : undefined}
      >
        {progressMode !== 'none' && (
          <div
            className={progressMode === 'side' ? styles.progressSide : styles.progress}
            role="progressbar"
            aria-label="Reading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(scrollProgress)}
          >
            <div
              className={styles.progressFill}
              style={progressMode === 'side' ? { height: `${scrollProgress}%` } : { width: `${scrollProgress}%` }}
            />
          </div>
        )}

        <div
          className={styles.toolbar}
          onMouseDown={handleToolbarMouseDown}
          onDoubleClick={() => setFloatingPos(null)}
          title="Drag toolbar to move window · Double-click to reset"
        >
          <div className={styles.dragGrip} title="Drag to move reading window">⋮⋮</div>
          {/* TTS Toolbar Placeholder */}
          <div id="tts-mount-point" className={`${styles.toolbarGroup} ${styles.ttsMount}`}></div>

          <div className={styles.toolbarSeparator}></div>

          
          <div className={styles.toolbarSeparator}></div>

          <div className={styles.toolbarGroup}>
            {/* Each bookmark control says what it does in words, not only on
                hover: a phone has no hover. */}
            <button
              className={`${styles.tb} ${styles.tbLabeled} ${itemBookmarks.length > 0 ? styles.active : ''}`}
              onClick={toggleBookmark}
              aria-pressed={itemBookmarks.length > 0}
              title={itemBookmarks.length > 0 ? 'Remove the bookmark in this chapter' : 'Save the paragraph at the top of the reader'}
              data-bookmark-toggle
              dangerouslySetInnerHTML={{ __html: `${ICONS.bookmark}<span class="${styles.tbText}">${itemBookmarks.length > 0 ? 'Marked' : 'Mark here'}</span>` }}
            />
            <button
              className={`${styles.tb} ${styles.tbLabeled}`}
              onClick={() => window.dispatchEvent(new CustomEvent('postpipe:toggle-settings', { detail: { section: 'place', open: true } }))}
              title="Every place you have bookmarked, in the settings panel under Your place"
              data-bookmark-list
              dangerouslySetInnerHTML={{ __html: `${ICONS.bookmarkList}<span class="${styles.tbText}">Bookmarks</span>` }}
            />
          </div>

          <div className={styles.toolbarSeparator}></div>

          <div className={styles.toolbarGroup}>
            <button
              className={styles.tb}
              onClick={handleCopyLinkToHere}
              title="Copy link to here"
              dangerouslySetInnerHTML={{ __html: `${ICONS.copy}<span class="${styles.tbTooltip}">Link here</span>` }}
            />
          </div>

          <div className={styles.toolbarSeparator}></div>

          <div className={styles.toolbarGroup}>
            <button
              className={`${styles.tb} ${showFrontmatter ? styles.active : ''}`}
              onClick={() => setShowFrontmatter(!showFrontmatter)}
              title="Article details"
              dangerouslySetInnerHTML={{ __html: `${ICONS.info}<span class="${styles.tbTooltip}">Details</span>` }}
            />
            {canDownload && (
              <button
                className={styles.tb}
                onClick={handleExport}
                title="Export markdown"
                data-reader-download
                dangerouslySetInnerHTML={{ __html: `${ICONS.download}<span class="${styles.tbTooltip}">Export</span>` }}
              />
            )}
            <button
              className={styles.tb}
              onClick={handleCopy}
              title="Copy to clipboard"
              dangerouslySetInnerHTML={{ __html: `${ICONS.copy}<span class="${styles.tbTooltip}">Copy</span>` }}
            />
            <button
              className={`${styles.tb} ${wide ? styles.active : ''}`}
              onClick={() => setWide(w => !w)}
              title={wide ? 'Shrink reader' : 'Widen reader'}
              dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">${wide
                ? '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>'
                : '<polyline points="3 9 3 3 9 3"/><polyline points="21 15 21 21 15 21"/><line x1="3" y1="3" x2="10" y2="10"/><line x1="21" y1="21" x2="14" y2="14"/>'}</svg><span class="${styles.tbTooltip}">${wide ? 'Shrink' : 'Widen'}</span>` }}
            />
          </div>

          <div className={styles.toolbarSeparator}></div>

          <div className={styles.toolbarGroup}>
            <button
              className={`${styles.tb} ${styles.syndLink} ${styles.canonical}`}
              onClick={handleCopyUrl}
              dangerouslySetInnerHTML={{ __html: `${ICONS.link}<span class="${styles.tbTooltip}">Copy URL</span>` }}
            />
            {/* Other syndication links */}
            {Object.entries(article.syndication || {}).map(([platform, url]) => {
              if (!url) return null;
              const cfg = settings?.toolbar?.syndication_icons?.[platform];
              if (!cfg) return null;
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.tb} ${styles.syndLink}`}
                  dangerouslySetInnerHTML={{ __html: `${ICONS[cfg.icon] || ICONS.globe}<span class="${styles.tbTooltip}">${cfg.label}</span>` }}
                />
              );
            })}
          </div>

          <div className={styles.toolbarSpacer}></div>

          <div className={styles.windowControls}>
            <button
              className={styles.tb}
              onClick={() => window.dispatchEvent(new CustomEvent('postpipe:toggle-settings'))}
              title="Reading settings"
              aria-label="Reading settings"
              data-reader-settings
              dangerouslySetInnerHTML={{ __html: `${ICONS.settings}<span class="${styles.tbTooltip}">Settings</span>` }}
            />
            <button
              className={`${styles.tb} ${styles.minimizeBtn}`}
              onClick={() => setIsMinimized(true)}
              title="Minimize reading window (turn off)"
              dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/></svg><span class="${styles.tbTooltip}">Minimize</span>` }}
            />
            <button
              className={`${styles.tb} ${styles.closeBtn}`}
              onClick={onClose}
              title="Close reading window"
              dangerouslySetInnerHTML={{ __html: `${ICONS.close}<span class="${styles.tbTooltip}">Close</span>` }}
            />
          </div>
        </div>

        {showFrontmatter && (
          <FrontmatterPanel article={article} settings={settings} />
        )}

        <div
          className={`${styles.body} ${followOn ? styles.following : ''} ${turnOut ? styles['turnOut_' + turnOut] : ''} ${turnIn ? styles['turnIn_' + turnIn] : ''}`}
          data-tts-target
          data-follow-along={followOn ? 'on' : 'off'}
          ref={bodyRef}
          onScroll={handleScroll}
        >
          {nav.prev.length > 0 && (
            <nav className={styles.navTop} aria-label="Previous chapter">
              {nav.prev.map((item) => navLink(item, 'prev', false))}
            </nav>
          )}
          <div className={styles.articleHeader}>
            {header.kicker && (
              <div className={styles.articleKicker}>{header.kicker}</div>
            )}
            <h1 className={styles.articleTitle}>{article.title || article.label}</h1>
            {header.byline && (
              <div className={styles.articleByline}>
                by {authorLink ? (
                  <a href={authorLink} target="_blank" rel="noopener noreferrer">{authorName}</a>
                ) : (
                  authorName
                )}
              </div>
            )}
            {metaParts.length > 0 && (
              <div className={styles.articleMeta}>{metaParts.join(' · ')}</div>
            )}
            {article.kind && article.kind !== 'essay' && (
              <div className={styles.articleMeta} style={{ marginTop: 4, opacity: 0.7 }}>
                substrate: {article.kind}
              </div>
            )}
          </div>
          <div ref={textRef} data-reader-text dangerouslySetInnerHTML={textInner} />
          {contentHtml && (nav.next.length > 0 || nav.prev.length > 0) && (
            <nav className={styles.navBottom} aria-label="Next chapter" data-reader-nav-bottom>
              {nav.next.map((item) => navLink(item, 'next', true))}
              {nav.next.length === 0 && nav.prev.map((item) => navLink(item, 'prev', false))}
            </nav>
          )}
          {rights && contentHtml && (
            <footer className={styles.rightsLine} data-reader-rights>{rights}</footer>
          )}
          {contributionsConfig && contentHtml && article._posted !== 'title' && (
            <Contributions
              article={article}
              contributions={contributions || []}
              config={contributionsConfig}
              feedData={feedData}
              textRef={textRef}
              textKey={displayHtml}
              onOpenChapter={(item) => goTo(item, 'next')}
            />
          )}
        </div>
      </div>

      <div className={`${styles.copyToast} ${toastVisible ? styles.show : ''}`}>
        Copied to clipboard
      </div>

      {isMinimized && article && (
        <div
          className={styles.restorePill}
          onClick={() => setIsMinimized(false)}
          title="Bring reading window back"
        >
          <span className={styles.pillIcon}>📖</span>
          <span className={styles.pillLabel}>
            <span className={styles.pillTitle}>{article.title || article.label}</span>
            <span className={styles.pillAuthor}>by {authorName}</span>
          </span>
          <span className={styles.pillAction}>Restore ↗</span>
        </div>
      )}
    </>
  );
}

// Helpers

function escapeHtml(v) {
  return String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderPlaceholder(article, reason) {
  const r = reason || `This substrate ("${article.kind || 'unknown'}") is not yet renderable in the viewer.`;
  let html = `<div style="padding:24px;border:1px dashed var(--rp-border);border-radius:6px;background:rgba(17,24,39,0.4);">`;
  html += `<p style="color:var(--rp-accent);font-weight:600;margin-bottom:8px;">${r}</p>`;
  if (article.todos && article.todos.length) {
    html += `<p style="color:#f39c12;font-size:13px;">Pending: ${article.todos.join(', ')}</p>`;
  }
  const slug = (article.url || article.id || '').split('/').pop().replace('.html', '');
  const folderPath = article._source?.path || `chapters/${slug}`;
  html += `<p style="color:#888;font-size:13px;margin-top:12px;">The bundle exists at <code>${folderPath}</code>.</p>`;
  html += `</div>`;
  return html;
}

function renderCompanions(article) {
  const companions = (article.forms && article.forms.companions) || [];
  if (!companions.length) return '';
  let html = `<div style="margin-top:32px;padding-top:24px;border-top:1px solid var(--rp-border);">`;
  html += `<div style="color:var(--rp-accent);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">also exists as</div>`;
  html += `<div style="color:var(--rp-text);font-size:14px;">${companions.map(c => `<span class="${styles.fmTag}">${c}</span>`).join(' ')}</div>`;
  html += `</div>`;
  return html;
}

function renderMetadata(article) {
  const rows = [];
  if (article.seed) rows.push(['seed', article.seed]);
  if (article.tldr) rows.push(['tldr', article.tldr]);
  if (article.topology && article.topology.length) rows.push(['topology', article.topology.join(' · ')]);
  if (article.energy) rows.push(['energy', article.energy]);
  if (article.note) rows.push(['note', article.note]);

  if (!rows.length) return '';

  let html = `<div style="margin-top:32px;padding:20px;background:rgba(17,24,39,0.4);border-radius:6px;">`;
  for (const [label, value] of rows) {
    html += `<div class="${styles.fmRow}"><span class="${styles.fmLabel}">${label}</span><span class="${styles.fmValue}">${value}</span></div>`;
  }
  html += `</div>`;
  return html;
}

function FrontmatterPanel({ article, settings }) {
  const fields = settings?.frontmatter_display || [];
  let hasData = false;

  const renderField = (field) => {
    let value = '';
    switch (field) {
      case 'publish_date':
        if (article.date) value = new Date(`${article.date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        break;
      case 'updated_date':
        if (article.updated_date) value = article.updated_date;
        break;
      case 'reading_time':
        value = article.reading_time || '';
        break;
      case 'tags':
        if (article.tags && article.tags.length) {
          value = <>{article.tags.map(t => <span key={t} className={styles.fmTag}>{t}</span>)}</>;
        }
        break;
      case 'series':
        value = article.series || '';
        break;
      case 'license':
        value = article.license || '';
        break;
      case 'syndication':
        const synd = article.syndication || {};
        const links = Object.entries(synd).filter(([,url]) => url);
        if (links.length) {
          value = <>{links.map(([p, url], i) => (
            <React.Fragment key={p}>
              <a className={styles.fmSyndLink} href={url} target="_blank" rel="noopener noreferrer">{p}</a>
              {i < links.length - 1 ? ' · ' : ''}
            </React.Fragment>
          ))}</>;
        }
        break;
      default:
        break;
    }

    if (!value) return null;
    hasData = true;

    return (
      <div key={field} className={styles.fmRow}>
        <span className={styles.fmLabel}>{field.replace(/_/g, ' ')}</span>
        <span className={styles.fmValue}>{value}</span>
      </div>
    );
  };

  const content = fields.map(renderField);

  return (
    <div className={`${styles.frontmatterPanel} ${styles.open}`}>
      {hasData ? content : <div className={styles.fmRow}><span className={styles.fmValue} style={{color: '#666'}}>No metadata available.</span></div>}
    </div>
  );
}
