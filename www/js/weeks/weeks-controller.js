angular.module('app')
.controller('WeeksCalendarCtrl', WeeksCalendarCtrl)

WeeksCalendarCtrl.$inject = ["$scope", "$state", "$filter", "SiteService", "WeeklyService"]

function WeeksCalendarCtrl($scope, $state, $filter, SiteService, WeeklyService){
  var vm = $scope, index = 1;
  vm.currentYear = $filter('date')(new Date(), "yyyy");
  vm.isDisabledPreviousButton = true;
  vm.isDisabledNextButton = false;
  vm.weeks = WeeklyService.getWeeks(vm.currentYear, index);
  vm.next = goNext;
  vm.previous = goPrevious;
  vm.getWeekNumber = setWeekNumber;
  vm.weeksMissingSend = [];
  vm.isErrorWeekNumber = isErrorWeekNumber;
  setWeeksMissingSend();

  function goPrevious(){
    index -= 9;
    vm.weeks = WeeklyService.getWeeks("2016", index);
    vm.isDisabledPreviousButton = WeeklyService.isDisabledPreviousButton();
    vm.isDisabledNextButton = WeeklyService.isDisabledNextButton();
  }
  function goNext(){
    index += 9;
    vm.weeks = WeeklyService.getWeeks("2016", index);
    vm.isDisabledNextButton = WeeklyService.isDisabledNextButton();
    vm.isDisabledPreviousButton = WeeklyService.isDisabledPreviousButton();
  }

  function setWeekNumber(weekNumber) {
    WeeklyService.setSelectedWeek(weekNumber);
    $state.go('villages')
  }

  function setWeeksMissingSend(){
    SiteService.getWeeksMissingSend().then(function(weeks){
      vm.weeksMissingSend = weeks;
    })
  }

  function isErrorWeekNumber(weekNumber){
    var weeksMissingSend =  vm.weeksMissingSend;
    var isError = '';
    for(var i = 0; i < weeksMissingSend.length ; i++){
      if(isMissingUploadSites(weeksMissingSend[i], weekNumber)){
        isError = 'week-calendar-error';
        break;
      }
    }
    return isError;
  };

  function isMissingUploadSites(weeksMissingSend, weekNumber) {
    var todayWeek = $filter('date')(new Date(), 'w');
    return weeksMissingSend.week_number == weekNumber && weekNumber < todayWeek;
  }
}
