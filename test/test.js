/* global afterEach, it */
'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var mocha = require('../');

var out = process.stdout.write.bind(process.stdout);
var err = process.stderr.write.bind(process.stderr);

afterEach(function () {
	process.stdout.write = out;
	process.stderr.write = err;
});

it('should run unit test and pass', function (cb) {
	var stream = mocha();

	process.stdout.write = function (str) {
		if (/1 passing/.test(str)) {
			assert(true);
			cb();
		}
	};

	stream.write(new gutil.File({path: './test/fixtures/fixture-pass.js'}));
	stream.end();
});

it('should run unit test and fail', function (cb) {
	var stream = mocha();

	process.stdout.write = function (str) {
		if (/1 failing/.test(str)) {
			assert(true);
			cb();
		}
	};

	stream.once('error', function () {});
	stream.write(new gutil.File({path: './test/fixtures/fixture-fail.js'}));
	stream.end();
});

it('should call the callback right after end', function (cb) {
	var stream = mocha();

	stream.once('end', function () {
		assert(true);
		cb();
	});

	stream.end();
});

it('should clear cache after successful run', function (done) {
	var stream = mocha();

	stream.once('end', function () {
		for (var key in require.cache) {
			if (/fixture-pass/.test(key.toString())) {
				done(new Error('require cache still contained: ' + key));
				return;
			}
		}

		done();
	});

	stream.write(new gutil.File({path: './test/fixtures/fixture-pass.js'}));
	stream.end();
});

it('should clear cache after failing run', function (done) {
	var stream = mocha();

	stream.once('error', function () {
		for (var key in require.cache) {
			if (/fixture-fail/.test(key.toString())) {
				done(new Error('require cache still contained: ' + key));
				return;
			}
		}

		done();
	});

	stream.write(new gutil.File({path: './test/fixtures/fixture-fail.js'}));
	stream.end();
});

it('should clear cache after mocha threw', function (done) {
	var stream = mocha();

	stream.once('error', function () {
		for (var key in require.cache) {
			if (/fixture-pass/.test(key.toString()) || /fixture-throws/.test(key.toString())) {
				done(new Error('require cache still contained: ' + key));
				return;
			}
		}

		done();
	});
	stream.write(new gutil.File({path: './test/fixtures/fixture-pass.js'}));
	stream.write(new gutil.File({path: './test/fixtures/fixture-throws.js'}));
	stream.end();
});

it('should clear cache after mocha threw uncaught exception', function (done) {
	var stream = mocha();

	stream.once('error', function () {
		for (var key in require.cache) {
			if (/fixture-pass/.test(key.toString()) || /fixture-throws/.test(key.toString())) {
				done(new Error('require cache still contained: ' + key));
				return;
			}
		}

		done();
	});
	stream.write(new gutil.File({path: './test/fixtures/fixture-pass.js'}));
	stream.write(new gutil.File({path: './test/fixtures/fixture-throws-uncaught.js'}));
	stream.end();
});

it('should pass async AssertionError to mocha', function (done) {
	var stream = mocha();

	process.stdout.write = function (str) {
		if (/throws after timeout/.test(str)) {
			done(new Error('mocha timeout not expected'));
		} else if (/Uncaught AssertionError: false == true/.test(str)) {
			done();
		}
	};

	stream.once('error', function () {});
	stream.write(new gutil.File({path: './test/fixtures/fixture-async.js'}));
	stream.end();
});
