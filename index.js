import process from 'node:process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import dargs from 'dargs';
import {execa} from 'execa';
import supportsColor from 'supports-color';
import {gulpPlugin} from 'gulp-plugin-extras';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mocha options that can be specified multiple times
const MULTIPLE_OPTIONS = new Set([
	'require',
]);

function convertObjectToList(object) {
	return Object.entries(object)
		.map(([key, value]) => `${key}=${value}`)
		.join(',');
}

export default function gulpMocha(options) {
	options = {
		colors: Boolean(supportsColor.stdout),
		suppress: false,
		...options,
	};

	for (const [key, value] of Object.entries(options)) {
		if (Array.isArray(value)) {
			if (!MULTIPLE_OPTIONS.has(key)) {
				// Convert arrays into comma separated lists
				options[key] = value.join(',');
			}
		} else if (typeof value === 'object') {
			// Convert an object into comma separated list
			options[key] = convertObjectToList(value);
		}
	}

	const arguments_ = dargs(options, {
		excludes: ['suppress'],
		ignoreFalse: true,
	});

	const files = [];

	return gulpPlugin('gulp-mocha', file => {
		files.push(file.path);
	}, {
		async * onFinish(stream) { // eslint-disable-line require-yield
			const subprocess = execa('mocha', [...files, ...arguments_], {
				localDir: __dirname,
				preferLocal: true,
			});

			if (!options.suppress) {
				subprocess.stdout.pipe(process.stdout);
				subprocess.stderr.pipe(process.stderr);
			}

			try {
				const result = await subprocess;
				stream.emit('_result', result);
			} catch (error) {
				if (error.exitCode > 0) {
					const error = new Error('There were test failures');
					error.isPresentable = true;
					throw error;
				}

				throw error;
			}
		},
	});
}
