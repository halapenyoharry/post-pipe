// Bold word beginnings for a piece of rendered HTML: each text node is split
// into bold and plain runs. Only the displayed copy changes; the HTML it was
// made from is kept as it was, and the words read out the same.

import { boldStartSegments } from '../../lib/boldStart';

const SKIP = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'KBD', 'SAMP', 'svg']);

export function boldStartHtml(html) {
  if (!html || typeof DOMParser === 'undefined') return html;
  const doc = new DOMParser().parseFromString(`<div id="pp-bs-root">${html}</div>`, 'text/html');
  const root = doc.getElementById('pp-bs-root');
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      for (let el = n.parentElement; el && el !== root; el = el.parentElement) {
        if (SKIP.has(el.tagName)) return NodeFilter.FILTER_REJECT;
      }
      return /[\p{L}]/u.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);
  for (const node of nodes) {
    const frag = doc.createDocumentFragment();
    for (const seg of boldStartSegments(node.nodeValue)) {
      if (seg.bold) {
        const b = doc.createElement('b');
        b.className = 'pp-bs';
        b.textContent = seg.text;
        frag.appendChild(b);
      } else {
        frag.appendChild(doc.createTextNode(seg.text));
      }
    }
    node.parentNode.replaceChild(frag, node);
  }
  return root.innerHTML;
}
