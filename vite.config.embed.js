// Embed build — a single self-contained JS + CSS bundle that anyone can
// drop onto a page and call PostPipe.init().
//
// Unlike vite.config.js (which builds the component library with React
// bundled in for the static _site/index.html) or vite.config.lib.js
// (which externalises React for hosts that already have it), this build
// bundles *everything* — React, D3, the components, the ConfigPanel, and
// the init() orchestrator — into one UMD file + one CSS file.
//
// The output lives in dist-embed/ and the generated page is _site/embed.html.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'dist-embed',
    lib: {
      entry: path.resolve(__dirname, 'src/embed.jsx'),
      name: 'PostPipe',
      fileName: () => 'post-pipe.embed.js',
      formats: ['umd'],
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Single CSS file alongside the JS
        assetFileNames: 'post-pipe.embed[extname]',
        exports: 'named',
      },
    },
  },
});
