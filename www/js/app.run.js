angular
.module('app')
.run(runBlock);

runBlock.$inject = ['$ionicPlatform', '$cordovaSQLite', '$rootScope', '$ionicLoading'];

function runBlock($ionicPlatform, $cordovaSQLite, $rootScope, $ionicLoading) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
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
}
