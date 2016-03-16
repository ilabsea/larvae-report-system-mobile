angular.module('app')
.controller('WeeksCtrl', WeeksCtrl)

WeeksCtrl.$inject = ["$scope", "$state", "$filter", "SiteSQLiteService", "WeeksService"]

function WeeksCtrl($scope, $state, $filter, SiteSQLiteService, WeeksService){
  var vm = $scope, index = 1;
  var todayWeek = $filter('date')(new Date(), 'w');
  var todayYear = $filter('date')(new Date(), 'yyyy');
  vm.selectedYear = todayYear;
  vm.isDisabledPreviousButton = true;
  vm.isDisabledNextButton = false;
  vm.weeks = WeeksService.getWeeks(vm.selectedYear, index);;
  vm.next = goNext;
  vm.previous = goPrevious;
  vm.getWeekNumber = setWeekNumber;
  vm.weeksMissingSend = [];
  vm.isErrorOrCurrentWeekNumber = isErrorOrCurrentWeekNumber;
  vm.years = setYears();

  vm.setWeeks = function() {
    WeeksService.setSelectedYear(vm.selectedYear);
    vm.weeks = WeeksService.getWeeks(vm.selectedYear, index);
  }

  function setYears() {
    var startYear = 2014;
    var years = [];
    var i = startYear
    for(; i <= todayYear ; i++){
      years.push(i);
    }
    return years;
  }

  function goPrevious(){
    index -= 9;
    vm.weeks = WeeksService.getWeeks(vm.selectedYear, index);
    vm.isDisabledPreviousButton = WeeksService.isDisabledPreviousButton();
    vm.isDisabledNextButton = WeeksService.isDisabledNextButton();
  }
  function goNext(){
    index += 9;
    vm.weeks = WeeksService.getWeeks(vm.selectedYear, index);
    vm.isDisabledNextButton = WeeksService.isDisabledNextButton();
    vm.isDisabledPreviousButton = WeeksService.isDisabledPreviousButton();
  }

  function setWeekNumber(weekNumber) {
    WeeksService.setSelectedWeek(weekNumber);
    $state.go('places')
  }

  function setWeeksMissingSend(){
    SiteSQLiteService.getWeeksMissingSend().then(function(weeks){
      vm.weeksMissingSend = weeks;
    })
  }

  function isErrorOrCurrentWeekNumber(weekNumber){
    var weeksMissingSend =  vm.weeksMissingSend;
    var highlightClass = '';
    var i = 0,
        l =  weeksMissingSend.length
    for(; i < l ; i++){
      if(isMissingUploadSites(weeksMissingSend[i], weekNumber)){
        highlightClass = 'week-calendar-error';
        break;
      }
      if(isAdvancedCurrentWeekSites(weeksMissingSend[i], weekNumber)){
        highlightClass = 'week-calendar-advanced';
        break;
      }
    }
    if(isCurrentWeek(weekNumber))
      highlightClass = 'calendar-current-week';
    return highlightClass;
  };

  function isCurrentWeek(week) {
    if(vm.selectedYear == todayYear && week == todayWeek){
      return true;
    }
    return false;
  }

  function isAdvancedCurrentWeekSites(weeksMissingSend, weekNumber) {
    var isAdvanced = false;
    if(vm.selectedYear == weeksMissingSend.year){
      if(weeksMissingSend.week_number == weekNumber){
        if(weeksMissingSend.year >= todayYear){
          isAdvanced = true;
        }
      }
    }
    return  isAdvanced;
  }

  function isMissingUploadSites(weeksMissingSend, weekNumber) {
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
    WeeksService.setSelectedYear(year);
  }

  $scope.$on('$stateChangeSuccess', function(event, toState) {
    if (toState.url== "/weeks-calendar") {
      setSelectedYear(vm.selectedYear);
      setWeeksMissingSend();
    }
  });
}
