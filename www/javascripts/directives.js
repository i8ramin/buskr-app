(function () {
  'use strict';

  var directives = angular.module('buskrApp.directives', []);

  directives.directive('manageDrawer', function ManageDrawer() {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.on('touchstart', function (e) {
          if (DRAWER_OPEN) {
            e.preventDefault();
            e.stopPropagation();

            steroids.drawers.hide({}, {
              onSuccess: function () {
                DRAWER_OPEN = false;
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
