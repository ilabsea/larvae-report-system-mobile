angular.module('app')
.factory('MembershipsService', MembershipsService)

MembershipsService.$inject = ["$q", "$http", "ApiService", "PlacesService"]

function MembershipsService($q, $http, ApiService, PlacesService){

  var membership = {};

  function canUpdate() {
    var canUpdate = false;
    if(membership.admin)
      canUpdate =  true;
    else {
      for(var i = 0 ; i < membership.layers.length ; i++){
        var layer = membership.layers[i];
        if(layer.write){
          canUpdate = true;
          break;
        }
      }
    }
    return canUpdate;
  }

  function setMemberships(membershipResponse) {
    membership = membershipResponse;
  }

  function fetch() {
    return $q(function(resolve, reject) {
      var parentId = PlacesService.getParentSelectedPlaceId();
      $http.get(ApiService.getPlaceMembershipsUrl() , {"params" : {"code" : parentId}})
        .success(function (res) {
          resolve(res);
          setMemberships(res);
        })
        .error(function(error){
          reject(error);
        });
    });
  }

  return {
    fetch: fetch,
    canUpdate: canUpdate
  }
}
