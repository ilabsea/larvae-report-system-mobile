angular.module('app')
.factory('SiteSQLiteService', SiteSQLiteService)
SiteSQLiteService.$inject = ["SessionsService", "SiteService", "$cordovaSQLite", "WeeksService",
      "PlacesService", "$rootScope", "$state", "$ionicPopup"]

function SiteSQLiteService(SessionsService, SiteService, $cordovaSQLite, WeeksService, PlacesService,
    $rootScope, $state, $ionicPopup) {

  function insertSite(site){
    var query = "INSERT INTO sites" +
                "(user_id, place_id , name,  week_number, year, properties, files)" +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";
    var userId = SessionsService.getUserId();
    var placeId = PlacesService.getSelectedPlaceId();
    var weekNumber = WeeksService.getSelectedWeek();
    var year = WeeksService.getSelectedYear();
    var name = PlacesService.getSelectedPlace().name + "_" + weekNumber + "_" + year;
    var siteData = [userId, placeId, name, weekNumber, year,
          angular.toJson(site.properties), angular.toJson(site.files)];
    $cordovaSQLite.execute(db, query, siteData);
  }

  function updateSite(site, siteId) {
    var query = "UPDATE sites SET properties=?, files=? WHERE id=?" ;
    var siteData = [angular.toJson(site.properties), angular.toJson(site.files), siteId];
    $cordovaSQLite.execute(db, query, siteData);
  }

  function removeSiteById(id) {
    var query = "DELETE FROM sites WHERE id = ?";
    $cordovaSQLite.execute(db, query, [id]);
  }

  function uploadSites(week, year) {
    getSitesInWeekYear(week, year).then(function(sites){
      angular.forEach(sites, function(site, key){
        var prepareSite = { "name": site.name,
                            "week": site.week_number, "year" : site.year,
                            "place_id" : site.place_id,
                            "properties": angular.fromJson(site.properties),
                            "files": angular.fromJson(site.files)
                          }
        SiteService.saveSite(prepareSite).then(function(response){
          removeSiteById(site.id);
          if(key == sites.length -1){
            $rootScope.hideSpinner();
            $state.go('weeks-calendar')
          }
        }, function(e){
          $rootScope.hideSpinner();
          var ul = "Please fill all required data before submitting to server of " + prepareSite.name + "<ul>";
          var i = 0,
              l = e.properties.length
          for(; i < l ; i++){
            var key = Object.keys(e.properties[i])[0];
            ul += "<li class='bullet-list'>" + e.properties[i][key] + "</li>";
          }
          $ionicPopup.alert({
            title: 'Cannot upload data',
            template: ul + "</ul>",
            okType: 'default-button'
          });
        });
      });
    });
  }

  function getNumberOfSitesInWeekYear(){
    var query = "SELECT COUNT(*) AS number_sites FROM sites "+
                "WHERE user_id=? AND week_number=? AND year=? ";
    var userId = SessionsService.getUserId();
    var week = WeeksService.getSelectedWeek();
    var year = WeeksService.getSelectedYear();
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
        var i = 0,
            len = count.rows.length
        for(; i < len; i++) {
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
      len = site.rows.length
      if(len > 0) {
        var i = 0
        for(; i < len; i++) {
          result.push(site.rows.item(i));
        }
      }
      return result;
    });
    return sites;
  }

  function getSiteByPlaceIdInWeekYear(id) {
    var query = "SELECT * FROM sites WHERE place_id=? AND week_number=? AND year=? AND user_id=?";
    var userId = SessionsService.getUserId();
    var week = WeeksService.getSelectedWeek();
    var year = WeeksService.getSelectedYear();
    var site = $cordovaSQLite.execute(db, query, [id, week, year, userId]).then(function(site){
      var result = [];
      len = site.rows.length
      if(len > 0) {
        var i = 0
        for(; i < len ; i++) {
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
    getSiteByPlaceIdInWeekYear: getSiteByPlaceIdInWeekYear,
    getNumberOfSitesInWeekYear: getNumberOfSitesInWeekYear
  }
}
