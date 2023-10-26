'use strict';
const gulp = require('gulp');
const mocha = require('./index.js');

exports.default = () => (
	gulp.src('test/fixtures/fixture-pass.js', {read: false})
		.pipe(mocha())
);
