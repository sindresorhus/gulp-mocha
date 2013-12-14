'use strict';
var es = require('event-stream');
var Mocha = require('mocha');

module.exports = function (options) {
	return es.map(function (file, cb) {
		var mocha = new Mocha(options);
		mocha.addFile(file.path);
		mocha.run(function (errCount) {
			if (errCount) {
				return cb(new Error(errCount + ' failing'), file);
			}

			cb(null, file);
		});
	});
};
