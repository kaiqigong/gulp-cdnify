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

// Default options
var defaults = {
  html: true,
  css: true
};

var htmlDefaults = {
  'img[src]': 'src',
  'link[rel=stylesheet]': 'href',
  'script[src]': 'src',
  'video[poster]': 'poster',
  'source[src]': 'src'
};

function extend(target, source) {
  target = target || {};
  for (var prop in source) {
    if (typeof source[prop] === 'object') {
      target[prop] = extend(target[prop], source[prop]);
    } else {
      target[prop] = source[prop];
    }
  }
  return target;
}

// Plugin level function(dealing with files)
function gulpCdnify(options) {

  if (!options) {
    throw new PluginError(PLUGIN_NAME, 'Missing options');
  }

  options = extend(options, defaults);

  // Handle HTML selector:attribute settings
  if (options.html === false) options.html = {};
  else if (options.html === true) options.html = htmlDefaults;
  else if (typeof options.html === 'object') {
    for (var key in htmlDefaults) {
      if (htmlDefaults.hasOwnProperty(key) && options.html[key] == null) {
        options.html[key] = htmlDefaults[key];
      }
    }
  }

  // Establish the rewriteURL function for this task
  var rewriteURL;
  var defaultRewrite = function (url) {
    if (isLocalPath(url))
      return joinBaseAndPath(options.base, url);
    return url;
  };
  if (typeof options.rewriter !== 'function') {
    rewriteURL = defaultRewrite;
  }
  else {
    rewriteURL = function (url) {
      return options.rewriter(url, defaultRewrite);
    }
  }

  // Creating a stream through which each file will pass
  return through.obj(function(file, enc, cb) {

    var srcFile = file.path
    if (file.isNull()) {
      // return empty file
      cb(null, file);
    }
    if (file.isBuffer()) {
      if (/\.css$/.test(srcFile)) {
        // It's a CSS file.
        var oldCSS = String(file.contents),
            newCSS = rewriteCSSURLs(oldCSS, rewriteURL)
        file.contents = new Buffer(newCSS);
        gutil.log("Changed CSS file: \"" + srcFile + "\"");
      }
      else {
        // It's an HTML file.
        var oldHTML = String(file.contents),
            soup = new Soup(oldHTML);

        for (var search in options.html) {
          var attr = options.html[search];
          if (attr) soup.setAttribute(search, options.html[search], rewriteURL);
        }

        // Update the URLs in any embedded stylesheets
        soup.setInnerHTML('style', function (css) {
          return rewriteCSSURLs(css, rewriteURL);
        });

        // Write it to disk
        file.contents = new Buffer(soup.toString())
        gutil.log("Changed HTML file: \"" + srcFile + "\"");
      }
    }
    if (file.isStream()) {
      throw new PluginError(PLUGIN_NAME, 'Stream not supported');
    }
    cb(null, file);
  });

};

// Exporting the plugin main function
module.exports = gulpCdnify;
