global.$ = $;

global.View = function() {
  var body = document.body;
  var view = document.getElementById('main-view');
  var installer = global.installer();
  var remote = require('remote');
  var dialog = remote.require('dialog');

  var msg = new global.Messages()

  this.zxpPath;

  _this = this;

  var updateStatus = function(message) {
    $(body).find('.status').html(message);
  }

  var toggleSpinner = function(state) {
    $(body).toggleClass('is-showing-spinner', state)
  };

  var toggleSuccess = function(state) {
    $(body).toggleClass('was-successful', state).removeClass('is-showing-spinner');
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
    updateStatus(msg.ui['installing']);
    toggleSpinner(true);
  }

  var installationFailed = function(error) {

    toggleSpinner(false);
    updateStatus(msg.errors[error] || 'Error: ' + error);
  }

  var installationSuccess = function() {
    toggleSpinner(false);
    toggleSuccess(true);
    updateStatus(msg.ui['installed']);
  }

  // PUBLIC

  this.init = function() {

    document.ondragover = function () {
      $(body).addClass('is-dragging').removeClass('was-successful');
      updateStatus(msg.ui['dropToInstall']);
      return false;
    };

    document.ondragleave = document.ondragend = function () {
      $(body).removeClass('is-dragging');
      updateStatus(msg.ui['dragToInstall']);
      return false;
    };

    document.ondrop = function (e) {
      $(body).removeClass('is-dragging');
      e.preventDefault();
      var file = e.dataTransfer.files[0];
      console.log('detected:',file.path);
      _this.zxpPath = file.path
      install();
      return false;
    };

    document.onclick = function (e) {
      var path = dialog.showOpenDialog({properties: ['openFile']});
      if (!path) return false;
      console.log('detected:', path);
      _this.zxpPath = path
      install();
      return false;
    };

    updateStatus(msg.ui['dragToInstall']);
  }

}

$(document).ready(function() {
  var _view = new View();
  _view.init();
});
