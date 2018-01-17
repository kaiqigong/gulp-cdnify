# gulp cdnify

The gulp version of [grunt-cdnify](https://github.com/callumlocke/grunt-cdnify)

## install

```bash
npm install gulp-cdnify --save-dev
```

## Usage

```javascript
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
```

### For those who want to rewrite the url with their own specific rules.

```javascript
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
```

### If you want to read custom source (Eg. favicon)

```javascript
pipe($.cdnify({
  html: {
    'link[rel="shortcut icon"]': 'href',
    'link[rel="apple-touch-icon-precomposed"]': 'href'
  }
}));
```

### Default sources:

```javascript
sources = {
  'img[data-src]': 'data-src',
  'img[src]': 'src',
  'link[rel="apple-touch-icon"]': 'href',
  'link[rel="icon"]': 'href',
  'link[rel="shortcut icon"]': 'href',
  'link[rel="stylesheet"]': 'href',
  'script[src]': 'src',
  'source[src]': 'src',
  'video[poster]': 'poster'
}
```
