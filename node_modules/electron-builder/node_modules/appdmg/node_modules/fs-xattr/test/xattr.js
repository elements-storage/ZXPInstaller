
var xattr = require('../');

var fs = require('fs');
var temp = require('fs-temp');
var assert = require('assert');
var crypto = require('crypto');

var attribute = 'com.linusu.test';
var payload = crypto.randomBytes(24).toString('hex');

describe('xattr#sync', function () {

  var path;

  before(function () {
    path = temp.writeFileSync('');
  });

  it('should set an attribute', function () {
    xattr.setSync(path, attribute, payload);
  });

  it('should get an attribute', function () {
    var val = xattr.getSync(path, attribute);
    assert(Buffer.isBuffer(val));
    assert.equal(val, payload);
  });

  it('should list the attributes', function () {
    var val = xattr.listSync(path);
    assert.ok(~val.indexOf(attribute));
  });

  it('should remove the attribute', function () {
    xattr.removeSync(path, attribute);
  });

  it('should give useful errors', function () {
    assert.throws(function () {
      xattr.getSync(path, attribute);
    }, function (err) {
      assert.equal(err.errno, 93);
      assert.equal(err.code, "ENOATTR");
      return true;
    });
  });

  after(function (done) {
    fs.unlink(path, done);
  });

});

describe('xattr#async', function () {

  var path;

  before(function () {
    path = temp.writeFileSync('');
  });

  it('should set an attribute', function (done) {
    xattr.set(path, attribute, payload, done);
  });

  it('should get an attribute', function (done) {
    xattr.get(path, attribute, function (err, val) {
      if (err) { throw err; }
      assert(Buffer.isBuffer(val));
      assert.equal(val, payload);
      done();
    });
  });

  it('should list the attributes', function (done) {
    xattr.list(path, function (err, list) {
      if (err) { throw err; }
      assert.ok(~list.indexOf(attribute));
      done();
    });
  });

  it('should remove the attribute', function (done) {
    xattr.remove(path, attribute, done);
  });

  it('should give useful errors', function (done) {
    xattr.get(path, attribute, function (err, val) {
      assert(err);
      assert.equal(err.errno, 93);
      assert.equal(err.code, "ENOATTR");
      assert.equal(val, undefined);
      done();
    });
  });

  after(function (done) {
    fs.unlink(path, done);
  });

});

describe('xattr#utf8', function () {

  var path;

  before(function () {
    path = temp.template('∞ %s').writeFileSync('');
  });

  it('should set an attribute', function (done) {
    xattr.set(path, attribute, payload, done);
  });

  it('should get an attribute', function (done) {
    xattr.get(path, attribute, function (err, val) {
      if (err) { throw err; }
      assert(Buffer.isBuffer(val));
      assert.equal(val, payload);
      done();
    });
  });

  it('should list the attributes', function (done) {
    xattr.list(path, function (err, list) {
      if (err) { throw err; }
      assert.ok(~list.indexOf(attribute));
      done();
    });
  });

  it('should remove the attribute', function (done) {
    xattr.remove(path, attribute, done);
  });

  it('should give useful errors', function (done) {
    xattr.get(path, attribute, function (err, val) {
      assert(err);
      assert.equal(err.errno, 93);
      assert.equal(err.code, "ENOATTR");
      assert.equal(val, undefined);
      done();
    });
  });

  after(function (done) {
    fs.unlink(path, done);
  });

});
