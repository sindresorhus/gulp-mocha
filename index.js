'use strict';
var path = require('path');
var Transform = require('stream').Transform;
var gutil = require('gulp-util');
var Mocha = require('mocha');

var PLUGIN = 'gulp-mocha';

module.exports = function (options) {
  var transform = new Transform({objectMode: true});
  var mocha = new Mocha(options);

  transform._transform = function (file, encoding, next) {
    delete require.cache[require.resolve(path.resolve(file.path))];
    mocha.addFile(file.path);
    transform.push(file);
    next();
  };

  transform.on('finish', function () {
    try {
      mocha.run(function (errorCount) {
        if (errorCount !== 0) {
          transform.emit('error', new gutil.PluginError(PLUGIN, [errorCount, (errorCount === 1 ? 'test' : 'tests'), 'failed.'].join(' ')));
        }
      });
    } catch (err) {
      transform.emit('error', new gutil.PluginError(PLUGIN, err, {showStack: true}));
    }
  });

  return transform;
};
