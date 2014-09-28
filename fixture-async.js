/* global it */
'use strict';
var assert = require('assert');

it('should fail after timeout', function (done) {
	setTimeout(function () {
		assert(false);
	}, 10);
});
