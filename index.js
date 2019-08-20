'use strict';
const dargs = require('dargs');
const execa = require('execa');
const PluginError = require('plugin-error');
const supportsColor = require('supports-color');
const through = require('through2');
const utils = require('./utils');

// Mocha options that can be specified multiple times
const MULTIPLE_OPTS = new Set([
	'require'
]);

module.exports = options => {
	options = {
		colors: Boolean(supportsColor.stdout),
		suppress: false,
		...options
	};

	for (const [key, value] of Object.entries(options)) {
		if (Array.isArray(value)) {
			if (!MULTIPLE_OPTS.has(key)) {
				// Convert arrays into comma separated lists
				options[key] = value.join(',');
			}
		} else if (typeof value === 'object') {
			// Convert an object into comma separated list
			options[key] = utils.convertObjectToList(value);
		}
	}

	const args = dargs(options, {
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
		(async () => {
			const subprocess = execa('mocha', files.concat(args), {
				localDir: __dirname,
				preferLocal: true
			});

			if (!options.suppress) {
				subprocess.stdout.pipe(process.stdout);
				subprocess.stderr.pipe(process.stderr);
			}

			try {
				const result = await subprocess;
				this.emit('_result', result);
			} catch (error) {
				this.emit('error', new PluginError('gulp-mocha', error.exitCode > 0 ? 'There were test failures' : error));
			}

			done();
		})();
	}

	return through.obj(aggregate, flush);
};
