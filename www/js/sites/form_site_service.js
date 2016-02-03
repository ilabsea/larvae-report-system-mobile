angular.module('app')

.service('FormSiteService', function($q, $http, ENDPOINT, API){
  var collection_id = "";
  var authToken = window.localStorage.getItem('authToken');
  var layers = {};

  function setLayers(layersResponse){
    layers = layersResponse
  }

  function getLayers(){
    return layers;
  }

  function buildFields(fields){
    angular.forEach(fields, function(field) {
      field.isInputType = true;
      switch (field.kind) {
        case "numeric":
          field.type = "number";
          break;
        case "yes_no":
          field.isInputType = false;
          field.type = "checkbox";
          break;
        case "phone":
          field.type = "tel";
          break;
        case "calculation":
          field.type = "text";
          break;
        case "select_one":
        case "select_many":
        case "hierarchy":
        case "photo":
          field.type = field.kind;
          field.isInputType = false;
          break;
        default:
          field.type = field.kind;
          break;
      }
    });
    console.log('fields built : ', fields);
    return fields;
  }

  var getFields = function(layerId){
    var fields;
    angular.forEach(layers, function(layer) {
      if(layer.id == layerId){
        fields = buildFields(layer.fields);
        return;
      }
    });
    return fields;
  }

  var fetch = function() {
    return $q(function(resolve, reject) {
      $http.get(ENDPOINT.api + API.layers + authToken)
        .success(function(response) {
          setLayers(response);
          resolve(response);
        })
        .error(function(error){
          reject('error ' + error);
        });
    });
  };

  return {
    fetch: fetch,
    getFields: getFields
  };
})

.factory('CameraService', ['$q', function($q) {
  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}]);
