'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through2 = require('through2');
var Mocha = require('mocha');

module.exports = function (options) {
	var errorCount = 0,
		stream = through2.obj(
			function (file, encoding, done) {
				var mocha = new Mocha(options);
				delete require.cache[require.resolve(path.resolve(file.path))];
				mocha.addFile(file.path);

				try {
					mocha.run(function (errCount) {
						this.push(file);
						errorCount += errCount;
						done();
					}.bind(this));
				} catch (err) {
					this.emit('error', err);
					done();
				}
			},
			function (done) {
				done();
				if (errorCount === 0) {
					return;
				}

				var ec = errorCount;
				errorCount = 0;

				this.emit('error', new gutil.PluginError('gulp-mocha', [ec, (ec === 1 ? 'test' : 'tests'), 'failed.'].join(' ')));
			});

	return stream;
};
