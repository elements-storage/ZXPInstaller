
var assert = require('assert');
var alias = require('macos-alias');

var Entry = require('./lib/entry');
var DSStore = require('./lib/ds-store');

function Helper() {
  this.file = new DSStore();
  this.opts = {
    window: { x: 100, y: 100 }
  };
};

Helper.prototype.setBackground = function (path) {
  this.opts.backgroundPath = path;
};

Helper.prototype.setIconSize = function (size) {
  this.opts.iconSize = size;
};

Helper.prototype.setIconPos = function (name, x, y) {
  this.file.push(Entry.construct(name, 'Iloc', { x: x, y: y }));
};

Helper.prototype.setWindowPos = function (x, y) {
  this.opts.window.x = x;
  this.opts.window.y = y;
};

Helper.prototype.setWindowSize = function (w, h) {
  this.opts.window.width = w;
  this.opts.window.height = h + 22;
};

Helper.prototype.vSrn = function (value) {
  assert(value === 0 || value === 1);
  this.file.push(Entry.construct('.', 'vSrn', { value: value }));
};

Helper.prototype.write = function (path, cb) {

  var rawAlias = alias.create(this.opts.backgroundPath);

  this.file.push(Entry.construct('.', 'bwsp', this.opts.window));
  this.file.push(Entry.construct('.', 'icvp', { iconSize: this.opts.iconSize, rawAlias: rawAlias }));

  this.file.write(path, cb);
};

module.exports = exports = Helper;
