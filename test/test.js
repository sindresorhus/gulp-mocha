/* eslint-disable padded-blocks */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const gutil = require('gulp-util');
const mocha = require('../');

function fixture (name) {
  let fileName = path.join(__dirname, 'fixtures', name);

  return new gutil.File({
    path: fileName,
    contents: fs.existsSync(fileName) ? fs.readFileSync(fileName) : null
  });
}

describe('mocha()', () => {

  it('should run unit test and pass', done => {
    let stream = mocha({suppress: true});

    stream.once('result', result => {
      assert(/1 passing/.test(result.stdout));
      done();
    });
    stream.write(fixture('fixture-pass.js'));
    stream.end();
  });

  it('should run unit test and fail', done => {
    let stream = mocha({suppress: true});

    stream.once('error', function (err) {
      assert(/1 failing/.test(err.stdout));
      done();
    });
    stream.write(fixture('fixture-fail.js'));
    stream.end();
  });

  it('should pass async AssertionError to mocha', function (done) {
    let stream = mocha({suppress: true});

    stream.once('error', function (err) {
      let throws = /throws after timeout/.test(err.stdout);
      let uncaught = /Uncaught AssertionError: false == true/.test(err.stdout);

      assert(throws || uncaught);
      done();
    });
    stream.write(fixture('fixture-async.js'));
    stream.end();
  });
});
