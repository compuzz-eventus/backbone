## How to Open a Backbone.js Ticket

* Do not use tickets to ask for help with (debugging) your application. Ask on
the [Matrix room](https://matrix.to/#/#jashkenas_backbone:gitter.im),
the [Google Group](https://groups.google.com/g/backbonejs), or if you
understand your specific problem, on
[StackOverflow](http://stackoverflow.com/questions/tagged/backbone.js).

* Before you open a ticket or send a pull request,
[search](https://github.com/compuzz-eventus/backbone/issues) for previous
discussions about the same feature or issue (and the
[upstream issues](https://github.com/jashkenas/backbone/issues) for
historical context). Add to the earlier ticket if you find one.

* Before sending a pull request for a feature or bug fix, be sure to have
[tests](http://backbonejs.org/test/) and to document any new functionality in
the `index.html`.

* Use the same coding style as the rest of the
[codebase](https://github.com/compuzz-eventus/backbone/blob/master/backbone.js).

* In your pull request, do not regenerate the annotated sources or rebuild the
minified `backbone-min.js` file. We'll do that before cutting a new release.

* All pull requests should be made to the `master` branch.

## Development setup

This fork uses **Yarn 4** (pinned via Corepack and the `packageManager` field
in `package.json`). Once Node 18+ is installed, Corepack will pick up the
right Yarn version automatically:

```sh
corepack enable
yarn install
yarn test            # vitest (jsdom) + node inheritance + lint
yarn test:coverage   # same + V8 coverage report in ./coverage/index.html
yarn lint            # ESLint only
yarn build           # regenerate backbone-min.js
```

Do not run `npm install` — it would create a `package-lock.json` that
conflicts with `yarn.lock`.
