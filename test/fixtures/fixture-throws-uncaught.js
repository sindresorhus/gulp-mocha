import assert from 'node:assert';

it('throws after timeout', () => {
	setTimeout(() => {
		throw new Error('Exception in delayed function');
	}, 10);
});
