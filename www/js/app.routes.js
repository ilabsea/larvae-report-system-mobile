angular
.module('app')
.config(routes);

routes.$inject = ['$stateProvider', '$urlRouterProvider', '$compileProvider'];

function routes($stateProvider, $urlRouterProvider, $compileProvider) {
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'SessionsCtrl',
    resolve:{
      "firstStart": function(SessionsService, $location){
        console.log('SessionsService.getAuthToken : ', SessionsService.getAuthToken());
        if(SessionsService.getAuthToken()){
          $location.path('/weeks-calendar');
        }else{
          $location.path('/login');
        }
      }
    }
  })

  .state('weeks-calendar', {
    url: '/weeks-calendar',
    templateUrl: 'templates/weeks.html'
  })

  .state('places', {
    url: '/places',
    templateUrl: 'templates/places.html',
    controller: 'PlacesCtrl'
  })

  .state('form-site', {
    url: '/form-site',
    templateUrl: 'templates/form-site.html',
    controller: 'FormSiteCtrl'
  })

  $urlRouterProvider.otherwise('/login')
}
