import re

with open('src/embed.jsx', 'r') as f:
    content = f.read()

replacement = """        onNodeSelect={(article) => {
          if (features.readerPanel) {
            if (article && article.originalItem && viewState) {
              viewState.markSeen(article.originalItem.id);
            }
            if (article && article.originalItem) {
              const id = encodeURIComponent(article.originalItem.id);
              history.pushState(null, '', '#read=' + id);
              // Manually trigger so listener fires
              window.dispatchEvent(new Event('hashchange'));
            }
            setSelectedArticle(article);
          }
        }}"""

content = re.sub(r'        onNodeSelect=\{\(article\) => \{\n          if \(features\.readerPanel\) \{\n            if \(article && article\.originalItem && viewState\) \{\n              viewState\.markSeen\(article\.originalItem\.id\);\n            \}\n            setSelectedArticle\(article\);\n          \}\n        \}\}', replacement, content)

with open('src/embed.jsx', 'w') as f:
    f.write(content)
