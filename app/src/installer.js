var platform = require("os").platform;
var install_process = require("child_process");
var path = require('path');
var errors = (new global.Messages()).errors

global.installer = function() {

  var RELEASE = 'zxp/release.zxp'
  var CMD_PREFIX = (platform() == "darwin") ? "--" : "/"

  var target_path = function() {
    var pathToBin
    switch (platform()) {
          case "darwin":
            pathToBin = "bin/OSX/Contents/MacOS/ExManCmd";
            break;
          case "win32":
            pathToBin = "bin/WINDOWS/ExManCmd.exe";
          case "win64":
            pathToBin = "bin/WINDOWS/ExManCmd.exe";
        }
    return pathToBin;
  }


  return {
    install: function(zxpPath) {

      console.log("using target path of " + target_path());
      console.log("starting to install ZXP from path " + zxpPath);

      return promise = new Promise(function(resolve, reject) {
        var spawn = install_process.spawn(path.join(__dirname, target_path()), [CMD_PREFIX+"install", zxpPath]);

        spawn.stdout.on('data',function(data){
            console.log('stdout: ' + data.toString());
            var logbits = /-(\d+)/.exec(data.toString());
            var code = logbits && logbits[1] ? parseInt(logbits[1]) : null;
            reject(errors.get(code) || 'Error: ' + data.toString());
        });

        spawn.stderr.on('data',function(data){
            console.log('stderr: ' + data.toString());
            var logbits = /(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) : ([A-Z]+)\s+(.*)/.exec(data.toString());
            var date    = logbits[1];
            var time    = logbits[2];
            var level   = logbits[3];
            var message = logbits[4];
            if (level === 'ERROR') {reject(message);}
        });

        // code 0 => success
        spawn.on('exit',function(code){
            if(code == 0) {resolve()}
        });

      });


    }
  }
};
