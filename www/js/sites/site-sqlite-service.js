angular.module('app')
.factory('SiteSQLiteService', SiteSQLiteService)
SiteSQLiteService.$inject = ["SessionsService", "SiteService", "$cordovaSQLite", "WeeksService",
      "PlacesService", "$rootScope", "$state", "$ionicPopup", "$translate"]

function SiteSQLiteService(SessionsService, SiteService, $cordovaSQLite, WeeksService, PlacesService,
    $rootScope, $state, $ionicPopup, $translate) {

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

  function deleteSiteByPlaceWeekYear(placeId) {
    var weekNumber = WeeksService.getSelectedWeek();
    var year = WeeksService.getSelectedYear();
    var query = "DELETE FROM sites WHERE place_id= ? AND week_number=? AND year=?";
    $cordovaSQLite.execute(db, query, [placeId, weekNumber, year]);
  }



  function uploadSites(week, year, placesWithReport) {
    var placesWithInvalidReport = [];
    $rootScope.showSpinner();
    angular.forEach(placesWithReport, function(place, index){
      if(!place.siteInvalid){
        getSiteByPlaceIdInWeekYear(place.place_id).then(function(site){
          if(site.length > 0){
            var prepareSite = { "name": site[0].name,
                                "week": site[0].week_number, "year" : site[0].year,
                                "place_id" : site[0].place_id,
                                "properties": angular.fromJson(site[0].properties),
                                "files": angular.fromJson(site[0].files)
                              };
            SiteService.saveSite(prepareSite).then(function(response){
              removeSiteById(site[0].id);
              place.hasData = false;
              place.siteOnServer = true;
              $rootScope.hideSpinner();
            });
          }
        });
      }else{
        placesWithInvalidReport.push(place);
      }
    });
    if(placesWithInvalidReport.length > 0){
      var ul = $translate.instant("place.please_fill_all_required_data_before_uploading_to_malaria_station_of_report_in_places") + "<ul>";
      var i = 0,
          l = placesWithInvalidReport.length
      for(; i < l ; i++){
        ul += "<li class='bullet-list'>" + placesWithInvalidReport[i].name + "</li>";
      }
      $ionicPopup.alert({
        title: $translate.instant("place.cannot_upload_reports"),
        template: ul + "</ul>",
        okType: 'default-button'
      }).then(function(res){
        if(res)
          $rootScope.hideSpinner();
      });
    }
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

  function getWeeksMissingSend(selectedYear) {
    var query = "SELECT week_number, year, COUNT(*) AS number_sites FROM sites "+
                "WHERE user_id=? AND year=? GROUP BY week_number";
    var userId = SessionsService.getUserId();
    weeksMissingSend = $cordovaSQLite.execute(db, query, [userId, selectedYear]).then(function(count){
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

  function getSitesByWeekYear(week, year) {
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
    getNumberOfSitesInWeekYear: getNumberOfSitesInWeekYear,
    deleteSiteByPlaceWeekYear: deleteSiteByPlaceWeekYear,
    getSitesByWeekYear: getSitesByWeekYear
  }
}
