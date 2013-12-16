(function () {
  'use strict';

  var services = angular.module('buskrApp.services', []);

  services.factory('ViewManager', function ViewManager() {
    var init;
    var drawer = {};
    var map = {};

    var menuView = new steroids.views.WebView({location:'/menu.html'});
    var mapView = new steroids.views.WebView({location:'/modal/map.html'});
    var loginView = new steroids.views.WebView({location:'/views/login/index.html'});

    drawer.init = function () {
      var _this = this;

      _this.open = false;

      _this.button = new steroids.buttons.NavigationBarButton();
      _this.button.imagePath = '/icons/menu-trigger@2x.png';

      menuView.preload({}, {
        onSuccess: function() {},
        onFailure: function() {
          alert('Failed to preload menu view');
        }
      });

      _this.button.onTap = function() {
        if (_this.open) {
          steroids.drawers.hide({}, {
            onSuccess: function () {
              _this.open = false;
            },
            onFailure: function(error) {
              alert('Could not hide the drawer: ' + error.errorDescription);
            }
          });
        } else {
          steroids.drawers.show({
            view: menuView
          }, {
            onSuccess: function() {
              _this.open = true;
            },
            onFailure: function(error) {
              alert('Could not show the drawer: ' + error.errorDescription);
            }
          });
        }
      };
    };

    map.init = function () {
      var _this = this;

      _this.open = false;

      _this.button = new steroids.buttons.NavigationBarButton();
      _this.button.imagePath = '/icons/marker-map@2x.png';

      _this.button.onTap = function() {
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
    };

    init = function (callback) {
      steroids.view.setBackgroundColor('#d2cbc3');

      drawer.init();
      map.init();

      steroids.view.navigationBar.setButtons({
        left: [drawer.button],
        right: [map.button]
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

    return {
      init: init,
      menuView: menuView,
      loginView: loginView,
      mapView: mapView,
      drawer: drawer,
      map: map
    };
  });

})();
