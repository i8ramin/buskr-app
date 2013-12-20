(function () {
  'use strict';

  var services = angular.module('buskrApp.services', []);

  services.factory('ViewManager', function ViewManager() {
    var drawerView;
    var mapView;
    var loginView;

    var initViews;
    var initNavbar;
    var navBar = {};

    initNavbar = function (callback) {
      var _this = this;
      var drawerButton = new steroids.buttons.NavigationBarButton();
      var mapButton = new steroids.buttons.NavigationBarButton();

      drawerButton.imagePath = '/icons/menu-trigger@2x.png';
      mapButton.imagePath = '/icons/marker-map@2x.png';

      this.drawer = {
        open: false,
        button: drawerButton
      };

      this.map = {
        open: false,
        button: mapButton
      };

      drawerButton.onTap = function() {
        if (_this.drawer.open) {
          steroids.drawers.hide({}, {
            onSuccess: function () {
              _this.drawer.open = false;
            },
            onFailure: function(error) {
              alert('Could not hide the drawer: ' + error.errorDescription);
            }
          });
        } else {
          steroids.drawers.show({
            view: drawerView
          }, {
            onSuccess: function() {
              _this.drawer.open = true;
            },
            onFailure: function(error) {
              alert('Could not show the drawer: ' + error.errorDescription);
            }
          });
        }
      };

      mapButton.onTap = function() {
        steroids.modal.show( {
          view: mapView
        }, {
          onSuccess: function() {
          },
          onFailure: function(error) {
            alert('Could not present the modal: ' + error.errorDescription);
          }
        });
      };

      steroids.view.navigationBar.setButtons({
        left: [drawerButton],
        right: [mapButton]
      }, {
        onSuccess: function() {
          if (callback) {
            callback.apply(this, arguments);
          }
        },
        onFailure: function() {
          alert('Failed to set buttons.');
        }
      });
    };

    initViews = function (callback) {
      drawerView = new steroids.views.WebView({location:'/menu.html'});
      mapView = new steroids.views.WebView({location:'/modal/map.html'});
      loginView = new steroids.views.WebView({location:'/views/login/index.html'});

      drawerView.preload({}, {
        onSuccess: function () {
          if (callback) {
            callback.apply(this, arguments);
          }
        },
        onFailure: function (error) {
          alert('Failed to preload menu view. ' + error.errorDescription);
        }
      });

      // steroids.view.setBackgroundColor('#fbc26b');
      // steroids.view.setBackgroundColor('#d2cbc3');
      // navBar.init(callback);
    };

    return {
      initViews: initViews,
      initNavbar: initNavbar,
      navBar: navBar,
      drawerView: drawerView,
      loginView: loginView,
      mapView: mapView
    };
  });

})();
