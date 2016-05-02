angular.module('app')
.factory('LayersOfflineService', LayersOfflineService)
LayersOfflineService.$inject = ["$cordovaSQLite", "SessionsService", "CollectionsService",
      "PlacesService"]

function LayersOfflineService($cordovaSQLite, SessionsService, CollectionsService,
    PlacesService) {

  function insert(layer) {
    var query = "INSERT INTO layers (layer_id, name, place_id, user_id, collection_id)" +
          "VALUES (? ,? ,?, ?, ?)"
    var layerData = [layer.layer_id, layer.name, PlacesService.getSelectedPlaceId(), SessionsService.getUserId(),
      CollectionsService.getCollectionId()];
    $cordovaSQLite.execute(db, query, layerData).then(function(res) {
      console.log('res : ', res);
    });
  }

  function getByUserIdPlaceIdLayerId(userId, placeId, layerId) {
    var query = "SELECT * FROM layers WHERE user_id=? AND place_id=? AND layer_id=?";
    return layer = $cordovaSQLite.execute(db, query, [userId, placeId, layerId]).then(function(res) {
      return res.rows;
    });
  }

  function update(layer) {
    var query = "UPDATE layers SET name=?";
    $cordovaSQLite.execute(db, query, [layer.name]);
  }

  function getByUserIdPlaceId(userId, placeId) {
    var query = "SELECT * FROM layers WHERE user_id=? AND place_id=?";
    return layers = $cordovaSQLite.execute(db, query, [userId, placeId]).then(function(res) {
      var result = [];
      var i = 0,
          l = res.rows.length
      for(; i < l ; i++){
        result.push(res.rows.item(i));
      }
      return result;
    });
  }

  return{
    insert: insert,
    update: update,
    getByUserIdPlaceId: getByUserIdPlaceId,
    getByUserIdPlaceIdLayerId: getByUserIdPlaceIdLayerId
  }
}
