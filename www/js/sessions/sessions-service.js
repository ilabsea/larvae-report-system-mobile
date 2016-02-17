angular.module('app')
.factory('SessionsService', SessionsService)

SessionsService.$inject = ["$q", "$http", "ENDPOINT", "API", "$state"]

function SessionsService($q, $http, ENDPOINT, API, $state){
  var LOCAL_TOKEN_KEY = 'authToken';
  var authToken;

  function getAuthToken() {
    authToken = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    console.log('authToken : ', authToken);
    return authToken;
  }

  function setAuthToken(token) {
    console.log('set token : ', token);
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
  }

  function remoreAuthToken() {
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  var login = function(user) {
    return $q(function(resolve, reject) {
      email = user.email;
      password = user.password;
      $http.post(ENDPOINT.api + API.sign_in, {"user":{'email':email, 'password':password}})
        .success(function(response) {
          setAuthToken(response.auth_token);
          resolve('Login success.');
        })
        .error(function(error){
          reject('Login Failed.');
        });
    });
  };

  function logout() {
    remoreAuthToken();
  };

  return {
    login: login,
    logout: logout
  };
}
