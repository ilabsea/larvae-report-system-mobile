angular.module('app')
.controller('SessionsCtrl', SessionsCtrl)

SessionsCtrl.$inject = ["$scope", "$state", "SessionsService", "ApiService",
      "PopupService", "$ionicPopup", "IonicClosePopupService", "SessionsOfflineService",
      "$ionicHistory"]

function SessionsCtrl($scope, $state, SessionsService, ApiService, PopupService,
              $ionicPopup, IonicClosePopupService, SessionsOfflineService,
              $ionicHistory) {

  var vm = $scope;
  // vm.user = {'email': 'sokha@yahoo.com', 'password':'Ks0kmesa!'};
  // vm.user = {'email': 'channesuy@instedd.org', 'password':'Ks0kmesa!'};
  vm.user = {'email': '', 'password':''};
  vm.login = login;
  vm.logout = logout;
  vm.popupAccount = popupAccount;

  function login(user) {
    isOnline() ? loginOnline(user) : loginOffline(user);
  };

  function loginOnline(user) {
    vm.showSpinner('templates/loading/loading-login.html');
    SessionsService.login(user).then(function(authenticated) {
      SessionsOfflineService.setCurrentUser(user, authenticated.user_id);
      SessionsOfflineService.getUserByEmail(user.email).then(function(userRes){
        SessionsOfflineService.insertOrUpdateUser(userRes);
        $ionicHistory.clearCache().then(function(res){
          vm.user.password = '';
          $state.go("weeks-calendar");
          vm.hideSpinner();
        });
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
          SessionsService.setUserId(userRes.item(0).user_id);
          SessionsService.setUserEmail(userRes.item(0).email);
          $ionicHistory.clearCache().then(function(res){
            vm.user.password = '';
            $state.go("weeks-calendar");
          });
        }else {
          PopupService.alertPopup("login_validation.sign_in_failed", "login_validation.invalid_email_or_password");
        }
      }else{
        PopupService.alertPopup("login_validation.sign_in_failed", "login.no_email_found_in_database");
      }
    });
  }

  function logout() {
    isOnline() ? logoutOnline() : logoutOffline();
  };

  function logoutOnline() {
    SessionsService.logout().then(function() {
      popupAccount.close();
      SessionsService.removeUserEmail();
      SessionsService.removeAuthToken();
      SessionsService.removeUserId();
      $state.go("login");
    }, function(err) {
      PopupService.alertPopup("global.sign_out_failed", "global.please_check_internet_connection");
    });
  }

  function logoutOffline() {
    SessionsOfflineService.logout();
    popupAccount.close();
    $state.go("login");
  }

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
