
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

    // ImgCache.options.debug = true;
    ImgCache.options.usePersistentCache = true;
    ImgCache.options.useDataURI = true;
    ImgCache.init(
      function () {
        angular.bootstrap(document, ['artistApp']);
      },
      function () {
        angular.bootstrap(document, ['artistApp']);
      }
    );
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

  artistApp.run(function (NavbarService) {
    steroids.view.setBackgroundColor('#d2cbc3');

    document.addEventListener('visibilitychange', function (event) {
      if (!document.hidden) {
        // NavbarService.navBar.init(function () {
        //   steroids.view.navigationBar.show('');
        // });
      }
    }, false);
  });

  // Index: http://localhost/views/artist/index.html
  artistApp.controller('IndexCtrl', function ($scope, ArtistService, NavbarService) {
    NavbarService.navBar.init(function () {
      steroids.view.navigationBar.show('');

      ArtistService.all().then(
        function (artists) {
          $scope.artists = artists;
        }
      );
    });

    gaPlugin.trackPage($.noop, $.noop, 'views/artist/index');

    $scope.open = function (id) {
      var webView = new steroids.views.WebView({location:'views/artist/show.html?id=' + id});
      steroids.layers.push(webView);
    };
  });

  // Show: http://localhost/views/artist/show.html?id=<id>
  artistApp.controller('ShowCtrl', function ($scope, ArtistService) {
    var id = steroids.view.params.id;

    gaPlugin.trackPage($.noop, $.noop, 'views/artist/show');

    // remove navigationBar buttons
    steroids.view.navigationBar.setButtons({});

    ArtistService.get(id).then(
      function (artist) {
        $scope.artist = artist;
      }
    );

    $scope.openMap = function () {
      steroids.openURL({
        url: 'comgooglemaps://'
      }, {
        onSuccess: function(parameters) {
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
        }
      });
    };
  });

})(window.Firebase);
