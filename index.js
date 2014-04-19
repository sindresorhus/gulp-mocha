'use strict';
var path = require('path');
var gutil = require('gulp-util');
var util = require('util');
var through2 = require('through2');
var Mocha = require('mocha');

module.exports = function (options) {
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
			if(options && options.require) {
				mocha.suite.on('pre-require', function(){
					var mod;
					if (!util.isArray(options.require)) options.require = [options.require];

					while (mod = options.require.pop()) {
						if (options.requireGlobals){
							var name = mod.toLowerCase()
										.replace(/-(.)/g, function(match, group1) {
											return group1.toUpperCase();
										});
							global[name] = require(mod);
						} else {
							require(mod);
						}
					}

				});
			}

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
