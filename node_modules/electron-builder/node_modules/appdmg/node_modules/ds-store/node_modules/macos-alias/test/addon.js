
var assert = require('assert');
var addon = require('../build/Release/volume.node');

describe('addon', function () {
  it('should find the volume name of /', function () {

    assert.equal(addon.getVolumeName('/'), 'Macintosh HD');

  });
});
