global.$ = $;

global.View = function() {
  var view = document.getElementById('main-view');
  var holder = document.getElementById('holder');
  var installer = global.installer();

  this.zxpPath;

  _this = this;

  var install = function() {
    var promise = installer.install(_this.zxpPath);
    promise.then(function(result) {
      installationSuccess();
    }, function(err) {
      console.log(err); // Error
      installationFaild(err);
    });

  }

  var installationFaild = function(error) {
    $(view).find('.status').html(error);
  }

  var installationSuccess = function() {
    $(view).find('.status').html("Extension installed successfully. Please restart Photoshop to start using your Extension.");
  }

  // PUBLIC

  this.init = function() {

    holder.ondragover = function () {
      return false;
    };

    holder.ondragleave = holder.ondragend = function () {
      return false;
    };

    holder.ondrop = function (e) {
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
