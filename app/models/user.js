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

      $rootScope.$broadcast('user:saved', {
        user: user
      });
    },
    create: function (newUser) {
      var _this = this;
      var deferred = $q.defer();

      $auth.$createUser(newUser.email, newUser.password, function (error, user) {
        var newProfileObj = {};
        var userToSave = {};

        if (error) {
          deferred.reject(error);
        } else {
          userToSave = {
            id: user.id,
            uid: user.uid,
            email: user.email,
            name: newUser.name,
            dob: newUser.dob,
            provider: newUser.provider
          };

          newProfileObj[user.uid] = {
            email: newUser.email,
            name: newUser.name || '',
            dob: newUser.dob ? moment(newUser.dob).format('YYYY-MM-DD') : '',
            provider: newUser.provider || 'email'
          };

          profilesRef.set(newProfileObj, function (error) {
            if (error) {
              deferred.reject(error);
            } else {
              _this.save(userToSave);
              deferred.resolve(userToSave);
            }
          });
        }
      });

      return deferred.promise;
    },
    fbLogin: function () {
      var _this = this;
      var deferred = $q.defer();

      FB.login(function (response) {
        if (response.authResponse) {
          FB.api('/me', function (response) {
            var password = response.id;
            var newUser = {
              provider: 'facebook',
              username: response.username,
              email: response.email,
              password: password,
              name: response.name,
              dob: response.birthday
            };

            _this.emailLogin(newUser.email, newUser.password).then(
              function (user) {
                deferred.resolve(user);
              },
              function (error) {
                _this.create(newUser).then(
                  function (user) {
                    deferred.resolve(user);
                  },
                  function (error) {
                    deferred.reject(error);
                  }
                );
              }
            );
          });
        } else {
          deferred.reject('User cancelled login or did not fully authorize.');
        }
      }, {
        scope: 'email,user_birthday,user_location'
      });

      return deferred.promise;
    },
    emailLogin: function (email, password) {
      var _this = this;
      var deferred = $q.defer();

      email = email || '';
      password = password || '';

      if (!email.length || !password.length) {
        deferred.reject(new Error('Please enter email and password'));
      } else {
        $auth.$login('password', {email:email, password:password}).then(
          function (userDetails) {
            profilesRef.child(userDetails.uid).on('value', function (profileDetails) {
              var user = {
                uid: userDetails.uid,
                email: userDetails.email,
                provider: profileDetails.val().provider,
                name: profileDetails.val().name,
                dob: profileDetails.val().dob
              };

              _this.save(user);
              deferred.resolve(user);

              $rootScope.$broadcast('user:login', {
                user: user
              });

              window.postMessage({
                action: 'userLogin',
                user: user
              }, '*');
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

      $rootScope.$broadcast('user:logout', {
      });

      window.postMessage({
        action: 'userLogout'
      }, '*');
    }
  };
});

})(window.Firebase);
