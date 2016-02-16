angular.module('app')

.controller('WeeksCalendarCtrl', function($scope, $state, $filter, SiteService, WeeklyService) {
  $scope.currentYear = $filter('date')(new Date(), "yyyy");
  $scope.index = 1;
  $scope.isDisabledPreviousButton = true;
  $scope.isDisabledNextButton = false;
  $scope.hasError = "has-errors";

  $scope.weeks = WeeklyService.getWeeks($scope.currentYear, $scope.index);


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
    WeeklyService.setSelectedWeek(weekNumber);
    $state.go('villages')
  }

  $scope.weeksMissingSendArray = [];
  SiteService.getWeeksMissingSend().then(function(weeks){
    $scope.weeksMissingSendArray = weeks;
  })

  $scope.isErrorWeek = function(weekNumber){
    var weeksMissingSend =  $scope.weeksMissingSendArray;
    var isError = '';
    for(var i = 0; i<weeksMissingSend.length ; i++){
      if(weeksMissingSend[i].week_number == weekNumber){
        var todayWeek = $filter('date')(new Date(), 'w');
        if(weekNumber < todayWeek ){
          isError = 'week-calendar-error';
          break;
        }
      }
    }
    return isError;
  };
})
