module.exports = {
	comaStringToArray: function(rawValue) {
		return rawValue[0].split(',');
	},
	toString: function(rawValue) {
		return rawValue[0].toString();
	},
	toBoolean: function(rawValue) {
		return rawValue[0] === "true";
	},
	toNumber: function(rawValue) {
		return parseFloat(rawValue[0]);
	}
};
