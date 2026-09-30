import re

with open('generate-index.js', 'r') as f:
    content = f.read()

# buildFeed
replacement = """function buildFeed(articles) {
  const f = {
    version: 'https://jsonfeed.org/version/1.1',
    title: SETTINGS.site.title,
    home_page_url: PAGES_BASE,
    feed_url: `${PAGES_BASE}/feed.json`,
    authors: [{ name: SETTINGS.author.name }],
    items: articles,
  };
  if (SETTINGS.rights) {
    f.rights = SETTINGS.rights;
  }
  return f;
}"""
content = re.sub(r'function buildFeed\(articles\) \{\n  return \{\n    version: \'https://jsonfeed.org/version/1.1\',\n    title: SETTINGS.site.title,\n    home_page_url: PAGES_BASE,\n    feed_url: `\$\{PAGES_BASE\}/feed.json`,\n    authors: \[\{ name: SETTINGS.author.name \}\],\n    items: articles,\n  \};\n\}', replacement, content)

# generateContainerHTML
meta_injection = """<meta name="description" content="${SETTINGS.site.description}">
${SETTINGS.rights ? `<meta name="copyright" content="${SETTINGS.rights.holder} ${SETTINGS.rights.year}">` : ''}
${SETTINGS.rights && SETTINGS.rights.noAiTraining ? '<meta name="robots" content="noai, noimageai">' : ''}"""
content = content.replace('<meta name="description" content="${SETTINGS.site.description}">', meta_injection)

footer_injection = """<div id="graph-root"></div>
${SETTINGS.rights ? `<div style="position:fixed;bottom:2px;right:4px;font-size:10px;color:rgba(255,255,255,0.4);z-index:9999;pointer-events:none;">&copy; ${SETTINGS.rights.year} ${SETTINGS.rights.holder}. ${SETTINGS.rights.statement}</div>` : ''}"""
content = content.replace('<div id="graph-root"></div>', footer_injection)

# robots.txt
robots_injection = """  fs.writeFileSync(path.join(SITE_DIR, 'feed.json'), JSON.stringify(feed, null, 2));

  if (SETTINGS.rights && SETTINGS.rights.noAiTraining) {
    const robots = `User-agent: *\\nAllow: /\\n\\nUser-agent: GPTBot\\nDisallow: /\\n\\nUser-agent: ClaudeBot\\nDisallow: /\\n\\nUser-agent: anthropic-ai\\nDisallow: /\\n\\nUser-agent: Google-Extended\\nDisallow: /\\n\\nUser-agent: CCBot\\nDisallow: /\\n\\nUser-agent: PerplexityBot\\nDisallow: /\\n\\nUser-agent: Bytespider\\nDisallow: /\\n\\nUser-agent: Applebot-Extended\\nDisallow: /\\n`;
    fs.writeFileSync(path.join(SITE_DIR, 'robots.txt'), robots);
  }
"""
content = content.replace("  fs.writeFileSync(path.join(SITE_DIR, 'feed.json'), JSON.stringify(feed, null, 2));\n", robots_injection)

with open('generate-index.js', 'w') as f:
    f.write(content)
