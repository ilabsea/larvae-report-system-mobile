angular.module('app')
.factory('SessionsOfflineService', SessionsOfflineService)

SessionsOfflineService.$inject = ["$cordovaSQLite"]

function SessionsOfflineService($cordovaSQLite){
  var currentUser;

  function setCurrentUser(user, userId) {
    currentUser = user;
    currentUser.id = userId;
  }

  function getCurrentUser() {
    return currentUser;
  }

  function insertUser() {
    var query = "INSERT INTO users (user_id, email , password) VALUES (?, ?, ?)";
    var userData = [currentUser.id, currentUser.email, currentUser.password];
    $cordovaSQLite.execute(db, query, userData);
  }

  function getUserByEmail(email) {
    email = angular.lowercase(email);
    var query = "SELECT * FROM users WHERE email=?";
    return users = $cordovaSQLite.execute(db, query, [email]).then(function(user){
      return user.rows;
    });
  }

  function updateUser() {
    var query = "UPDATE users SET password=? WHERE email=?";
    var userData = [currentUser.password, currentUser.email];
    $cordovaSQLite.execute(db, query, userData);
  }

  function insertOrUpdateUser(user) {
    if(user.length > 0){
      if(user.item(0).password !== currentUser.password)
        updateUser();
    }else
      insertUser();
  }

  return{
    getUserByEmail: getUserByEmail,
    setCurrentUser: setCurrentUser,
    getCurrentUser: getCurrentUser,
    insertOrUpdateUser: insertOrUpdateUser
  }
}
