angular.module('app')
.factory('FieldsService', FieldsService)
FieldsService.$inject = []

function FieldsService(LayersService) {
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
          field.disabled = "true";
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

  function getDateFieldsId() {
    return dateFieldsId;
  }

  function getPhotoFieldsid() {
    return photoFieldsId;
  }

  return {
    buildFields: buildFields,
    getDateFieldsId: getDateFieldsId,
    getPhotoFieldsid: getPhotoFieldsid,
  }
}
