'use strict';
var es = require('event-stream');
var Mocha = require('mocha');

module.exports = function (options) {
	var mocha = new Mocha(options);

	return es.through(function (file) {
		mocha.addFile(file.path);
		this.emit('data', file);
	}, function () {
		mocha.run(function (errCount) {
			if (errCount > 0) {
				var errMsg = errCount + ' ' + (errCount === 1 ? 'test' : 'tests') + ' failed.';
				return this.emit('error', new Error(errMsg));
			}

			this.emit('end');
		}.bind(this));
	});
};
