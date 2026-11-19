const js = require('@eslint/js');
const globals = require('globals');
const react = require('eslint-plugin-react');

module.exports = [
  {
    ignores: [
      'dist/**',
      'dist-embed/**',
      'dist-lib/**',
      'node_modules/**',
      'examples/**',
      'archive/**',
      '_local/**',
      '_handoff/**',
      '_site/**',
      'research/**',
      'rosetta-tagz/vendor/**',
      'project-mass-scanner/**',
      'topospace-schema/**',
    ],
  },
  js.configs.recommended,
  {
    rules: {
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', ignoreRestSiblings: true },
      ], // leading underscore marks an intentionally unused parameter or caught error; destructuring with rest omits properties
      'no-empty': ['error', { allowEmptyCatch: true }], // empty catch blocks intentionally ignore non-fatal errors
    },
  },
  {
    // Root scripts, platforms, tools, tests, and CommonJS modules under src/
    files: [
      '*.js',
      'platforms/**/*.js',
      'tools/**/*.js',
      'test/**/*.js',
      'src/aggregator.js',
      'src/adapters/**/*.js',
      'src/corpus/**/*.js',
      'src/lib/**/*.js',
      'src/components/GraphViewer/*.js',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // CommonJS modules under src/lib/ that run in Node tests and are bundled by Vite for the browser
    files: ['src/lib/linkNode.js', 'src/lib/readerWords.js', 'src/lib/resolveParagraph.js'],
    languageOptions: {
      globals: {
        // Browser globals provided by the page when these modules run in the browser bundle
        window: 'readonly',
        DOMParser: 'readonly',
      },
    },
  },
  {
    // Playwright browser test script whose page.evaluate callbacks reference window in the browser page
    files: ['test/e2e/**/*.js'],
    languageOptions: {
      globals: {
        // Browser global inside page.evaluate callbacks
        window: 'readonly',
      },
    },
  },
  {
    // Files read as text by generate-index.js and pasted into the built page as plain browser scripts
    files: ['tts.js', 'src/lib/viewState.js', 'src/lib/voices.js', 'src/lib/voiceFallback.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        { vars: 'local', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', ignoreRestSiblings: true },
      ], // top-level functions or variables may be used by another page script or inline HTML
    },
  },
  {
    // Vite configs (Node ES modules)
    files: ['vite.config.js', 'vite.config.lib.js', 'vite.config.embed.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // Browser ES modules and React JSX bundled by Vite
    files: [
      'src/**/*.jsx',
      'src/views/**/*.js',
      'src/utils/**/*.js',
      'src/components/Contributions/*.js',
      'src/components/NodeView/**/*.js',
      'src/components/ReaderPanel/*.js',
      'src/components/*/index.js',
    ],
    plugins: {
      react,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
    },
  },
  {
    // Flow and rosetta-tagz (Node ES modules)
    files: ['flow/**/*.js', 'flow/bin/flow-*', 'rosetta-tagz/**/*.js', 'rosetta-tagz/bin/rtz*'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // Flow's Playwright capture program passes sampleDom to page.evaluate to run inside the browser page
    files: ['flow/bin/flow-capture'],
    languageOptions: {
      globals: {
        // Browser globals inside sampleDom and page.waitForFunction callbacks
        window: 'readonly',
        document: 'readonly',
        getComputedStyle: 'readonly',
      },
    },
  },
];
