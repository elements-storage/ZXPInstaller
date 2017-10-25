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

  // PUBLIC

  this.init = function() {
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
