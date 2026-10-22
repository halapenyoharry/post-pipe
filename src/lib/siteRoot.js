const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const ENGINE_ROOT = path.resolve(__dirname, '../..');
const DEFAULT_SITE = path.join(ENGINE_ROOT, 'examples', 'site');

function expandHome(p) {
  if (!p) return p;
  if (p.startsWith('~')) {
    return path.resolve(path.join(process.env.HOME || '', p.slice(1)));
  }
  return path.resolve(p);
}

function siteRoot(env = process.env) {
  const raw = env && typeof env.POSTPIPE_SITE === 'string' ? env.POSTPIPE_SITE.trim() : '';
  if (raw) return expandHome(raw);
  return DEFAULT_SITE;
}

let lastLoadedSite = null;

function loadSiteEnv(site = siteRoot(), log = console.log) {
  const siteEnv = path.join(site, 'auth', '.env');
  if (fs.existsSync(siteEnv)) {
    dotenv.config({ path: siteEnv });
    lastLoadedSite = site;
    return { path: siteEnv, source: 'site' };
  }
  const engineEnv = path.join(ENGINE_ROOT, 'auth', '.env');
  if (fs.existsSync(engineEnv)) {
    dotenv.config({ path: engineEnv });
    if (log && lastLoadedSite !== site) {
      log(`Credentials loaded from engine folder (${engineEnv})`);
    }
    lastLoadedSite = site;
    return { path: engineEnv, source: 'engine' };
  }
  return { path: null, source: null };
}

module.exports = { siteRoot, expandHome, loadSiteEnv, ENGINE_ROOT, DEFAULT_SITE };
