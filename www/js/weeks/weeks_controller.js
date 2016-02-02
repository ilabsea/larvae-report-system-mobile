angular.module('app')

.controller('WeeksCalendarCtrl', function($scope, $state, $filter, WeeklyService) {
  $scope.currentYear = $filter('date')(new Date(), "yyyy");
  $scope.index = 1;
  $scope.weeks = WeeklyService.getWeeks($scope.currentYear, $scope.index);
  $scope.isDisabledPreviousButton = true;
  $scope.isDisabledNextButton = false;
  $scope.selectedWeek = '';

  $scope.next = function(){
    $scope.index += 9;
    $scope.weeks = WeeklyService.getWeeks("2016", $scope.index);
    $scope.isDisabledNextButton = WeeklyService.isDisabledNextButton();
    $scope.isDisabledPreviousButton = WeeklyService.isDisabledPreviousButton();
  }

  $scope.previous = function () {
    $scope.index -= 9;
    $scope.weeks = WeeklyService.getWeeks("2016", $scope.index);
    $scope.isDisabledPreviousButton = WeeklyService.isDisabledPreviousButton();
    $scope.isDisabledNextButton = WeeklyService.isDisabledNextButton();
  }

  $scope.getWeekNumber = function (weekNumber) {
    todayWeek = $filter('date')(new Date(), 'ww');
    $scope.selectedWeek = weekNumber;
    console.log("selectedWeek : ", $scope.selectedWeek);
    $state.go('villages')
  }
})
