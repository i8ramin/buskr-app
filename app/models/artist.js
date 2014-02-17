// The contents of individual model .js files will be concatenated into dist/models.js

(function() {

var module = angular.module('ArtistModel', [
  'jmdobry.angular-cache'
]);


module.factory('ArtistService', function ArtistService($q, $firebase, $angularCacheFactory) {

  Parse.initialize('FDL0TbPcLmxhov0YZKROC7eQ9xhiRHO46TRjdaLz', 'd5ePetdwvtVDTE1Gf4lkEexmwpis23T9yYgm1v86');

  var Artist = Parse.Object.extend('Artist');
  var query = new Parse.Query(Artist);

  // var artistsCache = $angularCacheFactory('artistsCache', {
  //   // This cache can hold 1000 items
  //   capacity: 1000,

  //   // Items added to this cache expire after 1 hour
  //   maxAge: 6000000,

  //   // Items will be actively deleted when they expire
  //   deleteOnExpire: 'aggressive',

  //   // This cache will check for expired items every 10 min
  //   recycleFreq: 600000,

  //   // This cache will clear itself every 4 hours
  //   cacheFlushInterval: 14400000,

  //   // This cache will sync itself with localStorage
  //   storageMode: 'localStorage',

  //   // Full synchronization with localStorage on every operation
  //   verifyIntegrity: true,

  //   // This callback is executed when the item specified by "key" expires.
  //   // At this point you could retrieve a fresh value for "key"
  //   // from the server and re-insert it into the cache.
  //   onExpire: function (key, value) {
  //     console.log('---------------- CACHE EXPIRED! --------------');

  //     if (key === 'artists') {
  //       reloadArtists();
  //     } else {
  //       reloadArtist(key);
  //     }
  //   }
  // });

  var reloadArtists = function () {
    var deferred = $q.defer();
    var artistsAsJSON;

    query.find({
      success: function (artists) {
        artistsAsJSON = artists.map(function (a) {return a.toJSON();});

        // if (artistsAsJSON && artistsAsJSON.length) {
        //   artistsCache.put('artists', artistsAsJSON);
        // }

        deferred.resolve(artistsAsJSON);
      },
      error: function(error) {
        deferred.reject(error);
      }
    });

    return deferred.promise;
  };

  var reloadArtist = function (id) {
    var deferred = $q.defer();
    var artistAsJSON;

    query.get(id, {
      success: function (artist) {
        artistAsJSON = artist.toJSON();

        // if (artistAsJSON) {
        //   artistsCache.put('artists/' + id, artistAsJSON);
        // }

        deferred.resolve(artist.toJSON());
      },
      error: function(error) {
        deferred.reject(error);
      }
    });

    return deferred.promise;
  };

  var loadAll = function () {
    var deferred = $q.defer();
    var artists; // = artistsCache.get('artists');

    if (artists) {
      console.log('[Buskr] Loading cached Artists...');

      deferred.resolve(artists);
      artists = deferred.promise;
    } else {
      console.log('[Buskr] Artists not cached. Warming cache...');
      artists = reloadArtists();
    }

    return artists;
  };

  var loadOne = function (id) {
    var deferred = $q.defer();
    var artist; // = artistsCache.get(id);

    if (artist) {
      console.log('[Buskr] Artist cached...', artist.name);

      deferred.resolve(artist);
      artist = deferred.promise;
    } else {
      console.log('[Buskr] Artist not cached. Warming cache...', id);
      artist = reloadArtist(id);
    }

    return artist;
  };

  return {
    all: loadAll,
    get: loadOne
  };
});

})();
