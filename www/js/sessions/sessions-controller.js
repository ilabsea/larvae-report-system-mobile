angular.module('app')
.controller('SessionsCtrl', SessionsCtrl)

SessionsCtrl.$inject = ["$scope", "$state", "SessionsService", "ApiService",
      "PopupService", "$ionicPopup", "IonicClosePopupService", "SessionsOfflineService",
      "$ionicHistory"]

function SessionsCtrl($scope, $state, SessionsService, ApiService, PopupService,
              $ionicPopup, IonicClosePopupService, SessionsOfflineService,
              $ionicHistory) {

  var vm = $scope;
  // vm.user = {'email': 'mouyleng+3@instedd.org', 'password':'mouyleng123'};
  vm.user = {'email': 'sokha@yahoo.com', 'password':'Ks0kmesa!'};
  // vm.user = {'email': '', 'password':''};
  vm.login = login;
  vm.logout = logout;
  vm.popupAccount = popupAccount;

  function login(user) {
    isOnline() ? loginOnline(user) : loginOffline(user);
  };

  function loginOnline(user) {
    vm.showSpinner('templates/loading/loading-login.html');
    SessionsService.login(user).then(function(authenticated) {
      vm.hideSpinner();
      SessionsOfflineService.setCurrentUser(user, authenticated.user_id);
      SessionsOfflineService.getUserByEmail(user.email).then(function(userRes){
        SessionsOfflineService.insertOrUpdateUser(userRes);
      });
      $ionicHistory.clearCache().then(function(res){
        vm.user.password = '';
        return $state.go("weeks-calendar");
      });
    }, function() {
      vm.hideSpinner();
      PopupService.alertPopup("login_validation.sign_in_failed", "login_validation.invalid_email_or_password");
    });
  }

  function loginOffline(user) {
    SessionsOfflineService.getUserByEmail(user.email).then(function(userRes){
      if(userRes.length > 0){
        if(userRes.item(0).password === user.password){
          $ionicHistory.clearCache().then(function(res){
            vm.user.password = '';
            return $state.go("weeks-calendar");
          });
        }else {
          PopupService.alertPopup("login_validation.sign_in_failed", "login_validation.invalid_email_or_password");
        }
      }else{
        PopupService.alertPopup("login_validation.sign_in_failed", "login_validation.no_email_found_in_database");
      }
    });
  }

  function logout() {
    SessionsService.logout().then(function() {
      popupAccount.close();
      SessionsService.removeUserEmail();
      SessionsService.removeAuthToken();
      SessionsService.removeUserId();
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
              + SessionsService.getUserEmail() + '</div>'
    });

    IonicClosePopupService.register(popupAccount);
  }
}
