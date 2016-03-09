angular.module('app')
.controller('SessionsCtrl', SessionsCtrl)

SessionsCtrl.$inject = ["$scope", "$state", "$ionicPopup", "SessionsService",
        "ApiService"]

function SessionsCtrl($scope, $state, $ionicPopup, SessionsService, ApiService) {

  var vm = $scope, loadingSpinner;
  vm.user = {'email': 'mouyleng+1@instedd.org', 'password':'mouyleng123'};
  // vm.user = {};
  vm.login = login;
  vm.logout = logout;

  function login(user) {
    vm.showSpinner('templates/partials/loading-login.html');
    SessionsService.login(user).then(function(authenticated) {
      vm.hideSpinner();
      $state.go("weeks-calendar");
      ApiService.setApi();
    }, function(err) {
      vm.hideSpinner();
      $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Invalid Email or Password.',
        okType: 'default-button'
      });
    });
  };

  function logout() {
    SessionsService.logout().then(function() {
      $state.go("login");
    }, function(err) {
      $ionicPopup.alert({
        title: 'Sign out failed!',
        template: 'Please check your internet connection',
        okType: 'default-button'
      });
    });
  };
}
