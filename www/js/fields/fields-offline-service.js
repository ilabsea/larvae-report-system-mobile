angular.module('app')
.factory('FieldsOfflineService', FieldsOfflineService)
FieldsOfflineService.$inject = ["$cordovaSQLite", "FieldsService"]

function FieldsOfflineService($cordovaSQLite, FieldsService) {

  function insert(field, layerId) {
    var query = "INSERT INTO fields (field_id, name, kind, code, config, is_mandatory, " +
          "is_enable_field_logic, remember_last_input, default_value, layer_id)" +
          "VALUES (? ,? ,?, ?, ?, ?, ?, ?, ?, ?)";
    var fieldData = [field.id, field.name, field.kind, field.code, angular.toJson(field.config), field.is_mandatory? 1 : 0,
      field.is_enable_field_logic? 1:0, field.remember_last_input? 1:0, field.default_value, layerId];
    $cordovaSQLite.execute(db, query, fieldData).then(function(res) {
      console.log('res insert fields : ', res);
    });
  }

  function getByLayerIdFieldId(layerId, fieldId) {
    var query = "SELECT * FROM fields WHERE layer_id=? AND field_id=?";
    return fields = $cordovaSQLite.execute(db, query, [layerId, fieldId]).then(function(res) {
      return res.rows;
    })
  }

  function update(field, layerId) {
    var query = "UPDATE fields SET name=?, kind=?, code=?, config=?, is_mandatory=?, " +
          "is_enable_field_logic=?, remember_last_input=?, default_value=?, layer_id=? WHERE field_id=?";
    var fieldData = [field.name, field.kind, field.code, angular.toJson(field.config), field.is_mandatory? 1:0,
      field.is_enable_field_logic?1:0, field.remember_last_input?1:0, field.default_value, layerId, field.id];
    $cordovaSQLite.execute(db, query, fieldData);
  }

  function getByLayerId(layerId){
    var query = "SELECT * FROM fields WHERE layer_id=?";
    return fields = $cordovaSQLite.execute(db, query, [layerId]).then(function(res) {
      var result = [];
      var i = 0,
          l = res.rows.length
      for(; i < l ; i++){
        result.push(res.rows.item(i));
      }

      return FieldsService.buildFields(result);
    })
  }

  return{
    insert: insert,
    update: update,
    getByLayerIdFieldId: getByLayerIdFieldId,
    getByLayerId: getByLayerId
  }
}
