
(function () {
  'use strict';

  var gaPlugin;
  var paymentApp = angular.module('paymentApp', [
    'ngAnimate',
    'UserModel',
    'ArtistModel',
    'buskrApp.filters',
    'buskrApp.directives',
    'buskrApp.services'
  ]);

  var artistView = new steroids.views.WebView({id:'artistView', location:'views/artist/index.html'});

  document.addEventListener('deviceready', function () {
    gaPlugin = window.plugins.gaPlugin;
    gaPlugin.init(
      function () {
        // success
      },
      function () {
        // error
      },
      'UA-46274077-1',
      10
    );

    // ImgCache.options.debug = true;
    ImgCache.options.usePersistentCache = true;
    ImgCache.options.useDataURI = true;
    ImgCache.init(
      function () {
        angular.bootstrap(document, ['paymentApp']);
      },
      function () {
        angular.bootstrap(document, ['paymentApp']);
      }
    );
  });

  paymentApp.run(function () {
  });

  // Index: http://localhost/views/payment/add-card.html
  paymentApp.controller('AddCardCtrl', function ($scope) {
    // gaPlugin.trackPage($.noop, $.noop, 'views/payment/add-card');

    steroids.view.navigationBar.show('Add Card');
  });

  paymentApp.controller('ConfirmCtrl', function ($scope, ArtistService) {
    var id = steroids.view.params.id;
    var amount = steroids.view.params.amount;

    steroids.view.navigationBar.show('Confirm');

    $scope.amount = parseInt(amount, 10) / 100;

    ArtistService.get(id).then(
      function (artist) {
        $scope.artist = artist;
      }
    );

    $scope.confirm = function () {
      $scope.confirmed = true;
    };

    $scope.cancel = function () {
      steroids.layers.pop();
    };

    $scope.backToExplore = function () {
      // really hacky way to go back multiple
      // steps in the layer stack. hopefully
      // layers.pop() will take a param soon
      localStorage.setItem('backToExplore', true);
      steroids.layers.pop({}, {
        onSuccess: function () {},
        onFailure: function (error) {
          alert(error.errorDescription);
          console.error(error.errorDescription);
        }
      });
    };
  });
})();
