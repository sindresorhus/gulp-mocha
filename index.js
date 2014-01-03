'use strict';
var path = require('path');
var through = require('through');
var gutil = require('gulp-util');
var Mocha = require('mocha');

module.exports = function (options) {
	var mocha = new Mocha(options);

	return through(function (file) {
		delete require.cache[require.resolve(path.resolve(file.path))];
		mocha.addFile(file.path);
		this.emit('data', file);
	}, function () {
		try {
			mocha.run(function (errCount) {
				if (errCount > 0) {
					return this.emit('error', new Error('gulp-mocha: ' + errCount + ' ' + (errCount === 1 ? 'test' : 'tests') + ' failed.'));
				}

				this.emit('end');
			}.bind(this));
		} catch (err) {
			this.emit('error', new Error('gulp-mocha: ' + err));
		}
	});
};
