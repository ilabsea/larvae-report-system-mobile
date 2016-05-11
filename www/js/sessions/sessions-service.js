angular.module('app')
.factory('SessionsService', SessionsService)

SessionsService.$inject = ["$q", "$http", "ENDPOINT", "API", "$state"]

function SessionsService($q, $http, ENDPOINT, API, $state){
  var LOCAL_TOKEN_KEY = 'authToken';
  var USER_ID_KEY = 'userId';
  var USER_EMAIL_KEY = 'userEmail'
  var authToken;

  function getUserId() {
    userId = window.localStorage.getItem(USER_ID_KEY);
    return userId;
  }

  function setUserId(id) {
    window.localStorage.setItem(USER_ID_KEY, id);
  }

  function setUserEmail(email) {
    window.localStorage.setItem(USER_EMAIL_KEY, email);
  }

  function getUserEmail() {
    return window.localStorage.getItem(USER_EMAIL_KEY);
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

  function removeUserEmail() {
    window.localStorage.removeItem(USER_EMAIL_KEY);
  }

  var login = function(user) {
    return $q(function(resolve, reject) {
      email = user.email;
      password = user.password;
      $http.post(ENDPOINT.api + API.sign_in, {"user":{'email':email, 'password':password}})
        .success(function(response) {
          setAuthToken(response.auth_token);
          setUserId(response.user_id);
          setUserEmail(email);
          resolve(response);
        })
        .error(function(error){
          reject('Sign in Failed.');
        });
    });
  };

  function logout() {
    isLogout = $http.post(ENDPOINT.api + API.sign_out + getAuthToken()).success(function(response) {
      clearSession()
    }, function(error){
      reject('Sign out failed.');
    });
    return isLogout;
  };

  function clearSession() {
    removeAuthToken();
    removeUserId();
    removeUserEmail();
  }

  return {
    login: login,
    logout: logout,
    getUserId: getUserId,
    setUserId: setUserId,
    getAuthToken: getAuthToken,
    getUserEmail: getUserEmail,
    removeUserEmail: removeUserEmail,
    removeAuthToken: removeAuthToken,
    removeUserId: removeUserId,
    clearSession: clearSession,
    setUserEmail: setUserEmail
  };
}
