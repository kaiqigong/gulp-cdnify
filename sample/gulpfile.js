'use strict';
var gulp = require('gulp');
gulp.task('cdnify', function () {

  var cdnify = require('../index');

  return gulp.src([
    '*.{css,html}'
    ])
  .pipe(cdnify({
    base: 'http://pathto/your/cdn/',
    rewriter: function(url, process) {
      if (/^\//.test(url)) {
        // root path, return as it is
        return url;
      } else {
        return process(url);
      }
    }
  }))
  .pipe(gulp.dest('dist/'));
});
