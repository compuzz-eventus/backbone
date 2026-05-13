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
    // Don't fork a fresh worker per test file. The QUnit shim and the
    // legacy `test/setup/environment.js` install per-test hooks on the
    // Backbone object loaded once in `_setup.js`; isolating each file
    // would give it its own Backbone and orphan the hooks.
    isolate: false,
    setupFiles: ['./test/_setup.js'],
    include: ['test/*.js'],
    exclude: [
      // Test runner machinery, not a test file
      'test/_setup.js',
      'test/_qunit-shim.js',
      // Node-runtime inheritance test runs separately via `node ...`
      'test/model-inheritance.js'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      // Only instrument the actual library source; debug-info.js is a
      // rollup-built bundle and the .mjs facade is a one-liner.
      include: ['backbone.js'],
      // Reasonable starting bar for a 459-test suite against a single
      // ~2200-line file.
      thresholds: {
        lines: 85,
        functions: 85,
        statements: 85,
        branches: 75
      }
    }
  }
});
