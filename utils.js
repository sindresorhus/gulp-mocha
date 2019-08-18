'use strict';

function convertObjectToList(object) {
	return Object.entries(object)
		.reduce((result, current) => result.concat(`${current[0]}=${current[1]}`), [])
		.join(',');
}

module.exports = {
	convertObjectToList
};
