with open('src/components/GraphViewer/GraphViewer.jsx', 'r') as f:
    content = f.read()

replacement = """    const closedContainers = new Set();
    if (GS.initialCollapsed === 'all') {
      (feedData.containers || []).forEach(c => closedContainers.add(c.id));
    } else if (Array.isArray(GS.initialCollapsed)) {
      GS.initialCollapsed.forEach(id => closedContainers.add(id));
    }"""
content = content.replace("    const closedContainers = new Set();", replacement)

with open('src/components/GraphViewer/GraphViewer.jsx', 'w') as f:
    f.write(content)
