import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import test from 'ava';
import Vinyl from 'vinyl';
import {pEvent} from 'p-event';
import mocha from '../index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fixture(name) {
	const filename = path.join(__dirname, 'fixtures', name);

	return new Vinyl({
		path: filename,
		contents: fs.existsSync(filename) ? fs.readFileSync(filename) : null,
	});
}

test('run unit test and pass', async t => {
	const stream = mocha({suppress: true});
	const result = pEvent(stream, '_result');
	stream.end(fixture('fixture-pass.js'));
	const {stdout} = await result;
	t.regex(stdout, /1 passing/);
});

test('run unit test and fail', async t => {
	const stream = mocha({suppress: true});
	const error = pEvent(stream, 'error');
	stream.end(fixture('fixture-fail.js'));
	const {message} = await error;
	t.regex(message, /There were test failures/);
});

test('pass async AssertionError to mocha', async t => {
	const stream = mocha({suppress: true});
	const event = pEvent(stream, 'error');
	stream.end(fixture('fixture-async.js'));
	const error = await event;
	t.regex(error.message, /There were test failures/);
});

test('require two files', async t => {
	const stream = mocha({
		suppress: true,
		require: [
			'test/fixtures/fixture-require1.js',
			'test/fixtures/fixture-require2.js',
		],
	});
	const result = pEvent(stream, '_result');
	stream.end(fixture('fixture-pass.js'));
	const {stdout} = await result;
	t.regex(stdout, /1 passing/);
});
