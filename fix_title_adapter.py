with open('src/adapters/LocalFolderAdapter.js', 'r') as f:
    content = f.read()

# Change isVisible logic
content = content.replace("const isVisible = (vis === true || vis === 'yes' || vis === 'true' || vis === 'public');",
"const isVisible = (vis === true || vis === 'yes' || vis === 'true' || vis === 'public' || vis === 'title');")

# Change contentToItem
content = content.replace("function contentToItem(c, rootPath, pagesBase, coversDir) {",
"""function contentToItem(c, rootPath, pagesBase, coversDir) {
  const isTitleOnly = c.posted === 'title';""")

content = content.replace("commit_times: Array.isArray(c.commit_times) ? c.commit_times : (() => {",
"""commit_times: isTitleOnly ? [] : (Array.isArray(c.commit_times) ? c.commit_times : (() => {""")
content = content.replace("})(),\n    license:", "})()),\n    license:")

content = content.replace("version: c.version || undefined,", "version: isTitleOnly ? undefined : (c.version || undefined),")
content = content.replace("version_maps: c.version_maps || undefined,", "version_maps: isTitleOnly ? undefined : (c.version_maps || undefined),")
content = content.replace("_status: bucket,", "_status: bucket,\n    _posted: c.posted,")


# Change generateItemPage
content = content.replace("if (!pagesDir || !c.body) return;", "if (!pagesDir || !c.body || c.posted === 'title') return;")

with open('src/adapters/LocalFolderAdapter.js', 'w') as f:
    f.write(content)
