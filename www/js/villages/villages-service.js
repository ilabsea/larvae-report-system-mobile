angular.module('app')
.factory("VillagesService", VillagesService)

VillagesService.$inject = ["$q", "$http", "ENDPOINT", "API", "SessionsService"];

function VillagesService($q, $http, ENDPOINT, API, SessionsService) {
  var villageId;
  var villageName;
  var selectedVillage;
  var villages;

  function setVillages(villagesResponse) {
    villages = villagesResponse;
  }

  function getVillages() {
    return villages;
  }

  function getVillages(){
    return $q(function(resolve, reject) {
      var authToken = SessionsService.getAuthToken()

      $http.get(ENDPOINT.api + API.villages + authToken)
        .success(function(response) {
          setVillages(response);
          resolve(response);
        })
        .error(function(error){
          reject('error ' + error);
        });
    });
  }

  function setSelectedVillageId(id){
    villageId = id;
  }

  function getSelectedVillageId() {
    return villageId;
  }

  function setSelectedVillageName(name){
    villageName = name;
  }

  function getSelectedVillageName() {
    return villageName;
  }

  function setSelectedVillage(village) {
    selectedVillage = village;
  }

  function getSelectedVillage() {
    return selectedVillage;
  }

  function fetchPlaceParent() {
    return $q(function(resolve, reject) {
      var ancestry = getSelectedVillage().ancestry;
      var authToken = SessionsService.getAuthToken();
      var dataAttr = {"ancestry" : ancestry};
      $http.get(ENDPOINT.api + API.get_parent_place_by_village_ancestry + authToken, {"params": dataAttr} )
        .success(function (place) {
          resolve(place);
        })
        .error(function(error){
          reject(error);
        });
    });
  }

  return {
    getVillages: getVillages,
    setSelectedVillageId: setSelectedVillageId,
    getSelectedVillageId: getSelectedVillageId,
    setSelectedVillageName: setSelectedVillageName,
    getSelectedVillageName: getSelectedVillageName,
    setSelectedVillage: setSelectedVillage,
    getSelectedVillage: getSelectedVillage,
    fetchPlaceParent: fetchPlaceParent
  };
}
