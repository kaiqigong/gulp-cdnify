#gulp cdnify

## install
npm install gulp-cdnify --save-dev

## Usage
```coffee
gulp.src [
   'dist/**/*.{css,html}'
]
.pipe $.cdnify(
    base: "http://pathto/your/cdn/"
  )
.pipe(gulp.dest('dist/'))
```
