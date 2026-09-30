import re

with open('src/components/GraphViewer/GraphViewer.jsx', 'r') as f:
    content = f.read()

# For badges:
badge_repl = r"""      .attr('font-size', (d) => (!d.parent ? '64px' : '52px'));
      
    containerBadgeTexts.each(function(d) {
      buildWrappedLabel(d3.select(this), d, 15);
    });"""

content = re.sub(r"      \.attr\('font-size', \(d\) => \(!d\.parent \? '64px' : '52px'\)\);\n\n    containerBadgeTexts\.append\('tspan'\)\n      \.attr\('class', 'container-badge-name'\)\n      \.text\(\(d\) => d\.label \|\| d\.id\);\n\n    containerBadgeTexts\.append\('tspan'\)\n      \.attr\('class', 'container-badge-count'\)\n      \.attr\('font-size', \(d\) => \(!d\.parent \? '29px' : '23px'\)\)\n      \.attr\('dx', '12px'\);", badge_repl, content)

# For macro texts:
macro_repl = r"""      .attr('letter-spacing', '-0.02em');

    containerMacroTexts.each(function(d) {
      buildWrappedLabel(d3.select(this), d, 15);
    });"""

content = re.sub(r"      \.attr\('letter-spacing', '0\.05em'\);\n\n    containerMacroTexts\.append\('tspan'\)\n      \.attr\('class', 'container-macro-name'\)\n      \.text\(\(d\) => d\.label \|\| d\.id\);\n\n    containerMacroTexts\.append\('tspan'\)\n      \.attr\('class', 'container-macro-count'\)\n      \.attr\('font-size', \(d\) => \(!d\.parent \? '29px' : '23px'\)\)\n      \.attr\('font-weight', '500'\)\n      \.attr\('dx', '12px'\);", macro_repl, content)

with open('src/components/GraphViewer/GraphViewer.jsx', 'w') as f:
    f.write(content)
