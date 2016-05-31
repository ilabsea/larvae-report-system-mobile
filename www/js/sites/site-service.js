angular.module('app')
.factory('SiteService', SiteService)
SiteService.$inject = ["$q", "$http", "ApiService" , "SessionsService"]

function SiteService($q, $http, ApiService, SessionsService) {
  var site;

  function setSelectedSite(siteResult) {
    site = siteResult;
  }

  function getSelectedSiteId() {
    return site.id;
  }

  function saveSite(site) {
    return $q(function(resolve, reject) {
      $http.post(ApiService.getSiteUrl(), {"site": site})
        .success(function(response) {
          resolve(response);
        })
        .error(function(error){
          reject(error);
        });
    });
  }

  function fetchSiteByWeekYearPlaceId(week, year, placeId) {
    return $q(function(resolve, reject) {
      var dataAttr = {"week" : week, "year" : year , "place_id" : placeId};
      $http.get(ApiService.getSiteByWeekYearPlaceIdUrl(), {"params": dataAttr })
        .success(function(site) {
          setSelectedSite(site);
          resolve(site);
        })
        .error(function(error){
          reject(error);
        });
    });
  }

  function fetchSitesByWeekYear(week, year) {
    return $q(function(resolve, reject) {
      var dataAttr = {"week" : week, "year" : year};
      $http.get(ApiService.getSitesByWeekYearUrl(), {"params": dataAttr })
        .success(function(site) {
          resolve(site);
        })
        .error(function(error){
          reject(error);
        });
    });
  }

  function updateSite(siteData) {
    return $q(function(resolve, reject) {
      var authToken = SessionsService.getAuthToken();
      $http.put(ApiService.getUpdateSiteUrl() + site.id + ".json?authToken=" + authToken,
        {"site": siteData }).success(function(res) {
          resolve(res);
        })
        .error(function(error){
          reject('error ' + error);
        });
    });
  }

  return {
    saveSite: saveSite,
    updateSite: updateSite,
    fetchSiteByWeekYearPlaceId: fetchSiteByWeekYearPlaceId,
    fetchSitesByWeekYear: fetchSitesByWeekYear
  };
}
