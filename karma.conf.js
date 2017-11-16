// Karma configuration
// Generated on Mon Oct 02 2017 22:45:03 GMT-0400 (EDT)

const webpack = require('./webpack.config.js')

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: [ 'mocha', 'chai', ],

    files: [
      //'test/**/*.js',
      { pattern: 'test/**/*.js', watched: false },
    ],

    exclude: [ ],

    preprocessors: {
      'test/**/*': [ 'webpack', 'sourcemap' ]
    },

    webpack: webpack,

    // other possible values: 'dots', 'progress'
    // reporters: ['min'],
    reporters: ['dots'],
    // reporters: ['progress'],

    port: 9876,

    colors: true,

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity

  })
}
