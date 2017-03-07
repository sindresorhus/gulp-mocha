'use strict';
const dargs = require('dargs');
const execa = require('execa');
const gutil = require('gulp-util');
const through = require('through2');

module.exports = opts => {
	opts = Object.assign({
		colors: true,
		suppress: false
	}, opts);

	// Convert arrays into comma separated lists
	for (const key of Object.keys(opts)) {
		const val = opts[key];

		if (Array.isArray(val)) {
			opts[key] = val.join(',');
		}
	}

	const args = dargs(opts, {
		excludes: ['suppress'],
		ignoreFalse: true
	});

	const files = [];

	function aggregate(file, encoding, done) {
		if (file.isStream()) {
			done(new gutil.PluginError('gulp-mocha', 'Streaming not supported'));
			return;
		}

		files.push(file.path);

		done();
	}

	function flush(done) {
		execa('mocha', files.concat(args))
			.then(result => {
				if (!opts.suppress) {
					process.stdout.write(result.stdout);
				}

				// For testing
				this.emit('_result', result);

				done();
			})
			.catch(err => {
				this.emit('error', new gutil.PluginError('gulp-mocha', err));
				done();
			});
	}

	return through.obj(aggregate, flush);
};
