/* eslint-disable padded-blocks */
'use strict';

const dargs = require('dargs');
const execa = require('execa');
const gutil = require('gulp-util');
const through = require('through2');

module.exports = options => {

  let suppress = false;

  options = Object.assign({colors: true}, options || {});

  if (options.suppress) {
    suppress = true;
    delete options.suppress;
  }

  const args = dargs(options);
  const files = [];

  function aggregate (file, encoding, done) {
    if (file.isNull()) {
      return done(null, file);
    }

    if (file.isStream()) {
      return done(new gutil.PluginError('gulp-mocha', 'Streaming not supported'));
    }

    files.push(file.path);

    return done();
  }

  function flush (done) {
    execa('mocha', files.concat(args))
      .then(result => {
        if (!suppress) {
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
