(function () {
  'use strict';

  var services = angular.module('buskrApp.services', []);

  services.factory('NavbarService', function NavbarService() {
    var navBar = {};

    navBar.init = function (callback) {
      var mapView = new steroids.views.WebView({location:'modal/map.html'});

      var drawerButton = new steroids.buttons.NavigationBarButton();
      var mapButton = new steroids.buttons.NavigationBarButton();

      drawerButton.imagePath = '/icons/menu-trigger@2x.png';
      mapButton.imagePath = '/icons/marker-map@2x.png';

      drawerButton.onTap = function () {
        window.postMessage({
          action: 'toggleDrawer',
          callback: callback
        }, '*');
      };

      mapButton.onTap = function () {
        // window.postMessage({
        //   action: 'toggleMap',
        //   callback: callback
        // }, '*');

        steroids.modal.show( {
          view: mapView
        }, {
          onSuccess: function () {
            if (callback) {
              callback.apply(this, arguments);
            }
          },
          onFailure: function (error) {
            alert('Could not present the modal: ' + error.errorDescription);
          }
        });
      };

      steroids.view.navigationBar.setButtons({
        left: [drawerButton],
        right: [mapButton],
        overrideBackButton: true
      }, {
        onSuccess: function () {
        },
        onFailure: function () {
          alert('Failed to set Nav Bar buttons.');
        }
      });
    };

    return {
      navBar: navBar
    };
  });

})();
