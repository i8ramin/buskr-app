
document.addEventListener('deviceready', function () {

  Parse.initialize('FDL0TbPcLmxhov0YZKROC7eQ9xhiRHO46TRjdaLz', 'd5ePetdwvtVDTE1Gf4lkEexmwpis23T9yYgm1v86');

  if (window.FB) {
    FB.init({
      appId: 574303185975176,
      nativeInterface: CDV.FB
    });
  }

  // Parse.FacebookUtils.init({
  //   appId      : '574303185975176', // Facebook App ID
  //   nativeInterface: CDV.FB,
  //   channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
  //   status     : true, // check login status
  //   cookie     : true, // enable cookies to allow Parse to access the session
  //   xfbml      : true  // parse XFBML
  // });

}, false);
