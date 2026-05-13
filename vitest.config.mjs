import {defineConfig} from 'vitest/config';

// Vitest replaces Karma + karma-qunit + karma-chrome-launcher + puppeteer.
// JSDOM is the environment: lighter than spawning a real Chromium and
// faithful enough for everything Backbone exercises (jQuery DOM mutation,
// `window.location`, `history.pushState`, `fetch` + `AbortController`).
// `test/_setup.js` boots the QUnit-compat shim and pins globals (Backbone,
// jQuery, Underscore) the way Karma's script-tag loader used to.

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // Share module instances across test files. The QUnit shim and
    // legacy `test/setup/environment.js` install per-test hooks
    // (`QUnit.testStart`) on the Backbone object loaded once in
    // `_setup.js`; isolating each file would give it its own Backbone
    // and orphan the hooks.
    isolate: false,
    pool: 'forks',
    poolOptions: {forks: {singleFork: true}},
    setupFiles: ['./test/_setup.js'],
    include: ['test/*.js'],
    exclude: [
      // Test runner machinery, not a test file
      'test/_setup.js',
      'test/_qunit-shim.js',
      // Node-runtime inheritance test runs separately via `node ...`
      'test/model-inheritance.js'
    ]
  }
});
