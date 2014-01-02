# [gulp](https://github.com/wearefractal/gulp)-mocha [![Build Status](https://secure.travis-ci.org/sindresorhus/gulp-mocha.png?branch=master)](http://travis-ci.org/sindresorhus/gulp-mocha)

> Run [Mocha](http://visionmedia.github.io/mocha/) tests

*Keep in mind that this is just a thin wrapper around Mocha and your issue is most likely with Mocha.*


## Install

Install with [npm](https://npmjs.org/package/gulp-mocha)

```
npm install --save-dev gulp-mocha
```


## Example

```js
var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', function () {
	gulp.src('app.js')
		.pipe(mocha({reporter: 'nyan'}));
});
```

## API

### mocha(options)


#### options.ui

Type: `String`  
Default: `bdd`  
Values: `bdd`, `tdd`, `qunit`, `exports`

The interface to use.


#### options.reporter

Type: `String`  
Default: `dot`  
Values: [reporters](https://github.com/visionmedia/mocha/tree/master/lib/reporters)

The reporter that will be used.

This option can also be used to utilize third-party reporters. For example if you `npm install mocha-lcov-reporter` you can then do use `mocha-lcov-reporter` as value.


#### options.globals

Type: `Array`

Accepted globals.


#### options.timeout

Type: `Number`  
Default: `2000`

Test-case timeout in milliseconds.


#### options.bail

Type: `Boolean`  
Default: `false`

Bail on the first test failure.


#### options.ignoreLeaks

Type: `Boolean`  
Default: `false`

Ignore global leaks.


#### options.grep

Type: `String`

Only run tests matching the given pattern which is internally compiled to a RegExp.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
