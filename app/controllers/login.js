var FB_APP_ID = 574303185975176;

var loginApp = angular.module('loginApp', [
  'buskrApp.directives'
]);

loginApp.run(function () {
  steroids.view.setBackgroundColor('#fbc26b');
  // steroids.view.bounceShadow.hide();
});

// Index: http://localhost/views/login/index.html
loginApp.controller('LoginCtrl', function ($scope) {
  // steroids.view.setBackgroundColor('#d2cbc3');
  // steroids.view.navigationBar.show('');

  $scope.appId = FB_APP_ID;
  $scope.facebookLoginStatus = 'FB not initialized';
  $scope.facebookInitialized = false;

  $scope.skipLogin = function () {
    steroids.modal.hide();
  };

  $scope.facebookLogin = function() {
    $scope.facebookInit();

    if ($scope.facebookLoginStatus === 'Logged in') {
      alert('Already logged in!');
    } else {
      return FB.login(function (response) {
        if (response.authResponse) {
          FB.api('/me', function(response) {
            alert('Good to see you, ' + response.name + '.');
          });
        } else {
          alert('User cancelled login or did not fully authorize.');
        }

        return $scope.getFacebookLoginStatus();
      }, {
        scope: 'email'
      });
    }
  };

  $scope.facebookInit = function () {
    FB.init({
      appId: FB_APP_ID,
      nativeInterface: CDV.FB
    });

    $scope.facebookInitialized = true;
    $scope.getFacebookLoginStatus();
  };

  $scope.getFacebookLoginStatus = function() {
    FB.getLoginStatus(function (response) {
      var accessToken, uid;

      if (response.status === 'connected') {
        uid = response.authResponse.userID;
        accessToken = response.authResponse.accessToken;
        $scope.facebookLoginStatus = 'Logged in';
      } else if (response.status === 'not_authorized') {
        $scope.facebookLoginStatus = 'App not authorized';
      } else {
        $scope.facebookLoginStatus = 'Not logged in';
      }

      $scope.$apply();
    });
  };

  $scope.facebookFetch = function() {
    return FB.api('/me/friends', {
      fields: 'id, name, picture'
    }, function(response) {
      if (response.error) {
        return alert('Error! \n\n' + JSON.stringify(response.error));
      } else {
        return alert(JSON.stringify(response.data));
      }
    });
  };

  $scope.facebookDialog = function() {
    var params = {
      method: 'feed',
      name: 'Facebook Dialogs',
      link: 'https://developers.facebook.com/docs/reference/dialogs/',
      picture: 'http://fbrell.com/f8.jpg',
      caption: 'Reference Documentation',
      description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
    };

    return FB.ui(params, function(obj) {
      return alert('Dialog response: ' + JSON.stringify(obj));
    });
  };

  $scope.facebookLogout = function() {
    return FB.logout(function(response) {
      alert('Logged out: ' + JSON.stringify(response));
      return $scope.getFacebookLoginStatus();
    });
  };

  $scope.emailLogin = function () {
    $scope.view = 'email';
  };
});

loginApp.controller('EmailCtrl', function ($scope) {
  steroids.view.setBackgroundColor('#d2cbc3');
  steroids.view.navigationBar.show('Sign In');
});

loginApp.controller('FBCtrl', function ($scope) {
  steroids.view.setBackgroundColor('#d2cbc3');
  steroids.view.navigationBar.show('Sign In');
});

// ImgCache.options.debug = true;
// ImgCache.options.usePersistentCache = true;

document.addEventListener('deviceready', function () {
  var tf;

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
