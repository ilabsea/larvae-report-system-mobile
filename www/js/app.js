angular.module('app', ['ionic', 'pascalprecht.translate', 'base64'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
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
  });
})

.config(function ($stateProvider, $urlRouterProvider, $translateProvider, $compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
  $translateProvider.translations('en', {
    email: "Email",
    password: "Password"
  });
  $translateProvider.translations('lao', {
    email: "ອີເມວ",
    password: "ລະຫັດຜ່ານ"
  });
  $translateProvider.preferredLanguage("en");
  $translateProvider.fallbackLanguage("lao");

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'SessionsCtrl'
  })

  .state('weeks-calendar', {
    url: '/weeks-calendar',
    templateUrl: 'templates/weeks_calendar.html',
    controller: 'WeeksCalendarCtrl'
  })

  $urlRouterProvider.otherwise('/weeks-calendar')
})
