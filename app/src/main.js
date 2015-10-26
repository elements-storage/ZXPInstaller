global.$ = $;

global.View = function() {
  var view = document.getElementById('main-view');
  var holder = document.getElementById('holder');
  var installer = global.installer();
  var spinner = new Spinner().spin()

  this.zxpPath;

  _this = this;

  var install = function() {
    var promise = installer.install(_this.zxpPath);
    startInstalling();
    promise.then(function(result) {
      installationSuccess();
    }, function(err) {
      console.log(err); // Error
      installationFailed(err);
    });

  }

  var startInstalling = function(){
    $(view).find('.status').empty();
    view.appendChild(spinner.el);
  }

  var installationFailed = function(error) {
    view.removeChild(spinner.el);
    $(view).find('.status').html(error);
  }

  var installationSuccess = function() {
    view.removeChild(spinner.el);
    $(view).find('.status').html("Extension installed successfully. Please restart Photoshop to start using your Extension.");
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
