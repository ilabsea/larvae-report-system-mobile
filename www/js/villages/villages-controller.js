angular.module('app')
.controller('VillagesCtrl', VillagesCtrl)

VillagesCtrl.$inject = ["$scope", "$ionicHistory", "VillagesService",
    "SiteService"]

function VillagesCtrl($scope, $ionicHistory, VillagesService, SiteService) {
  var vm = $scope;
  vm.backToWeeksCalendar = function(){
    $ionicHistory.goBack();
  }

  vm.villages = VillagesService.all();
  vm.uploadSites = function(){
    SiteService.uploadSites();
  }
}
