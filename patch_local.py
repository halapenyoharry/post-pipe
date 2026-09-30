import re

with open('src/adapters/LocalFolderAdapter.js', 'r') as f:
    content = f.read()

# Replace `const items = contents.map` with filtering
replacement = """  const { contents } = ingestFolder(rootPath);
  const items = contents.filter(c => {
    let vis = c.posted;
    if (vis === undefined || vis === null) vis = config.visibilityDefault;
    const isVisible = (vis === true || vis === 'yes' || vis === 'true' || vis === 'public');
    return isVisible;
  }).map(c => {
    generateItemPage(c, rootPath, pagesDir);
    return contentToItem(c, rootPath, pagesBase, coversDir);
  });"""

content = re.sub(r'  const { contents } = ingestFolder\(rootPath\);\n  const items = contents\.map\(c => \{\n    generateItemPage\(c, rootPath, pagesDir\);\n    return contentToItem\(c, rootPath, pagesBase, coversDir\);\n  \}\);', replacement, content)

with open('src/adapters/LocalFolderAdapter.js', 'w') as f:
    f.write(content)
