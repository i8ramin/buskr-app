
var DRAWER_OPEN = false;

// ImgCache.options.debug = true;
// ImgCache.options.usePersistentCache = true;


var buskrApp = angular.module('buskrApp', [
  'buskrApp.directives'
]);

buskrApp.controller('MenuCtrl', function ($scope) {
  $scope.openLogin = function () {
    steroids.modal.show();
  };
});

// document.addEventListener('deviceready', function () {
//   angular.bootstrap(document, ['buskrApp']);
// }, false);

steroids.on('ready', function() {
  steroids.view.setBackgroundColor('#d2cbc3');
  steroids.view.bounceShadow.hide();
});
