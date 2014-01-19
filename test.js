'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var mocha = require('./index');

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