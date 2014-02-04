// The contents of individual model .js files will be concatenated into dist/models.js

(function() {

// Protects views where AngularJS is not loaded from errors
if (typeof angular === 'undefined') {
	return;
}

var module = angular.module('UserModel', [
  'firebase'
]);

module.factory('User', function ($rootScope, $window, $q, $firebaseAuth) {
  // var rootRef = new Firebase('https://buskrapp.firebaseio.com');
  // var profilesRef = rootRef.child('profiles');

  // var $auth = $firebaseAuth(rootRef);

  return {
    load: function () {
      // var localUser = JSON.parse($window.localStorage.getItem('user'));
      $rootScope.user = Parse.User.current();

      return $rootScope.user;
    },
    save: function (user) {
      // $window.localStorage.setItem('user', JSON.stringify(user));
      $rootScope.user = user;

      $rootScope.$broadcast('user:saved', {
        user: user
      });
    },
    create: function (newUser) {
      var _this = this;
      var deferred = $q.defer();

      // var userToSave = {
      //   name: 'Test User'
      // };

      // _this.save(userToSave);
      // deferred.resolve(userToSave);

      var parseUser = new Parse.User();

      parseUser.set('username', newUser.email);
      parseUser.set('password', newUser.password);
      parseUser.set('email', newUser.email);

      parseUser.set('name', newUser.name);
      parseUser.set('zipcode', newUser.zipcode);
      parseUser.set('dob', moment(newUser.dob).format('YYYY-MM-DD'));

      parseUser.signUp(null, {
        success: function (user) {
          _this.save(user);
          deferred.resolve(user);
        },
        error: function (user, error) {
          alert('Error: ' + error.code + ' ' + error.message);
          deferred.reject(error);
        }
      });

      // $auth.$createUser(newUser.email, newUser.password, function (error, user) {
      //   var userToSave = {};
      //   var profilePushRef = profilesRef.push();

      //   if (error) {
      //     if (error.code === 'EMAIL_TAKEN') {
      //       _this.emailLogin(newUser.email, newUser.password).then(
      //         function (user) {
      //           deferred.resolve(user);
      //         },
      //         function (error) {
      //           deferred.reject(error);
      //         }
      //       );
      //     } else {
      //       deferred.reject(error);
      //     }
      //   } else {
      //     userToSave = {
      //       id: user.id,
      //       uid: user.uid,
      //       email: user.email,
      //       password: newUser.password,
      //       name: newUser.name,
      //       dob: newUser.dob ? moment(newUser.dob).format('YYYY-MM-DD') : '',
      //       provider: newUser.provider || 'password'
      //     };

      //     profilePushRef.set(userToSave, function (error) {
      //       if (error) {
      //         deferred.reject(error);
      //       } else {
      //         _this.save(userToSave);
      //         deferred.resolve(userToSave);
      //       }
      //     });
      //   }
      // });

      return deferred.promise;
    },
    fbLogin: function () {
      var _this = this;
      var deferred = $q.defer();
      var userToSave = {
        name: 'Test User'
      };

      // FB.login(function (response) {
      //   if (response.authResponse) {
      //     FB.api('/me', function (response) {
      //       var password = response.id;
      //       var newUser = {
      //         provider: 'facebook',
      //         username: response.username,
      //         email: response.email,
      //         password: password,
      //         name: response.name,
      //         dob: response.birthday
      //       };

      //       profilesRef.once('value', function (profileRef) {
      //         console.log();
      //       });

      //       _this.emailLogin(newUser.email, newUser.password).then(
      //         function (user) {
      //           deferred.resolve(user);
      //         },
      //         function (error) {
      //           _this.create(newUser).then(
      //             function (user) {
      //               deferred.resolve(user);
      //             },
      //             function (error) {
      //               deferred.reject(error);
      //             }
      //           );
      //         }
      //       );
      //     });
      //   } else {
      //     deferred.reject('User cancelled login or did not fully authorize.');
      //   }
      // }, {
      //   scope: 'email,user_birthday,user_location'
      // });

      window.postMessage({
        action: 'userLogin',
        user: userToSave
      }, '*');

      _this.save(userToSave);
      deferred.resolve(userToSave);

      return deferred.promise;
    },
    emailLogin: function (username, password) {
      var _this = this;
      var deferred = $q.defer();
      var userToSave = {
        name: 'Test User'
      };

      username = username || '';
      password = password || '';

      if (!username.length || !password.length) {
        deferred.reject(new Error('Please enter email and password'));
      } else {
        Parse.User.logIn(username, password, {
          success: function(user) {
            _this.save(user);
            deferred.resolve(user);

            $rootScope.$broadcast('user:login', {
              user: user
            });

            window.postMessage({
              action: 'userLogin',
              user: user
            }, '*');
          },
          error: function(user, error) {
            deferred.reject(error);
          }
        });

        // $auth.$login('password', {email:username, password:password}).then(
        //   function (userDetails) {
        //     profilesRef.once('value', function (profiles) {
        //       var profile;

        //       profiles.forEach(function (profileRef) {
        //         var profileDetails = profileRef.val();

        //         if (profileDetails.email === username) {
        //           profile = profileDetails;
        //         }
        //       });

        //       if (profile) {
        //         var user = {
        //           uid: userDetails.uid,
        //           email: userDetails.email,
        //           provider: profile.provider,
        //           name: profile.name,
        //           dob: profile.dob
        //         };

        //         _this.save(user);
        //         deferred.resolve(user);

        //         $rootScope.$broadcast('user:login', {
        //           user: user
        //         });

        //         window.postMessage({
        //           action: 'userLogin',
        //           user: user
        //         }, '*');
        //       } else {
        //         // profile not found
        //       }
        //     });
        //   },
        //   function (error) {
        //     deferred.reject(error);
        //   }
        // );
      }

      // window.postMessage({
      //   action: 'userLogin',
      //   user: userToSave
      // }, '*');

      // _this.save(userToSave);
      // deferred.resolve(userToSave);

      return deferred.promise;
    },
    logout: function () {
      Parse.User.logOut();
      delete $rootScope.user;

      // $auth.$logout();
      // $window.localStorage.removeItem('user');

      $rootScope.$broadcast('user:logout', {
      });

      window.postMessage({
        action: 'userLogout'
      }, '*');
    }
  };
});

})();
