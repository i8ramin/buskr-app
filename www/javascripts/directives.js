(function () {
  'use strict';

  var directives = angular.module('buskrApp.directives', []);

  directives.directive('manageDrawer', function ManageDrawer(NavbarService) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        // element.on('touchstart', function (e) {
        //   if (NavbarService.navBar.drawer.visible) {
        //     e.preventDefault();
        //     e.stopPropagation();

        //     window.postMessage({
        //       action: 'toggleDrawer'
        //     }, '*');

        //     // steroids.drawers.hide({}, {
        //     //   onSuccess: function () {
        //     //   },
        //     //   onFailure: function(error) {
        //     //     alert('Could not hide the drawer: ' + error.errorDescription);
        //     //   }
        //     // });
        //   }
        // });
      }
    };
  });

})();
