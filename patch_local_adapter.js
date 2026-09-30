const fs = require('fs');
const path = require('path');

let code = fs.readFileSync('src/adapters/LocalFolderAdapter.js', 'utf8');

code = code.replace(/const { contents } = ingestFolder\(rootPath\);\n  const items = contents\.filter\(c => {[\s\S]*?}\)\.map\(c => {[\s\S]*?}\);/, `const { contents } = ingestFolder(rootPath);
  
  const hiddenSlugs = new Set();
  const visibleContents = [];
  
  for (const c of contents) {
    let vis = c.posted;
    if (vis === undefined || vis === null) vis = config.visibilityDefault;
    const isVisible = (vis === true || vis === 'yes' || vis === 'true' || vis === 'public');
    if (isVisible) {
      visibleContents.push(c);
    } else {
      hiddenSlugs.add(c.id);
    }
  }

  const items = visibleContents.map(c => {
    if (c.connected_to && Array.isArray(c.connected_to)) {
      c.connected_to = c.connected_to.filter(slug => !hiddenSlugs.has(slug));
    }
    generateItemPage(c, rootPath, pagesDir, hiddenSlugs);
    return contentToItem(c, rootPath, pagesBase, coversDir);
  });`);

code = code.replace(/function generateItemPage\(c, rootPath, pagesDir\) {/, `function generateItemPage(c, rootPath, pagesDir, hiddenSlugs = new Set()) {`);

code = code.replace(/const rawMd = fs\.readFileSync\(srcPath, 'utf8'\);/, `let rawMd = fs.readFileSync(srcPath, 'utf8');
      if (hiddenSlugs.size > 0) {
        // Find links in markdown, e.g. [some text](slug) or [some text](slug.html) or [some text](./slug.html)
        // We replace them with just the text if the slug is hidden.
        // A naive regex for markdown links:
        const linkRegex = /\\[([^\\]]+)\\]\\(([^)]+)\\)/g;
        rawMd = rawMd.replace(linkRegex, (match, text, url) => {
          // Normalize url to slug
          let slug = url.replace(/^\\.\\//, '').replace(/\\.html$/, '').replace(/\\/$/, '');
          if (hiddenSlugs.has(slug)) {
            return text; // Strip the link, leave the text
          }
          return match;
        });
      }`);

fs.writeFileSync('src/adapters/LocalFolderAdapter.js', code);
