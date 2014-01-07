'use strict';
var path = require('path');
var through = require('through');
var gutil = require('gulp-util');
var Mocha = require('mocha');

module.exports = function (options) {
	var mocha = new Mocha(options);

	return through(function (file) {
		delete require.cache[require.resolve(path.resolve(file.path))];
		mocha.files = [ file.path ];
		try {
			mocha.run(function (errCount) {
				this.emit('data', file);

				if (errCount > 0) {
					var errWord = (errCount === 1 ? 'test' : 'tests');
					return this.emit('error',
						new Error(['gulp-mocha: ', errCount, errWord, 'failed.'].join(' ')));
				}
			}.bind(this));
		} catch (err) {
			this.emit('error', new Error('gulp-mocha: ' + err));
		}
	});
};
