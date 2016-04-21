angular.module('app')
.factory('CollectionsService', CollectionsService)
CollectionsService.$inject = ["$q", "$http", "ApiService"]

function CollectionsService($q, $http, ApiService) {

  var collectionId;

  function setCollectionId(id) {
    collectionId = id;
  }

  function getCollectionId() {
    return collectionId;
  }

  function fetch() {
    return $q(function(resolve, reject) {
      $http.get(ApiService.getCollectionsURL())
        .success(function(response) {
          resolve(response);
        })
        .error(function(error){
          reject(error);
        });
    });
  }

  return {
    fetch: fetch,
    setCollectionId: setCollectionId,
    getCollectionId: getCollectionId
  }
}
