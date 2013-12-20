
var DRAWER_OPEN = false;

// ImgCache.options.debug = true;
// ImgCache.options.usePersistentCache = true;


var drawerApp = angular.module('drawerApp', [
  'buskrApp.directives',
  'buskrApp.services'
]);

drawerApp.run(function (ViewManager) {
  // ViewManager.init();
});

drawerApp.controller('DrawerCtrl', function ($scope, ViewManager) {
  $scope.openLogin = function () {
    steroids.drawers.hide({}, {
      onSuccess: function () {
        ViewManager.navBar.drawer.open = false;

        steroids.modal.show({
          view: ViewManager.loginView
        });
      },
      onFailure: function(error) {
        alert('Could not hide the drawer: ' + error.errorDescription);
      }
    });
  };
});

document.addEventListener('deviceready', function () {
  angular.bootstrap(document, ['drawerApp']);
  FastClick.attach(document.body);
}, false);

steroids.on('ready', function() {
  // steroids.view.setBackgroundColor('#d2cbc3');
  // steroids.view.setBackgroundColor('#fbc26b');
  // steroids.view.bounceShadow.hide();
});
