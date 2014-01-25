
var buskrApp = angular.module('buskrApp', [
  'ngAnimate',
  'ui.bootstrap',
  'UserModel',
  'buskrApp.filters',
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

buskrApp.run(function ($rootScope, $window, User) {
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
    steroids.layers.push({
      view: artistView,
      navigationBar: false,
      animation: new steroids.Animation({
        transition: 'fade',
        duration: 0.25
      })
    }, {
      onSuccess: function () {},
      onFailure: function (error) {
        alert(error.errorDescription);
      }
    });
  } else {
    artistView.preload({}, {
      onSuccess: function () {
        // alert('preloaded');
      },
      onFailure: function (error) {
        console.error(error.errorDescription);
      }
    });

    steroids.layers.push({
      view: loginView,
      navigationBar: false,
      animation: new steroids.Animation({
        transition: 'fade',
        duration: 0.25
      })
    }, {
      onSuccess: function () {},
      onFailure: function (error) {
        alert(error.errorDescription);
      }
    });

    // loginView.preload({}, {
    //   onSuccess: function () {
    //     steroids.layers.push({
    //       view: loginView,
    //       navigationBar: false,
    //       animation: new steroids.Animation({
    //         transition: 'fade',
    //         duration: 0.5
    //       })
    //     }, {
    //       onSuccess: function () {},
    //       onFailure: function (error) {
    //         alert(error.errorDescription);
    //       }
    //     });

    //     // steroids.layers.replace({
    //     //   view: loginView
    //     // }, {
    //     //   onSuccess: function () {

    //     //   },
    //     //   onFailure: function (error) {
    //     //     console.error(error.errorDescription);
    //     //     alert(error.errorDescription);
    //     //   }
    //     // });
    //   },
    //   onFailure: function (error) {
    //     console.error(error.errorDescription);
    //     alert(error.errorDescription);
    //   }
    // });


  }

  document.addEventListener('visibilitychange', function (event) {
    if (document.hidden) {
    }
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
          }, {
            onSuccess: function () {

            },
            onFailure: function (error) {
              alert(error.errorDescription);
              console.error(error.errorDescription);
            }
          });

          break;
        case 'openLogin':
          steroids.layers.pop({}, {
            onSuccess: function () {
              setTimeout(function () {
                steroids.drawers.hide({}, {
                  onSuccess: function () {
                  },
                  onFailure: function (error) {
                    alert(error.errorDescription);
                  }
                });
              }, 500);
            },
            onFailure: function (error) {
              console.error(error.errorDescription);
            }
          });

          break;
        case 'userLogout':
          steroids.layers.pop({}, {
            onSuccess: function () {
              setTimeout(function () {
                steroids.drawers.hide({}, {
                  onSuccess: function () {
                  },
                  onFailure: function (error) {
                    alert(error.errorDescription);
                  }
                });
              }, 500);
            },
            onFailure: function (error) {
              console.error(error.errorDescription);
            }
          });


          break;

        default:
      }
    }
  });
});

document.addEventListener('deviceready', function () {
  steroids.view.setBackgroundColor('#fbc26b');
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
