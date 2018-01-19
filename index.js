'use strict';

var url = require('url');
// through2 is a thin wrapper around node transform streams
var through = require('through2');
var log = require('fancy-log');
var PluginError = require('plugin-error');
var Soup = require('soup');
var rewriteCSSURLs = require('css-url-rewriter');

// Consts
var PLUGIN_NAME = 'gulp-cdnify';

function isLocalPath(filePath) {
  return typeof filePath === 'string' &&
    filePath.length &&
    !filePath.startsWith('http') &&
    !filePath.startsWith('//') &&
    !filePath.startsWith('data:');
}

// Default options
var defaults = {
  html: true,
  css: true
};

var htmlDefaults = {
  'img[data-src]': 'data-src',
  'img[src]': 'src',
  'link[rel="apple-touch-icon"]': 'href',
  'link[rel="icon"]': 'href',
  'link[rel="shortcut icon"]': 'href',
  'link[rel="stylesheet"]': 'href',
  'script[src]': 'src',
  'source[src]': 'src',
  'video[poster]': 'poster'
};

function extend(target, source) {
  target = target || {};
  for (var prop in source) {
    if (typeof source[prop] === 'object') {
      target[prop] = extend(target[prop], source[prop]);
    // overwrite only if undefined
    } else if (typeof target[prop] === 'undefined') {
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
  if (options.html === false) {
    options.html = {};
  } else if (options.html === true) {
    options.html = htmlDefaults;
  } else if (typeof options.html === 'object') {
    for (var key in htmlDefaults) {
      if (htmlDefaults.hasOwnProperty(key)) {
        if (typeof options.html[key] === 'undefined') {
          options.html[key] = htmlDefaults[key];
        }
      }
    }
  }

  // Establish the rewriteURL function for this task
  var rewriteURL = options.rewriter;
  var base = options.base;

  if (typeof base === 'string') {
    rewriteURL = function (origUrl) {
      return isLocalPath(origUrl) ? url.resolve(base, origUrl) : origUrl;
    };
  } else if (typeof rewriteURL !== 'function') {
    throw new PluginError(PLUGIN_NAME, 'Please specify either a `base` string or a `rewriter` function in the task options.');
  }

  // Creating a stream through which each file will pass
  return through.obj(function(file, enc, cb) {

    var srcFile = file.path;

    if (file.isNull()) {
      // return empty file
      return cb(null, file);
    }
    if (file.isBuffer()) {
      if (/\.css$/.test(srcFile)) {
        // It's a CSS file.
        var oldCSS = String(file.contents);
        var newCSS = options.css ?
          rewriteCSSURLs(oldCSS, rewriteURL) :
          oldCSS;

        file.contents = new Buffer(newCSS);
        log.info('Changed CSS file: "' + srcFile + '"');
      } else {
        if (/\.js$/.test(srcFile)) {
          log.warn('JS file not fully supported yet: "' + srcFile + '"');
        }
        try {
          var oldHTML = String(file.contents);
          var soup = new Soup(oldHTML);

          for (var search in options.html) {
            if (options.html.hasOwnProperty(search)) {
              var attr = options.html[search];

              if (attr) {
                soup.setAttribute(search, attr, rewriteURL);
              }
            }
          }

          // Update the URLs in any embedded stylesheets
          if (options.css) {
              soup.setInnerHTML('style', function (css) {
                return rewriteCSSURLs(css, rewriteURL);
              });

              // Update inline url
              soup.setAttribute('[style]', 'style', function (css) {
                return rewriteCSSURLs(css, rewriteURL);
              });
          }

          // Write it to disk
          file.contents = new Buffer(soup.toString());
          log.info('Changed non-css file: "' + srcFile + '"');
        } catch (e) {
          console.log(e);
          log.warn('File not changed: "' + srcFile + '"');
        }
      }
    }
    if (file.isStream()) {
      throw new PluginError(PLUGIN_NAME, 'Stream not supported');
    }
    return cb(null, file);
  });

}

// Exporting the plugin main function
module.exports = gulpCdnify;
