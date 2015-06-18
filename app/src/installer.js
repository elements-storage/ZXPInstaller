var platform = require("os").platform;
var install_process = require("child_process");
var path = require('path');

global.installer = function() {

  var RELEASE = 'zxp/release.zxp'

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
    install: function() {

      console.log("using target path of " + target_path());
      console.log("startig to install ZXP from path " + path.join(__dirname, RELEASE));

      return promise = new Promise(function(resolve, reject) {
        var spawn = install_process.spawn(path.join(__dirname, target_path()), ["--install", path.join(__dirname, RELEASE)]);

        // AEM only prints out if something went wrong. Adobe - go figure
        spawn.stdout.on('data',function(data){
            console.log("stdout " + data.toString());
            reject(data.toString());
        });

        // code 0 => success
        spawn.on('exit',function(code){
            if(code == 0) {resolve()}
        });

      });


    }
  }
};
