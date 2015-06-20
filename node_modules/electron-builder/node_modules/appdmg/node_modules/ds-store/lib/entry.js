
var tn1150 = require('./tn1150');
var bplist = require('bplist-creator');

var utf16be = function (str) {
  var b = new Buffer(str, 'ucs2');
  for (var i = 0; i < b.length; i += 2) {
    var a = b[i];
    b[i] = b[i+1];
    b[i+1] = a;
  }
  return b;
};

function Entry(filename, structureId, dataType, blob) {

  this.filename = tn1150.normalize(filename);
  this.structureId = structureId;

  var filenameLength = this.filename.length;
  var filenameBytes = filenameLength * 2;

  this.buffer = new Buffer(4 + filenameBytes + 4 + 4 + blob.length);

  this.buffer.writeUInt32BE(filenameLength, 0);
  utf16be(this.filename).copy(this.buffer, 4);
  this.buffer.write(structureId, 4 + filenameBytes, 'ascii');
  this.buffer.write(dataType, 8 + filenameBytes, 'ascii');

  blob.copy(this.buffer, 12 + filenameBytes);

};

Entry.prototype.length = function () {
  return this.buffer.length();
};

Entry.sort = function (a, b) {
  var s1 = tn1150.compare(a.filename, b.filename);
  var s2 = a.structureId.localeCompare(b.structureId);
  return s1 || s2;
};

Entry.construct = function (filename, structureId, opts) {

  var dataType, blob;

  var opt = function (key, def) {
    if (key in opts) {
      return opts[key];
    } else if (def === undefined) {
      throw new TypeError('Missing option: ' + key);
    } else {
      return def;
    }
  };

  switch (structureId) {
    case 'BKGD':
      dataType = 'blob';
      blob = new Buffer(12 + 4);
      blob.writeUInt32BE(blob.length - 4, 0);

      if (opts.color) {
        blob.write('ClrB', 4, 'ascii');
        throw new Error('Not implemented');
      } else if (opts.pictureByteLength) {
        blob.write('PctB', 4, 'ascii');
        blob.writeUInt32BE(opts.pictureByteLength, 8);
      } else {
        blob.write('DefB', 4, 'ascii');
      }

      break;
    case 'Iloc':
      dataType = 'blob';
      blob = new Buffer(16 + 4);
      blob.writeUInt32BE(blob.length - 4, 0);

      blob.writeUInt32BE(opts.x, 4);
      blob.writeUInt32BE(opts.y, 8);

      blob.write('FFFFFF00', 12, 'hex');

      break;
    case 'fwi0':

      throw new Error('Deprecated: Use `bwsp` (I think this is for old OS X)');

      dataType = 'blob';
      blob = new Buffer(16 + 4);
      blob.writeUInt32BE(blob.length - 4, 0);

      blob.writeUInt16BE(opts.top, 4);
      blob.writeUInt16BE(opts.left, 6);
      blob.writeUInt16BE(opts.bottom, 8);
      blob.writeUInt16BE(opts.right, 10);

      blob.write(opts.view || 'icnv', 12, 'ascii');
      blob.write('00000000', 16, 'hex');

      break;
    case 'pict':

      // Create an alias with `opts.picturePath`

      throw new Error('Not implemented');

      break;
    case 'bwsp':

      dataType = 'bplist';
      blob = bplist({
         ContainerShowSidebar: true,
         ShowPathbar: false,
         ShowSidebar: true,
         ShowStatusBar: false,
         ShowTabView: false,
         ShowToolbar: false,
         SidebarWidth: 0,
         WindowBounds:
          '{{' + opt('x') + ', ' + opt('y') + '},' +
          ' {' + opt('width') + ', ' +  opt('height') + '}}'
      });

      break;
    case 'icvp':

      // var color;
      // var imageFile = opt('background', null);

      // if (imageFile === null) {
      //   color = [new bplist.Real(1), new bplist.Real(0), new bplist.Real(0)]; // RED
      // } else {
      //   color = [new bplist.Real(1), new bplist.Real(1), new bplist.Real(1)];
      //   throw new Error('Not implemented');
      // }

      dataType = 'bplist';
      blob = bplist({
        backgroundType: 2, //( imageFile === null ? 1 : 2 ),
        backgroundImageAlias: opt('rawAlias'),
        backgroundColorRed: new bplist.Real(1),
        backgroundColorGreen: new bplist.Real(1),
        backgroundColorBlue: new bplist.Real(1),
        showIconPreview: true,
        showItemInfo: false,
        textSize: new bplist.Real(12),
        iconSize: new bplist.Real(opt('iconSize')) ,
        viewOptionsVersion: 1,
        gridSpacing: new bplist.Real(100),
        gridOffsetX: new bplist.Real(0),
        gridOffsetY: new bplist.Real(0),
        labelOnBottom: true,
        arrangeBy: "none"
      });

      break;
    case 'vSrn':

      dataType = 'long'
      blob = new Buffer(4);

      blob.writeUInt32BE(opt('value'), 0);

      break;
    default:
      throw new Error('Not implemented');
  }

  if (dataType === 'bplist') {

    dataType = 'blob';
    var buf = blob;

    blob = new Buffer(buf.length + 4);
    blob.writeUInt32BE(buf.length, 0);
    buf.copy(blob, 4);

  }

  return new Entry(filename, structureId, dataType, blob);
};

module.exports = exports = Entry;
