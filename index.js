'use strict';
var domain = require('domain'); // eslint-disable-line no-restricted-modules
var gutil = require('gulp-util');
var through = require('through');
var Mocha = require('mocha');
var plur = require('plur');
var reqCwd = require('req-cwd');

module.exports = function (opts) {
	opts = opts || {};

	var mocha = new Mocha(opts);
	var cache = {};

	for (var key in require.cache) { // eslint-disable-line guard-for-in
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
		mocha.addFile(file.path);
		this.queue(file);
	}, function () {
		var self = this;
		var d = domain.create();
		var runner;
		var events = ['start', 'end', 'suite', 'suite end', 'test', 'test end', 'hook', 'hook end',
									'pass', 'fail', 'pending' ];

		function attachEventListeners(runner) {
			var obj = Object.keys(opts);
				for (var prop in obj) {
					var method = obj[prop];
					if (events.indexOf(method) > -1) {
						runner.on(method, opts[method]);
					}
				}
		}

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

				attachEventListeners(runner);

			} catch (err) {
				handleException(err);
			}
		});
	});
};
