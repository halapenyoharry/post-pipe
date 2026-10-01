import React from 'react';

// An inline SVG icon on a 24-unit box: body is the markup inside <svg>
// (src/lib/icons.js for the engine's own, or a site's from its settings).
// Decorative: the control carrying it has the accessible name.
export function Icon({ body, size = 16, className }) {
  if (!body) return null;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      data-icon
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
