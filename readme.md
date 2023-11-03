# gulp-mocha

> Run [Mocha](https://github.com/mochajs/mocha) tests

*Keep in mind that this is just a thin wrapper around Mocha and your issue is most likely with Mocha.*

## Install

```sh
npm install --save-dev gulp-mocha
```

## Usage

```js
import gulp from 'gulp';
import mocha from 'gulp-mocha';

export default () => (
	gulp.src('test.js', {read: false})
		// `gulp-mocha` needs file paths so you cannot have any plugins before it.
		.pipe(mocha({reporter: 'nyan'}))
);
```

## API

### mocha(options?)

#### options

Type: `object`

Options are passed directly to the `mocha` binary, so you can use any its [command-line options](http://mochajs.org/#usage) in a camelCased form. Arrays and key/value objects are correctly converted to the comma separated list format Mocha expects. Listed below are some of the more commonly used options:

##### ui

Type: `string`\
Default: `'bdd'`\
Values: `'bdd' | 'tdd' | 'qunit' | 'exports'`

The interface to use.

##### reporter

Type: `string`\
Default: `spec`\
Values: [Reporters](https://github.com/mochajs/mocha/tree/master/lib/reporters)

The reporter that will be used.

This option can also be used to utilize third-party reporters. For example, if you `npm install mocha-lcov-reporter` you can then do use `mocha-lcov-reporter` as value.

##### reporterOptions

Type: `object`\
Example: `{reportFilename: 'index.html'}`

Reporter specific options.

##### globals

Type: `string[]`

List of accepted global variable names, example `['YUI']`. Accepts wildcards to match multiple global variables, e.g. `['gulp*']` or even `['*']`. See [Mocha globals option](http://mochajs.org/#globals-option).

##### timeout

Type: `number`\
Default: `2000`

Test-case timeout in milliseconds.

##### bail

Type: `boolean`\
Default: `false`

Bail on the first test failure.

##### checkLeaks

Type: `boolean`\
Default: `false`

Check for global variable leaks.

##### grep

Type: `string`

Only run tests matching the given pattern which is internally compiled to a RegExp.

##### require

Type: `string[]`

Require custom modules before tests are run.

##### compilers

Type: `string`\
Example: `js:babel-core/register`

Specify a compiler.

## FAQ

### Test suite not exiting

If your test suite is not exiting it might be because you still have a lingering callback, most often caused by an open database connection. You should close this connection or do the following:

```js
export default () => (
	gulp.src('test.js')
		.pipe(mocha())
		.once('error', err => {
			console.error(err);
			process.exit(1);
		})
		.once('end', () => {
			process.exit();
		})
);
```

Or you might just need to pass the `exit` option:

```js
export const test = () => (
	gulp.src(['test/**/*.js'], {read: false})
		.pipe(mocha({reporter: 'list', exit: true}))
		.on('error', console.error)
);
```
