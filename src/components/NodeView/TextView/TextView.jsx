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

  // Background style: gradient over image if present, else solid.
  const tint = isDraft
    ? 'rgba(42,42,62,0.85)'
    : 'rgba(30,58,95,0.85)';
  const bgImage = article.image
    ? `linear-gradient(${tint},${tint}), url('${article.image}')`
    : '';
  const bgColor = isDraft ? '#2a2a3e' : '#1e3a5f';

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
        background: bgImage || bgColor,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // Source-color tints the border. Pinned state still wins (accent
        // color via the .pinned class) for selection clarity.
        ...(sourceColor && !pinned ? { borderColor: sourceColor } : {})
      }}
    >
      <CardContent
        article={article}
        height={height}
        viewState={viewState}
        expanded={expanded}
        useFullArticle={useFullArticle}
        fullContent={fullContent}
      />
      {pinned && <PopoutButton />}
    </div>
  );
}

// Below this height, a title pinned above the body costs more than it gives:
// it takes a third of the card and leaves a slot too short to read in.
const COMPACT_HEIGHT = 260;

function CardContent({ article, height, viewState, expanded, useFullArticle, fullContent }) {
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
    return (
      <div className={styles.titleCentered}>
        {/* labelMedium already prefers an authored short_title and falls back
            to a four-word reduction, so a long news headline stops being a
            wall of text in a card with room for a phrase. */}
        {article.labelMedium || article.short_title || article.title || article.label}
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
