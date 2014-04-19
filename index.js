'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through2 = require('through2');
var fs = require('fs');
var util = require('util');
var Mocha = require('mocha');

module.exports = function (options) {

	// mocha.opts support
	try {
		var multi = ['require'];
		fs.readFileSync(path.resolve('test/mocha.opts'), 'utf8')
			.trim()
			.split(/\n/).map(function (opt) {
				opt = opt.replace('--', '').split(/\s/)
				var key = opt[0], value = opt[1];
				if (!options.hasOwnProperty(key)) {
					options[key] = value;
				} else if ( util.isArray(options[key]) ) {
					options[key].push(value);
				} else if (~multi.indexOf(key)){
					options[key] = [options[key], value];
				}
			});
	} catch (err) {
	// ignore
	}

	var mocha = new Mocha(options);
	var cache = {};

	for (var key in require.cache) {
		cache[key] = true;
	}

	return through2.obj(function (file, enc, cb) {
		mocha.addFile(file.path);
		this.push(file);
		cb();
	}, function (cb) {
		try {
			mocha.run(function (errCount) {
				if (errCount > 0) {
					this.emit('error', new gutil.PluginError('gulp-mocha', errCount + ' ' + (errCount === 1 ? 'test' : 'tests') + ' failed.'));
				}

				for (var key in require.cache) {
					if (!cache[key]) {
						delete require.cache[key];
					}
				}

				cb();
			}.bind(this));
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-mocha', err));
			cb();
		}
	});
};
