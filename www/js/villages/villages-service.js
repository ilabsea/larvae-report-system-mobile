angular.module('app')
.factory("VillagesService", VillagesService)

VillagesService.$inject = ["$q", "$http", "ENDPOINT", "API", "SessionsService"];

function VillagesService($q, $http, ENDPOINT, API, SessionsService) {
  var villageId;
  var villageName;
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

  return {
    getVillages: getVillages,
    setSelectedVillageId: setSelectedVillageId,
    getSelectedVillageId: getSelectedVillageId,
    setSelectedVillageName: setSelectedVillageName,
    getSelectedVillageName: getSelectedVillageName
  };
}
