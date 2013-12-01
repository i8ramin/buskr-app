var artistApp = angular.module('artistApp', ['ArtistModel']);

// Index: http://localhost/views/artist/index.html
artistApp.controller('IndexCtrl', function ($scope, ArtistCouch) {
  $scope.open = function(id) {
    webView = new steroids.views.WebView("/views/artist/show.html?id=" + id);
    steroids.layers.push(webView);
  };

  ArtistCouch.ensureDB(function () {
    ArtistCouch.keepInSync();
  });

  $scope.server = ArtistCouch.server;
  $scope.server.getInfo();
  $scope.server.getDatabases();

  $scope.artists = [];

  ArtistCouch.steroidsDB.on('change', function() {
    ArtistCouch.cornerCouchDB.queryAll({ include_docs: true, descending: true, limit: 8 }).success(function(rows) {
      $scope.artists = ArtistCouch.cornerCouchDB.rows.map(function(row) {
        alert(JSON.stringify(row.doc));
        return row.doc;
      });
    });
  });

  steroids.view.navigationBar.show("Artist index");
});

// Show: http://localhost/views/artist/show.html?id=<id>
artistApp.controller('ShowCtrl', function ($scope, ArtistCouch) {
  ArtistCouch.ensureDB(function() {
    var whenChanged = function() {
      $scope.artist = ArtistCouch.cornerCouchDB.newDoc();
      $scope.artist.load(steroids.view.params.id);
    };

    ArtistCouch.startPollingChanges(whenChanged);
  });

  steroids.view.navigationBar.show("Show " + steroids.view.params.id);
});

// document.addEventListener("deviceready", function () {
//   angular.bootstrap(document, ['artistApp']);
// }, false);
