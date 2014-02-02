
(function (Firebase) {
  'use strict';

  var gaPlugin;
  var artistApp = angular.module('artistApp', [
    'google-maps',
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
    gaPlugin.trackPage($.noop, $.noop, 'views/artist/index');

    NavbarService.navBar.init(function () {
      steroids.view.navigationBar.show('');
      steroids.view.removeLoading();
    });

    $scope.loadArtists = function () {
      ArtistService.all().then(
        function (artists) {
          angular.forEach(artists, function (artist, key) {
            artist.id = key;
            artistsArray.push(artist);
          });

          console.log('[BUSKR] Loaded ' + artistsArray.length + ' artists.');

          $scope.artists = artistsArray;
        }
      );
    };

    $scope.loadArtists();

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
      $scope.showOverlay = true;
      $scope.showTipAmountOverlay = true;
      // $scope.showPaymentOverlay = true;
    };

    $scope.hideOverlay = function () {
      $scope.showOverlay = false;
      $scope.showTipAmountOverlay = false;
      $scope.showPaymentOverlay = false;
    };

    $scope.addCard = function () {
      $scope.showOverlay = false;
      $scope.showPaymentOverlay = false;

      steroids.layers.push(addCardView);
    };
  });

  artistApp.controller('MapCtrl', function ($rootScope, $scope, $timeout, User, ArtistService) {
    var position = JSON.parse(localStorage.getItem('position'));
    var map, iconUrl, markers = [];
    var bounds = new google.maps.LatLngBounds();

    // Enable the new Google Maps visuals until it gets enabled by default.
    // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
    google.maps.visualRefresh = true;

    $scope.map = {
      center: {
        latitude: position.latitude,
        longitude: position.longitude
      },
      zoom: 13,
      draggable: true,
      options: {
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        panControl: false,
        maxZoom: 20,
        minZoom: 3
      },
      markerOptions: {
        animation: google.maps.Animation.DROP
      },
      myMarker: {
        latitude: position.latitude,
        longitude: position.longitude,
        icon: {
          url: 'http://localhost/images/marker-me.png',
          scaledSize: new google.maps.Size(49, 63)
        },
        options: {
          animation: google.maps.Animation.DROP
        }
      }
    };

    $scope.map.markers = [];

    ArtistService.all().then(
      function (artists) {
        angular.forEach(artists, function (artist, key) {
          iconUrl = artist.live ? 'http://localhost/images/marker-live.png' :
            'http://localhost/images/marker.png';

          artist.id = key;

          markers.push({
            latitude: artist.location.lat,
            longitude: artist.location.long,
            artist: artist,
            icon: {
              url: iconUrl,
              scaledSize: new google.maps.Size(49, 63)
            },
            options: {
              // animation: google.maps.Animation.DROP
            }
          });

          bounds.extend(new google.maps.LatLng(artist.location.lat, artist.location.long));
        });

        $scope.map.markers = markers;
        $scope.map.bounds = {
          northeast: {
            latitude: bounds.getNorthEast().lat(),
            longitude: bounds.getNorthEast().lng()
          },
          southwest: {
            latitude: bounds.getSouthWest().lat(),
            longitude: bounds.getSouthWest().lng()
          }
        };
      }
    );

    $scope.showArtistInfo = function (marker) {
      $scope.artist = null;

      $timeout(function () {
        $scope.artist = marker.artist;
      }, 200);
    };

    $scope.showArtist = function (artist) {
      var webView = new steroids.views.WebView({
        location:'views/artist/show.html?id=' + artist.id
      });

      steroids.layers.push(webView);
    };

    window.addEventListener('message', function (event) {
      if (event.data && event.data.action) {
        switch(event.data.action) {
          case '':
            break;
        }
      }
    });
  });

})(window.Firebase);
