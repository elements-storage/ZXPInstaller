global.$ = $;

$(document).ready(function() {
  $('#install').click(function(){
    var installer = global.installer();
    var promise = installer.install();
    var status = $('.status');
    status.html("installing...")
    promise.then(function(result) {
          status.html("Extension installed successfully. Please restart Photoshop to start using your Extension.");
    }, function(err) {
      console.log(err); // Error
      status.html(err);
    });
  });
});
