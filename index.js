'use strict';
var es = require('event-stream');
var Mocha = require('mocha');
var path = require('path');

module.exports = function (options) {
	var mocha = new Mocha(options);

	return es.through(function (file) {
		delete require.cache[require.resolve(path.resolve(file.path))];
		mocha.addFile(file.path);
		this.emit('data', file);
	}, function () {
		mocha.run(function (errCount) {
			if (errCount > 0) {
				return this.emit('error', new Error('gulp-mocha: ' + errCount + ' ' + (errCount === 1 ? 'test' : 'tests') + ' failed.'));
			}

			this.emit('end');
		}.bind(this));
	});
};
