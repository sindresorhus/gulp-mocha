'use strict';
const assert = require('assert');
const utils = require('../utils');

const convertObjectToList = utils.convertObjectToList;

describe('Utils', () => {
	describe('convertObjectToList', () => {
		it('produces a comma separated string of k=v', done => {
			const actual = convertObjectToList({key1: 'value1', key2: 'value2', key99: 'value99'});
			const expected = 'key1=value1,key2=value2,key99=value99';
			assert(actual === expected);
			done();
		});
	});
});
