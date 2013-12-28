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
			this.emit('end');
		}.bind(this));
	});
};
