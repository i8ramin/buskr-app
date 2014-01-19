var FB_APP_ID = 574303185975176;

(function (Firebase) {

  var loginApp = angular.module('loginApp', [
    'ngAnimate',
    'ui.bootstrap',
    'UserModel',
    'buskrApp.filters',
    'buskrApp.services',
    'buskrApp.directives'
  ]);

  var emailView = new steroids.views.WebView({location:'views/login/email.html'});
  var typeSelectView = new steroids.views.WebView({location:'views/login/type-select.html'});
  var artistView = new steroids.views.WebView({location:'views/artist/index.html'});

  loginApp.run(function () {
    FB.init({
      appId: 574303185975176,
      nativeInterface: CDV.FB
    });
  });

  // Index: http://localhost/views/login/index.html
  loginApp.controller('LoginCtrl', function ($scope, User) {
    steroids.view.navigationBar.setButtons({
      overrideBackButton: true
    }, {
      onSuccess: function () {
        // steroids.view.navigationBar.show('');
      }
    });

    $scope.skipLogin = function () {
      window.postMessage({
        action: 'skipLogin'
      }, '*');
    };

    $scope.facebookLogin = function() {
      // steroids.layers.push(typeSelectView);

      $scope.loading = true;

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
      ).finally(function () {
        $scope.loading = false;
      });
    };

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

              $scope.loading = false;
            },
            onFailure: function (error) {
              if (error.errorDescription === 'A preloaded layer with this identifier already exists') {
                steroids.layers.push({
                  view: artistView,
                  navigationBar: false
                });
              } else {
                console.error('[EmailCtrl.submitLogin] ' + error.errorDescription);
              }

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

    $scope.userType = 'Audience';

    $scope.artistNext = function () {
      var performerDetailsView = new steroids.views.WebView({location:'views/login/performer-details.html'});

      if (navigator.notification.confirm('Creating account as a "Performer/Artist". Continue?')) {
        localStorage.setItem('newUser', $scope.newUser);
        steroids.layers.push(performerDetailsView);
      }
    };

    $scope.createUser = function () {
      $scope.hasErrors = false;
      $scope.loading = true;

      User.create($scope.newUser).then(
        function (newUser) {
          // User.save(newUser);
          // artistView.preload({}, {
          //   onSuccess: function () {
          //     steroids.layers.push({
          //       view: artistView,
          //       navigationBar: false
          //     });
          //   },
          //   onFailure: function (error) {
          //     alert(error.errorDescription);
          //     console.error(error.errorDescription);
          //     $scope.loading = false;
          //   }
          // });

          steroids.layers.push({
            view: artistView,
            navigationBar: false
          });
        },
        function (error) {
          alert(error);
          console.error(error);
          $scope.loading = false;
        }
      );
    };

    $scope.facebookLogin = function () {
      steroids.layers.push(typeSelectView);
    };
  });

  loginApp.controller('PerformerDetailsCtrl', function ($scope, User) {
    $scope.performerDetails = {};
  });

  loginApp.controller('TypeSelectCtrl', function ($scope, User) {
    $scope.selectAudience = function () {
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
    };
  });

  document.addEventListener('deviceready', function () {
    // var tf = new TestFlight();

    FastClick.attach(document.body);

    // tf.takeOff(function (data) {
    //   alert('TestFligh success! ' + data);
    // }, function (error) {
    //   alert('TestFlight error: ' + error);
    // }, '32984304-6d9a-4bbf-913e-40246035a8ac');

    steroids.view.setBackgroundColor('#fbc26b');
    angular.bootstrap(document, ['loginApp']);
  }, false);

  document.addEventListener('visibilitychange', function (event) {
    if (!document.hidden) {
    }
  }, false);

})(window.Firebase);
