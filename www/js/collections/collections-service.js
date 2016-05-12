angular.module('app')
.factory('CollectionsService', CollectionsService)
CollectionsService.$inject = ["$q", "$http", "ENDPOINT", "API", "SessionsService"]

function CollectionsService($q, $http, ENDPOINT, API, SessionsService) {

  var collectionId;

  function setCollectionId(id) {
    collectionId = id;
  }

  function getCollectionId() {
    return collectionId;
  }

  function fetch() {
    var authToken = SessionsService.getAuthToken();
    var collectionUrl = ENDPOINT.api + API.collections + authToken;
    return $q(function(resolve, reject) {
      $http.get(collectionUrl)
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
