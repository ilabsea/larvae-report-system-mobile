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

  function isValidSite(siteData) {
    isValid = true;
    var builtLayers = isOnline() ? LayersService.getBuiltLayers() : LayersOfflineService.getBuildLayers();
    console.log('builtLayers ; ', builtLayers);
    var i = 0,
        l = builtLayers.length
    for(; i < l ; i++){
      var b = false;
      layer = builtLayers[i];
      var j = 0 ,
          lf = layer.fields.length
      for(; j< lf; j++){
        var field = layer.fields[j];
        if(field.required && !siteData.properties[field.field_id] && siteData.properties[field.field_id] != 0){
          b = true;
          console.log(b);
          break;
        }
      }
      if(b){
        isValid = false;
        break;
      }
    }
    return isValid;

  }
  return {
    getLayersWithInvalidData: getLayersWithInvalidData,
    isValidSite: isValidSite
  }
}
