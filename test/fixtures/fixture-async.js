import assert from 'node:assert';

it('should fail after timeout', done => {
	setTimeout(() => {
		assert(false);
	}, 10);
});
