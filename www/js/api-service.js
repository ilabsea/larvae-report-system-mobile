angular.module('app')
.factory('ApiService', ApiService)
ApiService.$inject = ["ENDPOINT", "API", "SessionsService"]

function ApiService(ENDPOINT, API, SessionsService) {
  layers =  "";
  places = "";
  placeParent = "";
  site = "";
  siteWeekYearPlaceId = "";
  memberships = "";
  updateSite = "";

  function setApi(){
    var authToken = SessionsService.getAuthToken();
    layers = ENDPOINT.api + API.layers + authToken;
    places = ENDPOINT.api + API.places + authToken;
    placeParent = ENDPOINT.api + API.get_parent_place_by_ancestry + authToken;
    siteWeekYearPlaceId = ENDPOINT.api + API.get_site_by_week_year_placeId + authToken;
    site = ENDPOINT.api + API.sites + authToken;
    memberships = ENDPOINT.api + API.place_memberships + authToken;
    updateSite = ENDPOINT.api + API.update_site;
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

  function getPlaceMembershipsUrl() {
    return memberships;
  }

  function getUpdateSiteUrl() {
    return updateSite;
  }

  return{
    setApi: setApi,
    getLayersUrl: getLayersUrl,
    getPlacesUrl: getPlacesUrl,
    getPlaceParentUrl: getPlaceParentUrl,
    getSiteUrl: getSiteUrl,
    getSiteByWeekYearPlaceIdUrl: getSiteByWeekYearPlaceIdUrl,
    getPlaceMembershipsUrl: getPlaceMembershipsUrl,
    getUpdateSiteUrl: getUpdateSiteUrl
  }
}
