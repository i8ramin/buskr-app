
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

buskrApp.run(function ($rootScope, $window, User) {
  var user = User.load();

  // steroids.view.navigationBar.show('');

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
          navigationBar: false,
          keepLoading: true
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
        // steroids.layers.replace({
        //   view: loginView
        // }, {
        //   onSuccess: function () {

        //   },
        //   onFailure: function (error) {
        //     console.error(error.errorDescription);
        //     alert(error.errorDescription);
        //   }
        // });

        steroids.layers.push({
          view: loginView,
          navigationBar: false,
          keepLoading: true
        });
      },
      onFailure: function (error) {
        console.error(error.errorDescription);
        alert(error.errorDescription);
      }
    });
  }

  document.addEventListener('visibilitychange', function (event) {
    if (!document.hidden) {
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
          artistView.unload({}, {
            onSuccess: function () {},
            onFailure: function (error) {
              console.error(error.errorDescription);
            }
          });

          artistView.preload({}, {
            onSuccess: function () {
              steroids.layers.push({
                view: artistView,
                navigationBar: false
              });
            },
            onFailure: function (error) {
              if (error.errorDescription === 'A preloaded layer with this identifier already exists') {
                steroids.layers.push({
                  view: artistView,
                  navigationBar: false
                });
              } else {
                console.error(error.errorDescription);
              }

            }
          });
          break;
        case 'openLogin':
          steroids.layers.pop({}, {
            onSuccess: function () {
              steroids.drawers.hide({}, {
                onSuccess: function () {
                },
                onFailure: function (error) {
                  alert(error.errorDescription);
                }
              });
            },
            onFailure: function (error) {
              console.error(error.errorDescription);
            }
          });

          // steroids.layers.push({
          //   view: loginView,
          //   navigationBar: false
          // }, {
          //   onSuccess: function () {
          //     steroids.drawers.hideAll();
          //   },
          //   onFailure: function (error) {
          //     alert(error.errorDescription);
          //   }
          // });

          break;
        case 'userLogout':
          steroids.layers.popAll();

          artistView.unload({}, {
            onSuccess: function () {},
            onFailure: function (error) {
              console.error(error.errorDescription);
            }
          });

          steroids.drawers.hide({}, {
              onSuccess: function () {
                setTimeout(function () {
                  steroids.layers.push({
                    view: loginView,
                    navigationBar: false
                  }, {
                    onSuccess: function () {},
                    onFailure: function (error) {
                      console.error('[App:userLogout] ' + error.errorDescription);
                    }
                  });
                }, 500);
              },
              onFailure: function (error) {
                alert(error.errorDescription);
              }
            });

          // steroids.layers.pop({}, {
          //   onSuccess: function () {
          //     steroids.drawers.hide({}, {
          //       onSuccess: function () {
          //         setTimeout(function () {
          //           steroids.layers.push({
          //             view: loginView,
          //             navigationBar: false
          //           }, {
          //             onSuccess: function () {},
          //             onFailure: function (error) {
          //               console.error('[App:userLogout] ' + error.errorDescription);
          //             }
          //           });
          //         }, 1000);
          //       },
          //       onFailure: function (error) {
          //         alert(error.errorDescription);
          //       }
          //     });
          //   },
          //   onFailure: function (error) {
          //     console.error(error.errorDescription);
          //   }
          // });

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
