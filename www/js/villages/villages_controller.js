angular.module('app')

.controller('VillagesCtrl', function ($scope, $ionicHistory) {
  $scope.backToWeeksCalendar = function(){
    $ionicHistory.goBack();
  }
})
