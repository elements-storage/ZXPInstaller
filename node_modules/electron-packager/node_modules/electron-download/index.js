var os = require('os')
var path = require('path')
var pathExists = require('path-exists')
var mkdir = require('mkdirp')
var nugget = require('nugget')
var homePath = require('home-path')
var mv = require('mv')

module.exports = function download (opts, cb) {
  var platform = opts.platform || os.platform()
  var arch = opts.arch || os.arch()
  var version = opts.version
  if (!version) return cb(new Error('must specify version'))
  var filename = 'electron-v' + version + '-' + platform + '-' + arch + '.zip'
  var url = process.env.ELECTRON_MIRROR || 'https://github.com/atom/electron/releases/download/v'
  url += version + '/electron-v' + version + '-' + platform + '-' + arch + '.zip'
  var homeDir = homePath()
  var cache = opts.cache || path.join(homeDir, './.electron')

  var cachedZip = path.join(cache, filename)
  pathExists(cachedZip, function (err, exists) {
    if (err) return cb(err)
    if (exists) return cb(null, cachedZip)
    // otherwise download it
    mkCacheDir(function (err, actualCache) {
      if (err) return cb(err)
      cachedZip = path.join(actualCache, filename) // in case cache dir changed
      // download to tmpdir
      var tmpdir = path.join(os.tmpdir(), 'electron-tmp-download')
      mkdir(tmpdir, function (err) {
        if (err) return cb(err)
        nugget(url, {target: filename, dir: tmpdir, resume: true, verbose: true}, function (err) {
          if (err) return cb(err)
          // when dl is done then put in cache
          mv(path.join(tmpdir, filename), cachedZip, function (err) {
            if (err) return cb(err)
            cb(null, cachedZip)
          })
        })
      })
    })
  })

  function mkCacheDir (cb) {
    mkdir(cache, function (err) {
      if (err) {
        if (err.code !== 'EACCES') return cb(err)
        // try local folder if homedir is off limits (e.g. some linuxes return '/' as homedir)
        var localCache = path.resolve('./.electron')
        return mkdir(localCache, function (err) {
          if (err) return cb(err)
          cb(null, localCache)
        })
      }
      cb(null, cache)
    })
  }
}
