angular.module('app')
.controller('VillagesCtrl', VillagesCtrl)

VillagesCtrl.$inject = ["$scope", "$ionicHistory", "WeeklyService",
    "VillagesService", "SiteService", "$controller"]

function VillagesCtrl($scope, $ionicHistory, WeeklyService, VillagesService, SiteService) {
  var vm = $scope;
  vm.backToWeeksCalendar = goBack;
  vm.villages = getVillages();
  vm.selectedYear = WeeklyService.getSelectedYear();
  vm.selectedWeek = WeeklyService.getSelectedWeek();
  vm.uploadSites = uploadSites;
  vm.setVillageId = setSelectedVillageId;

  function getVillages(){
    villages = VillagesService.all();
    return generateClassInVillages(villages);
  }

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

  function isVillageHasData(id){
    SiteService.getSiteByVillageId(id).then(function(siteData){
      console.log('siteData : ', siteData);
      if(siteData){
        return true;
      }
    })
  }
}
