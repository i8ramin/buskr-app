(function () {
  'use strict';

  var directives = angular.module('buskrApp.directives', []);

  directives.directive('manageDrawer', function ManageDrawer(NavbarService) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        // element.on('touchstart', function (e) {
        //   if (NavbarService.navBar.drawer.visible) {
        //     e.preventDefault();
        //     e.stopPropagation();

        //     window.postMessage({
        //       action: 'toggleDrawer'
        //     }, '*');

        //     // steroids.drawers.hide({}, {
        //     //   onSuccess: function () {
        //     //   },
        //     //   onFailure: function(error) {
        //     //     alert('Could not hide the drawer: ' + error.errorDescription);
        //     //   }
        //     // });
        //   }
        // });
      }
    };
  });

  directives.directive('cacheSrc', function CacheSrc() {
    return {
      restrict: 'A',
      scope: false,
      priority: -1,
      link: function (scope, element, attr) {
        attr.$observe('ngSrc', function (src) {
          if (src && src.length) {
            ImgCache.isCached(src, function(data, success) {
              if (success) {
                ImgCache.useCachedFileWithSource(element, src);
              } else {
                ImgCache.cacheFile(src, function () {
                  ImgCache.useCachedFileWithSource(element, src);
                });
              }
            });
          }
        });
      }
    };
  });

  directives.directive('cacheBg', function CacheBG() {
    return {
      restrict: 'A',
      scope: false,
      priority: -1,
      link: function (scope, element, attr) {
        var bgUrlRegexp = /url\((.+\.(jpg|jpeg|png))\)/;
        var bgUrlMatches;
        var imgSrc;

        // TODO Fixme and re-enable again
        return;

        attr.$observe('ngStyle', function (style) {
          bgUrlMatches = bgUrlRegexp.exec(style);

          console.log('################ cacheBg #############');
          console.log(style);
          console.log(attr.style);
          console.log(bgUrlMatches);

          // did not find a bg image, so exit
          if (!bgUrlMatches) {
            return;
          }

          imgSrc = bgUrlMatches[1];

          console.log(imgSrc);

          ImgCache.isCached(imgSrc, function(data, success) {
            console.log('success', success);
            console.log(data);

            if (success) {
              ImgCache.useCachedBackground(element);
            } else {
              ImgCache.cacheBackground(element);
            }
          });

        });
      }
    };
  });

})();
