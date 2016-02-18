angular.module('app')
.factory('SiteService', SiteService)
SiteService.$inject = ["$q", "$http", "ENDPOINT", "API", "FormSiteService",
                      "$cordovaSQLite", "WeeklyService", "VillagesService"]

function SiteService($q, $http, ENDPOINT, API, FormSiteService, $cordovaSQLite,
  WeeklyService, VillagesService) {
  var authToken = window.localStorage.getItem('authToken');

  function saveSiteToDB(site){
    var query = "INSERT INTO sites" +
                "(village_id , week_number, year, properties, files)" +
                "VALUES (?, ?, ?, ?, ?)";
    var village_id = VillagesService.getSelectedVillageId();
    var weekNumber = WeeklyService.getSelectedWeek();
    var year = WeeklyService.getSelectedYear();
    var siteData = [village_id, weekNumber, year, angular.toJson(site.properties), ""];
    $cordovaSQLite.execute(db, query, siteData)
      .then(function(res){
      console.log("Deleted : ", res);
    }, function(error){
      console.log('error : ', error);
    });
  }

  function uploadSites() {
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
    var query = "SELECT week_number, year, COUNT(*) AS number_sites FROM sites GROUP BY week_number";
    weeksMissingSend = $cordovaSQLite.execute(db, query).then(function(count){
      return count.rows;
    });
    return weeksMissingSend;
  }

  function getSiteByVillageIdInWeekYear(id) {
    var query = "SELECT * FROM sites WHERE village_id=? AND week_number=? AND year=?";
    var week = WeeklyService.getSelectedWeek();
    var year = WeeklyService.getSelectedYear();
    console.log('week : ', week);
    console.log('year : ', year);
    var site = $cordovaSQLite.execute(db, query, [id, week, year]).then(function(site){
      return site.rows;
    });
    return site;
  }

  return {
    saveSiteToDB: saveSiteToDB,
    uploadSites: uploadSites,
    removeSiteById: removeSiteById,
    getWeeksMissingSend: getWeeksMissingSend,
    getSiteByVillageIdInWeekYear: getSiteByVillageIdInWeekYear
  }
}
