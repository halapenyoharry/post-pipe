import re

with open('src/embed.jsx', 'r') as f:
    content = f.read()

replacement = """        function onHashChange() {
          const hash = window.location.hash;
          if (hash.startsWith('#read=')) {
            const parts = hash.substring(6).split('&p=');
            const id = parts[0];
            const p = parts[1] ? parseInt(parts[1], 10) : null;
            // The items are in feed.items (or feedData.items)
            const items = typeof feed !== 'undefined' ? (feed.items || []) : (typeof feedData !== 'undefined' ? (feedData.items || []) : []);
            const item = items.find(i => (i.id === decodeURIComponent(id)) || (i.url === decodeURIComponent(id)));
            if (item) {
              if (viewState) {
                viewState.markSeen(item.id);
              }
              setSelectedArticle(item);
              if (p !== null && !isNaN(p)) {
                setTargetParagraph(p);
              } else {
                setTargetParagraph(null);
              }
            } else {
              setSelectedArticle(null);
            }
          } else {
            setSelectedArticle(null);
          }
        }"""

content = re.sub(r'        function onHashChange\(\) \{.*?(?=\s*window\.addEventListener\(\'hashchange\'\))', replacement, content, flags=re.DOTALL)

with open('src/embed.jsx', 'w') as f:
    f.write(content)
