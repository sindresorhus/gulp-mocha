'use strict';
var path = require('path');
var Duplex = require('stream').Duplex;
var gutil = require('gulp-util');
var Mocha = require('mocha');

module.exports = function (options) {
	var duplex = new Duplex({objectMode: true});
	var errorCount = 0;

	duplex._write = function (file, encoding, done) {
		var mocha;

		// Load provided modules as the same to mocha's --require
		if (options && Array.isArray(options.require)) {
			options.require.forEach(function (mod) {
				require(mod);
			});
		}

		mocha = new Mocha(options);
		delete require.cache[require.resolve(path.resolve(file.path))];
		mocha.addFile(file.path);

		try {
			mocha.run(function (errCount) {
				duplex.push(file);
				errorCount += errCount;
				done();
			}.bind(this));
		} catch (err) {
			this.emit('error', err);
			done();
		}
	};

	duplex.on('finish', function () {
		if (errorCount === 0) {
			return;
		}

		var ec = errorCount;
		errorCount = 0;

		duplex.emit('error', new gutil.PluginError('gulp-mocha', [ec, (ec === 1 ? 'test' : 'tests'), 'failed.'].join(' ')));
	});

	duplex._read = function () {};

	return duplex;
};
