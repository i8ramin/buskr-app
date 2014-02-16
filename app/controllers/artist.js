
(function () {
  'use strict';

  var gaPlugin;
  var artistApp = angular.module('artistApp', [
    'google-maps',
    'ngAnimate',
    'UserModel',
    'ArtistModel',
    'buskrApp.filters',
    'buskrApp.directives',
    'buskrApp.services'
  ]);

  var drawerView = new steroids.views.WebView({id: 'drawerView', location:'menu.html'});

  artistApp.run(function () {
    steroids.view.setBackgroundColor('#d2cbc3');
  });

  // Index: http://localhost/views/artist/index.html
  artistApp.controller('IndexCtrl', function ($scope, ArtistService, NavbarService) {
    gaPlugin.trackPage($.noop, $.noop, 'views/artist/index');

    NavbarService.navBar.init(function () {
    });

    $scope.loadArtists = function () {
      ArtistService.all().then(
        function (artists) {
          console.log('[BUSKR] Loaded ' + artists.length + ' artists.');
          $scope.artists = artists;
        }
      ).finally(function () {
        steroids.splashscreen.hide();
      });
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
    // steroids.view.navigationBar.setButtons({});

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

    $scope.tipBuskr = function () {
      $scope.showOverlay = true;
      $scope.showTipAmountOverlay = true;
      // $scope.showPaymentOverlay = true;
    };

    $scope.tip = function (artist, amount) {
      var webView = new steroids.views.WebView({location:'views/payment/confirm.html?id=' + artist.objectId + '&amount=' + amount});

      steroids.layers.push(webView);
      $scope.hideOverlay();
    };

    $scope.addCard = function () {
      $scope.showOverlay = false;
      $scope.showPaymentOverlay = false;

      steroids.layers.push(addCardView);
      $scope.hideOverlay();
    };

    $scope.hideOverlay = function () {
      $scope.showOverlay = false;
      $scope.showTipAmountOverlay = false;
      $scope.showPaymentOverlay = false;
    };
  });

  artistApp.controller('MapCtrl', function ($rootScope, $scope, $timeout, User, ArtistService) {
    var position = JSON.parse(localStorage.getItem('position'));
    var map, iconUrl, myMarker, markers = [];
    var bounds = new google.maps.LatLngBounds();

    myMarker = {
      latitude: position.latitude,
      longitude: position.longitude,
      icon: {
        url: 'http://localhost/images/marker-me.png',
        scaledSize: new google.maps.Size(49, 63)
      },
      options: {
      }
    };

    // Enable the new Google Maps visuals until it gets enabled by default.
    // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
    google.maps.visualRefresh = true;

    $scope.map = {
      center: {
        latitude: position.latitude,
        longitude: position.longitude
      },
      zoom: 13,
      options: {
        // disableDefaultUI: true,
        // zoomControl: true,
        // streetViewControl: false
      },
      events: {
        dragend: function () {
          console.log('drag...');
        }
      },
      myMarker: myMarker
    };

    bounds.extend(new google.maps.LatLng(position.latitude, position.longitude));

    $scope.map.markers = [];

    ArtistService.all().then(
      function (artists) {
        angular.forEach(artists, function (artist) {
          iconUrl = artist.live ? 'http://localhost/images/marker-live.png' :
            'http://localhost/images/marker.png';

          markers.push({
            latitude: artist.location.lat,
            longitude: artist.location.long,
            artist: artist,
            icon: {
              url: iconUrl,
              scaledSize: new google.maps.Size(49, 63)
            },
            options: {
              title: artist.name,
              animation: google.maps.Animation.DROP,
              draggable: false
            },
            events: {
              click: function (marker) {
                marker.getMap().panTo(marker.position);
              }
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
        location:'views/artist/show.html?id=' + artist.objectId
      });

      $scope.artist = null;

      steroids.layers.push(webView);
    };
  });

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
        // angular.bootstrap(document, ['artistApp']);
      },
      function () {
        // angular.bootstrap(document, ['artistApp']);
      }
    );

    angular.bootstrap(document, ['artistApp']);
  });

  document.addEventListener('visibilitychange', function (event) {
    if (document.hidden) {
    } else {
      if (localStorage.getItem('backToExplore')) {
        // really hacky way to go back multiple
        // steps in the layer stack. hopefully
        // layers.pop() will take a param soon
        localStorage.removeItem('backToExplore');

        setTimeout(function () {
          steroids.layers.pop({}, {
            onSuccess: function () {},
            onFailure: function (error) {
              alert(error.errorDescription);
              console.error(error.errorDescription);
            }
          });
        }, 500);
      }
    }
  }, false);

})();
