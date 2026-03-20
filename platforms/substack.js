// platforms/substack.js
// TODO: Substack publisher
// Same pattern as medium.js — login saves session, post uses Playwright
// Substack editor also accepts clipboard HTML paste
// Login URL: https://substack.com/sign-in
// New post URL: https://substack.com/publish/post/new

async function login() {
  throw new Error('substack: not yet implemented — coming soon');
}

async function post(_markdown, _opts) {
  throw new Error('substack: not yet implemented — coming soon');
}

module.exports = { login, post };
