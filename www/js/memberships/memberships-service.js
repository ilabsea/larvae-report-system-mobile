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
      var i = 0,
          len = membership.layers.length;
      for(; i < len ; i++){
        var layer = membership.layers[i];
        if(layer.write){
          canUpdate = true;
          break;
        }
      }
    }
    return canUpdate;
  }

  function canCreate() {
    var canCreate = false;
    if(membership.admin)
      canCreate =  true;
    else {
      if(angular.isString(membership.layers))
        layersMembership = angular.fromJson(membership.layers);
      else
        layersMembership = membership.layers;

      var i = 0,
          len = layersMembership.length;
      for(; i < len ; i++){
        var layer = layersMembership[i];
        if(layer.create){
          canCreate = true;
          break;
        }
      }
    }
    return canCreate;
  }

  function setMemberships(membershipResponse) {
    membership = membershipResponse;
  }

  function getMemberships() {
    if(angular.isString(membership.layers))
      layersMembership = angular.fromJson(membership.layers);
    else
      membership = membership;
    return membership;
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
    canUpdate: canUpdate,
    canCreate: canCreate,
    getMemberships: getMemberships,
    setMemberships: setMemberships
  }
}
