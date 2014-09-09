'use strict';
var domain = require('domain');
var gutil = require('gulp-util');
var through = require('through');
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

	var hasTests = false;
	return through(function (file) {
		mocha.addFile(file.path);
		hasTests = true;
		this.queue(file);
	}, function () {
		var stream = this;
		var d = domain.create();

		function handleException(err) {
			clearCache();
			stream.emit('error', new gutil.PluginError('gulp-mocha', err));
		}

		d.on('error', handleException);
		d.run(function () {
			try {
				var runner = mocha.run(function (errCount) {
					clearCache();

					if (errCount > 0) {
						stream.emit('error', new gutil.PluginError('gulp-mocha', errCount + ' ' + (errCount === 1 ? 'test' : 'tests') + ' failed.', {
							showStack: false
						}));
					} else if (!hasTests) {
						stream.emit('end');
					}
				});

				runner.on('end', function () {
					clearCache();
					stream.emit('end');
				});
			} catch (err) {
				handleException(err);
			}
		});
	});
};
