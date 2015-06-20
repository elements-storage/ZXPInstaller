
var fs = require('fs');
var assert = require('assert');

var partition = require('./partition');
var Entry = require('./entry');
// var BuddyAllocator = require('./buddy-allocator');

function DSStore() {

  this.entries = [];
  // this.store = new BuddyAllocator();

}

DSStore.prototype.push = function (entry) {
  this.entries.push(entry);
};

DSStore.prototype._header = function (offset, size) {

  var header = new Buffer(32);

  // header.writeUInt32BE(1, 0); Appears before header, eg. not part of it
  header.write('Bud1', 0, 'ascii');

  header.writeUInt32BE(offset, 4);
  header.writeUInt32BE(size, 8);
  header.writeUInt32BE(offset, 12);

  header.writeUInt32BE(0x100C, 16);
  header.writeUInt32BE(0x0000, 20); // 0x0087
  header.writeUInt32BE(0x0000, 24); // 0x200B
  header.writeUInt32BE(0x0000, 28);

  return header;
}

DSStore.prototype._entries = function () {

  var tocblock, pagesize = 0x1000;

  if ('DSDB' in this.store.toc) {
    throw new Error('Not implemented');
  }

  tocblock = this.store.allocate(20);
  this.store.toc['DSDB'] = tocblock;

  var pagecount, reccount, height, children;

  reccount = this.entries.length;
  pagecount = 0;
  height = 0;
  children = [];

  do {

    var sizes;

    if (children.length > 0) {
      sizes = this.entries.map(function (e) { return 4 + e.length(); });
    } else {
      sizes = this.entries.map(function (e) { return e.length(); });
    }

    var interleaf = partition.sizes(pagesize - 8, sizes);
    var nchildren = [];
    var next = 0;

    throw new Error('Not implemented');

  } while (children.length > 1);

};

// sub putDSDBEntries {
//     my(@children);

//     # Partition the records into btree nodes, from the bottom of
//     # the tree working towards the root.
//     do {
//         my(@sizes);

//         if (@children) {
//             # Interior node: child pointers interleaved with records
//             @sizes = map { 4 + $_->byteSize } @$recs;
//         } else {
//             # Leaf node: just a bunch of records
//             @sizes = map { $_->byteSize } @$recs;
//         }

//         # In addition to @sizes, each page contains a record
//         # count and a flag/childnode field (4 bytes each)
//         my(@interleaf) = &partition_sizes($pagesize - 8, @sizes);
//         my(@nchildren);

//         my($next) = 0;
//         foreach my $non (@interleaf, 1+$#$recs) {
//             my($blknr) = $file->allocate($pagesize);
//             push(@nchildren, $blknr);
//             my($blk) = $file->blockByNumber($blknr, 1);
//             if (@children) {
//                 &writeBTreeNode($blk,
//                                 [ @$recs[ $next .. $non-1 ] ],
//                                 [ @children[ $next .. $non ] ] );
//             } else {
//                 &writeBTreeNode($blk,
//                                 [ @$recs[ $next .. $non-1 ] ]);
//             }
//             $blk->close(1);
//             $next = $non + 1;
//             $pagecount ++;
//         }

//         $height ++;
//         $recs = [ map { $recs->[$_] } @interleaf ];
//         @children = @nchildren;
//         die unless @children == 1+@$recs;
//     } while(@children > 1);
//     die unless 0 == @$recs;

//     my($masterblock) = $file->blockByNumber($tocblock, 1);
//     $masterblock->write('NNNNN',
//                         $children[0],
//                         $height - 1,
//                         $reccount,
//                         $pagecount,
//                         $pagesize);
//     $masterblock->close;

//     1;
// }

DSStore.prototype.__REAL__write = function (path) {

  var store = new Buffer(15360);
  var offset = 8192;
  var size = 2048;
  var currentPos = 0;

  store.fill(0);

  this._header(offset, size).copy(store, currentPos);
  currentPos += 32;

  var blockAddresses = [
    0x0000200B,
    0x00000045,
    0x0000100C
  ];

  currentPos = offset;
  store.writeUInt32BE(blockAddresses.length, currentPos);
  store.writeUInt32BE(0, currentPos + 4);

  currentPos += 8;

  store.fill(0, currentPos, currentPos + (256 * 4));

  blockAddresses.forEach(function (e, i) {
    store.writeUInt32BE(e, currentPos + (i * 4));
  });

  currentPos += (256 * 4);

  var directoryEntries = [
    'DSDB'
  ];

  store.writeUInt32BE(directoryEntries.length, currentPos);
  currentPos += 4;

  directoryEntries.forEach(function (e, i) {
    var b = new Buffer(e, 'ascii');
    store.writeUInt8(b.length, currentPos);
    b.copy(store, currentPos + 1);
    store.writeUInt32BE(i + 1, currentPos + 1 + b.length);
    currentPos += 1 + b.length + 4;
  });

  var freeList = [
    [],
    [],
    [],
    [],
    [],
    [32, 96],
    [],
    [128],
    [256],
    [512],
    [1024],
    [2048, 10240],
    [12288],
    [],
    [16384],
    [32768],
    [65536],
    [131072],
    [262144],
    [524288],
    [1048576],
    [2097152],
    [4194304],
    [8388608],
    [16777216],
    [33554432],
    [67108864],
    [134217728],
    [268435456],
    [536870912],
    [1073741824],
    []
  ];

  assert(freeList.length === 32);
  assert(freeList[31].length === 0);

  freeList.forEach(function (e) {
    store.writeUInt32BE(e.length, currentPos);
    e.forEach(function (e, i) {
      store.writeUInt32BE(e, currentPos + 4 + (i * 4))
    });
    currentPos += 4 + (e.length * 4);
  });

  /*
   * Maybe jump to blockAddresses[0] (+- 4/8 bytes) and write something like:
   *
   *  00 00 20 0B
   *  00 00 00 45
   *  00 00 10 0C
   *  00 00 00 00
   *
   */

  // <No fucking idea>

  var entries = this.entries.sort(Entry.sort);

  // should have something to do with blockAddresses[2]
  [4096].forEach(function (e) {
    currentPos = e;

    var P = 0;
    var count = entries.length;

    store.writeUInt32BE(P, currentPos);
    store.writeUInt32BE(count, currentPos + 4);
    currentPos += 8;

    entries.forEach(function (e, i) {
      e.buffer.copy(store, currentPos);
      currentPos += e.buffer.length;
    });

  });






  // </No fucking idea>

  var out = fs.createWriteStream(path);

  out.write(new Buffer('00000001', 'hex'));
  out.write(store);

  out.end();

};

DSStore.prototype.write = function (path, cb) {

  var entries = this.entries.sort(Entry.sort);

  fs.readFile(__dirname + '/../assets/DSStore-clean', function (err, buf) {
    if (err) {
      cb(err);
    } else {

      var modified = new Buffer(3840);

      modified.fill(0);

      var currentPos = 0;

      var P = 0;
      var count = entries.length;

      modified.writeUInt32BE(P, currentPos);
      modified.writeUInt32BE(count, currentPos + 4);
      currentPos += 8;

      entries.forEach(function (e, i) {
        var b = e.buffer;
        b.copy(modified, currentPos);
        currentPos += b.length;
      });

      buf.writeUInt32BE(entries.length, 76);
      modified.copy(buf, 4100);

      fs.writeFile(path, buf, function (err) {
        cb(err);
      });

    }
  });

};

module.exports = exports = DSStore;
