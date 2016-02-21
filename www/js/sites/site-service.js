angular.module('app')
.factory('SiteService', SiteService)
SiteService.$inject = ["$q", "$http", "ENDPOINT", "API", "FormSiteService",
                      "$cordovaSQLite", "WeeklyService", "VillagesService"]

function SiteService($q, $http, ENDPOINT, API, FormSiteService, $cordovaSQLite,
  WeeklyService, VillagesService) {
  var authToken = window.localStorage.getItem('authToken');

  function saveSite(site){
    var query = "INSERT INTO sites" +
                "(village_id , week_number, year, properties, files)" +
                "VALUES (?, ?, ?, ?, ?)";
    var village_id = VillagesService.getSelectedVillageId();
    var weekNumber = WeeklyService.getSelectedWeek();
    var year = WeeklyService.getSelectedYear();
    var siteData = [village_id, weekNumber, year, angular.toJson(site.properties), ""];
    $cordovaSQLite.execute(db, query, siteData)
      .then(function(res){
      console.log("INSERT : ", res);
    }, function(error){
      console.log('error : ', error);
    });
  }

  function updateSite(site, siteId) {
    var query = "UPDATE sites SET properties=? WHERE id=?" ;
    var siteData = [angular.toJson(site.properties), siteId];
    $cordovaSQLite.execute(db, query, siteData)
      .then(function(res){
      console.log("update : ", res);
    }, function(error){
      console.log('error : ', error);
    });
  }

  function removeSiteById(id) {
    var query = "DELETE FROM sites WHERE id = ?";
    $cordovaSQLite.execute(db, query, [id])
      .then(function(res){
        console.log('remove : ', res);
      }, function(error){
        console.log('error : ', error);
      });
  }

  function getWeeksMissingSend() {
    var query = "SELECT week_number, year, COUNT(*) AS number_sites FROM sites GROUP BY week_number";
    weeksMissingSend = $cordovaSQLite.execute(db, query).then(function(count){
      var result = [];
      if(count.rows.length > 0) {
        for(var i = 0; i < count.rows.length; i++) {
          result.push(count.rows.item(i));
        }
      }
      return result;
    });
    return weeksMissingSend;
  }

  function getSiteByVillageIdInWeekYear(id) {
    var query = "SELECT * FROM sites WHERE village_id=? AND week_number=? AND year=?";
    var week = WeeklyService.getSelectedWeek();
    var year = WeeklyService.getSelectedYear();
    var site = $cordovaSQLite.execute(db, query, [id, week, year]).then(function(site){
      var result = [];
      if(site.rows.length > 0) {
        for(var i = 0; i < site.rows.length; i++) {
          result.push(site.rows.item(i));
        }
      }
      return result;
    });
    return site;
  }

  return {
    saveSite: saveSite,
    updateSite: updateSite,
    removeSiteById: removeSiteById,
    getWeeksMissingSend: getWeeksMissingSend,
    getSiteByVillageIdInWeekYear: getSiteByVillageIdInWeekYear
  }
}
