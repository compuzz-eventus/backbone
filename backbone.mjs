// ESM facade over the UMD `backbone.js`. The source itself is still
// UMD (CommonJS-shaped under Node), so this file is the entry point
// for ESM consumers (`import { Model } from 'backbone'`) until a full
// ESM source rewrite happens. Bundle size is identical to the UMD
// build — this isn't a tree-shakeable ESM module, just an idiomatic
// shape for modern toolchains and Node's `exports`/`import` map.

import backbone from './backbone.js';

export default backbone;

export const {
  VERSION,
  Events,
  Model,
  Collection,
  View,
  Router,
  History,
  sync,
  ajax,
  noConflict
} = backbone;
