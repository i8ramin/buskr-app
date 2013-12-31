var FB_APP_ID = 574303185975176;

(function (Firebase) {

  var loginApp = angular.module('loginApp', [
    'UserModel',
    'buskrApp.services',
    'buskrApp.directives'
  ]);

  var emailView = new steroids.views.WebView({location:'views/login/email.html'});
  var artistView = new steroids.views.WebView({location:'views/artist/index.html'});

  loginApp.run(function (User) {
    // steroids.view.setBackgroundColor('#fbc26b');
    // steroids.view.bounceShadow.hide();

    var user = User.load();

    if (user) {
      artistView.preload({}, {
        onSuccess: function () {
          steroids.layers.push({
            view: artistView,
            navigationBar: false
          });
        },
        onFailure: function (error) {
          console.error(error.errorDescription);
        }
      });
    }
  });

  // Index: http://localhost/views/login/index.html
  loginApp.controller('LoginCtrl', function ($scope, User) {
    steroids.view.setBackgroundColor('#fbc26b');
    steroids.view.navigationBar.setButtons({
      overrideBackButton: true
    }, {
      onSuccess: function() {
      },
      onFailure: function() {
      }
    });

    steroids.view.navigationBar.show('');

    $scope.appId = FB_APP_ID;
    $scope.facebookLoginStatus = 'FB not initialized';
    $scope.facebookInitialized = false;

    $scope.skipLogin = function () {
      window.postMessage({
        action: 'skipLogin'
      }, '*');
    };

    $scope.facebookLogin = function() {
      // $scope.facebookInit();

      User.fbLogin().then(
        function (user) {
          steroids.layers.push({
            view: artistView,
            navigationBar: false
          });
        },
        function (error) {
          alert(error);
          console.error(error);
        }
      );

      // if ($scope.facebookLoginStatus === 'Logged in') {
      //   alert('Already logged in!');
      // } else {
      //   return FB.login(function (response) {
      //     if (response.authResponse) {
      //       FB.api('/me', function(response) {
      //         alert('Good to see you, ' + response.name + '.');
      //       });
      //     } else {
      //       alert('User cancelled login or did not fully authorize.');
      //     }

      //     return $scope.getFacebookLoginStatus();
      //   }, {
      //     scope: 'email'
      //   });
      // }
    };

    // $scope.facebookInit = function () {
    //   FB.init({
    //     appId: FB_APP_ID,
    //     nativeInterface: CDV.FB
    //   });

    //   $scope.facebookInitialized = true;
    //   $scope.getFacebookLoginStatus();
    // };

    // $scope.getFacebookLoginStatus = function() {
    //   FB.getLoginStatus(function (response) {
    //     var accessToken, uid;

    //     if (response.status === 'connected') {
    //       uid = response.authResponse.userID;
    //       accessToken = response.authResponse.accessToken;
    //       $scope.facebookLoginStatus = 'Logged in';
    //     } else if (response.status === 'not_authorized') {
    //       $scope.facebookLoginStatus = 'App not authorized';
    //     } else {
    //       $scope.facebookLoginStatus = 'Not logged in';
    //     }

    //     $scope.$apply();
    //   });
    // };

    // $scope.facebookFetch = function() {
    //   return FB.api('/me/friends', {
    //     fields: 'id, name, picture'
    //   }, function(response) {
    //     if (response.error) {
    //       return alert('Error! \n\n' + JSON.stringify(response.error));
    //     } else {
    //       return alert(JSON.stringify(response.data));
    //     }
    //   });
    // };

    // $scope.facebookDialog = function() {
    //   var params = {
    //     method: 'feed',
    //     name: 'Facebook Dialogs',
    //     link: 'https://developers.facebook.com/docs/reference/dialogs/',
    //     picture: 'http://fbrell.com/f8.jpg',
    //     caption: 'Reference Documentation',
    //     description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
    //   };

    //   return FB.ui(params, function(obj) {
    //     return alert('Dialog response: ' + JSON.stringify(obj));
    //   });
    // };

    // $scope.facebookLogout = function() {
    //   return FB.logout(function(response) {
    //     alert('Logged out: ' + JSON.stringify(response));
    //     return $scope.getFacebookLoginStatus();
    //   });
    // };

    $scope.emailLogin = function () {
      steroids.layers.push(emailView);
    };
  });

  loginApp.controller('EmailCtrl', function ($scope, $window, User) {
    steroids.view.setBackgroundColor('#d2cbc3');
    steroids.view.navigationBar.show('Sign In');

    $scope.submitLogin = function () {
      $scope.hasErrors = false;
      $scope.loading = true;

      User.emailLogin($scope.email, $scope.password).then(
        function (user) {
          artistView.preload({}, {
            onSuccess: function () {
              steroids.layers.push({
                view: artistView,
                navigationBar: false
              });
            },
            onFailure: function (error) {
              console.error(error.errorDescription);
              $scope.loading = false;
            }
          });
        },
        function (error) {
          $scope.hasErrors = true;
          $scope.loading = false;

          $window.setTimeout(function () {
            $scope.$apply(function () {
              $scope.hasErrors = false;
            });
          }, 1000);
        }
      );
    };

    $scope.signUp = function () {
      var signUpView = new steroids.views.WebView({location:'/views/login/signup.html'});
      steroids.layers.push(signUpView);
    };
  });

  loginApp.controller('SignUpCtrl', function ($scope, User) {
    steroids.view.setBackgroundColor('#d2cbc3');
    steroids.view.navigationBar.show('Sign Up');

    // var rootRef = new Firebase('https://buskrapp.firebaseio.com');
    // var profilesRef = rootRef.child('profiles');

    // var $auth = $firebaseAuth(rootRef);
    // var $profiles = $firebase(profilesRef);

    $scope.createUser = function () {
      $scope.hasErrors = false;
      $scope.loading = true;

      User.create($scope.newUser).then(
        function (newUser) {
          // User.save(newUser);
          artistView.preload({}, {
            onSuccess: function () {
              steroids.layers.push({
                view: artistView,
                navigationBar: false
              });
            },
            onFailure: function (error) {
              alert(error.errorDescription);
              console.error(error.errorDescription);
              $scope.loading = false;
            }
          });
        },
        function (error) {
          alert(error);
          console.error(error);
          $scope.loading = false;
        }
      );
    };
  });

  document.addEventListener('deviceready', function () {
    // var tf;

    FastClick.attach(document.body);
    // ImgCache.init();

    // tf = new TestFlight();

    // tf.takeOff(function (data) {
    //   alert('TestFligh success! ' + data);
    // }, function (error) {
    //   alert('TestFlight error: ' + error);
    // }, '32984304-6d9a-4bbf-913e-40246035a8ac');

    angular.bootstrap(document, ['loginApp']);
  }, false);

  // document.addEventListener('visibilitychange', function (event) {
  // }, false);

})(window.Firebase);
