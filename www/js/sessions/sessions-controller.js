angular.module('app')
.controller('SessionsCtrl', SessionsCtrl)

SessionsCtrl.$inject = ["$scope", "$state", "SessionsService",
        "ApiService", "PopupService"]

function SessionsCtrl($scope, $state, SessionsService, ApiService, PopupService) {

  var vm = $scope;
  vm.user = {'email': 'mouyleng+3@instedd.org', 'password':'mouyleng123'};
  // vm.user = {'email': '', 'password':''};
  vm.login = login;
  vm.logout = logout;
  vm.logoutConfirmation = logoutConfirmation;

  function login(user) {
    vm.showSpinner('templates/loading/loading-login.html');
    SessionsService.login(user).then(function(authenticated) {
      vm.hideSpinner();
      $state.go("weeks-calendar");
    }, function(err) {
      vm.hideSpinner();
      PopupService.alertPopup("login_validation.sign_in_failed", "login_validation.invalid_email_or_password");
    });
  };

  function logout() {
    SessionsService.logout().then(function() {
      $state.go("login");
    }, function(err) {
      PopupService.alertPopup("global.sign_out_failed", "global.please_check_internet_connection");
    });
  };

  function logoutConfirmation() {
    PopupService.confirmPopup('global.sign_out', 'global.are_you_sure_you_want_to_sign_out', function(){
      logout();
    });
  }
}
