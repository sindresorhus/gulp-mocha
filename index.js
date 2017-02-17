'use strict';

const dargs = require('dargs');
const execa = require('execa');
const gutil = require('gulp-util');
const through = require('through2');

module.exports = options => {
  const defaults = {colors: true, suppress: false};

  options = Object.assign(defaults, options);

  if (Object.prototype.toString.call(options.globals) === '[object Array]') {
    // typically wouldn't modify passed options, but mocha requires a comma-
    // separated list of names, http://mochajs.org/#globals-names, whereas dargs
    // will treat arrays differently.
    options.globals = options.globals.join(',');
  }

  // exposing args for testing
  const args = dargs(options, {excludes: ['suppress'], ignoreFalse: true});
  const files = [];

  function aggregate(file, encoding, done) {
    if (file.isNull()) {
      return done(null, file);
    }

    if (file.isStream()) {
      return done(new gutil.PluginError('gulp-mocha', 'Streaming not supported'));
    }

    files.push(file.path);

    return done();
  }

  function flush(done) {
    execa('mocha', files.concat(args))
      .then(result => {
        if (!options.suppress) {
          process.stdout.write(result.stdout);
        }

        this.emit('result', result);
        done();
      })
      .catch(err => {
        this.emit('error', new gutil.PluginError('gulp-mocha', err));
        done();
      });
  }

  return through.obj(aggregate, flush);
};
