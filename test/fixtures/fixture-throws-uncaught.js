'use strict';
var assert = require('assert');

it('throws after timeout', function (done) {
	setTimeout(function () {
		throw new Error('Exception in delayed function');
	}, 10);
});
