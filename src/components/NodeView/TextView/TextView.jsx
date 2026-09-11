import React from 'react';
import styles from './TextView.module.css';

/**
 * TextView — the lens that renders a text-substrate node (essay, fragment,
 * multi, or any kind whose primary content is read as text) as a card.
 *
 * Pure presentation: no event handlers, no D3, no state. Renders into any
 * container. The graph mounts one of these inside each article foreignObject;
 * future surfaces (search-result rows, companion strips) can mount the same
 * component without any change.
 *
 * Props:
 *   article: the corpus item (title, short_title, description, image, etc.)
 *   width, height: render dimensions in pixels
 *   viewState: { hovered, pinned, lod } — current display mode
 *     lod ∈ { 'slug' | 'title' | 'full' } — zoom-derived level of detail
 *     hovered/pinned promote the card to "expanded" (scrollable text)
 *   fullContent: optional pre-fetched article HTML; when present and pinned,
 *     replaces the summary as the scrollable body
 *   theme: optional { accent, publishedColor, draftColor } overrides; falls
 *     back to CSS-variable defaults declared in the module
 */
export function TextView({ article, width, height, viewState, fullContent }) {
  const { hovered = false, pinned = false, lod = 'full' } = viewState || {};
  const expanded = hovered || pinned;
  const useFullArticle = pinned && !!fullContent;

  // The "draft vs published" distinction maps to the bucket the graph
  // ingester chose. Used to tint backgrounds. Per-source color (when
  // provided via article._source.color) overrides the border so each
  // feed has its own visual identity.
  const isDraft = !(
    article._status === 'published' ||
    article._status === 'bloomed' ||
    !!(article.syndication && article.syndication.canonical)
  );
  const sourceColor = article._source && article._source.color;

  // Image-kind nodes are a different visual: photo card with caption.
  if (article.kind === 'image' && article.image) {
    return (
      <ImageCard
        article={article}
        width={width}
        height={height}
        pinned={pinned}
        hovered={hovered}
        isDraft={isDraft}
      />
    );
  }

  // A cover used to be painted across the whole card under an 85%-opaque tint.
  // At that opacity a photograph is a smudge and a diagram is noise — it read
  // as the card being badly rendered rather than as an image being present.
  // The cover now gets a band of its own at full opacity with the text below
  // it, so it is either legibly an image or not shown at all.
  const bgColor = isDraft ? '#2a2a3e' : '#1e3a5f';
  const MIN_HEIGHT_FOR_BAND = 120;
  const showBand = Boolean(article.image) && height >= MIN_HEIGHT_FOR_BAND;
  const bandHeight = showBand ? Math.round(Math.min(height * 0.42, 72)) : 0;

  const cardClassNames = [
    styles.card,
    isDraft ? styles.draft : styles.published,
    expanded && styles.expanded,
    pinned && styles.pinned
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClassNames}
      style={{
        width,
        height,
        background: bgColor,
        // Provenance moves from a full coloured ring to a bar down one edge.
        // Ringing the whole card in a saturated feed colour competed with the
        // content for attention; an edge bar says the same thing quietly.
        // Pinned still wins outright, for selection clarity.
        ...(sourceColor && !pinned ? { boxShadow: `inset 3px 0 0 ${sourceColor}` } : {})
      }}
    >
      {showBand && (
        <div
          className={styles.imageBand}
          style={{ height: bandHeight, backgroundImage: `url('${article.image}')` }}
        />
      )}
      <CardContent
        article={article}
        width={width}
        height={height - bandHeight}
        bandHeight={bandHeight}
        viewState={viewState}
        expanded={expanded}
        useFullArticle={useFullArticle}
        fullContent={fullContent}
      />
      {pinned && <PopoutButton />}
    </div>
  );
}

