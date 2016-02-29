angular.module('app')
.factory("VillagesService", VillagesService)

VillagesService.$inject = ["$q", "$http", "ENDPOINT", "API"];

function VillagesService($q, $http, ENDPOINT, API) {
  var village_id;
  var villages;
  var authToken = window.localStorage.getItem('authToken');

  function setVillages(villagesResponse) {
    villages = villagesResponse;
  }

  function getVillages() {
    return villages;
  }

  function getVillages(){
    return $q(function(resolve, reject) {
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
    village_id = id;
  }

  function getSelectedVillageId() {
    return village_id;
  }

  return {
    getVillages: getVillages,
    setSelectedVillageId: setSelectedVillageId,
    getSelectedVillageId: getSelectedVillageId
  };
}
