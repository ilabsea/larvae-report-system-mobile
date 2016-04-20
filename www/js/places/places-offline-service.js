angular.module('app')
.factory("PlacesOfflineService", PlacesOfflineService)

PlacesOfflineService.$inject = ["$cordovaSQLite", "SessionsService"];

function PlacesOfflineService($cordovaSQLite, SessionsService) {

  function insert(place, parent) {
    var query = "INSERT INTO places (place_id, name , user_id, parent_place_id, parent_place_name) VALUES (?, ?, ?, ?,?)";
    var userId = SessionsService.getUserId();
    var placeData = [place.id, place.name, userId, parent.id, parent.name];
    $cordovaSQLite.execute(db, query, placeData);
  }

  function getByUserIdPlaceId(uId, placeId) {
    var query = "SELECT * FROM places WHERE user_id=? AND place_id=?";
    return place = $cordovaSQLite.execute(db, query, [uId, placeId]).then(function(res) {
      return res.rows;
    });
  }

  function update(place, parent) {
    var query = "UPDATE places SET place_id=?, name=?, parent_place_id=?, parent_place_name=?";
    var placeData = [place.id, place.name, parent.id, parent.name];
    $cordovaSQLite.execute(db, query, placeData);
  }

  return{
    insert: insert,
    update: update,
    getByUserIdPlaceId: getByUserIdPlaceId
  }
}
