angular.module('app')
.factory("PlacesService", PlacesService)

PlacesService.$inject = ["$q", "$http", "ApiService"];

function PlacesService($q, $http, ApiService) {
  var placeId;
  var selectedPlace,placesWithReport;
  var parentPlaceId;
  var ancestryValues = [];
  var siteData;

  function setSelectedPlaceId(id){
    placeId = id;
  }

  function getSelectedPlaceId() {
    return placeId;
  }

  function setPlacesWithReport(places){
    placesWithReport = places;
  }

  function getPlacesWithReport() {
    return placesWithReport;
  }

  function setSelectedPlace(place) {
    selectedPlace = place;
  }

  function getSelectedPlace() {
    return selectedPlace;
  }

  function setParentSelectedPlaceId(id) {
    parentPlaceId = id;
  }

  function getParentSelectedPlaceId() {
    return parentPlaceId;
  }

  function fetch(){
    return $q(function(resolve, reject) {
      $http.get(ApiService.getPlacesUrl())
        .success(function(response) {
          resolve(response);
        })
        .error(function(error){
          reject(error);
        });
    });
  }

  function fetchPlaceParent(ancestry) {
    return $q(function(resolve, reject) {
      var dataAttr = {"ancestry" : ancestry};
      if(!(ancestryValues.indexOf(ancestry) != -1)){
        if(ancestry){
          ancestryValues.push(ancestry);
          $http.get(ApiService.getPlaceParentUrl(), {"params": dataAttr} )
            .success(function (place) {
              ancestryValues = [];
              setParentSelectedPlaceId(place.id);
              resolve(place);
            })
            .error(function(error){
              reject(error);
            });
        }
      }
    });
  }

  return {
    setSelectedPlaceId: setSelectedPlaceId,
    getSelectedPlaceId: getSelectedPlaceId,
    setSelectedPlace: setSelectedPlace,
    getSelectedPlace: getSelectedPlace,
    fetch: fetch,
    fetchPlaceParent: fetchPlaceParent,
    getParentSelectedPlaceId: getParentSelectedPlaceId,
    getPlacesWithReport: getPlacesWithReport,
    setPlacesWithReport: setPlacesWithReport
  };
}
