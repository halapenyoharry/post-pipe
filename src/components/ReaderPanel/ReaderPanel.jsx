import React, { useState, useEffect, useRef } from 'react';
import styles from './ReaderPanel.module.css';
import { ICONS } from '../../utils/icons';
import { resolveParagraph } from '../../lib/resolveParagraph';
import { readerHeader } from '../../lib/readerHeader';
import { progressBarMode } from '../../lib/readerSettings';


export function ReaderPanel({ article, onClose, settings, viewState, targetParagraph }) {
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
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const [showMarksList, setShowMarksList] = useState(false);
  const [editingNoteFor, setEditingNoteFor] = useState(null); // id of bookmark being edited

  // Derive initial state when article changes
  useEffect(() => {
    if (article) {
      setIsOpen(true);
      setIsMinimized(false);
      setShowMarksList(false);
      setEditingNoteFor(null);
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
  const currentBookmark = itemBookmarks.length ? itemBookmarks[itemBookmarks.length - 1] : null;
  const allBookmarks = viewState ? viewState.bookmarks() : [];

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

  const handleScroll = () => {
    if (bodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = bodyRef.current;
      const room = scrollHeight - clientHeight;
      const pct = room > 0 ? (scrollTop / room) * 100 : 100;
      setScrollProgress(Math.max(0, Math.min(pct, 100)));
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
      viewState.addBookmark({ item: pId, para: topP !== null ? topP : undefined, version: article.version });
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
    if (!article || !bodyRef.current) return;
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
  }, [contentHtml, viewState ? viewState.bookmarks() : null, article]);

  if (!article) return null;

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
          <div id="tts-mount-point" className={styles.toolbarGroup}></div>

          <div className={styles.toolbarSeparator}></div>

          
          <div className={styles.toolbarSeparator}></div>

          <div className={styles.toolbarGroup}>
            <button
              className={`${styles.tb} ${viewState && viewState.bookmarks(getPersistentId(article)).length > 0 ? styles.active : ''}`}
              onClick={toggleBookmark}
              title="Bookmark this position"
              dangerouslySetInnerHTML={{ __html: `${viewState && viewState.bookmarks(getPersistentId(article)).length > 0 ? ICONS.bookmark : ICONS.bookmark}<span class="${styles.tbTooltip}">Bookmark</span>` }}
            />
            <button
              className={`${styles.tb} ${showMarksList ? styles.active : ''}`}
              onClick={() => setShowMarksList(!showMarksList)}
              title="View marks list"
              dangerouslySetInnerHTML={{ __html: `${ICONS.bookmarkList}<span class="${styles.tbTooltip}">Marks list</span>` }}
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
            <button
              className={styles.tb}
              onClick={handleExport}
              title="Export markdown"
              dangerouslySetInnerHTML={{ __html: `${ICONS.download}<span class="${styles.tbTooltip}">Export</span>` }}
            />
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

        {currentBookmark && (
          <div className={styles.inlineNotePanel}>
            <input
              type="text"
              placeholder="Add an optional note to this bookmark..."
              value={currentBookmark.note || ''}
              onChange={(e) => viewState.setBookmarkNote(currentBookmark.id, e.target.value)}
              className={styles.noteInput}
            />
          </div>
        )}

        {showMarksList && (
          <div className={styles.marksListPanel}>
            {allBookmarks.length === 0 ? (
              <div className={styles.noMarks}>No bookmarks yet.</div>
            ) : (
              allBookmarks.map(b => (
                <div key={b.id} className={styles.markItem}>
                  <div className={styles.markMain}>
                    <div className={styles.markTitle}>{b.id}</div>
                    {editingNoteFor === b.id ? (
                      <input
                        type="text"
                        value={b.note || ''}
                        onChange={(e) => viewState.setBookmarkNote(b.id, e.target.value)}
                        onBlur={() => setEditingNoteFor(null)}
                        onKeyDown={(e) => { if (e.key === 'Enter') setEditingNoteFor(null); }}
                        className={styles.noteInput}
                        autoFocus
                      />
                    ) : (
                      <div className={styles.markNote} onClick={() => setEditingNoteFor(b.id)}>
                        {b.note || <em>No note (click to add)</em>}
                      </div>
                    )}
                  </div>
                  <div className={styles.markActions}>
                    {b.item === pId && (b.para ?? b.paragraph) !== undefined && (
                      <button onClick={() => { const ps = bodyRef.current?.querySelectorAll('p'); const p = ps ? getPlacedBookmarkParagraph(b, article, ps) : b.para !== undefined ? b.para : b.paragraph; jumpToParagraph(p); }} title="Jump to paragraph">Jump</button>
                    )}
                    <button onClick={() => { const ps = bodyRef.current?.querySelectorAll('p'); const p = ps ? getPlacedBookmarkParagraph(b, article, ps) : b.para !== undefined ? b.para : b.paragraph; handleCopyBookmarkLink(b.id, p); }} title="Copy link" dangerouslySetInnerHTML={{ __html: ICONS.copy }} />
                    <button onClick={() => viewState.removeBookmark(b.id)} title="Remove bookmark" dangerouslySetInnerHTML={{ __html: ICONS.trash }} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {showFrontmatter && (
          <FrontmatterPanel article={article} settings={settings} />
        )}

        <div
          className={styles.body}
          data-tts-target
          ref={bodyRef}
          onScroll={handleScroll}
        >
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
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
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
