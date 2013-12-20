
(function () {
  'use strict';

  var gaPlugin;
  var artistApp = angular.module('artistApp', [
    'buskrApp.directives',
    'buskrApp.services',
    'ArtistModel'
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

    FastClick.attach(document.body);
    angular.bootstrap(document, ['artistApp']);
  });

  artistApp.run(function () {
  });

  // Index: http://localhost/views/artist/index.html
  artistApp.controller('IndexCtrl', function ($scope, ArtistCouch, ViewManager) {
    ViewManager.initViews(function () {
      ViewManager.initNavbar();

      steroids.modal.show({
        view: ViewManager.loginView
      });
    });

    steroids.view.navigationBar.show('');

    gaPlugin.trackPage($.noop, $.noop, 'views/artist/index');

    $scope.open = function(id) {
      var webView = new steroids.views.WebView({location:'/views/artist/show.html?id=' + id});
      steroids.layers.push(webView);
    };

    ArtistCouch.ensureDB(function () {
    });

    $scope.artists = [];

    ArtistCouch.steroidsDB.on('change', function() {
      ArtistCouch.cornerCouchDB.queryAll({ include_docs: true, descending: true, limit: 8 }).success(function(rows) {
        $scope.artists = ArtistCouch.cornerCouchDB.rows.map(function(row) {
          return row.doc;
        });
      });
    });
  });

  // Show: http://localhost/views/artist/show.html?id=<id>
  artistApp.controller('ShowCtrl', function ($scope, ArtistCouch) {
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

    ArtistCouch.ensureDB(function() {
      var whenChanged = function() {
        $scope.artist = ArtistCouch.cornerCouchDB.newDoc();
        $scope.artist.load(steroids.view.params.id).then(function (response) {
          var artist = response.data;
          steroids.view.navigationBar.show('Artist');
        });
      };

      ArtistCouch.startPollingChanges(whenChanged);
    });
  });
})();
