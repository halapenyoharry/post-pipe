// platforms/youtube.js
// TODO: YouTube description/post publisher
// YouTube is different — no article body, but could handle:
//   - Video descriptions
//   - Community posts (plain text/images)
// Auth via Google OAuth, session saved same way
// Login URL: https://studio.youtube.com

async function login() {
  throw new Error('youtube: not yet implemented — coming soon');
}

async function post(_markdown, _opts) {
  throw new Error('youtube: not yet implemented — coming soon');
}

module.exports = { login, post };
