(function () {
  'use strict';

  var directives = angular.module('buskrApp.directives', []);

  directives.directive('manageDrawer', function ManageDrawer(ViewManager) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.on('touchstart', function (e) {
          if (ViewManager.navBar.drawer.open) {
            e.preventDefault();
            e.stopPropagation();

            steroids.drawers.hide({}, {
              onSuccess: function () {
                ViewManager.navBar.drawer.open = false;
              },
              onFailure: function(error) {
                alert('Could not hide the drawer: ' + error.errorDescription);
              }
            });
          }
        });
      }
    };
  });

})();
