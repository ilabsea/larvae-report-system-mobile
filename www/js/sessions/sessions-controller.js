angular.module('app')
.controller('SessionsCtrl', SessionsCtrl)

SessionsCtrl.$inject = ["$scope", "$state", "SessionsService",
        "ApiService", "PopupService"]

function SessionsCtrl($scope, $state, SessionsService, ApiService, PopupService) {

  var vm = $scope;
  vm.user = {'email': 'mouyleng+3@instedd.org', 'password':'mouyleng123'};
  // vm.user = {};
  vm.login = login;
  vm.logout = logout;

  function login(user) {
    vm.showSpinner('templates/loading/loading-login.html');
    SessionsService.login(user).then(function(authenticated) {
      vm.hideSpinner();
      $state.go("weeks-calendar");
      ApiService.setApi();
    }, function(err) {
      vm.hideSpinner();
      PopupService.alertPopup("login_validation.sign_in_failed", "login_validation.invalid_email_or_password");
    });
  };

  function logout() {
    SessionsService.logout().then(function() {
      $state.go("login");
    }, function(err) {
      PopupService.alertPopup("sign_in_failed", "invalid_email_or_password");
    });
  };
}
