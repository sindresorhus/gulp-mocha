var path = require('path');
var temp = require('temp');
var mocha = require('../');
var fs = require('fs');
var assert = require('assert');

var tempFile, filePrefix = './';

function removeFile(file) {
  if (file && fs.existsSync(file)) { 
    fs.unlinkSync(file); 
  };
}

beforeEach(function(){
  tempFile = temp.path({dir:process.cwd(), suffix: '.js'});
  tempFileBaseName = path.basename(tempFile);
  fs.closeSync(fs.openSync(tempFile, 'w'));
});

afterEach(function(){
  removeFile(tempFile);
});


it('should fail when trying to require a file that doesn\'t exist', function() {
  removeFile(tempFile);
  try {
    mocha({ require: [filePrefix + tempFileBaseName]});
    assert(false);
  } catch (err) {
    assert(true);
  }
})

it('should be able to import js-files in cwd', function() {
  mocha({ require: [filePrefix + tempFileBaseName]});
});

it('should fail when not having the ./ file prefix', function(){
  try {
    mocha({require: [tempFileBaseName]});
    assert(false);
  } catch(err) {
    assert(true);
  }
});
