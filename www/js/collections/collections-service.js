angular.module('app')
.factory('CollectionsService', CollectionsService)
CollectionsService.$inject = ["$q", "$http", "ApiService"]

function CollectionsService($q, $http, ApiService) {
  var collectionFirstId;

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

  function setFirstCollectionId(collections) {
    var cId = collections.length > 0? collections[0].id : "" ;
    collectionFirstId = cId;
  }

  function getFirstCollectionId() {
    return collectionFirstId;
  }

  return {
    fetch: fetch,
    getFirstCollectionId: getFirstCollectionId,
    setFirstCollectionId: setFirstCollectionId
  }
}
