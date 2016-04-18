angular.module('app')
.factory('ValidationService', ValidationService)

ValidationService.$inject = ["$q", "LayersService"]

function ValidationService($q, LayersService){

  function getLayersWithInvalidData(siteData){
    var invalidLayers = [];
    var builtLayers = LayersService.getBuiltLayers();
    angular.forEach(builtLayers, function(layer){
      var invalidLayer = {name : '', fields: []};
      var i = 0,
          l = layer.fields.length
      for(; i < l ; i++){
        var field = layer.fields[i];
        if(field.required && !siteData.properties[field.id]){
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
