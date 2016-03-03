angular.module('app')
.factory('FormSiteService', FormSiteService)
FormSiteService.$inject = ["$q", "$http", "ApiService", "SessionsService", "WeeksService", "PlacesService"]

function FormSiteService($q, $http, ApiService, SessionsService,
          WeeksService, PlacesService) {
  var collection_id = "";
  var dateFieldsId = [];
  var photoFieldsId = [];

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

  function getDateFieldsId() {
    return dateFieldsId;
  }

  function getPicture(options) {
    var q = $q.defer();

    navigator.camera.getPicture(function(result) {
      q.resolve(result);
    }, function(err) {
      q.reject(err);
    }, options);

    return q.promise;
  }

  function getPhotoFieldsid() {
    return photoFieldsId;
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
    getDateFieldsId: getDateFieldsId,
    getPicture: getPicture,
    getPhotoFieldsid: getPhotoFieldsid,
    fetchSiteByWeekYearPlaceId: fetchSiteByWeekYearPlaceId
  };
}
