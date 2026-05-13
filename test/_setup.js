// Vitest setup file: runs once per test file, before the test file
// itself is imported. Equivalent of what Karma used to do via script
// tags: install jQuery + Underscore on the window, load Backbone +
// debug-info, then the legacy `test/setup/*.js` per-test hooks.

import './_qunit-shim.js';

import $ from 'jquery';
import _ from 'underscore';

globalThis.$ = $;
globalThis.jQuery = $;
globalThis._ = _;

// Make jQuery/Underscore visible on the jsdom window before Backbone
// loads so its UMD factory picks them up (the CJS branch uses
// `require('jquery')` directly, but Backbone.View accesses them via
// `Backbone.$` at runtime through these globals).
window.$ = $;
window.jQuery = $;
window._ = _;

// Backbone is UMD; under Vitest+Vite the ESM-default-interop of a CJS
// module turns out to NOT be identity-equal to the closure-scoped
// `Backbone` the factory captured (Vite wraps `module.exports`). We
// need the SAME object so that `Backbone.sync = wrapper` from
// `test/setup/environment.js` is seen by `Backbone.Model.prototype.sync`
// inside the closure. `createRequire` bypasses Vite's CJS interop and
// returns the raw `module.exports`.
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const Backbone = require('../backbone.js');
globalThis.Backbone = Backbone;
window.Backbone = Backbone;
Backbone.$ = $;

// debug-info.js's UMD CJS branch returns the function but doesn't
// attach it (unlike the browser branch which sets `global.Backbone.debugInfo`).
// Wire it manually so `Backbone.debugInfo()` works in tests.
Backbone.debugInfo = require('../debug-info.js');

// The two legacy QUnit setup files: dom-setup decorates document.body
// for views, environment.js installs the per-test ajax / sync /
// history stubbing via `QUnit.testStart`.
await import('./setup/dom-setup.js');
await import('./setup/environment.js');

if (process.env.SHIM_DEBUG) {
  // eslint-disable-next-line no-console
  console.log('[setup] post-setup Backbone.ajax === jquery$.ajax?',
    Backbone.ajax === $.ajax, 'Backbone.sync is real?',
    Backbone.sync.toString().indexOf('methodMap') !== -1);
}
