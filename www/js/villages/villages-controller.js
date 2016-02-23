angular.module('app')
.controller('VillagesCtrl', VillagesCtrl)

VillagesCtrl.$inject = ["$scope", "$ionicHistory", "WeeklyService",
    "VillagesService", "SiteService", "$controller"]

function VillagesCtrl($scope, $ionicHistory, WeeklyService, VillagesService, SiteService) {
  var vm = $scope;
  vm.backToWeeksCalendar = goBack;
  vm.villages = VillagesService.all();
  vm.selectedYear = WeeklyService.getSelectedYear();
  vm.selectedWeek = WeeklyService.getSelectedWeek();
  vm.uploadSites = uploadSites;
  vm.setVillageId = setSelectedVillageId;

  function generateClassInVillages(villages){
    angular.forEach(villages, function(village){
      SiteService.getSiteByVillageIdInWeekYear(village.id).then(function(site){
        village.class = site.length > 0 ? 'village-has-data' : '';
      })
    });
    return villages;
  }

  function goBack(){
    $ionicHistory.goBack();
  }

  function uploadSites(){
    SiteService.uploadSites();
  }

  function setSelectedVillageId(id) {
    VillagesService.setSelectedVillageId(id);
  }

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if (toState.url== "/villages") {
      vm.villages = generateClassInVillages(vm.villages);
    }
  });
}
