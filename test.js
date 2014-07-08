'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var mocha = require('./index');
var through = require('through2');

var out = process.stdout.write.bind(process.stdout);
var err = process.stderr.write.bind(process.stderr);

it('should run unit test and pass', function (cb) {
	var stream = mocha();

	process.stdout.write = function (str) {
		if (/1 passing/.test(str)) {
			assert(true);
			process.stdout.write = out;
			cb();
		}
	};

	stream.write(new gutil.File({path: 'fixture-pass.js'}));
	stream.end();
});

it('should run unit test and fail', function (cb) {
	var stream = mocha();

	process.stderr.write = function (str) {
		if (/1 failing/.test(str)) {
			assert(true);
			process.stderr.write = err;
			cb();
		}
	};

	stream.on('error', function () {});
	stream.write(new gutil.File({path: 'fixture-fail.js'}));
	stream.end();
});

it('should call the callback for the flush method', function (cb) {
	var stream = mocha();

	stream._flush(function () {
		assert(true);
		cb();
	});
});

it('should clear cache after successful run', function (done) {
	var stream = mocha();

	stream.pipe(through.obj(function (file, enc, cb) {cb();}, function (cb) {
		for (var key in require.cache) {
			if(/fixture-pass/.test(key.toString())) {
				throw new Error('require cache still contained: ' + key);
			}
		}
		done();
	}));

	stream.write(new gutil.File({path: 'fixture-pass.js'}));
	stream.end();
});

it('should clear cache after failing run', function (done) {
	var stream = mocha();

	stream.pipe(through.obj(function (file, enc, cb) {cb();}, function (cb) {
		for (var key in require.cache) {
			if(/fixture-fail/.test(key.toString())) {
				throw new Error('require cache still contained: ' + key);
			}
		}
		cb();
		done();
	}));

	stream.on('error', function () {});
	stream.write(new gutil.File({path: 'fixture-fail.js'}));
	stream.end();
});

it('should clear cache after mocha threw', function (done) {
	var stream = mocha();

	stream.pipe(through.obj(function (file, enc, cb) {cb();}, function (cb) {
		for (var key in require.cache) {
			if(/fixture-pass/.test(key.toString()) || /fixture-throws/.test(key.toString())) {
				throw new Error('require cache still contained: ' + key);
			}
		}
		cb();
		done();
	}));

	stream.on('error', function () {});
	stream.write(new gutil.File({path: 'fixture-pass.js'}));
	stream.write(new gutil.File({path: 'fixture-throws.js'}));
	stream.end();
});

