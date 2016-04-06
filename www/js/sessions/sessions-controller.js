angular.module('app')
.controller('SessionsCtrl', SessionsCtrl)

SessionsCtrl.$inject = ["$scope", "$state", "SessionsService",
        "ApiService", "PopupService", "$ionicPopup", "IonicClosePopupService"]

function SessionsCtrl($scope, $state, SessionsService, ApiService, PopupService,
              $ionicPopup, IonicClosePopupService) {

  var vm = $scope;
  vm.user = {'email': 'sokha@yahoo.com', 'password':'Ks0kmesa!'};
  // vm.user = {'email': '', 'password':''};
  vm.login = login;
  vm.logout = logout;
  vm.popupAccount = popupAccount;

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
      popupAccount.close();
      $state.go("login");
    }, function(err) {
      PopupService.alertPopup("global.sign_out_failed", "global.please_check_internet_connection");
    });
  };

  var popupAccount;

  function popupAccount() {
    popupAccount = $ionicPopup.show({
      templateUrl: 'templates/account.html',
      scope: vm,
      title: '<div class="tranparent-button icon-text-below"><i class="icon ion-custom-user-black"></i>'
              + vm.user.email + '</div>'
    });

    IonicClosePopupService.register(popupAccount);
  }
}