// Size a short label to actually fill the card it sits in.
//
// The label font was a fixed 18 units no matter how big the card was or how
// few words it held, so a card carrying two words spent ninety percent of
// itself on empty space. Reducing titles to two and four words freed that room
// and nothing claimed it.
//
// Tries laying the words out over one line, two, three, four; for each, asks
// how large the type could be before the longest line overflows the width or
// the stack overflows the height; keeps the best. Character width is estimated
// rather than measured — a measurement would need a layout pass per node per
// zoom change, and being a few percent conservative costs nothing here.
function fitFontSize(text, width, height, opts = {}) {
  const {
    min = 10, max = 44, lineHeight = 1.22, charRatio = 0.52, pad = 10, maxLines = 4,
  } = opts;
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length || !width || !height) return min;

  const boxW = Math.max(width - pad * 2, 8);
  const boxH = Math.max(height - pad * 2, 8);

  let best = min;
  for (let lines = 1; lines <= Math.min(maxLines, words.length); lines++) {
    const perLine = Math.ceil(words.length / lines);
    let longest = 0;
    let used = 0;
    for (let i = 0; i < words.length; i += perLine) {
      longest = Math.max(longest, words.slice(i, i + perLine).join(' ').length);
      used++;
    }
    const byWidth = boxW / Math.max(longest * charRatio, 1);
    const byHeight = boxH / Math.max(used * lineHeight, 1);
    best = Math.max(best, Math.min(byWidth, byHeight));
  }
  return Math.round(Math.max(min, Math.min(max, best)));
}

// Below this height, a title pinned above the body costs more than it gives:
// it takes a third of the card and leaves a slot too short to read in.
const COMPACT_HEIGHT = 260;

function CardContent({ article, width, height, bandHeight = 0, viewState, expanded, useFullArticle, fullContent }) {
  // Expanded (hover or pin): title + scrollable body. Pin upgrades to the
  // full fetched article when available; otherwise we show the summary.
  if (expanded) {
    const body = useFullArticle ? fullContent : (article.description || '');
    const title = article.title || article.label;

    // In a small card the title scrolls away with the text instead of holding
    // a fixed band at the top. You have already read it by the time you start
    // scrolling, and the card is too short to spend 36px on remembering it.
    if (height && height < COMPACT_HEIGHT) {
      return (
        <div className={`${styles.scroll} ${styles.scrollFull} ${useFullArticle ? styles.full : ''} rp-scroll`}>
          <div className={styles.titleScrolling}>{title}</div>
          {body && <div dangerouslySetInnerHTML={{ __html: body }} />}
        </div>
      );
    }

    return (
      <>
        <div className={styles.title}>
          {title}
        </div>
        {body && (
          <div
            className={`${styles.scroll} ${useFullArticle ? styles.full : ''} rp-scroll`}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}
      </>
    );
  }

  // Slug-LOD: the floating SVG slug-label overlay (in GraphViewer) does the
  // labeling. The card itself is empty — just a marker for hit-testing.
  if (viewState.lod === 'slug') {
    return null;
  }

  // Title-only LOD: centered title, larger font, no description.
  if (viewState.lod === 'title') {
    // labelMedium already prefers an authored short_title and falls back to a
    // four-word reduction, so a long news headline stops being a wall of text
    // in a card with room for a phrase.
    const centredLabel =
      article.labelMedium || article.short_title || article.title || article.label;
    return (
      <div
        className={styles.titleCentered}
        style={{ fontSize: fitFontSize(centredLabel, width, height) + 'px' }}
      >
        {centredLabel}
      </div>
    );
  }

  // Full LOD (default): title + truncated description preview.
  const desc = article.description || '';
  const preview = desc.length > 120 ? desc.slice(0, 117) + '...' : desc;
  return (
    <>
      <div className={styles.titleInline}>
        {article.title || article.label}
      </div>
      {preview && (
        <div className={styles.preview}>{preview}</div>
      )}
    </>
  );
}

function ImageCard({ article, width, height, pinned, hovered, isDraft }) {
  // Photo-on-top, caption-below. Hover/pin slightly enlarges.
  const cardClassNames = [
    styles.imageCard,
    isDraft ? styles.draft : styles.published,
    pinned && styles.pinned
  ].filter(Boolean).join(' ');

  const imgH = pinned ? height - 24 : hovered ? height - 24 : height - 24;

  return (
    <div
      className={cardClassNames}
      style={{ width, height }}
    >
      <div
        className={styles.imageFrame}
        style={{
          width,
          height: imgH,
          backgroundImage: `url('${article.image}')`
        }}
      />
      <div className={styles.imageCaption}>
        {article.short_title || article.title || article.label}
      </div>
      {pinned && <PopoutButton />}
    </div>
  );
}

function PopoutButton() {
  return (
    <div
      data-popout="1"
      title="Open in reader"
      className={styles.popout}
    >
      <svg
        data-popout="1"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        width="13"
        height="13"
        style={{ pointerEvents: 'none' }}
      >
        <path d="M14 3h7v7" />
        <path d="M21 3l-9 9" />
        <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
      </svg>
    </div>
  );
}
