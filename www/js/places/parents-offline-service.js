angular.module('app')
.factory("ParentsOfflineService", ParentsOfflineService)

ParentsOfflineService.$inject = ["$cordovaSQLite", "SessionsService"];

function ParentsOfflineService($cordovaSQLite, SessionsService) {

  function insert(place) {
    var userId = SessionsService.getUserId();
    var query = "INSERT INTO parent_places (parent_id, name , user_id) VALUES (?, ?, ?)";
    var placeData = [place.id, place.name, userId];
    $cordovaSQLite.execute(db, query, placeData);
  }

  function deleteByUserId(uId) {
    var query = "DELETE FROM parent_places WHERE user_id=?";
    $cordovaSQLite.execute(db, query, [uId]);
  }

  function getByParentId(id) {
    var query = "SELECT * FROM parent_places WHERE parent_id=?";
    return parent = $cordovaSQLite.execute(db, query, [id]).then(function(res){
      return res.rows;
    });
  }

  return{
    insert: insert,
    deleteByUserId: deleteByUserId,
    getByParentId: getByParentId
  }
}
