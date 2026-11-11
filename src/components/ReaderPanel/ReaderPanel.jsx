import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { flushSync } from 'react-dom';
import styles from './ReaderPanel.module.css';
import { ICONS } from '../../utils/icons';
import { resolveParagraph } from '../../lib/resolveParagraph';
import { readerHeader } from '../../lib/readerHeader';
import { byline } from '../../lib/byline';
import { progressBarMode, allowDownload, bookmarksList } from '../../lib/readerSettings';
import { BookmarkList } from './BookmarkList';
import { Icon } from '../Icon/Icon';
import { iconBody } from '../../lib/icons';
import { bookmarkTap } from '../../lib/bookmarkPlace';
import { attachFollowAlong } from './followHighlighter';
import { boldStartHtml } from './boldStartHtml';
import { rightsLine } from '../../lib/rights';
import { neighbours, navStatus, isReadable, step } from '../../lib/readerNav';
import { flowNav, readerSourcePill, HIDDEN_IN_GRAPH, PREF as READING_ORDER_PREF } from '../../lib/readingOrder';
import { FeedPill } from '../FeedZ/FeedZ';
import { showContainerCount } from '../GraphViewer/containerCount';
import { Contributions } from './Contributions';
import { nonTagReferences } from '../../corpus/buildEdges';
import { tagReferences } from '../../lib/tagReferences';
import { untaggedBecauseOf } from '../../lib/untaggedBecause';
import { wrapText, provenanceLines } from '../../lib/provenance';
import { wordsChoice, excerptHtml, followingCards, lazyImages, cardProgress, cardScrollFor, FOLLOW_STEP } from '../../lib/readerWords';

// The words of the reader's own buttons for a cut card (provisional, Harold's
// to keep or replace).
const READ_THE_REST = 'read the rest';


