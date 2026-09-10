// Library build — for hosts that own their own React.
//
// The default build (vite.config.js) bundles React into the output so
// _site/index.html can be a single self-contained page with no build step and
// no CDN. That is right for the static target and wrong for every other one:
// a host that already has React would end up with two copies, and two copies
// of React means hooks throw.
//
// So this config emits the same components with react, react-dom and
// react-dom/client left as imports for the consumer's bundler to resolve.
// This is the output an Exoskeleton fork, or any app, can take.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-lib',
    lib: {
      entry: path.resolve(__dirname, 'src/index.jsx'),
      name: 'PostPipeComponents',
      fileName: (format) => `post-pipe-components.${format}.js`,
      // ES only. The consumers of this build are bundlers, and a UMD build
      // whose JSX runtime is external has no honest global to bind it to.
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
    },
  },
});
