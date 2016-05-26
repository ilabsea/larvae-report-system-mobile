angular.module('app')
.factory("ParentsOfflineService", ParentsOfflineService)

ParentsOfflineService.$inject = ["$cordovaSQLite", "SessionsService"];

function ParentsOfflineService($cordovaSQLite, SessionsService) {

  var parentsExist = [];

  function insert(place) {
    // console.log('parentsExist : ', parentsExist);
    // console.log('place.id : ', place.id);
    // console.log('parentsExist.indexOf(place.id) !== -1 : ', parentsExist.indexOf(place.id) != -1);
    // if(!(parentsExist.indexOf(place.id) !== -1)){
      var userId = SessionsService.getUserId();
      var query = "INSERT INTO parent_places (parent_id, name , user_id) VALUES (?, ?, ?)";
      var placeData = [place.id, place.name, userId];
      $cordovaSQLite.execute(db, query, placeData);
    // }
  }

  function deleteByUserId(uId) {
    var query = "DELETE FROM parent_places WHERE user_id=?";
    $cordovaSQLite.execute(db, query, [uId]);
  }

  return{
    insert: insert,
    deleteByUserId: deleteByUserId
  }
}
