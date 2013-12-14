'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var mocha = require('./index');

var out = process.stdout.write.bind(process.stdout);
var err = process.stderr.write.bind(process.stderr);

it('should run unit test and pass', function (cb) {
	process.stdout.write = function (str) {
		if (/1 passing/.test(gutil.colors.stripColor(str))) {
			assert(true);
			process.stdout.write = out;
			cb();
		}
	};

	mocha().write(new gutil.File({path: 'fixture-pass.js'}));
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
});
