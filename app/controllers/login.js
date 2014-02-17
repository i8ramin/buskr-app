var FB_APP_ID = 574303185975176;

(function () {

  var loginApp = angular.module('loginApp', [
    'ngAnimate',
    'ui.bootstrap',
    'UserModel',
    'buskrApp.filters',
    'buskrApp.services',
    'buskrApp.directives'
  ]);

  var emailView = new steroids.views.WebView({location:'views/login/email.html'});
  var signUpView = new steroids.views.WebView({location:'/views/login/signup.html'});
  var typeSelectView = new steroids.views.WebView({location:'views/login/type-select.html'});
  var performerDetailsView = new steroids.views.WebView({location:'views/login/performer-details.html'});

  var artistView = new steroids.views.WebView({id:'artistView', location:'views/artist/index.html'});

  loginApp.run(function () {
  });

  // Index: http://localhost/views/login/index.html
  loginApp.controller('LoginCtrl', function ($scope, User) {
    artistView.preload({id: 'artistView'}, {
      onSuccess: function () {
        steroids.view.navigationBar.hide();
      },
      onFailure: function (error) {
        alert(error.errorDescription);
      }
    });

    steroids.view.navigationBar.update({
      overrideBackButton: true
    }, {
      onSuccess: function() {
        steroids.splashscreen.hide();
      },
      onFailure: function() {
        alert('Failed to set Nav Bar buttons.');
      }
    });

    $scope.skipLogin = function () {
      steroids.layers.push({
        view: artistView
      }, {
        onSuccess: function () {},
        onFailure: function (error) {
          alert(error.errorDescription);
          console.error(error.errorDescription);
        }
      });
    };

    $scope.facebookLogin = function() {
      // steroids.layers.push(typeSelectView);

      $scope.loading = true;

      User.fbLogin().then(
        function (user) {
          steroids.layers.push({
            view: artistView
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
          steroids.layers.push({
            view: artistView,
            navigationBar: false
          }, {
            onSuccess: function () {
              $scope.loading = false;
            },
            onFailure: function (error) {
              alert(error.errorDescription);
              console.error(error.errorDescription);
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
      steroids.layers.push(signUpView);
    };
  });

  loginApp.controller('SignUpCtrl', function ($scope, User) {
    steroids.view.setBackgroundColor('#d2cbc3');
    steroids.view.navigationBar.show('Sign Up');

    $scope.userType = 'Audience';

    $scope.artistNext = function () {
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
          steroids.layers.push({
            view: artistView,
            navigationBar: false
          });
        },
        function (error) {
          alert(error.errorDescription);
          console.error(error.errorDescription);
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
      // User.fbLogin().then(
      //   function (user) {
      //     steroids.layers.push({
      //       view: artistView,
      //       navigationBar: false
      //     });
      //   },
      //   function (error) {
      //     alert(error);
      //     console.error(error);
      //   }
      // );
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

    // steroids.view.navigationBar.hide();
    steroids.view.setBackgroundColor('#fbc26b');

    angular.bootstrap(document, ['loginApp']);
  }, false);

  document.addEventListener('visibilitychange', function (event) {
  }, false);

})();
