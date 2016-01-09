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

it('should run unit test by stream and error', function (cb) {
	var stream = mocha();

	stream.on('error', function (err) {
		if (/Streaming not supported/.test(err.message)) {
			assert(true);
			cb();
		}
	});

	var s = new require('stream').Readable();

	stream.write(new gutil.File({contents: s}));
	stream.end();
});

