import fs from 'fs';
import path from 'path';
import test from 'ava';
import Vinyl from 'vinyl';
import pEvent from 'p-event';
import mocha from '../index.js';

function fixture(name) {
	const fileName = path.join(__dirname, 'fixtures', name);

	return new Vinyl({
		path: fileName,
		contents: fs.existsSync(fileName) ? fs.readFileSync(fileName) : null
	});
}

test('run unit test and pass', async t => {
	const stream = mocha({suppress: true});
	const result = pEvent(stream, '_result');
	stream.end(fixture('fixture-pass.js'));
	t.regex((await result).stdout, /1 passing/);
});

test('run unit test and fail', async t => {
	const stream = mocha({suppress: true});
	const error = pEvent(stream, 'error');
	stream.end(fixture('fixture-fail.js'));
	t.regex((await error).message, /There were test failures/);
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
			'test/fixtures/fixture-require2.js'
		]
	});
	const result = pEvent(stream, '_result');
	stream.end(fixture('fixture-pass.js'));
	t.regex((await result).stdout, /1 passing/);
});
