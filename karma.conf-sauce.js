var _ = require('underscore');

// Browsers to run on Sauce Labs platforms. Targets the ES2022 evergreen
// baseline declared in 1.7.0 (Chrome 94+, Firefox 93+, Safari 15.4+,
// Edge Chromium). IE, pre-Blink Edge, and Safari < 15 were dropped with
// the IE6/IE7 cleanup; testing them on Sauce was burning minutes on
// platforms Backbone no longer supports.
var sauceBrowsers = _.reduce([
  ['firefox', 'latest'],
  ['chrome', 'latest'],
  ['microsoftedge', 'latest', 'Windows 11'],
  ['safari', 'latest', 'macOS 13']
], function(memo, platform) {
  // internet explorer -> ie
  var label = platform[0].split(' ');
  if (label.length > 1) {
    label = _.invoke(label, 'charAt', 0);
  }
  label = (label.join('') + '_v' + platform[1]).replace(' ', '_').toUpperCase();
  memo[label] = _.pick({
    base: 'SauceLabs',
    browserName: platform[0],
    version: platform[1],
    platform: platform[2]
  }, Boolean);
  return memo;
}, {});

module.exports = function(config) {
  if ( !process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY ) {
    // eslint-disable-next-line no-console
    console.log('Sauce environments not set --- Skipping');
    return process.exit(0);
  }

  config.set({
    basePath: '',
    frameworks: ['qunit'],
    singleRun: true,
    browserDisconnectTimeout: 60000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 60000,

    // list of files / patterns to load in the browser
    files: [
      'test/vendor/jquery.js',
      'test/vendor/json2.js',
      'test/vendor/underscore.js',
      'backbone.js',
      'debug-info.js',
      'test/setup/*.js',
      'test/*.js'
    ],

    // Node-runtime tests; they ship in `test/*.js` glob but must not load
    // in a browser.
    exclude: [
      'test/model-inheritance.js'
    ],

    // Number of sauce tests to start in parallel
    concurrency: 4,

    // test results reporter to use
    reporters: ['dots', 'saucelabs'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    sauceLabs: {
      build: 'GH #' + process.env.BUILD_NUMBER + ' (' + process.env.BUILD_ID + ')',
      startConnect: true,
      tunnelIdentifier: process.env.JOB_NUMBER,
      region: 'eu'
    },

    captureTimeout: 60000,
    customLaunchers: sauceBrowsers,

    // Browsers to launch, commented out to prevent karma from starting
    // too many concurrent browsers and timing sauce out.
    browsers: _.keys(sauceBrowsers)
  });
};
