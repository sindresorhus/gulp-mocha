var path = require('path');
var temp = require('temp');
var mocha = require('../');
var fs = require('fs');
var assert = require('assert');

var tempFile
const filePrefix = './';

function removeFile(file) {
  try {
    fs.unlinkSync(file); 
  } catch(err) {}
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
  assert.throws(function() {
    mocha({ require: [filePrefix + tempFileBaseName]});
  });
})

it('should be able to import js-files in cwd', function() {
  mocha({ require: [filePrefix + tempFileBaseName]});
});

it('should fail when not having the ./ file prefix', function(){
  assert.throws(function() {
    mocha({require: [tempFileBaseName]}) 
  });
});
