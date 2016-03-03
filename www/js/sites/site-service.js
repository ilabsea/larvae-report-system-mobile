angular.module('app')
.factory('SiteService', SiteService)
SiteService.$inject = ["$q", "$http", "ApiService"]

function SiteService($q, $http, ApiService) {

  function saveSite(site) {
    return $q(function(resolve, reject) {
      $http.post(ApiService.getSiteUrl(), {"site": site})
        .success(function(response) {
          resolve(response);
        })
        .error(function(error){
          reject('error ' + error);
        });
    });
  }

  function fetchSiteByWeekYearPlaceId(week, year, placeId) {
    return $q(function(resolve, reject) {
      var dataAttr = {"week" : week, "year" : year , "place_id" : placeId};
      $http.get(ApiService.getSiteByWeekYearPlaceIdUrl(), {"params": dataAttr })
        .success(function(site) {
          resolve(site);
        })
        .error(function(error){
          reject('error ' + error);
        });
    });
  }

  return {
    saveSite: saveSite,
    fetchSiteByWeekYearPlaceId: fetchSiteByWeekYearPlaceId
  };
}
