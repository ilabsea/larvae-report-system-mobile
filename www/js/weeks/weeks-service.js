angular.module('app')
.factory('WeeklyService', WeeklyService)

WeeklyService.$inject = ["$filter"];

function WeeklyService($filter) {
  isDisabledNextButton = false;
  isDisabledPreviousButton = false;
  selectedWeekNumber = '';
  selectedYear = '';

  function setDisabledNextButton(isDisabled) {
    isDisabledNextButton = isDisabled;
  }

  function getDisabledNextButton() {
    return isDisabledNextButton;
  }

  function setDisabledPreviousButton(isDisabled) {
    isDisabledPreviousButton = isDisabled;
  }

  function getDisabledPreviousButton() {
    return isDisabledPreviousButton;
  }

  //Sunday is the first day of the week and Week 01 is the week with the first Thursday of the year
  function getWeeks(year, index){
    lastWeekOfYear = '';
    lastDayOfYear = $filter('date')(new Date('Dec 31, '+ year), "EEE");

    switch (lastDayOfYear) {
      case 'Sun':
        lastWeekOfYear = $filter('date')(new Date('Dec 30, '+ year), 'ww');
        break;
      case 'Mon':
        lastWeekOfYear = $filter('date')(new Date('Dec 29, ' + year), 'ww');
        break;
      case 'Tue':
        lastWeekOfYear = $filter('date')(new Date('Dec 28, ' + year), 'ww');
        break;
      case 'Wed':
        lastWeekOfYear = $filter('date')(new Date('Dec 27, ' + year), 'ww');
        break;
      default:
        lastWeekOfYear = $filter('date')(new Date('Dec 31, ' + year), 'ww');
        break;
    }
    if(index == 1)
      setDisabledPreviousButton(true);
    else
      setDisabledPreviousButton(false);
    i = index;
    weeks = [];
    while(i < index + 9){
      row = [];
      for (j = i; j < i + 3 ; j++){
        if(j<= lastWeekOfYear)
          row.push(j);
        else
          break;
        if(j>=lastWeekOfYear)
          setDisabledNextButton(true);
        else
          setDisabledNextButton(false);
      }
      i += 3;
      weeks.push({"row": row});
    }
    return weeks;
  }

  function setSelectedWeek(weekNumber) {
    selectedWeek = weekNumber;
  }

  function getSelectedWeek() {
    return selectedWeek;
  }

  function setSelectedYear(year) {
    selectedYear = year;
  }

  function getSelectedYear() {
    return selectedYear;
  }

  return {
    getWeeks: getWeeks,
    isDisabledNextButton: getDisabledNextButton,
    isDisabledPreviousButton: getDisabledPreviousButton,
    setSelectedWeek: setSelectedWeek,
    getSelectedWeek: getSelectedWeek,
    getSelectedYear: getSelectedYear,
    setSelectedYear: setSelectedYear
  }

}
