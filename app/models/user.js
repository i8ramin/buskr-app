// The contents of individual model .js files will be concatenated into dist/models.js

(function(Firebase) {

// Protects views where AngularJS is not loaded from errors
if (typeof angular === 'undefined') {
	return;
}

var module = angular.module('UserModel', [
  'firebase'
]);

module.factory('User', function ($rootScope, $window, $q, $firebaseAuth) {
  var rootRef = new Firebase('https://buskrapp.firebaseio.com');
  var profilesRef = rootRef.child('profiles');

  var $auth = $firebaseAuth(rootRef);

  return {
    load: function () {
      var localUser = JSON.parse($window.localStorage.getItem('user'));
      $rootScope.user = localUser;

      return $rootScope.user;
    },
    save: function (user) {
      $window.localStorage.setItem('user', JSON.stringify(user));
      $rootScope.user = user;
    },
    create: function (newUser) {
      var _this = this;
      var deferred = $q.defer();

      $auth.$createUser(newUser.email, newUser.password, function (error, user) {
        var newProfileObj = {};

        if (error) {
          deferred.reject(error);
        } else {
          newProfileObj[user.uid] = {
            email: user.email,
            name: newUser.name || '',
            zipcode: newUser.zipcode || '',
            dob: newUser.dob || ''
          };

          profilesRef.set(newProfileObj, function (error) {
            if (error) {
              deferred.reject(new Error(error));
            } else {
              _this.save(newUser);
              deferred.resolve(newUser);
            }
          });
        }
      });

      return deferred.promise;
    },
    login: function (email, password) {
      email = email || '';
      password = password || '';

      var _this = this;
      var deferred = $q.defer();

      if (!email.length || !password.length) {
        deferred.reject(new Error('Please enter email and password'));
      } else {
        $auth.$login('password', {email:email, password:password}).then(
          function (userDetails) {
            profilesRef.child(userDetails.uid).on('value', function (profileDetails) {
              var user = {
                uid: userDetails.uid,
                email: userDetails.email,
                name: profileDetails.val().name,
                dob: profileDetails.val().dob,
                zipcode: profileDetails.val().zipcode
              };

              _this.save(user);
              deferred.resolve(user);
            });
          },
          function (error) {
            deferred.reject(error);
          }
        );
      }

      return deferred.promise;
    },
    logout: function () {
      $auth.$logout();

      delete $rootScope.user;
      $window.localStorage.removeItem('user');

      window.postMessage({
        action: 'userLogout'
      }, '*');
    }
  };
});

})(window.Firebase);
