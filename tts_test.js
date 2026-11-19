// Sandbox for text extraction logic
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<body>
  <p>This is a <strong>test</strong> of the system. I went to the <a href="#">store</a> today!</p>
  <p>Next paragraph.</p>
</body>`);
const document = dom.window.document;
const NodeFilter = dom.window.NodeFilter;

function extractSentences(container) {
  const result = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NAV') return NodeFilter.FILTER_REJECT;
      if (node.textContent.trim().length === 0) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const blockTags = new Set(['P', 'DIV', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'TD', 'TH']);
  
  let currentBlockText = '';
  let currentBlockNodes = [];
  let currentBlockElement = null;

  function getBlockParent(node) {
    let p = node.parentElement;
    while (p && p !== container && !blockTags.has(p.tagName)) {
      p = p.parentElement;
    }
    return p;
  }

  function flushBlock() {
    if (currentBlockText.trim().length === 0) {
      currentBlockText = '';
      currentBlockNodes = [];
      return;
    }
    
    // Split text into sentences
    const parts = currentBlockText.match(/[^.!?]*[.!?]+[\s]*/g) || [currentBlockText];
    let charOffset = 0;
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.length > 0) {
        const sentenceStart = charOffset;
        const sentenceEnd = charOffset + part.length;
        const sentenceNodes = [];
        
        let nodeOffset = 0;
        for (const n of currentBlockNodes) {
          const nodeStart = nodeOffset;
          const nodeEnd = nodeOffset + n.text.length;
          
          if (nodeEnd > sentenceStart && nodeStart < sentenceEnd) {
            // Overlap!
            const overlapStart = Math.max(0, sentenceStart - nodeStart);
            const overlapEnd = Math.min(n.text.length, sentenceEnd - nodeStart);
            sentenceNodes.push({ node: n.node, start: overlapStart, end: overlapEnd });
          }
          nodeOffset += n.text.length;
        }
        
        result.push({ text: trimmed, nodes: sentenceNodes });
      }
      charOffset += part.length;
    }
    
    currentBlockText = '';
    currentBlockNodes = [];
  }

  let node;
  while ((node = walker.nextNode())) {
    const blockParent = getBlockParent(node);
    if (currentBlockElement !== blockParent) {
      flushBlock();
      currentBlockElement = blockParent;
    }
    
    currentBlockText += node.textContent;
    currentBlockNodes.push({ node: node, text: node.textContent });
  }
  flushBlock();

  return result;
}

const sentences = extractSentences(document.body);
console.log(JSON.stringify(sentences, (key, val) => key === 'node' ? val.textContent : val, 2));
