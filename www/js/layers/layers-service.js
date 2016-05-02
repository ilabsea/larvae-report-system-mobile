angular.module('app')
.factory('LayersService', LayersService)
LayersService.$inject = ["$q", "$http", "ApiService", "FieldsService", "PlacesService"]

function LayersService($q, $http, ApiService, FieldsService, PlacesService) {
  var builtLayers = [];
  var builtLayersOffline = [];

  function getBuiltLayers() {
    return builtLayers;
  }

  function buildLayers(layers){
     builtLayers = [];
     angular.forEach(layers, function(layer) {
       builtFields = FieldsService.buildFields(layer.fields, true);
       builtLayers.push({layer_id: layer.id, name: layer.name , ord: layer.ord, fields: builtFields});
     });
     console.log('builtLayers : ', builtLayers);
     return builtLayers;
   }

   function getBuiltFieldsByLayerId(layerId){
     var fields;
     var builtLayers = getBuiltLayers();
     angular.forEach(builtLayers , function (layer) {
       if(layer.layer_id == layerId){
         fields = layer.fields;
         return;
       }
     });
     return fields;
   }

  function fetch(layersUrl) {
    return $q(function(resolve, reject) {
      $http.get(ApiService.getLayersUrl(), {'params' : {'place_id' : PlacesService.getSelectedPlaceId()}})
        .success(function(response) {
          var builtData = buildLayers(response);
          resolve(builtData);
        })
        .error(function(error){
          reject(error);
        });
    });
  };

  return {
    fetch: fetch,
    getBuiltLayers: getBuiltLayers,
    getBuiltFieldsByLayerId: getBuiltFieldsByLayerId,
    buildLayers: buildLayers
  };
}
