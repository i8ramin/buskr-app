
var drawerApp = angular.module('drawerApp', [
  'buskrApp.directives',
  'buskrApp.services'
]);

drawerApp.run(function () {
});

drawerApp.controller('DrawerCtrl', function ($scope) {
  $scope.openLogin = function () {
    window.postMessage({
      action: 'openLogin'
    }, '*');
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
