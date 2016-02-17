angular.module('app')
.factory('FormSiteService', FormSiteService)
FormSiteService.$inject = ["$q", "$http", "ENDPOINT", "API"]

function FormSiteService($q, $http, ENDPOINT, API, SessionsService) {
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
      field.isInputType = false;
      switch (field.kind) {
        case "numeric":
          field.type = "number";
          field.isInputType = true;
          break;
        case "calculation":
          field.type = "text";
          field.isInputType = true;
          break;
        case "phone":
          field.type = "tel";
          field.isInputType = true;
          break;
        case "date":
          field.type = "date";
          break;
        case "yes_no":
          field.type = "checkbox";
          break;
        case "select_one":
          field.type = 'select';
          field.multiSelect = false;
          break;
        case "select_many":
          field.type = 'select';
          field.multiSelect = true;
          break;
        case "hierarchy":
        case "photo":
          field.type = field.kind;
          break;
        default:
          field.type = field.kind;
          field.isInputType = true;
          break;
      }
    });
    return fields;
  }

  function getFields(layerId){
    var fields;
    angular.forEach(layers, function(layer) {
      if(layer.id == layerId){
        fields = buildFields(layer.fields);
        return;
      }
    });
    return fields;
  }

  function fetch() {
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

  function saveSite(site) {
    return $q(function(resolve, reject) {
      $http.post(ENDPOINT.api + API.sites + authToken, {"site": site})
        .success(function(response) {
          resolve(response);
        })
        .error(function(error){
          reject('error ' + error);
        });
    });
  }

  return {
    fetch: fetch,
    getFields: getFields,
    saveSite: saveSite
  };
}
