angular.module('app')
.factory('SwitchTabHelper', SwitchTabHelper)
SwitchTabHelper.$inject = ["$timeout", "$ionicTabsDelegate"]

function SwitchTabHelper($timeout, $ionicTabsDelegate) {

  function goNext() {
    $timeout(function () {
      var selected = $ionicTabsDelegate.selectedIndex();
      $ionicTabsDelegate.select(selected + 1);
    }, 30);
  }

  function goForward() {
    var selected = $ionicTabsDelegate.selectedIndex();
    if (selected != -1) {
      $ionicTabsDelegate.select(selected + 1);
    }
  }

  function goPrevious() {
    var selected = $ionicTabsDelegate.selectedIndex();
    if (selected != -1 && selected != 0) {
      $ionicTabsDelegate.select(selected - 1);
    }
  }

  return {
    goNext: goNext,
    goForward: goForward,
    goPrevious: goPrevious
  }
}
