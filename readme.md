# [gulp](http://gulpjs.com)-mocha [![Build Status](https://travis-ci.org/sindresorhus/gulp-mocha.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-mocha)

> Run [Mocha](http://visionmedia.github.io/mocha/) tests

*Keep in mind that this is just a thin wrapper around Mocha and your issue is most likely with Mocha.*


## Install

```bash
$ npm install --save-dev gulp-mocha
```


## Usage

```js
var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', function () {
	return gulp.src('test.js', {read: false})
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

### CoffeeScript

For CoffeeScript support, add `require('coffee-script')` with CoffeeScript 1.6- or `require('coffee-script/register')` with CoffeeScript 1.7+.

## License

[MIT](http://opensource.org/licenses/MIT) © [Sindre Sorhus](http://sindresorhus.com)
