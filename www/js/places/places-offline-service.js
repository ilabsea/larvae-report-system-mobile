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

  function deleteByUserId(uId, placeId) {
    var query = "DELETE FROM places WHERE user_id=?";
    $cordovaSQLite.execute(db, query, [uId]);
  }


  function getByUserId(uId){
    var query = "SELECT * FROM places WHERE user_id=?";
    return places = $cordovaSQLite.execute(db, query, [uId]).then(function(res) {
      var result = [];
      if(res.rows.length > 0){
        var i = 0,
            l = res.rows.length
        for(;i<l;i++){
          result.push(res.rows.item(i));
        }
      }
      return result;
    });
  }

  function getByPlaceId(placeId) {
    var query = "SELECT * FROM places WHERE place_id=?";
    return place = $cordovaSQLite.execute(db, query, [placeId]).then(function(res){
      return res.rows;
    });
  }

  return{
    insert: insert,
    getByUserId: getByUserId,
    getByPlaceId: getByPlaceId,
    deleteByUserId: deleteByUserId
  }
}
