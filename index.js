'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through2 = require('through2');
var Mocha = require('mocha');

module.exports = function (options) {
	var mocha = new Mocha(options);

	var stream = through2.obj(function (file, encoding, done) {
		delete require.cache[require.resolve(path.resolve(file.path))];
		mocha.addFile(file.path);
		this.push(file);
		done();
	}, function (done) {
		try {
			mocha.run(function (errCount) {
				done();
				if (!errCount) { return; }
				return this.emit('error',
					new gutil.PluginError('gulp-mocha', [
						errCount,
						(errCount === 1 ? 'test' : 'tests'),
						'failed.'
					].join(' '))
				);
			}.bind(this));
		} catch (err) {
			this.emit('error', err);
			done();
		}
	});

	return stream;
};
