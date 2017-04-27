'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const gutil = require('gulp-util');
const mocha = require('..');

function fixture(name) {
	const fileName = path.join(__dirname, 'fixtures', name);

	return new gutil.File({
		path: fileName,
		contents: fs.existsSync(fileName) ? fs.readFileSync(fileName) : null
	});
}

describe('mocha()', () => {
	it('should run unit test and pass', done => {
		const stream = mocha({suppress: true});

		stream.once('_result', result => {
			assert(/1 passing/.test(result.stdout));
			done();
		});
		stream.write(fixture('fixture-pass.js'));
		stream.end();
	});

	it('should run unit test and fail', done => {
		const stream = mocha({suppress: true});

		stream.once('error', err => {
			assert(/1 failing/.test(err.stdout));
			done();
		});
		stream.write(fixture('fixture-fail.js'));
		stream.end();
	});

	it('should pass async AssertionError to mocha', done => {
		const stream = mocha({suppress: true});

		stream.once('error', err => {
			const throws = /throws after timeout/.test(err.stdout);
			const uncaught = /Uncaught AssertionError: false == true/.test(err.stdout);

			assert(throws || uncaught);
			done();
		});
		stream.write(fixture('fixture-async.js'));
		stream.end();
	});

	it('should not suppress output', done => {
		const stream = mocha();

		stream.once('_result', result => {
			assert(/should pass/.test(result.stdout));
			done();
		});
		stream.write(fixture('fixture-pass.js'));
		stream.end();
	});

	it('should require two files', done => {
		const stream = mocha({require: [
			'test/fixtures/fixture-require1.js',
			'test/fixtures/fixture-require2.js'
		]});

		stream.once('_result', result => {
			assert(/1 passing/.test(result.stdout));
			done();
		});
		stream.write(fixture('fixture-pass.js'));
		stream.end();
	});
});
