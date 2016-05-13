angular.module('app')
.factory('LayersOfflineService', LayersOfflineService)
LayersOfflineService.$inject = ["$cordovaSQLite", "SessionsService", "CollectionsService"]

function LayersOfflineService($cordovaSQLite, SessionsService, CollectionsService) {

  var builtLayers;

  function setBuildLayers(layers) {
    builtLayers = layers;
  }

  function getBuildLayers() {
    return builtLayers;
  }

  function insert(layer) {
    var query = "INSERT INTO layers (layer_id, name,  user_id, collection_id)" +
          "VALUES (? ,?, ?, ?)"
    var layerData = [layer.layer_id, layer.name,  SessionsService.getUserId(),
      CollectionsService.getCollectionId()];
    $cordovaSQLite.execute(db, query, layerData);
  }

  function getByUserId(userId) {
    var query = "SELECT * FROM layers WHERE user_id=?";
    return layers = $cordovaSQLite.execute(db, query, [userId]).then(function(res) {
      var result = [];
      var i = 0,
          l = res.rows.length
      for(; i < l ; i++){
        result.push(res.rows.item(i));
      }
      return result;
    });
  }

  function deleteByUserId(uId) {
    var query = "DELETE FROM layers WHERE user_id=?";
    $cordovaSQLite.execute(db, query, [uId]);
  }

  return{
    insert: insert,
    getByUserId: getByUserId,
    setBuildLayers: setBuildLayers,
    getBuildLayers: getBuildLayers,
    deleteByUserId: deleteByUserId
  }
}
