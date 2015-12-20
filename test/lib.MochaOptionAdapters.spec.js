(function () {
	'use strict';

	var assert = require('assert');
	var MochaOptionAdapters = require('../lib/MochaOptionAdapters.js');

	describe('MochaOptionAdapters', function() {
		it('comaStringToArray', function() {
			assert.deepEqual(MochaOptionAdapters.comaStringToArray(['a,b,c,d,e', 'foobar']), ['a', 'b', 'c', 'd', 'e']);
		});
		it('toString', function() {
			assert.equal(MochaOptionAdapters.toString(['azerty', 'foobar']), 'azerty');
		});
		it('toBoolean', function() {
			assert.equal(MochaOptionAdapters.toBoolean(['true', 'foobar']), true);
			assert.equal(MochaOptionAdapters.toBoolean(['false', 'foobar']), false);
			assert.equal(MochaOptionAdapters.toBoolean(['foobar']), false);
		});
		it('toNumber', function() {
			assert.equal(MochaOptionAdapters.toNumber(['123456', 'foobar']), 123456);
		});
	});
})();
