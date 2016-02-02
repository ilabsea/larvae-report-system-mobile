angular.module('app')

.service('SessionsService', function($q, $http, ENDPOINT, API, $base64, $state) {
  var LOCAL_TOKEN_KEY = 'authToken';
  var authToken;

  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

  function useCredentials(token) {
    authToken = token;
    $http.defaults.headers.common['X-Auth-Token'] = token;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  var login = function(user) {
    return $q(function(resolve, reject) {
      email = user.email;
      password = user.password;
      auth_data = $base64.encode(email + ':' + password);
      console.log('auth_data : ', auth_data);
      // $http.post(ENDPOINT.api + API.sign_in , {}, {headers: {'Authorization': 'Basic ' + auth_data}})
      console.log(" end point : ", ENDPOINT.api + API.sign_in)
      $http.post(ENDPOINT.api + API.sign_in, {"user":{'email':email, 'password':password}})
        .success(function(response) {
          storeUserCredentials(response.auth_token);
          resolve('Login success.');
        })
        .error(function(error){
          reject('Login Failed.');
        });
    });
  };

  var logout = function() {
    destroyUserCredentials();
  };

  loadUserCredentials();

  return {
    login: login,
    logout: logout
  };
})
