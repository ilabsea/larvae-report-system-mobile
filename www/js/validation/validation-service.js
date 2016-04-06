angular.module('app')
.factory('ValidationService', ValidationService)

ValidationService.$inject = ["$q", "LayersService"]

function ValidationService($q, LayersService){

  function getLayersWithInvalidData(siteData){
    var invalidLayers = [];
    var builtLayers = LayersService.getBuiltLayers();
    angular.forEach(builtLayers, function(layer){
      var i = 0,
          l = layer.fields.length
      for(; i < l ; i++){
        var field = layer.fields[i];
        if(field.required && !siteData.properties[field.id]){
          invalidLayers.push(layer.name);
          break;
        }
      }
    });
    return invalidLayers;
  }

  return {
    getLayersWithInvalidData: getLayersWithInvalidData
  }
}
