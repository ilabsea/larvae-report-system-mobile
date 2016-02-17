angular.module('app')
.controller('VillagesCtrl', VillagesCtrl)

VillagesCtrl.$inject = ["$scope", "$ionicHistory", "VillagesService",
    "SiteService", "$controller"]

function VillagesCtrl($scope, $ionicHistory, VillagesService, SiteService, $controller) {
  var vm = $scope;
  vm.backToWeeksCalendar = function(){
    $ionicHistory.goBack();
  }

  vm.villages = VillagesService.all();
  vm.uploadSites = function(){
    SiteService.uploadSites();
  }
}
