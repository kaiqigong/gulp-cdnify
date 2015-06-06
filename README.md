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
