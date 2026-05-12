// Use the Chromium bundled by puppeteer so CI doesn't need a system Chrome.
// Override CHROME_BIN if you want to point at a specific browser binary.
process.env.CHROME_BIN = process.env.CHROME_BIN || require('puppeteer').executablePath();

// Note some browser launchers should be installed before using karma start.
// For example:
// npm install karma-firefox-launcher
// karma start --browsers=Firefox
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['qunit'],

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

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9877,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadlessNoSandbox'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    customLaunchers: {
        // --no-sandbox is required when running inside containers / CI
        ChromeHeadlessNoSandbox: {
            base: 'ChromeHeadless',
            flags: ['--no-sandbox']
        }
    }
  });
};
