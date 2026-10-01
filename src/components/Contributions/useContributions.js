import { useEffect, useMemo, useState } from 'react';
import { contributionsConfig, visibleContributions, connectionEdges } from '../../lib/contributions';

/**
 * Readers' contributions for a page: settings.contributions says where the
 * file is (src) and whether test items show (showTest). Fetched once, apart
 * from the feed, and filtered to what may be shown. A site without the
 * setting asks for nothing; a missing or broken file shows nothing.
 *
 * Returns { config, list, layers }: the filled-in settings (null when off),
 * the contributions to show, and the edge-layer dimensions that have
 * something to draw (['readers'] once a reader has connected two chapters).
 */
export function useContributions(settings, feedData) {
  // Keyed by the setting's own content: a host that rebuilds its settings
  // object on every render must not refetch or recount.
  const key = JSON.stringify((settings && settings.contributions) || null);
  const config = useMemo(() => contributionsConfig(settings), [key]);
  const [raw, setRaw] = useState(null);

  useEffect(() => {
    if (!config) return undefined;
    let live = true;
    const sep = config.src.includes('?') ? '&' : '?';
    fetch(config.src + sep + 'v=' + Date.now())
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (live) setRaw(data); })
      .catch(() => { if (live) setRaw(null); });
    return () => { live = false; };
  }, [config && config.src]);

  const list = useMemo(
    () => (config && raw ? visibleContributions(raw, { items: (feedData && feedData.items) || [], showTest: config.showTest }) : []),
    [key, raw, feedData],
  );
  const layers = useMemo(() => (connectionEdges(list).length ? ['readers'] : []), [list]);
  return { config, list, layers };
}