// contributions: what readers brought (settings.contributions), already
// filtered to what this page shows; contributionsConfig its settings.
export function ReaderPanel({ article, onClose, settings, viewState, targetParagraph, feedData, onNavigate, contributions, contributionsConfig }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [floatingPos, setFloatingPos] = useState(null);
  const [showFrontmatter, setShowFrontmatter] = useState(false);
  const [showMarks, setShowMarks] = useState(false);
  const [contentHtml, setContentHtml] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  // Reader always leaves the graph visible — `wide` toggles between
  // narrow (540px) and wide (760px).
  const [wide, setWide] = useState(false);
  // Expand: the reader fills the window.
  const [full, setFull] = useState(false);
  // "copied" beside the link icon, for a second.
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef(null);
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

  // How much of each card shows before the next (Settings → Reading, Words
  // before the next, provisional; src/lib/readerWords.js): a number of
  // words, 'whole', or 'one', one card at a time as the reader always was.
  // In every choice but 'one' the reader is a scroll: the open card, then
  // the cards Next would visit, one under another.
  const words = wordsChoice(settings, viewState && viewState.readerAid ? viewState.readerAid('words') : null);
  const scrollMode = words !== 'one';
  const cutAt = typeof words === 'number' ? words : null;
  const scrollModeRef = useRef(scrollMode);
  scrollModeRef.current = scrollMode;
  // Whether the open card's text (contentHtml) shows whole for now, though
  // the choice cuts it: set with the text when it arrives (from wholeNext,
  // decided as the card opens), and by "read the rest", the voice, a jump
  // to a paragraph. It goes with the text, so a new card's arrival ends it.
  const [shownWhole, setShownWhole] = useState(false);
  const wholeNext = useRef(false);
  // The card whose text contentHtml holds (its persistent id).
  const contentFor = useRef(null);
  // A card opened from one of the cards beneath opens whole: its id.
  const openWholeRef = useRef(null);
  // Whether the open card shows an excerpt now (set as it is drawn).
  const cutRef = useRef(false);
  // The scroll to keep while the open card's text grows in place.
  const keepScroll = useRef(null);
  // How many of the cards beneath to list, and a tick each time one's text
  // arrives, so the sentinel can ask for more.
  const [followCount, setFollowCount] = useState(FOLLOW_STEP);
  const [followTick, setFollowTick] = useState(0);
  const moreRef = useRef(null);
  const headerRef = useRef(null);
  const articleRef = useRef(article);
  articleRef.current = article;

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
      // Whole for now: opened from a card beneath, at a paragraph, or at a
      // place partway through that the reader is put back at.
      const id = getPersistentId(article);
      const progress = viewState && viewState.readingProgress ? viewState.readingProgress(id) : null;
      const toPlace = targetParagraph !== undefined && targetParagraph !== null;
      const partway = !!progress && progress.at > 0.02 && progress.at < 0.98;
      const fromBelow = openWholeRef.current !== null && openWholeRef.current === article.id;
      openWholeRef.current = null;
      wholeNext.current = toPlace || partway || fromBelow;
      setFollowCount(FOLLOW_STEP);
      fetchContent(article);
    } else {
      setIsOpen(false);
      setIsMinimized(false);
      setContentHtml('');
      contentFor.current = null;
      setShownWhole(false);
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

  // The open card's text as drawn: in a choice that cuts, about that many
  // words of it unless it shows whole for now (excerptHtml, null when nothing
  // is cut); contentHtml stays the text whole.
  const excerpt = useMemo(
    () => (scrollMode && cutAt && contentHtml && !shownWhole ? excerptHtml(contentHtml, cutAt) : null),
    [scrollMode, cutAt, contentHtml, shownWhole],
  );
  const cut = !!excerpt;
  cutRef.current = cut;
  const shownHtml = excerpt ? excerpt.html : contentHtml;

  // Bold word beginnings (Settings → Reading): applied to the drawn copy
  // only; contentHtml stays the text as published. After the cut, so the
  // words are counted on the text, not on the marks.
  const boldOn = Boolean(viewState && viewState.readerAid && viewState.readerAid('boldStart'));
  const displayHtml = useMemo(() => (boldOn ? boldStartHtml(shownHtml) : shownHtml), [shownHtml, boldOn]);
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

  // The open card's text, from the loader the cards beneath use too
  // (itemHtml, below). Text that is at hand is set at once; a page that has
  // to be fetched is set when it arrives.
  const fetchContent = (item) => {
    const arrive = (html) => {
      contentFor.current = getPersistentId(item);
      setShownWhole(wholeNext.current);
      setContentHtml(html);
    };
    const out = itemHtml(item, feedData);
    if (out && typeof out.then === 'function') out.then(arrive);
    else arrive(out);
  };

  // How far through the chapter the reader is, kept per viewer in the
  // browser (viewState.setReadingProgress): the graph draws it on the node.
  // Written at most every few hundred ms while scrolling, and at once on
  // reaching the end. Only for a chapter with text.
  //
  // In a choice that is a scroll, the open card is measured alone: from the
  // top of its header to the end of its text (openCardSpan), never the cards
  // beneath it; and while it shows an excerpt its progress is not kept.
  const saveTimer = useRef(null);
  const progressFor = useRef(null);
  const saveProgress = () => {
    saveTimer.current = null;
    const el = bodyRef.current;
    const id = progressFor.current;
    if (!el || !id || !viewState || !viewState.setReadingProgress) return;
    if (scrollModeRef.current) {
      const span = openCardSpan(el);
      if (cutRef.current || !span) return;
      viewState.setReadingProgress(id, openCardFraction(el, span));
      return;
    }
    const room = el.scrollHeight - el.clientHeight;
    viewState.setReadingProgress(id, room > 0 ? el.scrollTop / room : 1);
  };
  const handleScroll = () => {
    if (bodyRef.current && scrollModeRef.current) {
      const el = bodyRef.current;
      const pct = openCardFraction(el, openCardSpan(el)) * 100;
      setScrollProgress(Math.max(0, Math.min(pct, 100)));
      if (progressFor.current && !cutRef.current) {
        if (pct >= 98) { clearTimeout(saveTimer.current); saveProgress(); }
        else if (!saveTimer.current) saveTimer.current = setTimeout(saveProgress, 350);
      }
      return;
    }
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
  // Where the open card's header starts and its text ends, in the reader's
  // scroll; null before they are drawn.
  const openCardSpan = (el) => {
    const head = headerRef.current;
    const text = textRef.current;
    if (!el || !head || !text) return null;
    const top = el.getBoundingClientRect().top - el.scrollTop;
    return { start: head.getBoundingClientRect().top - top, end: text.getBoundingClientRect().bottom - top };
  };

  // Bookmark: one per chapter. A tap puts it at the paragraph at the top of
  // the reader, replacing the one before; a tap where it already is takes it
  // away (src/lib/bookmarkPlace.js). The reading position is kept on its own.
  const toggleBookmark = () => {
    if (!viewState || !article) return;
    const pId = getPersistentId(article);
    const marks = viewState.bookmarks(pId);
    const topP = findTopVisibleParagraph();
    const action = bookmarkTap(marks, topP);
    marks.forEach(b => viewState.removeBookmark(b.id));
    if (action === 'set') {
      const ps = textRef.current ? textRef.current.querySelectorAll('p') : [];
      const words = topP !== null && ps[topP] ? ps[topP].innerText.trim().split(/\s+/).slice(0, 8).join(' ') : '';
      viewState.addBookmark({ item: pId, para: topP !== null ? topP : undefined, quote: words, version: article.version });
    }
  };

  // The paragraphs counted are the open card's own text's (textRef), never
  // the cards beneath it; no paragraph sits above that text in the reader,
  // so the numbers are what they always were.
  const findTopVisibleParagraph = () => {
    if (!bodyRef.current || !textRef.current) return null;
    const containerRect = bodyRef.current.getBoundingClientRect();
    const ps = textRef.current.querySelectorAll('p');
    for (let i = 0; i < ps.length; i++) {
      const rect = ps[i].getBoundingClientRect();
      if (rect.bottom > containerRect.top + 10) {
        return i;
      }
    }
    return null;
  };

  // The link icon: the chapter's address with the reading position (the
  // paragraph at the top of the reader), to the clipboard; "copied" shows
  // beside it for a second.
  const handleCopyLinkToHere = async () => {
    if (!article) return;
    const pId = getPersistentId(article);
    const topP = findTopVisibleParagraph();
    let url = window.location.href.split('#')[0] + '#read=' + encodeURIComponent(pId);
    if (topP !== null) url += '&p=' + topP;
    try {
      await navigator.clipboard.writeText(url);
    } catch (e) {
      console.error('Copy link failed:', e);
      return;
    }
    setCopied(true);
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 1000);
  };
  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  const jumpToParagraph = (pIndex) => {
    if (!bodyRef.current || !textRef.current || pIndex === undefined || pIndex === null) return;
    const ps = textRef.current.querySelectorAll('p');
    if (ps[pIndex]) {
      const containerRect = bodyRef.current.getBoundingClientRect();
      const pRect = ps[pIndex].getBoundingClientRect();
      bodyRef.current.scrollTop += (pRect.top - containerRect.top) - 20; // 20px padding
    }
  };

  // Download: the open card only. In a choice that is a scroll the cards
  // beneath, the nav row and the reader's own buttons are left out, and a
  // card showing an excerpt is shown whole first, so the file holds it all.
  const handleExport = () => {
    if (!article || !bodyRef.current || !allowDownload(settings)) return;
    const licenseHeader = settings?.export?.license_header || '';
    const license = licenseHeader.replace('{{canonical_url}}', article.canonical_url || article.url);
    let bodyText = bodyRef.current.innerText;
    if (scrollModeRef.current) {
      if (cutRef.current) showWholeNow();
      bodyText = Array.from(bodyRef.current.children)
        .filter((el) => !el.matches('[data-reader-following], [data-reader-following-more], [data-reader-rest], [data-reader-nav-row]'))
        .map((el) => el.innerText)
        .filter((t) => t && t.trim())
        .join('\n\n');
    }
    const text = `${license}\n\n---\n\n${bodyText}`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(article.id || article.url).split('/').pop().replace('.html', '') || 'article'}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
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
      // A scroll: the place is in the open card alone (cardScrollFor), and
      // a card showing an excerpt keeps no progress.
      if (scrollModeRef.current) {
        const span = openCardSpan(el);
        const to = span ? cardScrollFor(p.at, { clientHeight: el.clientHeight, start: span.start, end: span.end }) : null;
        if ((targetParagraph === undefined || targetParagraph === null) && p.at > 0.02 && p.at < 0.98 && to !== null) {
          el.scrollTop = to;
        }
        progressFor.current = id;
        handleScroll();
        if (to === null && span && !cutRef.current) saveProgress();
        return;
      }
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

    if (pId && textRef.current) {
      const b = marks.find(m => m.item === pId);
      if (b) {
        const ps = textRef.current.querySelectorAll('p');
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

  // Where the reader can go from here: along the sequence edges, or, when the
  // site lists Flow presets, to the neighbouring card in the reading order
  // this reader chose (src/lib/readingOrder.js; flow.next false keeps the
  // sequence edges). The same options go to the arrow keys and swipes.
  const orderPref = viewState && viewState.preference ? viewState.preference(READING_ORDER_PREF) : null;
  const flowOpts = useMemo(() => flowNav(feedData, settings, orderPref), [feedData, settings, orderPref]);
  const nav = useMemo(() => (article && feedData ? neighbours(feedData, article.id, flowOpts) : { prev: [], next: [] }), [article, feedData, flowOpts]);

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
    const item = step(feedData, article.id, dir, flowOpts);
    if (item) goTo(item, dir);
  };
  const goStepRef = useRef(goStep);
  goStepRef.current = goStep;
  useEffect(() => () => turnTimers.current.forEach(clearTimeout), []);

  // ── The reader as a scroll (every choice of Words before the next but
  // 'one'; src/lib/readerWords.js) ──

  // Show the open card whole, in place: its text grows below where the
  // reader is, and the scroll stays where it was.
  const showWhole = () => {
    if (!articleRef.current) return;
    wholeNext.current = true;
    if (!cutRef.current || contentFor.current !== getPersistentId(articleRef.current)) return;
    keepScroll.current = bodyRef.current ? bodyRef.current.scrollTop : null;
    setShownWhole(true);
  };
  // The same, drawn before this returns: for the voice, which takes the text
  // as it stands when it starts, and for Download.
  const showWholeNow = () => {
    try { flushSync(showWhole); } catch (_) { showWhole(); }
  };
  const showWholeNowRef = useRef(showWholeNow);
  showWholeNowRef.current = showWholeNow;
  useLayoutEffect(() => {
    if (keepScroll.current === null) return;
    if (bodyRef.current) bodyRef.current.scrollTop = keepScroll.current;
    keepScroll.current = null;
    handleScroll();
  }, [displayHtml]);

  // The voice is about to read the reader (TTS.jsx says so on
  // postpipe:voice-before-play, with the element it will read): the open
  // card shows whole first, so the voice reads all of it.
  useEffect(() => {
    const onVoice = (e) => {
      const container = e && e.detail ? e.detail.container : null;
      if (!container || container !== bodyRef.current) return;
      showWholeNowRef.current();
    };
    window.addEventListener('postpipe:voice-before-play', onVoice);
    return () => window.removeEventListener('postpipe:voice-before-play', onVoice);
  }, []);

  // A link to a paragraph of the open card (a bookmark, a shared place): the
  // card shows whole, so the paragraph is there to go to.
  useEffect(() => {
    if (!article || targetParagraph === undefined || targetParagraph === null) return;
    showWhole();
  }, [targetParagraph]);

  // A card beneath, opened by its title or its "read the rest": the same page
  // turn as Next, and it opens whole.
  const openFollowing = (item) => {
    if (!item || !onNavigate || !isReadable(item)) return;
    openWholeRef.current = item.id;
    goTo(item, 'next');
  };

  // The cards beneath: those Next would visit in turn, FOLLOW_STEP at a time;
  // more when the sentinel after the last comes near the view, once the
  // texts drawn so far have arrived. Only once the open card's text is in.
  const following = useMemo(
    () => (scrollMode && article && feedData ? followingCards(feedData, article.id, flowOpts, followCount) : []),
    [scrollMode, article, feedData, flowOpts, followCount],
  );
  const moreToCome = following.length >= followCount;
  const onFollowingLoaded = useRef(() => setFollowTick((t) => t + 1)).current;
  useEffect(() => {
    const el = moreRef.current;
    const root = bodyRef.current;
    if (!scrollMode || !el || !root || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((en) => en.isIntersecting)) return;
      if (root.querySelector('[data-reader-following][data-loading]')) return;
      setFollowCount((c) => c + FOLLOW_STEP);
    }, { root, rootMargin: '0px 0px 600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [scrollMode, following.length, followCount, followTick, contentHtml, article]);

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

  // The open card's source pill, under the byline and date: the top bar's own
  // pill for the card's source, on while the source shows in the graph and
  // off while it is hidden there, for every card that carries a source stamp
  // (the rule is in src/lib/readingOrder.js readerSourcePill), unless the
  // site's top bar shows no source pills. Read on every
  // render: the page re-renders the reader whenever the view state changes
  // (its subscribe(bump)), so a tap on this pill or on the top bar's changes
  // both at once.
  const sourcePill = readerSourcePill(article, viewState && viewState.state ? viewState.state.hiddenSources : null, feedData && feedData._sources, settings);

  if (!article) return null;

  // A neighbouring chapter: an arrow and its title, no word for the
  // direction. One not yet readable shows its title and status, not as a
  // button. Absent where there is no neighbour.
  const navLink = (item, dir) => {
    const status = navStatus(feedData, item);
    const arrow = <Icon body={iconBody(dir === 'next' ? 'arrow-right' : 'arrow-left')} size={16} className={styles.navArrow} />;
    const inner = dir === 'next'
      ? (<><span className={styles.navTitle}>{item.title}</span>{arrow}</>)
      : (<>{arrow}<span className={styles.navTitle}>{item.title}</span></>);
    if (status) {
      return (
        <div key={item.id} className={`${styles.navItem} ${styles.navLocked} ${dir === 'next' ? styles.navNext : ''}`} data-reader-nav={dir} data-nav-status>
          <span className={styles.navLine}>{inner}</span>
          <span className={styles.navStatus}>{status}</span>
        </div>
      );
    }
    return (
      <button
        key={item.id}
        className={`${styles.navItem} ${dir === 'next' ? styles.navNext : ''}`}
        data-reader-nav={dir}
        onClick={() => goTo(item, dir)}
        title={item.title}
      >
        <span className={styles.navLine}>{inner}</span>
      </button>
    );
  };
  const navRow = (where) => (nav.prev.length > 0 || nav.next.length > 0) && (
    <nav className={where === 'top' ? styles.navTop : styles.navBottom} aria-label="Chapters either side" data-reader-nav-row={where} {...(where === 'bottom' ? { 'data-reader-nav-bottom': '' } : {})}>
      <span className={styles.navSide}>{nav.prev.map((item) => navLink(item, 'prev'))}</span>
      <span className={`${styles.navSide} ${styles.navSideNext}`}>{nav.next.map((item) => navLink(item, 'next'))}</span>
    </nav>
  );

  const dateStr = article.date ? new Date(`${article.date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const metaParts = [dateStr, article.reading_time].filter(Boolean);

  // The byline (src/lib/byline.js), kept for the piece's author: its own
  // authors; else the site's author for a piece from the site's own folder,
  // as the build gives it; else none. The source pill under it names where
  // the piece came from.
  const by = byline(settings, article);
  const authorName = by ? by.name : '';
  const authorLink = by ? by.url : null;

  // settings.reader.header: a small line above the title, and whether the
  // byline sits under it.
  const header = readerHeader(settings, article);
  const progressMode = progressBarMode(settings);
  const canDownload = allowDownload(settings);
  const rights = rightsLine(settings && settings.rights);
  const nonTagRefs = nonTagReferences(article);

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen && !isMinimized ? styles.open : ''}`}
        onClick={onClose}
      />
      <div
        data-reader-panel
        className={`${styles.panel} ${isOpen && !isMinimized ? styles.open : ''} ${isMinimized ? styles.minimized : ''} ${wide ? styles.wide : ''} ${full ? styles.full : ''}`}
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
          title="Drag to move the reader · Double-click to put it back"
          data-reader-header
        >
          <div className={styles.dragGrip} aria-hidden="true">⋮⋮</div>
          <div id="tts-mount-point" className={`${styles.toolbarGroup} ${styles.ttsMount}`}></div>

          <div className={styles.toolbarGroup}>
            <button
              className={`${styles.tb} ${styles.tbLabeled} ${itemBookmarks.length > 0 ? styles.active : ''}`}
              onClick={toggleBookmark}
              aria-pressed={itemBookmarks.length > 0}
              title={itemBookmarks.length > 0 ? 'Bookmark the paragraph at the top (it replaces this chapter\'s bookmark), or take it away where it is' : 'Bookmark the paragraph at the top of the reader'}
              data-bookmark-toggle
            >
              <Icon body={iconBody('bookmark')} size={17} />
              <span className={styles.tbText}>Bookmark</span>
            </button>
            {bookmarksList(settings) && (
              <button
                className={`${styles.tb} ${showMarks ? styles.active : ''}`}
                onClick={() => setShowMarks((v) => !v)}
                aria-expanded={showMarks}
                title="Every place you have bookmarked"
                aria-label="Bookmarks"
                data-bookmark-list
              >
                <Icon body={iconBody('list')} size={17} />
              </button>
            )}
            <button
              className={styles.tb}
              onClick={handleCopyLinkToHere}
              title="Copy a link to here"
              aria-label="Copy a link to here"
              data-reader-link
            >
              <Icon body={iconBody('link')} size={17} />
            </button>
            {copied && <span className={styles.copied} role="status" data-reader-copied>copied</span>}
            <button
              className={`${styles.tb} ${showFrontmatter ? styles.active : ''}`}
              onClick={() => setShowFrontmatter(!showFrontmatter)}
              title="Details"
              aria-label="Details"
              aria-pressed={showFrontmatter}
              data-reader-details
            >
              <Icon body={iconBody('info')} size={17} />
            </button>
            {canDownload && (
              <button className={styles.tb} onClick={handleExport} title="Download" aria-label="Download" data-reader-download>
                <Icon body={iconBody('download')} size={17} />
              </button>
            )}
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
                  title={cfg.label}
                  aria-label={cfg.label}
                  dangerouslySetInnerHTML={{ __html: ICONS[cfg.icon] || ICONS.globe }}
                />
              );
            })}
          </div>

          <div className={styles.toolbarSpacer}></div>

          {/* The reader's own panel; then grow, expand and minimise, one set. */}
          <div className={styles.windowControls} data-reader-window>
            <button
              className={styles.tb}
              onClick={() => window.dispatchEvent(new CustomEvent('postpipe:toggle-settings', { detail: { where: 'reader' } }))}
              title="Reading settings"
              aria-label="Reading settings"
              data-reader-settings
            >
              <Icon body={iconBody('sliders-horizontal')} size={17} />
            </button>
            <button
              className={`${styles.tb} ${styles.growBtn} ${wide ? styles.active : ''}`}
              onClick={() => setWide((w) => !w)}
              aria-pressed={wide}
              title={wide ? 'Narrower' : 'Wider'}
              aria-label={wide ? 'Narrower' : 'Wider'}
              data-reader-grow
            >
              <Icon body={iconBody('move-horizontal')} size={17} />
            </button>
            <button
              className={`${styles.tb} ${full ? styles.active : ''}`}
              onClick={() => { setFull((f) => !f); setFloatingPos(null); }}
              aria-pressed={full}
              title={full ? 'Back to the side' : 'Fill the window'}
              aria-label={full ? 'Back to the side' : 'Fill the window'}
              data-reader-expand
            >
              <Icon body={iconBody(full ? 'minimize-2' : 'maximize-2')} size={17} />
            </button>
            <button
              className={styles.tb}
              onClick={() => setIsMinimized(true)}
              title="Minimise the reader"
              aria-label="Minimise the reader"
              data-reader-minimise
            >
              <Icon body={iconBody('minus')} size={17} />
            </button>
          </div>
        </div>
        <button className={styles.closeX} onClick={onClose} title="Close the reader" aria-label="Close the reader" data-reader-close>
          <Icon body={iconBody('x')} size={20} />
        </button>

        {showFrontmatter && (
          <FrontmatterPanel article={article} settings={settings} />
        )}
        {showMarks && bookmarksList(settings) && (
          <BookmarkList viewState={viewState} feedData={feedData} itemId={pId} />
        )}

        <div
          className={`${styles.body} ${followOn ? styles.following : ''} ${turnOut ? styles['turnOut_' + turnOut] : ''} ${turnIn ? styles['turnIn_' + turnIn] : ''}`}
          data-tts-target
          data-follow-along={followOn ? 'on' : 'off'}
          ref={bodyRef}
          onScroll={handleScroll}
        >
          {navRow('top')}
          <div className={styles.articleHeader} ref={headerRef}>
            {header.kicker && (
              <div className={styles.articleKicker}>{header.kicker}</div>
            )}
            <h1 className={styles.articleTitle}>{article.title || article.label}</h1>
            {header.byline && authorName && (
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
            {sourcePill && (
              // The top bar's own pill, its tap the same (viewState.toggleSource,
              // as the top bar's onToggleSource). A screen reader hears "hidden
              // in the graph" before it while the source is hidden; the voice
              // reads past it (data-pp-not-text), as it is no part of the text.
              <div
                className={styles.sourcePill}
                data-reader-source-pill
                data-reader-hidden-in-graph={sourcePill.hidden ? true : undefined}
                data-pp-not-text
              >
                {sourcePill.hidden && <span className={styles.offscreen}>{HIDDEN_IN_GRAPH}</span>}
                <FeedPill
                  source={sourcePill.source}
                  hidden={sourcePill.hidden}
                  onToggle={() => { if (viewState) viewState.toggleSource(sourcePill.source.id); }}
                  viewState={viewState}
                  showCount={showContainerCount(settings && settings.graph)}
                  staleAge={!!(settings && settings.topBar && settings.topBar.staleAge === true)}
                  popoverClassName={styles.sourcePillPopover}
                />
              </div>
            )}
          </div>
          <div ref={textRef} data-reader-text dangerouslySetInnerHTML={textInner} />
          {cut && (
            // The open card shows about the chosen number of words: the rest
            // shows here, in place (provisional words). The voice reads past it.
            <button type="button" className={styles.readRest} onClick={showWhole} data-reader-rest data-pp-not-text>
              {READ_THE_REST}
            </button>
          )}
          {!cut && nonTagRefs.length > 0 && contentHtml && article._posted !== 'title' && (
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--rp-border)' }} data-reader-references>
              <div style={{ color: 'var(--rp-accent)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>references</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {nonTagRefs.map((r, i) => (
                  <span
                    key={`${r.type}:${r.value}:${i}`}
                    className={styles.fmTag}
                    data-reference-type={r.type}
                    data-reference-weight={r.weight}
                    title={r.why || `${r.type}: ${r.value}${r.weight !== 1 ? ` (${r.weight})` : ''}`}
                  >
                    {r.type}: {r.label || r.value}{r.weight !== 1 ? ` (${r.weight})` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
          {!scrollMode && contentHtml && navRow('bottom')}
          {rights && contentHtml && (
            <footer className={styles.rightsLine} data-reader-rights>{rights}</footer>
          )}
          {!cut && contributionsConfig && contentHtml && article._posted !== 'title' && (
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
          {scrollMode && contentHtml && following.map((item) => (
            <FollowingCard
              key={item.id}
              item={item}
              feedData={feedData}
              settings={settings}
              viewState={viewState}
              cutAt={cutAt}
              boldOn={boldOn}
              onOpen={openFollowing}
              onLoaded={onFollowingLoaded}
            />
          ))}
          {scrollMode && contentHtml && following.length > 0 && moreToCome && (
            <div ref={moreRef} className={styles.followingMore} aria-hidden="true" data-reader-following-more />
          )}
        </div>
      </div>

      {isMinimized && article && (
        <div
          className={styles.restorePill}
          onClick={() => setIsMinimized(false)}
          title="Bring reading window back"
        >
          <span className={styles.pillIcon}><Icon body={iconBody('bookmark')} size={18} /></span>
          <span className={styles.pillLabel}>
            <span className={styles.pillTitle}>{article.title || article.label}</span>
            {authorName && <span className={styles.pillAuthor}>by {authorName}</span>}
          </span>
          <span className={styles.pillAction}>Restore</span>
        </div>
      )}
    </>
  );
}

// Helpers

function escapeHtml(v) {
  return String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// The HTML the reader shows for an item, by its kind (Substrate dispatch in
// the reader, ARCHITECTURE.md): the open card's and the cards' beneath it,
// so theirs match. Text at hand comes back as a string; a piece's own page,
// which has to be fetched, as a promise of one.
function itemHtml(item, feedData) {
  const kind = item.kind || 'essay';

  if (kind === 'placeholder' || item.substrate === 'placeholder') {
    const partNum = item.series_part || item.title || '';
    const actNum = Number(partNum) >= 21 ? '3' : '2';
    return `
        <div style="padding: 40px 24px; text-align: center; border: 1px dashed rgba(212, 175, 55, 0.35); border-radius: 12px; background: rgba(20, 24, 38, 0.6); margin-top: 24px;">
          <div style="font-size: 20px; font-weight: 600; color: var(--rp-accent, #d4af37); margin-bottom: 8px;">Chapter ${partNum}</div>
          <div style="font-size: 13px; color: var(--rp-text, #a8b2d1); opacity: 0.8; letter-spacing: 0.5px;">Act ${actNum} · In Progress</div>
        </div>
      `;
  }

  // A title-only piece has no page to fetch: say what is coming instead.
  if (item._posted === 'title') {
    const status = navStatus(feedData, item) || '';
    return `<div class="${styles.notYet}" data-not-yet><div class="${styles.notYetTitle}">${escapeHtml(item.title || '')}</div><div class="${styles.notYetStatus}">${escapeHtml(status)}</div></div>`;
  }

  // A piece from a source other than the site's own folder (a publisher's
  // feed) has no page of its own here: the reader shows the text the feed
  // carried, often a summary, and a link out to the piece itself.
  if (fromElsewhere(item)) return renderFeedItem(item);

  if (kind === 'essay' || kind === 'multi') return fetchPage(item);
  if (kind === 'image') {
    const img = item.image
      ? `<img src="${item.image}" style="max-width:100%;height:auto;border-radius:4px;display:block;margin:0 auto;">`
      : `<p style="color:#666;">No image resolved.</p>`;
    return img + renderMetadata(item);
  }
  return renderPlaceholder(item) + renderMetadata(item);
}

// An essay's own page: fetched (first the sibling file beside the viewer when
// the page is served from elsewhere), its h1 and its rights footer dropped.
async function fetchPage(item) {
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
    return bodyHtml + renderCompanions(item);
  } catch (e) {
    return renderPlaceholder(item, 'Rendered article not yet published to GitHub Pages.');
  }
}

// One of the cards beneath the open one, in a choice that is a scroll: its
// title (a button that opens it in the reader, whole), byline, date and
// reading time, and source pill, as the open card's; then its text, cut at
// about `cutAt` words (whole when cutAt is null), and "read the rest" when
// cut, which opens it as its title does. A card that cannot be read yet
// shows its title and status. Its text is loaded when it is drawn. The
// whole section is no part of the open card's text: the voice reads past it
// (data-pp-not-text), and nothing that counts the open card's paragraphs
// looks in it.
function FollowingCard({ item, feedData, settings, viewState, cutAt, boldOn, onOpen, onLoaded }) {
  const readable = isReadable(item);
  const [html, setHtml] = useState(null);
  useEffect(() => {
    if (!readable) return undefined;
    let alive = true;
    const done = (h) => { if (alive) setHtml(typeof h === 'string' ? h : ''); };
    const out = itemHtml(item, feedData);
    if (out && typeof out.then === 'function') out.then(done, () => done(''));
    else done(out);
    return () => { alive = false; };
  }, [item, feedData, readable]);
  useEffect(() => { if (html !== null && onLoaded) onLoaded(); }, [html]);

  const excerpt = useMemo(() => (html && cutAt ? excerptHtml(html, cutAt) : null), [html, cutAt]);
  const shown = excerpt ? excerpt.html : (html || '');
  const display = useMemo(() => lazyImages(boldOn ? boldStartHtml(shown) : shown), [shown, boldOn]);
  const inner = useMemo(() => ({ __html: display }), [display]);

  const title = item.title || item.label;
  if (!readable) {
    return (
      <section className={styles.following} data-reader-following data-pp-not-text data-reader-following-id={item.id}>
        <h2 className={styles.followingTitle}>{title}</h2>
        <div className={styles.navStatus} data-nav-status>{navStatus(feedData, item)}</div>
      </section>
    );
  }

  const header = readerHeader(settings, item);
  const by = byline(settings, item);
  const dateStr = item.date ? new Date(`${item.date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const metaParts = [dateStr, item.reading_time].filter(Boolean);
  const pill = readerSourcePill(item, viewState && viewState.state ? viewState.state.hiddenSources : null, feedData && feedData._sources, settings);

  return (
    <section
      className={styles.following}
      data-reader-following
      data-pp-not-text
      data-reader-following-id={item.id}
      data-loading={html === null ? '' : undefined}
    >
      <h2 className={styles.followingTitle}>
        <button type="button" className={styles.followingOpen} onClick={() => onOpen(item)} data-reader-following-open>
          {title}
        </button>
      </h2>
      {header.byline && by && (
        <div className={styles.articleByline}>
          by {by.url ? (
            <a href={by.url} target="_blank" rel="noopener noreferrer">{by.name}</a>
          ) : (
            by.name
          )}
        </div>
      )}
      {metaParts.length > 0 && (
        <div className={styles.articleMeta}>{metaParts.join(' · ')}</div>
      )}
      {pill && (
        <div
          className={styles.sourcePill}
          data-reader-source-pill
          data-reader-hidden-in-graph={pill.hidden ? true : undefined}
          data-pp-not-text
        >
          {pill.hidden && <span className={styles.offscreen}>{HIDDEN_IN_GRAPH}</span>}
          <FeedPill
            source={pill.source}
            hidden={pill.hidden}
            onToggle={() => { if (viewState) viewState.toggleSource(pill.source.id); }}
            viewState={viewState}
            showCount={showContainerCount(settings && settings.graph)}
            staleAge={!!(settings && settings.topBar && settings.topBar.staleAge === true)}
            popoverClassName={styles.sourcePillPopover}
          />
        </div>
      )}
      <div className={styles.followingText} data-reader-following-text dangerouslySetInnerHTML={inner} />
      {excerpt && (
        <button type="button" className={styles.readRest} onClick={() => onOpen(item)} data-reader-rest>
          {READ_THE_REST}
        </button>
      )}
    </section>
  );
}

// How far through the open card the reader is, 0..1 (cardProgress), given
// the card's span in the scroll (openCardSpan); 0 before it is drawn.
function openCardFraction(el, span) {
  if (!el || !span) return 0;
  return cardProgress({ scrollTop: el.scrollTop, clientHeight: el.clientHeight, start: span.start, end: span.end });
}

// The source the aggregator stamps on every item (feed.json `_sources`).
function sourceOf(item) {
  return item._source || (item.originalItem && item.originalItem._source) || null;
}

// A piece that came in through a feed rather than the site's own folder: its
// source says so. Without a source stamp, a text item carrying its own
// content_html is taken as one.
function fromElsewhere(item) {
  const source = sourceOf(item);
  if (source) return source.type !== 'local';
  return (item.kind === 'text' || item.kind === 'link') && typeof item.content_html === 'string';
}

// HTML a feed carried, read into a document as a fetched page is, and handed
// back without scripts, frames, event handlers or javascript: links.
function cleanHtml(html) {
  const doc = new DOMParser().parseFromString(String(html), 'text/html');
  doc.querySelectorAll('script, style, iframe, object, embed, link, meta, form, noscript').forEach((el) => el.remove());
  doc.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on')) el.removeAttribute(attr.name);
      else if ((name === 'href' || name === 'src' || name === 'xlink:href') && /^\s*javascript:/i.test(attr.value)) el.removeAttribute(attr.name);
    }
  });
  const body = doc.querySelector('body');
  return body ? body.innerHTML : '';
}

// A feed item's text as the feed carried it (content_html, else its
// summary), then a plain link out to the piece at its own address.
function renderFeedItem(item) {
  let html = '';
  if (typeof item.content_html === 'string' && item.content_html.trim()) {
    const cleaned = cleanHtml(item.content_html);
    // A bare run of text gets a paragraph, so it reads (and bookmarks,
    // follows along) like any other.
    html += /<(p|div|ul|ol|h[1-6]|blockquote|pre|table|figure|section|article)\b/i.test(cleaned) ? cleaned : `<p>${cleaned}</p>`;
  } else if (item.tldr || item.summary) {
    html += `<p>${escapeHtml(item.tldr || item.summary)}</p>`;
  }
  const link = item.canonical_url || item.url || '';
  if (link) {
    const source = sourceOf(item);
    let where = (source && source.title) || '';
    if (!where) { try { where = new URL(link).hostname; } catch (_) { where = ''; } }
    html += `<p data-reader-link-out><a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">Read the whole piece${where ? ' at ' + escapeHtml(where) : ''}</a></p>`;
  }
  return html;
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
  const baseFields = settings?.frontmatter_display || [];
  const nonTagRefs = nonTagReferences(article);
  const fields = nonTagRefs.length && !baseFields.includes('references')
    ? [...baseFields, 'references']
    : baseFields;
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
      case 'tags': {
        // The chips come from the item's tag references
        // (src/lib/tagReferences.js), item.tags standing in when it has none.
        // A chip rosetta-tagz wrote carries its concept, origin and weight as
        // data attributes and, where rosetta-tagz wrote a why, a hover with
        // the why and the PROV lines the graph's tag-edge hover shows
        // (src/lib/provenance.js: the same lines, after the role).
        const tagRefs = tagReferences(article);
        if (tagRefs.length) {
          value = <>{tagRefs.map((r) => (
            <span
              key={r.value}
              className={styles.fmTag}
              data-concept={typeof r.concept === 'string' && r.concept ? r.concept : undefined}
              data-origin={typeof r.origin === 'string' && r.origin ? r.origin : undefined}
              data-weight={typeof r.weight === 'number' && Number.isFinite(r.weight) ? r.weight : undefined}
              title={typeof r.why === 'string' && r.why ? [...wrapText(r.why), ...provenanceLines(r)].join('\n') : undefined}
            >{r.value}</span>
          ))}</>;
        } else {
          // A card with no tagz says why, in the build's own words, where
          // the chips would be (src/lib/untaggedBecause.js): plain text,
          // not a chip, so it reads as a note and never as a tag.
          const because = untaggedBecauseOf(article);
          if (because) value = <span className={styles.fmUntagged} data-untagged-because>{because}</span>;
        }
        break;
      }
      case 'references':
        if (nonTagRefs.length) {
          value = <>{nonTagRefs.map((r, i) => (
            <span
              key={`${r.type}:${r.value}:${i}`}
              className={styles.fmTag}
              data-reference-type={r.type}
              data-reference-weight={r.weight}
              title={r.why || `${r.type}: ${r.value}${r.weight !== 1 ? ` (${r.weight})` : ''}`}
            >
              {r.type}: {r.label || r.value}{r.weight !== 1 ? ` (${r.weight})` : ''}
            </span>
          ))}</>;
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
