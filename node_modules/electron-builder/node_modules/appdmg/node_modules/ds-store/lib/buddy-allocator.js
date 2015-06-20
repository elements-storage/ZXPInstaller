
var assert = require('assert');

function BuddyAllocator() {

  this.offsets = new Array();
  this.freelist = new Array(32);

  for (var i = 0; i < 32; i++) {
    this.freelist[i] = [];
  }

  this.freelist[31].push(0);

  var head = this._alloc(5);
  assert(head === 0);

};

BuddyAllocator.prototype._alloc = function (width) {
  assert(width < 32);

  var list = this.freelist[width];

  if (list.length > 0) {
    // There is a block of the desired size; return it.

    return list.shift();
  } else {
    // Allocate a block of the next larger size; split
    // it and put the other half on the free list.

    var offset = this._alloc(width + 1);
    var buddy = offset ^ Math.pow(2, width);

    this._free(buddy, width);
    return offset;
  }

};

BuddyAllocator.prototype._free = function (offset, width) {

  var list = this.freelist[width];
  var buddy = offset ^ Math.pow(2, width);

  var idx = list.indexOf(buddy);

  if (~idx) {
    // Our buddy is free. Coalesce, and
    // add the coalesced block to freelist.

    list.splice(idx, 1);
    this._free(offset & buddy, width + 1);

  } else {
    // Add this block to the freelist

    list.push(offset);
    // FIXME: maybe sort the list as well

  }

};

BuddyAllocator.prototype.allocate = function (bytes, blocknum) {

  if (blocknum === undefined) {
    blocknum = 1;
    while (this.offsets[blocknum] !== undefined) {
      blocknum += 1;
    }
  }

  var wantwidth = 5;
  while (bytes > (1 << wantwidth)) {
    wantwidth += 1;
  }

  var blockaddr, blockwidth, blockoffset;
  if (this.offsets[blocknum]) {
    blockaddr = this.offsets[blocknum];
    blockwidth = blockaddr & 0x1F;
    blockoffset = blockaddr & ~0x1F;
    if (blockwidth === wantwidth) {
      return blocknum;
    } else {
      this._free(blockoffset, blockwidth);
      delete this.offsets[blocknum];
    }
  }

  blockoffset = this._alloc(wantwidth);
  blockaddr = blockoffset | wantwidth;
  this.offsets[blocknum] = blockaddr;

  return blocknum;
};

module.exports = exports = BuddyAllocator;
