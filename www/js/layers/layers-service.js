angular.module('app')
.factory('LayersService', LayersService)
LayersService.$inject = ["$q", "$http", "ApiService", "FieldsService", "PlacesService"]

function LayersService($q, $http, ApiService, FieldsService, PlacesService) {
  var builtLayers = [];

  function getBuiltLayers() {
    return builtLayers;
  }

  function buildLayers(layers){
     builtLayers = [];
     angular.forEach(layers, function(layer) {
       builtFields = FieldsService.buildFields(layer.fields, true);
       builtLayers.push({layer_id: layer.id, name: layer.name , ord: layer.ord, fields: builtFields});
     });
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

   var getLastLayerId = function () {
     var layerLength = builtLayers.length;
     return layerLength > 0 ? builtLayers[layerLength-1].layer_id : '';
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
    getLastLayerId: getLastLayerId,
    getBuiltLayers: getBuiltLayers,
    getBuiltFieldsByLayerId: getBuiltFieldsByLayerId
  };
}
