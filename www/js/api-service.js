angular.module('app')
.factory('ApiService', ApiService)
ApiService.$inject = ["ENDPOINT", "API", "SessionsService"]

function ApiService(ENDPOINT, API, SessionsService) {
  layers =  "";
  places = "";
  placeParent = "";
  site = "";
  siteWeekYearPlaceId = "";

  function setApi(){
    var authToken = SessionsService.getAuthToken();
    layers = ENDPOINT.api + API.layers + authToken;
    places = ENDPOINT.api + API.places + authToken;
    placeParent = ENDPOINT.api + API.get_parent_place_by_village_ancestry + authToken;
    site = ENDPOINT.api + API.sites + authToken;
    siteWeekYearPlaceId = ENDPOINT.api + API.get_site_by_week_year_placeId + authToken;
  }

  function getLayersUrl() {
    return layers;
  }

  function getPlacesUrl() {
    return places;
  }

  function getPlaceParentUrl() {
    return placeParent;
  }

  function getSiteUrl() {
    return site;
  }

  function getSiteByWeekYearPlaceIdUrl() {
    return siteWeekYearPlaceId;
  }

  return{
    setApi: setApi,
    getLayersUrl: getLayersUrl,
    getPlacesUrl: getPlacesUrl,
    getPlaceParentUrl: getPlaceParentUrl,
    getSiteUrl: getSiteUrl,
    getSiteByWeekYearPlaceIdUrl: getSiteByWeekYearPlaceIdUrl
  }
}
