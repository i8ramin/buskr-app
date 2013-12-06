// var app = angular.module('buskrApp', [
// ]);

DRAWER_OPEN = false;

ImgCache.options.debug = true;
ImgCache.options.usePersistentCache = true;

document.addEventListener("deviceready", function () {
  // var tf;

  FastClick.attach(document.body);
  ImgCache.init();

  // tf = new TestFlight();

  // tf.takeOff(function (data) {
  //   alert('TestFligh success! ' + data);
  // }, function (error) {
  //   alert('TestFlight error: ' + error);
  // }, "32984304-6d9a-4bbf-913e-40246035a8ac");

  // angular.bootstrap(document, ['buskrApp']);
}, false);

steroids.on('ready', function() {
  // var loginView = new steroids.views.WebView("http://localhost/views/login/index.html");

  // steroids.modal.show(loginView);
  // steroids.layers.push(loginView);

  steroids.view.setBackgroundColor("#d2cbc3");
  steroids.view.bounceShadow.hide();
});
