
(function () {
  'use strict';

  var gaPlugin;
  var artistApp = angular.module('artistApp', [
    'buskrApp.directives',
    'ArtistModel'
  ]);

  var menuView = new steroids.views.WebView({location:'/menu.html'});

  menuView.preload({}, {
    onSuccess: function() {
    }
  });

  var initView = function () {
    var drawerButton = new steroids.buttons.NavigationBarButton();
    var mapMarkerButton = new steroids.buttons.NavigationBarButton();

    drawerButton.imagePath = '/icons/menu-trigger@2x.png';
    mapMarkerButton.imagePath = '/icons/marker-map@2x.png';

    drawerButton.onTap = function() {
      if (DRAWER_OPEN) {
        steroids.drawers.hide({}, {
          onSuccess: function () {
            DRAWER_OPEN = false;
          },
          onFailure: function(error) {
            alert('Could not hide the drawer: ' + error.errorDescription);
          }
        });
      } else {
        steroids.drawers.show({
          view: menuView
        }, {
          onSuccess: function() {
            DRAWER_OPEN = true;
          },
          onFailure: function(error) {
            alert('Could not show the drawer: ' + error.errorDescription);
          }
        });
      }
    };

    mapMarkerButton.onTap = function() {
      var mapView = new steroids.views.WebView({location:'/modal/map.html'});

      steroids.modal.show( {
        view: mapView
      }, {
        onSuccess: function() {
        },
        onFailure: function(error) {
          alert("Could not present the modal: " + error.errorDescription);
        }
      });
    };

    steroids.view.navigationBar.setButtons({
      left: [drawerButton],
      right: [mapMarkerButton]
    }, {
      onSuccess: function() {
        // alert('Buttons set!');
      },
      onFailure: function() {
        alert('Failed to set buttons.');
      }
    });

    steroids.view.setBackgroundColor('#d2cbc3');
  };

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
    steroids.view.navigationBar.show('');
  });

  // Index: http://localhost/views/artist/index.html
  artistApp.controller('IndexCtrl', function ($scope, ArtistCouch) {
    gaPlugin.trackPage($.noop, $.noop, 'views/artist/index');

    initView();

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
