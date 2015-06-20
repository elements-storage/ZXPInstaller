
/*
 * See:
 *  https://developer.apple.com/legacy/library/technotes/tn/tn1150.html
 *  http://search.cpan.org/~wiml/Mac-Finder-DSStore/DSStoreFormat.pod
 *
 * "My [wiml] guess is that the string comparison follows the same rules as
 * HFS+ described in Apple's TN1150."
 *
 * TN1150 contains a FastUnicodeCompare routine defined as the "HFS Plus
 * case-insensitive string comparison algorithm".
 *
 * TN1150 specifies that "Unicode strings will be stored in fully decomposed
 * form, with composing characters stored in canonical order".
 *
 */

var unorm = require('unorm');

function generateLowerCaseTable () {
  var lowerCaseTable = [];

  lowerCaseTable[0x0000] = 0xFFFF;
  for (var i = 0x0041; i <= 0x005A; i++) {
    lowerCaseTable[i] = i + 0x0020;
  }
  lowerCaseTable[0x00C6] = 0x00E6;
  lowerCaseTable[0x00D0] = 0x00F0;
  lowerCaseTable[0x00D8] = 0x00F8;
  lowerCaseTable[0x00DE] = 0x00FE;
  lowerCaseTable[0x0110] = 0x0111;
  lowerCaseTable[0x0126] = 0x0127;
  lowerCaseTable[0x0132] = 0x0133;
  lowerCaseTable[0x013F] = 0x0140;
  lowerCaseTable[0x0141] = 0x0142;
  lowerCaseTable[0x014A] = 0x014B;
  lowerCaseTable[0x0152] = 0x0153;
  lowerCaseTable[0x0166] = 0x0167;
  lowerCaseTable[0x0181] = 0x0253;
  lowerCaseTable[0x0182] = 0x0183;
  lowerCaseTable[0x0184] = 0x0185;
  lowerCaseTable[0x0186] = 0x0254;
  lowerCaseTable[0x0187] = 0x0188;
  lowerCaseTable[0x0189] = 0x0256;
  lowerCaseTable[0x018A] = 0x0257;
  lowerCaseTable[0x018B] = 0x018C;
  lowerCaseTable[0x018E] = 0x01DD;
  lowerCaseTable[0x018F] = 0x0259;
  lowerCaseTable[0x0190] = 0x025B;
  lowerCaseTable[0x0191] = 0x0192;
  lowerCaseTable[0x0193] = 0x0260;
  lowerCaseTable[0x0194] = 0x0263;
  lowerCaseTable[0x0196] = 0x0269;
  lowerCaseTable[0x0197] = 0x0268;
  lowerCaseTable[0x0198] = 0x0199;
  lowerCaseTable[0x019C] = 0x026F;
  lowerCaseTable[0x019D] = 0x0272;
  lowerCaseTable[0x019F] = 0x0275;
  lowerCaseTable[0x01A2] = 0x01A3;
  lowerCaseTable[0x01A4] = 0x01A5;
  lowerCaseTable[0x01A7] = 0x01A8;
  lowerCaseTable[0x01A9] = 0x0283;
  lowerCaseTable[0x01AC] = 0x01AD;
  lowerCaseTable[0x01AE] = 0x0288;
  lowerCaseTable[0x01B1] = 0x028A;
  lowerCaseTable[0x01B2] = 0x028B;
  lowerCaseTable[0x01B3] = 0x01B4;
  lowerCaseTable[0x01B5] = 0x01B6;
  lowerCaseTable[0x01B7] = 0x0292;
  lowerCaseTable[0x01B8] = 0x01B9;
  lowerCaseTable[0x01BC] = 0x01BD;
  lowerCaseTable[0x01C4] = 0x01C6;
  lowerCaseTable[0x01C5] = 0x01C6;
  lowerCaseTable[0x01C7] = 0x01C9;
  lowerCaseTable[0x01C8] = 0x01C9;
  lowerCaseTable[0x01CA] = 0x01CC;
  lowerCaseTable[0x01CB] = 0x01CC;
  lowerCaseTable[0x01E4] = 0x01E5;
  lowerCaseTable[0x01F1] = 0x01F3;
  lowerCaseTable[0x01F2] = 0x01F3;
  for (var i = 0x0391; i <= 0x03A1; i++) {
    lowerCaseTable[i] = i + 0x0020;
  }
  for (var i = 0x03A3; i <= 0x03A9; i++) {
    lowerCaseTable[i] = i + 0x0020;
  }
  lowerCaseTable[0x03E2] = 0x03E3;
  lowerCaseTable[0x03E4] = 0x03E5;
  lowerCaseTable[0x03E6] = 0x03E7;
  lowerCaseTable[0x03E8] = 0x03E9;
  lowerCaseTable[0x03EA] = 0x03EB;
  lowerCaseTable[0x03EC] = 0x03ED;
  lowerCaseTable[0x03EE] = 0x03EF;
  lowerCaseTable[0x0402] = 0x0452;
  lowerCaseTable[0x0404] = 0x0454;
  lowerCaseTable[0x0405] = 0x0455;
  lowerCaseTable[0x0406] = 0x0456;
  lowerCaseTable[0x0408] = 0x0458;
  lowerCaseTable[0x0409] = 0x0459;
  lowerCaseTable[0x040A] = 0x045A;
  lowerCaseTable[0x040B] = 0x045B;
  lowerCaseTable[0x040F] = 0x045F;
  for (var i = 0x0410; i <= 0x0418; i++) {
    lowerCaseTable[i] = i + 0x0020;
  }
  for (var i = 0x041A; i <= 0x042F; i++) {
    lowerCaseTable[i] = i + 0x0020;
  }
  for (var i = 0x0460; i <= 0x0474; i = i + 2) {
    lowerCaseTable[i] = i + 0x0001;
  }
  for (var i = 0x0478; i <= 0x0480; i = i + 2) {
    lowerCaseTable[i] = i + 0x0001;
  }
  for (var i = 0x0490; i <= 0x04BE; i = i + 2) {
    lowerCaseTable[i] = i + 0x0001;
  }
  lowerCaseTable[0x04C3] = 0x04C4;
  lowerCaseTable[0x04C7] = 0x04C8;
  lowerCaseTable[0x04CB] = 0x04CC;
  for (var i = 0x0531; i <= 0x0556; i++) {
    lowerCaseTable[i] = i + 0x0030;
  }
  for (var i = 0x10A0; i <= 0x10C5; i++) {
    lowerCaseTable[i] = i + 0x0030;
  }
  for (var i = 0x200C; i <= 0x200F; i++) {
    lowerCaseTable[i] = 0x0000;
  }
  for (var i = 0x202A; i <= 0x202E; i++) {
    lowerCaseTable[i] = 0x0000;
  }
  for (var i = 0x206A; i <= 0x206F; i++) {
    lowerCaseTable[i] = 0x0000;
  }
  for (var i = 0x2160; i <= 0x216F; i++) {
    lowerCaseTable[i] = 0x0010;
  }
  lowerCaseTable[0xFEFF] = 0x0000;
  for (var i = 0xFF21; i <= 0xFF3A; i++) {
    lowerCaseTable[i] = 0x0020;
  }

  return lowerCaseTable;
}

function HFSPlusFastUnicodeCompare (str1, str2) {
  var c1, c2, lowerCaseTable = exports.table;

  for (var i = 0; i < Math.min(str1.length, str2.length); i++) {
    c1 = str1.charCodeAt(i);
    c2 = str2.charCodeAt(i);
    if (c1 in lowerCaseTable) {
      c1 = lowerCaseTable[c1];
    }
    if (c2 in lowerCaseTable) {
      c2 = lowerCaseTable[c2];
    }
    if (c1 != c2) {
      return c1 - c2;
    }
  }

  if (str1.length != str2.length) {
    return str1.length - str2.length;
  }

  return 0;
}

function unicodeCanonicalDecomposition (str) {
  return unorm.nfd(str);
}

exports.table = generateLowerCaseTable();
exports.compare = HFSPlusFastUnicodeCompare;
exports.normalize = unicodeCanonicalDecomposition;
