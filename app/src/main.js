global.$ = $;

global.View = function() {
  var body = document.body;
  var view = document.getElementById('main-view');
  var installer = global.installer();

  var msgDragToInstall = 'Drag a ZXP file here to install it.';
  var msgDropToInstall = 'Drop your file here to install it.';
  var msgInstalling = 'Installing your extension.';
  var msgInstalled = 'Your extension has been installed. Please restart Photoshop.';
  this.zxpPath;

  _this = this;

  var updateStatus = function(msg) {
    $(body).find('.status').html(msg);
  }

  var toggleSpinner = function(state) {
    $(body).toggleClass('is-showing-spinner', state)
  };

  var toggleSuccess = function(state) {
    $(body).toggleClass('was-successful', state)
  };

  var install = function() {
    var promise = installer.install(_this.zxpPath);
    startInstalling();
    promise.then(function(result) {
      installationSuccess();
    }, function(err) {
      installationFailed(err);
    });

  }

  var startInstalling = function(){
    updateStatus(msgInstalling);
    toggleSpinner(true);
  }

  var installationFailed = function(error) {
    var errors = {
      175: 'Installation failed because you do not have administrator access.',
      201: 'Installation failed because the extension invalid.',
      411: 'Installation failed because the extension is not compatible with the installed applications.',
      407: 'Installation failed because this extension requires another extension.',
      408: 'Installation failed because this extension requires another extension.',
      412: 'Installation failed because an extension of the same name exists.',
      418: 'Installation failed because a newer version of the extension is installed.',
      456: 'Installation failed because Adobe applications are running',
      458: 'Installation failed because none of the required applications are installed',
      459: 'Installation failed because the extension is not compatible with the installed applications.'
    };

    toggleSpinner(false);
    updateStatus(errors[error] || 'Error: ' + error);
  }

  var installationSuccess = function() {
    toggleSpinner(false);
    toggleSuccess(true);
    updateStatus(msgInstalled);
  }

  // PUBLIC

  this.init = function() {

    document.ondragover = function () {
      $(body).addClass('hover');
      return false;
    };

    document.ondragleave = document.ondragend = function () {
      $(body).removeClass('hover');
      return false;
    };

    document.ondrop = function (e) {
      $(body).removeClass('hover');
      e.preventDefault();
      var file = e.dataTransfer.files[0];
      console.log('detected:',file.path);
      _this.zxpPath = file.path
      install();
      return false;
    };

    updateStatus(msgDragToInstall);
  }

}

$(document).ready(function() {
  var _view = new View();
  _view.init();
});
