// The contents of individual model .js files will be concatenated into dist/models.js

(function() {

// Protects views where AngularJS is not loaded from errors
if (typeof angular === 'undefined') {
	return;
}

var module = angular.module('ArtistModel', [
  'jmdobry.angular-cache'
]);


module.factory('ArtistService', function ArtistService($q, $firebase, $angularCacheFactory) {

  var reloadArtists = function () {
    var deferred = $q.defer();
    var artists = $firebase(new Firebase('https://buskrapp.firebaseio.com/artists'));

    console.log('[Buskr] Reloading artists cache...');

    artists.$on('loaded', function (a) {
      console.log('[Buskr] ' + artists.$getIndex().length + ' artists cached.');
      // console.log(a);

      artistsCache.put('artists', a);
      deferred.resolve(a);
    });

    return deferred.promise;
  };

  var reloadArtist = function (id) {
    var deferred = $q.defer();
    var artist = $firebase(new Firebase('https://buskrapp.firebaseio.com/artists/' + id));

    console.log('[Buskr] Reloading artist cache...', id);

    artist.$on('loaded', function (a) {
      console.log('[Buskr] Artist cached.', id);
      // console.log(a);

      artistsCache.put(id, a);
      deferred.resolve(a);
    });

    return deferred.promise;
  };

  var artistsCache = $angularCacheFactory('artistsCache', {
    // This cache can hold 1000 items
    capacity: 1000,

    // Items added to this cache expire after 1 hour
    maxAge: 6000000,

    // Items will be actively deleted when they expire
    deleteOnExpire: 'aggressive',

    // This cache will check for expired items every 10 min
    recycleFreq: 600000,

    // This cache will clear itself every 4 hours
    cacheFlushInterval: 14400000,

    // This cache will sync itself with localStorage
    storageMode: 'localStorage',

    // Full synchronization with localStorage on every operation
    verifyIntegrity: true,

    // This callback is executed when the item specified by "key" expires.
    // At this point you could retrieve a fresh value for "key"
    // from the server and re-insert it into the cache.
    onExpire: function (key, value) {
      console.log('---------------- CACHE EXPIRED! --------------');

      if (key === 'artists') {
        reloadArtists();
      } else {
        reloadArtist(key);
      }
    }
  });

  var loadAll = function () {
    // var deferred = $q.defer();
    // var artists = artistsCache.get('artists');

    // if (artists) {
    //   console.log('[Buskr] Artists cached...');

    //   deferred.resolve(artists);
    //   artists = deferred.promise;
    // } else {
    //   console.log('[Buskr] Artists not cached. Warming cache...');
    //   artists = reloadArtists();
    // }

    // return artists;

    return reloadArtists();
  };

  var loadOne = function (id) {
    var deferred = $q.defer();
    var artist = artistsCache.get(id);

    if (artist) {
      console.log('[Buskr] Artist cached...', artist.name);

      deferred.resolve(artist);
      artist = deferred.promise;
    } else {
      console.log('[Buskr] Artist not cached. Warming cache...', id);
      artist = reloadArtist(id);
    }

    return artist;

    // return reloadArtist(id);
  };

  return {
    all: loadAll,
    get: loadOne
  };
});

})();
