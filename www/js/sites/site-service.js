angular.module('app')
.factory('SiteService', SiteService)
SiteService.$inject = ["$q", "$http", "ENDPOINT", "API", "SessionsService", "FormSiteService",
                      "$cordovaSQLite", "WeeklyService", "VillagesService"]

function SiteService($q, $http, ENDPOINT, API, SessionsService, FormSiteService, $cordovaSQLite,
  WeeklyService, VillagesService) {
  var authToken = window.localStorage.getItem('authToken');

  function insertSite(site){
    var query = "INSERT INTO sites" +
                "(user_id, village_id , week_number, year, properties, files)" +
                "VALUES (?, ?, ?, ?, ?, ?)";
    var userId = SessionsService.getUserId();
    var villageId = VillagesService.getSelectedVillageId();
    var weekNumber = WeeklyService.getSelectedWeek();
    var year = WeeklyService.getSelectedYear();
    var siteData = [userId, villageId, weekNumber, year,
          angular.toJson(site.properties), angular.toJson(site.files)];
    $cordovaSQLite.execute(db, query, siteData)
      .then(function(res){
      console.log("INSERT : ", res);
    }, function(error){
      console.log('error : ', error);
    });
  }

  function updateSite(site, siteId) {
    var query = "UPDATE sites SET properties=?, files=? WHERE id=?" ;
    var siteData = [angular.toJson(site.properties), angular.toJson(site.files), siteId];
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

  function uploadSites(week, year) {
    getSitesInWeekYear(week, year).then(function(sites){
      angular.forEach(sites, function(site){
        var prepareSite = {"properties": angular.fromJson(site.properties),
                            "files": angular.fromJson(site.files)
                          }
        FormSiteService.saveSite(prepareSite).then(function(response){
          removeSiteById(site.id);
        });
      });
    });
  }

  function getNumberOfSitesInWeekYear(){
    var query = "SELECT COUNT(*) AS number_sites FROM sites "+
                "WHERE user_id=? AND week_number=? AND year=? ";
    var userId = SessionsService.getUserId();
    var week = WeeklyService.getSelectedWeek();
    var year = WeeklyService.getSelectedYear();
    numberOfSitesInWeekYear = $cordovaSQLite.execute(db, query, [userId, week, year]).then(function(count){
      return count.rows.item(0);
    });
    return numberOfSitesInWeekYear;
  }

  function getWeeksMissingSend() {
    var query = "SELECT week_number, year, COUNT(*) AS number_sites FROM sites "+
                "WHERE user_id=? GROUP BY week_number";
    var userId = SessionsService.getUserId();
    weeksMissingSend = $cordovaSQLite.execute(db, query, [userId]).then(function(count){
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

  function getSitesInWeekYear(week, year) {
    var query = "SELECT * FROM sites WHERE week_number=? AND year=? AND user_id=?";
    var userId = SessionsService.getUserId();
    var sites = $cordovaSQLite.execute(db, query, [week, year, userId]).then(function(site){
      var result = [];
      if(site.rows.length > 0) {
        for(var i = 0; i < site.rows.length; i++) {
          result.push(site.rows.item(i));
        }
      }
      return result;
    });
    return sites;
  }

  function getSiteByVillageIdInWeekYear(id) {
    var query = "SELECT * FROM sites WHERE village_id=? AND week_number=? AND year=? AND user_id=?";
    var userId = SessionsService.getUserId();
    var week = WeeklyService.getSelectedWeek();
    var year = WeeklyService.getSelectedYear();
    var site = $cordovaSQLite.execute(db, query, [id, week, year, userId]).then(function(site){
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
    insertSite: insertSite,
    updateSite: updateSite,
    uploadSites: uploadSites,
    removeSiteById: removeSiteById,
    getWeeksMissingSend: getWeeksMissingSend,
    getSiteByVillageIdInWeekYear: getSiteByVillageIdInWeekYear,
    getNumberOfSitesInWeekYear: getNumberOfSitesInWeekYear
  }
}
