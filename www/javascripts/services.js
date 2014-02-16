(function () {
  'use strict';

  var services = angular.module('buskrApp.services', []);

  services.factory('NavbarService', function NavbarService() {
    var navBar = {};

    navBar.init = function (callback) {
      var mapView = new steroids.views.WebView({location:'views/artist/map.html'});

      var drawerButton = new steroids.buttons.NavigationBarButton();
      var mapButton = new steroids.buttons.NavigationBarButton();

      drawerButton.imagePath = '/icons/menu-trigger@2x.png';
      mapButton.imagePath = '/icons/marker-map@2x.png';

      drawerButton.onTap = function () {
        window.postMessage({
          action: 'toggleDrawer'
        }, '*');
      };

      mapButton.onTap = function () {
        steroids.layers.push(mapView);
      };

      steroids.view.navigationBar.update({
        overrideBackButton: true,
        buttons: {
          left: [drawerButton],
          right: [mapButton]
        }
      }, {
        onSuccess: function() {
          if (callback) {
            callback.apply(this, arguments);
          }
        },
        onFailure: function() {
          alert('Failed to set Nav Bar buttons.');
        }
      });
    };

    return {
      navBar: navBar
    };
  });

})();
