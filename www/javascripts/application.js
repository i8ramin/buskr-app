// ImgCache.options.debug = true;
// ImgCache.options.usePersistentCache = true;

var buskrApp = angular.module('buskrApp', [
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

buskrApp.run(function () {
  steroids.layers.push({
    view: loginView,
    navigationBar: false
  });

  // loginView.preload({}, {
  //   onSuccess: function () {
  //     steroids.layers.replace({
  //       view: loginView
  //     }, {
  //       onSuccess: function () {
  //       },
  //       onFailure: function (error) {
  //         alert('Failed to replace layers with loginView. ' + error.errorDescription);
  //       }
  //     });
  //   },
  //   onFailure: function (error) {
  //     alert('Failed to preload loginView. ' + error.errorDescription);
  //   }
  // });
});

document.addEventListener('deviceready', function () {
  angular.bootstrap(document, ['buskrApp']);
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
        steroids.layers.push({
          view: artistView,
          navigationBar: false
        });
        break;

      default:
    }
  }
});
