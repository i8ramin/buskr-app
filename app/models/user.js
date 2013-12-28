// The contents of individual model .js files will be concatenated into dist/models.js

(function() {

// Protects views where AngularJS is not loaded from errors
if (typeof angular === 'undefined') {
	return;
}

var module = angular.module('UserModel', ['CornerCouch']);

module.factory('UserCouch', function ($http, cornercouch) {
  var databaseName  = 'users',
      server        = cornercouch('http://.touchdb.', 'GET'),
      database      = server.getDB(databaseName);

  // Set up two way replication with server and monitoring of the local database
  var steroidsDB    = new steroids.data.TouchDB({name: databaseName}),
      cloudUrl      = 'https://tokofellarivandiatuidedl:sx8J4jHWjY6jLi6DNsD4fyN1@buskr.cloudant.com/' + databaseName;

  // Disable http credentials so CORS works
  // FYI this is set to true in angular-cornercouch
  $http.defaults.withCredentials = false;

  // steroidsDB.replicateFrom({
  //   url: cloudUrl
  // }, {
  //   onSuccess: function () {
  //     // alert('[replicateFrom] success');
  //     console.log('[replicateFrom] success');
  //   },
  //   onFailure: function (response) {
  //     alert('[replicateFrom] fail ' + response);
  //   }
  // });

  database.getInfo().success(function () {
    console.log('Database ' + databaseName + ' loaded:' + JSON.stringify(database.info));
  });

  // Only run this once
  var startTwoWayReplication = function () {
    steroidsDB.addTwoWayReplica({
      url: cloudUrl
    }, {
      onSuccess: function() {
        // alert('[startTwoWayReplication] Database ' + databaseName + ' replication was successful.');
        console.log('[startTwoWayReplication]Database ' + databaseName + ' replication was successful.');
      }, onFailure: function() {
        alert('[startTwoWayReplication] Database ' + databaseName + ' replication failed.');
        console.log('[startTwoWayReplication] Database ' + databaseName + ' replication failed.');
      }
    });
  };

  var startOneWayReplication = function (onChangeCallback) {
    var options = {
      source: databaseName,
      target: cloudUrl
    };

    var callbacks = {
      onSuccess: function() {
        // alert('[startOneWayReplication] Replication started');
        console.log('[startOneWayReplication] Replication started');
      },
      onFailure: function() {
        alert('[startOneWayReplication] Could not start replication');
      }
    };

    steroidsDB.startReplication(options, callbacks);
    steroidsDB.startMonitoringChanges({}, {
      onChange: onChangeCallback
    });
  };

  // Monitor changes
  var startMonitoringChanges = function (onChangeCallback) {
    steroidsDB.startMonitoringChanges({}, {
      onChange: onChangeCallback
    });
  };

  var ensureDB = function (onEnsuredCallback) {
    steroidsDB.createDB({}, {
      onSuccess: function() {
        console.log('Database has been created.');

        if (onEnsuredCallback) {
          onEnsuredCallback.call();
        }
      },
      onFailure: function(error) {
        if (error.status === 412) {
          if (onEnsuredCallback) {
            onEnsuredCallback.call();
          }
        } else {
          alert('[ensureDB] Unable to create database: ' + error.error);
        }
      }
    });
  };

  return {
    ensureDB: ensureDB,
    server: server,
    cornerCouchDB: database,
    keepInSync: startTwoWayReplication,
    startPollingChanges: startOneWayReplication,
    onChange: startMonitoringChanges,
    steroidsDB: steroidsDB
  };
});

})();
