'use strict';
var domain = require('domain');
var gutil = require('gulp-util');
var through = require('through');
var Mocha = require('mocha');
var fs = require('fs');
var mkdirpSync = require('mkdirp').sync;
var path = require('path');

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
		var runner;
		var dumpFile;
		var stdoutWrite;

		function cleanupDump() {
			// close the file if it was opened
			if (dumpFile) {
				fs.closeSync(dumpFile);
				dumpFile = void 0;
			}

			// restore original stdout.write method
			if (typeof stdoutWrite === 'function') {
				process.stdout.write = stdoutWrite;
				stdoutWrite = void 0;
			}
		}

		function handleException(err) {
			cleanupDump();
			if (err.name === 'AssertionError' && runner) {
				runner.uncaught(err);
			} else {
				clearCache();
				stream.emit('error', new gutil.PluginError('gulp-mocha', err, {stack: err.stack, showStack: true}));
			}
		}

		d.on('error', handleException);
		d.run(function () {
			if (options.dump) {
				// creates the dump file if required
				mkdirpSync(path.dirname(options.dump));
				dumpFile = fs.openSync(options.dump, 'w');

				// patch the stdout.write method to dump the output into a file
				stdoutWrite = process.stdout.write;
				process.stdout.write = function(chunk) {
					if (options.dump && dumpFile) {
						fs.writeSync(dumpFile, chunk);
					}

					return stdoutWrite.apply(this, arguments);
				};
			}

			try {
				runner = mocha.run(function (errCount) {
					clearCache();
					cleanupDump();

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
					cleanupDump();
					stream.emit('end');
				});
			} catch (err) {
				handleException(err);
			}
		});
	});
};
