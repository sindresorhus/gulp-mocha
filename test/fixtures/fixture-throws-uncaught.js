'use strict';
const assert = require('assert');

it('throws after timeout', () => {
	setTimeout(() => {
		throw new Error('Exception in delayed function');
	}, 10);
});
