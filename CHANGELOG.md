# Changelog

All notable changes to this fork are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Upstream Backbone's own release notes (1.6.0 and earlier) live in
[`index.html`](./index.html#changelog).

## [1.6.3] — 2026-05-12

A maintenance pass that closes a backlog of bugs, modernizes the test/build
toolchain, and clears every known vulnerability without breaking drop-in
compatibility with upstream Backbone.

### Fixed
- **Memory leak when a non-Backbone listenee's `on` throws.** `Events.listenTo`
  used to insert the new `Listening` bookkeeping before calling `obj.on(...)`,
  so a throw left an orphaned reference in `_listeningTo`. The bookkeeping is
  now rolled back when `obj.on` throws.
- **Memory leak when a callback re-enters `stopListening` during a global
  stop.** `Events.stopListening()` (with no argument) snapshots all listenee
  ids; if an `off` handler removed a later id from the snapshot, the outer
  loop hit `break` and abandoned every remaining listenee. Changed to
  `continue`.
- **`Backbone.sync` was mutating the caller's options.** Repeated calls with
  the same options compounded the `error` / `beforeSend` wrappers, firing
  callbacks and triggers multiple times. `sync` now operates on a shallow
  clone of the caller's options while still publishing `xhr` and the
  jQuery `textStatus` / `errorThrown` fields on the caller object so the
  public contract is preserved.
- **`Collection.set`/`add` silently corrupted state when `options.at` coerced
  to `NaN`.** The model was registered in `_byId` but never spliced into
  `this.models`. A non-numeric `at` is now treated as if it were omitted
  (append at the end).
- **`Router.execute` threw `TypeError` when `this[name]` resolved to a
  non-function** (e.g. a string handler). It now silently no-ops and the
  `route:` (empty name) trigger is skipped so listeners no longer see a
  spurious event.
- **`View.undelegate` threw if `$el` had been nulled out** by a subclass
  `_removeElement`. Now mirrors `undelegateEvents`'s `if (this.$el)` guard.
- **`History.start()` produced a cryptic `ReferenceError` outside the
  browser** despite the constructor specifically guarding for non-browser
  use. It now throws a clear `Backbone.history.start() requires a browser
  window` error instead.
- **`Backbone.sync` was emitting the `request` event with the cloned options
  object** (the internal clone introduced to stop `error`/`beforeSend` from
  compounding). Listeners that mutate `opts` for instrumentation
  (e.g. tagging a start timestamp on `request`, reading it on `sync`) saw
  their mutations land on the discarded clone. `request` now fires with the
  caller's own options, matching upstream behavior.
- **`require('jquery')` swallowed every error**, not just `MODULE_NOT_FOUND`.
  ESM/CJS mismatches and corrupt installs now propagate instead of leaving
  Backbone half-initialized.
- **`debugInfo` mis-identified bundled browser builds as Node** when bundlers
  (Webpack, etc.) injected a polyfilled `process`. Detection now requires
  `process.versions.node`.
- **`Backbone.VERSION` was out of sync** with `package.json` after the 1.6.1
  / 1.6.2 fork bumps. All three (source header, `Backbone.VERSION`, and
  `package.json`) are aligned again.

### Changed
- **`changeId` guard expression simplified** to
  `!_.isEqual(prevId, this.id) && !(prevId == null && this.id == null)`.
  Behavior unchanged, readability improved.
- **`Collection.set(null)` returns the collection** instead of `undefined`,
  matching `Model.set(null)` and keeping `add(null)` chainable.
- **`extend()` static-merge priority** is now `staticProps > child's own
  preexisting > parent`. Previously parent statics could silently clobber
  statics the caller had already attached to a user-supplied constructor.
  The common cases (no preexisting constructor statics) are unchanged —
  parent statics still flow into the child to fill gaps.

### Tooling
- **Test runner: PhantomJS → puppeteer-bundled Chrome Headless.**
  `karma-phantomjs-launcher` + `phantomjs-prebuilt` (archived since 2018,
  unreliable install on modern systems) replaced with `karma-chrome-launcher`
  + `puppeteer`, which ships its own Chromium binary. `npm test` no longer
  requires a system Chrome.
- **`.gitattributes`** added with `* text=auto eol=lf` to keep line endings
  consistent across OSes regardless of each developer's `core.autocrlf`
  setting. Fixes the cascade of `linebreak-style` errors on Windows
  checkouts.
- **ESLint 8 → 10**, including the migration from three nested `.eslintrc`
  files to one flat `eslint.config.js`. Stylistic rules (indent, quotes,
  semi, linebreak-style, …) moved to `@stylistic/eslint-plugin`. Deprecated
  rules (`no-catch-shadow`, `no-native-reassign`, `no-negated-in-lhs`,
  `no-new-object`, `no-spaced-func`) replaced or removed.
- All other devDependencies bumped: rollup 3→4, puppeteer 22→24
  (Chromium 127→148), cpy-cli 3→7, replace-in-file 7→8, plus every
  in-range patch/minor.
- `.idea/` and `.claude/` added to `.gitignore`.

### Security
- **`underscore` 1.13.2 → 1.13.8** patches the only CVE that reached
  consumers of this package
  ([GHSA-qpx9-hpmf-5gmw](https://github.com/advisories/GHSA-qpx9-hpmf-5gmw):
  unbounded recursion DoS in `_.flatten` / `_.isEqual`).
- The dependency range is now `^1.8.3` instead of `>=1.8.3`, so a future
  underscore 2.x won't be pulled in untested.
- `npm audit` is clean: 0 vulnerabilities. Down from 29 (2 low, 10
  moderate, 16 high, 1 critical) at the start of this release cycle.

### Added (tests)
Regression coverage was added for every behavioral fix above:
- `changeId` only fires on real id changes (no spurious null/undefined
  transitions)
- `listenTo` cleans up `_listeningTo` when `obj.on` throws
- `stopListening` keeps cleaning remaining listenees after re-entrancy
- `Backbone.sync` does not mutate the caller-supplied options
- `Backbone.sync` emits `request` with the caller options (mutations from a
  `request` listener persist on the same object)
- `Collection.add(model, {at: 'invalid'})` appends instead of corrupting
  the index
- `Collection.set(null)` and `Collection.add(null)` return the collection
- `Router.execute` ignores non-function callbacks instead of throwing
- `extend()` static merge priority is what the docstring claims

448 → 450 karma tests, all green.

## [1.6.2] — 2024-09-25

### Fixed
- `Model.set` no longer fires a spurious `changeId` event when the new and
  previous id values are both null/undefined. `_.isEqual(null, undefined)`
  returns `false` in Underscore, so the previous `!_.isEqual` guard missed
  this case.

## [1.6.1] — 2024-05-16

### Fixed
- `Model.set` no longer fires a `changeId` event when the id value is set
  but unchanged. Previously the event was unconditional, which forced
  collections to perform redundant `_byId` reindex work on every model
  attribute change.

[1.6.3]: https://github.com/compuzz-eventus/backbone/compare/1.6.2...1.6.3
[1.6.2]: https://github.com/compuzz-eventus/backbone/compare/1.6.1...1.6.2
[1.6.1]: https://github.com/compuzz-eventus/backbone/compare/1.6.0...1.6.1
