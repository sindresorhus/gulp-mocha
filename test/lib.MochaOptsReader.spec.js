(function () {
  'use strict';

	var assert = require('assert');
	var MochaOptsReader = require('../lib/MochaOptsReader.js');
	var fs = require('fs');

	describe('MochaOptsReader', function() {
		it('gives an empty object if no configration file', function() {
			var reader = new MochaOptsReader();
			assert.deepEqual(reader.getConfig(), {});
		});

		it('retrieve information from the default file', function() {
			var optsPath = "test/mocha.opts";
			fs.writeFileSync(optsPath, "--ui bdd", "utf8");

			var reader = new MochaOptsReader();
			assert.deepEqual(reader.getConfig(), {ui:'bdd'});

			fs.unlinkSync(optsPath);
		});

		it('retrieve information from a given file', function() {
			var opts = [
				'--require test',
				'--require test2',
				'-r test3',
				'--bail true',
				'--ui tdd',
				'--globals a,b,c,d',
				'--timeout 40530',
				'--ignored',
				'--grep azesdf',
				'-alsoIgnored'
			];
			var optsPath = "test/mocha.custom.opts";
			fs.writeFileSync(optsPath, opts.join('\n'), "utf8");

			var reader = new MochaOptsReader(optsPath);
			assert.deepEqual(reader.getConfig(), {ui:'tdd', bail: true, globals: ["a", "b", "c", "d"], grep: "azesdf", require: ["test", "test2", "test3"], timeout: 40530});

			fs.unlinkSync(optsPath);
		});

		it('merge opts with the given one', function() {
			var opts = [
				'--require test',
				'--require test2',
				'-t 12345'
			];
			var optsPath = "test/mocha.custom.opts";
			fs.writeFileSync(optsPath, opts.join('\n'), "utf8");

			var opts = MochaOptsReader.getOpts({opts: optsPath, bail: false, timeout: 40530});
			assert.deepEqual(opts, {bail: false, require: ["test", "test2"], timeout: 40530});

			fs.unlinkSync(optsPath);
		});
	});
})();
