
(function (Firebase) {
  'use strict';

  var gaPlugin;
  var artistApp = angular.module('artistApp', [
    'ngAnimate',
    'UserModel',
    'ArtistModel',
    'firebase',
    'buskrApp.filters',
    'buskrApp.directives',
    'buskrApp.services'
  ]);

  var artistsArray = [];

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

  artistApp.run(function () {
    // steroids.view.setBackgroundColor('#d2cbc3');
  });

  // Index: http://localhost/views/artist/index.html
  artistApp.controller('IndexCtrl', function ($scope, ArtistService, NavbarService) {
    var allArtists = ArtistService.all();

    gaPlugin.trackPage($.noop, $.noop, 'views/artist/index');

    document.addEventListener('visibilitychange', function (event) {
      if (document.hidden) {
      } else {
        NavbarService.navBar.init(function () {
          steroids.view.navigationBar.show('');
          steroids.view.removeLoading();

          setTimeout(function () {
            $scope.loadArtists();
          }, 500);
        });
      }
    }, false);

    $scope.loadArtists = function () {
      if ($scope.artists) {
        return;
      }

      allArtists.then(
        function (artists) {
          angular.forEach(artists, function (artist, key) {
            artist.id = key;
            artistsArray.push(artist);
          });

          $scope.artists = artistsArray;
        }
      );
    };

    $scope.open = function (id) {
      var webView = new steroids.views.WebView({location:'views/artist/show.html?id=' + id});
      steroids.layers.push(webView);
    };
  });

  // Show: http://localhost/views/artist/show.html?id=<id>
  artistApp.controller('ShowCtrl', function ($scope, ArtistService) {
    var id = steroids.view.params.id;
    var addCardView = new steroids.views.WebView({location:'views/payment/add-card.html'});

    gaPlugin.trackPage($.noop, $.noop, 'views/artist/show');

    // remove navigationBar buttons
    steroids.view.navigationBar.setButtons({});

    ArtistService.get(id).then(
      function (artist) {
        $scope.artist = artist;
        // steroids.view.navigationBar.show(artist.name);
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

    $scope.tipBuskr = function () {
      $scope.showPaymentOverlay = true;
    };

    $scope.addCard = function () {
      $scope.showPaymentOverlay = false;
      steroids.layers.push(addCardView);
    };
  });

})(window.Firebase);
