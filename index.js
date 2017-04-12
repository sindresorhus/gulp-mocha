'use strict';
const dargs = require('dargs');
const execa = require('execa');
const gutil = require('gulp-util');
const through = require('through2');
// TODO: Use execa localDir option when available
const npmRunPath = require('npm-run-path');

const HUNDRED_MEGABYTES = 1000 * 1000 * 100;

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

			// Convert an object into comma separated list.
		} else if (typeof val === 'object') {
			opts[key] = convertObjectToList(val);
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
		const env = npmRunPath.env({cwd: __dirname});
		const proc = execa('mocha', files.concat(args), {
			env,
			maxBuffer: HUNDRED_MEGABYTES
		});

		proc.then(result => {
			this.emit('_result', result);
			done();
		})
		.catch(err => {
			this.emit('error', new gutil.PluginError('gulp-mocha', err));
			done();
		});

		if (!opts.suppress) {
			proc.stdout.pipe(process.stdout);
			proc.stderr.pipe(process.stderr);
		}
	}

	function objectEntries(object) {
		const entries = [];
		for (const key in object) {
			if (has(object, key)) {
				const value = object[key];
				entries.push([key, value]);
			}
		}
		return entries;
	}

	function convertObjectToList(object) {
		return objectEntries(object)
			.reduce((result, current) => result.concat(`${current[0]}=${current[1]}`), [])
			.join(',');
	}

	function has(object, prop) {
		return Object.prototype.hasOwnProperty.call(object, prop);
	}

	return through.obj(aggregate, flush);
};
