var userApp = angular.module('userApp', ['UserModel']);


// Index: http://localhost/views/user/index.html

userApp.controller('IndexCtrl', function ($scope, UserCouch) {
  UserCouch.steroidsDB.on('change', function() {
    UserCouch.cornerCouchDB.queryAll({ include_docs: true, descending: true, limit: 8 }).success(function(rows){
      $scope.users = UserCouch.cornerCouchDB.rows.map(function(row) {
        return row.doc;
      });
    });
  });
});


// Show: http://localhost/views/user/show.html?id=<id>

userApp.controller('ShowCtrl', function ($scope, UserCouch) {

  UserCouch.ensureDB(function() {

    var whenChanged = function() {
      $scope.user = UserCouch.cornerCouchDB.newDoc();
      $scope.user.load(steroids.view.params.id);
    };

    UserCouch.startPollingChanges(whenChanged);
  });

});
