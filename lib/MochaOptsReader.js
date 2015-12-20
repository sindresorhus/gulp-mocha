var fs = require('fs');
var MochaOptionAdapters = require('./MochaOptionAdapters');

MochaOptsReader.config = {
	ui: { args: ['--ui', '-u'], adapter: 'toString' },
	reporter:  { args: ['--reporter', '-R'], adapter: 'toString' },
	globals:  { args: ['--globals'], adapter: 'comaStringToArray' },
	timeout:  { args: ['--timeout', '-t'], adapter: 'toNumber' },
	bail:  { args: ['--bail', '-b'], adapter: 'toBoolean' },
	grep:  { args: ['--grep', '-g'], adapter: 'toString' },
	require:  { args: ['--require', '-r'] }
};

function MochaOptsReader(optsFilePath) {
	this.optsPath = optsFilePath ? optsFilePath : 'test/mocha.opts';
}

/**
 * @param opts gulp-mocha opts
 */
MochaOptsReader.getOpts = function(opts) {
	opts = opts || {};
	var fileOpts = (new MochaOptsReader(opts.opts)).getConfig();
	Object.keys(fileOpts).forEach(function(optName) {
		if(opts[optName] === undefined) {
			opts[optName] = fileOpts[optName];
		}
	});

	// delete opts option
	if(opts.opts) {
		delete opts.opts;
	}

	return opts;
};

MochaOptsReader.prototype.getConfig = function() {
	var opts = this.readOptsFile();
	var groupedOpts = MochaOptsReader.groupOpts(opts);
	return MochaOptsReader.sanitizeOptions(groupedOpts);
};

// @see https://github.com/mochajs/mocha/blob/master/bin/options.js
MochaOptsReader.prototype.readOptsFile = function() {
	try {
		return fs.readFileSync(this.optsPath, 'utf8')
			.replace(/\\\s/g, '%20')
			.split(/\s/)
			.filter(Boolean)
			.map(function(value) {
				return value.replace(/%20/g, ' ');
			});
	} catch(err) {
	}
	return [];
};

MochaOptsReader.groupOpts = function(opts) {
	var groupOpts = {};
	var lastConfigName = null;
	for(var i = 0; i < opts.length; i++) {
		var curArg = opts[i];
		if(MochaOptsReader.isOptKnown(curArg)) {
			lastConfigName = MochaOptsReader.getConfigName(curArg);
			groupOpts[lastConfigName] === undefined && (groupOpts[lastConfigName] = []);
		}
		// argument not known
		else if(curArg[0] === '-'){
			lastConfigName = null;
		}
		// Values of arguments
		else if (lastConfigName !== null){
			groupOpts[lastConfigName].push(curArg);
		}
	}

	return groupOpts;
};

MochaOptsReader.isOptKnown = function(optName) {
	return MochaOptsReader.getKnownArgs().indexOf(optName) >= 0;
};

MochaOptsReader.getConfigName = function(argName) {
	return MochaOptsReader.getArgsConfigNames()[argName];
};


MochaOptsReader.getKnownArgs = function() {
	if(!MochaOptsReader.knownArgs) {
		MochaOptsReader.knownArgs = Object.keys(MochaOptsReader.getArgsConfigNames())
	}
	return MochaOptsReader.knownArgs;
};

MochaOptsReader.getArgsConfigNames = function() {
	if(!MochaOptsReader.argsConfigNames) {
		MochaOptsReader.argsConfigNames = {};

		Object.keys(MochaOptsReader.config).forEach(function(configName) {
			MochaOptsReader.config[configName].args.forEach(function(arg) {
				MochaOptsReader.argsConfigNames[arg] = configName;
			});
		});
	}
	return MochaOptsReader.argsConfigNames;
};

MochaOptsReader.sanitizeOptions = function(rawOptions) {
	var cleanOptions = {};
	Object.keys(rawOptions).forEach(function(optionName) {
		var optionValue = rawOptions[optionName];
		var adapter = MochaOptsReader.config[optionName].adapter;
		cleanOptions[optionName] = adapter ? MochaOptionAdapters[adapter](optionValue) : optionValue;
	});
	return cleanOptions;
};

module.exports = MochaOptsReader;
