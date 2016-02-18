angular.module('app')
.controller('WeeksCalendarCtrl', WeeksCalendarCtrl)

WeeksCalendarCtrl.$inject = ["$scope", "$state", "$filter", "SiteService", "WeeklyService"]

function WeeksCalendarCtrl($scope, $state, $filter, SiteService, WeeklyService){
  var vm = $scope, index = 1;
  currentYear = $filter('date')(new Date(), "yyyy");
  vm.selectedYear = currentYear;
  vm.isDisabledPreviousButton = true;
  vm.isDisabledNextButton = false;
  vm.weeks = WeeklyService.getWeeks(vm.selectedYear, index);;
  vm.next = goNext;
  vm.previous = goPrevious;
  vm.getWeekNumber = setWeekNumber;
  vm.weeksMissingSend = [];
  vm.isErrorWeekNumber = isErrorWeekNumber;
  vm.years = setYears();

  vm.setWeeks = function() {
    WeeklyService.setSelectedYear(vm.selectedYear);
    vm.weeks = WeeklyService.getWeeks(vm.selectedYear, index);
  }

  function setYears() {
    var startYear = 2014;
    var currentYear = $filter('date')(new Date(), "yyyy");
    var years = [];
    for(var i= startYear ; i <= currentYear ; i++){
      years.push(i);
    }
    return years;
  }

  function goPrevious(){
    index -= 9;
    vm.weeks = WeeklyService.getWeeks(vm.selectedYear, index);
    vm.isDisabledPreviousButton = WeeklyService.isDisabledPreviousButton();
    vm.isDisabledNextButton = WeeklyService.isDisabledNextButton();
  }
  function goNext(){
    index += 9;
    vm.weeks = WeeklyService.getWeeks(vm.selectedYear, index);
    vm.isDisabledNextButton = WeeklyService.isDisabledNextButton();
    vm.isDisabledPreviousButton = WeeklyService.isDisabledPreviousButton();
  }

  function setWeekNumber(weekNumber) {
    WeeklyService.setSelectedWeek(weekNumber);
    $state.go('villages')
  }

  function setWeeksMissingSend(){
    SiteService.getWeeksMissingSend().then(function(weeks){
      console.log('weeksMissingSend : ', weeks);
      vm.weeksMissingSend = weeks;
    })
  }

  function isErrorWeekNumber(weekNumber){
    var weeksMissingSend =  vm.weeksMissingSend;
    var isError = '';
    console.log('weeksMissingSend : ', weeksMissingSend);
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
    var todayYear = $filter('date')(new Date(), 'yyyy');
    var isMissing = false;
    if(vm.selectedYear == weeksMissingSend.year){
      if(weeksMissingSend.week_number == weekNumber){
        if(weeksMissingSend.year < todayYear){
          isMissing = true;
        }else{
          if(weekNumber < todayWeek){
            isMissing = true;
          }
        }
      }
    }
    return  isMissing;
  }

  function setSelectedYear(year){
    WeeklyService.setSelectedYear(year);
  }

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if (toState.url== "/weeks-calendar") {
      setSelectedYear(vm.selectedYear);
      setWeeksMissingSend();
    }
  });
}
