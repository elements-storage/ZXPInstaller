
var assert = require('assert');

exports.sizes = function (max, sizes) {
  assert(Array.isArray(sizes));

  var sum = sizes.reduce(function (p, c) {
    return p + c;
  }, 0);

  assert(sum > max);

  var ejecta = [];
  var bcount = Math.ceil(sum, max);
  var target = sum / bcount;

  while (true) {

    var bsum = 0;
    while (n < sizes.length && bsum < target && (bsum + sizes[n]) < max) {
      bsum += sizes[n];
      n += 1;
    }

    if (n >= sizes.length) {
      break;
    }

    ejecta.push(n);
    n += 1;
  }

  return ejecta;
};
