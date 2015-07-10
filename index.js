'use strict';
var domain = require('domain');
var gutil = require('gulp-util');
var through = require('through');
var Mocha = require('mocha');
var plur = require('plur');
var resolveFrom = require('resolve-from');

module.exports = function (opts) {
	opts = opts || {};

	var mocha = new Mocha(opts);
	var cache = {};

	for (var key in require.cache) {
		cache[key] = true;
	}

	function clearCache() {
		for (var key in require.cache) {
			if (!cache[key] && !/\.node$/.test(key)) {
				delete require.cache[key];
			}
		}
	}

	if (Array.isArray(opts.require) && opts.require.length) {
		opts.require.forEach(function (x) {
			require(resolveFrom(process.cwd(), x));
		});
	}

	return through(function (file) {
		mocha.addFile(file.path);
		this.queue(file);
	}, function () {
		var self = this;
		var d = domain.create();
		var runner;

		function handleException(err) {
			if (err.name === 'AssertionError' && runner) {
				runner.uncaught(err);
			} else {
				clearCache();
				self.emit('error', new gutil.PluginError('gulp-mocha', err, {
					stack: err.stack,
					showStack: true
				}));
			}
		}

		d.on('error', handleException);
		d.run(function () {
			try {
				runner = mocha.run(function (errCount) {
					clearCache();

					if (errCount > 0) {
						self.emit('error', new gutil.PluginError('gulp-mocha', errCount + ' ' + plur('test', errCount) + ' failed.', {
							showStack: false
						}));
					}

					self.emit('end');
				});
			} catch (err) {
				handleException(err);
			}
		});
	});
};
