angular.module('app')
.factory('LayersHelperService', LayersHelperService)
LayersHelperService.$inject = ["LayersOfflineService", "FieldsOfflineService", 'SessionsService',
      "PlacesService"]

function LayersHelperService(LayersOfflineService, FieldsOfflineService, SessionsService,
      PlacesService) {

  function removeLayersFields() {
    var userId = SessionsService.getUserId();
    LayersOfflineService.deleteByUserId(userId);
  }

  function storeLayersFields(layers) {
    var userId = SessionsService.getUserId();
    var placeId = PlacesService.getSelectedPlaceId();
    angular.forEach(layers, function(layer) {
      storeLayers(layer);
      removeFields(layer.layer_id)
      storeFields(layer);
    })
  }

  function storeLayers(layer) {
    LayersOfflineService.insert(layer);
  }

  function removeFields(layer_id) {
    FieldsOfflineService.deleteByLayerId(layer_id);
  }

  function storeFields(layer) {
    angular.forEach(layer.fields,function(field){
      FieldsOfflineService.insert(field, layer.layer_id);
    });
  }

  return {
    removeLayersFields: removeLayersFields,
    storeLayersFields: storeLayersFields
  }
}
