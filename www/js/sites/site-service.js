angular.module('app')

.service('SiteService', function($q, $http, ENDPOINT, API,
  FormSiteService, $cordovaSQLite, WeeklyService){
  var authToken = window.localStorage.getItem('authToken');

  var saveSiteToDB = function(site){
    var query = "INSERT INTO sites" +
                "(week_number, properties, files)" +
                "VALUES (?, ?, ?)";

    var weekNumber = WeeklyService.getSelectedWeek();
    console.log('weekNumber : ', weekNumber);
    var siteData = [weekNumber, angular.toJson(site.properties), ""];
    $cordovaSQLite.execute(db, query, siteData)
      .then(function(res){
      console.log("Deleted : ", res);
    }, function(error){
      console.log('error : ', error);
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

  function removeSiteById(id) {
    var query = "DELETE FROM sites WHERE id = ?";
    $cordovaSQLite.execute(db, query, [id])
      .then(function(res){
        console.log('delete : ', res);
      }, function(error){
        console.log('error : ', error);
      });
  }

  function getWeeksMissingSend() {
    var query = "SELECT week_number, COUNT(*) AS number_sites FROM sites GROUP BY week_number";
    weeksMissingSend = $cordovaSQLite.execute(db, query).then(function(count){
      return count.rows;
    });
    return weeksMissingSend;
  }

  return {
    saveSiteToDB: saveSiteToDB,
    uploadSites: uploadSites,
    removeSiteById: removeSiteById,
    getWeeksMissingSend: getWeeksMissingSend
  }
});
