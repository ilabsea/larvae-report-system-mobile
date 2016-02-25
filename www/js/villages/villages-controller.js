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
  vm.numberOfSites = 0;

  function setNumberOfSitesInWeekYear() {
    SiteService.getNumberOfSitesInWeekYear().then(function(l){
      vm.numberOfSites = l.number_sites;
    })
  }

  function generateClassInVillages(villages){
    angular.forEach(villages, function(village){
      SiteService.getSiteByVillageIdInWeekYear(village.id).then(function(site){
        village.hasData = site.length > 0 ;
      })
    });
    return villages;
  }

  function goBack(){
    $ionicHistory.goBack();
  }

  function uploadSites(){
    SiteService.uploadSites(vm.selectedWeek, vm.selectedYear);
  }

  function setSelectedVillageId(id) {
    VillagesService.setSelectedVillageId(id);
  }

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if (toState.url== "/villages") {
      vm.villages = generateClassInVillages(vm.villages);
      setNumberOfSitesInWeekYear();
    }
  });
}
