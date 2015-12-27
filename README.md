#gulp cdnify
[![NPM version][npm-image]][npm-url] [![Dependency Status][depstat-image]][depstat-url] [![devDependency Status][devDepstat-image]][devDepstat-url]

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
  'img[src]': 'src',
  'link[rel=stylesheet]': 'href',
  'script[src]': 'src',
  'video[poster]': 'poster',
  'source[src]': 'src'
}
```

## Roadmap
- support conditional comment
- remove dependency of soup

## Change log
- 27/12/2015 fix issue [3](https://github.com/kaiqigong/gulp-cdnify/issues/3)

## License

Copyright (c) 2014 Kaiqi Gong. Licensed under the MIT license.

[npm-url]: https://npmjs.org/package/gulp-cdnify
[npm-image]: https://img.shields.io/npm/v/gulp-cdnify.svg?style=flat-square

[depstat-url]: https://david-dm.org/kaiqigong/gulp-cdnify
[depstat-image]: https://img.shields.io/david/kaiqigong/gulp-cdnify.svg?style=flat-square

[devDepstat-url]: https://david-dm.org/kaiqigong/gulp-cdnify
[devDepstat-image]: https://img.shields.io/david/dev/kaiqigong/gulp-cdnify.svg?style=flat-square#info=devDependencies
