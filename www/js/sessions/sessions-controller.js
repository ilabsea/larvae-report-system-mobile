angular.module('app')
.controller('SessionsCtrl', SessionsCtrl)

SessionsCtrl.$inject = ["$scope", "$state", "$ionicPopup", "SessionsService"]

function SessionsCtrl($scope, $state, $ionicPopup, SessionsService) {
  var vm = $scope;
  vm.user = {'email': 'mouyleng+1@instedd.org', 'password':'mouyleng123'};
  // vm.user = {};
  vm.login = login;
  vm.logout = logout;

  function login(user) {
    SessionsService.login(user).then(function(authenticated) {
      $state.go("weeks-calendar");
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Invalid Email or Password.'
      });
    });
  };

  function logout() {
    SessionsService.logout();
    $state.go("login");
  };
}
