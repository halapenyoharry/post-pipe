const fs = require('fs');

let code = fs.readFileSync('src/components/ReaderPanel/ReaderPanel.jsx', 'utf8');

// Imports
code = code.replace(
  "import { ICONS } from '../../utils/icons';",
  "import { ICONS } from '../../utils/icons';\nimport { resolveParagraph } from '../../lib/resolveParagraph';\nimport { marksIcon, bookmarkFilledIcon, bookmarkIcon, copyIcon, trashIcon } from '../../utils/icons';"
);

// Props
code = code.replace(
  "export function ReaderPanel({ article, onClose, settings }) {",
  "export function ReaderPanel({ article, onClose, settings, viewState, targetParagraph }) {"
);

// State for bookmarks panel and note editing
code = code.replace(
  "const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });",
  `const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const [showMarksList, setShowMarksList] = useState(false);
  const [editingNoteFor, setEditingNoteFor] = useState(null); // id of bookmark being edited`
);

// Derived initial state when article changes (reset marks panel)
code = code.replace(
  "setIsMinimized(false);",
  "setIsMinimized(false);\n      setShowMarksList(false);\n      setEditingNoteFor(null);"
);

// Find persistent ID helper
code = code.replace(
  "const handleToolbarMouseDown",
  `const getPersistentId = (item) => {
    if (!item) return null;
    return (item.originalItem && item.originalItem.id) || item.id || item.url;
  };

  const handleToolbarMouseDown`
);

// Bookmarks logic
code = code.replace(
  "const handleCopy = async () => {",
  `const toggleBookmark = () => {
    if (!viewState || !article) return;
    const pId = getPersistentId(article);
    const hasBookmark = viewState.bookmarks().some(b => b.id === pId);
    if (hasBookmark) {
      viewState.removeBookmark(pId);
    } else {
      const topP = findTopVisibleParagraph();
      viewState.addBookmark(pId, topP !== null ? topP : undefined);
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

  const handleCopy = async () => {`
);

// Target paragraph scroll effect
code = code.replace(
  "if (!article) return null;",
  `useEffect(() => {
    if (contentHtml && targetParagraph !== undefined && targetParagraph !== null && bodyRef.current) {
      // Need a small timeout to let the DOM actually render dangerouslySetInnerHTML
      setTimeout(() => {
        jumpToParagraph(targetParagraph);
      }, 50);
    }
  }, [contentHtml, targetParagraph]);

  useEffect(() => {
    if (!viewState || !bodyRef.current) return;
    const pId = article ? getPersistentId(article) : null;
    const marks = viewState.bookmarks();
    
    // Clear old ribbons
    const oldRibbons = bodyRef.current.querySelectorAll('.bookmarkRibbon');
    oldRibbons.forEach(el => el.remove());

    if (pId) {
      const b = marks.find(m => m.id === pId);
      if (b && b.paragraph !== undefined && b.paragraph !== null) {
        const ps = bodyRef.current.querySelectorAll('p');
        if (ps[b.paragraph]) {
          const ribbon = document.createElement('div');
          ribbon.className = 'bookmarkRibbon';
          ribbon.innerHTML = bookmarkFilledIcon;
          ribbon.style.position = 'absolute';
          ribbon.style.left = '-30px';
          ribbon.style.top = '0';
          ribbon.style.color = 'var(--rp-accent)';
          ribbon.style.width = '20px';
          ribbon.style.height = '20px';
          
          ps[b.paragraph].style.position = 'relative';
          ps[b.paragraph].appendChild(ribbon);
        }
      }
    }
  }, [contentHtml, viewState ? viewState.bookmarks() : null, article]);

  if (!article) return null;`
);

// Toolbar buttons
code = code.replace(
  "dangerouslySetInnerHTML={{ __html: \`\${ICONS.info}<span class=\"\${styles.tbTooltip}\">Details</span>\` }}",
  `dangerouslySetInnerHTML={{ __html: \`\${ICONS.info}<span class=\"\${styles.tbTooltip}\">Details</span>\` }}`
);

const beforeToolbarGroup = `<div className={styles.toolbarGroup}>
            <button
              className={\`\${styles.tb} \${showFrontmatter ? styles.active : ''}\`}`;

const afterToolbarGroup = `
          <div className={styles.toolbarSeparator}></div>

          <div className={styles.toolbarGroup}>
            <button
              className={\`\${styles.tb} \${viewState && viewState.bookmarks().some(b => b.id === getPersistentId(article)) ? styles.active : ''}\`}
              onClick={toggleBookmark}
              title="Bookmark this position"
              dangerouslySetInnerHTML={{ __html: \`\${viewState && viewState.bookmarks().some(b => b.id === getPersistentId(article)) ? bookmarkFilledIcon : bookmarkIcon}<span class="\${styles.tbTooltip}">Bookmark</span>\` }}
            />
            <button
              className={\`\${styles.tb} \${showMarksList ? styles.active : ''}\`}
              onClick={() => setShowMarksList(!showMarksList)}
              title="View marks list"
              dangerouslySetInnerHTML={{ __html: \`\${marksIcon}<span class="\${styles.tbTooltip}">Marks list</span>\` }}
            />
          </div>

          <div className={styles.toolbarSeparator}></div>

          <div className={styles.toolbarGroup}>
            <button
              className={styles.tb}
              onClick={handleCopyLinkToHere}
              title="Copy link to here"
              dangerouslySetInnerHTML={{ __html: \`\${copyIcon}<span class="\${styles.tbTooltip}">Link here</span>\` }}
            />
          </div>

          <div className={styles.toolbarSeparator}></div>

          <div className={styles.toolbarGroup}>
            <button
              className={\`\${styles.tb} \${showFrontmatter ? styles.active : ''}\`}`;
              
code = code.replace(beforeToolbarGroup, afterToolbarGroup);

// MarksListPanel
code = code.replace(
  "return (",
  `const pId = getPersistentId(article);
  const currentBookmark = viewState ? viewState.bookmarks().find(b => b.id === pId) : null;
  const allBookmarks = viewState ? viewState.bookmarks() : [];

  return (`
);

// Marks panel inside the return
code = code.replace(
  "{showFrontmatter && (",
  `{currentBookmark && (
          <div className={styles.inlineNotePanel}>
            <input
              type="text"
              placeholder="Add an optional note to this bookmark..."
              value={currentBookmark.note || ''}
              onChange={(e) => viewState.setBookmarkNote(pId, e.target.value)}
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
                    {b.id === pId && b.paragraph !== undefined && (
                      <button onClick={() => jumpToParagraph(b.paragraph)} title="Jump to paragraph">Jump</button>
                    )}
                    <button onClick={() => handleCopyBookmarkLink(b.id, b.paragraph)} title="Copy link" dangerouslySetInnerHTML={{ __html: copyIcon }} />
                    <button onClick={() => viewState.removeBookmark(b.id)} title="Remove bookmark" dangerouslySetInnerHTML={{ __html: trashIcon }} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {showFrontmatter && (`
);

fs.writeFileSync('src/components/ReaderPanel/ReaderPanel.jsx', code);
