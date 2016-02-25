angular.module('app')
.factory('FormSiteService', FormSiteService)
FormSiteService.$inject = ["$q", "$http", "ENDPOINT", "API"]

function FormSiteService($q, $http, ENDPOINT, API, SessionsService) {
  var collection_id = "";
  var authToken = window.localStorage.getItem('authToken');
  var layers = [];
  var builtLayers = [];
  var dateFieldsId = [];
  var photoFieldsId = [];

  function buildFields(fields){
    angular.forEach(fields, function(field) {
      field.isInputType = false;
      field.required = field.is_mandatory;
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
          dateFieldsId.push(field.id);
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
          field.type = field.kind;
          break;
        case "photo":
          field.type = field.kind;
          field.defaultImageSrc = 'img/camera.png'
          photoFieldsId.push(field.id);
          break;
        default:
          field.type = field.kind;
          field.isInputType = true;
          break;
      }
    });
    return fields;
  }

  function setLayers(layersResponse){
    layers = layersResponse
  }

  function getLayers(){
    return layers;
  }

  function getBuiltLayers(){
    return builtLayers;
  }

  function setBuiltLayers(layersResponse){
    builtLayers = [];
    angular.forEach(layersResponse, function(layer) {
      builtFields = buildFields(layer.fields);
      builtLayers.push({id: layer.id, name: layer.name , ord: layer.ord, fields: builtFields});
    })
  }

  function getBuiltFieldsByLayerId(layerId){
    var fields;
    angular.forEach(builtLayers, function(layer) {
      if(layer.id == layerId){
        fields = layer.fields;
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
          setBuiltLayers(response);
          var builtData = getBuiltLayers();
          resolve(builtData);
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

  function getDateFieldsId() {
    return dateFieldsId;
  }

  var getLastLayerId = function () {
    var layerLength = layers.length;
    return layers[layerLength-1].id;
  }

  function getPicture(options) {
    var q = $q.defer();

    navigator.camera.getPicture(function(result) {
      q.resolve(result);
    }, function(err) {
      q.reject(err);
    }, options);

    return q.promise;
  }

  function getPhotoFieldsid() {
    return photoFieldsId;
  }

  return {
    fetch: fetch,
    getBuiltFieldsByLayerId: getBuiltFieldsByLayerId,
    saveSite: saveSite,
    getDateFieldsId: getDateFieldsId,
    getLastLayerId: getLastLayerId,
    getPicture: getPicture,
    getPhotoFieldsid: getPhotoFieldsid
  };
}
