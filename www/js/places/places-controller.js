angular.module('app')
.controller('PlacesCtrl', PlacesCtrl)

PlacesCtrl.$inject = ["$scope", "WeeksService", "$ionicPopup",
      "$state", "PlacesService", "SiteSQLiteService", "ApiService"]

function PlacesCtrl($scope, WeeksService, $ionicPopup, $state,
    PlacesService, SiteSQLiteService, ApiService) {

  var vm = $scope;
  vm.getPlaces = getPlaces;
  vm.selectedYear = WeeksService.getSelectedYear();
  vm.selectedWeek = WeeksService.getSelectedWeek();
  vm.uploadSites = uploadSites;
  vm.setPlace = setSelectedPlace;
  vm.numberOfSites = 0;

  function setNumberOfSitesInWeekYear() {
    SiteSQLiteService.getNumberOfSitesInWeekYear().then(function(l){
      vm.numberOfSites = l.number_sites;
    })
  }

  function getPlaces() {
    vm.showSpinner('templates/loading/loading.html');
    PlacesService.fetch().then(function (places) {
      vm.hideSpinner();
      vm.places = generateClassInPlaces(places);
    });
  }

  function generateClassInPlaces(places){
    angular.forEach(places, function(place){
      SiteSQLiteService.getSiteByPlaceIdInWeekYear(place.id).then(function(site){
        place.hasData = site.length > 0 ;
      })
    });
    return places;
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
        vm.showSpinner('templates/loading/loading.html');
        SiteSQLiteService.uploadSites(vm.selectedWeek, vm.selectedYear);
      }
    });
  }

  function setSelectedPlace(place) {
    PlacesService.setSelectedPlaceId(place.id);
    PlacesService.setSelectedPlace(place);
  }

  $scope.$on('$stateChangeSuccess', function(event, toState) {
    if (toState.url== "/places") {
      vm.places = generateClassInPlaces(vm.places);
      setNumberOfSitesInWeekYear();
    }
  });
}
