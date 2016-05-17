'use strict';
var gulp = require('gulp');
gulp.task('cdnify', function () {

  var cdnify = require('../index');

  return gulp.src([
    'index.html'
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

gulp.task('issue12', function () {

  var cdnify = require('../index');

  return gulp.src([
    'issue-12.html'
    ])
  .pipe(cdnify({
    base: 'http://my.cdn.path-cdn.com/',
  }))
  .pipe(gulp.dest('dist/'));
});

gulp.task('issue3', function () {

  var cdnify = require('../index');

  return gulp.src([
    'issue-3.html'
    ])
  .pipe(cdnify({
    base: 'http://my.cdn.path-cdn.com/',
  }))
  .pipe(gulp.dest('dist/'));
});

gulp.task('issue11', function () {

  var cdnify = require('../index');

  return gulp.src([
    'issue-11.html'
    ])
  .pipe(cdnify({
    base: 'http://my.cdn.path-cdn.com/',
  }))
  .pipe(gulp.dest('dist/'));
});

gulp.task('issue8', function () {

  var cdnify = require('../index');

  return gulp.src([
    'issue-8.js'
    ])
  .pipe(cdnify({
    base: 'http://my.cdn.path-cdn.com/',
  }))
  .pipe(gulp.dest('dist/'));
});

