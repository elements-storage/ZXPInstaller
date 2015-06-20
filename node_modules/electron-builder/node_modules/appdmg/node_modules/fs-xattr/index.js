
var addon = require('./build/Release/xattr');

var fakeAsync = function (fn, args, cb) {
  process.nextTick(function () {
    try {
      cb(null, addon[fn].apply(addon, args));
    } catch (err) {
      cb(err);
    }
  });
};

var validateArgument = function (key, val) {
  switch (key) {
    case 'path':
      if (typeof val !== 'string') {
        throw new TypeError('`' + key + '` must be a string');
      }
      return new Buffer(val).toString('binary');
    case 'attr':
      if (typeof val !== 'string') {
        throw new TypeError('`' + key + '` must be a string');
      }
      return val;
    case 'value':
      if (typeof val === 'string') {
        return new Buffer(val);
      }

      if (!Buffer.isBuffer(val)) {
        throw new TypeError('`value` must be a string or buffer');
      }

      return val;
    case 'cb':
      if (typeof val !== 'function') {
        return function (err) { if (err) { throw err; } };
      }
      return val;
    default:
      throw new Error('Unknown argument: ' + key);
  }
};

/* Async methods */

exports.get = function (path, attr, cb) {
  path = validateArgument('path', path);
  attr = validateArgument('attr', attr);
  cb = validateArgument('cb', cb);

  fakeAsync('get', [path, attr], cb);
};

exports.set = function (path, attr, value, cb) {
  path = validateArgument('path', path);
  attr = validateArgument('attr', attr);
  value = validateArgument('value', value);
  cb = validateArgument('cb', cb);

  fakeAsync('set', [path, attr, value], cb);
};

exports.list = function (path, cb) {
  path = validateArgument('path', path);
  cb = validateArgument('cb', cb);

  fakeAsync('list', [path], cb);
};

exports.remove = function (path, attr, cb) {
  path = validateArgument('path', path);
  attr = validateArgument('attr', attr);
  cb = validateArgument('cb', cb);

  fakeAsync('remove', [path, attr], cb);
};

/* Sync methods */

exports.getSync = function (path, attr) {
  path = validateArgument('path', path);
  attr = validateArgument('attr', attr);

  return addon.get(path, attr);
};

exports.setSync = function (path, attr, value) {
  path = validateArgument('path', path);
  attr = validateArgument('attr', attr);
  value = validateArgument('value', value);

  return addon.set(path, attr, value);
};

exports.listSync = function (path) {
  path = validateArgument('path', path);

  return addon.list(path);
};

exports.removeSync = function (path, attr) {
  path = validateArgument('path', path);
  attr = validateArgument('attr', attr);

  return addon.remove(path, attr);
};
