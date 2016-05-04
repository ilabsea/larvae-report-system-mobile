angular.module('app')
.factory('CollectionsOfflineService', CollectionsOfflineService)

CollectionsOfflineService.$inject = ["$cordovaSQLite", "SessionsService"]

function CollectionsOfflineService($cordovaSQLite, SessionsService){

  function insert(collection) {
    var query = "INSERT INTO collections (collection_id, user_id , name) VALUES (?, ?, ?)";
    var userId = SessionsService.getUserId();
    var collectionData = [collection.id, userId ,collection.name];
    $cordovaSQLite.execute(db, query, collectionData);
  }

  function getByUserId(uId) {
    var query = "SELECT * FROM collections WHERE user_id=?";
    return collection = $cordovaSQLite.execute(db, query, [uId]).then(function(res) {
      return res.rows;
    });
  }

  function update(collection) {
    var query = "UPDATE collections SET name=?";
    $cordovaSQLite.execute(db, query, [collection.name]);
  }

  return{
    insert: insert,
    update: update,
    getByUserId: getByUserId
  }
}
