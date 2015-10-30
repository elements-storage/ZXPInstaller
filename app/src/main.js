global.$ = $;

global.View = function() {
  var view = document.getElementById('main-view');
  var holder = document.getElementById('holder');
  var installer = global.installer();
  var spinner = new Spinner().spin()

  var msgDragToInstall = 'Drag a ZXP file here to install it.';
  var msgDropToInstall = 'Drop your file here to install it.';
  var msgInstalling = 'Installing your extension.';
  var msgInstalled = 'Your extension has been installed. Please restart Photoshop.';
  this.zxpPath;

  _this = this;

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
    $(view).find('.status').empty();
    view.appendChild(spinner.el);
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

    view.removeChild(spinner.el);
    $(view).find('.status').html(errors[error] || 'Error: ' + error);
  }

  var installationSuccess = function() {
    view.removeChild(spinner.el);
    $(view).find('.status').html("Extension installed successfully. Please restart your Adobe applications to start using your extension.");
  }

  // PUBLIC

  this.init = function() {

    document.ondragover = document.ondrop = function(e) {
      e.preventDefault();
      return false;
    };

    holder.ondragover = function () {
      $(holder).addClass('hover');
      return false;
    };

    holder.ondragleave = holder.ondragend = function () {
      $(holder).removeClass('hover');
      return false;
    };

    holder.ondrop = function (e) {
      $(holder).removeClass('hover');
      e.preventDefault();
      var file = e.dataTransfer.files[0];
      console.log('detected:',file.path);
      _this.zxpPath = file.path
      install();
      return false;
    };

  }

}

$(document).ready(function() {
  var _view = new View();
  _view.init();
});
