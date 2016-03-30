'use strict';
var domain = require('domain');
var gutil = require('gulp-util');
var through = require('through');
var Mocha = require('mocha');
var plur = require('plur');
var reqCwd = require('req-cwd');
var requireFromString = require('require-from-string');

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
			reqCwd(x);
		});
	}

	return through(function (file) {
		var self = this;
		if (file.isNull()) {
			mocha.addFile(file.path);
			this.queue(file);
		} else if (file.isBuffer()) {
			try {
				mocha.suite.emit('pre-require', global, file.path, mocha);
				var f = requireFromString(file.contents.toString('utf-8'), file.path);
				mocha.suite.emit('require', f, file.path, mocha);
				mocha.suite.emit('post-require', global, file.path, mocha);
				this.queue(file);
			} catch (err) {
				self.emit('error', new gutil.PluginError('gulp-mocha', err, {
					stack: err.stack,
					showStack: true
				}));
			}
		} else if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-mocha',  'Streaming not supported'));
		}
	}, function () {
		var self = this;
		var d = domain.create();
		var runner;

		function handleException(err) {
			if (runner) {
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
