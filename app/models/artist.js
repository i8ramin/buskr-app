// The contents of individual model .js files will be concatenated into dist/models.js

(function() {

// Protects views where AngularJS is not loaded from errors
if ( typeof angular == 'undefined' ) {
	return;
};

var module = angular.module('ArtistModel', ['CornerCouch']);

module.factory('ArtistCouch', function(cornercouch) {
  var databaseName  = "artist",
      server        = cornercouch("http://.touchdb.", "GET"),
      database      = server.getDB(databaseName);

  // Set up two way replication with server and monitoring of the local database
  var steroidsDB    = new steroids.data.TouchDB({name: databaseName}),
      cloudUrl      = "https://agaislostarysedweentirwo:xd6DJbQA32ExBQ4LodWOKgDD@buskr.cloudant.com/artist";

  steroidsDB.replicateFrom({
    url: cloudUrl
  });

  database.getInfo().success(function() {
    console.log("Database " + databaseName + " loaded:" + JSON.stringify(database.info));
  });

  // Only run this once
  var startTwoWayReplication = function() {
    steroidsDB.addTwoWayReplica({
      url: cloudUrl
    }, {
      onSuccess: function() {
        console.log("Database " + databaseName + " replication was successful.");
      }, onFailure: function() {
        console.log("Database " + databaseName + " replication failed.");
      }
    });
  };

  var startOneWayReplication = function(cb) {
    steroidsDB.startReplication({
      source: cloudUrl,
      target: "artist"
    }, {
      onSuccess: function() {
        // alert("Replication started");
      },
      onFailure: function() {
        // alert("Could not start replication");
      }
    });

    steroidsDB.startMonitoringChanges({}, {
      onChange: cb
    });
  };

  // Monitor changes
  var startMonitoringChanges = function(onChangeCallback){
    steroidsDB.startMonitoringChanges({}, {
      onChange: onChangeCallback
    });
  };

  var ensureDB = function(onEnsuredCallback) {
    steroidsDB.createDB({}, {
      onSuccess: function() {
        console.log("Database has been created.");
        onEnsuredCallback()
      },
      onFailure: function(error) {
        if ( error.status == 412 ) {
          // Already exists
          onEnsuredCallback()
        } else {
          alert("Unable to create database: " + error.error);
        }
      }
    });
  }

  return {
    ensureDB: ensureDB,
    server: server,
    cornerCouchDB: database,
    keepInSync: startTwoWayReplication,
    startPollingChanges: startOneWayReplication,
    onChange: startMonitoringChanges,
    steroidsDB: steroidsDB
  }
});

})();
