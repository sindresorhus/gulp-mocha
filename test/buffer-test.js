/* global afterEach, it */
'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var mocha = require('../');
var babel = require('gulp-babel');
var fs = require('fs');

var out = process.stdout.write.bind(process.stdout);
var err = process.stderr.write.bind(process.stderr);

function babelFile(path, cb) {
	var stream = babel({
		presets: ['es2015']
	});

	stream.once('data', function (file) {
		cb(file);
	});
	stream.write(new gutil.File({
		path: path,
		contents: fs.readFileSync(path)
	}));
	stream.end();
}

afterEach(function () {
	process.stdout.write = out;
	process.stderr.write = err;
});

it('should run unit test written by es2015 and sytax error', function (cb) {
	var stream = mocha();

	stream.on('error', function (err) {
		if (/SyntaxError/.test(err.name)) {
			assert(true);
			cb();
		}
	});
	stream.write(new gutil.File({path: './test/fixtures/fixture-pass-es2015.js'}));
	stream.end();
});

it('should run unit test written by es2015 and pass with babel', function (cb) {
	babelFile('./test/fixtures/fixture-pass-es2015.js', function (file) {
		var stream = mocha();

		process.stdout.write = function (str) {
			err(str);
			if (/1 passing/.test(str)) {
				assert(true);
				cb();
			}
		};

		stream.write(file);
		stream.end();
	});
});

