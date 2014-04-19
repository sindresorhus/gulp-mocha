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
	return gulp.src('test.js')
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

#### options.require

Type: `Array`

Modules to be required into the tests, usually only modules that don't need to be set to a var can be included (e.g should) but if you use requireGlobal the module will be added to the global scope of the tests.


#### options.requireGlobals

Type: `Boolean`
Default: `false`

Add required modules to the global scope.

## License

[MIT](http://opensource.org/licenses/MIT) © [Sindre Sorhus](http://sindresorhus.com)
