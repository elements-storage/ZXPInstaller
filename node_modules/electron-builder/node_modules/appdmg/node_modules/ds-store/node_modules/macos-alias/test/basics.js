
var lib = require('../');

var fs = require('fs');
var path = require('path');
var temp = require('fs-temp');
var assert = require('assert');

var rawData = new Buffer(
  "AAAAAAEqAAIAAApUZXN0IFRpdGxlAAAAAAAAAAAAAAAAAAAAAADO615USCsA" +
  "BQAAABMMVGVzdEJrZy50aWZmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFM7rXlgAAAAAAAAAAP////8A" +
  "AA0CAAAAAAAAAAAAAAAAAAAACy5iYWNrZ3JvdW5kAAABAAQAAAATAAIAJFRl" +
  "c3QgVGl0bGU6LmJhY2tncm91bmQ6AFRlc3RCa2cudGlmZgAPABYACgBUAGUA" +
  "cwB0ACAAVABpAHQAbABlABIAGS8uYmFja2dyb3VuZC9UZXN0QmtnLnRpZmYA" +
  "ABMAEy9Wb2x1bWVzL1Rlc3QgVGl0bGUA//8AAA==", 'base64'
);

describe('decode', function () {
  it('should parse a simple alias', function () {

    var info = lib.decode(rawData);

    assert.equal(info.version, 2);

    assert.deepEqual(info.volume, {
      name: 'Test Title',
      created: new Date('2014-01-02T18:20:04.000Z'),
      signature: 'H+',
      type: 'other',
      abspath: '/Volumes/Test Title'
    });

    assert.deepEqual(info.parent, {
      id: 19,
      name: '.background'
    });

    assert.deepEqual(info.target, {
      type: 'file',
      filename: 'TestBkg.tiff',
      id: 20,
      created: new Date('2014-01-02T18:20:08.000Z'),
      path: 'Test Title:.background:',
      abspath: '/.background/TestBkg.tiff'
    });

  });
});

describe('encode', function () {
  it('should encode a simple alias', function () {

    var info = lib.decode(rawData);
    var buf = lib.encode(info);

    assert.deepEqual(rawData, buf);

  });
});

describe('create', function () {
  it('should create a simple alias', function () {

    var buf = lib.create(path.join(__dirname, 'basics.js'));
    var info = lib.decode(buf);

    assert.equal('file', info.target.type);
    assert.equal('basics.js', info.target.filename);

  });
});

describe('isAlias', function () {

  var aliasFile, garbageFile;

  before(function () {
    aliasFile = temp.writeFileSync(new Buffer('626f6f6b000000006d61726b00000000', 'hex'));
    garbageFile = temp.writeFileSync(new Buffer('Hello my name is Linus!'));
  });

  after(function () {
    fs.unlinkSync(aliasFile);
    fs.unlinkSync(garbageFile);
  });

  it('should identify alias', function () {
    assert.equal(lib.isAlias(aliasFile), true);
  });

  it('should identify non-alias', function () {
    assert.equal(lib.isAlias(garbageFile), false);
  });

});
