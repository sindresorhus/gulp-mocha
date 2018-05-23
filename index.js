'use strict';
const dargs = require('dargs');
const execa = require('execa');
const PluginError = require('plugin-error');
const supportsColor = require('supports-color');
const through = require('through2');
// TODO: Use execa localDir option when available
const npmRunPath = require('npm-run-path');
const utils = require('./utils');

const HUNDRED_MEGABYTES = 1000 * 1000 * 100;

// Mocha options that can be specified multiple times
const MULTIPLE_OPTS = new Set([
	'require'
]);

module.exports = opts => {
	opts = Object.assign({
		colors: Boolean(supportsColor.stdout),
		suppress: false
	}, opts);

	for (const key of Object.keys(opts)) {
		const val = opts[key];

		if (Array.isArray(val)) {
			if (!MULTIPLE_OPTS.has(key)) {
				// Convert arrays into comma separated lists
				opts[key] = val.join(',');
			}
		} else if (typeof val === 'object') {
			// Convert an object into comma separated list
			opts[key] = utils.convertObjectToList(val);
		}
	}

	const args = dargs(opts, {
		excludes: ['suppress'],
		ignoreFalse: true
	});

	const files = [];

	function aggregate(file, encoding, done) {
		if (file.isStream()) {
			done(new PluginError('gulp-mocha', 'Streaming not supported'));
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

		proc
			.then(result => {
				this.emit('_result', result);
				done();
			})
			.catch(err => {
				this.emit('error', new PluginError('gulp-mocha', err.code > 0 ? 'There were test failures' : err));
				done();
			});

		if (!opts.suppress) {
			proc.stdout.pipe(process.stdout);
			proc.stderr.pipe(process.stderr);
		}
	}

	return through.obj(aggregate, flush);
};
