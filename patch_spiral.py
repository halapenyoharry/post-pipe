import re
with open('src/components/GraphViewer/GraphViewer.jsx', 'r') as f:
    content = f.read()

force_code = """    function createContainerSpiralForce() {
      let nodes = [];
      function force(alpha) {
        if (graphSettings.spiral?.enabled === false) return;
        const spacing = graphSettings.spiral?.spacing || 20;
        
        containerGroups.each(function (c) {
          if (closedContainers.has(c.id)) return;
          const memberSlugs = getAllMemberSlugs(c.id);
          const memberNodes = memberSlugs
            .map((slug) => nodeBySlug.get(slug))
            .filter((n) => n && Number.isFinite(n.x) && Number.isFinite(n.y));
          
          if (memberNodes.length < 2) return;
          
          const sorted = memberNodes.sort((a, b) => {
             const tA = Date.parse(a.date || '') || 0;
             const tB = Date.parse(b.date || '') || 0;
             return tA - tB;
          });
          
          const cp = containerCentroids.get(c.id) || {x: 0, y: 0};
          const first = sorted[0];
          
          const w = first._size?.width || CARD.width;
          const h = first._size?.height || CARD.height;
          
          // Pull first directly below label
          // Label is at top 1/3, center is cp.y, top is roughly cp.y - h/2.
          const targetY = cp.y - h/2 + 80;
          first.vy += (cp.y - first.y) * 0.1 * alpha;
          first.vx += (cp.x - first.x) * 0.1 * alpha;

          const golden = 137.508 * (Math.PI / 180);
          for (let i = 1; i < sorted.length; i++) {
             const node = sorted[i];
             const radius = (Math.hypot(w, h)/2 + spacing) * Math.sqrt(i);
             const angle = i * golden;
             const tx = first.x + radius * Math.cos(angle);
             const ty = first.y + radius * Math.sin(angle);
             
             node.vx += (tx - node.x) * 0.05 * alpha;
             node.vy += (ty - node.y) * 0.05 * alpha;
          }
        });
      }
      force.initialize = function(_nodes) {
        nodes = _nodes;
      };
      return force;
    }"""

content = content.replace("function createContainerSeparationForce() {", force_code + "\n\n    function createContainerSeparationForce() {")
content = content.replace(".force('container', createContainerSeparationForce())", ".force('container', createContainerSeparationForce())\n      .force('spiral', createContainerSpiralForce())")

with open('src/components/GraphViewer/GraphViewer.jsx', 'w') as f:
    f.write(content)
