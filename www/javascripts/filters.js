(function () {
  'use strict';

  var filters = angular.module('buskrApp.filters', []);

  filters.filter('urlfriendly', function () {
    return function (text, separator) {
      var output,
        q_separator,
        translation = {},
        tags,
        commentsAndPhpTags,
        key,
        replacement,
        leadingTrailingSeparators;


      if (!text) {
        return text;
      }

      separator = separator || '-';

      //escape all possible regex characters in the separator to create a "searchable" separator
      //equivalent to preg_quote in php
      q_separator = (separator + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g'), '\\$&');

      //regex to replacement object
      translation['&.+?;'] = ''; //remove html entities
      translation['[^a-z0-9 _-]'] = ''; //remove anything other than alphanumeric, spaces, underscores and dashes
      translation['\\s+'] = separator; //change whitespace to separator (regexp requires extra escaping of backslashes)
      translation['(' + q_separator + ')+'] = separator; //change escaped separator to separator

      //strip html tags from the title
      tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
      commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
      output = text.replace(commentsAndPhpTags, '').replace(tags, '');

      //change!
      for (key in translation) {
        replacement = translation[key];
        key = new RegExp(key, 'ig');
        output = output.replace(key, replacement);
      }

      output = output.toLowerCase();

      // trim leading and trailing separators in case there was multiple spaces
      leadingTrailingSeparators = new RegExp('^' + q_separator + '+|' + q_separator + '+$');
      output = output.replace(leadingTrailingSeparators, '');

      // es5 trim out whitespace, make sure to polyfill this for older browsers
      output = output.trim();

      return output;
    };
  });

})();
