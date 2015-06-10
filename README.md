#gulp cdnify

## install
npm install gulp-cdnify --save-dev

## Usage

    gulp.task('cdnify', function () {
    
      var cdnify = require('gulp-cdnify');
    
      return gulp.src([
        'dist/**/*.{css,html}'
      ])
        .pipe(cdnify({
          base: 'http://pathto/your/cdn/'
        }))
        .pipe(gulp.dest('dist/'))
    });

### For those who want to rewrite the url with their own specific rules.
pipe($.cdnify({
  rewriter: function(url, process) {
    if (/eot]ttf|woff|woff2/.test(url)) {
      return 'http://myfontcdn.com/' + url;
    } else if (/(png|jpg|gif)$/.test(url)) {
      return 'http://myimagecdn.com/' + url;
    } else {
      return process(url);
    }
  }
}));
