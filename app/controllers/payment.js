
(function (Firebase) {
  'use strict';

  var gaPlugin;
  var paymentApp = angular.module('paymentApp', [
    'ngAnimate',
    'firebase',
    'buskrApp.filters',
    'buskrApp.directives',
    'buskrApp.services'
  ]);

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
    // steroids.view.setBackgroundColor('#d2cbc3');
  });

  // Index: http://localhost/views/payment/add-card.html
  paymentApp.controller('AddCardCtrl', function ($scope) {
    // gaPlugin.trackPage($.noop, $.noop, 'views/artist/index');

    steroids.view.navigationBar.show('Add Card');
  });
})(window.Firebase);
