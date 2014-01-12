
var drawerApp = angular.module('drawerApp', [
  'UserModel',
  'buskrApp.directives',
  'buskrApp.services'
]);

drawerApp.run(function () {
  steroids.view.setBackgroundColor('#f0b059');
});

drawerApp.controller('DrawerCtrl', function ($rootScope, $scope, User) {
  $rootScope.user = User.load();

  $scope.logout = function () {
    User.logout();
  };

  $scope.openLogin = function () {
    window.postMessage({
      action: 'openLogin'
    }, '*');
  };

  window.addEventListener('message', function (event) {
    if (event.data && event.data.action) {
      switch(event.data.action) {
        case 'skipLogin':
          break;
        case 'userLogin':
          $rootScope.user = event.data.user;
          $rootScope.$apply();
          break;
        case 'userLogout':
          delete $rootScope.user;
          $rootScope.$apply();
          break;
      }
    }
  });
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
