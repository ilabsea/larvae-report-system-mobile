angular.module('app')

.service('SiteService', function($q, $http, ENDPOINT, API, FormSiteService, $cordovaSQLite){
  var authToken = window.localStorage.getItem('authToken');

  var saveSiteToDB = function(site){
    var query = "INSERT INTO sites" +
                "(properties, files)" +
                "VALUES (?, ?)";
    var siteData = [angular.toJson(site.properties), ""];
    $cordovaSQLite.execute(db, query, siteData)
        .then(function(res){
        console.log("Deleted : ", res);
      });
  }

  var uploadSites = function() {
    var query = "SELECT * FROM sites WHERE id= ? "
    $cordovaSQLite.execute(db, query, [6])
        .then(function(res){
        properties = angular.fromJson(res.rows[0].properties);
        prepareData = {"properties": properties};
        FormSiteService.saveSite(prepareData);
        console.log("Deleted : ", prepareData);
    });
  }

  return {
    saveSiteToDB: saveSiteToDB,
    uploadSites: uploadSites
  }
});
