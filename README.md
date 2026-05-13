     ____                     __      __
    /\  _`\                  /\ \    /\ \                                   __
    \ \ \ \ \     __      ___\ \ \/'\\ \ \____    ___     ___      __      /\_\    ____
     \ \  _ <'  /'__`\   /'___\ \ , < \ \ '__`\  / __`\ /' _ `\  /'__`\    \/\ \  /',__\
      \ \ \ \ \/\ \ \.\_/\ \__/\ \ \\`\\ \ \ \ \/\ \ \ \/\ \/\ \/\  __/  __ \ \ \/\__, `\
       \ \____/\ \__/.\_\ \____\\ \_\ \_\ \_,__/\ \____/\ \_\ \_\ \____\/\_\_\ \ \/\____/
        \/___/  \/__/\/_/\/____/ \/_/\/_/\/___/  \/___/  \/_/\/_/\/____/\/_/\ \_\ \/___/
                                                                           \ \____/
                                                                            \/___/
    (_'_______________________________________________________________________________'_)
    (_.———————————————————————————————————————————————————————————————————————————————._)


Backbone supplies structure to JavaScript-heavy applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing application over a RESTful JSON interface.

## About this fork

This is a maintained fork of [jashkenas/backbone](https://github.com/jashkenas/backbone), kept drop-in compatible with the original `1.6.x` API. See [`CHANGELOG.md`](CHANGELOG.md) for the full history.

Headline changes shipped on top of upstream 1.6.0:

- **`Backbone.ajax` falls back to native `fetch()`** when jQuery is absent (1.7.0)
- **ES2022 evergreen target**: IE6/IE7/Zepto compatibility code removed (1.7.0)
- **ES6 method shorthand** on all prototype literals (1.7.0)
- **Memory leak fixes** in `Events.listenTo` and `Events.stopListening` (1.6.3)
- **Sync no longer mutates caller options** (1.6.3)
- **Verified against jQuery 4.0** (1.6.3)
- **0 vulnerabilities** under `npm audit` / `yarn npm audit`

## Install

```sh
npm install backbone
# or
yarn add backbone
```

Both ESM and CommonJS are supported:

```js
// ESM
import Backbone from 'backbone';
import { Model, Collection, View } from 'backbone';

// CommonJS
const Backbone = require('backbone');
```

## Upstream docs

For the API reference, examples, and pre-packed downloads, see:
https://backbonejs.org

## Issues and discussions

- Report a bug or suggest a feature: https://github.com/compuzz-eventus/backbone/issues
- Security policy: [SECURITY.md](SECURITY.md)
- Questions and discussion: [Matrix](https://matrix.to/#/#jashkenas_backbone:gitter.im), [Google Group](https://groups.google.com/g/backbonejs), or [StackOverflow](https://stackoverflow.com/questions/tagged/backbone.js)

## Acknowledgments

Backbone is an open-sourced component of DocumentCloud: https://github.com/documentcloud

Many thanks to upstream contributors:
https://github.com/jashkenas/backbone/graphs/contributors

Special thanks to Robert Kieffer for the original philosophy behind Backbone:
https://github.com/broofa

This project adheres to a [code of conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.
