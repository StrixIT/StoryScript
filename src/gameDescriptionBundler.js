/**
 * I used the gulp-angular-templatecache source (https://raw.githubusercontent.com/miickel/gulp-angular-templatecache/master/index.js)
 * and modified it to suit my needs for StoryScript.
 */
var mapStream = require('map-stream');
var streamCombiner = require('stream-combiner');
var path = require('path');
var lodashTemplate = require('lodash.template');
var concat = require('gulp-concat');
var header = require('gulp-header');
var footer = require('gulp-footer');
var jsesc = require('jsesc');

function bundleFiles(gameNameSpace) {

  return function bundleFile(file, callback) {
    if (file.processedByDescriptionBundler) {
      return callback(null, file);
    }

    file.path = path.normalize(file.path);
    var template = 'descriptionBundle.set(\'<%= url %>\',\'<%= contents %>\');';
    var pattern = new RegExp('\\\\' + gameNameSpace + '\\\\[\\w-\\\\]{1,}\.html$', 'g');

    var urlWithSubPath = file.path.match(pattern)[0]
                .substring(1)
                .replace(gameNameSpace + '\\', '');
    
    var flattenedUrl = (urlWithSubPath.substring(0, urlWithSubPath.indexOf('\\')) + '/' + urlWithSubPath.match(/[\w]{1,}.html$/g))
                        .replace('.html', '')
                        .toLowerCase();

    if (process.platform === 'win32') {
      flattenedUrl = flattenedUrl.replace(/\\/g, '/');
    }

    file.contents = new Buffer(lodashTemplate(template)({
      url: flattenedUrl,
      contents: jsesc(file.contents.toString('utf8')),
      file: file
    }));

    file.processedByDescriptionBundler = true;

    callback(null, file);

  };

}

function htmlBundleStream(gameNameSpace) {
  return mapStream(bundleFiles(gameNameSpace));
}

function gameDescriptionBundler(gameNameSpace) {
  var fileName = 'game-descriptions.js';
  var templateHeader = 'StoryScript.GetGameDescriptions = function() { var descriptionBundle = new Map();';
  var templateFooter = 'return descriptionBundle; };';

  return streamCombiner(
    htmlBundleStream(gameNameSpace),
    concat(fileName),
    header(templateHeader),
    footer(templateFooter)
  );
}

module.exports = gameDescriptionBundler;