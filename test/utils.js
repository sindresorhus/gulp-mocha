'use strict';
const assert = require('assert');
const utils = require('../utils');

describe('Utils', () => {
	describe('convertObjectToList', () => {
		it('produces a comma separated string of k=v', () => {
			const actual = utils.convertObjectToList({key1: 'value1', key2: 'value2', key99: 'value99'});
			const expected = 'key1=value1,key2=value2,key99=value99';
			assert.strictEqual(actual, expected);
		});
	});
});
