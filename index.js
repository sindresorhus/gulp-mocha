'use strict';
var domain = require('domain');
var gutil = require('gulp-util');
var through = require('through2');
var Mocha = require('mocha');

module.exports = function (options) {
	var mocha = new Mocha(options);
	var cache = {};

	for (var key in require.cache) {
		cache[key] = true;
	}

	function clearCache() {
		for (var key in require.cache) {
			if (!cache[key]) {
				delete require.cache[key];
			}
		}
	}

	return through.obj(function (file, enc, cb) {
		mocha.addFile(file.path);
		this.push(file);
		cb();
	}, function (cb) {
		var stream = this;
		var d = domain.create();

		function handleException(err) {
			clearCache();
			stream.emit('error', new gutil.PluginError('gulp-mocha', err));
			cb();
		}

		d.on('error', handleException);
		d.run(function () {
			try {
				mocha.run(function (errCount) {
					clearCache();

					if (errCount > 0) {
						stream.emit('error', new gutil.PluginError('gulp-mocha', errCount + ' ' + (errCount === 1 ? 'test' : 'tests') + ' failed.', {
							showStack: false
						}));
					}

					cb();
				});
			} catch (err) {
				handleException(err);
			}
		});
	});
};
