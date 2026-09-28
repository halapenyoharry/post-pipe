function normalize(text) {
  return text.toLowerCase()
    .replace(/[^\w\s]|_/g, '') // strip punctuation
    .replace(/\s+/g, ' ')      // collapse whitespace
    .trim();
}

function jaccard(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 1;
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

function wordSet(text) {
  const words = text.split(' ').filter(w => w.length > 0);
  return new Set(words);
}

function lcsMatches(oldNorm, newNorm) {
  const m = oldNorm.length;
  const n = newNorm.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldNorm[i - 1] === newNorm[j - 1] && oldNorm[i - 1] !== '') {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const matches = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (oldNorm[i - 1] === newNorm[j - 1] && oldNorm[i - 1] !== '') {
      matches.push([i - 1, j - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return matches.reverse();
}

function mapParagraphs(oldParas, newParas) {
  const oldNorm = oldParas.map(normalize);
  const newNorm = newParas.map(normalize);

  const exactMatches = lcsMatches(oldNorm, newNorm);
  
  const map = Array(oldParas.length).fill(-1);
  const usedNew = new Set();
  
  for (const [oldIdx, newIdx] of exactMatches) {
    map[oldIdx] = newIdx;
    usedNew.add(newIdx);
  }

  // Fill gaps
  const oldGaps = [];
  const newGaps = [];

  let exactMatchIdx = 0;
  
  // We can just iterate through and match unmapped old paragraphs with unmapped new ones sequentially,
  // constrained by the exact matches as boundaries.
  
  exactMatches.push([oldParas.length, newParas.length]); // Dummy end match for gap calculation
  let lastOld = -1;
  let lastNew = -1;
  
  for (const [matchOld, matchNew] of exactMatches) {
    // Gap between last match and current match
    const gapOld = [];
    for (let i = lastOld + 1; i < matchOld; i++) gapOld.push(i);
    
    const gapNew = [];
    for (let i = lastNew + 1; i < matchNew; i++) gapNew.push(i);
    
    // Greedily pair in the gap
    let newPtr = 0;
    for (const o of gapOld) {
      if (map[o] !== -1) continue; // Already mapped
      const oSet = wordSet(oldNorm[o]);
      while (newPtr < gapNew.length) {
        const n = gapNew[newPtr];
        if (usedNew.has(n)) {
          newPtr++;
          continue;
        }
        const nSet = wordSet(newNorm[n]);
        if (jaccard(oSet, nSet) >= 0.5) {
          map[o] = n;
          usedNew.add(n);
          newPtr++;
          break; // Mapped
        }
        newPtr++; // Skip if not a good match, move to next possible new paragraph
      }
    }
    
    lastOld = matchOld;
    lastNew = matchNew;
  }

  return map;
}

function decodeHtmlEntities(text) {
  return text.replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'");
}

function paragraphTexts(html) {
  const regex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  const texts = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    let pContent = match[1];
    pContent = pContent.replace(/<[^>]+>/g, ''); // strip tags
    texts.push(decodeHtmlEntities(pContent).trim());
  }
  return texts;
}

module.exports = {
  mapParagraphs,
  paragraphTexts
};
