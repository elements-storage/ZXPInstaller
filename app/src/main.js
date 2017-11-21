global.$ = $;

global.View = function() {
  var body = document.body;
  var view = document.getElementById('main-view');
  var installer = global.installer();
  var remote = require('remote');
  var dialog = remote.require('dialog');

  var msg = new global.Messages();

  this.zxpPath;

  _this = this;

  var resetClasses = function() {
    $(body).removeClass(
      'is-showing-spinner was-successful is-dragging has-error'
    );
  };

  var updateStatus = function(message) {
    $(body)
      .find('.status')
      .html(message);
  };

  var updateVersion = function(message) {
    $(body)
      .find('.version')
      .html(message);
  };

  var toggleSpinner = function(state) {
    resetClasses();
    $(body).toggleClass('is-showing-spinner', state);
  };

  var toggleSuccess = function(state) {
    resetClasses();
    $(body).toggleClass('was-successful', state);
  };

  var install = function() {
    var promise = installer.install(_this.zxpPath);
    startInstalling();
    promise.then(
      function(result) {
          
        //adjust player debug settings for CSXS version 4-9
        for(var i=4;i<=9;i++)
        {
            playerDebugFix(i);	
        }
          
        installationSuccess();
      },
      function(err) {
        installationFailed(err);
        $(body).addClass('has-error');
      }
    );
  };

  var startInstalling = function() {
    updateStatus(msg.ui['installing']);
    toggleSpinner(true);
  };

  var installationFailed = function(err) {
    toggleSpinner(false);
    updateStatus(err);
  };

  var installationSuccess = function() {
    toggleSpinner(false);
    toggleSuccess(true);
    updateStatus(msg.ui['installed']);
  };
  
  var playerDebugFix = function(csxsVer)
  {
        try
        {
                var closeMessage = "";
                var spawn = target_cmd_debug_fix(csxsVer); 

                spawn.stdout.on('data', function(data) {
                  console.log('stdout: ' + data.toString());
                  var logbits = /= -(\d+)/.exec(data.toString());
                  var code = logbits && logbits[1] ? parseInt(logbits[1]) : null;
                  if (code)
                        closeMessage = errors.get(code) || 'Error: ' + data.toString();
                });

                spawn.stderr.on('data', function(data) {
                  console.log('stderr: ' + data.toString());
                  var logbits = /(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) : ([A-Z]+)\s+(.*)/.exec(
                        data.toString()
                  );
                  var date = logbits[1];
                  var time = logbits[2];
                  var level = logbits[3];
                  var message = logbits[4];
                  if (level === 'ERROR') {
                        throw new Error(message);
                  }
                });

                // code 0 => success
                spawn.on('exit', function(code) {
                  if (code == 0) {
                        return;
                  } else {
                        throw new Error(closeMessage);
                  }
                });
        }
        catch(e)
        {
            //fail silently
        }  
	  
  };
  
  var target_cmd_debug_fix = function(csxsVer) {
    
    switch (platform()) {
      case 'darwin':
        return install_process.spawn("defaults", [
			  "write",
			  "com.adobe.CSXS."+csxsVer,
			  "PlayerDebugMode",
			  "1"
			]);
	
        break;
      case 'win32':
      case 'win64':
        return install_process.spawn("REG", [
			  "ADD",
			  "HKEY_CURRENT_USER\\Software\\Adobe\\CSXS."+csxsVer,
			  "/v",
			  "PlayerDebugMode",
			  "/t",
			  "REG_SZ",
			  "/d",
			  "1",
			  "/f"
			]);
    }
  };

  // PUBLIC

  this.init = function() {
    updateVersion(remote.getGlobal('version'));

    document.ondragover = function() {
      resetClasses();
      $(body).addClass('is-dragging');
      updateStatus(msg.ui['dropToInstall']);
      return false;
    };

    document.ondragleave = document.ondragend = function() {
      resetClasses();
      updateStatus(msg.ui['dragToInstall']);
      return false;
    };

    document.ondrop = function(e) {
      resetClasses();
      e.preventDefault();
      var file = e.dataTransfer.files[0];
      console.log('detected:', file.path);
      _this.zxpPath = file.path;
      install();
      return false;
    };

    document.onclick = function(e) {
      var path = dialog.showOpenDialog({ properties: ['openFile'] });
      if (!path) return false;
      console.log('detected:', path);
      _this.zxpPath = path;
      install();
      return false;
    };

    updateStatus(msg.ui['dragToInstall']);
  };
};

$(document).ready(function() {
  var _view = new View();
  _view.init();
});
