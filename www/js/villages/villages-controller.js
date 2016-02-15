angular.module('app')

.controller('VillagesCtrl', function ($scope, $ionicHistory, VillagesService,
    SiteService) {
  $scope.backToWeeksCalendar = function(){
    $ionicHistory.goBack();
  }

  $scope.villages = VillagesService.all();
  $scope.uploadSites = function(){
    SiteService.uploadSites();
  }
})
