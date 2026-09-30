with open('src/components/GraphViewer/GraphViewer.jsx', 'r') as f:
    content = f.read()

content = content.replace("function createContainerDragHandler({ isCollapsed }) {\n      return d3.drag()",
"function createContainerDragHandler({ isCollapsed }) {\n      return d3.drag().clickDistance(5)")

content = content.replace("const dragHandler = d3.drag()",
"const dragHandler = d3.drag().clickDistance(5)")

with open('src/components/GraphViewer/GraphViewer.jsx', 'w') as f:
    f.write(content)
