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
  collections = "";

  function setApi(cId){
    console.log('cId setApi : ', cId);
    var authToken = SessionsService.getAuthToken();
    layers = ENDPOINT.api + API.collectionsv1 + cId + API.layers + authToken;
    places = ENDPOINT.api + API.collectionsv1 + cId + API.places + authToken;
    placeParent = ENDPOINT.api + API.collectionsv1 + cId + API.get_parent_place_by_ancestry + authToken;
    siteWeekYearPlaceId = ENDPOINT.api + API.collectionsv1 + cId + API.get_site_by_week_year_placeId + authToken;
    site = ENDPOINT.api + API.collectionsv1 + cId + API.sites + authToken;
    memberships = ENDPOINT.api + API.collectionsv1 + cId + API.place_memberships + authToken;
    updateSite = ENDPOINT.api + API.collectionsv1 + cId + API.update_site;
  }

  function getCollectionsURL() {
    var authToken = SessionsService.getAuthToken();
    collections = ENDPOINT.api + API.collections + authToken;
    return collections;
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
    getCollectionsURL: getCollectionsURL,
    getLayersUrl: getLayersUrl,
    getPlacesUrl: getPlacesUrl,
    getPlaceParentUrl: getPlaceParentUrl,
    getSiteUrl: getSiteUrl,
    getSiteByWeekYearPlaceIdUrl: getSiteByWeekYearPlaceIdUrl,
    getPlaceMembershipsUrl: getPlaceMembershipsUrl,
    getUpdateSiteUrl: getUpdateSiteUrl
  }
}
