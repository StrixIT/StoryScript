const path = require('path');
const os = require('os');

module.exports = function (karmaConfig, webPackConfig, testPath, gamePath, codePath) {
  const wpConfig = webPackConfig.default;

  wpConfig.resolve.alias.game = path.resolve(__dirname, gamePath);
  wpConfig.output = { path: path.join(os.tmpdir(), '_karma_webpack_') + Math.floor(Math.random() * 1000000) };

  wpConfig.devtool = 'inline-source-map';
  wpConfig.module.rules.push({
    enforce: 'post',
    test: /\.ts$/,
    use: {
      loader: 'coverage-istanbul-loader'
    },
    include: path.resolve(__dirname, codePath)
  });

  return {
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'webpack'],

    // list of files / patterns to load in the browser
    files: [
      'specs/*Spec.ts'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'specs/*.ts': ['webpack'],
    },

    webpack: wpConfig,

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage-istanbul'],

    coverageIstanbulReporter: {
      reports: [ 'html', 'text-summary', 'lcovonly' ],
      dir: path.join(__dirname, testPath, 'coverage'),
      fixWebpackSourcePaths: true,
      'report-config': {
        html: { outdir: 'html' }
      }
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: karmaConfig.LOG_INFO,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'], //['Chrome', 'Firefox', 'Edge']

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  }
}