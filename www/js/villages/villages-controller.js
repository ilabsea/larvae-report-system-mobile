angular.module('app')
.controller('VillagesCtrl', VillagesCtrl)

VillagesCtrl.$inject = ["$scope", "$ionicHistory", "WeeklyService", "$ionicPopup",
      "$state", "VillagesService", "SiteService", "$controller"]

function VillagesCtrl($scope, $ionicHistory, WeeklyService, $ionicPopup, $state,
    VillagesService, SiteService) {
  var vm = $scope;
  vm.backToWeeksCalendar = goBack;
  vm.getVillages = getVillages;
  vm.selectedYear = WeeklyService.getSelectedYear();
  vm.selectedWeek = WeeklyService.getSelectedWeek();
  vm.uploadSites = uploadSites;
  vm.setVillage = setSelectedVillage;
  vm.numberOfSites = 0;

  function setNumberOfSitesInWeekYear() {
    SiteService.getNumberOfSitesInWeekYear().then(function(l){
      vm.numberOfSites = l.number_sites;
    })
  }

  function getVillages() {
    vm.showSpinner('templates/partials/loading.html');
    VillagesService.getVillages().then(function (villages) {
      vm.hideSpinner();
      vm.villages = generateClassInVillages(villages);
    });
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
    var confirmPopup = $ionicPopup.confirm({
      title: 'Upload Sites to malaria station',
      template: 'Are you sure to send all reports to malaria station with total of '
                  + vm.numberOfSites + ' villages?',
      cssClass: 'custom-class',
      cancelText: 'No',
      okText: 'Yes',
      okType: 'default-button'
    });
    confirmPopup.then(function (res) {
      if(res){
        vm.showSpinner('templates/partials/loading.html');
        SiteService.uploadSites(vm.selectedWeek, vm.selectedYear);
      }
    });
  }

  function setSelectedVillage(village) {
    VillagesService.setSelectedVillageId(village.id);
    VillagesService.setSelectedVillageName(village.name);
    VillagesService.setSelectedVillage(village);
  }

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if (toState.url== "/villages") {
      vm.villages = generateClassInVillages(vm.villages);
      setNumberOfSitesInWeekYear();
    }
  });
}
