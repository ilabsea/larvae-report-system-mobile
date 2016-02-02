angular.module('app')

.service('WeeklyService', function($filter) {
  isDisabledNextButton = false;
  isDisabledPreviousButton = false;

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
    firstWeek = ''; endWeek = '';

    day = $filter('date')(new Date('Jan 01, ' + year), "EEE");
    endDay = $filter('date')(new Date('Dec 31, '+ year), "EEE");

    if(day == 'Fri')
      firstWeek = $filter('date')(new Date('Jan 03, ' + year), 'ww');
    else if (day == 'Sat')
      firstWeek = $filter('date')(new Date('Jan 02, ' + year), 'ww');
    else
      firstWeek = $filter('date')(new Date('Jan 01, ' + year), 'ww');

    switch (endDay) {
      case 'Sun':
        endWeek = $filter('date')(new Date('Dec 30, '+ year), 'ww');
        break;
      case 'Mon':
        endWeek = $filter('date')(new Date('Dec 29, ' + year), 'ww');
        break;
      case 'Tue':
        endWeek = $filter('date')(new Date('Dec 28, ' + year), 'ww');
        break;
      case 'Wed':
        endWeek = $filter('date')(new Date('Dec 27, ' + year), 'ww');
        break;
      default:
        endWeek = $filter('date')(new Date('Dec 31, ' + year), 'ww');
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
        if(j<= 52)
          row.push(j);
        else
          break;
        if(j>=52)
          setDisabledNextButton(true);
        else
          setDisabledNextButton(false);
      }
      i += 3;
      weeks.push({"row": row});
    }
    return weeks;
  }

  return {
    getWeeks: getWeeks,
    isDisabledNextButton: getDisabledNextButton,
    isDisabledPreviousButton: getDisabledPreviousButton,
  }
})
