angular.module('app')
.factory('ApiService', ApiService)
ApiService.$inject = ["ENDPOINT", "API", "SessionsService", "CollectionsService"]

function ApiService(ENDPOINT, API, SessionsService, CollectionsService) {
  
  function getLayersUrl() {
    var authToken = SessionsService.getAuthToken();
    var cId = CollectionsService.getCollectionId();
    layers = ENDPOINT.api + API.collectionsv1 + cId + API.layers + authToken;
    return layers;
  }

  function getPlacesUrl() {
    var authToken = SessionsService.getAuthToken();
    var cId = CollectionsService.getCollectionId();
    places = ENDPOINT.api + API.collectionsv1 + cId + API.places + authToken;
    return places;
  }

  function getPlaceParentUrl() {
    var authToken = SessionsService.getAuthToken();
    var cId = CollectionsService.getCollectionId();
    var placeParent = ENDPOINT.api + API.collectionsv1 + cId + API.get_parent_place_by_ancestry + authToken;
    return placeParent;
  }

  function getSiteUrl() {
    var authToken = SessionsService.getAuthToken();
    var cId = CollectionsService.getCollectionId();
    var site = ENDPOINT.api + API.collectionsv1 + cId + API.sites + authToken;
    return site;
  }

  function getSiteByWeekYearPlaceIdUrl() {
    var authToken = SessionsService.getAuthToken();
    var cId = CollectionsService.getCollectionId();
    var siteWeekYearPlaceId = ENDPOINT.api + API.collectionsv1 + cId + API.get_site_by_week_year_placeId + authToken;
    return siteWeekYearPlaceId;
  }

  function getPlaceMembershipsUrl() {
    var authToken = SessionsService.getAuthToken();
    var cId = CollectionsService.getCollectionId();
    var memberships = ENDPOINT.api + API.collectionsv1 + cId + API.place_memberships + authToken;
    return memberships;
  }

  function getUpdateSiteUrl() {
    var authToken = SessionsService.getAuthToken();
    var cId = CollectionsService.getCollectionId();
    var updateSite = ENDPOINT.api + API.collectionsv1 + cId + API.update_site;
    return updateSite;
  }

  return{
    getLayersUrl: getLayersUrl,
    getPlacesUrl: getPlacesUrl,
    getPlaceParentUrl: getPlaceParentUrl,
    getSiteUrl: getSiteUrl,
    getSiteByWeekYearPlaceIdUrl: getSiteByWeekYearPlaceIdUrl,
    getPlaceMembershipsUrl: getPlaceMembershipsUrl,
    getUpdateSiteUrl: getUpdateSiteUrl
  }
}
