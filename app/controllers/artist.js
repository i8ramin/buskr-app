var artistApp = angular.module('artistApp', ['ArtistModel']);

// Index: http://localhost/views/artist/index.html
artistApp.controller('IndexCtrl', function ($scope, ArtistCouch) {
  $scope.open = function(id) {
    webView = new steroids.views.WebView("/views/artist/show.html?id=" + id);
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

  steroids.view.setBackgroundColor("#d2cbc3");
  steroids.view.navigationBar.show("Artists");
});

// Show: http://localhost/views/artist/show.html?id=<id>
artistApp.controller('ShowCtrl', function ($scope, ArtistCouch) {
  ArtistCouch.ensureDB(function() {
    var whenChanged = function() {
      $scope.artist = ArtistCouch.cornerCouchDB.newDoc();
      $scope.artist.load(steroids.view.params.id).then(function (response) {
        var artist = response.data;
        steroids.view.navigationBar.show(artist.name);
      });
    };

    ArtistCouch.startPollingChanges(whenChanged);
  });

  steroids.view.setBackgroundColor("#d2cbc3");
});

// document.addEventListener("deviceready", function () {
//   angular.bootstrap(document, ['artistApp']);
// }, false);
