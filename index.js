'use strict';

var gutil = require('gulp-util');
var through2 = require('through2');
var Mocha = require('mocha');
var domain = require('domain');

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

	return through2.obj(function (file, enc, cb) {
		mocha.addFile(file.path);
		this.push(file);
		cb();
	}, function (cb) {
		var stream = this;
		var d = domain.create();

		function handleException(e) {
			clearCache();
			stream.emit('error', new gutil.PluginError('gulp-mocha', e));
			cb();
		}

		d.on('error', handleException);
		d.run(function () {
			try {
				mocha.run(function (errCount) {
					clearCache();
					if (errCount > 0) {
						stream.emit('error', new gutil.PluginError('gulp-mocha', errCount + ' ' + (errCount === 1 ? 'test' : 'tests') + ' failed.'));
					}
					cb();
				});
			}
			catch (e) {
				handleException(e);
			}
		});
	});
};
