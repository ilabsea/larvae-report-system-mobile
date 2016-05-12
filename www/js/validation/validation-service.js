angular.module('app')
.factory('ValidationService', ValidationService)

ValidationService.$inject = ["$q", "LayersService", 'LayersOfflineService']

function ValidationService($q, LayersService, LayersOfflineService){

  function getLayersWithInvalidData(siteData){
    var invalidLayers = [];
    var builtLayers = isOnline() ? LayersService.getBuiltLayers() : LayersOfflineService.getBuildLayers();
    angular.forEach(builtLayers, function(layer){
      var invalidLayer = {name : '', fields: []};
      var i = 0,
          l = layer.fields.length
      for(; i < l ; i++){
        var field = layer.fields[i];
        if(field.required && !siteData.properties[field.field_id] && siteData.properties[field.field_id] != 0){
          invalidLayer.name = layer.name;
          invalidLayer.fields.push(field.name);
        }
      }
      if(invalidLayer.fields.length > 0)
        invalidLayers.push(invalidLayer);
    });
    return invalidLayers;
  }

  return {
    getLayersWithInvalidData: getLayersWithInvalidData
  }
}
