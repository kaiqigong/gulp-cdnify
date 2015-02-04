// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var path = require('path'),
    Soup = require('soup'),
    rewriteCSSURLs = require('css-url-rewriter');

// Consts
const PLUGIN_NAME = 'gulp-cdnify';

function isLocalPath(filePath, mustBeRelative) {
  return (
    typeof filePath === 'string' && filePath.length &&
    (filePath.indexOf('//') === -1) &&
    (filePath.indexOf('data:') !== 0) &&
    (!mustBeRelative || filePath[0] !== '/')
  );
}

function joinBaseAndPath(base, urlPath) {
  if (base.indexOf('//') === -1) return base + urlPath;

  // Split out protocol first, to avoid '//' getting normalized to '/'
  var bits = base.split('//'),
      protocol = bits[0], rest = bits[1];
  // Trim any path off if this is a domain-relative URL
  if (urlPath[0] === '/')
    rest = rest.split('/')[0];
  // Join it all together
  return protocol + '//' + path.normalize("" + rest + "/" + urlPath);
}

// Plugin level function(dealing with files)
function gulpCdnify(options) {

  if (!options) {
    throw new PluginError(PLUGIN_NAME, 'Missing options');
  }
  // Establish the rewriteURL function for this task
  var rewriteURL;
  if (typeof options.base === 'string') {
    rewriteURL = function (url) {
      if (isLocalPath(url))
        return joinBaseAndPath(options.base, url);
      return url;
    };
  }
  else if (typeof options.rewriter !== 'function') {
    grunt.fatal('Please specify either a "base" string or a "rewriter" function in the task options.');
    return;
  }
  else {
    rewriteURL = options.rewriter;
  }

  gutil.log(options)

  // Creating a stream through which each file will pass
  return through.obj(function(file, enc, cb) {
    var prefixText = new Buffer('kaiqi')
    gutil.log(file)
    if (file.isNull()) {
      // return empty file
      cb(null, file);
    }
    if (file.isBuffer()) {
      gutil.log('isBuffer')
    }
    if (file.isStream()) {
      gutil.log('isStream')
    }
    cb(null, file);
  });

};

// Exporting the plugin main function
module.exports = gulpCdnify;
