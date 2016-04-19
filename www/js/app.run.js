angular
.module('app')
.run(runBlock);

runBlock.$inject = ['$ionicPlatform', '$cordovaSQLite', '$rootScope', '$ionicLoading',
              '$location', '$ionicHistory', 'SessionsService'];

function runBlock($ionicPlatform, $cordovaSQLite, $rootScope, $ionicLoading,
          $location, $ionicHistory, SessionsService) {

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    createTables($cordovaSQLite);

    $rootScope.showSpinner = function(templateUrl) {
      $ionicLoading.show({
        templateUrl: templateUrl,
        noBackdrop: true,
        hideOnStateChange: true
      });
    }

    $rootScope.hideSpinner = function() {
      $ionicLoading.hide();
    }
  });

  $ionicPlatform.registerBackButtonAction(function() {
    if ($location.path() === "/weeks-calendar" || $location.path() === "/login") {
      navigator.app.exitApp();
    }
    else {
      $ionicHistory.goBack();
    }
  }, 100);
}
