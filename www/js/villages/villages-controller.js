angular.module('app')

.controller('VillagesCtrl', function ($scope, $ionicHistory, VillagesService) {
  $scope.backToWeeksCalendar = function(){
    $ionicHistory.goBack();
  }

  $scope.villages = VillagesService.all();
})
