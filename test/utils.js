import test from 'ava';
import m from '../utils';

test('convertObjectToList produces a comma separated string of k=v', t => {
	t.is(
		m.convertObjectToList({key1: 'value1', key2: 'value2', key99: 'value99'}),
		'key1=value1,key2=value2,key99=value99'
	);
});
