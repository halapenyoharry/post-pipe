// Lens registry — dispatches from a node's `kind` to the React component
// that renders it. The registry is open: host applications can override or
// extend it without modifying NodeView itself.
//
// Today only TextView exists; image/audio/video kinds fall back to TextView
// (which has an internal image-card variant for kind === 'image'). When
// dedicated lenses for those substrates land, they slot in here.

import { TextView } from './TextView';

const defaultRegistry = {
  text:              TextView,
  essay:             TextView,
  fragment:          TextView,
  multi:             TextView,
  image:             TextView,   // future: ImageView
  'podcast-episode': TextView,   // future: AudioView
  video:             TextView,   // future: VideoView
};

/**
 * Pick the lens component for a given node kind. Unknown kinds fall back to
 * TextView so unfamiliar data still renders something legible.
 *
 * @param {string} kind
 * @param {Object} [overrides]  optional per-host extension map
 * @returns {React.ComponentType}
 */
export function lensFor(kind, overrides = {}) {
  const reg = { ...defaultRegistry, ...overrides };
  return reg[kind] || TextView;
}
