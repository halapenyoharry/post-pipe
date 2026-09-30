import re

with open('src/embed.jsx', 'r') as f:
    content = f.read()

# Fix hashchange listener to clear selectedArticle when no hash
hash_listener_old = """          if (hash.startsWith('#read=')) {
            const parts = hash.substring(6).split('&p=');"""
hash_listener_new = """          if (hash.startsWith('#read=')) {
            const parts = hash.substring(6).split('&p=');"""
# Wait, I'll replace the whole React.useEffect block

content = re.sub(r'      React\.useEffect\(function \(\) \{\n        function onHashChange\(\) \{\n          const hash = window\.location\.hash;.*?      \}, \[typeof feed !== \'undefined\' \? feed : feedData, viewState\]\);',
"""      React.useEffect(function () {
        function onHashChange() {
          const hash = window.location.hash;
          if (hash.startsWith('#read=')) {
            const parts = hash.substring(6).split('&p=');
            const id = parts[0];
            const p = parts[1] ? parseInt(parts[1], 10) : null;
            const items = typeof feed !== 'undefined' ? (feed.items || []) : (typeof feedData !== 'undefined' ? (feedData.items || []) : []);
            const item = items.find(i => (i.id === decodeURIComponent(id)) || (i.url === decodeURIComponent(id)));
            if (item) {
              if (viewState) viewState.markSeen(item.id);
              setSelectedArticle(item);
              setTargetParagraph(p !== null && !isNaN(p) ? p : null);
            }
          } else {
            setSelectedArticle(null);
            setTargetParagraph(null);
          }
        }
        window.addEventListener('hashchange', onHashChange);
        onHashChange();
        
        const onKeyDown = (e) => {
          if (e.key === 'Escape') {
             history.replaceState(null, '', window.location.pathname + window.location.search);
             window.dispatchEvent(new Event('hashchange'));
          }
        };
        window.addEventListener('keydown', onKeyDown);
        const onResetLayout = () => {
             history.replaceState(null, '', window.location.pathname + window.location.search);
             window.dispatchEvent(new Event('hashchange'));
        };
        window.addEventListener('graph:reset-layout', onResetLayout);
        
        return function () { 
          window.removeEventListener('hashchange', onHashChange);
          window.removeEventListener('keydown', onKeyDown);
          window.removeEventListener('graph:reset-layout', onResetLayout);
        };
      }, [typeof feed !== 'undefined' ? feed : feedData, viewState]);""", content, flags=re.DOTALL)

# Fix onNodeSelect
on_node_select_old = """        onNodeSelect={(article) => {
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

on_node_select_new = """        onNodeSelect={(article) => {
          if (!features.readerPanel) return;
          if (!article) {
             history.replaceState(null, '', window.location.pathname + window.location.search);
             window.dispatchEvent(new Event('hashchange'));
             return;
          }
          if (article && article.originalItem) {
            if (viewState) viewState.markSeen(article.originalItem.id);
            const id = encodeURIComponent(article.originalItem.id);
            if (window.location.hash === '#read=' + id) {
               history.replaceState(null, '', window.location.pathname + window.location.search);
            } else {
               history.pushState(null, '', '#read=' + id);
            }
            window.dispatchEvent(new Event('hashchange'));
          }
        }}"""

content = content.replace(on_node_select_old, on_node_select_new)

with open('src/embed.jsx', 'w') as f:
    f.write(content)


with open('src/components/GraphViewer/GraphViewer.jsx', 'r') as f:
    gv_content = f.read()

# Add empty canvas click to clear selection
gv_content = gv_content.replace("""    svg.on('click', () => {
      if (activeTag) {
        activeTag = null;
        nodes.classed('dimmed', false).classed('tag-active', false);
        articleNodes.classed('dimmed', false);
        links.classed('highlighted', false);
      }
      // Open nodes stay open on a background click; each closes by clicking it.
    });""",
"""    svg.on('click', () => {
      if (activeTag) {
        activeTag = null;
        nodes.classed('dimmed', false).classed('tag-active', false);
        articleNodes.classed('dimmed', false);
        links.classed('highlighted', false);
      }
      if (onNodeSelectRef.current) onNodeSelectRef.current(null);
    });""")

with open('src/components/GraphViewer/GraphViewer.jsx', 'w') as f:
    f.write(gv_content)
