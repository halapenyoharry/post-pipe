const fs = require('fs');

function editFile(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Add targetParagraph state
  code = code.replace(
    "const [selectedArticle, setSelectedArticle] = React.useState(null);",
    "const [selectedArticle, setSelectedArticle] = React.useState(null);\n      const [targetParagraph, setTargetParagraph] = React.useState(null);"
  );

  // Add hashchange listener inside App
  const hashListener = `
      React.useEffect(function () {
        function onHashChange() {
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
            }
          }
        }
        window.addEventListener('hashchange', onHashChange);
        onHashChange();
        return function () { window.removeEventListener('hashchange', onHashChange); };
      }, [typeof feed !== 'undefined' ? feed : feedData, viewState]);
  `;
  
  // Find where to insert it. Both files have `const [, bump] = React.useReducer...`
  // Let's just insert it before hiddenSources
  code = code.replace(
    "const hiddenSources = React.useMemo(",
    `${hashListener}\n      const hiddenSources = React.useMemo(`
  );

  // Pass targetParagraph and viewState to ReaderPanel
  // In generate-index.js:
  // React.createElement(ReaderPanel, {
  //   article: selectedArticle,
  //   onClose: function () { setSelectedArticle(null); },
  //   settings: window.SETTINGS
  // })
  
  if (filename === 'generate-index.js') {
    code = code.replace(
      "React.createElement(ReaderPanel, {\n          article: selectedArticle,\n          onClose: function () { setSelectedArticle(null); },\n          settings: window.SETTINGS\n        })",
      "React.createElement(ReaderPanel, {\n          article: selectedArticle,\n          onClose: function () { setSelectedArticle(null); },\n          settings: window.SETTINGS,\n          viewState: viewState,\n          targetParagraph: targetParagraph\n        })"
    );
  } else {
    // In src/embed.jsx
    code = code.replace(
      "<ReaderPanel\n          article={selectedArticle}\n          onClose={() => setSelectedArticle(null)}\n          settings={settings}\n        />",
      "<ReaderPanel\n          article={selectedArticle}\n          onClose={() => setSelectedArticle(null)}\n          settings={settings}\n          viewState={viewState}\n          targetParagraph={targetParagraph}\n        />"
    );
  }

  fs.writeFileSync(filename, code);
}

editFile('generate-index.js');
editFile('src/embed.jsx');
