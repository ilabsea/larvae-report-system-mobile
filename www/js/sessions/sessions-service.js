angular.module('app')
.factory('SessionsService', SessionsService)

SessionsService.$inject = ["$q", "$http", "ENDPOINT", "API", "$state"]

function SessionsService($q, $http, ENDPOINT, API, $state){
  var LOCAL_TOKEN_KEY = 'authToken';
  var USER_ID_KEY = 'userId';
  var authToken;

  function getUserId() {
    userId = window.localStorage.getItem(USER_ID_KEY);
    return userId;
  }

  function setUserId(id) {
    window.localStorage.setItem(USER_ID_KEY, id);
  }

  function getAuthToken() {
    authToken = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    return authToken;
  }

  function setAuthToken(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
  }

  function removeAuthToken() {
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  function removeUserId() {
    window.localStorage.removeItem(USER_ID_KEY);
  }

  var login = function(user) {
    return $q(function(resolve, reject) {
      email = user.email;
      password = user.password;
      $http.post(ENDPOINT.api + API.sign_in, {"user":{'email':email, 'password':password}})
        .success(function(response) {
          setAuthToken(response.auth_token);
          setUserId(response.user_id);
          resolve('Login success.');
        })
        .error(function(error){
          reject('Login Failed.');
        });
    });
  };

  function logout() {
    removeAuthToken();
    removeUserId();
  };

  return {
    login: login,
    logout: logout,
    getUserId: getUserId
  };
}
