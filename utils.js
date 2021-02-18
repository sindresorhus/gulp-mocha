'use strict';

function convertObjectToList(object) {
	return Object.entries(object)
		// TODO: Stop using `.reduce`
		// eslint-disable-next-line unicorn/no-array-reduce
		.reduce((result, current) => result.concat(`${current[0]}=${current[1]}`), [])
		.join(',');
}

module.exports = {
	convertObjectToList
};
