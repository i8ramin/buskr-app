
(function (Firebase) {
  'use strict';

  var gaPlugin;
  var artistApp = angular.module('artistApp', [
    'UserModel',
    'ArtistModel',
    'firebase',
    'buskrApp.directives',
    'buskrApp.services'
  ]);

  document.addEventListener('deviceready', function () {
    gaPlugin = window.plugins.gaPlugin;
    gaPlugin.init(
      function () {
        // success
      },
      function () {
        // error
      },
      'UA-46274077-1',
      10
    );

    angular.bootstrap(document, ['artistApp']);
  });

  // window.addEventListener('message', function (event) {
  //   if (event.data.action === 'openLogin') {
  //     steroids.layers.pop({}, {
  //       onSuccess: function () {
  //         setTimeout(function () {
  //           steroids.drawers.hide({}, {
  //             onSuccess: function () {
  //             },
  //             onFailure: function (error) {
  //             }
  //           });
  //         }, 300);
  //       }
  //     });
  //   }
  // });

  artistApp.run(function () {
    document.addEventListener('visibilitychange', function (event) {
    }, false);
  });

  // Index: http://localhost/views/artist/index.html
  artistApp.controller('IndexCtrl', function ($scope, $firebase, NavbarService) {
    NavbarService.navBar.init(function () {
    });
    steroids.view.navigationBar.show('');

    gaPlugin.trackPage($.noop, $.noop, 'views/artist/index');

    $scope.open = function (artist) {
      var webView = new steroids.views.WebView({location:'views/artist/show.html?id=' + artist.$id});
      steroids.layers.push(webView);
    };

    $scope.artists = $firebase(new Firebase('https://buskrapp.firebaseio.com/artists'));
  });

  // Show: http://localhost/views/artist/show.html?id=<id>
  artistApp.controller('ShowCtrl', function ($scope, $firebase) {
    var id = steroids.view.params.id;
    var artistPromise;

    gaPlugin.trackPage($.noop, $.noop, 'views/artist/show');

    $scope.openMap = function () {
      steroids.openURL({
        url: 'comgooglemaps://'
      }, {
        onSuccess: function(parameters) {
          alert('Maps launched');
        },
        onFailure: function(error) {
          steroids.openURL({
            url: 'maps://'
          }, {
            onSuccess: function(parameters) {

            },
            onFailure: function(error) {
              alert('[Apple] Failed to open: ' + error.errorDescription);
            }
          });

          alert('[Gooogle] Failed to open: ' + error.errorDescription);
        }
      });
    };

    // remove navigationBar buttons
    steroids.view.navigationBar.setButtons({});

    $scope.artist = $firebase(new Firebase('https://buskrapp.firebaseio.com/artists/' + id));
  });

})(window.Firebase);
