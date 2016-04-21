angular.module('app')
.factory('MembershipsOfflineService', MembershipsOfflineService)
MembershipsOfflineService.$inject = ["$cordovaSQLite"]

function MembershipsOfflineService($cordovaSQLite) {

  function insert(membership) {
    var query = "INSERT INTO place_memberships (user_id, admin, layers, sites) VALUES (? ,? ,?, ?)";
    var membershipData = [membership.user_id, membership.admin? 1:0,
      angular.toJson(membership.layers), angular.toJson(membership.sites)];
    $cordovaSQLite.execute(db, query, membershipData).then(function(res){
      console.log('membership insert : ', res);
    });
  }

  function update(membership) {
    var query = "UPDATE place_memberships SET admin=?, layers=?, sites=? WHERE user_id=?";
    var membershipData = [membership.user_id, membership.admin? 1:0,
      angular.toJson(membership.layers), angular.toJson(membership.sites)];
    $cordovaSQLite.execute(db, query, membershipData).then(function(res){
      console.log('membership update : ', res);
    });
  }

  function getByUserId(userId) {
    var query = "SELECT * FROM place_memberships WHERE user_id=?";
    return membership = $cordovaSQLite.execute(db, query, [userId]).then(function(res){
      return res.rows;
    })
  }

  return{
    insert:insert,
    update: update,
    getByUserId: getByUserId
  }
}
