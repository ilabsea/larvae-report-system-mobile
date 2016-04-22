angular.module('app')
.factory('MembershipsHelper', MembershipsHelper)

MembershipsHelper.$inject = ["MembershipsOfflineService"]

function MembershipsHelper(MembershipsOfflineService){
  var layersMembership;

  function handleStoreMembership(membership) {
    MembershipsOfflineService.getByUserId(membership.user_id).then(function(res){
      res.length>0 ? MembershipsOfflineService.update(membership):MembershipsOfflineService.insert(membership);
    })
  }

  function setLayersMembership(membership) {
    if(angular.isString(membership.layers))
      layersMembership = angular.fromJson(membership.layers);
    else
      layersMembership = membership.layers;
  }

  function getLayersMembership() {
    return layersMembership;
  }

  return {
    handleStoreMembership: handleStoreMembership,
    setLayersMembership: setLayersMembership,
    getLayersMembership: getLayersMembership
  }
}
