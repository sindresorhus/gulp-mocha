'use strict';
const assert = require('assert');

it('should fail after timeout', done => {
	setTimeout(() => {
		assert(false);
	}, 10);
});
