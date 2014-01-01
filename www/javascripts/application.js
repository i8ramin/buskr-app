// ImgCache.options.debug = true;
// ImgCache.options.usePersistentCache = true;

var buskrApp = angular.module('buskrApp', [
  'UserModel',
  'buskrApp.directives',
  'buskrApp.services'
]);

var drawerView = new steroids.views.WebView({location:'menu.html'});
var loginView = new steroids.views.WebView({location:'views/login/index.html'});
var artistView = new steroids.views.WebView({location:'views/artist/index.html'});

drawerView.preload({}, {
  onSuccess: function () {
    drawerView.visible = false;
    steroids.drawers.enableGesture(drawerView);
  },
  onFailure: function (error) {
    alert('Failed to preload menu view. ' + error.errorDescription);
  }
});

buskrApp.run(function (User, $window) {
  steroids.view.setBackgroundColor('#fbc26b');

  var user = User.load();

  navigator.geolocation.getCurrentPosition(
    function (position) {
      $window.localStorage.setItem('position', JSON.stringify(position.coords));
    },
    function (error) {
      console.error(error);
    }
  );

  if (user) {
    artistView.preload({}, {
      onSuccess: function () {
        steroids.layers.push({
          view: artistView,
          navigationBar: false
        });
      },
      onFailure: function (error) {
        console.error(error.errorDescription);
        alert(error.errorDescription);
      }
    });
  } else {
    loginView.preload({}, {
      onSuccess: function () {
        steroids.layers.push({
          view: loginView,
          navigationBar: false
        });
      },
      onFailure: function (error) {
        // console.error(error.errorDescription);
        // alert(error.errorDescription);

        steroids.layers.push({
          view: loginView,
          navigationBar: false
        });
      }
    });
  }

  document.addEventListener('visibilitychange', function (event) {
    if (!document.hidden) {
    }
  }, false);
});

document.addEventListener('deviceready', function () {
  angular.bootstrap(document, ['buskrApp']);
}, false);

document.addEventListener('resume', function () {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      window.localStorage.setItem('position', JSON.stringify(position.coords));
    },
    function (error) {
      console.error(error);
    }
  );
}, false);

window.addEventListener('message', function (event) {
  if (event.data && event.data.action) {
    switch(event.data.action) {
      case 'toggleDrawer':
        if (drawerView.visible) {
          steroids.drawers.hideAll();
        } else {
          steroids.drawers.show({
            view: drawerView
          }, {
            onSuccess: function () {
              // if (callback) {
              //   callback.apply(this, arguments);
              // }
            },
            onFailure: function (error) {
              alert('Could not show the drawer: ' + error.errorDescription);
            }
          });
        }
        break;
      case 'skipLogin':
        artistView.preload({}, {
          onSuccess: function () {
            steroids.layers.push({
              view: artistView,
              navigationBar: false
            });
          },
          onFailure: function (error) {
            console.error(error.errorDescription);
          }
        });
        break;
      case 'userLogout':
        steroids.nativeBridge.nativeCall({
          method: 'restartApplication'
        });
        break;

      default:
    }
  }
});
