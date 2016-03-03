angular.module('app')
.factory('LayersService', LayersService)
LayersService.$inject = ["$q", "$http", "ApiService", "FieldsService"]

function LayersService($q, $http, ApiService, FieldsService) {
  var builtLayers = [];

  function getBuiltLayers() {
    return builtLayers;
  }

  function buildLayers(layers){
     builtLayers = [];
     angular.forEach(layers, function(layer) {
       builtFields = FieldsService.buildFields(layer.fields);
       builtLayers.push({id: layer.id, name: layer.name , ord: layer.ord, fields: builtFields});
     });
     return builtLayers;
   }

   function getBuiltFieldsByLayerId(layerId){
     var fields;
     var builtLayers = getBuiltLayers();
     angular.forEach(builtLayers, function(layer) {
       if(layer.id == layerId){
         fields = layer.fields;
         return;
       }
     });
     return fields;
   }

   var getLastLayerId = function () {
     var layerLength = builtLayers.length;
     return builtLayers[layerLength-1].id;
   }

  function fetch(layersUrl) {
    return $q(function(resolve, reject) {
      $http.get(ApiService.getLayersUrl())
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
