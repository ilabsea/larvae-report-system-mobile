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
    setLanguge();
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

function setLanguge() {
  if(typeof navigator.globalization !== "undefined") {
    navigator.globalization.getPreferredLanguage(function(language) {
      console.log('language : ', language);
      $translate.use((language.value).split("-")[0]).then(function(data) {
        console.log("SUCCESS -> " + data);
      }, function(error) {
        console.log("ERROR -> " + error);
      });
    }, null);
  }
}
